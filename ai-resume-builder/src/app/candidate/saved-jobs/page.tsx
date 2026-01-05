"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { 
  useSavedJobs, 
  useJobDetail, 
  useToggleSave 
} from "@/hooks/use-job-data";
import { useApplyJob, useMyApplications } from "@/hooks/use-application-data";
import { useMyProfile } from "@/hooks/use-candidate-data";
import { 
  Briefcase, Search, Bell, Settings, MapPin, 
  DollarSign, Clock, Trash2, Heart, Loader2,
  ChevronRight, Zap, Sparkles, CheckCircle2, ArrowLeft
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function SavedJobsPage() {
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  
  // 1. Fetch dữ liệu từ Hooks
  const { data: profileRes } = useMyProfile();
  const { data: savedRes, isLoading } = useSavedJobs();
  const { data: appsRes } = useMyApplications();
  const { data: detailRes, isFetching: isDetailLoading } = useJobDetail(selectedJobId);

  // Actions
  const saveMutation = useToggleSave();
  const applyMutation = useApplyJob();

  // Dữ liệu xử lý
  const profile = profileRes?.data;
  const currentUserId = profile?.userId;
  const savedJobs = savedRes?.data || [];
  const savedCount = savedRes?.count || 0;

  // Tạo Set chứa JobId đã ứng tuyển
  const appliedJobIds = useMemo(() => {
    return new Set(appsRes?.data?.map((app: any) => app.jobId) || []);
  }, [appsRes]);

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* --- 1. HEADER --- */}
      <header className="bg-white border-b sticky top-0 z-50 px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link href="/candidate/dashboard" className="flex items-center gap-2 font-bold text-xl text-blue-600">
            <div className="bg-blue-600 p-1 rounded-md text-white"><Briefcase className="w-5 h-5"/></div>
            SmartJob AI
          </Link>
        </div>
        <div className="flex items-center gap-6 text-sm font-medium">
          <Link href="/candidate/dashboard" className="text-slate-600 hover:text-blue-600 flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </Link>
          <div className="relative p-2">
             <Heart className={`w-6 h-6 ${savedCount > 0 ? "fill-pink-500 text-pink-500" : "text-slate-400"}`} />
             {savedCount > 0 && (
               <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
                  {savedCount}
               </span>
             )}
          </div>
          <Avatar className="w-8 h-8">
            <AvatarImage src={profile?.user?.image} />
            <AvatarFallback>{profile?.user?.name?.[0] || "U"}</AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* --- 2. MAIN CONTENT --- */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-8">
          
          <div className="col-span-12 lg:col-span-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-slate-900">Công việc đã lưu ({savedCount})</h1>
              <p className="text-slate-500 text-sm mt-1">Nơi tập trung những cơ hội nghề nghiệp bạn yêu thích.</p>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600 w-10 h-10" /></div>
            ) : savedJobs.length === 0 ? (
              <Card className="p-20 text-center border-dashed bg-white">
                <Heart className="w-16 h-16 text-slate-100 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-400">Chưa có công việc nào được lưu</h3>
                <p className="text-slate-400 text-sm mt-2">Hãy quay lại Dashboard để tìm kiếm những vị trí phù hợp.</p>
                <Button asChild className="mt-6 bg-blue-600" variant="default">
                  <Link href="/candidate/dashboard">Khám phá ngay</Link>
                </Button>
              </Card>
            ) : (
              <div className="space-y-4">
                {savedJobs.map((job: any) => {
                  const isApplied = appliedJobIds.has(job.id);

                  return (
                    <Card key={job.id} className="border-slate-200 hover:shadow-md transition-all cursor-pointer group overflow-hidden bg-white">
                      <CardContent className="p-5" onClick={() => setSelectedJobId(job.id)}>
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex gap-4">
                             <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-xl font-bold text-blue-600">
                                {job.company?.name?.[0]}
                             </div>
                             <div>
                                <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">{job.title}</h3>
                                <p className="text-sm text-slate-500">{job.company?.name} • {job.location}</p>
                             </div>
                          </div>
                          <Button 
                            variant="ghost" size="icon" 
                            className="text-pink-500 hover:bg-pink-50 rounded-full"
                            onClick={(e) => { e.stopPropagation(); saveMutation.mutate(job.id); }}
                          >
                            <Heart className="w-5 h-5 fill-current" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center justify-between pl-16">
                          <div className="flex gap-3">
                             <Badge variant="secondary" className="bg-slate-50 font-normal text-slate-600"><DollarSign className="w-3 h-3 mr-1"/> {job.salaryRange}</Badge>
                             <Badge variant="secondary" className="bg-slate-50 font-normal text-slate-600"><MapPin className="w-3 h-3 mr-1"/> {job.location}</Badge>
                          </div>
                          {isApplied && (
                             <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 font-bold">
                               <CheckCircle2 className="w-3 h-3 mr-1" /> Đã ứng tuyển
                             </Badge>
                          )}
                        </div>

                        <Separator className="my-4"/>
                        
                        <div className="flex items-center justify-between">
                           <span className="text-[10px] text-slate-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> Đã lưu: {new Date(job.createdAt).toLocaleDateString('vi-VN')}
                           </span>
                           <Button className={isApplied ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-50 border-emerald-200" : "bg-blue-600 hover:bg-blue-700"}>
                              {isApplied ? "Xem trạng thái" : "Ứng tuyển ngay"}
                           </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* --- SIDEBAR RIGHT --- */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 text-white shadow-xl shadow-blue-200">
               <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-6 h-6 text-yellow-300 fill-yellow-300"/>
                  <h3 className="font-bold text-lg">Mẹo nghề nghiệp</h3>
               </div>
               <p className="text-blue-50 text-sm leading-relaxed mb-6">
                  Việc lưu công việc giúp bạn không bỏ lỡ cơ hội, nhưng hãy nhớ rằng các vị trí HOT thường đóng sau 1 tuần. Hãy nộp đơn ngay khi bạn sẵn sàng!
               </p>
               <Button asChild className="w-full bg-white text-blue-700 hover:bg-blue-50 font-bold border-none">
                  <Link href="/candidate/dashboard">Tìm thêm công việc</Link>
               </Button>
            </div>
          </div>
        </div>
      </main>

      {/* --- 3. MODAL CHI TIẾT (Đồng bộ với Dashboard) --- */}
      <Dialog open={!!selectedJobId} onOpenChange={() => setSelectedJobId(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 border-none">
          {isDetailLoading ? (
            <div className="p-20 flex flex-col items-center"><Loader2 className="animate-spin text-blue-600 w-10 h-10" /></div>
          ) : detailRes?.data && (() => {
            const isApplied = appliedJobIds.has(detailRes.data.id);
            const isSaved = detailRes.data.savedByUserIds?.includes(currentUserId);

            return (
              <div>
                <div className="bg-slate-50 p-6 flex items-end gap-4 border-b">
                  <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center text-2xl font-bold text-blue-600 shadow-sm border">
                    {detailRes.data.company?.name?.[0]}
                  </div>
                  <div>
                    <DialogTitle className="text-2xl font-bold text-slate-900">{detailRes.data.title}</DialogTitle>
                    <p className="text-blue-600 font-medium">{detailRes.data.company?.name}</p>
                  </div>
                </div>

                <div className="p-8 space-y-8">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-3 bg-slate-50 rounded-lg text-center">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Lương</p>
                      <p className="text-sm font-bold">{detailRes.data.salaryRange}</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg text-center">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Địa điểm</p>
                      <p className="text-sm font-bold">{detailRes.data.location}</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg text-center">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Hạn nộp</p>
                      <p className="text-sm font-bold">{new Date(detailRes.data.deadline).toLocaleDateString('vi-VN')}</p>
                    </div>
                  </div>

                  <div className="space-y-6 text-sm leading-relaxed text-slate-600">
                    <div><h4 className="font-bold text-slate-900 mb-2">Mô tả công việc</h4><div className="whitespace-pre-line">{detailRes.data.description}</div></div>
                    <div><h4 className="font-bold text-slate-900 mb-2">Yêu cầu ứng viên</h4><div className="whitespace-pre-line">{detailRes.data.requirements}</div></div>
                  </div>

                  <Separator />

                  <div className="flex items-center gap-4">
                    {isApplied ? (
                      <Button disabled className="flex-1 bg-emerald-50 text-emerald-600 h-12 border-emerald-100 border font-bold">
                        <CheckCircle2 className="w-5 h-5 mr-2" /> Bạn đã ứng tuyển thành công
                      </Button>
                    ) : (
                      <Button 
                        className="flex-1 bg-blue-600 hover:bg-blue-700 h-12 text-lg shadow-lg shadow-blue-200"
                        onClick={() => applyMutation.mutate(detailRes.data.id)}
                        disabled={applyMutation.isPending}
                      >
                        {applyMutation.isPending ? <Loader2 className="animate-spin mr-2" /> : "Ứng tuyển ngay"}
                      </Button>
                    )}
                    <Button 
                      variant="outline" className={`h-12 px-6 ${isSaved ? "text-pink-600 border-pink-100 bg-pink-50" : ""}`}
                      onClick={() => saveMutation.mutate(detailRes.data.id)}
                    >
                      <Heart className={`w-5 h-5 mr-2 ${isSaved ? "fill-pink-600" : ""}`} /> 
                      {isSaved ? "Bỏ lưu" : "Lưu tin"}
                    </Button>
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