"use client";

import Link from "next/link";
import { 
  Bot, Search, Bell, Settings, Bookmark, MapPin, 
  Briefcase, DollarSign, Clock, MoreHorizontal, 
  Trash2, Sparkles, ChevronRight, Zap, Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

export default function SavedJobsPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans text-slate-900">
      
      {/* HEADER */}
      <header className="bg-white border-b sticky top-0 z-50 px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-600">
            <div className="bg-blue-600 p-1 rounded-md text-white"><Briefcase className="w-5 h-5"/></div>
            SmartRecruit
          </Link>
          <div className="relative w-96 hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input className="pl-9 bg-slate-100 border-none" placeholder="Tìm kiếm việc làm, công ty..." />
          </div>
        </div>
        <div className="flex items-center gap-6 text-sm font-medium text-slate-600">
          <Link href="#" className="hover:text-blue-600">Việc làm</Link>
          <Link href="#" className="hover:text-blue-600">Công ty</Link>
          <Link href="#" className="text-blue-600">Hồ sơ đã lưu</Link>
          <Link href="#" className="hover:text-blue-600">Blog</Link>
          <div className="border-l pl-6 flex items-center gap-3">
             <Button variant="ghost" size="icon"><Bell className="w-5 h-5 text-slate-500"/></Button>
             <Button variant="ghost" size="icon"><Settings className="w-5 h-5 text-slate-500"/></Button>
             <Avatar className="w-8 h-8"><AvatarImage src="https://github.com/shadcn.png" /><AvatarFallback>MN</AvatarFallback></Avatar>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-8">
          
          {/* === MAIN CONTENT (LEFT) === */}
          <div className="col-span-12 lg:col-span-8">
            <div className="mb-6">
              <div className="flex justify-between items-start">
                 <div>
                    <h1 className="text-2xl font-bold mb-1">Công việc đã lưu</h1>
                    <p className="text-slate-500 text-sm">Quản lý danh sách các cơ hội nghề nghiệp bạn quan tâm.</p>
                 </div>
                 <Badge variant="secondary" className="bg-blue-50 text-blue-600 gap-1 px-3 py-1">
                    <Bot className="w-3 h-3"/> Được hỗ trợ bởi AI
                 </Badge>
              </div>
              
              {/* Filters */}
              <div className="flex gap-2 mt-6 overflow-x-auto pb-2">
                 <Button size="sm" className="rounded-full bg-blue-600 hover:bg-blue-700 text-white px-4">Tất cả</Button>
                 <Button variant="outline" size="sm" className="rounded-full border-slate-200 text-slate-600">Sắp hết hạn</Button>
                 <Button variant="outline" size="sm" className="rounded-full border-slate-200 text-slate-600">Lương cao ({'>'} $2000)</Button>
                 <Button variant="outline" size="sm" className="rounded-full border-slate-200 text-slate-600">Remote / Hybrid</Button>
              </div>
            </div>

            <div className="space-y-4">
              {/* Job Card 1 - Standard */}
              <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex gap-4">
                       <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-xl">🎵</div>
                       <div>
                          <h3 className="font-bold text-lg text-slate-900">Senior Product Designer</h3>
                          <div className="text-sm text-slate-500 flex items-center gap-2">
                             <span>Spotify</span> • <span>Hồ Chí Minh</span>
                          </div>
                       </div>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1">
                       <Sparkles className="w-3 h-3" /> 98% Match
                    </Badge>
                  </div>
                  
                  <div className="flex gap-3 mb-4 pl-16">
                     <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-normal"><DollarSign className="w-3 h-3 mr-1"/> $2.500 - $3.500</Badge>
                     <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-normal"><Briefcase className="w-3 h-3 mr-1"/> Hybrid</Badge>
                     <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-normal"><Clock className="w-3 h-3 mr-1"/> Full-time</Badge>
                  </div>

                  <Separator className="mb-3"/>
                  
                  <div className="flex items-center justify-between">
                     <span className="text-xs text-slate-400">Đã lưu 2 ngày trước</span>
                     <div className="flex gap-3">
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-500"><Bookmark className="w-5 h-5 fill-current text-blue-500" /></Button>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">Ứng tuyển ngay</Button>
                     </div>
                  </div>
                </CardContent>
              </Card>

              {/* Job Card 2 - Expiring */}
              <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500"></div>
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex gap-4">
                       <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center text-xl text-red-500">Airbnb</div>
                       <div>
                          <h3 className="font-bold text-lg text-slate-900">Frontend Developer (ReactJS)</h3>
                          <div className="text-sm text-slate-500 flex items-center gap-2">
                             <span>Airbnb</span> • <span>Remote</span>
                          </div>
                       </div>
                    </div>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 gap-1">
                       <Sparkles className="w-3 h-3" /> 92% Match
                    </Badge>
                  </div>
                  
                  <div className="flex gap-3 mb-4 pl-16">
                     <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-normal"><DollarSign className="w-3 h-3 mr-1"/> $1.800 - $3.000</Badge>
                     <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-normal"><MapPin className="w-3 h-3 mr-1"/> Remote</Badge>
                  </div>

                  <Separator className="mb-3"/>
                  
                  <div className="flex items-center justify-between">
                     <span className="text-xs text-orange-600 font-medium flex items-center gap-1">Đã lưu 5 ngày trước • Sắp hết hạn</span>
                     <div className="flex gap-3">
                        <Button variant="ghost" size="icon" className="text-slate-400"><Bookmark className="w-5 h-5 fill-current text-blue-500" /></Button>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">Ứng tuyển ngay</Button>
                     </div>
                  </div>
                </CardContent>
              </Card>

              {/* Job Card 3 - Closed */}
              <Card className="border-slate-100 bg-slate-50/50 opacity-75">
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex gap-4">
                       <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-xs">Slack</div>
                       <div>
                          <h3 className="font-bold text-lg text-slate-700">Customer Success Lead</h3>
                          <div className="text-sm text-slate-500 flex items-center gap-2">
                             <span>Slack</span> • <span>Đà Nẵng</span>
                          </div>
                       </div>
                    </div>
                    <Badge variant="secondary" className="bg-slate-200 text-slate-500">Hết hạn ứng tuyển</Badge>
                  </div>
                  
                  <Separator className="my-3"/>
                  
                  <div className="flex items-center justify-between">
                     <span className="text-xs text-slate-400">Đã lưu 2 tuần trước</span>
                     <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50 px-2">
                        <Trash2 className="w-4 h-4 mr-1"/> Xóa khỏi danh sách
                     </Button>
                  </div>
                </CardContent>
              </Card>

            </div>
          </div>

          {/* === SIDEBAR (RIGHT) === */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            
            {/* AI Recommendation Box */}
            <div className="bg-gradient-to-br from-[#2563EB] to-[#1E40AF] rounded-xl p-5 text-white shadow-lg shadow-blue-500/20">
               <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm"><Zap className="w-4 h-4 text-yellow-300 fill-yellow-300"/></div>
                  <h3 className="font-bold text-lg">Gợi ý từ AI</h3>
               </div>
               <p className="text-blue-100 text-sm mb-4 leading-relaxed">
                  Dựa trên hồ sơ đã lưu, AI tìm thấy 3 công việc phù hợp 95% với bạn.
               </p>

               <div className="space-y-2 mb-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 flex justify-between items-center cursor-pointer hover:bg-white/20 transition-colors">
                     <div>
                        <div className="font-semibold text-sm">Product Manager</div>
                        <div className="text-xs text-blue-200">Grab • Singapore (Remote)</div>
                     </div>
                     <span className="text-xs font-bold bg-green-500/20 text-green-300 px-1.5 py-0.5 rounded">99%</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 flex justify-between items-center cursor-pointer hover:bg-white/20 transition-colors">
                     <div>
                        <div className="font-semibold text-sm">UX Writer</div>
                        <div className="text-xs text-blue-200">MoMo • TP.HCM</div>
                     </div>
                     <span className="text-xs font-bold bg-green-500/20 text-green-300 px-1.5 py-0.5 rounded">94%</span>
                  </div>
               </div>
               
               <Button className="w-full bg-white text-blue-700 hover:bg-blue-50 font-bold border-none">
                  Xem tất cả gợi ý
               </Button>
            </div>

            {/* Stats */}
            <Card className="border-slate-200 shadow-sm">
               <CardContent className="p-5">
                  <h3 className="font-bold text-slate-800 mb-4">Thống kê ứng tuyển</h3>
                  <div className="space-y-4">
                     <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"><Bookmark className="w-4 h-4"/></div>
                           <span className="text-slate-600 text-sm">Đã lưu</span>
                        </div>
                        <span className="font-bold text-slate-900">12</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600"><Zap className="w-4 h-4"/></div>
                           <span className="text-slate-600 text-sm">Đã ứng tuyển</span>
                        </div>
                        <span className="font-bold text-slate-900">5</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600"><Bot className="w-4 h-4"/></div>
                           <span className="text-slate-600 text-sm">Nhà tuyển dụng xem hồ sơ</span>
                        </div>
                        <span className="font-bold text-slate-900">28</span>
                     </div>
                  </div>
                  <div className="mt-5 pt-4 border-t text-center">
                     <Link href="#" className="text-sm text-blue-600 font-semibold flex items-center justify-center hover:underline">
                        Đến Dashboard của tôi <ChevronRight className="w-4 h-4 ml-1"/>
                     </Link>
                  </div>
               </CardContent>
            </Card>

            {/* Promo Banner */}
            <div className="rounded-xl overflow-hidden relative h-40 group cursor-pointer">
               <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&q=80" 
                  alt="Premium" 
                  className="absolute inset-0 w-full h-full object-cover brightness-[0.4] group-hover:scale-105 transition-transform duration-500" 
               />
               <div className="absolute inset-0 p-5 flex flex-col justify-end">
                  <Badge className="w-fit bg-blue-600 hover:bg-blue-600 mb-2">PREMIUM</Badge>
                  <h3 className="font-bold text-white text-lg leading-tight">Nâng cấp tài khoản để xem lương ẩn</h3>
                  <p className="text-slate-300 text-xs mt-1 truncate">Biết mức lương chính xác giúp bạn đàm phán tốt hơn.</p>
               </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}