// src/server/routes/candidate.ts
import { OpenAPIHono } from '@hono/zod-openapi'; // Dùng OpenAPIHono thay vì Hono
import { candidateSearchDoc } from '@/schemas/api-doc'; // Import Doc bạn đã viết
import { redis } from '@/lib/db';
import { verifyRole } from '@/middlewares/auth.middleware';

// 1. Khởi tạo bằng OpenAPIHono
const candidateRoute = new OpenAPIHono();

// 2. Sử dụng middleware (nếu cần cho toàn bộ route này)
candidateRoute.use('/search', verifyRole('RECRUITER'));

// 3. Sử dụng hàm .openapi() thay vì .get()
candidateRoute.openapi(candidateSearchDoc, async (c) => {
  // 4. Lấy query từ c.req.valid('query') để đảm bảo Type-safe và Swagger nhận diện được
  const { q } = c.req.valid('query'); 
  
  if (!q) {
    return c.json({ success: true, total: 0, results: [] }, 200);
  }

  try {
    const smartQuery = `(${q}*) | (@skills:{${q}*})`;

    // Logic Redis giữ nguyên
    const searchResult: any = await redis.ft.search('idx:candidates', smartQuery, {
      LIMIT: { from: 0, size: 10 }
    });

    return c.json({
      success: true,
      total: searchResult.total,
      results: searchResult.documents.map((doc: any) => doc.value)
    }, 200); // Đảm bảo status 200 khớp với Doc
  } catch (error) {
    console.error("Search Error:", error);
    return c.json({ 
      success: false, 
      message: 'Tìm kiếm thất bại' 
    }, 500); // 500 phải được định nghĩa trong responses của candidateSearchDoc
  }
});

export default candidateRoute;