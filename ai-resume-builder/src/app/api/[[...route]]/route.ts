import { OpenAPIHono } from '@hono/zod-openapi' // Đổi từ Hono sang OpenAPIHono
import { swaggerUI } from '@hono/swagger-ui'
import { handle } from 'hono/vercel'
import resumeRoute from '@/server/routes/resume'
import authRoute from '@/server/routes/auth'
import candidateRoute from '@/server/routes/candidate'
import jobRoute from '@/server/routes/job'
import qaRoute from '@/server/routes/qa'
import companyRoute from '@/server/routes/company'
import interviewRoute from '@/server/routes/interview'
import applicationRoute from '@/server/routes/application'
import reviewRoute from '@/server/routes/review'
import categoryRoute from '@/server/routes/category'
import notificationRoute from '@/server/routes/notification'
import { initRedisIndices } from '@/lib/redis-init'

// Khởi tạo Redis Indices
initRedisIndices().catch((err) => {
  console.error('❌ Failed to initialize Redis indices:', err);
});

// 1. Đổi thành OpenAPIHono
const app = new OpenAPIHono().basePath('/api')

// Route kiểm tra đơn giản (Vẫn giữ được nhưng không hiện trong Swagger trừ khi dùng .openapi())
app.get('/hello', (c) => {
  return c.json({
    message: 'Hello from Hono inside Next.js!',
  })
})

/**
 * 2. Cấu hình Tài liệu OpenAPI
 */
app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'AI Resume Builder API',
    description: 'Tài liệu hướng dẫn sử dụng API hệ thống',
  },

})

/**
 * 3. Cấu hình Giao diện Swagger UI
 * Truy cập tại: http://localhost:3000/api/ui
 */
app.get('/ui', swaggerUI({ url: '/api/doc' }))

/**
 * Gộp các route con vào app chính
 */
const routes = app
  .route('/resumes', resumeRoute)
  .route('/auth', authRoute)
  .route('/candidates', candidateRoute)
  .route('/jobs', jobRoute) // Gộp jobRoute vào
  .route('/qa', qaRoute) // THÊM DÒNG NÀY
  .route('/companies', companyRoute) // THÊM DÒNG NÀY
  .route('/interviews', interviewRoute) // THÊM DÒNG NÀY
  .route('/applications', applicationRoute) // THÊM DÒNG NÀY
  .route('/reviews', reviewRoute) // THÊM DÒNG NÀY
  .route('/categories', categoryRoute) // THÊM DÒNG NÀY
  .route('/notifications', notificationRoute) // THÊM DÒNG NÀY



/**
 * Export AppType để Frontend nhận diện Type-safe (Hono RPC)
 */
export type AppType = typeof routes

// Các Handler cho Next.js App Router
export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const PATCH = handle(app)
export const DELETE = handle(app)

