"use client";

import { useState } from "react";
import { useMyJobs, useDeleteJob, useAnswerQuestion, useUpdateJob } from "@/hooks/use-job-data";
import { 
  Plus, MapPin, DollarSign, Calendar, 
  MessageSquare, Loader2, Trash2, ExternalLink, 
  MoreVertical, Edit3, CheckCircle2, Globe, Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner"; // Giả định bạn dùng sonner để báo lỗi/thành công

export default function JobManagementPage() {
  const { data, isLoading } = useMyJobs();
  
  // States cho Modals
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [isQAOpen, setIsQAOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  if (isLoading) return <JobSkeleton />;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Quản lý tin tuyển dụng</h1>
            <p className="text-slate-500 text-sm">Quản lý các bài đăng và tương tác với ứng viên</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 shadow-md">
            <Plus className="w-4 h-4 mr-2" /> Đăng tin mới
          </Button>
        </div>

        <div className="grid gap-4">
          {data?.data.map((job: any) => (
            <JobCard 
              key={job.id} 
              job={job} 
              onOpenQA={() => { setSelectedJob(job); setIsQAOpen(true); }}
              onOpenEdit={() => { setSelectedJob(job); setIsEditOpen(true); }}
            />
          ))}
        </div>
      </div>

      {/* MODAL TRẢ LỜI CÂU HỎI */}
      {selectedJob && (
        <QAModal 
          job={selectedJob} 
          isOpen={isQAOpen} 
          onClose={() => setIsQAOpen(false)} 
        />
      )}

      {/* MODAL CHỈNH SỬA JOB */}
      {selectedJob && (
        <EditJobModal 
          job={selectedJob} 
          isOpen={isEditOpen} 
          onClose={() => setIsEditOpen(false)} 
        />
      )}
    </div>
  );
}

// --- COMPONENT: CARD JOB ---
function JobCard({ job, onOpenQA, onOpenEdit }: any) {
  const deleteMutation = useDeleteJob();

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-sm transition-all">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-lg text-slate-800">{job.title}</h3>
            <Badge className={job.status === "OPEN" ? "bg-green-100 text-green-700 hover:bg-green-100 border-none" : "bg-slate-100 text-slate-500"}>
              {job.status}
            </Badge>
          </div>
          <p className="text-slate-500 text-sm font-medium">{job.companyName}</p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <MoreVertical className="w-5 h-5 text-slate-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={onOpenEdit} className="cursor-pointer">
              <Edit3 className="w-4 h-4 mr-2" /> Chỉnh sửa tin
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onOpenQA} className="cursor-pointer">
              <MessageSquare className="w-4 h-4 mr-2" /> Xem câu hỏi ({job.questions?.length || 0})
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-red-600 cursor-pointer focus:text-red-600"
              onClick={() => confirm("Xác nhận xóa bài đăng này?") && deleteMutation.mutate(job.id)}
            >
              <Trash2 className="w-4 h-4 mr-2" /> Xóa bài đăng
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5 text-sm text-slate-600">
        <div className="flex items-center gap-2"><DollarSign className="w-4 h-4 text-emerald-500" /> {job.salaryRange}</div>
        <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-rose-500" /> {job.location}</div>
        <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-blue-500" /> {new Date(job.deadline).toLocaleDateString('vi-VN')}</div>
        <div className="flex items-center gap-2 font-semibold text-blue-600"><MessageSquare className="w-4 h-4" /> {job.questions?.length || 0} hỏi đáp</div>
      </div>
    </div>
  );
}

