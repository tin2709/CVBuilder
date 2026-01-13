import { Queue } from 'bullmq';
import { redis } from '@/lib/db';

// 1. Queue dành riêng cho nhắc lịch phỏng vấn (có delay)
export const reminderQueue = new Queue('interview-reminder-queue', {
  connection: redis,
});

// 2. Queue dành riêng cho gửi Email (thường là gửi ngay)
export const mailQueue = new Queue('mail-queue', {
  connection: redis,
});

/**
 * Hàm lên lịch nhắc nhở phỏng vấn (Mặc định trước 1 tiếng)
 */
export const addInterviewReminder = async (interviewId: string, interviewDate: Date) => {
  const now = Date.now();
  const reminderTime = new Date(interviewDate).getTime() - (60 * 60 * 1000); 
  const delay = reminderTime - now;

  if (delay > 0) {
    await reminderQueue.add(
      'send-reminder',
      { interviewId },
      {
        delay,
        jobId: `reminder-${interviewId}`, // Tránh trùng lịch
        removeOnComplete: true,
      }
    );
  }
};

/**
 * Hàm thêm Job gửi Email vào hàng đợi
 * @param data Đối tượng chứa thông tin người nhận, template và dữ liệu
 * @param delay (Tùy chọn) Nếu muốn gửi sau bao nhiêu ms
 */
export const addMailJob = async (
  data: {
    to: string;
    subject: string;
    templateKey: string; // VD: 'OTP_EMAIL', 'INTERVIEW_INVITE'
    payload: Record<string, any>;
  },
  delay: number = 0 // Mặc định là 0 (gửi ngay lập tức)
) => {
  await mailQueue.add('send-mail', data, {
    delay,
    attempts: 3, // Thử lại 3 lần nếu mail server lỗi
    backoff: {
      type: 'exponential',
      delay: 10000, // Đợi 10s trước khi thử lại lần đầu
    },
    removeOnComplete: true,
  });
  
  console.log(`✉️ Job gửi mail cho ${data.to} đã được đưa vào hàng đợi.`);
};