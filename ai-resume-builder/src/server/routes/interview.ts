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

  try {
    // 1. Kiểm tra quyền và lấy thông tin chi tiết (Email, Tên ứng viên, Tên job)
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { 
        job: true,
        candidate: {
          include: { user: { select: { email: true, name: true } } }
        }
      }
    });

    if (!application) {
      return c.json({ success: false, message: "Không tìm thấy đơn ứng tuyển" }, 404);
    }

    if (application.job.recruiterId !== payload.id) {
      return c.json({ success: false, message: "Không có quyền tạo lịch cho đơn này" }, 403);
    }

    // 2. Tạo bản ghi phỏng vấn trong Database
    const newInterview = await prisma.interview.create({
      data: {
        applicationId,
        date: new Date(date),
        notes,
        status: 'PENDING'
      }
    });
if (application.job.companyId) {
      await triggerStatsUpdate(application.job.companyId);
    }
    // 3. BULLMQ - Gửi Email mời phỏng vấn NGAY LẬP TỨC
    await addMailJob({
      to: application.candidate.user.email,
      subject: `[Mời phỏng vấn] Vị trí ${application.job.title}`,
      templateKey: 'INTERVIEW_INVITE',
      payload: {
        candidateName: application.candidate.user.name || "Ứng viên",
        jobTitle: application.job.title,
        interviewTime: new Date(date).toLocaleString('vi-VN'),
        notes: notes || "Không có ghi chú thêm"
      }
    });

    // 4. BULLMQ - Lên lịch nhắc nhở TRƯỚC 1 TIẾNG (Chạy ngầm với delay)
    await addInterviewReminder(newInterview.id, new Date(date));

    // 5. Cập nhật trạng thái đơn ứng tuyển sang 'INTERVIEW'
    await prisma.application.update({
      where: { id: applicationId },
      data: { status: 'INTERVIEW' }
    });

    return c.json({ 
      success: true, 
      message: "Đã lên lịch, gửi mail mời và đặt nhắc nhở tự động thành công!" 
    }, 201);

  } catch (error: any) {
    console.error("Lỗi tạo phỏng vấn:", error);
    return c.json({ success: false, message: error.message }, 400);
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