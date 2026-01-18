import { OpenAPIHono } from '@hono/zod-openapi';
import { prisma } from '@/lib/db';
import { verifyRole } from '@/middlewares/auth.middleware';
import { sign } from 'hono/jwt';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';
import * as docs from '@/schemas/api-doc';
import { addMailJob } from '@/queues/reminder.queue';
import { verify } from 'hono/jwt';

type Variables = {
  jwtPayload: { id: string; role: string; name: string };
};

const shareRoute = new OpenAPIHono<{ Variables: Variables }>();

// --- 1. TẠO LINK CHIA SẺ (Chỉ dành cho Candidate) ---
shareRoute.use('/me/profile', verifyRole('CANDIDATE'));
shareRoute.openapi(docs.createShareLinkDoc, async (c) => {
  const payload = c.get('jwtPayload');
  const body = c.req.valid('json');

  // Lấy Profile Master hiện tại
  const profile = await prisma.candidateProfile.findFirst({
    where: { userId: payload.id, isMaster: true }
  });

  if (!profile) return c.json({ success: false, message: "Chưa có hồ sơ" }, 404);

  // Sinh token ngẫu nhiên (VD: xT7_a8mP)
  const token = nanoid(10);

  const newLink = await prisma.shareLink.create({
    data: {
      token,
      candidateProfileId: profile.id,
      password: body.password ? await bcrypt.hash(body.password, 10) : null,
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
      maxViews: body.maxViews || null,
      allowedEmails: body.allowedEmails || []
    }
  });

  return c.json({
    success: true,
    token: newLink.token,
    shareUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/share/${newLink.token}`
  }, 201);
});

// --- 2. XÁC THỰC LINK (Mật khẩu hoặc OTP Email) ---
shareRoute.use('/:token/verify', verifyRole('CANDIDATE'));
shareRoute.openapi(docs.verifyShareLinkDoc, async (c) => {
  const { token } = c.req.valid('param');
  const { password, email, otp } = c.req.valid('json');

  const link = await prisma.shareLink.findUnique({
    where: { token },
    include: { candidateProfile: { include: { user: true } } }
  });

  if (!link) return c.json({ success: false, message: "Link không tồn tại" }, 404);

  // A. Kiểm tra hết hạn & Lượt xem
  if (link.expiresAt && new Date() > link.expiresAt) return c.json({ message: "Link đã hết hạn" }, 410);
  if (link.maxViews && link.viewCount >= link.maxViews) return c.json({ message: "Link đã hết lượt xem" }, 410);

  // B. Kiểm tra Mật khẩu (nếu có)
  if (link.password) {
    if (!password) return c.json({ message: "Vui lòng nhập mật khẩu" }, 403);
    const isMatch = await bcrypt.compare(password, link.password);
    if (!isMatch) return c.json({ message: "Mật khẩu không chính xác" }, 403);
  }

  // C. Kiểm tra Quyền Email & OTP (nếu có)
  if (link.allowedEmails.length > 0) {
    if (!email || !link.allowedEmails.includes(email)) {
      return c.json({ message: "Email này không có quyền truy cập" }, 403);
    }

    // Nếu người dùng chưa gửi OTP -> Tạo và gửi qua BullMQ
    if (!otp) {
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      await prisma.otp.upsert({
        where: { email_purpose: { email, purpose: 'FORGOT_PASSWORD' } }, // Re-use OTP model
        update: { code: otpCode, expiresAt: new Date(Date.now() + 10 * 60 * 1000) },
        create: { email, code: otpCode, expiresAt: new Date(Date.now() + 10 * 60 * 1000), purpose: 'FORGOT_PASSWORD' }
      });

      await addMailJob({
        to: email,
        subject: "Mã xác thực xem hồ sơ CV",
        templateKey: "SHARE_CV_OTP",
        payload: { otp: otpCode, candidateName: link.candidateProfile.user.name }
      });

      return c.json({ success: true, message: "Mã OTP đã được gửi tới email của bạn" }, 200);
    }

    // Xác thực OTP
    const otpRecord = await prisma.otp.findUnique({ where: { email_purpose: { email, purpose: 'FORGOT_PASSWORD' } } });
    if (!otpRecord || otpRecord.code !== otp || new Date() > otpRecord.expiresAt) {
      return c.json({ message: "Mã OTP sai hoặc hết hạn" }, 403);
    }
  }

  // D. Thành công -> Cấp ViewToken (JWT tạm thời có hạn 1 tiếng)
  const viewToken = await sign(
    { linkId: link.id, exp: Math.floor(Date.now() / 1000) + 3600 },
    process.env.JWT_SECRET || 'share-secret'
  );

  return c.json({ success: true, viewToken }, 200);
});

// --- 3. LẤY DỮ LIỆU CV (Sau khi đã có ViewToken) ---
shareRoute.use('/:viewToken/view', verifyRole('CANDIDATE'));
shareRoute.openapi(docs.getSharedCVDoc, async (c) => {
  const { viewToken } = c.req.valid('param');

  try {
    // 1. Giải mã viewToken từ URL
    const decoded = await verify(viewToken, process.env.JWT_SECRET || 'share-secret') as any;
    const linkId = decoded.linkId;

    if (!linkId) {
      return c.json({ success: false, message: "Token không hợp lệ" }, 401);
    }

    // 2. Tìm thông tin link và hồ sơ từ linkId đã giải mã
    const link = await prisma.shareLink.findUnique({
      where: { id: linkId },
      include: {
        candidateProfile: {
          include: {
            user: { select: { name: true, email: true } },
            workExperiences: true,
            projects: true,
            educations: true
          }
        }
      }
    });

    if (!link) {
      return c.json({ success: false, message: "Link gốc đã bị xóa" }, 410);
    }

    // 3. Kiểm tra các ràng buộc khác (Hết hạn, Lượt xem)
    if (link.expiresAt && new Date() > link.expiresAt) {
      return c.json({ success: false, message: "Link đã hết hạn" }, 410);
    }
    if (link.maxViews && link.viewCount >= link.maxViews) {
      return c.json({ success: false, message: "Link đã hết lượt xem" }, 410);
    }

    // 4. Tăng lượt xem (Background task)
    prisma.shareLink.update({
      where: { id: link.id },
      data: { viewCount: { increment: 1 } }
    }).catch(console.error);

    // 5. Trả về dữ liệu Snapshot
    const p = link.candidateProfile;
    return c.json({
      success: true,
      data: {
        fullName: p.user.name,
        headline: p.headline,
        summary: p.summary,
        skills: p.skills,
        experiences: p.workExperiences,
        projects: p.projects,
        educations: p.educations,
        viewedAt: new Date().toISOString()
      }
    }, 200);

  } catch (error) {
    return c.json({ success: false, message: "Phiên làm việc hết hạn. Vui lòng xác thực lại." }, 401);
  }
});

export default shareRoute;