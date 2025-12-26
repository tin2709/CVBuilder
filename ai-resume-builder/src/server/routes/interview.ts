import { OpenAPIHono } from '@hono/zod-openapi';
import { prisma } from '@/lib/db';
import { verifyRole } from '@/middlewares/auth.middleware';
import * as doc from '@/schemas/api-doc';

type Variables = { jwtPayload: { id: string; role: string } }
const interviewRoute = new OpenAPIHono<{ Variables: Variables }>();

// Chỉ Nhà tuyển dụng mới được quản lý phỏng vấn
interviewRoute.use('/create', verifyRole('RECRUITER')); // Chỉ áp dụng cho POST nộp đơn

// [API: TẠO LỊCH]
interviewRoute.openapi(doc.createInterviewDoc, async (c) => {
  const payload = c.get('jwtPayload');
  const { applicationId, date, notes } = c.req.valid('json');

  try {
    // Kiểm tra xem đơn ứng tuyển có thuộc về công ty của Recruiter này không
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { job: true }
    });

    if (!application || application.job.recruiterId !== payload.id) {
      return c.json({ success: false, message: "Không có quyền tạo lịch cho đơn này" }, 403);
    }

    await prisma.interview.create({
      data: {
        applicationId,
        date: new Date(date),
        notes,
      }
    });

    // Cập nhật trạng thái đơn ứng tuyển sang 'INTERVIEW'
    await prisma.application.update({
      where: { id: applicationId },
      data: { status: 'INTERVIEW' }
    });

    return c.json({ success: true, message: "Đã lên lịch phỏng vấn" }, 201);
  } catch (error: any) {
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
  return c.json({ success: true, message: "Đã xóa buổi phỏng vấn" });
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

    return c.json({ 
      success: true, 
      message: `Đã xóa thành công ${deleteResult.count} mục` 
    });
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 400);
  }
});

export default interviewRoute;