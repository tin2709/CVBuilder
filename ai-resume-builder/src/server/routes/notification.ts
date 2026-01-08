import { OpenAPIHono } from '@hono/zod-openapi';
import { prisma } from '@/lib/db';
import { verifyRole } from '@/middlewares/auth.middleware';
import { Liquid } from 'liquidjs';
import { 
  getMyNotificationsDoc, 
  markAsReadDoc, 
  createNotificationDoc,
} from '@/schemas/api-doc';
import { NOTIFICATION_TEMPLATES, NotificationTemplateKey } from '@/constants/notifications';
import crypto from 'crypto';

// Khởi tạo LiquidJS engine
const engine = new Liquid();

type Variables = {
  jwtPayload: {
    id: string;
    role: string;
    email: string;
  }
}

// Hàm lấy socket io từ global (đã được gán ở server.ts)
const getGlobalIo = () => (global as any).io;

// Hàm helper để chuẩn hóa dữ liệu trả về khớp với NotificationSchema
const mapToNotificationSchema = (n: any) => ({
  id: n.id,
  templateKey: n.templateKey,
  payload: (n.payload as Record<string, any>) || null,
  content: n.content || "",
  type: n.type,
  isRead: n.isRead,
  link: n.link || null,
  createdAt: n.createdAt.toISOString(),
});

const notificationRoute = new OpenAPIHono<{ Variables: Variables }>();

/**
 * 1. LẤY TẤT CẢ THÔNG BÁO CỦA NGƯỜI DÙNG HIỆN TẠI
 */
notificationRoute.openapi(getMyNotificationsDoc, async (c) => {
  const user = c.get('jwtPayload');

  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 50 
    });

    const formatted = notifications.map(n => mapToNotificationSchema(n));
    return c.json(formatted, 200);
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 400);
  }
});

/**
 * 2. TẠO THÔNG BÁO MỚI (Digest + Idempotency + Socket.io)
 */
notificationRoute.use('/create', verifyRole(['RECRUITER', 'ADMIN']));

notificationRoute.openapi(createNotificationDoc, async (c) => {
  const { userId, templateKey, payload, link, targetId } = c.req.valid('json');
  const DIGEST_WINDOW_MS = 10 * 60 * 1000; // 10 phút
  const io = getGlobalIo(); // Lấy instance Socket.io

  try {
    const template = NOTIFICATION_TEMPLATES[templateKey as NotificationTemplateKey];
    if (!template) return c.json({ success: false, message: "Template không hợp lệ" }, 400);

    // --- BƯỚC 1: XỬ LÝ DIGEST (GOM THÔNG BÁO) ---
    if (template.allowDigest && targetId) {
      const digestKey = `DIGEST-${userId}-${templateKey}-${targetId}`;
      const existingDigest = await prisma.notification.findFirst({
        where: {
          digestKey,
          userId,
          isRead: false,
          updatedAt: { gte: new Date(Date.now() - DIGEST_WINDOW_MS) }
        }
      });

      if (existingDigest) {
        const currentCount = (existingDigest as any).digestCount || 1;
        const newCount = currentCount + 1;
        const digestPayload = { ...payload, count: newCount };
        const newContent = await engine.parseAndRender(template.body, digestPayload);

        const updatedNoti = await prisma.notification.update({
          where: { id: existingDigest.id },
          data: {
            digestCount: newCount,
            payload: digestPayload,
            content: newContent,
            isDigested: true,
            updatedAt: new Date()
          }
        });

        const formatted = mapToNotificationSchema(updatedNoti);
        
        // Gửi socket cập nhật (gom nhóm)
        if (io) io.to(userId).emit('notification_updated', formatted);

        return c.json(formatted, 200);
      }
    }

    // --- BƯỚC 2: XỬ LÝ IDEMPOTENCY (CHỐNG TRÙNG LẶP) ---
    let idempotencyKey: string | null = null;
    if (targetId && !template.allowDigest) {
      const rawKey = `${userId}-${templateKey}-${targetId}`;
      idempotencyKey = crypto.createHash('md5').update(rawKey).digest('hex');

      const existingNoti = await prisma.notification.findUnique({
        where: { idempotencyKey }
      });

      if (existingNoti) {
        return c.json(mapToNotificationSchema(existingNoti), 200);
      }
    }

    // --- BƯỚC 3: RENDER VÀ TẠO MỚI ---
    const finalPayload = template.allowDigest ? { ...payload, count: 1 } : payload;
    const renderedContent = await engine.parseAndRender(template.body, finalPayload);

    const newNotification = await prisma.notification.create({
      data: {
        userId,
        templateKey,
        payload: finalPayload,
        content: renderedContent,
        type: template.type as any,
        link: link || null,
        idempotencyKey,
        digestKey: template.allowDigest && targetId ? `DIGEST-${userId}-${templateKey}-${targetId}` : null,
        digestCount: 1
      } as any
    });

    const formatted = mapToNotificationSchema(newNotification);

    // Gửi socket thông báo mới
    if (io) io.to(userId).emit('new_notification', formatted);

    return c.json(formatted, 201);

  } catch (error: any) {
    if (error.code === 'P2002') {
      return c.json({ success: false, message: "Yêu cầu đang được xử lý." }, 409);
    }
    return c.json({ success: false, message: error.message }, 400);
  }
});

/**
 * 3. ĐÁNH DẤU MỘT THÔNG BÁO LÀ ĐÃ ĐỌC
 */
notificationRoute.openapi(markAsReadDoc, async (c) => {
  const user = c.get('jwtPayload');
  const { id } = c.req.valid('param');

  try {
    const notification = await prisma.notification.findUnique({ where: { id } });

    if (!notification || notification.userId !== user.id) {
      return c.json({ success: false, message: "Không tìm thấy hoặc không có quyền" }, 403);
    }

    await prisma.notification.update({
      where: { id },
      data: { isRead: true }
    });

    return c.json({ success: true, message: "Đã đọc" }, 200);
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 400);
  }
});

export default notificationRoute;