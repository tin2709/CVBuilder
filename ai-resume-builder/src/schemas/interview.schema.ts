import { z } from '@hono/zod-openapi';
export const ErrorResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
}).openapi('ErrorResponse');

export const InterviewQuerySchema = z.object({
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
  search: z.string().optional(),
  sort: z.enum(['asc', 'desc']).optional().default('desc'),
  status: z.string().optional(),
});
// Schema tạo lịch phỏng vấn
export const CreateInterviewSchema = z.object({
  applicationId: z.string().openapi({ example: '6581...' }),
  date: z.string().datetime().openapi({ example: '2025-12-26T09:00:00Z' }),
  location: z.string().optional().openapi({ example: 'Phòng họp tầng 5 hoặc link Google Meet' }),
  notes: z.string().optional(),
});

// Schema cập nhật kết quả phỏng vấn (Dùng cho real-time notes và rating)
export const UpdateInterviewSchema = z.object({
  date: z.string().datetime().optional(),
  notes: z.string().optional(), // Text thuần
  rating: z.number().min(1).max(5).optional().openapi({ example: 4 }),
  status: z.enum(['PENDING', 'COMPLETED', 'CANCELLED']).optional(),
});
export const BulkDeleteSchema = z.object({
  ids: z.array(z.string()).min(1, "Phải chọn ít nhất 1 mục để xóa"),
});

export const InterviewIdParamSchema = z.object({
  id: z.string().openapi({ example: '6582...' }),
});