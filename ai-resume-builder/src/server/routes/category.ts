import { OpenAPIHono } from '@hono/zod-openapi';
import { getCategoriesDoc, createCategoryDoc,updateCategoryDoc,deleteCategoryDoc,bulkDeleteCategoriesDoc } from '@/schemas/api-doc';
import { prisma } from '@/lib/db';
import { verifyRole } from '@/middlewares/auth.middleware';

type Variables = {
  jwtPayload: {
    id: string;
    role: string;
    email: string;
  }
}

const categoryRoute = new OpenAPIHono<{ Variables: Variables }>();

// --- 1. LẤY DANH SÁCH DANH MỤC (PUBLIC) ---
categoryRoute.use('/all', verifyRole('ADMIN'));
categoryRoute.openapi(getCategoriesDoc, async (c) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });
    return c.json(categories, 200);
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 400);
  }
});

// --- 2. ADMIN TẠO DANH MỤC MỚI ---
// Chỉ ADMIN mới có quyền truy cập vào endpoint POST bên dưới
categoryRoute.use('/create', verifyRole('ADMIN'));

categoryRoute.openapi(createCategoryDoc, async (c) => {
  const { name, icon } = c.req.valid('json');

  // Tạo slug tự động từ tên (VD: "Cơ Khí" -> "co-khi")
  const slug = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  try {
    // Kiểm tra trùng lặp
    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) {
      return c.json({ success: false, message: "Danh mục này đã tồn tại" }, 400);
    }

    const category = await prisma.category.create({
      data: { name, icon, slug }
    });

    return c.json(category, 201);
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 400);
  }
});
categoryRoute.use('/:id/update', verifyRole('ADMIN'));
categoryRoute.openapi(updateCategoryDoc, async (c) => {
  const { id } = c.req.valid('param');
  
  // THAY DÒNG NÀY: Thay vì c.req.valid('json'), hãy dùng c.req.json() trực tiếp
  const body = await c.req.json(); 
  
  console.log("Dữ liệu THÔ nhận được từ Postman:", body);

  try {
    const { name, icon } = body;

    // Kiểm tra nếu không có dữ liệu gửi lên thì báo lỗi luôn
    if (!name && !icon) {
      return c.json({ success: false, message: "Không có dữ liệu để cập nhật" }, 400);
    }

    let newSlug = undefined;
    if (name) {
       newSlug = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
    }

    const updated = await prisma.category.update({
      where: { id },
      data: { 
        name: name !== undefined ? name : undefined,
        icon: icon !== undefined ? icon : undefined,
        slug: newSlug
      }
    });

    return c.json(updated, 200);
  } catch (error: any) {
    console.error("Lỗi Prisma:", error);
    return c.json({ success: false, message: error.message }, 400);
  }
});

// --- 4. ADMIN XÓA MỘT DANH MỤC ---
categoryRoute.use('/:id/delete', verifyRole('ADMIN'));
categoryRoute.openapi(deleteCategoryDoc, async (c) => {
  const { id } = c.req.valid('param');

  try {
    // Lưu ý: Cần kiểm tra xem có Job nào đang dùng Category này không trước khi xóa
    const jobCount = await prisma.job.count({ where: { categoryId: id } });
    if (jobCount > 0) {
      return c.json({ success: false, message: "Không thể xóa danh mục đang có bài đăng tuyển dụng" }, 400);
    }

    await prisma.category.delete({ where: { id } });
    return c.json({ success: true, message: "Đã xóa danh mục thành công" }, 200);
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 400);
  }
});

// --- 5. ADMIN XÓA NHIỀU DANH MỤC ---
categoryRoute.use('/bulk-delete', verifyRole('ADMIN'));

categoryRoute.openapi(bulkDeleteCategoriesDoc, async (c) => {
  const { ids } = c.req.valid('json');

  try {
    // Xóa tất cả các ID nằm trong mảng truyền lên
    const result = await prisma.category.deleteMany({
      where: {
        id: { in: ids }
      }
    });

    return c.json({
      success: true,
      count: result.count,
      message: `Đã xóa thành công ${result.count} danh mục`
    }, 200);
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 400);
  }
});
export default categoryRoute;