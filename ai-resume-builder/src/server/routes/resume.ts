// src/server/routes/resumes.ts
import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

const app = new Hono()

// Giả lập Database
const fakeResumes = [
  { id: '1', title: 'Senior Dev' },
  { id: '2', title: 'Junior Dev' }
]

const resumeRoute = app
  .get('/', (c) => {
    return c.json({ resumes: fakeResumes })
  })
  .post(
    '/',
    zValidator(
      'json',
      z.object({
        title: z.string(),
        content: z.string()
      })
    ),
    async (c) => {
      const data = c.req.valid('json')
      return c.json({ 
        success: true, 
        message: `Created resume: ${data.title}` 
      })
    }
  )

export default resumeRoute