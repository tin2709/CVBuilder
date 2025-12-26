// src/middlewares/auth.middleware.ts
import { Context, Next } from 'hono';
import { verify } from 'hono/jwt';

// Sửa: Chấp nhận string hoặc mảng string
export const verifyRole = (requiredRole: string | string[]) => {
  return async (c: Context, next: Next) => {
    const authHeader = c.req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ success: false, message: 'Bạn cần đăng nhập' }, 401);
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'default_secret';

    try {
      const payload = await verify(token, secret);
      
      // Chuyển đổi thành mảng để xử lý đồng nhất
      const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
      
      // Kiểm tra xem role của user có nằm trong danh sách cho phép không
      if (!roles.includes(payload.role as string)) {
        return c.json({ 
          success: false, 
          message: `Cấm truy cập: Bạn cần quyền ${roles.join('/')}` 
        }, 403);
      }

      c.set('jwtPayload', payload);
      await next();
    } catch (e) {
      return c.json({ success: false, message: 'Token hết hạn' }, 401);
    }
  };
};