import { Worker } from 'bullmq';
import { redis } from '@/lib/db';
import nodemailer from 'nodemailer';
import { Liquid } from 'liquidjs';

const engine = new Liquid();

// 1. Cấu hình gửi Mail (Dùng Gmail hoặc dịch vụ khác)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // App Password của Google
  },
});

// 2. Định nghĩa các Template nội dung Email
const MAIL_TEMPLATES: Record<string, { subject: string; body: string }> = {
  INTERVIEW_INVITE: {
    subject: "[Mời phỏng vấn] Vị trí {{ jobTitle }}",
    body: `
      <h2>Chào {{ candidateName }},</h2>
      <p>Chúng tôi rất ấn tượng với hồ sơ của bạn và muốn mời bạn tham gia buổi phỏng vấn.</p>
      <p><b>Thời gian:</b> {{ interviewTime }}</p>
      <p><b>Ghi chú:</b> {{ notes }}</p>
      <p>Trân trọng,<br/>Đội ngũ Tuyển dụng</p>
    `,
  },
   SHARE_CV_OTP: {
    subject: "Mã xác thực truy cập hồ sơ của {{ candidateName }}",
    body: `
      <h2>Xác thực truy cập</h2>
      <p>Chào bạn,</p>
      <p>Bạn đang yêu cầu truy cập vào hồ sơ bảo mật của <b>{{ candidateName }}</b>.</p>
      <p>Mã OTP của bạn là: <b style="font-size: 24px; color: #136dec;">{{ otp }}</b></p>
      <p>Mã này có hiệu lực trong 10 phút. Vui lòng không chia sẻ mã này.</p>
    `,
  },
  // Bạn có thể thêm các template khác như OTP_EMAIL ở đây
};

export const mailWorker = new Worker(
  'mail-queue', // Phải khớp với tên queue trong addMailJob
  async (job) => {
    const { to, subject, templateKey, payload } = job.data;
    const template = MAIL_TEMPLATES[templateKey];

    if (!template) {
      console.error(`❌ Không tìm thấy template: ${templateKey}`);
      return;
    }

    // Render nội dung bằng LiquidJS
    const htmlContent = await engine.parseAndRender(template.body, payload);
    const finalSubject = await engine.parseAndRender(template.subject || subject, payload);

    try {
      await transporter.sendMail({
        from: `"SmartRecruit AI" <${process.env.EMAIL_USER}>`,
        to,
        subject: finalSubject,
        html: htmlContent,
      });
      console.log(`✅ Đã gửi email thành công tới: ${to}`);
    } catch (error) {
      console.error(`❌ Lỗi gửi email tới ${to}:`, error);
      throw error; // Quăng lỗi để BullMQ thực hiện retry
    }
  },
  { connection: redis }
);