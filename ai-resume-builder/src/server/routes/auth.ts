// src/server/routes/auth.ts
import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { RegisterSchema } from '@/lib/schema'
import { authService } from "@/services/auth.service";

const app = new Hono()

const authRoute = app
  .post('/register', zValidator('json', RegisterSchema), async (c) => {
    const data = c.req.valid('json');
    
    try {
      // CHÚ Ý: Map lại dữ liệu ở đây
      const result = await authService.register({
        email: data.email,
        password: data.password,
        name: data.fullName, // Chuyển fullName từ Zod sang name cho Service
        role: data.role?.toUpperCase() || "CANDIDATE" // Chuyển 'candidate' thành 'CANDIDATE'
      }); 

      return c.json({ 
        success: true, 
        user: result 
      });
    } catch (error: any) {
      console.error("Register Error:", error);
      return c.json({ 
        success: false, 
        message: error.message || "Đã có lỗi xảy ra" 
      }, 400);
    }
  })

  // --- LOGIN ---
  // .post(
  //   '/login',
  //   zValidator('json', LoginSchema),
  //   async (c) => {
  //     const data = c.req.valid('json')
  //     return c.json({ success: true, message: 'Login OK' })
  //   }
  // )

export default authRoute