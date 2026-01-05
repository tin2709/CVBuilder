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
  ArrowRight, Clock, Loader2, Heart, CheckCircle2, Settings
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function CandidateDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  // 1. Fetch dữ liệu từ Hooks
  const { data: profileRes } = useMyProfile();
  const { data: jobsRes, isLoading } = useAllJobs({ search: searchQuery, limit: 10 });
  const { data: detailRes, isFetching: isDetailLoading } = useJobDetail(selectedJobId);
  const { data: savedJobsRes } = useSavedJobs();
  const { data: appsRes } = useMyApplications();

  // Actions
  const saveMutation = useToggleSave();
  const applyMutation = useApplyJob();

  // Dữ liệu xử lý
  const profile = profileRes?.data;
  const currentUserId = profile?.userId; // Lấy ID của User hiện tại để check tim
  const jobs = jobsRes?.data || [];
  const savedCount = savedJobsRes?.count || 0;

  // Set chứa danh sách JobId đã ứng tuyển để kiểm tra nhanh O(1)
  const appliedJobIds = useMemo(() => {
    return new Set(appsRes?.data?.map((app: any) => app.jobId) || []);
  }, [appsRes]);

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      {/* --- 1. HEADER --- */}
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

      {/* --- 2. MAIN CONTENT --- */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-8">
          
          {/* LEFT: JOB LIST */}
          <div className="col-span-12 lg:col-span-8 space-y-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Chào mừng trở lại, {profile?.user?.name || "bạn"}! 👋</h1>
              <p className="text-slate-500">Hôm nay có {jobsRes?.total || 0} công việc mới dành cho bạn.</p>
            </div>

            <section className="space-y-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600 fill-blue-600" /> Việc làm đề xuất
              </h2>

              {isLoading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-slate-300 w-10 h-10" /></div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {jobs.map((job: any) => {
                    const isSaved = job.savedByUserIds?.includes(currentUserId);
                    const isApplied = appliedJobIds.has(job.id);

                    return (
                      <Card 
                        key={job.id} 
                        className="hover:shadow-md transition-all cursor-pointer border-slate-200 group/card"
                        onClick={() => setSelectedJobId(job.id)}
                      >
                        <CardContent className="p-5 space-y-4">
                          <div className="flex justify-between items-start">
                            <div className="flex gap-3">
                              <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-700 font-bold text-lg">
                                {job.company?.name?.[0]}
                              </div>
                              <div>
                                <h3 className="font-bold text-slate-900 line-clamp-1 group-hover/card:text-blue-600 transition-colors">{job.title}</h3>
                                <p className="text-sm text-slate-500">{job.company?.name}</p>
                              </div>
                            </div>
                            <Button 
                              variant="ghost" size="icon" className={`h-9 w-9 rounded-full ${isSaved ? "bg-pink-50" : ""}`}
                              onClick={(e) => { e.stopPropagation(); saveMutation.mutate(job.id); }}
                            >
                              <Heart className={`w-5 h-5 transition-all ${isSaved ? "fill-pink-500 text-pink-500 scale-110" : "text-slate-300"}`} />
                            </Button>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex gap-2">
                              <Badge variant="secondary" className="font-normal text-blue-600 bg-blue-50">
                                <DollarSign className="w-3 h-3 mr-1"/> {job.salaryRange || "Thỏa thuận"}
                              </Badge>
                            </div>
                            {isApplied && (
                              <Badge className="bg-emerald-50 text-emerald-600 border-emerald-200 font-bold">
                                <CheckCircle2 className="w-3 h-3 mr-1" /> Đã nộp
                              </Badge>
                            )}
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
              )}
            </section>
          </div>

          {/* RIGHT: PROFILE STATS */}
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
                    <DialogTitle className="text-2xl font-bold">{detailRes.data.title}</DialogTitle>
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

                  <div className="space-y-6 text-sm leading-relaxed">
                    <div><h4 className="font-bold mb-2">Mô tả công việc</h4><div className="text-slate-600 whitespace-pre-line">{detailRes.data.description}</div></div>
                    <div><h4 className="font-bold mb-2">Yêu cầu</h4><div className="text-slate-600 whitespace-pre-line">{detailRes.data.requirements}</div></div>
                  </div>

                  <Separator />

                  <div className="flex items-center gap-4">
                    {isApplied ? (
                      <Button disabled className="flex-1 bg-emerald-50 text-emerald-600 h-12 border-emerald-100 border">
                        <CheckCircle2 className="w-5 h-5 mr-2" /> Đã ứng tuyển thành công
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
                      {isSaved ? "Đã lưu" : "Lưu tin"}
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