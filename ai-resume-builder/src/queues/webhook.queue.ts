import { Queue } from 'bullmq';
import { redis } from '@/lib/db';

export const webhookQueue = new Queue('webhook-delivery-queue', { connection: redis });

export const addWebhookJob = async (companyId: string, event: string, data: any) => {
  await webhookQueue.add('send-webhook', { 
    companyId, 
    event, 
    data 
  }, {
    attempts: 5, // Thử lại 5 lần nếu server khách hàng bị lỗi
    backoff: { type: 'exponential', delay: 30000 } // Đợi lâu dần giữa các lần thử
  });
};