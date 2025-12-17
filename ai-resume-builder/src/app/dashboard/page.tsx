"use client";

import Link from "next/link";
import { 
  Bot, Search, Bell, MessageSquare, MapPin, 
  Briefcase, DollarSign, Sparkles, Settings, 
  Eye, TrendingUp, ArrowRight, Clock 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

export default function CandidateDashboard() {
  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      {/* --- 1. HEADER --- */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo + Search */}
          <div className="flex items-center gap-8 flex-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-slate-800">
              <div className="bg-blue-600 p-1.5 rounded-lg text-white">
                <Bot className="w-5 h-5" />
              </div>
              SmartJob AI
            </Link>
            
            <div className="relative max-w-md w-full hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Tìm kiếm việc làm, công ty..." 
                className="pl-9 bg-slate-100 border-none focus-visible:ring-1 focus-visible:ring-blue-500" 
              />
            </div>
          </div>

          {/* Navigation & User */}
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
              <Link href="#" className="hover:text-blue-600 text-blue-600">Việc làm</Link>
              <Link href="#" className="hover:text-blue-600">Công ty</Link>
              <Link href="#" className="hover:text-blue-600">Hồ sơ</Link>
            </nav>
            
            <div className="flex items-center gap-3 border-l pl-6">
              <Button variant="ghost" size="icon" className="text-slate-500 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </Button>
              <Button variant="ghost" size="icon" className="text-slate-500">
                <MessageSquare className="w-5 h-5" />
              </Button>
              <Avatar className="w-8 h-8 cursor-pointer">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>MN</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      {/* --- 2. MAIN CONTENT --- */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-8">
          
          {/* === LEFT COLUMN (8 cols) === */}
          <div className="col-span-12 lg:col-span-8 space-y-8">
            
            {/* Greeting Section */}
            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                Chào mừng trở lại, Minh! <span className="text-2xl animate-wave">👋</span>
              </h1>
              <p className="text-slate-500 mt-1">Bạn đã sẵn sàng cho cơ hội nghề nghiệp tiếp theo chưa?</p>
            </div>

            {/* AI Recommended Jobs */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-600 fill-blue-600" />
                  Việc làm phù hợp nhất (AI Recommended)
                </h2>
                <Link href="#" className="text-sm text-blue-600 hover:underline flex items-center">
                  Xem tất cả <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Job Card 1 */}
                <Card className="hover:shadow-md transition-shadow border-slate-200">
                  <CardContent className="p-5 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-3">
                        <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xs">VNG</div>
                        <div>
                          <h3 className="font-bold text-slate-900">Senior UX Designer</h3>
                          <p className="text-sm text-slate-500">VNG Corporation</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-600"></div>
                        98% Match
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs text-slate-600">
                      <Badge variant="secondary" className="font-normal"><MapPin className="w-3 h-3 mr-1"/> TP. Hồ Chí Minh</Badge>
                      <Badge variant="secondary" className="font-normal"><Briefcase className="w-3 h-3 mr-1"/> Full-time</Badge>
                      <Badge variant="secondary" className="font-normal text-blue-600 bg-blue-50"><DollarSign className="w-3 h-3 mr-1"/> $2000 - $3500</Badge>
                    </div>

                    <Separator />
                    
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs text-slate-400">Đăng 2 ngày trước</span>
                      <Button size="sm" className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200 shadow-none font-semibold">
                        Ứng tuyển
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Job Card 2 */}
                <Card className="hover:shadow-md transition-shadow border-slate-200">
                  <CardContent className="p-5 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-3">
                        <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center text-green-700 font-bold text-xs">FPT</div>
                        <div>
                          <h3 className="font-bold text-slate-900">Frontend Lead</h3>
                          <p className="text-sm text-slate-500">FPT Software</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 gap-1">
                         <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                        92% Match
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs text-slate-600">
                      <Badge variant="secondary" className="font-normal"><MapPin className="w-3 h-3 mr-1"/> Hà Nội</Badge>
                      <Badge variant="secondary" className="font-normal"><Briefcase className="w-3 h-3 mr-1"/> Hybrid</Badge>
                      <Badge variant="secondary" className="font-normal text-blue-600 bg-blue-50"><DollarSign className="w-3 h-3 mr-1"/> Thỏa thuận</Badge>
                    </div>

                    <Separator />
                    
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs text-slate-400">Đăng 5 giờ trước</span>
                      <Button size="sm" className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200 shadow-none font-semibold">
                        Ứng tuyển
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Application Status */}
            <section>
               <h2 className="text-lg font-bold text-slate-800 mb-4">Trạng thái ứng tuyển</h2>
               <Card className="border-slate-200 shadow-sm overflow-hidden">
                 <Table>
                   <TableHeader className="bg-slate-50">
                     <TableRow>
                       <TableHead>Vị trí</TableHead>
                       <TableHead>Công ty</TableHead>
                       <TableHead>Ngày nộp</TableHead>
                       <TableHead>Trạng thái</TableHead>
                     </TableRow>
                   </TableHeader>
                   <TableBody>
                     {[
                       { role: "Product Manager", company: "Shopee", date: "12/10/2023", status: "Phỏng vấn", color: "bg-purple-100 text-purple-700" },
                       { role: "Senior React Dev", company: "MoMo", date: "10/10/2023", status: "Đang xem xét", color: "bg-blue-100 text-blue-700" },
                       { role: "System Architect", company: "Tiki", date: "05/10/2023", status: "Đã đóng", color: "bg-slate-100 text-slate-600" },
                     ].map((job, idx) => (
                       <TableRow key={idx}>
                         <TableCell className="font-medium">{job.role}</TableCell>
                         <TableCell>
                           <div className="flex items-center gap-2">
                              {/* Logo giả lập */}
                              <div className="w-6 h-6 rounded bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-500">
                                {job.company[0]}
                              </div>
                              {job.company}
                           </div>
                         </TableCell>
                         <TableCell className="text-slate-500">{job.date}</TableCell>
                         <TableCell>
                           <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${job.color}`}>
                              • {job.status}
                           </span>
                         </TableCell>
                       </TableRow>
                     ))}
                   </TableBody>
                 </Table>
                 <div className="p-3 text-center border-t bg-slate-50/50">
                    <Button variant="link" className="text-blue-600 h-auto py-0">Xem tất cả lịch sử</Button>
                 </div>
               </Card>
            </section>

          </div>

          {/* === RIGHT COLUMN (4 cols) === */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            
            {/* 1. Profile Card */}
            <Card className="border-slate-200 shadow-sm">
              <div className="h-24 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl"></div>
              <CardContent className="px-6 pb-6 relative">
                 <div className="absolute -top-12 left-1/2 -translate-x-1/2">
                    <Avatar className="w-24 h-24 border-4 border-white shadow-md">
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>MN</AvatarFallback>
                    </Avatar>
                 </div>
                 
                 <div className="mt-14 text-center space-y-1">
                   <h3 className="font-bold text-xl text-slate-900">Minh Nguyễn</h3>
                   <p className="text-sm text-blue-600 font-medium">Senior Product Designer</p>
                 </div>

                 <div className="flex gap-2 mt-6">
                    <Button className="flex-1 bg-blue-600 hover:bg-blue-700 shadow-blue-200 shadow-lg">Cập nhật hồ sơ</Button>
                    <Button variant="outline" size="icon" className="border-slate-200"><Settings className="w-4 h-4 text-slate-600"/></Button>
                 </div>

                 <div className="mt-6 space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                       <span className="text-slate-700">Hoàn thiện hồ sơ</span>
                       <span className="text-blue-600">85%</span>
                    </div>
                    <Progress value={85} className="h-2 bg-slate-100" />
                    <p className="text-xs text-orange-500 flex items-center gap-1 mt-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span> 
                      Thêm kỹ năng để đạt 100%
                    </p>
                 </div>
              </CardContent>
            </Card>

            {/* 2. Stats Card */}
            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-2">
                   <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Thống kê tuần này</h4>
                </CardHeader>
                <CardContent className="space-y-4">
                   {/* Item 1 */}
                   <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                            <Eye className="w-4 h-4" />
                         </div>
                         <div>
                            <p className="text-xs text-slate-500">Lượt xem hồ sơ</p>
                            <p className="font-bold text-slate-900">128</p>
                         </div>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
                         <TrendingUp className="w-3 h-3 mr-1" /> 12%
                      </Badge>
                   </div>
                   
                   {/* Item 2 */}
                   <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                            <Search className="w-4 h-4" />
                         </div>
                         <div>
                            <p className="text-xs text-slate-500">Xuất hiện tìm kiếm</p>
                            <p className="font-bold text-slate-900">45</p>
                         </div>
                      </div>
                      <span className="text-xs text-slate-400 font-medium">0%</span>
                   </div>
                </CardContent>
            </Card>

            {/* 3. CTA Card */}
            <div className="rounded-xl bg-[#2563EB] p-6 text-white relative overflow-hidden shadow-lg shadow-blue-500/30">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                
                <div className="relative z-10">
                   <h3 className="font-bold text-lg mb-2">Nâng cấp CV với AI</h3>
                   <p className="text-blue-100 text-sm mb-6 leading-relaxed">
                      Sử dụng công cụ AI của chúng tôi để tối ưu hóa CV và tăng cơ hội trúng tuyển.
                   </p>
                   <Button variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50 w-fit font-bold">
                      Thử ngay
                   </Button>
                </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}