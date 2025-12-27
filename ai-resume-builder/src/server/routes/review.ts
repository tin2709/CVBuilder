// server/routes/review.ts
import { OpenAPIHono } from '@hono/zod-openapi';
import { prisma } from '@/lib/db';
import { verifyRole } from '@/middlewares/auth.middleware';
import * as docs from '@/schemas/api-doc';

const reviewRoute = new OpenAPIHono<{ Variables: { jwtPayload: any } }>();

// 1. Lấy danh sách reviews (Public)
reviewRoute.use('/:companyId/all', verifyRole('CANDIDATE'));

reviewRoute.openapi(docs.getCompanyReviewsDoc, async (c) => {
  const { companyId } = c.req.valid('param');
  const reviews = await prisma.review.findMany({
    where: { companyId },
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: 'desc' }
  });
  return c.json(reviews, 200);
});

// 2. Gửi review mới (Chỉ CANDIDATE)
reviewRoute.use('/:companyId/create', verifyRole('CANDIDATE'));

reviewRoute.openapi(docs.postReviewDoc, async (c) => {
  const payload = c.get('jwtPayload');
  const { companyId } = c.req.valid('param');
  const { content, rating } = c.req.valid('json');

  if (payload.role !== 'CANDIDATE') {
      return c.json({ success: false, message: "Chỉ ứng viên mới được đánh giá" }, 403);
  }

  // Kiểm tra xem đã review công ty này chưa
  const existing = await prisma.review.findUnique({
    where: { userId_companyId: { userId: payload.id, companyId } }
  });

  if (existing) {
    return c.json({ success: false, message: "Bạn đã đánh giá công ty này rồi" }, 400);
  }

  await prisma.review.create({
    data: { content, rating, userId: payload.id, companyId }
  });

  return c.json({ success: true, message: "Gửi đánh giá thành công" }, 201);
});

// 3. Chỉnh sửa review (Chủ nhân)
reviewRoute.use('/:id/update', verifyRole('CANDIDATE'));
reviewRoute.openapi(docs.updateReviewDoc, async (c) => {
  const payload = c.get('jwtPayload');
  const { id } = c.req.valid('param');
  const { content, rating } = c.req.valid('json');

  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) return c.json({ success: false, message: "Không tìm thấy review" }, 404);
  if (review.userId !== payload.id) return c.json({ success: false, message: "Không có quyền" }, 403);

  await prisma.review.update({
    where: { id },
    data: { content, rating }
  });

  return c.json({ success: true, message: "Cập nhật thành công" }, 200);
});

// 4. Xóa review (Chủ nhân hoặc Admin)
reviewRoute.use('/:id/delete', verifyRole('CANDIDATE'));
reviewRoute.openapi(docs.deleteReviewDoc, async (c) => {
  const payload = c.get('jwtPayload');
  const { id } = c.req.valid('param');

  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) return c.json({ success: false, message: "Không tìm thấy" }, 404);

  if (review.userId !== payload.id) {
    return c.json({ success: false, message: "Không có quyền" }, 403);
  }

  await prisma.review.delete({ where: { id } });
  return c.json({ success: true, message: "Đã xóa review" }, 200);
});

// 5. Lấy điểm trung bình (Rating)
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