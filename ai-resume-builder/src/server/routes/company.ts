import { OpenAPIHono } from '@hono/zod-openapi';
import { prisma } from '@/lib/db';
import { verifyRole } from '@/middlewares/auth.middleware';
import * as doc from '@/schemas/api-doc';

// Định nghĩa kiểu dữ liệu cho Context Variables
type Variables = {
  jwtPayload: {
    id: string;
    role: string;
    email: string;
    companyId?: string; // ID công ty được nhúng trong Token
  }
}

const companyRoute = new OpenAPIHono<{ Variables: Variables }>();

/**
 * --- PHÂN TẦNG MIDDLEWARE ---
 * Thiết lập quyền truy cập cho từng nhóm API dựa trên đường dẫn (path)
 */

// 1. Nhóm API dành cho Nhà tuyển dụng (Recruiter)
companyRoute.use('/request-create', verifyRole('RECRUITER'));
companyRoute.use('/request-update/:id', verifyRole('RECRUITER'));
companyRoute.use('/request-delete/:id', verifyRole('RECRUITER'));

// 2. Nhóm API dành cho Quản trị viên (Admin)
// Sử dụng wildcard '*' để bảo vệ tất cả các route bắt đầu bằng /admin/
companyRoute.use('/admin/*', verifyRole('ADMIN'));


/**
 * --- NHÓM API: RECRUITER (YÊU CẦU CÔNG TY) ---
 */

// [API: TẠO CÔNG TY]
companyRoute.openapi(doc.requestCreateCompanyDoc, async (c) => {
  const payload = c.get('jwtPayload');
  const body = c.req.valid('json');

  try {
    // Sử dụng Transaction để đảm bảo tính toàn vẹn dữ liệu
    const result = await prisma.$transaction(async (tx) => {
      // 1. Tạo bản ghi công ty mới ở trạng thái PENDING
      const company = await tx.company.create({
        data: { 
          ...body, 
          createdBy: payload.id, 
          status: 'PENDING' 
        }
      });

      // 2. Cập nhật user để liên kết với công ty vừa tạo
      await tx.user.update({
        where: { id: payload.id },
        data: { companyId: company.id }
      });

      return company;
    });

    return c.json({ 
      success: true, 
      message: "Yêu cầu tạo công ty đã được gửi và gắn vào tài khoản của bạn", 
      data: result 
    }, 201);

  } catch (error: any) {
    console.error("Create Company Error:", error);
    return c.json({ 
      success: false, 
      message: error.message || "Tên công ty đã tồn tại hoặc lỗi hệ thống" 
    }, 400);
  }
});

// [API: CẬP NHẬT CÔNG TY]
companyRoute.openapi(doc.requestUpdateCompanyDoc, async (c) => {
  const payload = c.get('jwtPayload');
  const { id: companyId } = c.req.valid('param');
  const newData = c.req.valid('json');

  try {
    const company = await prisma.company.findUnique({ where: { id: companyId } });

    if (!company) {
      return c.json({ success: false, message: "Công ty không tồn tại" }, 404);
    }

    // Kiểm tra quyền sở hữu
    if (company.createdBy !== payload.id) {
      return c.json({ success: false, message: "Bạn không phải chủ sở hữu công ty này" }, 403);
    }

    // Nếu công ty chưa được duyệt (vẫn đang PENDING) -> Cho phép sửa trực tiếp
    if (company.status === 'PENDING') {
      const updated = await prisma.company.update({ 
        where: { id: companyId }, 
        data: newData 
      });
      return c.json({ success: true, message: "Đã cập nhật trực tiếp bản thảo", data: updated }, 200);
    }

    // Nếu đã APPROVED -> Lưu thay đổi vào trường tạm 'pendingChanges' chờ Admin duyệt
    await prisma.company.update({
      where: { id: companyId },
      data: { pendingChanges: newData as any }
    });

    return c.json({ success: true, message: "Yêu cầu sửa đổi đã được gửi tới Admin" }, 200);

  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 400);
  }
});

// [API: XÓA CÔNG TY]
companyRoute.openapi(doc.requestDeleteCompanyDoc, async (c) => {
  const payload = c.get('jwtPayload');
  const { id } = c.req.valid('param');

  const company = await prisma.company.findUnique({ where: { id } });
  
  if (!company) {
    return c.json({ success: false, message: "Công ty không tồn tại" }, 404);
  }

  if (company.createdBy !== payload.id) {
    return c.json({ success: false, message: "Bạn không có quyền thực hiện thao tác này" }, 403);
  }

  // Nếu là bản nháp chưa duyệt hoặc đã bị từ chối -> Xóa luôn khỏi DB
  if (company.status === 'PENDING' || company.status === 'REJECTED') {
    await prisma.company.delete({ where: { id } });
    return c.json({ success: true, message: "Đã xóa yêu cầu thành công" }, 200);
  }

  // Nếu đã APPROVED -> Chuyển trạng thái sang DELETING chờ Admin phê duyệt xóa
  await prisma.company.update({ 
    where: { id }, 
    data: { status: 'DELETING' } 
  });

  return c.json({ success: true, message: "Yêu cầu xóa đang chờ Admin duyệt" }, 200);
});


