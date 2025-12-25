import { z } from '@hono/zod-openapi';

// --- THÊM DÒNG NÀY ---
export const ErrorResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
}).openapi('ErrorResponse');

export const CreateJobSchema = z.object({
  title: z.string().min(5).openapi({ example: 'Công nhân lắp ráp' }),
  companyName: z.string().openapi({ example: 'Tập đoàn XXX' }),
  description: z.string().openapi({ example: 'Mô tả...' }),
  requirements: z.string().openapi({ example: 'Yêu cầu...' }),
  location: z.string().openapi({ example: 'Hà Nội' }),
  salaryRange: z.string().optional().openapi({ example: '10tr' }),
  startDate: z.string().openapi({ example: '2024-12-01T00:00:00Z' }),
  deadline: z.string().openapi({ example: '2024-11-25T00:00:00Z' }),
  applyLink: z.string().openapi({ example: 'https://bit.ly/xxx' }),
  hotline: z.string().openapi({ example: '0987654321' }),
}).openapi('CreateJobRequest');

export const JobResponseSchema = z.object({
  success: z.boolean(),
  data: z.any(),
  marketingText: z.string(),
}).openapi('JobResponse');
export const UpdateJobSchema = CreateJobSchema.partial().openapi('UpdateJobRequest');

export const JobIdParamSchema = z.object({
  id: z.string().openapi({ 
    param: { name: 'id', in: 'path' },
    example: '656e1234567890abcdef' 
  }),
});
export const BulkDeleteJobSchema = z.object({
  ids: z.array(z.string()).min(1).openapi({ 
    example: ['656e1...', '656e2...'],
    description: 'Mảng các ID bài đăng cần xóa'
  }),
}).openapi('BulkDeleteJobRequest');

export const BulkDeleteResponseSchema = z.object({
  success: z.boolean(),
  count: z.number().openapi({ example: 5 }),
  message: z.string(),
}).openapi('BulkDeleteResponse');
// src/schemas/job.schema.ts

export const GetMyJobsResponseSchema = z.object({
  success: z.boolean(),
  count: z.number(),
  data: z.array(z.object({
    id: z.string(),
    title: z.string(),
    companyName: z.string().nullable(),
    location: z.string(),
    status: z.string(),
    createdAt: z.string(),
    deadline: z.string().nullable(),
  })),
}).openapi('GetMyJobsResponse');