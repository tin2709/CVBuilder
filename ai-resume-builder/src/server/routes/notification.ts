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
import crypto from 'crypto'; // Thư viện tạo hash

// Khởi tạo LiquidJS engine
const engine = new Liquid();

type Variables = {
  jwtPayload: {
    id: string;
    role: string;
    email: string;
  }
}

const notificationRoute = new OpenAPIHono<{ Variables: Variables }>();

/**
 * 1. LẤY TẤT CẢ THÔNG BÁO CỦA NGƯỜI DÙNG HIỆN TẠI
 * Route: GET /all
 */
notificationRoute.openapi(getMyNotificationsDoc, async (c) => {
  const user = c.get('jwtPayload');

  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 50 // Giới hạn 50 thông báo gần nhất
    });

    // Chuyển đổi Date sang ISO String để khớp với Zod Schema
    const formatted = notifications.map(n => ({
      ...n,
      createdAt: n.createdAt.toISOString(),
      payload: n.payload as Record<string, any>
    }));

    return c.json(formatted, 200);
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 400);
  }
});

/**
 * 2. TẠO THÔNG BÁO MỚI (Dành cho Recruiter hoặc Hệ thống)
 * Route: POST /create
 */
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
notificationRoute.use('/create', verifyRole(['RECRUITER', 'ADMIN'])); // Chỉ Recruiter/Admin mới được tạo chủ động

notificationRoute.openapi(createNotificationDoc, async (c) => {
  const { userId, templateKey, payload, link, targetId } = c.req.valid('json');
  const DIGEST_WINDOW_MS = 10 * 60 * 1000;

  try {
    const template = NOTIFICATION_TEMPLATES[templateKey as NotificationTemplateKey];
    if (!template) return c.json({ success: false, message: "Template không hợp lệ" }, 400);

    // 1. Xử lý Digest
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

        return c.json(mapToNotificationSchema(updatedNoti), 200);
      }
    }

    // --- BƯỚC 2: XỬ LÝ IDEMPOTENCY (CHỐNG TRÙNG LẶP) ---
    // Dành cho các thông báo quan trọng, không gom (thường dành cho Candidate)
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
    // count mặc định là 1 cho lần đầu tiên
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
        idempotencyKey, // null nếu là digest
        digestKey: template.allowDigest && targetId ? `DIGEST-${userId}-${templateKey}-${targetId}` : null,
        digestCount: 1
      }
    });

    return c.json(mapToNotificationSchema(newNotification), 201);

  } catch (error: any) {
    // Xử lý lỗi Unique Constraint (P2002) nếu có 2 request đến cùng lúc
    if (error.code === 'P2002') {
      return c.json({ success: false, message: "Yêu cầu đang được xử lý, vui lòng thử lại." }, 409);
    }
    return c.json({ success: false, message: error.message }, 400);
  }
});
/**
 * 3. ĐÁNH DẤU MỘT THÔNG BÁO LÀ ĐÃ ĐỌC
 * Route: PATCH /:id/read
 */
notificationRoute.openapi(markAsReadDoc, async (c) => {
  const user = c.get('jwtPayload');
  const { id } = c.req.valid('param');

  try {
    const notification = await prisma.notification.findUnique({ where: { id } });

    if (!notification) {
      return c.json({ success: false, message: "Thông báo không tồn tại" }, 404);
    }

    if (notification.userId !== user.id) {
      return c.json({ success: false, message: "Không có quyền" }, 403);
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