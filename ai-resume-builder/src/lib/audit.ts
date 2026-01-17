import { prisma } from './db';
import { Context } from 'hono';

export async function recordAuditLog(
  c: Context, 
  params: {
    action: string;
    entityId: string;
    entityType: string;
    oldValue?: any;
    newValue?: any;
  }
) {
  const payload = c.get('jwtPayload');
  const ip = c.req.header('x-forwarded-for') || '127.0.0.1';
  const ua = c.req.header('user-agent');

  try {
    return await prisma.auditLog.create({
      data: {
        userId: payload.id,
        action: params.action,
        entityId: params.entityId,
        entityType: params.entityType,
        oldValue: params.oldValue,
        newValue: params.newValue,
        ip: ip,
        userAgent: ua,
      },
    });
  } catch (error) {
    console.error("❌ Failed to record Audit Log:", error);
  }
}