import { PrismaClient } from '@prisma/client';
import { Redis } from 'ioredis';

// --- CẤU HÌNH PRISMA (SINGLETON) ---
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;


// --- CẤU HÌNH REDIS & BULLMQ ---
const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

// ioredis instance
export const redis = new Redis(REDIS_URL, {
  // BẮT BUỘC: maxRetriesPerRequest phải là null để BullMQ hoạt động chính xác
  maxRetriesPerRequest: null,
  
  // Tự động kết nối lại khi mất mạng
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

// Kiểm tra kết nối Redis
redis.on('connect', () => console.log('🚀 Redis connected successfully'));
redis.on('error', (err) => console.error('❌ Redis connection error:', err));


// Xuất một cấu hình dùng riêng cho BullMQ (nếu cần tách biệt)
export const bullConfig = {
  connection: redis,
};