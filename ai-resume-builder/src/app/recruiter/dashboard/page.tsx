"use client";

import Link from "next/link";
import { 
  Search, Bell, Settings, User, Plus, 
  FileText, Users, Calendar, Bot, 
  MoreHorizontal, Zap, ChevronRight, Clock 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function RecruiterDashboard() {
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* --- 1. HEADER --- */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo & Search */}
          <div className="flex items-center gap-10 flex-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-slate-800">
              <div className="bg-blue-600 p-1.5 rounded-lg text-white">
                <User className="w-5 h-5" />
              </div>
              RecruitAI
            </Link>
            
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Tìm kiếm..." 
                className="pl-9 bg-slate-100 border-none focus-visible:ring-1 focus-visible:ring-blue-500 rounded-full" 
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-600 mr-8">
            <Link href="#" className="text-blue-600 font-semibold">Tổng quan</Link>
            <Link href="#" className="hover:text-blue-600 transition-colors">Tin tuyển dụng</Link>
            <Link href="#" className="hover:text-blue-600 transition-colors">Ứng viên</Link>
            <Link href="#" className="hover:text-blue-600 transition-colors">Báo cáo</Link>
          </nav>
            
          {/* User Tools */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-slate-500">
                <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-slate-500">
                <Settings className="w-5 h-5" />
            </Button>
            <Avatar className="w-9 h-9 border cursor-pointer">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>TS</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* --- 2. MAIN CONTENT --- */}
      <main className="max-w-[1400px] mx-auto px-6 py-8 space-y-8">
        
        {/* HERO SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Xin chào, TechSolutions</h1>
                <p className="text-slate-500 mt-1">Tổng quan hoạt động tuyển dụng hôm nay</p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200">
                <Plus className="w-4 h-4 mr-2" /> Đăng tin mới
            </Button>
        </div>

        {/* STATS CARDS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                            <FileText className="w-5 h-5" />
                        </div>
                        <Badge variant="secondary" className="bg-green-50 text-green-700 hover:bg-green-50 font-medium text-[10px]">
                            +2 tuần này
                        </Badge>
                    </div>
                    <p className="text-sm font-medium text-slate-500">Tin đang chạy</p>
                    <h3 className="text-3xl font-bold text-slate-900 mt-1">12</h3>
                </CardContent>
            </Card>

             {/* Card 2 */}
             <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                            <Users className="w-5 h-5" />
                        </div>
                        <Badge variant="secondary" className="bg-green-50 text-green-700 hover:bg-green-50 font-medium text-[10px]">
                            +15%
                        </Badge>
                    </div>
                    <p className="text-sm font-medium text-slate-500">Ứng viên mới</p>
                    <h3 className="text-3xl font-bold text-slate-900 mt-1">45</h3>
                </CardContent>
            </Card>

             {/* Card 3 */}
             <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <Badge variant="secondary" className="bg-green-50 text-green-700 hover:bg-green-50 font-medium text-[10px]">
                            +1 hôm nay
                        </Badge>
                    </div>
                    <p className="text-sm font-medium text-slate-500">Lịch phỏng vấn</p>
                    <h3 className="text-3xl font-bold text-slate-900 mt-1">8</h3>
                </CardContent>
            </Card>

             {/* Card 4 */}
             <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mr-4 -mt-4 text-blue-50 opacity-50">
                        <Bot className="w-24 h-24" />
                    </div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                            <Bot className="w-5 h-5" />
                        </div>
                        <Badge variant="secondary" className="bg-green-50 text-green-700 hover:bg-green-50 font-medium text-[10px]">
                            +24 mới
                        </Badge>
                    </div>
                    <p className="text-sm font-medium text-slate-500 relative z-10">Đề xuất AI</p>
                    <h3 className="text-3xl font-bold text-slate-900 mt-1 relative z-10">156</h3>
                </CardContent>
            </Card>
        </div>

        {/* --- GRID CONTENT: LEFT (Chart & List) - RIGHT (AI Sidebar) --- */}
        <div className="grid grid-cols-12 gap-6">
            
            {/* LEFT COLUMN (8 cols) */}
            <div className="col-span-12 lg:col-span-8 space-y-6">
                
                {/* 1. RECRUITMENT FUNNEL CHART (Simulated with CSS) */}
                <Card className="border-none shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div>
                            <CardTitle className="text-lg font-bold text-slate-800">Tiến độ tuyển dụng</CardTitle>
                            <p className="text-sm text-slate-500 font-normal">Tổng quan phễu ứng viên tháng này</p>
                        </div>
                        <Badge variant="outline" className="text-slate-500 font-normal">Tháng này</Badge>
                    </CardHeader>
                    <CardContent>
                        <div className="h-48 mt-4 flex items-end justify-between gap-4 px-4">
                            {/* Bar 1 */}
                            <div className="flex flex-col items-center gap-2 w-full group">
                                <div className="w-12 md:w-16 h-32 bg-blue-100 rounded-t-lg relative group-hover:bg-blue-200 transition-colors"></div>
                                <span className="text-xs font-medium text-slate-600">Ứng tuyển</span>
                            </div>
                            {/* Bar 2 */}
                            <div className="flex flex-col items-center gap-2 w-full group">
                                <div className="w-12 md:w-16 h-24 bg-blue-200 rounded-t-lg group-hover:bg-blue-300 transition-colors"></div>
                                <span className="text-xs font-medium text-slate-600">Sàng lọc AI</span>
                            </div>
                            {/* Bar 3 */}
                            <div className="flex flex-col items-center gap-2 w-full group">
                                <div className="w-12 md:w-16 h-16 bg-blue-300 rounded-t-lg group-hover:bg-blue-400 transition-colors"></div>
                                <span className="text-xs font-medium text-slate-600">Phỏng vấn</span>
                            </div>
                             {/* Bar 4 */}
                             <div className="flex flex-col items-center gap-2 w-full group">
                                <div className="w-12 md:w-16 h-8 bg-blue-400 rounded-t-lg group-hover:bg-blue-500 transition-colors"></div>
                                <span className="text-xs font-medium text-slate-600">Offer</span>
                            </div>
                             {/* Bar 5 */}
                             <div className="flex flex-col items-center gap-2 w-full group">
                                <div className="w-12 md:w-16 h-6 bg-blue-600 rounded-t-lg group-hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"></div>
                                <span className="text-xs font-bold text-blue-600">Tuyển dụng</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 2. ACTIVE JOBS TABLE */}
                <Card className="border-none shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-lg font-bold text-slate-800">Tin tuyển dụng đang hoạt động</CardTitle>
                        <Link href="#" className="text-sm text-blue-600 font-medium hover:underline">Xem tất cả</Link>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-b-slate-100">
                                    <TableHead className="w-[300px] text-xs font-bold uppercase text-slate-400">Vị trí</TableHead>
                                    <TableHead className="text-xs font-bold uppercase text-slate-400">Ngày đăng</TableHead>
                                    <TableHead className="text-xs font-bold uppercase text-slate-400 text-center">Ứng viên</TableHead>
                                    <TableHead className="text-xs font-bold uppercase text-slate-400 text-center">Điểm AI Match</TableHead>
                                    <TableHead className="text-right text-xs font-bold uppercase text-slate-400">Thao tác</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {[
                                    { title: "Senior Frontend Developer", loc: "Hà Nội • Full-time", date: "02/10/2023", count: 12, match: "Cao", color: "text-green-600" },
                                    { title: "Product Designer (UI/UX)", loc: "TP. Hồ Chí Minh • Remote", date: "05/10/2023", count: 28, match: "Cao", color: "text-green-600" },
                                    { title: "Marketing Executive", loc: "Đà Nẵng • Full-time", date: "01/10/2023", count: 5, match: "Trung bình", color: "text-orange-500" },
                                ].map((job, idx) => (
                                    <TableRow key={idx} className="border-b-slate-50 hover:bg-slate-50/50">
                                        <TableCell>
                                            <div className="font-bold text-slate-900">{job.title}</div>
                                            <div className="text-xs text-slate-500 mt-0.5">{job.loc}</div>
                                        </TableCell>
                                        <TableCell className="text-slate-500 text-sm">{job.date}</TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">{job.count.toString().padStart(2, '0')}</Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className={`flex items-center justify-center gap-1 font-bold text-sm ${job.color}`}>
                                                {job.match === "Cao" && <Zap className="w-3 h-3 fill-current" />}
                                                {job.match}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

            </div>

            {/* RIGHT COLUMN (4 cols) */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
                
                {/* 1. AI RECOMMENDATIONS CARD */}
                <Card className="border-2 border-blue-600 shadow-md shadow-blue-100 relative overflow-hidden">
                    <CardHeader className="bg-white pb-2 pt-5">
                        <CardTitle className="flex items-center gap-2 text-lg font-bold text-slate-900">
                            <SparklesIcon className="text-blue-600" />
                            Đề xuất từ AI
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-2 bg-white space-y-3">
                        {[
                            { name: "Nguyen Thu Ha", role: "Senior React Developer", match: 98, sub: "Frontend Dev", img: "https://randomuser.me/api/portraits/women/44.jpg" },
                            { name: "Tran Minh Tuan", role: "UX Lead", match: 95, sub: "Product Designer", img: "https://randomuser.me/api/portraits/men/32.jpg" },
                            { name: "Le Bao Chau", role: "Digital Marketing Mgr", match: 92, sub: "Marketing Exec", img: "https://randomuser.me/api/portraits/women/68.jpg" },
                        ].map((c, i) => (
                            <div key={i} className="group flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100 hover:border-blue-200 hover:shadow-sm transition-all cursor-pointer">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={c.img} />
                                    <AvatarFallback>{c.name[0]}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <div className="font-bold text-sm text-slate-900 truncate">{c.name}</div>
                                    <div className="text-xs text-slate-500 truncate">{c.role}</div>
                                    <div className="flex items-center gap-1 mt-1">
                                        <span className="text-xs font-bold text-blue-600">{c.match}% Match</span>
                                        <span className="text-[10px] text-slate-400">• {c.sub}</span>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500" />
                            </div>
                        ))}

                        <Button variant="outline" className="w-full mt-2 text-blue-600 border-blue-100 hover:bg-blue-50">
                            Xem tất cả đề xuất
                        </Button>
                    </CardContent>
                </Card>

                {/* 2. RECENT ACTIVITY CARD */}
                <Card className="border-none shadow-sm">
                     <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-bold text-slate-800">Hoạt động gần đây</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {[
                            { text: "Nguyen Van A đã chấp nhận lịch phỏng vấn.", time: "2 giờ trước", color: "bg-blue-500" },
                            { text: "Tin tuyển dụng React Developer đã được duyệt.", time: "5 giờ trước", color: "bg-green-500" },
                            { text: "AI tìm thấy 12 ứng viên mới phù hợp.", time: "1 ngày trước", color: "bg-purple-500" },
                        ].map((item, idx) => (
                            <div key={idx} className="flex gap-4 relative">
                                {/* Timeline line */}
                                {idx !== 2 && <div className="absolute left-[5px] top-6 bottom-[-24px] w-[2px] bg-slate-100"></div>}
                                
                                <div className={`mt-1.5 w-2.5 h-2.5 rounded-full flex-shrink-0 ${item.color} ring-4 ring-white`}></div>
                                <div>
                                    <p className="text-sm text-slate-700 leading-snug">
                                        <span dangerouslySetInnerHTML={{__html: item.text.replace(/(Nguyen Van A|React Developer|12 ứng viên)/g, '<b>$1</b>')}} />
                                    </p>
                                    <p className="text-xs text-slate-400 mt-1">{item.time}</p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

            </div>
        </div>
      </main>
    </div>
  );
}

// Icon Helper
const SparklesIcon = ({ className }: { className?: string }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        className={`w-5 h-5 ${className}`}
    >
        <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
)