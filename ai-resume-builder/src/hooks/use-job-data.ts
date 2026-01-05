import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { jobClientService } from "@/services/Client/job-client.service";
import { qaClientService } from "@/services/Client/qa-client.service";

// 1. Hook lấy danh sách Job của nhà tuyển dụng
export const useMyJobs = () => {
  return useQuery({
    queryKey: ["my-jobs"],
    queryFn: () => jobClientService.getMyJobs(),
    staleTime: Infinity, // Dữ liệu không bao giờ cũ tự động
    gcTime: Infinity,    // Giữ trong bộ nhớ đệm vĩnh viễn
  });
};
export const useCreateJob = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => jobClientService.createJob(data),
    onSuccess: () => {
      // Sau khi tạo thành công, đánh dấu cache "my-jobs" là cũ
      // để TanStack Query tự động fetch lại danh sách mới nhất
      queryClient.invalidateQueries({ queryKey: ["my-jobs"] });
    }
  });
};

// 2. Hook chỉnh sửa bài đăng tuyển dụng (MỚI THÊM)
export const useUpdateJob = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      jobClientService.updateJob(id, data),
    onSuccess: () => {
      // Làm mới danh sách job để hiển thị thông tin vừa chỉnh sửa
      queryClient.invalidateQueries({ queryKey: ["my-jobs"] });
    }
  });
};

// 3. Hook trả lời câu hỏi của ứng viên
export const useAnswerQuestion = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      qaClientService.answerQuestion(id, data),
    onSuccess: () => {
      // Sau khi trả lời, làm mới danh sách job để cập nhật trạng thái câu hỏi
      queryClient.invalidateQueries({ queryKey: ["my-jobs"] });
    }
  });
};

// 4. Hook xóa bài đăng tuyển dụng
export const useDeleteJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => jobClientService.deleteJob(id),
    onSuccess: () => {
      // Làm mới danh sách sau khi xóa
      queryClient.invalidateQueries({ queryKey: ["my-jobs"] });
    }
  });
};
// Hook lấy danh sách job cho Candidate
export const useAllJobs = (params: { search?: string; location?: string; page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ["all-jobs", params], // Key bao gồm params để tự động refetch khi search thay đổi
    queryFn: () => jobClientService.getAllJobs(params),
  });
};

// Hook lấy chi tiết job
export const useJobDetail = (id: string | null) => {
  return useQuery({
    queryKey: ["job-detail", id],
    queryFn: () => jobClientService.getJobDetail(id!),
    enabled: !!id, // Chỉ chạy khi có ID
  });
};
export const useSavedJobs = () => {
  return useQuery({
    queryKey: ["saved-jobs"],
    queryFn: () => jobClientService.getSavedJobs(),
  });
};
// Hook lưu job
export const useToggleSave = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => jobClientService.toggleSaveJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["saved-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["job-detail"] });

    }
  })
};