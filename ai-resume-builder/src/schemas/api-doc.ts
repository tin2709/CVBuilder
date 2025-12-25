import { createRoute } from '@hono/zod-openapi';
import * as auth from './auth.schema';
import * as cand from './candidate.schema';
import * as job from './job.schema';
import { z } from '@hono/zod-openapi';
import * as qa from './qa.schema';

const AdminReviewSchema = z.object({
  action: z.enum(['APPROVE', 'REJECT']),
  message: z.string().optional() // Lý do từ chối nếu có
});

// --- Auth Routes Docs ---
export const registerRouteDoc = createRoute({
  method: 'post',
  path: '/register',
  summary: 'Đăng ký tài khoản mới',
  request: { body: { content: { 'application/json': { schema: auth.RegisterRequestSchema } } } },
  responses: {
    200: { content: { 'application/json': { schema: auth.AuthResponseSchema } }, description: 'Đăng ký thành công' },
    400: { content: { 'application/json': { schema: auth.ErrorResponseSchema } }, description: 'Lỗi dữ liệu' },
  },
});

export const loginRouteDoc = createRoute({
  method: 'post',
  path: '/login',
  summary: 'Đăng nhập',
  request: { body: { content: { 'application/json': { schema: auth.LoginRequestSchema } } } },
  responses: {
    200: { content: { 'application/json': { schema: auth.AuthResponseSchema } }, description: 'Đăng nhập thành công' },
    401: { content: { 'application/json': { schema: auth.ErrorResponseSchema } }, description: 'Sai tài khoản/mật khẩu' },
  },
});

// src/schemas/api-doc.ts

export const forgotPasswordDoc = createRoute({
  method: 'post',
  path: '/forgot-password',
  summary: 'Quên mật khẩu',
  request: { body: { content: { 'application/json': { schema: auth.ForgotPasswordRequestSchema } } } },
  responses: {
    200: { 
      content: { 'application/json': { schema: auth.AuthResponseSchema } }, 
      description: 'Đã gửi OTP' 
    },
    // PHẢI NẰM TRONG RESPONSES
    400: { 
      content: { 'application/json': { schema: auth.ErrorResponseSchema } }, 
      description: 'Lỗi yêu cầu hoặc email không tồn tại' 
    }
  },
});

export const resetPasswordDoc = createRoute({
  method: 'post',
  path: '/reset-password',
  summary: 'Đặt lại mật khẩu với OTP',
  request: { body: { content: { 'application/json': { schema: auth.ResetPasswordRequestSchema } } } },
  responses: {
    200: { 
      content: { 'application/json': { schema: auth.AuthResponseSchema } }, 
      description: 'Đổi mật khẩu thành công' 
    },
    // PHẢI NẰM TRONG RESPONSES
    400: { 
      content: { 'application/json': { schema: auth.ErrorResponseSchema } }, 
      description: 'Mã OTP sai hoặc hết hạn' 
    }
  },
});
// --- Candidate Routes Docs ---
export const candidateSearchDoc = createRoute({
  method: 'get',
  path: '/search',
  summary: 'Tìm kiếm ứng viên (Yêu cầu quyền Recruiter)',
  request: { query: cand.CandidateSearchQuerySchema },
  responses: {
    200: { content: { 'application/json': { schema: cand.CandidateSearchResponseSchema } }, description: 'Thành công' },
    500: { content: { 'application/json': { schema: auth.ErrorResponseSchema } }, description: 'Lỗi server' },
  },
});
export const createJobDoc = createRoute({
  method: 'post',
  path: '/create',
  summary: 'Đăng tin tuyển dụng (Recruiter)',
  request: { 
    body: { content: { 'application/json': { schema: job.CreateJobSchema } } } 
  },
  responses: {
    201: { 
      content: { 'application/json': { schema: job.JobResponseSchema } }, 
      description: 'Thành công' 
    }, // <-- Kiểm tra dấu phẩy này
    400: { 
      content: { 'application/json': { schema: job.ErrorResponseSchema } }, 
      description: 'Lỗi dữ liệu' 
    }, // <-- Kiểm tra dấu phẩy này
    401: { 
      content: { 'application/json': { schema: job.ErrorResponseSchema } }, 
      description: 'Chưa đăng nhập hoặc Token sai' 
    },
    403: { 
      content: { 'application/json': { schema: job.ErrorResponseSchema } }, 
      description: 'Không có quyền' 
    } // Dấu phẩy ở đây cũng được hoặc không (nếu là cuối cùng)
  }, // <-- Dòng 87 bạn bị thiếu dấu đóng ngoặc hoặc dấu phẩy ở đây
});
// --- Update Job Doc ---
// --- Update Job Doc ---
export const updateJobDoc = createRoute({
  method: 'put',
  path: '/update/{id}',
  summary: 'Cập nhật bài đăng',
  request: { 
    params: job.JobIdParamSchema,
    body: { content: { 'application/json': { schema: job.UpdateJobSchema } } } 
  },
  responses: {
    200: { content: { 'application/json': { schema: job.JobResponseSchema } }, description: 'Cập nhật thành công' }, // Trả về data job
    400: { content: { 'application/json': { schema: job.ErrorResponseSchema } }, description: 'Lỗi dữ liệu' },
    401: { content: { 'application/json': { schema: job.ErrorResponseSchema } }, description: 'Chưa đăng nhập' },
    403: { content: { 'application/json': { schema: job.ErrorResponseSchema } }, description: 'Không có quyền' },
    404: { content: { 'application/json': { schema: job.ErrorResponseSchema } }, description: 'Không tìm thấy' },
  },
});

