import { Worker } from 'bullmq';
import { redis, prisma } from '@/lib/db';
import axios from 'axios';
import crypto from 'crypto';

export const webhookWorker = new Worker('webhook-delivery-queue', async (job) => {
  const { companyId, event, data } = job.data;

  // 1. Lấy thông tin webhook của công ty
  const company = await prisma.company.findUnique({ where: { id: companyId } });
  if (!company || !company.webhookUrl || !company.webhookEnabled) return;

  // 2. Tạo chữ ký bảo mật (Security Signature) 
  // Giúp khách hàng biết tin nhắn này thực sự đến từ AI Recruitment của bạn
  const signature = crypto
    .createHmac('sha256', company.webhookSecret || 'default_secret')
    .update(JSON.stringify(data))
    .digest('hex');

  try {
    // 3. Gửi POST request kèm Payload
    const response = await axios.post(company.webhookUrl, {
      event, // Ví dụ: 'candidate.applied'
      timestamp: new Date().toISOString(),
      data
    }, {
      headers: { 
        'X-AI-Recruit-Signature': signature,
        'Content-Type': 'application/json'
      },
      timeout: 10000 // Chờ tối đa 10 giây
    });
console.log("⬇️ Webhook Response Data:", response.data); // Xem nội dung Webhook.site trả về
console.log("⬇️ Webhook Response Status:", response.status); // Xem mã 200, 404...
    // 4. Lưu log thành công
    await prisma.webhookLog.create({
      data: { companyId, url: company.webhookUrl, payload: data, statusCode: response.status }
    });

  } catch (error: any) {
    // 5. Lưu log lỗi để khách hàng kiểm tra
    await prisma.webhookLog.create({
      data: { 
        companyId, 
        url: company.webhookUrl, 
        payload: data, 
        statusCode: error.response?.status,
        error: error.message 
      }
    });
    throw error; // Quăng lỗi để BullMQ thực hiện retry
  }
}, { connection: redis });