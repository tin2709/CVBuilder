"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  useAllJobs,
  useJobDetail,
  useToggleSave,
  useSavedJobs
} from "@/hooks/use-job-data";
import { useMyProfile } from "@/hooks/use-candidate-data";
import { useApplyJob, useMyApplications } from "@/hooks/use-application-data";
import {
  Bot, Search, Bell, MapPin, Briefcase, DollarSign, Sparkles, 
  ArrowRight, Clock, Loader2, Heart, CheckCircle2, Settings,
  MessageCircle, Send, User2,Zap
} from "lucide-react";
import { useAskQuestion, useJobQA } from "@/hooks/use-qa-data"; // Import thêm useJobQA
import SmartHighlight from "@/components/shared/smart-highlight";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea"; // Thêm Textarea

export default function CandidateDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  // 1. Fetch dữ liệu từ Hooks
  const { data: profileRes } = useMyProfile();
  const { data: jobsRes, isLoading } = useAllJobs({ search: searchQuery, limit: 10 });
  const { data: detailRes, isFetching: isDetailLoading } = useJobDetail(selectedJobId);
  const { data: savedJobsRes } = useSavedJobs();
  const { data: appsRes } = useMyApplications();
  const { data: qaRes } = useJobQA(selectedJobId); // Lấy danh sách Q&A của job đang chọn
  
  const [questionContent, setQuestionContent] = useState("");

  // Actions
  const askMutation = useAskQuestion();
  const saveMutation = useToggleSave();
  const applyMutation = useApplyJob();

  // Dữ liệu xử lý
  const profile = profileRes?.data;
  const currentUserId = profile?.userId;
  const jobs = jobsRes?.data || [];
  const savedCount = savedJobsRes?.count || 0;

  const appliedJobIds = useMemo(() => {
    return new Set(appsRes?.data?.map((app: any) => app.jobId) || []);
  }, [appsRes]);

  const handleAsk = () => {
    if (!questionContent.trim()) return;
    askMutation.mutate({ 
      jobId: selectedJobId!, 
      content: questionContent 
    }, {
      onSuccess: () => setQuestionContent("") 
    });
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      {/* --- 1. HEADER (Giữ nguyên) --- */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8 flex-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-slate-800">
              <div className="bg-blue-600 p-1.5 rounded-lg text-white"><Bot className="w-5 h-5" /></div>
              SmartJob AI
            </Link>
            <div className="relative max-w-md w-full hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Tìm kiếm việc làm..."
                className="pl-9 bg-slate-100 border-none"
                onKeyDown={(e) => e.key === "Enter" && setSearchQuery(e.currentTarget.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 border-l pl-6">
              <Link href="/candidate/saved-jobs" className="relative p-2 hover:bg-slate-100 rounded-full transition-colors">
                <Heart className={`w-6 h-6 ${savedCount > 0 ? "fill-pink-500 text-pink-500" : "text-slate-500"}`} />
                {savedCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
                    {savedCount}
                  </span>
                )}
              </Link>
              <Avatar className="w-8 h-8 cursor-pointer">
                <AvatarImage src={profile?.user?.image} />
                <AvatarFallback>{profile?.user?.name?.[0] || "U"}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      {/* --- 2. MAIN CONTENT (Giữ nguyên) --- */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* ... */}
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-8 space-y-8">
             {/* Danh sách Job (Giữ nguyên) */}
             <div className="grid md:grid-cols-2 gap-4">
                  {jobs.map((job: any) => {
                    const isSaved = job.savedByUserIds?.includes(currentUserId);
                    const isApplied = appliedJobIds.has(job.id);
                    return (
                      <Card key={job.id} className="hover:shadow-md transition-all cursor-pointer border-slate-200 group/card" onClick={() => setSelectedJobId(job.id)}>
                        <CardContent className="p-5 space-y-4">
                          <div className="flex justify-between items-start">
                            <div className="flex gap-3">
                              <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-700 font-bold text-lg">{job.company?.name?.[0]}</div>
                              <div>
                                <h3 className="font-bold text-slate-900 line-clamp-1 group-hover/card:text-blue-600 transition-colors">{job.title}</h3>
                                <p className="text-sm text-slate-500">{job.company?.name}</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon" className={`h-9 w-9 rounded-full ${isSaved ? "bg-pink-50" : ""}`} onClick={(e) => { e.stopPropagation(); saveMutation.mutate(job.id); }}>
                              <Heart className={`w-5 h-5 transition-all ${isSaved ? "fill-pink-500 text-pink-500 scale-110" : "text-slate-300"}`} />
                            </Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary" className="font-normal text-blue-600 bg-blue-50"><DollarSign className="w-3 h-3 mr-1"/> {job.salaryRange || "Thỏa thuận"}</Badge>
                            {isApplied && <Badge className="bg-emerald-50 text-emerald-600 border-emerald-200 font-bold"><CheckCircle2 className="w-3 h-3 mr-1" /> Đã nộp</Badge>}
                          </div>
                          <Separator />
                          <div className="flex items-center justify-between text-[10px] text-slate-400">
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Hạn: {new Date(job.deadline).toLocaleDateString('vi-VN')}</span>
                            <span className="text-blue-600 font-bold flex items-center gap-1">Chi tiết <ArrowRight className="w-3 h-3"/></span>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
             </div>
          </div>
          {/* Sidebar (Giữ nguyên) */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <Card className="border-slate-200">
              <div className="h-20 bg-blue-600 rounded-t-xl" />
              <CardContent className="px-6 pb-6 relative">
                <Avatar className="w-20 h-20 border-4 border-white absolute -top-10 left-6">
                  <AvatarImage src={profile?.user?.image} />
                  <AvatarFallback>{profile?.user?.name?.[0]}</AvatarFallback>
                </Avatar>
                <div className="mt-12 space-y-1">
                  <h3 className="font-bold text-xl">{profile?.user?.name}</h3>
                  <p className="text-sm text-blue-600 font-medium">{profile?.headline || "Cập nhật Headline"}</p>
                </div>
                <div className="mt-6 space-y-2 text-sm font-medium">
                  <div className="flex justify-between"><span>Hoàn thiện hồ sơ</span><span className="text-blue-600">85%</span></div>
                  <Progress value={85} className="h-2" />
                </div>
                <Button asChild className="w-full mt-6 bg-blue-600"><Link href="/candidate/profile">Chỉnh sửa hồ sơ</Link></Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* --- 3. MODAL DETAIL --- */}
      <Dialog open={!!selectedJobId} onOpenChange={() => setSelectedJobId(null)}>
  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 border-none shadow-2xl">
    {isDetailLoading ? (
      <div className="p-20 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-blue-600 w-12 h-12" />
        <p className="text-slate-500 font-medium animate-pulse">Đang tải chi tiết công việc...</p>
      </div>
    ) : detailRes?.data && (() => {
      const job = detailRes.data;
      const isApplied = appliedJobIds.has(job.id);
      const isSaved = job.savedByUserIds?.includes(currentUserId);

      // --- LOGIC LỌC Q&A ---
      // Chỉ lấy những câu hỏi mà ID người gửi trùng với người đang đăng nhập
      const allQuestions = qaRes?.data || [];
      const myQuestions = allQuestions.filter((q: any) => q.sender?.id === currentUserId);

      return (
        <div className="flex flex-col">
          {/* --- 1. HEADER MODAL --- */}
          <div className="bg-slate-50 p-6 flex items-end gap-4 border-b sticky top-0 z-10">
            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center text-2xl font-bold text-blue-600 shadow-sm border border-slate-200">
              {job.company?.name?.[0] || job.companyName?.[0] || "J"}
            </div>
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold text-slate-900 leading-tight">
                {job.title}
              </DialogTitle>
              <p className="text-blue-600 font-semibold mt-1">
                {job.company?.name || job.companyName}
              </p>
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* --- 2. THÔNG TIN NHANH (Grid Stats) --- */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 bg-blue-50/50 rounded-xl text-center border border-blue-100">
                <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider mb-1">Mức lương</p>
                <p className="text-sm font-bold text-slate-700">{job.salaryRange || "Thỏa thuận"}</p>
              </div>
              <div className="p-3 bg-blue-50/50 rounded-xl text-center border border-blue-100">
                <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider mb-1">Địa điểm</p>
                <p className="text-sm font-bold text-slate-700">{job.location}</p>
              </div>
              <div className="p-3 bg-blue-50/50 rounded-xl text-center border border-blue-100">
                <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider mb-1">Hạn nộp</p>
                <p className="text-sm font-bold text-slate-700">
                  {job.deadline ? new Date(job.deadline).toLocaleDateString('vi-VN') : "Liên tục"}
                </p>
              </div>
            </div>

            {/* --- 3. MÔ TẢ & YÊU CẦU --- */}
            <div className="space-y-6 text-sm leading-relaxed text-slate-600">
              <div className="bg-white rounded-lg">
                <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-blue-600" /> Mô tả công việc
                </h4>
                <div className="whitespace-pre-line pl-6 border-l-2 border-slate-100">
                  {job.description}
                </div>
              </div>
              
              <div className="bg-white rounded-lg">
                <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" /> Yêu cầu ứng viên
                </h4>
                <div className="whitespace-pre-line pl-6 border-l-2 border-slate-100">
                  {job.requirements}
                </div>
              </div>
            </div>

            {/* --- 4. HÀNH ĐỘNG CHÍNH (Apply & Save) --- */}
            <div className="flex items-center gap-4 pt-4">
              {isApplied ? (
                <Button disabled className="flex-1 bg-emerald-50 text-emerald-600 h-12 border-emerald-100 border font-bold">
                  <CheckCircle2 className="w-5 h-5 mr-2" /> Đã ứng tuyển thành công
                </Button>
              ) : (
                <Button 
                  className="flex-1 bg-blue-600 hover:bg-blue-700 h-12 text-lg shadow-lg shadow-blue-200" 
                  onClick={() => applyMutation.mutate(job.id)} 
                  disabled={applyMutation.isPending}
                >
                  {applyMutation.isPending ? <Loader2 className="animate-spin mr-2" /> : "Ứng tuyển ngay"}
                </Button>
              )}
              <Button 
                variant="outline" 
                className={`h-12 px-6 transition-all ${isSaved ? "text-pink-600 border-pink-100 bg-pink-50" : "hover:bg-slate-50"}`} 
                onClick={() => saveMutation.mutate(job.id)}
              >
                <Heart className={`w-5 h-5 mr-2 ${isSaved ? "fill-pink-600" : ""}`} /> 
                {isSaved ? "Đã lưu" : "Lưu tin"}
              </Button>
            </div>

            <Separator />

            {/* --- 5. PHẦN Q&A (CHỈ HIỂN THỊ CỦA BẠN) --- */}
           {/* --- PHẦN Q&A TRONG MODAL CHI TIẾT --- */}
<div className="space-y-6 pt-2">
  <div className="flex justify-between items-center">
    <h4 className="font-bold text-slate-900 flex items-center gap-2">
      <MessageCircle className="w-5 h-5 text-blue-600" /> 
      Câu hỏi của bạn ({myQuestions.length})
    </h4>
    <Badge variant="outline" className="text-[10px] text-slate-400 font-normal">
      Chế độ riêng tư
    </Badge>
  </div>

  {/* 1. Ô Nhập câu hỏi */}
  <div className="space-y-3 bg-blue-50/30 p-4 rounded-2xl border border-blue-100 shadow-sm">
    <Textarea 
      placeholder="Hỏi nhà tuyển dụng... (Hỗ trợ highlight code tự động)"
      className="bg-white border-blue-100 focus-visible:ring-blue-500 min-h-[90px] text-sm"
      value={questionContent}
      onChange={(e) => setQuestionContent(e.target.value)}
    />
    <div className="flex justify-between items-center">
      <p className="text-[10px] text-slate-400 italic">
        * Dán code hoặc dùng `backticks` để highlight.
      </p>
      <Button 
        size="sm" 
        className="bg-blue-600 hover:bg-blue-700 px-6 shadow-md"
        onClick={handleAsk}
        disabled={askMutation.isPending || !questionContent.trim()}
      >
        {askMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
        Gửi thắc mắc
      </Button>
    </div>
  </div>

  {/* 2. Danh sách câu hỏi của chính mình */}
  <div className="space-y-8">
    {myQuestions.length === 0 ? (
      <div className="text-center py-10 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
        <p className="text-sm text-slate-400 italic">Bạn chưa đặt câu hỏi nào cho công việc này.</p>
      </div>
    ) : (
      myQuestions.map((q: any) => (
        <div key={q.id} className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          
          {/* Câu hỏi của ứng viên */}
          <div className="flex gap-3 items-start">
            <Avatar className="w-8 h-8 border-2 border-white shadow-sm shrink-0">
              <AvatarFallback className="bg-blue-600 text-white text-[10px] font-bold">
                {q.sender?.name?.[0] || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-[11px] text-blue-600 uppercase tracking-tight">Bạn đã hỏi</span>
                <span className="text-[9px] text-slate-400">{new Date(q.createdAt).toLocaleDateString('vi-VN')}</span>
              </div>
              
              {/* SỬ DỤNG SMART HIGHLIGHT CHO NỘI DUNG CÂU HỎI */}
              <SmartHighlight text={q.content} />
            </div>
          </div>

          {/* Trả lời của Nhà tuyển dụng */}
          {q.answer ? (
            <div className="flex gap-3 items-start pl-10">
              <div className="flex-1 text-right">
                <div className="bg-slate-900 p-4 rounded-2xl rounded-tr-none shadow-lg inline-block text-left border border-slate-800 w-full max-w-[95%]">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="font-bold text-[10px] text-slate-300 uppercase tracking-wider">
                      Nhà tuyển dụng phản hồi
                    </span>
                  </div>
                  
                  {/* SỬ DỤNG SMART HIGHLIGHT CHO CÂU TRẢ LỜI */}
                  <SmartHighlight text={q.answer} className="!text-slate-200" />
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 border border-slate-200 shadow-sm font-bold text-slate-500 text-[10px] uppercase">
                {job.company?.name?.[0] || job.companyName?.[0]}
              </div>
            </div>
          ) : (
            <div className="pl-11">
               <Badge variant="outline" className="text-[9px] font-medium text-orange-500 border-orange-100 bg-orange-50 animate-pulse px-2 py-0.5">
                  Đang chờ phản hồi...
               </Badge>
            </div>
          )}
        </div>
      ))
    )}
  </div>
</div>
          </div>
        </div>
      );
    })()}
  </DialogContent>
</Dialog>
    </div>
  );
}