// --- Delete Job Doc ---
export const deleteJobDoc = createRoute({
  method: 'delete',
  path: '/delete/{id}',
  summary: 'Xóa bài đăng',
  request: { params: job.JobIdParamSchema },
  responses: {
    200: { content: { 'application/json': { schema: job.ErrorResponseSchema } }, description: 'Xóa thành công' }, // Trả về tin nhắn
    400: { content: { 'application/json': { schema: job.ErrorResponseSchema } }, description: 'Lỗi dữ liệu' },
    401: { content: { 'application/json': { schema: job.ErrorResponseSchema } }, description: 'Chưa đăng nhập' },
    403: { content: { 'application/json': { schema: job.ErrorResponseSchema } }, description: 'Không có quyền' },
    404: { content: { 'application/json': { schema: job.ErrorResponseSchema } }, description: 'Không tìm thấy' },
  },
});
export const deleteManyJobsDoc = createRoute({
  method: 'delete',
  path: '/bulk-delete',
  summary: 'Xóa nhiều bài đăng cùng lúc',
  request: { 
    body: { content: { 'application/json': { schema: job.BulkDeleteJobSchema } } } 
  },
  responses: {
    200: { content: { 'application/json': { schema: job.BulkDeleteResponseSchema } }, description: 'Xóa thành công' },
    400: { content: { 'application/json': { schema: job.ErrorResponseSchema } }, description: 'Lỗi dữ liệu' },
    401: { content: { 'application/json': { schema: job.ErrorResponseSchema } }, description: 'Chưa đăng nhập' },
    403: { content: { 'application/json': { schema: job.ErrorResponseSchema } }, description: 'Không có quyền' },
  },
});
// --- Get My Jobs Doc ---
export const getMyJobsDoc = createRoute({
  method: 'get',
  path: '/my-jobs', // URL: /api/jobs/my-jobs
  summary: 'Lấy danh sách bài đăng của tôi (Recruiter)',
  responses: {
    200: { 
      content: { 'application/json': { schema: job.GetMyJobsResponseSchema } }, 
      description: 'Thành công' 
    },
    401: { 
      content: { 'application/json': { schema: job.ErrorResponseSchema } }, 
      description: 'Chưa đăng nhập' 
    },
    400: { 
      content: { 'application/json': { schema: job.ErrorResponseSchema } }, 
      description: 'Lỗi hệ thống' 
    },
  },
});
// 1. Gửi câu hỏi
// src/schemas/api-doc.ts

// 1. Hỏi
export const askQuestionDoc = createRoute({
  method: 'post',
  path: '/ask',
  summary: 'Ứng viên đặt câu hỏi',
  request: { body: { content: { 'application/json': { schema: qa.AskQuestionSchema } } } },
  responses: {
    201: { content: { 'application/json': { schema: job.ErrorResponseSchema } }, description: 'Thành công' },
    400: { content: { 'application/json': { schema: job.ErrorResponseSchema } }, description: 'Lỗi dữ liệu/Spam' },
    401: { content: { 'application/json': { schema: job.ErrorResponseSchema } }, description: 'Chưa đăng nhập' },
    404: { content: { 'application/json': { schema: job.ErrorResponseSchema } }, description: 'Không thấy bài đăng' }, // THÊM DÒNG NÀY
  },
});

// 2. Trả lời
export const answerQuestionDoc = createRoute({
  method: 'put',
  path: '/answer/{id}',
  summary: 'Nhà tuyển dụng phản hồi',
  request: { 
    params: job.JobIdParamSchema, 
    body: { content: { 'application/json': { schema: qa.AnswerQuestionSchema } } } 
  },
  responses: {
    200: { content: { 'application/json': { schema: job.ErrorResponseSchema } }, description: 'Thành công' },
    400: { content: { 'application/json': { schema: job.ErrorResponseSchema } }, description: 'Lỗi hệ thống' }, // THÊM DÒNG NÀY
    401: { content: { 'application/json': { schema: job.ErrorResponseSchema } }, description: 'Chưa đăng nhập' }, // THÊM DÒNG NÀY
    403: { content: { 'application/json': { schema: job.ErrorResponseSchema } }, description: 'Không có quyền' },
    404: { content: { 'application/json': { schema: job.ErrorResponseSchema } }, description: 'Không thấy câu hỏi' }, // THÊM DÒNG NÀY
  },
});

