import { Worker } from 'bullmq';
import { prisma, redis } from '@/lib/db';

export const statsWorker = new Worker('stats-queue', async (job) => {
  const { companyId } = job.data;

  try {
    // Truy vấn thông qua quan hệ (Join) - Dành cho cấu hình không Multi-tenancy
    const [jobCount, appCount, interviewCount, aiScoreAggregate] = await Promise.all([
      // 1. Đếm số Job của công ty
      prisma.job.count({ where: { companyId } }),

      // 2. Đếm số đơn ứng tuyển nộp vào các Job của công ty này
      prisma.application.count({ 
        where: { job: { companyId } } 
      }),

      // 3. Đếm số buổi phỏng vấn của các đơn thuộc công ty này
      prisma.interview.count({ 
        where: { application: { job: { companyId } } } 
      }),

      // 4. Tính điểm AI trung bình
      prisma.application.aggregate({
        where: { 
          job: { companyId }, 
          aiStatus: 'COMPLETED' 
        },
        _avg: { aiMatchScore: true }
      })
    ]);

    const averageScore = aiScoreAggregate?._avg?.aiMatchScore || 0;

    // Cập nhật vào bảng thống kê (Dữ liệu này vẫn nên giữ để Dashboard load nhanh)
    await prisma.companyStat.upsert({
      where: { companyId },
      update: {
        totalJobs: jobCount,
        totalApplications: appCount,
        totalInterviews: interviewCount,
        avgAiScore: averageScore
      },
      create: {
        companyId,
        totalJobs: jobCount,
        totalApplications: appCount,
        totalInterviews: interviewCount,
        avgAiScore: averageScore
      }
    });

    console.log(`📊 Đã tính toán xong thống kê cho công ty: ${companyId}`);
    
  } catch (error) {
    // BẮT BUỘC: Phải có catch để xử lý khi có lỗi xảy ra (ví dụ mất kết nối DB)
    console.error(`❌ Lỗi khi tính toán thống kê cho công ty ${companyId}:`, error);
    throw error; // Quăng lỗi để BullMQ biết và thực hiện Retry nếu cần
  }
}, { 
  connection: redis // Cấu hình kết nối Redis cho Worker
});