import { z } from '@hono/zod-openapi';

// --- Auth Schemas ---
export const RegisterRequestSchema = z.object({
  fullName: z.string().openapi({ example: 'Nguyen Van A' }),
  email: z.string().email().openapi({ example: 'user@example.com' }),
  password: z.string().min(6).openapi({ example: '123456' }),
  role: z.enum(['candidate', 'recruiter']).optional().openapi({ example: 'candidate' }),
}).openapi('RegisterRequest');

export const LoginRequestSchema = z.object({
  email: z.string().email().openapi({ example: 'user@example.com' }),
  password: z.string().openapi({ example: '123456' }),
}).openapi('LoginRequest');

export const ForgotPasswordRequestSchema = z.object({
  email: z.string().email().openapi({ example: 'user@example.com' }),
}).openapi('ForgotPasswordRequest');

export const ResetPasswordRequestSchema = z.object({
  email: z.string().email(),
  otp: z.string().openapi({ example: '123456' }),
  newPassword: z.string().min(6),
}).openapi('ResetPasswordRequest');

// --- Response Schemas ---
export const AuthResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  user: z.any().optional(),
  accessToken: z.string().optional(),
}).openapi('AuthResponse');

export const ErrorResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
}).openapi('ErrorResponse');