import { createRoute } from '@hono/zod-openapi';
import * as auth from './auth.schema';
import * as cand from './candidate.schema';
import * as job from './job.schema';

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