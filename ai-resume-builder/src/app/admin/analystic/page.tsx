"use client";

import { 
  LayoutDashboard, Users, Briefcase, Cpu, FileText, Settings, LogOut,
  Search, Bell, HelpCircle, Download, Calendar, MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function AnalyticsPage() {
  return (
    <div className="flex min-h-screen bg-[#F0F2F5] font-sans text-slate-900">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-white hidden lg:flex flex-col border-r">
        <div className="h-16 flex items-center px-6 border-b">
           <div className="flex items-center gap-2 font-bold text-lg text-slate-800">
              <div className="bg-blue-600 text-white p-1 rounded"><Cpu className="w-5 h-5"/></div> Recruit AI
           </div>
        </div>
        <nav className="p-4 space-y-1 flex-1">
           <NavRow icon={LayoutDashboard} label="Tổng quan" active />
           <NavRow icon={Users} label="Quản lý Người dùng" />
           <NavRow icon={Briefcase} label="Tin tuyển dụng" />
           <NavRow icon={Cpu} label="Cấu hình AI" />
           <NavRow icon={FileText} label="Báo cáo" />
        </nav>
        <div className="p-4 space-y-1">
           <NavRow icon={Settings} label="Cài đặt" />
           <NavRow icon={LogOut} label="Đăng xuất" />
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto">
        
        {/* Top Bar */}
        <header className="h-16 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-10">
           <h1 className="text-xl font-bold text-slate-800">Phân tích Dữ liệu tổng quan</h1>
           <div className="flex items-center gap-4">
              <div className="relative w-64 hidden md:block">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
                 <Input placeholder="Tìm kiếm dữ liệu..." className="pl-9 bg-slate-50 border-none h-9"/>
              </div>
              <div className="flex items-center gap-3 border-l pl-4">
                 <Bell className="w-5 h-5 text-slate-500 cursor-pointer"/>
                 <HelpCircle className="w-5 h-5 text-slate-500 cursor-pointer"/>
                 <div className="flex items-center gap-2 ml-2">
                    <Avatar className="w-8 h-8"><AvatarFallback>AD</AvatarFallback></Avatar>
                    <div className="text-xs">
                       <div className="font-bold">Admin User</div>
                       <div className="text-slate-500">Super Admin</div>
                    </div>
                 </div>
              </div>
           </div>
        </header>

        <div className="p-8 space-y-6">
           
           {/* Filters */}
           <div className="flex flex-wrap justify-between items-center gap-4">
              <div className="flex gap-3">
                 <Select defaultValue="30days">
                    <SelectTrigger className="w-[140px] bg-white"><SelectValue placeholder="Thời gian" /></SelectTrigger>
                    <SelectContent><SelectItem value="30days">30 ngày qua</SelectItem></SelectContent>
                 </Select>
                 <Select defaultValue="all">
                    <SelectTrigger className="w-[160px] bg-white"><SelectValue placeholder="Ngành nghề" /></SelectTrigger>
                    <SelectContent><SelectItem value="all">Tất cả ngành nghề</SelectItem></SelectContent>
                 </Select>
                 <Select defaultValue="nation">
                    <SelectTrigger className="w-[140px] bg-white"><SelectValue placeholder="Khu vực" /></SelectTrigger>
                    <SelectContent><SelectItem value="nation">Toàn quốc</SelectItem></SelectContent>
                 </Select>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200"><Download className="w-4 h-4 mr-2"/> Xuất báo cáo</Button>
           </div>

           {/* Stats Overview */}
           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <AnalyticCard label="Người dùng mới" value="1,240" trend="+12%" icon={Users} color="blue" />
              <AnalyticCard label="Tin tuyển dụng kích hoạt" value="850" trend="+5%" icon={Briefcase} color="purple" />
              <AnalyticCard label="Lượt ứng tuyển" value="3,420" trend="+8%" icon={FileText} color="orange" />
              <AnalyticCard label="Độ chính xác AI" value="92%" trend="+1.5%" icon={Cpu} color="green" />
           </div>

           {/* Charts Section */}
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Line Chart (Simulation) */}
              <Card className="lg:col-span-2 border-none shadow-sm">
                 <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-6">
                       <div>
                          <h3 className="font-bold text-slate-800">Xu hướng Ứng tuyển & Lượt xem</h3>
                          <p className="text-xs text-slate-500">Dữ liệu so sánh trong 30 ngày qua</p>
                       </div>
                       <div className="flex gap-4 text-xs font-medium">
                          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Ứng tuyển</div>
                          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-slate-300"></div> Lượt xem</div>
                       </div>
                    </div>
                    {/* Fake Chart Area */}
                    <div className="h-64 w-full flex items-end justify-between gap-2 relative pt-10">
                       <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
                          {/* Simulated Line Path */}
                          <path d="M0,200 C50,180 100,220 150,150 C200,80 250,120 300,100 C350,80 400,20 450,40 C500,60 550,40 600,80 L600,250 L0,250 Z" fill="url(#gradient)" opacity="0.1" />
                          <path d="M0,200 C50,180 100,220 150,150 C200,80 250,120 300,100 C350,80 400,20 450,40 C500,60 550,40 600,80" fill="none" stroke="#2563EB" strokeWidth="3" />
                          <defs>
                             <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#2563EB" />
                                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                             </linearGradient>
                          </defs>
                       </svg>
                       {/* Labels */}
                       <div className="absolute bottom-0 w-full flex justify-between text-xs text-slate-400 px-2">
                          <span>Tuần 1</span>
                          <span>Tuần 2</span>
                          <span>Tuần 3</span>
                          <span>Tuần 4</span>
                       </div>
                    </div>
                 </CardContent>
              </Card>

              {/* Donut Chart (Simulation) */}
              <Card className="border-none shadow-sm">
                 <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                    <h3 className="font-bold text-slate-800 w-full text-left mb-1">Hiệu quả AI Matching</h3>
                    <p className="text-xs text-slate-500 w-full text-left mb-6">Đánh giá độ phù hợp CV và JD</p>
                    
                    <div className="relative w-48 h-48 rounded-full bg-slate-100 flex items-center justify-center" style={{background: 'conic-gradient(#2563EB 0% 92%, #e2e8f0 92% 100%)'}}>
                       <div className="w-36 h-36 bg-white rounded-full flex flex-col items-center justify-center">
                          <span className="text-4xl font-bold text-blue-600">92%</span>
                          <span className="text-xs text-slate-500 mt-1">Độ chính xác</span>
                       </div>
                    </div>
                    
                    <div className="mt-8 w-full space-y-3">
                       <div className="flex items-center p-3 bg-blue-50 rounded-lg text-left">
                          <div className="bg-blue-100 p-1.5 rounded text-blue-600 mr-3"><Cpu className="w-4 h-4"/></div>
                          <div>
                             <div className="font-bold text-sm text-slate-900">Gợi ý thành công</div>
                             <div className="text-xs text-slate-500">450 lượt tuyển dụng qua AI</div>
                          </div>
                       </div>
                       <div className="flex items-center p-3 bg-purple-50 rounded-lg text-left">
                          <div className="bg-purple-100 p-1.5 rounded text-purple-600 mr-3"><Settings className="w-4 h-4"/></div>
                          <div>
                             <div className="font-bold text-sm text-slate-900">Kỹ năng xu hướng</div>
                             <div className="text-xs text-slate-500">Python, React, Data Analysis</div>
                          </div>
                       </div>
                    </div>
                 </CardContent>
              </Card>
           </div>

           {/* Bottom Section */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Top Industries */}
              <Card className="border-none shadow-sm">
                 <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-6">
                       <h3 className="font-bold text-slate-800">Top Ngành nghề tuyển dụng</h3>
                       <Button variant="link" className="text-blue-600 text-xs h-auto p-0">Xem tất cả</Button>
                    </div>
                    <div className="space-y-4">
                       <IndustryBar label="Công nghệ thông tin" percent={35} color="bg-blue-600" />
                       <IndustryBar label="Marketing & Truyền thông" percent={25} color="bg-purple-500" />
                       <IndustryBar label="Tài chính / Ngân hàng" percent={20} color="bg-green-500" />
                    </div>
                 </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="border-none shadow-sm">
                 <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-6">
                       <h3 className="font-bold text-slate-800">Hoạt động gần đây</h3>
                       <Button variant="ghost" size="icon"><div className="flex gap-0.5"><div className="w-1 h-1 bg-slate-500 rounded-full"></div><div className="w-1 h-1 bg-slate-500 rounded-full"></div><div className="w-1 h-1 bg-slate-500 rounded-full"></div></div></Button>
                    </div>
                    <div className="space-y-4">
                       <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0"><Briefcase className="w-4 h-4"/></div>
                          <div>
                             <p className="text-sm text-slate-800"><span className="font-bold">VNG Corp</span> đã đăng tin tuyển dụng mới "Senior Backend Developer".</p>
                             <p className="text-xs text-slate-400 mt-1">2 phút trước</p>
                          </div>
                       </div>
                    </div>
                 </CardContent>
              </Card>
           </div>
        </div>
      </main>
    </div>
  );
}

// Helpers for Page 3
function NavRow({ icon: Icon, label, active }: any) {
   return (
      <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer mb-1 ${active ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}>
         <Icon className="w-5 h-5"/>
         <span className="text-sm">{label}</span>
      </div>
   )
}

function AnalyticCard({ label, value, trend, icon: Icon, color }: any) {
   return (
      <Card className="border-none shadow-sm">
         <CardContent className="p-5">
            <div className="flex items-start justify-between">
               <div className={`p-2 rounded-lg bg-${color}-50 text-${color}-600`}>
                  <Icon className="w-5 h-5"/>
               </div>
               <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{trend}</span>
            </div>
            <div className="mt-3">
               <div className="text-xs text-slate-500">{label}</div>
               <div className="text-2xl font-bold text-slate-900">{value}</div>
            </div>
         </CardContent>
      </Card>
   )
}

function IndustryBar({ label, percent, color }: any) {
   return (
      <div>
         <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-700 font-medium">{label}</span>
            <span className="text-slate-500">{percent}%</span>
         </div>
         <Progress value={percent} className="h-2 bg-slate-100" />
      </div>
   )
}