// src/app/api/[[...route]]/route.ts
import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import resumeRoute from '@/server/routes/resume' // Import route con

// Khởi tạo app Hono với base path là /api
const app = new Hono().basePath('/api')

// Định nghĩa các route
// route này sẽ có dạng: /api/hello
app.get('/hello', (c) => {
  return c.json({
    message: 'Hello from Hono inside Next.js!',
  })
})

// Gom nhóm các route (Ví dụ route quản lý CV)
const routes = app.route('/resumes', resumeRoute)

// Export type để dùng ở Frontend (RPC)
export type AppType = typeof routes

// Xử lý request bằng Next.js Edge hoặc Nodejs Runtime
export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)