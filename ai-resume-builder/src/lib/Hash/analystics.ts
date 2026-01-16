import crypto from 'crypto';

export function getDailyVisitorHash(ip: string, userAgent: string) {
  // 1. Tạo Daily Salt dựa trên ngày hiện tại (VD: "2024-12-24-SECRET_KEY")
  // Salt này thay đổi mỗi ngày, khiến hash của cùng 1 người hôm qua và hôm nay là khác nhau.
  const date = new Date().toISOString().slice(0, 10);
  const salt = process.env.ANALYTICS_SALT || 'default_salt_key';
  const dailySalt = `${date}-${salt}`;

  // 2. Tạo hash kết hợp IP + UA + Salt
  return crypto
    .createHash('sha256')
    .update(`${ip}-${userAgent}-${dailySalt}`)
    .digest('hex');
}