// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const role = request.cookies.get('role')?.value
  const { pathname } = request.nextUrl

  // 1. TRƯỜNG HỢP: CHƯA ĐĂNG NHẬP
  // Nếu vào các trang bảo mật mà không có role trong cookie -> Đẩy về /auth
  const isProtectedPath = pathname.startsWith('/candidate') || pathname.startsWith('/recruiter') || pathname.startsWith('/admin');
  
  if (isProtectedPath && !role) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  // 2. TRƯỜNG HỢP: SAI QUYỀN (Authorized but Wrong Role)
  
  // Nếu Role là CANDIDATE mà cố vào trang /recruiter
  if (pathname.startsWith('/recruiter') && role === 'CANDIDATE') {
    // Thay vì về /auth, hãy đưa họ về Dashboard của Candidate
    return NextResponse.redirect(new URL('/candidate/dashboard', request.url))
  }

  // Nếu Role là RECRUITER mà cố vào trang /candidate
  if (pathname.startsWith('/candidate') && role === 'RECRUITER') {
    return NextResponse.redirect(new URL('/recruiter/dashboard', request.url))
  }

  // 3. TRƯỜNG HỢP: ĐÃ ĐĂNG NHẬP MÀ VẪN VÀO TRANG /AUTH
  // Nếu đã có role (đã login) mà quay lại trang login/register -> Đẩy về Dashboard tương ứng
  if (pathname.startsWith('/auth') && role) {
    if (role === 'CANDIDATE') return NextResponse.redirect(new URL('/candidate/dashboard', request.url))
    if (role === 'RECRUITER') return NextResponse.redirect(new URL('/recruiter/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/candidate/:path*', '/recruiter/:path*', '/admin/:path*', '/auth/:path*'],
}