import { OpenAPIHono } from '@hono/zod-openapi';
import { getMyNotificationsDoc, markAsReadDoc,createNotificationDoc } from '@/schemas/api-doc';
import { prisma } from '@/lib/db';
import { verifyRole } from '@/middlewares/auth.middleware';

type Variables = {
  jwtPayload: {
    id: string;
    role: string;
    email: string;
  }
}

const notificationRoute = new OpenAPIHono<{ Variables: Variables }>();

// Tất cả các API thông báo đều yêu cầu đăng nhập (bất kể role nào)
notificationRoute.use('/all', verifyRole('CANDIDATE'));

// --- 1. LẤY DANH SÁCH THÔNG BÁO CỦA TÔI ---
notificationRoute.openapi(getMyNotificationsDoc, async (c) => {
  const payload = c.get('jwtPayload');

  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: payload.id },
      orderBy: { createdAt: 'desc' }
    });
    
    return c.json(notifications, 200);
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 400);
  }
});
notificationRoute.use('/create', verifyRole('RECRUITER'));
notificationRoute.openapi(createNotificationDoc, async (c) => {
  const body = c.req.valid('json');

  try {
    // Kiểm tra xem người nhận có tồn tại không
    const userExists = await prisma.user.findUnique({
      where: { id: body.userId }
    });

    if (!userExists) {
      return c.json({ success: false, message: "Người nhận không tồn tại" }, 400);
    }

    const notification = await prisma.notification.create({
      data: {
        userId: body.userId,
        title: body.title,
        message: body.message,
        type: body.type,
        link: body.link || null,
        isRead: false
      }
    });

    return c.json({
      ...notification,
      createdAt: notification.createdAt.toISOString()
    }, 201);
    
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 400);
  }
});
// --- 2. ĐÁNH DẤU LÀ ĐÃ ĐỌC ---
notificationRoute.use('/:id/read', verifyRole('CANDIDATE'));
notificationRoute.openapi(markAsReadDoc, async (c) => {
  const payload = c.get('jwtPayload');
  const { id } = c.req.valid('param');

  try {
    const notification = await prisma.notification.findUnique({
      where: { id }
    });

    if (!notification) {
      return c.json({ success: false, message: "Không tìm thấy thông báo" }, 404);
    }

    // Bảo mật: Chỉ người sở hữu thông báo mới được đánh dấu đọc
    if (notification.userId !== payload.id) {
      return c.json({ success: false, message: "Không có quyền truy cập thông báo này" }, 403);
    }

    await prisma.notification.update({
      where: { id },
      data: { isRead: true }
    });

    return c.json({ success: true, message: "Đã đánh dấu là đã đọc" }, 200);
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 400);
  }
});

export default notificationRoute;