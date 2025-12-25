import { z } from '@hono/zod-openapi';

// Gửi câu hỏi
export const AskQuestionSchema = z.object({
  jobId: z.string().openapi({ example: '656e...' }),
  content: z.string().min(10).max(500).openapi({ example: 'Vị trí này có yêu cầu làm việc bù thứ 7 không ạ?' }),
}).openapi('AskQuestionRequest');

// Trả lời câu hỏi
export const AnswerQuestionSchema = z.object({
  answer: z.string().min(1).max(1000).openapi({ example: 'Chào bạn, công ty chỉ làm việc từ thứ 2 đến thứ 6 nhé.' }),
  isPublic: z.boolean().default(false).openapi({ description: 'Công khai câu hỏi này cho mọi người?' }),
}).openapi('AnswerQuestionRequest');

// Cấu trúc một bản ghi Q&A trả về
export const QAResponseSchema = z.object({
  id: z.string(),
  content: z.string(),
  answer: z.string().nullable(),
  isPublic: z.boolean(),
  createdAt: z.string(),
  sender: z.object({ name: z.string().nullable() }).optional(),
}).openapi('QAResponse');

// Response chuẩn cho API
export const QAListResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(QAResponseSchema),
}).openapi('QAListResponse');