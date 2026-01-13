import { Worker } from 'bullmq';
import { redis, prisma } from '@/lib/db';

export const reminderWorker = new Worker(
  'interview-reminder-queue',
  async (job) => {
    const { interviewId } = job.data;

    // 1. Kiểm tra lại Database xem buổi phỏng vấn có còn đó không
    const interview = await prisma.interview.findUnique({
      where: { id: interviewId },
      include: { application: { include: { candidate: { include: { user: true } } } } }
    });

    // 2. Nếu buổi phỏng vấn đã bị hủy hoặc xóa -> Không nhắc nữa
    if (!interview || interview.status === 'CANCELLED') {
      console.log(`🚫 Bỏ qua nhắc nhở vì Interview ${interviewId} đã bị hủy.`);
      return;
    }

    // 3. Thực hiện nhắc nhở (Gửi mail/Bắn Socket.io)
    const candidateEmail = interview.application.candidate.user.email;
    const content = `Nhắc nhở: Bạn có lịch phỏng vấn vào lúc ${interview.date.toLocaleTimeString()} hôm nay.`;

    console.log(`🔔 Đang gửi nhắc nhở đến: ${candidateEmail}`);
    
    // Gửi mail (Nếu bạn đã làm Mail Queue ở bước trước, hãy gọi nó ở đây)
    // await addMailJob({ to: candidateEmail, subject: "Nhắc lịch phỏng vấn", ... });

    // Bắn Socket.io Real-time
    const io = (global as any).io;
    if (io) {
      io.to(interview.application.candidate.userId).emit('new_notification', { content });
    }
  },
  { connection: redis }
);