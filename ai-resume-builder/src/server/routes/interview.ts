import { OpenAPIHono } from '@hono/zod-openapi';
import { prisma } from '@/lib/db';
import { verifyRole } from '@/middlewares/auth.middleware';
import * as doc from '@/schemas/api-doc';
import { addInterviewReminder, reminderQueue, addMailJob } from '@/queues/reminder.queue';
import { triggerStatsUpdate } from '@/queues/stats.queue';

type Variables = { jwtPayload: { id: string; role: string } }
const interviewRoute = new OpenAPIHono<{ Variables: Variables }>();

// Chỉ Nhà tuyển dụng mới được quản lý phỏng vấn
interviewRoute.use('/create', verifyRole('RECRUITER')); // Chỉ áp dụng cho POST nộp đơn

// [API: TẠO LỊCH]

interviewRoute.openapi(doc.createInterviewDoc, async (c) => {
  const payload = c.get('jwtPayload');
  const { applicationId, date, notes } = c.req.valid('json');
  const recruiterId = payload.id;
  const interviewDate = new Date(date);

  try {
    // 1. Kiểm tra thời gian hợp lệ (Không được đặt lịch trong quá khứ)
    if (interviewDate.getTime() < Date.now()) {
      return c.json({ success: false, message: "Không thể đặt lịch phỏng vấn trong quá khứ." }, 400);
    }

    // 2. Lấy thông tin chi tiết đơn ứng tuyển và Job
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { 
        job: { select: { id: true, recruiterId: true, companyId: true, title: true } },
        candidate: {
          include: { user: { select: { email: true, name: true } } }
        }
      }
    });

    if (!application) {
      return c.json({ success: false, message: "Không tìm thấy đơn ứng tuyển." }, 404);
    }

    // 3. Kiểm tra quyền sở hữu
    if (application.job.recruiterId !== recruiterId) {
      return c.json({ success: false, message: "Bạn không có quyền tạo lịch cho đơn ứng tuyển này." }, 403);
    }

    // 4. LOGIC DYNAMIC PROPERTIES: Kiểm tra trùng lịch nội bộ (Chống Overbooking)
    const duplicateSchedule = await prisma.interview.findFirst({
      where: {
        application: {
          job: { recruiterId: recruiterId } // Chỉ kiểm tra lịch của chính Nhà tuyển dụng này
        },
        date: interviewDate,
        status: { not: 'CANCELLED' } // Bỏ qua những lịch đã hủy
      }
    });

    if (duplicateSchedule) {
      return c.json({ 
        success: false, 
        message: `Bạn đã có một buổi phỏng vấn khác vào lúc ${interviewDate.toLocaleString('vi-VN')}. Vui lòng chọn khung giờ khác.` 
      }, 400);
    }

    // 5. Thực hiện tạo bản ghi phỏng vấn
    const newInterview = await prisma.interview.create({
      data: {
        applicationId,
        date: interviewDate,
        notes,
        status: 'PENDING'
      }
    });

    // 6. Cập nhật thống kê Dashboard (BullMQ)
    if (application.job.companyId) {
      await triggerStatsUpdate(application.job.companyId);
    }

    // 7. BULLMQ: Gửi Email mời phỏng vấn NGAY LẬP TỨC
    await addMailJob({
      to: application.candidate.user.email,
      subject: `[Mời phỏng vấn] Vị trí ${application.job.title}`,
      templateKey: 'INTERVIEW_INVITE',
      payload: {
        candidateName: application.candidate.user.name || "Ứng viên",
        jobTitle: application.job.title,
        interviewTime: interviewDate.toLocaleString('vi-VN'),
        notes: notes || "Không có ghi chú thêm"
      }
    });

    // 8. BULLMQ: Lên lịch nhắc nhở TRƯỚC 1 TIẾNG (Delayed Job)
    await addInterviewReminder(newInterview.id, interviewDate);

    // 9. Cập nhật trạng thái đơn ứng tuyển sang 'INTERVIEW'
    await prisma.application.update({
      where: { id: applicationId },
      data: { status: 'INTERVIEW' }
    });

    return c.json({ 
      success: true, 
      message: "Đã lên lịch, gửi mail mời và đặt nhắc nhở tự động thành công!" 
    }, 201);

  } catch (error: any) {
    console.error("❌ Lỗi tạo phỏng vấn:", error);
    return c.json({ success: false, message: "Lỗi hệ thống: " + error.message }, 500);
  }
});

// [API: CẬP NHẬT KẾT QUẢ/GHI CHÚ]
interviewRoute.use('/:id/status', verifyRole('RECRUITER')); // Chỉ áp dụng cho POST nộp đơn
interviewRoute.openapi(doc.updateInterviewDoc, async (c) => {
  const payload = c.get('jwtPayload');
  const { id } = c.req.valid('param');
  const body = c.req.valid('json');

  const interview = await prisma.interview.findUnique({
    where: { id },
    include: { application: { include: { job: true } } }
  });

  if (!interview) return c.json({ success: false, message: "Không tìm thấy" }, 404);
  if (interview.application.job.recruiterId !== payload.id) {
    return c.json({ success: false, message: "Không có quyền" }, 403);
  }

  const updated = await prisma.interview.update({
    where: { id },
    data: {
      ...body,
      date: body.date ? new Date(body.date) : undefined,
    }
  });
  if (body.date) {
    await addInterviewReminder(id, new Date(body.date));
  }

  return c.json({ success: true, data: updated });
});
// [API: LẤY DANH SÁCH + SEARCH + SORT + PHÂN TRANG]
interviewRoute.use('/all', verifyRole('RECRUITER')); // Chỉ áp dụng cho POST nộp đơn

