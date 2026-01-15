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
const getGlobalIo = () => (global as any).io;

applicationRoute.use('/create', verifyRole('CANDIDATE')); // Chỉ áp dụng cho POST nộp đơn

applicationRoute.openapi(doc.applyJobDoc, async (c) => {
  const payload = c.get('jwtPayload');
  const { jobId } = c.req.valid('json');
  const userId = payload.id;

  try {
    // 1. Lấy thông tin Công việc (Để lấy documentId)
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: { documentId: true, title: true, recruiterId: true, status: true }
    });

    if (!job || job.status !== 'PUBLISHED') {
      return c.json({ success: false, message: "Công việc không tồn tại hoặc đã đóng" }, 404);
    }

    // 2. Lấy Hồ sơ Master của Ứng viên kèm các bảng con để làm Snapshot
    const profile = await prisma.candidateProfile.findFirst({
      where: { userId, isMaster: true },
      include: {
        workExperiences: true,
        projects: true,
        educations: true,
        user: { select: { name: true, email: true } }
      }
    });

    if (!profile) {
      return c.json({ success: false, message: "Vui lòng tạo hồ sơ chính thức (Master) trước khi ứng tuyển" }, 400);
    }

    // 3. Kiểm tra xem đã nộp cho chuỗi bài đăng (documentId) này chưa 
    // Tránh việc nộp lại khi nhà tuyển dụng ra Version mới cho cùng 1 Job
    const existingApp = await prisma.application.findFirst({
      where: { 
        candidateId: profile.id,
        jobDocumentId: job.documentId 
      }
    });

    if (existingApp) {
      return c.json({ success: false, message: "Bạn đã nộp đơn cho vị trí này rồi" }, 400);
    }

    // 4. TẠO CV SNAPSHOT (Đóng băng dữ liệu tại thời điểm nộp)
    const cvSnapshot = {
      fullName: profile.user.name,
      email: profile.user.email,
      headline: profile.headline,
      summary: profile.summary,
      skills: profile.skills,
      softSkills: profile.softSkills,
      experiences: profile.workExperiences,
      projects: profile.projects,
      educations: profile.educations,
      appliedAt: new Date().toISOString()
    };

    // 5. Tạo đơn ứng tuyển trong Database
    const newApp = await prisma.application.create({
      data: {
        jobId: jobId,
        jobDocumentId: job.documentId,
        candidateId: profile.id,
        cvSnapshot: cvSnapshot as any, // Lưu cục JSON
        status: 'PENDING',
        aiStatus: 'PENDING'
      }
    });

    // 7. SOCKET.IO: Thông báo cho Nhà tuyển dụng có ứng viên mới (Real-time)
    const io = getGlobalIo();
    if (io) {
      io.to(job.recruiterId).emit('new_notification', {
        content: `Ứng viên ${profile.user.name} vừa nộp đơn vào vị trí ${job.title}`,
        type: 'APPLICATION_STATUS',
        link: `/recruiter/applications/${newApp.id}`
      });
    }

    return c.json({ 
      success: true, 
      message: "Nộp đơn thành công! AI đang tiến hành phân tích hồ sơ của bạn.",
      data: newApp 
    }, 201);

  } catch (error: any) {
    console.error("Apply Job Error:", error);
    return c.json({ success: false, message: "Lỗi hệ thống khi nộp đơn" }, 500);
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
applicationRoute.use('/:id/cv-snapshot', verifyRole(["CANDIDATE", "RECRUITER"]));
applicationRoute.openapi(doc.getApplicationCVSnapshotDoc, async (c) => {
  const { id } = c.req.valid('param');
  const payload = c.get('jwtPayload');

  const app = await prisma.application.findUnique({
    where: { id },
    include: { job: true }
  });

  if (!app) return c.json({ success: false, message: "Không tìm thấy đơn" }, 404);

  // Bảo mật: Chỉ Ứng viên đó hoặc Nhà tuyển dụng của Job đó mới được xem snapshot
  if (payload.role === 'RECRUITER' && app.job.recruiterId !== payload.id) {
    return c.json({ success: false, message: "Không có quyền xem" }, 403);
  }

  return c.json({
    success: true,
    data: app.cvSnapshot // Trả về cục JSON đã lưu lúc nộp
  }, 200);
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
applicationRoute.use('/:id', verifyRole('RECRUITER'));
applicationRoute.openapi(doc.getApplicationDetailDoc, async (c) => {
  const { id } = c.req.valid('param');
  const payload = c.get('jwtPayload');
  const recruiterId = payload.id;

  try {
    // 1. Tìm đơn ứng tuyển kèm thông tin Job để check quyền
    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        job: {
          select: { recruiterId: true, title: true }
        },
        candidate: {
          include: {
            user: { select: { name: true, email: true } }
          }
        }
      }
    });

    // 2. Kiểm tra tồn tại
    if (!application) {
      return c.json({ success: false, message: "Không tìm thấy đơn ứng tuyển" }, 404);
    }

    // 3. Kiểm tra quyền hạn: Chỉ Recruiter tạo ra Job này mới được xem đơn
    if (application.job.recruiterId !== recruiterId) {
      return c.json({ success: false, message: "Bạn không có quyền xem đơn ứng tuyển này" }, 403);
    }

    // 4. Trả về dữ liệu
    return c.json({
      success: true,
      data: {
        id: application.id,
        jobTitle: application.job.title,
        status: application.status,
        aiMatchScore: application.aiMatchScore,
        aiAnalysis: application.aiAnalysis,
        appliedAt: application.appliedAt.toISOString(),
        
        // QUAN TRỌNG: Trả về CV Snapshot thay vì tìm trong bảng CandidateProfile
        cvSnapshot: application.cvSnapshot,
        
        // Trả về thêm thông tin cơ bản hiện tại của ứng viên
        candidateInfo: {
          name: application.candidate.user.name,
          email: application.candidate.user.email,
          headline: application.candidate.headline
        }
      }
    }, 200);

  } catch (error: any) {
    return c.json({ success: false, message: "Lỗi máy chủ: " + error.message }, 500);
  }
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