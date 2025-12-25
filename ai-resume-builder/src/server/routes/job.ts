import { OpenAPIHono } from '@hono/zod-openapi';
import { createJobDoc,updateJobDoc, deleteJobDoc,deleteManyJobsDoc,getMyJobsDoc } from '@/schemas/api-doc';
import { prisma } from '@/lib/db';
import { verifyRole } from '@/middlewares/auth.middleware';

// 1. Định nghĩa kiểu dữ liệu khớp với những gì Middleware lưu trữ
type Variables = {
  jwtPayload: {
    id: string;    // Giả sử trong JWT payload của bạn có trường 'id'
    role: string;
    email: string;
  }
}

const jobRoute = new OpenAPIHono<{ Variables: Variables }>();

// 2. Áp dụng middleware (Đảm bảo path khớp với route /create)
jobRoute.use('/create', verifyRole('RECRUITER'));
jobRoute.use('/update/:id', verifyRole('RECRUITER'));
jobRoute.use('/delete/:id', verifyRole('RECRUITER'));
jobRoute.openapi(createJobDoc, async (c) => {
  // 3. LẤY DỮ LIỆU TỪ 'jwtPayload'
  const payload = c.get('jwtPayload');

  // 4. Kiểm tra an toàn trước khi lấy id
  const recruiterId = payload?.id;

  if (!recruiterId) {
    return c.json({ 
      success: false, 
      message: 'Không tìm thấy thông tin định danh trong Token (thiếu id)' 
    }, 401);
  }

  const body = c.req.valid('json');

  try {
    const job = await prisma.job.create({
      data: {
        title: body.title,
        companyName: body.companyName,
        description: body.description,
        requirements: body.requirements,
        location: body.location,
        salaryRange: body.salaryRange,
        startDate: new Date(body.startDate),
        deadline: new Date(body.deadline),
        applyLink: body.applyLink,
        hotline: body.hotline,
        recruiterId: recruiterId, // Gán ID lấy từ Token vào đây
      },
    });

    // Tạo nội dung quảng cáo
    const marketingText = `
Mùa đông lạnh lẽo hão huyền
Lạnh! Ừ thì lạnh, nhưng ${body.companyName} vẫn chờ!
Chờ đợt TUYỂN DỤNG tháng ${new Date(body.deadline).getMonth() + 1}.
Cơ hội dành cho tất cả mọi ứng viên tại khu vực ${body.location}.
Thời gian dự kiến đi làm: ${new Date(body.startDate).toLocaleDateString('vi-VN')}.
Địa điểm: ${body.location}.

Mô tả công việc:
${body.description}

Yêu cầu: ${body.requirements}

Hạn nộp hồ sơ: ${new Date(body.deadline).toLocaleDateString('vi-VN')}.
Link đăng ký: ${body.applyLink}
Hotline: ${body.hotline}
    `.trim();

    return c.json({ success: true, data: job, marketingText }, 201);
  } catch (error: any) {
    console.error("Prisma Error:", error);
    return c.json({ success: false, message: error.message }, 400);
  }
});
jobRoute.openapi(updateJobDoc, async (c) => {
  const payload = c.get('jwtPayload');
  const { id } = c.req.valid('param');
  const body = c.req.valid('json');

  try {
    // 1. Tìm bài đăng và kiểm tra chủ sở hữu
    const existingJob = await prisma.job.findUnique({ where: { id } });
    
    if (!existingJob) return c.json({ success: false, message: "Không tìm thấy bài đăng" }, 404);
    if (existingJob.recruiterId !== payload.id) {
      return c.json({ success: false, message: "Bạn không có quyền sửa bài đăng của người khác" }, 403);
    }

    // 2. Cập nhật
    const updatedJob = await prisma.job.update({
      where: { id },
      data: {
        ...body,
        startDate: body.startDate ? new Date(body.startDate) : undefined,
        deadline: body.deadline ? new Date(body.deadline) : undefined,
      },
    });

    // 3. Tạo lại marketingText mới
    const marketingText = `(Nội dung đã cập nhật)\nLạnh! Nhưng ${updatedJob.companyName} vẫn chờ...\n...`; 

    return c.json({ success: true, data: updatedJob, marketingText }, 200);
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 400);
  }
});

// --- API XÓA BÀI ĐĂNG ---
jobRoute.openapi(deleteJobDoc, async (c) => {
  const payload = c.get('jwtPayload');
  const { id } = c.req.valid('param');

  try {
    const existingJob = await prisma.job.findUnique({ where: { id } });
    
    if (!existingJob) return c.json({ success: false, message: "Không tìm thấy bài đăng" }, 404);
    
    // Kiểm tra chủ sở hữu
    if (existingJob.recruiterId !== payload.id) {
      return c.json({ success: false, message: "Bạn không có quyền xóa bài này" }, 403);
    }

    await prisma.job.delete({ where: { id } });

    return c.json({ success: true, message: "Xóa bài đăng thành công" }, 200);
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 400);
  }
});
jobRoute.use('/bulk-delete', verifyRole('RECRUITER'));

jobRoute.openapi(deleteManyJobsDoc, async (c) => {
  const payload = c.get('jwtPayload');
  const recruiterId = payload?.id;
  if (!recruiterId) return c.json({ success: false, message: 'Chưa đăng nhập' }, 401);

  const { ids } = c.req.valid('json');

  try {
    // Prisma deleteMany cực kỳ mạnh mẽ:
    // Nó sẽ chỉ xóa những bài có ID nằm trong mảng VÀ thuộc về recruiterId này
    const result = await prisma.job.deleteMany({
      where: {
        id: { in: ids },
        recruiterId: recruiterId
      }
    });

    return c.json({
      success: true,
      count: result.count, // Trả về số lượng bản ghi thực tế đã bị xóa
      message: `Đã xóa thành công ${result.count} bài đăng`
    }, 200);
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 400);
  }
});
// src/server/routes/job.ts

// Thêm middleware bảo vệ đường dẫn /my-jobs
jobRoute.use('/my-jobs', verifyRole('RECRUITER'));

jobRoute.openapi(getMyJobsDoc, async (c) => {
  const payload = c.get('jwtPayload');
  const recruiterId = payload?.id;

  if (!recruiterId) return c.json({ success: false, message: 'Chưa đăng nhập' }, 401);

  try {
    // Tìm tất cả Job có recruiterId khớp với người đang đăng nhập
    const jobs = await prisma.job.findMany({
      where: {
        recruiterId: recruiterId
      },
      orderBy: {
        createdAt: 'desc' // Bài mới nhất hiện lên đầu
      },
      select: {
        id: true,
        title: true,
        companyName: true,
        location: true,
        status: true,
        createdAt: true,
        deadline: true,
      }
    });

    return c.json({
      success: true,
      count: jobs.length,
      data: jobs.map(j => ({
        ...j,
        createdAt: j.createdAt.toISOString(),
        deadline: j.deadline ? j.deadline.toISOString() : null,
      }))
    }, 200);
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 400);
  }
});
export default jobRoute;