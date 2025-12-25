import { client } from "@/lib/client";

export const jobClientService = {
  // Lấy danh sách job của tôi (Recruiter)
  async getMyJobs() {
    const token = localStorage.getItem("accessToken");
    const res = await client.api.jobs["my-jobs"].$get({}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Không thể tải danh sách bài đăng");
    return await res.json();
  },

  // Tạo job mới
  async createJob(data: any) {
    const token = localStorage.getItem("accessToken");
    const res = await client.api.jobs.create.$post({ json: data }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return await res.json();
  },
 async updateJob(id: string, data: any) {
    const token = localStorage.getItem("accessToken");
    
    // Gọi đến endpoint: jobRoute.openapi(updateJobDoc, ...)
    // Thường là phương thức PUT hoặc PATCH (tùy theo updateJobDoc của bạn)
    // Ở đây tôi giả định là $put dựa trên logic update thông thường
    const res = await client.api.jobs.update[":id"].$put({
      param: { id },
      json: {
        ...data,
        // Đảm bảo convert date sang string ISO nếu backend yêu cầu
        startDate: data.startDate ? new Date(data.startDate).toISOString() : undefined,
        deadline: data.deadline ? new Date(data.deadline).toISOString() : undefined,
      }
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const result = await res.json();
    if (!res.ok) {
      throw new Error((result as any).message || "Lỗi khi cập nhật bài đăng");
    }
    return result;
  },
  // Xóa job
  async deleteJob(id: string) {
    const token = localStorage.getItem("accessToken");
    const res = await client.api.jobs.delete[":id"].$delete({ param: { id } }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return await res.json();
  }
};