// --- COMPONENT: MODAL HỎI ĐÁP ---
function QAModal({ job, isOpen, onClose }: any) {
  const answerMutation = useAnswerQuestion();
  const [answerTexts, setAnswerTexts] = useState<Record<string, string>>({});
  const [publicStates, setPublicStates] = useState<Record<string, boolean>>({});

  const handleAnswer = (qId: string) => {
    if (!answerTexts[qId]) return toast.error("Vui lòng nhập câu trả lời");
    
    answerMutation.mutate({
      id: qId,
      data: { 
        answer: answerTexts[qId], 
        isPublic: publicStates[qId] || false 
      }
    }, {
      onSuccess: () => toast.success("Đã gửi câu trả lời")
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Câu hỏi từ ứng viên</DialogTitle>
          <DialogDescription>Bài đăng: {job.title}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 my-4">
          {job.questions?.length === 0 && <p className="text-center text-slate-500 py-10">Chưa có câu hỏi nào.</p>}
          
          {job.questions?.map((q: any) => (
            <div key={q.id} className="p-4 rounded-lg border border-slate-100 bg-slate-50/50 space-y-3">
              <div className="flex justify-between items-start">
                <p className="font-medium text-slate-800">Q: {q.content}</p>
                <span className="text-[10px] text-slate-400">{new Date(q.createdAt).toLocaleDateString()}</span>
              </div>
              
              <div className="space-y-2">
                <Textarea 
                  placeholder="Nhập câu trả lời của bạn..."
                  className="bg-white"
                  defaultValue={q.answer || ""}
                  onChange={(e) => setAnswerTexts({...answerTexts, [q.id]: e.target.value})}
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id={`public-${q.id}`} 
                      defaultChecked={q.isPublic}
                      onCheckedChange={(checked) => setPublicStates({...publicStates, [q.id]: !!checked})}
                    />
                    <label htmlFor={`public-${q.id}`} className="text-xs text-slate-500 flex items-center gap-1 cursor-pointer">
                      <Globe className="w-3 h-3" /> Công khai câu trả lời
                    </label>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => handleAnswer(q.id)}
                    disabled={answerMutation.isPending}
                  >
                    {q.answer ? "Cập nhật" : "Gửi câu trả lời"}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// --- COMPONENT: MODAL CHỈNH SỬA JOB ---
function EditJobModal({ job, isOpen, onClose }: any) {
  const updateMutation = useUpdateJob();
  const [formData, setFormData] = useState({ ...job });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      id: job.id,
      data: formData
    }, {
      onSuccess: () => {
        toast.success("Cập nhật bài đăng thành công");
        onClose();
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa bài đăng</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 py-4">
          <div className="col-span-2 space-y-2">
            <Label>Tiêu đề công việc</Label>
            <Input 
              value={formData.title} 
              onChange={(e) => setFormData({...formData, title: e.target.value})} 
            />
          </div>
          <div className="space-y-2">
            <Label>Tên công ty / Nhà máy</Label>
            <Input 
              value={formData.companyName} 
              onChange={(e) => setFormData({...formData, companyName: e.target.value})} 
            />
          </div>
          <div className="space-y-2">
            <Label>Địa điểm</Label>
            <Input 
              value={formData.location} 
              onChange={(e) => setFormData({...formData, location: e.target.value})} 
            />
          </div>
          <div className="space-y-2">
            <Label>Mức lương</Label>
            <Input 
              value={formData.salaryRange} 
              onChange={(e) => setFormData({...formData, salaryRange: e.target.value})} 
            />
          </div>
          <div className="space-y-2">
            <Label>Hạn nộp (Deadline)</Label>
            <Input 
              type="date"
              value={formData.deadline ? new Date(formData.deadline).toISOString().split('T')[0] : ""} 
              onChange={(e) => setFormData({...formData, deadline: e.target.value})} 
            />
          </div>
          <div className="col-span-2 space-y-2">
            <Label>Mô tả công việc</Label>
            <Textarea 
              rows={4}
              value={formData.description} 
              onChange={(e) => setFormData({...formData, description: e.target.value})} 
            />
          </div>
          <div className="space-y-2">
            <Label>Hotline</Label>
            <Input 
              value={formData.hotline} 
              onChange={(e) => setFormData({...formData, hotline: e.target.value})} 
            />
          </div>
          <div className="space-y-2">
            <Label>Link ứng tuyển</Label>
            <Input 
              value={formData.applyLink} 
              onChange={(e) => setFormData({...formData, applyLink: e.target.value})} 
            />
          </div>
          
          <DialogFooter className="col-span-2 mt-4">
            <Button type="button" variant="outline" onClick={onClose}>Hủy</Button>
            <Button type="submit" className="bg-blue-600" disabled={updateMutation.isPending}>
              {updateMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function JobSkeleton() {
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-4">
      <Skeleton className="h-10 w-48" />
      <Skeleton className="h-32 w-full rounded-xl" />
      <Skeleton className="h-32 w-full rounded-xl" />
    </div>
  );
}