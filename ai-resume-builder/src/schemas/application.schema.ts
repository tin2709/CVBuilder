import { z } from '@hono/zod-openapi';

export const ErrorResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
}).openapi('ErrorResponse');
export const CreateApplicationSchema = z.object({
  jobId: z.string().openapi({ example: '6581...' }),
});

export const UpdateApplicationStatusSchema = z.object({
  status: z.enum(['PENDING', 'REVIEWING', 'INTERVIEW', 'OFFERED', 'REJECTED']),
});

export const ApplicationQuerySchema = z.object({
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
  jobId: z.string().optional(), // Recruiter lọc theo Job
  status: z.string().optional(),
});

export const ApplicationResponseSchema = z.object({
  id: z.string(),
  jobId: z.string(),
  candidateId: z.string(),
  status: z.string(),
  aiMatchScore: z.number().nullable(),
  aiAnalysis: z.string().nullable(),
  appliedAt: z.string(),
});
export const ApplicationIdParamSchema = z.object({
  id: z.string().openapi({ 
    param: { name: 'id', in: 'path' },
    example: '6581234567890abcdef12345' 
  }),
});

/**
 * 2. Schema cho việc xóa nhiều đơn cùng lúc (Bulk Delete)
 * Swagger sẽ hiển thị một mảng chuỗi trong Request Body
 */
export const BulkDeleteApplicationSchema = z.object({
  ids: z.array(z.string()).min(1, "Cần ít nhất 1 ID để xóa").openapi({
    example: ['6581...', '6582...'],
    description: 'Danh sách các ID đơn ứng tuyển cần xóa'
  }),
});

/**
 * 3. Schema phản hồi khi xóa thành công
 */
export const ApplicationDeleteResponseSchema = z.object({
  success: z.boolean().openapi({ example: true }),
  message: z.string().openapi({ example: 'Đã xóa đơn ứng tuyển thành công' }),
});