import { OpenAPIHono } from '@hono/zod-openapi';
import { askQuestionDoc, answerQuestionDoc } from '@/schemas/api-doc';
import { prisma } from '@/lib/db';
import { verifyRole } from '@/middlewares/auth.middleware';

type Variables = {
  jwtPayload: {
    id: string;
    role: string;
    email: string;
  }
}

const qaRoute = new OpenAPIHono<{ Variables: Variables }>();

// --- 1. LOGIC ỨNG VIÊN ĐẶT CÂU HỎI ---
qaRoute.use('/ask', verifyRole('CANDIDATE'));

qaRoute.openapi(askQuestionDoc, async (c) => {
  const payload = c.get('jwtPayload');
  const { jobId, content } = c.req.valid('json');

  // Kiểm tra bài Job tồn tại
  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) return c.json({ success: false, message: "Bài đăng không tồn tại" }, 404);

  // Chống Spam: Mỗi bài job ứng viên chỉ được có tối đa 2 câu chưa trả lời
  const pendingCount = await prisma.question.count({
    where: { jobId, senderId: payload.id, answer: null }
  });
  if (pendingCount >= 2) {
    return c.json({ success: false, message: "Bạn có câu hỏi đang chờ, vui lòng đợi phản hồi." }, 400);
  }

  try {
    await prisma.question.create({
      data: {
        content,
        jobId,
        senderId: payload.id,
        recruiterId: job.recruiterId // Tự động lấy chủ bài đăng để gửi câu hỏi đến
      }
    });
    return c.json({ success: true, message: "Đã gửi câu hỏi đến Nhà tuyển dụng" }, 201);
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 400);
  }
});

// --- 2. LOGIC NHÀ TUYỂN DỤNG TRẢ LỜI ---
qaRoute.use('/answer/:id', verifyRole('RECRUITER'));

qaRoute.openapi(answerQuestionDoc, async (c) => {
  const payload = c.get('jwtPayload');
  const { id } = c.req.valid('param'); // ID của Question
  const { answer, isPublic } = c.req.valid('json');

  try {
    const question = await prisma.question.findUnique({ where: { id } });

    if (!question) return c.json({ success: false, message: "Câu hỏi không tồn tại" }, 404);

    // Kiểm tra quyền sở hữu: Chỉ người được hỏi mới được trả lời
    if (question.recruiterId !== payload.id) {
      return c.json({ success: false, message: "Bạn không có quyền phản hồi câu hỏi này" }, 403);
    }

    await prisma.question.update({
      where: { id },
      data: { 
        answer, 
        isPublic,
        updatedAt: new Date()
      }
    });

    return c.json({ success: true, message: "Đã gửi câu trả lời" }, 200);
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 400);
  }
});

export default qaRoute;