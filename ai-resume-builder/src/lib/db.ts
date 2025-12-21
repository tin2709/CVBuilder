import { PrismaClient } from '@prisma/client';
import { createClient } from 'redis';

export const prisma = new PrismaClient();
export const redis = createClient({ url: process.env.REDIS_URL || 'redis://127.0.0.1:6379' });

// Kết nối Redis khi khởi động
redis.connect().catch(console.error);