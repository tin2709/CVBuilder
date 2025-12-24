// src/lib/client.ts
import { hc } from 'hono/client'
import { AppType } from '@/app/api/[[...route]]/route'

// Trỏ về đúng URL của project (localhost hoặc production)
const getBaseUrl = () => {
    if (typeof window !== 'undefined') return '' // Browser: dùng relative path
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
    return 'http://localhost:3000'
}

export const client = hc<AppType>(getBaseUrl()) as any