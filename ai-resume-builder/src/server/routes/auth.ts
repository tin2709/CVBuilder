// src/server/routes/auth.ts
import { OpenAPIHono } from '@hono/zod-openapi';
import { registerRouteDoc, loginRouteDoc, forgotPasswordDoc, resetPasswordDoc } from '@/schemas/api-doc';
import { authService } from "@/services/auth.service";

const authRoute = new OpenAPIHono();

authRoute.openapi(registerRouteDoc, async (c) => {
  const data = c.req.valid('json');
  try {
    const result = await authService.register({
      email: data.email,
      password: data.password,
      name: data.fullName,
      role: data.role?.toUpperCase() || "CANDIDATE"
    }); 
    return c.json({ success: true, message: "Đăng ký thành công", user: result }, 200);
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 400);
  }
});

authRoute.openapi(loginRouteDoc, async (c) => {
  const data = c.req.valid('json');
  try {
    const result = await authService.login({ email: data.email, password: data.password });
    return c.json({ success: true, message: "Đăng nhập thành công", ...result }, 200);
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 401);
  }
});

// Tương tự cho forgot-password và reset-password...
authRoute.openapi(forgotPasswordDoc, async (c) => {
    const { email } = c.req.valid('json');
    try {
      await authService.forgotPassword(email);
      // Trả về đúng kiểu AuthResponseSchema (status 200)
      return c.json({ success: true, message: "Mã OTP đã gửi" }, 200);
    } catch (error: any) {
      // Trả về đúng kiểu ErrorResponseSchema (status 400)
      return c.json({ 
        success: false, 
        message: String(error.message || "Lỗi không xác định") 
      }, 400); // 400 bây giờ đã hợp lệ vì đã khai báo trong Doc
    }
});
authRoute.openapi(resetPasswordDoc, async (c) => {
    const body = c.req.valid('json');
    try {
      await authService.resetPassword(body);
      return c.json({ success: true, message: "Thành công" }, 200);
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 400);
    }
});

export default authRoute;