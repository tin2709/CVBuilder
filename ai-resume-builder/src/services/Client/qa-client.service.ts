import { client } from "@/lib/client";

export const qaClientService = {
  // Ứng viên đặt câu hỏi
  async askQuestion(data: { jobId: string; content: string }) {
    const token = localStorage.getItem("accessToken");
    const res = await client.api.qa.ask.$post({ json: data }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return await res.json();
  },

  // Nhà tuyển dụng trả lời
  async answerQuestion(id: string, data: { answer: string; isPublic: boolean }) {
    const token = localStorage.getItem("accessToken");
    const res = await client.api.qa.answer[":id"].$post({ 
      param: { id },
      json: data 
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return await res.json();
  },
   async getJobQA(jobId: string) {
    const token = localStorage.getItem("accessToken");
    const res = await client.api.qa.jobs[":id"].$get({
      param: { id: jobId }
    }, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    return await res.json();
  },
};