// src/server/routes/auth.ts
import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { RegisterSchema, LoginSchema } from '@/lib/schema'

const app = new Hono()

const authRoute = app
  // --- REGISTER ---
  .post(
    '/register',
    // Validator: Nếu dữ liệu gửi lên không khớp RegisterSchema -> Trả lỗi 400 ngay
    zValidator('json', RegisterSchema), 
    async (c) => {
      const data = c.req.valid('json')
      
      console.log("Valid User Data:", data)
      // TODO: Lưu vào Database (Prisma)

      return c.json({ 
        success: true, 
        message: 'Đăng ký thành công',
        user: { name: data.fullName, role: data.role }
      })
    }
  )
  // --- LOGIN ---
  .post(
    '/login',
    zValidator('json', LoginSchema),
    async (c) => {
      const data = c.req.valid('json')
      return c.json({ success: true, message: 'Login OK' })
    }
  )

export default authRoute