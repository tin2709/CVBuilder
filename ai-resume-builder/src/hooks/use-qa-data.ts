// hooks/use-qa-data.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { qaClientService } from "@/services/Client/qa-client.service";
import { toast } from "sonner"; // Hoặc thư viện thông báo bạn đang dùng

export const useJobQA = (jobId: string | null) => {
  return useQuery({
    queryKey: ["job-qa", jobId],
    queryFn: () => qaClientService.getJobQA(jobId!),
    enabled: !!jobId, // Chỉ gọi khi jobId có giá trị
  });
};

export const useAskQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { jobId: string; content: string }) => qaClientService.askQuestion(data),
    onSuccess: (_, variables) => {
      // Refresh lại danh sách câu hỏi sau khi gửi thành công
      queryClient.invalidateQueries({ queryKey: ["job-qa", variables.jobId] });
      toast.success("Đã gửi câu hỏi đến nhà tuyển dụng");
    },
    onError: (error: any) => {
      toast.error(error.message);
    }
  });
};