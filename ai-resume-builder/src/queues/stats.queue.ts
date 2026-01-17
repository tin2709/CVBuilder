import { Queue } from 'bullmq';
import { redis } from '@/lib/db';

// Khởi tạo hàng đợi
export const statsQueue = new Queue('stats-queue', { connection: redis });

// Hàm tiện ích để kích hoạt tính toán
export const triggerStatsUpdate = async (companyId: string) => {
  await statsQueue.add(
    'recalculate', 
    { companyId }, 
    {
      removeOnComplete: true,
      // Debouncing: Nếu trong 5 giây có 100 người nộp đơn, 
      // hệ thống chỉ tính toán lại đúng 1 lần duy nhất.
      delay: 5000, 
      jobId: `stats-${companyId}` 
    }
  );
};