/**
 * --- NHÓM API: ADMIN (DUYỆT YÊU CẦU) ---
 * Lưu ý: Tất cả các route này phải bắt đầu bằng /admin/ để middleware verifyRole('ADMIN') có tác dụng
 */

// [ADMIN: DUYỆT TRẠNG THÁI TẠO/XÓA]
companyRoute.openapi(doc.adminReviewStatusDoc, async (c) => {
  const { id } = c.req.valid('param');
  const { action } = c.req.valid('json');

  const company = await prisma.company.findUnique({ where: { id } });
  if (!company) return c.json({ success: false, message: "Không tìm thấy công ty" }, 404);

  if (action === 'REJECT') {
    await prisma.company.update({ where: { id }, data: { status: 'REJECTED' } });
    return c.json({ success: true, message: "Đã từ chối yêu cầu" });
  }

  // Duyệt cho phép tạo (Từ PENDING sang APPROVED)
  if (company.status === 'PENDING') {
    await prisma.company.update({ where: { id }, data: { status: 'APPROVED' } });
  } 
  // Duyệt cho phép xóa (Từ DELETING -> Xóa khỏi DB)
  else if (company.status === 'DELETING') {
    await prisma.company.delete({ where: { id } });
    return c.json({ success: true, message: "Đã xóa công ty vĩnh viễn khỏi hệ thống" });
  }

  return c.json({ success: true, message: "Thao tác phê duyệt hoàn tất" });
});

// [ADMIN: DUYỆT NỘI DUNG SỬA ĐỔI]
companyRoute.openapi(doc.adminReviewUpdateDoc, async (c) => {
  const { id } = c.req.valid('param');
  const { action } = c.req.valid('json');

  const company = await prisma.company.findUnique({ where: { id } });
  
  if (!company || !company.pendingChanges) {
    return c.json({ success: false, message: "Không tìm thấy bản thảo thay đổi" }, 404);
  }

  if (action === 'REJECT') {
    // Xóa bỏ các thay đổi đang chờ, giữ nguyên dữ liệu cũ
    await prisma.company.update({ where: { id }, data: { pendingChanges: null } });
    return c.json({ success: true, message: "Đã từ chối các bản sửa đổi" });
  }

  // Chấp nhận: Ghi đè dữ liệu từ pendingChanges vào các trường chính
  const changes = company.pendingChanges as object;
  await prisma.company.update({
    where: { id },
    data: { 
      ...changes, 
      pendingChanges: null // Xóa bản thảo sau khi đã áp dụng
    }
  });

  return c.json({ success: true, message: "Thông tin công ty đã được cập nhật chính thức" });
});
companyRoute.use('/stats', verifyRole(["RECRUITER", "ADMIN"]));
companyRoute.openapi(doc.getCompanyDashboardStatsDoc, async (c) => {
  const payload = c.get('jwtPayload');
  const query = c.req.query(); // Lấy query params
  
  let targetCompanyId: string | undefined;

  // LOGIC PHÂN QUYỀN THÔNG MINH
  if (payload.role === 'ADMIN') {
    // Admin có thể xem bất kỳ công ty nào nếu truyền ?companyId=...
    // Nếu Admin không truyền, có thể mặc định lấy một ID nào đó hoặc báo lỗi
    targetCompanyId = query.companyId;
    if (!targetCompanyId) return c.json({ success: false, message: "Admin cần cung cấp companyId" }, 400);
  } else {
    // Recruiter chỉ được xem công ty của chính mình (lấy từ Token)
    targetCompanyId = payload.companyId;
  }

  if (!targetCompanyId) {
    return c.json({ success: false, message: "Không tìm thấy thông tin công ty" }, 403);
  }

  try {
    const stats = await prisma.companyStat.findUnique({
      where: { companyId: targetCompanyId }
    });

    return c.json({
      success: true,
      data: stats || { totalJobs: 0, totalApplications: 0, totalInterviews: 0, avgAiScore: 0 }
    }, 200);
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500);
  }
});
export default companyRoute;