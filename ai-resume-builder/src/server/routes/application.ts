import { OpenAPIHono } from '@hono/zod-openapi';
import { prisma } from '@/lib/db';
import { verifyRole } from '@/middlewares/auth.middleware';
import * as doc from '@/schemas/api-doc';

type Variables = {
  jwtPayload: {
    id: string;
    role: string;
    email: string;
  }
}

const applicationRoute = new OpenAPIHono<{ Variables: Variables }>();

/**
 * --- 1. LOGIC ỨNG VIÊN NỘP ĐƠN ---
 * Path: / (POST)
 */
applicationRoute.use('/create', verifyRole('CANDIDATE')); // Chỉ áp dụng cho POST nộp đơn

applicationRoute.openapi(doc.applyJobDoc, async (c) => {
  const payload = c.get('jwtPayload');
  const { jobId } = c.req.valid('json');

  // Dùng findFirst để tránh lỗi TS Unique như đã yêu cầu
  const profile = await prisma.candidateProfile.findFirst({ 
    where: { userId: payload.id } 
  });
  
  if (!profile) return c.json({ success: false, message: "Vui lòng cập nhật hồ sơ trước" }, 400);

  // Kiểm tra đã nộp đơn chưa
  const existing = await prisma.application.findFirst({
    where: { jobId, candidateId: profile.id }
  });
  
  if (existing) return c.json({ success: false, message: "Bạn đã nộp đơn cho công việc này rồi" }, 400);

  try {
    const newApp = await prisma.application.create({
      data: {
        jobId,
        candidateId: profile.id,
        status: 'PENDING',
        aiMatchScore: Math.floor(Math.random() * 100),
        aiAnalysis: "AI đánh giá: Ứng viên có tiềm năng."
      }
    });
    return c.json({ success: true, data: newApp }, 201);
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 400);
  }
});

/**
 * --- 2. LOGIC LẤY DANH SÁCH ĐƠN ---
 * Middleware cho phép cả 3 Role vào nhưng xử lý filter bên trong
 */
applicationRoute.use('/all', verifyRole(['CANDIDATE', 'RECRUITER']));

applicationRoute.openapi(doc.getApplicationsDoc, async (c) => {
  const payload = c.get('jwtPayload');
  const { page, limit, jobId, status } = c.req.valid('query');
  const skip = (page - 1) * limit;

  let where: any = {};

  // Phân luồng dữ liệu dựa trên Role của người đang gọi
  if (payload.role === 'CANDIDATE') {
    // Nếu là ứng viên: Chỉ thấy đơn của chính mình
    const profile = await prisma.candidateProfile.findFirst({ where: { userId: payload.id } });
    if (!profile) return c.json({ success: false, message: "Hồ sơ ứng viên không tồn tại" }, 404);
    where.candidateId = profile.id;
  } 
  else if (payload.role === 'RECRUITER') {
    // Nếu là nhà tuyển dụng: Chỉ thấy đơn nộp vào các Job do mình đăng
    where.job = { recruiterId: payload.id };
    if (jobId) where.jobId = jobId;
  }
  else {
    // Trường hợp khác (ví dụ Admin nhưng bạn không cho vào tags ở trên)
    return c.json({ success: false, message: "Quyền truy cập bị từ chối" }, 403);
  }

  if (status) where.status = status;

  try {
    const [data, total] = await Promise.all([
      prisma.application.findMany({
        where,
        include: { 
          job: true, 
          candidate: { include: { user: { select: { name: true, email: true } } } } 
        },
        skip,
        take: limit,
        orderBy: { appliedAt: 'desc' }
      }),
      prisma.application.count({ where })
    ]);

    return c.json({ 
      success: true, 
      data, 
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } 
    }, 200);
    
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

/**
 * --- 3. LOGIC NHÀ TUYỂN DỤNG CẬP NHẬT TRẠNG THÁI ---
 */
applicationRoute.use('/:id/status', verifyRole('RECRUITER'));

applicationRoute.openapi(doc.updateAppStatusDoc, async (c) => {
  const payload = c.get('jwtPayload');
  const { id } = c.req.valid('param');
  const { status } = c.req.valid('json');

  const app = await prisma.application.findUnique({
    where: { id },
    include: { job: true }
  });

  if (!app) return c.json({ success: false, message: "Không tìm thấy đơn" }, 404);
  
  // Kiểm tra đơn này có thuộc bài đăng của Recruiter này không
  if (app.job.recruiterId !== payload.id) {
    return c.json({ success: false, message: "Bạn không có quyền cập nhật đơn này" }, 403);
  }

  await prisma.application.update({
    where: { id },
    data: { status }
  });

  return c.json({ success: true, message: `Đã chuyển sang ${status}` });
});

/**
 * --- 4. LOGIC XÓA ĐƠN ---
 * Áp dụng cho cả Xóa 1 và Xóa nhiều, cho phép Ứng viên và Admin
 */
applicationRoute.use('/delete/:id', verifyRole('CANDIDATE'));

// Xóa 1
applicationRoute.openapi(doc.cancelApplicationDoc, async (c) => {
  const payload = c.get('jwtPayload');
  const { id } = c.req.valid('param');

  const application = await prisma.application.findUnique({
    where: { id },
    include: { candidate: true }
  });

  if (!application) return c.json({ success: false, message: "Không tìm thấy" }, 404);

  const isOwner = application.candidate.userId === payload.id;
  const isAdmin = payload.role === 'ADMIN';

  if (!isOwner && !isAdmin) return c.json({ success: false, message: "Không có quyền" }, 403);

  await prisma.application.delete({ where: { id } });
  return c.json({ success: true, message: "Đã xóa thành công" });
});

// Xóa nhiều
applicationRoute.openapi(doc.bulkDeleteApplicationsDoc, async (c) => {
  const payload = c.get('jwtPayload');
  const { ids } = c.req.valid('json');

  try {
    let whereClause: any = { id: { in: ids } };

    if (payload.role !== 'ADMIN') {
      const profile = await prisma.candidateProfile.findFirst({ where: { userId: payload.id } });
      if (!profile) return c.json({ success: false, message: "Hồ sơ không tồn tại" }, 403);
      whereClause.candidateId = profile.id;
    }

    const result = await prisma.application.deleteMany({ where: whereClause });
    return c.json({ success: true, message: `Đã xóa ${result.count} mục` });
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 400);
  }
});

export default applicationRoute;