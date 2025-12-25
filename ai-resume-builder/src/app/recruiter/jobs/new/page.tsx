"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateJob } from "@/hooks/use-job-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Briefcase, Info, MapPin, FileText, Calendar, Phone, Link as LinkIcon, Sparkles } from "lucide-react";

export default function PostJobPage() {
  const router = useRouter();
  const createMutation = useCreateJob();
  
  // State quản lý form
  const [formData, setFormData] = useState({
    title: "",
    companyName: "",
    description: "",
    requirements: "",
    location: "",
    salaryRange: "",
    startDate: "",
    deadline: "",
    applyLink: "",
    hotline: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      return toast.error("Vui lòng điền các trường bắt buộc (*)");
    }

    createMutation.mutate(formData, {
      onSuccess: () => {
        toast.success("Đăng tin tuyển dụng thành công!");
        router.push("/recruiter/jobs/all"); // Quay lại trang quản lý
      },
      onError: (error: any) => toast.error(error.message)
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <main className="max-w-4xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Tạo bài đăng tuyển dụng</h1>
            <p className="text-slate-500">Thông tin này sẽ được hiển thị công khai tới ứng viên.</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border p-8 space-y-10">
            {/* SECTION 1: CƠ BẢN */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b"><Info className="w-5 h-5 text-blue-600"/><h2 className="font-bold text-lg">Thông tin cơ bản</h2></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <Label>Tiêu đề bài đăng <span className="text-red-500">*</span></Label>
                  <Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Ví dụ: Senior React Developer" />
                </div>
                <div className="space-y-2">
                  <Label>Tên công ty / Nhà máy</Label>
                  <Input value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} placeholder="AI-Resume Corp" />
                </div>
                <div className="space-y-2">
                  <Label>Địa điểm</Label>
                  <Input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="Hà Nội" />
                </div>
              </div>
            </section>

            {/* SECTION 2: CHI TIẾT */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b"><FileText className="w-5 h-5 text-blue-600"/><h2 className="font-bold text-lg">Chi tiết công việc</h2></div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Mô tả công việc <span className="text-red-500">*</span></Label>
                  <Textarea required className="min-h-[120px]" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Yêu cầu ứng viên</Label>
                  <Textarea className="min-h-[100px]" value={formData.requirements} onChange={e => setFormData({...formData, requirements: e.target.value})} />
                </div>
              </div>
            </section>

            {/* SECTION 3: LƯƠNG & DATE */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b"><Calendar className="w-5 h-5 text-blue-600"/><h2 className="font-bold text-lg">Chế độ & Thời hạn</h2></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2"><Label>Mức lương</Label><Input value={formData.salaryRange} onChange={e => setFormData({...formData, salaryRange: e.target.value})} /></div>
                <div className="space-y-2"><Label>Hạn nộp</Label><Input type="date" onChange={e => setFormData({...formData, deadline: e.target.value})} /></div>
                <div className="space-y-2"><Label>Ngày bắt đầu dự kiến</Label><Input type="date" onChange={e => setFormData({...formData, startDate: e.target.value})} /></div>
                <div className="space-y-2"><Label>Hotline</Label><Input value={formData.hotline} onChange={e => setFormData({...formData, hotline: e.target.value})} /></div>
              </div>
            </section>

            <section className="space-y-4 bg-slate-50 p-4 rounded-xl border border-dashed">
              <Label className="font-bold">Link đăng ký (Google Form, Bitly...)</Label>
              <Input value={formData.applyLink} onChange={e => setFormData({...formData, applyLink: e.target.value})} placeholder="https://..." />
            </section>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="ghost" onClick={() => router.back()}>Hủy bỏ</Button>
              <Button type="submit" className="bg-blue-600 px-10" disabled={createMutation.isPending}>
                {createMutation.isPending ? <Loader2 className="animate-spin mr-2"/> : "Đăng tin ngay"}
              </Button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}