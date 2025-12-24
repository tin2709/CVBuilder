// src/services/candidate-client.service.ts
import { client } from "@/lib/client";

export const candidateClientService = {
  async searchCandidates(query: string) {
    const token = localStorage.getItem("accessToken");

    const res = await client.api.candidates.search.$get({
      query: { q: query },
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const result = await res.json();
    
    // Kiểm tra status code trước
    if (!res.ok) {
       // Ép kiểu để truy cập message an toàn khi có lỗi
       const errorData = result as { message?: string };
       throw new Error(errorData.message || "Lỗi truy vấn");
    }

    // Lúc này TypeScript biết result là kết quả thành công
    return result; 
  }
};