import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { candidateClientService } from "@/services/Client/candidate-client.service";
import { toast } from "sonner";

// --- 1. HOOK LẤY DỮ LIỆU GỐC ---
export const useMyProfile = () => {
  return useQuery({
    queryKey: ["my-profile"],
    queryFn: () => candidateClientService.getMyProfile(),
  });
};

// --- 2. HOOK CHO THÔNG TIN CHUNG (PROFILE) ---
export const useProfileActions = () => {
  const queryClient = useQueryClient();

  const update = useMutation({
    mutationFn: (data: any) => candidateClientService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-profile"] });
      toast.success("Cập nhật thông tin cá nhân thành công");
    },
    onError: (err: any) => toast.error(err.message || "Lỗi cập nhật hồ sơ"),
  });

  return { update };
};

// --- 3. HOOK CHO KINH NGHIỆM LÀM VIỆC (EXPERIENCE) ---
export const useExperienceActions = () => {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["my-profile"] });

  const add = useMutation({
    mutationFn: (data: any) => candidateClientService.addExperience(data),
    onSuccess: () => { invalidate(); toast.success("Thêm kinh nghiệm thành công"); },
    onError: (err: any) => toast.error(err.message),
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      candidateClientService.updateExperience(id, data),
    onSuccess: () => { invalidate(); toast.success("Cập nhật kinh nghiệm thành công"); },
    onError: (err: any) => toast.error(err.message),
  });

  const remove = useMutation({
    mutationFn: (id: string) => candidateClientService.deleteExperience(id),
    onSuccess: () => { invalidate(); toast.success("Đã xóa kinh nghiệm"); },
    onError: (err: any) => toast.error(err.message),
  });

  return { add, update, remove };
};

// --- 4. HOOK CHO DỰ ÁN CÁ NHÂN (PROJECT) ---
export const useProjectActions = () => {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["my-profile"] });

  const add = useMutation({
    mutationFn: (data: any) => candidateClientService.addProject(data),
    onSuccess: () => { invalidate(); toast.success("Thêm dự án thành công"); },
    onError: (err: any) => toast.error(err.message),
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      candidateClientService.updateProject(id, data),
    onSuccess: () => { invalidate(); toast.success("Cập nhật dự án thành công"); },
    onError: (err: any) => toast.error(err.message),
  });

  const remove = useMutation({
    mutationFn: (id: string) => candidateClientService.deleteProject(id),
    onSuccess: () => { invalidate(); toast.success("Đã xóa dự án"); },
    onError: (err: any) => toast.error(err.message),
  });

  return { add, update, remove };
};

// --- 5. HOOK CHO HỌC VẤN (EDUCATION) ---
export const useEducationActions = () => {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["my-profile"] });

  const add = useMutation({
    mutationFn: (data: any) => candidateClientService.addEducation(data),
    onSuccess: () => { invalidate(); toast.success("Thêm học vấn thành công"); },
    onError: (err: any) => toast.error(err.message),
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      candidateClientService.updateEducation(id, data),
    onSuccess: () => { invalidate(); toast.success("Cập nhật học vấn thành công"); },
    onError: (err: any) => toast.error(err.message),
  });

  const remove = useMutation({
    mutationFn: (id: string) => candidateClientService.deleteEducation(id),
    onSuccess: () => { invalidate(); toast.success("Đã xóa học vấn"); },
    onError: (err: any) => toast.error(err.message),
  });

  return { add, update, remove };
};