// 3. Lấy danh sách Q&A cho một bài Job
export const getJobQADoc = createRoute({
  method: 'get',
  path: '/jobs/{id}/qa',
  summary: 'Lấy danh sách Q&A (Hỗ trợ ẩn/hiện theo quyền)',
  request: { params: job.JobIdParamSchema },
  responses: {
    200: { content: { 'application/json': { schema: qa.QAListResponseSchema } }, description: 'Thành công' },
  },
});
// 1. Gửi yêu cầu TẠO
export const requestCreateCompanyDoc = createRoute({
  method: 'post',
  path: '/request-create',
  summary: 'Recruiter gửi yêu cầu thêm công ty',
  request: { body: { content: { 'application/json': { schema: job.CreateCompanySchema } } } },
  responses: { 
    201: { content: { 'application/json': { schema: job.ErrorResponseSchema } }, description: 'Thành công' },
    400: { content: { 'application/json': { schema: job.ErrorResponseSchema } }, description: 'Lỗi dữ liệu' },
    401: { content: { 'application/json': { schema: job.ErrorResponseSchema } }, description: 'Chưa đăng nhập' },
  },
});

// 2. Gửi yêu cầu SỬA
// src/schemas/api-doc.ts

export const requestUpdateCompanyDoc = createRoute({
  method: 'put',
  path: '/request-update/{id}',
  summary: 'Recruiter gửi yêu cầu sửa đổi thông tin',
  request: { 
    params: job.JobIdParamSchema,
    body: { content: { 'application/json': { schema: job.CreateCompanySchema.partial() } } } 
  },
  responses: { 
    200: { 
      content: { 'application/json': { schema: job.ErrorResponseSchema } }, 
      description: 'Cập nhật thành công' 
    },
    // BẮT BUỘC: Thêm tất cả các mã status code xuất hiện trong code của bạn
    400: { 
      content: { 'application/json': { schema: job.ErrorResponseSchema } }, 
      description: 'Lỗi dữ liệu' 
    },
    401: { 
      content: { 'application/json': { schema: job.ErrorResponseSchema } }, 
      description: 'Chưa đăng nhập' 
    },
    403: { 
      content: { 'application/json': { schema: job.ErrorResponseSchema } }, 
      description: 'Không có quyền sở hữu công ty này' 
    },
    404: { 
      content: { 'application/json': { schema: job.ErrorResponseSchema } }, 
      description: 'Không tìm thấy công ty' 
    },
  },
});

// 3. Gửi yêu cầu XÓA
export const requestDeleteCompanyDoc = createRoute({
  method: 'delete',
  path: '/request-delete/{id}',
  summary: 'Recruiter gửi yêu cầu xóa',
  request: { params: job.JobIdParamSchema },
  responses: { 
    200: { content: { 'application/json': { schema: job.ErrorResponseSchema } }, description: 'Thành công' },
    400: { content: { 'application/json': { schema: job.ErrorResponseSchema } }, description: 'Lỗi hệ thống' },
    401: { content: { 'application/json': { schema: job.ErrorResponseSchema } }, description: 'Chưa đăng nhập' },
    403: { content: { 'application/json': { schema: job.ErrorResponseSchema } }, description: 'Không có quyền' },
  },
});

// 4. Admin duyệt TẠO/XÓA
export const adminReviewStatusDoc = createRoute({
  method: 'patch',
  path: '/admin/review-status/{id}',
  summary: 'Admin duyệt Tạo/Xóa',
  request: { 
    params: job.JobIdParamSchema, 
    body: { content: { 'application/json': { schema: AdminReviewSchema } } } 
  },
  responses: { 
    200: { content: { 'application/json': { schema: job.ErrorResponseSchema } }, description: 'Thành công' },
    400: { content: { 'application/json': { schema: job.ErrorResponseSchema } }, description: 'Lỗi dữ liệu' },
    404: { content: { 'application/json': { schema: job.ErrorResponseSchema } }, description: 'Không tìm thấy' },
  },
});

// 5. Admin duyệt SỬA
export const adminReviewUpdateDoc = createRoute({
  method: 'patch',
  path: '/admin/review-update/{id}',
  summary: 'Admin duyệt bản thảo sửa đổi',
  request: { 
    params: job.JobIdParamSchema, 
    body: { content: { 'application/json': { schema: AdminReviewSchema } } } 
  },
  responses: { 
    200: { content: { 'application/json': { schema: job.ErrorResponseSchema } }, description: 'Thành công' },
    400: { content: { 'application/json': { schema: job.ErrorResponseSchema } }, description: 'Lỗi dữ liệu' },
    404: { content: { 'application/json': { schema: job.ErrorResponseSchema } }, description: 'Không tìm thấy' },
  },
});