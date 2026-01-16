import { OpenAPIHono } from '@hono/zod-openapi';
import { prisma } from '@/lib/db';
import { verifyRole } from '@/middlewares/auth.middleware';
import * as docs from '@/schemas/api-doc';
import { generateReviewKeys } from '@/lib/Hash/security';

const reviewRoute = new OpenAPIHono<{ Variables: { jwtPayload: any } }>();
reviewRoute.use('/me/all', verifyRole("CANDIDATE"));
reviewRoute.openapi(docs.getMyReviewsDoc, async (c) => {
  const payload = c.get('jwtPayload');

  // 1. Tạo key tìm kiếm dựa trên userId của người đang đăng nhập
  const { userReviewKey } = generateReviewKeys(payload.id, "dummy_id");

  // 2. Tìm tất cả Review có key này
  const myReviews = await prisma.review.findMany({
    where: { userReviewKey },
    include: {
      company: { select: { name: true, logoUrl: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  return c.json({
    success: true,
    data: myReviews
  });
});
// --- API 1: LẤY DANH SÁCH REVIEW CỦA CÔNG TY ---
reviewRoute.openapi(docs.getCompanyReviewsDoc, async (c) => {
  const { companyId } = c.req.valid('param');
  
  const reviews = await prisma.review.findMany({
    where: { companyId },
    orderBy: { createdAt: 'desc' }
  });

  // MAP DỮ LIỆU: Vì DB không còn bảng user, ta tự điền tên ẩn danh để khớp Schema
  const formattedReviews = reviews.map(r => ({
    id: r.id,
    content: r.content,
    rating: r.rating,
    createdAt: r.createdAt.toISOString(),
    user: { name: "Ứng viên ẩn danh" } // Luôn là ẩn danh
  }));

  return c.json(formattedReviews, 200);
});
// --- API 2: GỬI REVIEW MỚI ---
reviewRoute.use('/:companyId/create', verifyRole("CANDIDATE"));
reviewRoute.openapi(docs.postReviewDoc, async (c) => {
  const payload = c.get('jwtPayload');
  const { companyId } = c.req.valid('param');
  const { content, rating } = c.req.valid('json');

  // 1. Tạo mã Hash ẩn danh
  const { authorHash, userReviewKey } = generateReviewKeys(payload.id, companyId);

  try {
    const newReview = await prisma.review.create({
      data: {
        content,
        rating,
        companyId,
        authorHash,    // Dùng để chặn 1 người review 1 công ty 2 lần
        userReviewKey  // Dùng để tìm "My Reviews"
      }
    });
    return c.json({ success: true, message: "Gửi thành công" }, 201);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return c.json({ success: false, message: "Bạn đã đánh giá công ty này rồi" }, 400);
    }
    return c.json({ success: false, message: error.message }, 500);
  }
});

// --- API 3: CHỈNH SỬA REVIEW ---
reviewRoute.use('/:reviewId/update', verifyRole("CANDIDATE"));
reviewRoute.openapi(docs.updateReviewDoc, async (c) => {
  const payload = c.get('jwtPayload');
  const { id } = c.req.valid('param');
  const { content, rating } = c.req.valid('json');

  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) return c.json({ success: false, message: "Không tìm thấy" }, 404);

  // Kiểm tra quyền bằng cách so sánh Global Key (userReviewKey)
  const { userReviewKey } = generateReviewKeys(payload.id, review.companyId);
  if (review.userReviewKey !== userReviewKey) {
    return c.json({ success: false, message: "Không có quyền sửa" }, 403);
  }

  await prisma.review.update({
    where: { id },
    data: { content, rating }
  });

  return c.json({ success: true, message: "Cập nhật thành công" }, 200);
});

// --- API 4: XÓA REVIEW ---
reviewRoute.use('/:reviewId/delete', verifyRole("CANDIDATE"));
reviewRoute.openapi(docs.deleteReviewDoc, async (c) => {
  const payload = c.get('jwtPayload');
  const { id } = c.req.valid('param');

  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) return c.json({ success: false, message: "Không tìm thấy" }, 404);

  // Logic xóa: Chủ nhân (khớp key) hoặc ADMIN
  const { userReviewKey } = generateReviewKeys(payload.id, review.companyId);
  if (review.userReviewKey !== userReviewKey && payload.role !== 'ADMIN') {
    return c.json({ success: false, message: "Không có quyền xóa" }, 403);
  }

  await prisma.review.delete({ where: { id } });
  return c.json({ success: true, message: "Đã xóa review" }, 200);
});

reviewRoute.use('/:id/rating', verifyRole('CANDIDATE'));
reviewRoute.openapi(docs.getCompanyRatingDoc, async (c) => {
  const { companyId } = c.req.valid('param');
  
  const stats = await prisma.review.aggregate({
    where: { companyId },
    _avg: { rating: true },
    _count: { id: true }
  });

  return c.json({
    averageRating: stats._avg.rating ? Math.round(stats._avg.rating * 10) / 10 : 0,
    totalReviews: stats._count.id
  }, 200);
});

export default reviewRoute;