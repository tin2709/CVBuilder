// src/middlewares/auth.middleware.ts
import { Context, Next } from 'hono';
import { verify } from 'hono/jwt';

export const verifyRole = (requiredRole: string) => {
  return async (c: Context, next: Next) => {
    const authHeader = c.req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ success: false, message: 'Bạn cần đăng nhập để thực hiện thao tác này' }, 401);
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'default_secret';

    try {
      // 1. Giải mã token
      const payload = await verify(token, secret);
      
      // 2. Kiểm tra Role
      if (payload.role !== requiredRole) {
        return c.json({ 
          success: false, 
          message: `Cấm truy cập: Bạn cần quyền ${requiredRole} để thực hiện hành động này` 
        }, 403);
      }

      // 3. Lưu thông tin user vào context để dùng ở route sau nếu cần
      c.set('jwtPayload', payload);
      
      await next();
    } catch (e) {
      return c.json({ success: false, message: 'Token không hợp lệ hoặc đã hết hạn' }, 401);
    }
  };
};