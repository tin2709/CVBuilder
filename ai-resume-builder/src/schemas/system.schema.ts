import { z } from '@hono/zod-openapi';

// --- Category ---
export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  // Dùng .nullable() thay vì .optional() vì Prisma MongoDB trả về null
  icon: z.string().nullable().openapi({ example: 'it-icon-url' }), 
}).openapi('Category');
export const CreateCategorySchema = CategorySchema.omit({ 
  id: true, 
  slug: true 
}).openapi('CreateCategoryRequest');
export const NotificationSchema = z.object({
  id: z.string(),
  title: z.string(),
  message: z.string(),
  type: z.enum(['APPLICATION_STATUS', 'NEW_INTERVIEW', 'AI_SCREENING_DONE', 'NEW_MESSAGE', 'SYSTEM']),
  isRead: z.boolean(),
  // Khi dùng c.json, Date sẽ bị biến thành String ISO, nên ta để z.string()
  createdAt: z.string().openapi({ example: '2024-01-01T00:00:00Z' }), 
}).openapi('Notification');

export const CategoryIdParamSchema = z.object({
  id: z.string().openapi({ 
    param: { name: 'id', in: 'path' },
    example: '674d356297f8fec783c70a26' 
  }),
});

// src/schemas/system.schema.ts
export const UpdateCategorySchema = z.object({
  name: z.string().min(2).optional().openapi({ example: 'Tên mới' }),
  icon: z.string().nullable().optional().openapi({ example: 'url-icon' }),
}).openapi('UpdateCategoryRequest');

export const BulkDeleteCategorySchema = z.object({
  ids: z.array(z.string()).min(1).openapi({ 
    example: ['id1', 'id2'],
    description: 'Mảng các ID danh mục cần xóa'
  }),
}).openapi('BulkDeleteCategoryRequest');
// src/schemas/system.schema.ts

export const CreateNotificationSchema = z.object({
  userId: z.string().openapi({ example: '674d356297f8fec783c70a26', description: 'ID người nhận' }),
  title: z.string().min(1).openapi({ example: 'Chúc mừng!' }),
  message: z.string().min(1).openapi({ example: 'Hồ sơ của bạn đã được nhà tuyển dụng xem.' }),
  type: z.enum(['APPLICATION_STATUS', 'NEW_INTERVIEW', 'AI_SCREENING_DONE', 'NEW_MESSAGE', 'SYSTEM']).openapi({ example: 'SYSTEM' }),
  link: z.string().nullable().optional().openapi({ example: '/candidate/applications' }),
}).openapi('CreateNotificationRequest');