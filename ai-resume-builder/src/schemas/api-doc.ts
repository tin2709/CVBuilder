import { createRoute } from '@hono/zod-openapi';
import * as auth from './auth.schema';
import * as cand from './candidate.schema';

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