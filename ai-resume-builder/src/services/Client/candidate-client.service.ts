import { client } from "@/lib/client";

/**
 * Hàm trợ giúp lấy Header chứa Token từ LocalStorage.
 * Được gọi mỗi khi có request để đảm bảo token luôn là bản mới nhất.
 */
const getAuthHeaders = () => {
  if (typeof window === "undefined") return {}; // Tránh lỗi khi chạy SSR
  
  const token = localStorage.getItem("accessToken");
  if (!token) return {};

  return {
    Authorization: `Bearer ${token}`,
  };
};

export const candidateClientService = {
  // ==========================================
  // 1. PROFILE CHÍNH
  // ==========================================
  
  async getMyProfile() {
    const res = await client.api.candidates.me.$get(
      {}, 
      { headers: getAuthHeaders() }
    );
    if (!res.ok) throw new Error("Không thể tải hồ sơ. Vui lòng đăng nhập lại.");
    return await res.json();
  },

  async updateProfile(data: any) {
    const res = await client.api.candidates.me.update.$put(
      { json: data }, 
      { headers: getAuthHeaders() }
    );
    return await res.json();
  },

  // ==========================================
  // 2. KINH NGHIỆM LÀM VIỆC (WORK EXPERIENCE)
  // ==========================================

  async addExperience(data: any) {
    const res = await client.api.candidates.experience.create.$post(
      { json: data }, 
      { headers: getAuthHeaders() }
    );
    return await res.json();
  },

  async updateExperience(id: string, data: any) {
    const res = await client.api.candidates.experience[":id"].$put(
      { 
        param: { id }, 
        json: data 
      }, 
      { headers: getAuthHeaders() }
    );
    return await res.json();
  },

  async deleteExperience(id: string) {
    const res = await client.api.candidates.experience[":id"].$delete(
      { param: { id } }, 
      { headers: getAuthHeaders() }
    );
    return await res.json();
  },

  // ==========================================
  // 3. DỰ ÁN CÁ NHÂN (PERSONAL PROJECTS)
  // ==========================================

  async addProject(data: any) {
    const res = await client.api.candidates.project.create.$post(
      { json: data }, 
      { headers: getAuthHeaders() }
    );
    return await res.json();
  },

  async updateProject(id: string, data: any) {
    const res = await client.api.candidates.project[":id"].$put(
      { 
        param: { id }, 
        json: data 
      }, 
      { headers: getAuthHeaders() }
    );
    return await res.json();
  },

  async deleteProject(id: string) {
    const res = await client.api.candidates.project[":id"].$delete(
      { param: { id } }, 
      { headers: getAuthHeaders() }
    );
    return await res.json();
  },

  // ==========================================
  // 4. HỌC VẤN (EDUCATION)
  // ==========================================

  async addEducation(data: any) {
    const res = await client.api.candidates.education.create.$post(
      { json: data }, 
      { headers: getAuthHeaders() }
    );
    return await res.json();
  },

  async updateEducation(id: string, data: any) {
    const res = await client.api.candidates.education[":id"].$put(
      { 
        param: { id }, 
        json: data 
      }, 
      { headers: getAuthHeaders() }
    );
    return await res.json();
  },

  async deleteEducation(id: string) {
    const res = await client.api.candidates.education[":id"].$delete(
      { param: { id } }, 
      { headers: getAuthHeaders() }
    );
    return await res.json();
  }
};