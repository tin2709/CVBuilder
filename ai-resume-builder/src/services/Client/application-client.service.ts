// services/Client/application-client.service.ts
import { client } from "@/lib/client";

export const applicationClientService = {
  // 1. Ứng viên nộp đơn
  async applyJob(jobId: string) {
    const token = localStorage.getItem("accessToken");
    const res = await client.api.applications.create.$post({
      json: { jobId }
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const result = await res.json();
    if (!res.ok) throw new Error((result as any).message || "Nộp đơn thất bại");
    return result;
  },

  // 2. Lấy danh sách đơn đã nộp của tôi (Candidate)
  async getMyApplications(params: { page?: number; limit?: number; status?: string } = {}) {
    const token = localStorage.getItem("accessToken");
    const res = await client.api.applications.all.$get({
      query: {
        page: params.page?.toString() || "1",
        limit: params.limit?.toString() || "10",
        status: params.status
      }
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Không thể tải danh sách ứng tuyển");
    return await res.json();
  }
};