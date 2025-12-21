import { Context } from 'hono';
import { authService } from '../services/auth.service';

export const authController = {
  async register(c: Context) {
    try {
      const body = await c.req.json();
      
      // Validation cơ bản (Nên dùng thêm thư viện Zod sau này)
      if (!body.email || !body.password) {
        return c.json({ success: false, message: 'Email và mật khẩu là bắt buộc' }, 400);
      }

      const user = await authService.register(body);
      
      return c.json({
        success: true,
        message: 'Đăng ký thành công',
        data: user
      }, 201);
      
    } catch (error: any) {
      return c.json({
        success: false,
        message: error.message
      }, 400);
    }
  }
};