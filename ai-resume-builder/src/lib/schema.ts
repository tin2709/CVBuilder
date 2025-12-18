// src/lib/schemas.ts
import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string()
    .min(1, "Vui lòng nhập email")
    .email("Email không hợp lệ"),
  password: z.string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

export const RegisterSchema = LoginSchema.extend({
  fullName: z.string()
    .min(2, "Họ tên phải có ít nhất 2 ký tự"),
 role: z.enum(["candidate", "recruiter"])
  .optional()
  .refine(Boolean, {
    message: "Vui lòng chọn vai trò",
  }),

  // Avatar là optional (lưu base64 hoặc url), không bắt buộc
  avatar: z.string().optional(),
});

export type LoginPayload = z.infer<typeof LoginSchema>;
export type RegisterPayload = z.infer<typeof RegisterSchema>;