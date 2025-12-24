// src/services/auth-client.service.ts
import { client } from "@/lib/client";
import { LoginPayload, RegisterPayload } from "@/lib/schema";

export const authClientService = {
  async login(data: LoginPayload) {
    const res = await client.api.auth.login.$post({
      json: data,
    });

    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || "Đăng nhập thất bại");
    }
    
    // Lưu token vào localStorage (hoặc cookie tùy bạn)
    if (result.success && result.accessToken) {
      localStorage.setItem("accessToken", result.accessToken);
            localStorage.setItem("user", JSON.stringify(result.user)); // Lưu object user

    }
    return result;
  },

  async register(data: RegisterPayload) {
    const res = await client.api.auth.register.$post({
      json: data,
    });

    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || "Đăng ký thất bại");
    }
    return result;
  }
};