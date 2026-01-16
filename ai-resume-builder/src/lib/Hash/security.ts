import crypto from 'crypto';

export function generateReviewKeys(userId: string, companyId: string) {
  const secret = process.env.REVIEW_SALT || 'super-secret-permanent-salt';

  // Key để tìm tất cả bài viết của user này (ẩn danh)
  const userReviewKey = crypto
    .createHash('sha256')
    .update(`${userId}-${secret}`)
    .digest('hex');

  // Key để định danh duy nhất bài viết cho công ty này
  const authorHash = crypto
    .createHash('sha256')
    .update(`${userId}-${companyId}-${secret}`)
    .digest('hex');

  return { userReviewKey, authorHash };
}