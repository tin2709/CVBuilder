import { OpenAPIHono } from '@hono/zod-openapi';
import { prisma } from '@/lib/db';
import { verifyRole } from '@/middlewares/auth.middleware';
import * as doc from '@/schemas/api-doc';

// Định nghĩa kiểu dữ liệu cho Context
type Variables = {
  jwtPayload: {
    id: string;
    role: string;
    email: string;
  }
}

// 1. Phải khai báo Variables ở đây
const companyRoute = new OpenAPIHono<{ Variables: Variables }>();

// 2. Sử dụng dấu '*' để đảm bảo middleware chạy cho MỌI route trong file này
companyRoute.use('/request-update/{id}', verifyRole('RECRUITER'));
companyRoute.use('/request-delete/{id}', verifyRole('RECRUITER'));

// [API TẠO YÊU CẦU CÔNG TY]
companyRoute.openapi(doc.requestCreateCompanyDoc, async (c) => {
  // 3. Lấy payload từ key 'jwtPayload' (khớp với middleware của bạn)
  const payload = c.get('jwtPayload');

  // 4. KIỂM TRA AN TOÀN TRƯỚC KHI ĐỌC .id
  if (!payload || !payload.id) {
    console.error("DEBUG: Payload is missing or id is undefined", payload);
    return c.json({ 
      success: false, 
      message: "Lỗi xác thực: Không tìm thấy ID người dùng trong Token. Vui lòng đăng nhập lại." 
    }, 401);
  }

  const body = c.req.valid('json');

  try {
    // 5. Sử dụng Transaction để tạo Company và gắn vào User cùng lúc
    const result = await prisma.$transaction(async (tx) => {
      // Tạo công ty
      const company = await tx.company.create({
        data: { 
          ...body, 
          createdBy: payload.id, 
          status: 'PENDING' 
        }
      });

      // Cập nhật User gắn companyId
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
companyRoute.openapi(doc.requestUpdateCompanyDoc, async (c) => {
  // 1. Lấy payload từ JWT
  const payload = c.get('jwtPayload');
  
  // LOG ĐỂ KIỂM TRA (Hãy nhìn vào terminal sau khi bấm Send ở Postman)
  console.log("Dữ liệu trong Token của bạn là:", payload);

  const recruiterId = payload?.id;

  // 2. Kiểm tra nếu Token thiếu trường id
  if (!recruiterId) {
    return c.json({ 
      success: false, 
      message: "Token hợp lệ nhưng không chứa ID người dùng. Hãy kiểm tra lại logic tạo Token (Login)." 
    }, 401);
  }

  const { id: companyId } = c.req.valid('param');
  const newData = c.req.valid('json');

  try {
    // 3. Tìm công ty
    const company = await prisma.company.findUnique({ where: { id: companyId } });

    if (!company) {
      return c.json({ success: false, message: "Công ty không tồn tại" }, 404);
    }

    // 4. SO SÁNH: Đây là bước bạn yêu cầu kiểm tra
    // Chuyển đổi về String để so sánh chính xác nhất
    if (company.createdBy.toString() !== recruiterId.toString()) {
      return c.json({ 
        success: false, 
        message: "Bạn không phải chủ sở hữu. Quyền truy cập bị từ chối!" 
      }, 403);
    }

    // 5. Nếu trùng khớp -> Tiếp tục logic update
    if (company.status === 'PENDING') {
      await prisma.company.update({ where: { id: companyId }, data: newData });
      return c.json({ success: true, message: "Đã cập nhật trực tiếp thông tin bản thảo" }, 200);
    }

    // Nếu đã APPROVED -> Lưu vào pendingChanges
    await prisma.company.update({
      where: { id: companyId },
      data: { pendingChanges: newData as any }
    });

    return c.json({ success: true, message: "Yêu cầu sửa đổi đã được gửi tới Admin" }, 200);

  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 400);
  }
});
// [XÓA]
companyRoute.openapi(doc.requestDeleteCompanyDoc, async (c) => {
  const payload = c.get('jwtPayload');
  const { id } = c.req.valid('param');

  const company = await prisma.company.findUnique({ where: { id } });
  if (!company || company.createdBy !== payload.id) return c.json({ success: false, message: "Không có quyền" }, 403);

  if (company.status === 'PENDING' || company.status === 'REJECTED') {
    await prisma.company.delete({ where: { id } });
    return c.json({ success: true, message: "Đã xóa yêu cầu" }, 200);
  }

  await prisma.company.update({ where: { id }, data: { status: 'DELETING' } });
  return c.json({ success: true, message: "Yêu cầu xóa đang chờ Admin duyệt" }, 200);
});


// --- PHẦN ADMIN ---

// [DUYỆT TẠO/XÓA]
companyRoute.openapi(doc.adminReviewStatusDoc, async (c) => {
  const { id } = c.req.valid('param');
  const { action } = c.req.valid('json');

  const company = await prisma.company.findUnique({ where: { id } });
  if (!company) return c.json({ success: false, message: "Không tìm thấy" }, 404);

  if (action === 'REJECT') {
    await prisma.company.update({ where: { id }, data: { status: 'REJECTED' } });
    return c.json({ success: true, message: "Đã từ chối yêu cầu" });
  }

  // Nếu duyệt APPROVED
  if (company.status === 'PENDING') {
    await prisma.company.update({ where: { id }, data: { status: 'APPROVED' } });
  } 
  // Nếu duyệt XÓA (đang ở trạng thái DELETING)
  else if (company.status === 'DELETING') {
    await prisma.company.delete({ where: { id } });
    return c.json({ success: true, message: "Đã xóa công ty vĩnh viễn" });
  }

  return c.json({ success: true, message: "Đã phê duyệt thành công" });
});

// [DUYỆT SỬA]
companyRoute.openapi(doc.adminReviewUpdateDoc, async (c) => {
  const { id } = c.req.valid('param');
  const { action } = c.req.valid('json');

  const company = await prisma.company.findUnique({ where: { id } });
  if (!company || !company.pendingChanges) return c.json({ success: false, message: "Không có bản thảo" }, 404);

  if (action === 'REJECT') {
    await prisma.company.update({ where: { id }, data: { pendingChanges: null } });
    return c.json({ success: true, message: "Đã từ chối bản sửa đổi" });
  }

  const changes = company.pendingChanges as object;
  await prisma.company.update({
    where: { id },
    data: { ...changes, pendingChanges: null }
  });

  return c.json({ success: true, message: "Thông tin công ty đã được cập nhật" });
});

export default companyRoute;