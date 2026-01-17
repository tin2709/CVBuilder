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
export const CreateCompanySchema = z.object({
  name: z.string().min(2).openapi({ example: 'Công ty Công nghệ Huân Lâm' }),
  description: z.string().optional().openapi({ example: 'Chuyên thiết kế nội thất và giải pháp F&B' }),
  address: z.string().openapi({ example: '350 Nguyễn Thị Minh Khai, Phường Bàn Cờ, TPHCM' }),
  website: z.string().url().optional().openapi({ example: 'https://huanlam.vn' }),
  logoUrl: z.string().url().optional().openapi({ example: 'https://cdn.com/logo.png' }),
}).openapi('CreateCompanyRequest');
export const JobSearchQuerySchema = z.object({
  search: z.string().optional().openapi({ 
    param: { name: 'search', in: 'query' },
    example: 'Lập trình viên',
    description: 'Tìm kiếm theo tiêu đề hoặc tên công ty'
  }),
  location: z.string().optional().openapi({ 
    param: { name: 'location', in: 'query' },
    example: 'Hà Nội' 
  }),
  categoryId: z.string().optional().openapi({ 
    param: { name: 'categoryId', in: 'query' },
    example: '656e123...' 
  }),
  salaryRange: z.string().optional().openapi({ 
    param: { name: 'salaryRange', in: 'query' },
    example: '10tr - 20tr' }),
  page: z.string().optional().default('1').openapi({ 
    param: { name: 'page', in: 'query' },
    example: '1',
    description: 'Số trang hiện tại'
  }),
  limit: z.string().optional().default('10').openapi({ 
    param: { name: 'limit', in: 'query' },
    example: '10',
    description: 'Số lượng bài đăng trên mỗi trang'
  }),
}).openapi('JobSearchQuery');

// 2. Schema thành phần phụ (Company & Category lồng trong Job)
const CompanyInJobSchema = z.object({
  id: z.string(),
  name: z.string(),
  logoUrl: z.string().nullable(),
}).openapi('CompanyShortInfo');

const CategoryInJobSchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string().nullable(),
}).openapi('CategoryShortInfo');

// 3. Schema cho một Item trong danh sách Job (Job Card)
export const JobListItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  location: z.string(),
  salaryRange: z.string().nullable(),
  createdAt: z.string(),
  deadline: z.string().nullable(),
  company: CompanyInJobSchema.nullable(),
  category: CategoryInJobSchema.nullable(),
  // Các trường bổ trợ để UI hiển thị trạng thái của Candidate hiện tại
  isSaved: z.boolean().optional().openapi({ description: 'User hiện tại đã lưu chưa' }),
  isApplied: z.boolean().optional().openapi({ description: 'User hiện tại đã ứng tuyển chưa' }),
}).openapi('JobListItem');

// 4. Schema phản hồi danh sách Job (cho trang Dashboard/Search)
export const JobListResponseSchema = z.object({
  success: z.boolean(),
  count: z.number(),
  total: z.number(), // Tổng số bản ghi trong DB để phân trang
  data: z.array(JobListItemSchema),
}).openapi('JobListResponse');

// 5. Schema cho chi tiết một Job (Full Detail)
export const JobDetailSchema = z.object({
  id: z.string(),
  title: z.string(),
  companyName: z.string().nullable(),
  description: z.string(),
  requirements: z.string(),
  location: z.string(),
  salaryRange: z.string().nullable(),
  startDate: z.string().nullable(),
  deadline: z.string().nullable(),
  applyLink: z.string().nullable(),
  hotline: z.string().nullable(),
  status: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
    company: CompanyInJobSchema.extend({
    description: z.string().nullable(),
    address: z.string().nullable(),
    website: z.string().nullable(),
  }).nullable(),
  category: CategoryInJobSchema.nullable(),
  // Metadata cho Candidate
  isSaved: z.boolean(),
  applicationStatus: z.enum(['PENDING', 'REVIEWING', 'INTERVIEW', 'OFFERED', 'REJECTED']).nullable(),
}).openapi('JobDetail');

export const JobDetailResponseSchema = z.object({
  success: z.boolean(),
  data: JobDetailSchema,
}).openapi('JobDetailResponse');

// 6. Schema cho danh sách công việc đã lưu (Tận dụng lại JobListResponse)
export const GetSavedJobsResponseSchema = JobListResponseSchema.openapi('GetSavedJobsResponse');

export const CompanyStatSchema = z.object({
  totalJobs: z.number(),
  totalApplications: z.number(),
  totalInterviews: z.number(),
  avgAiScore: z.number(),
}).openapi('CompanyStat');