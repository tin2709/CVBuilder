// hooks/use-application-data.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { applicationClientService } from "@/services/Client/application-client.service";

export const useApplyJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (jobId: string) => applicationClientService.applyJob(jobId),
    onSuccess: () => {
      // Làm mới danh sách job và danh sách đơn ứng tuyển sau khi nộp thành công
      queryClient.invalidateQueries({ queryKey: ["all-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["my-applications"] });
    }
  });
};

export const useMyApplications = () => {
  return useQuery({
    queryKey: ["my-applications"],
    queryFn: () => applicationClientService.getMyApplications(),
  });
};