interviewRoute.openapi(doc.getInterviewsDoc, async (c) => {
  const payload = c.get('jwtPayload');
  const { page, limit, search, sort, status } = c.req.valid('query');

  const skip = (page - 1) * limit;

  // Xây dựng điều kiện lọc (Where clause)
  const where: any = {
    application: {
      job: { recruiterId: payload.id } // Chỉ lấy phỏng vấn thuộc về Recruiter này
    }
  };

  if (status) where.status = status;
  if (search) {
    where.OR = [
      { application: { candidate: { user: { name: { contains: search, mode: 'insensitive' } } } } },
      { application: { job: { title: { contains: search, mode: 'insensitive' } } } }
    ];
  }

  // Thực hiện truy vấn đồng thời để lấy dữ liệu và tổng số bản ghi
  const [data, total] = await Promise.all([
    prisma.interview.findMany({
      where,
      include: {
        application: {
          include: {
            candidate: { include: { user: true } },
            job: true
          }
        }
      },
      orderBy: { date: sort as any },
      skip,
      take: limit,
    }),
    prisma.interview.count({ where })
  ]);

  return c.json({
    success: true,
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  });
});
interviewRoute.use('/available-slots', verifyRole('RECRUITER')); // Chỉ áp dụng cho POST nộp đơn
interviewRoute.openapi(doc.getAvailableSlotsDoc, async (c) => {
  const payload = c.get('jwtPayload');
  const { date } = c.req.valid('query'); // Giả sử bạn gửi "2025-01-13"

  // 1. Tạo khoảng thời gian bắt đầu và kết thúc ngày theo UTC
  const startOfDay = new Date(`${date}T00:00:00.000Z`);
  const endOfDay = new Date(`${date}T23:59:59.999Z`);

  // 2. Lấy các lịch đã đặt của Recruiter này trong ngày đó
  const existingInterviews = await prisma.interview.findMany({
    where: {
      application: { job: { recruiterId: payload.id } },
      date: { gte: startOfDay, lte: endOfDay },
      status: { not: 'CANCELLED' }
    },
    select: { date: true }
  });

  // 3. Danh sách các khung giờ bạn muốn hiển thị trên giao diện (theo UTC)
  // Hãy đảm bảo có số 7 (vì dữ liệu bạn là 7:00)
  const workHours = [7, 8, 9, 10, 11, 13, 14, 15, 16]; 
  
  const slots = workHours.map(hour => {
    // Logic: Nếu có bất kỳ lịch nào trong DB có giờ UTC khớp với 'hour' này
    const isTaken = existingInterviews.some(interview => {
      const dbHour = interview.date.getUTCHours();
      return dbHour === hour;
    });

    // Tạo chuỗi ISO chuẩn cho slot này
    const slotDate = new Date(`${date}T${hour.toString().padStart(2, '0')}:00:00.000Z`);

    return {
      time: `${hour.toString().padStart(2, '0')}:00 (UTC)`,
      isoString: slotDate.toISOString(),
      isAvailable: !isTaken // Trả về false nếu đã có lịch (isTaken = true)
    };
  });

  return c.json({ success: true, data: slots }, 200);
});
// [API: XÓA 1 BẢN GHI]
interviewRoute.use('/delete/:id', verifyRole('RECRUITER')); // Chỉ áp dụng cho POST nộp đơn
interviewRoute.openapi(doc.deleteInterviewDoc, async (c) => {
  const payload = c.get('jwtPayload');
  const { id } = c.req.valid('param');

  const interview = await prisma.interview.findUnique({
    where: { id },
    include: { application: { include: { job: true } } }
  });

  if (!interview) return c.json({ success: false, message: "Không tìm thấy" }, 404);
  if (interview.application.job.recruiterId !== payload.id) {
    return c.json({ success: false, message: "Không có quyền xóa" }, 403);
  }

  await prisma.interview.delete({ where: { id } });
  const job = await reminderQueue.getJob(`reminder-${id}`);
  if (job) await job.remove();
 if (interview.application.job.companyId) {
    await triggerStatsUpdate(interview.application.job.companyId);
  }
  return c.json({ success: true, message: "Đã xóa buổi phỏng vấn và lịch nhắc nhở" });

});

// [API: XÓA NHIỀU BẢN GHI]
interviewRoute.use('/bulk-delete', verifyRole('RECRUITER')); // Chỉ áp dụng cho POST nộp đơn
interviewRoute.openapi(doc.bulkDeleteInterviewsDoc, async (c) => {
  const payload = c.get('jwtPayload');
  const { ids } = c.req.valid('json');

  try {
    // Chỉ xóa những bản ghi thuộc về Nhà tuyển dụng này (Bảo mật tầng sâu)
    const deleteResult = await prisma.interview.deleteMany({
      where: {
        id: { in: ids },
        application: {
          job: { recruiterId: payload.id }
        }
      }
    });

     for (const id of ids) {
      const job = await reminderQueue.getJob(`reminder-${id}`);
      if (job) await job.remove();
    }

    return c.json({ success: true, message: `Đã xóa ${deleteResult.count} mục và các nhắc nhở liên quan` });
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 400);
  }
});

export default interviewRoute;