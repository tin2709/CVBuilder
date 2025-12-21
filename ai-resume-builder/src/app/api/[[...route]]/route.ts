// src/app/api/[[...route]]/route.ts
import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import resumeRoute from '@/server/routes/resume'
import authRoute from '@/server/routes/auth' // 1. Import Auth route

// Khởi tạo app Hono chính
const app = new Hono().basePath('/api')

// Route kiểm tra đơn giản
app.get('/hello', (c) => {
  return c.json({
    message: 'Hello from Hono inside Next.js!',
  })
})

/**
 * Gộp các route con vào app chính
 * Việc chaining .route() cực kỳ quan trọng để export AppType chính xác
 */
const routes = app
  .route('/resumes', resumeRoute)
  .route('/auth', authRoute) // 2. Thêm route auth vào đây

/**
 * Export AppType để Frontend (TanStack Query / hono/client) 
 * có thể gọi API với Type-safe 100% (gợi ý code, bắt lỗi type)
 */
export type AppType = typeof routes

// Các Handler cho Next.js App Router
export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const PATCH = handle(app) // Thêm PATCH cho các logic update một phần
export const DELETE = handle(app)