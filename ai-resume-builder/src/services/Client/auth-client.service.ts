// src/services/auth-client.service.ts
import { client } from "@/lib/client";
import { LoginPayload, RegisterPayload } from "@/lib/schema";
import Cookies from 'js-cookie'; // Import thư viện cookie

export const authClientService = {
  async login(data: LoginPayload) {
    const res = await client.api.auth.login.$post({
      json: data,
    });

    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || "Đăng nhập thất bại");
    }
    
    // Xử lý lưu trữ khi đăng nhập thành công
    if (result.success && result.accessToken && result.user) {
      // 1. Lưu vào localStorage (Dành cho Client Component / Giao diện)
      localStorage.setItem("accessToken", result.accessToken);
      localStorage.setItem("user", JSON.stringify(result.user));

      // 2. Lưu vào Cookie (Dành cho Next.js Middleware chặn route)
      // expires: 7 (Cookie hết hạn sau 7 ngày)
      // path: '/' (Cookie có hiệu lực trên toàn bộ trang web)
      Cookies.set("accessToken", result.accessToken, { expires: 7, path: '/' });
      Cookies.set("role", result.user.role, { expires: 7, path: '/' });
    }
    
    return result;
  },

  // Thêm hàm logout để xóa sạch dấu vết khi người dùng đăng xuất
  async logout() {
    // Xóa LocalStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    // Xóa Cookies
    Cookies.remove("accessToken", { path: '/' });
    Cookies.remove("role", { path: '/' });

    // Điều hướng về trang login
    window.location.href = '/auth/login';
  },

  async register(data: RegisterPayload) {
    const res = await client.api.auth.register.$post({ json: data });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Đăng ký thất bại");
    return result;
  },

  async requestForgotPassword(email: string) {
    const res = await client.api.auth['forgot-password'].$post({ json: { email } });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Lỗi gửi yêu cầu");
    return result;
  },

  async submitResetPassword(data: { email: string; otp: string; newPassword: any }) {
    const res = await client.api.auth['reset-password'].$post({ json: data });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Lỗi reset mật khẩu");
    return result;
  }
};