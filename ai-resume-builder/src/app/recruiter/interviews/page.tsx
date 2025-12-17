"use client";

import { 
  Calendar, Clock, Video, MoreHorizontal, Search, Plus, 
  CheckCircle2, AlertCircle, BarChart3, Star, Mic, RotateCw, Link, Phone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export default function InterviewManagementPage() {
  return (
    <div className="min-h-screen bg-[#F3F4F6] flex font-sans text-slate-900">
      
      {/* SIDEBAR (Simplified for demo) */}
      <aside className="w-64 bg-white border-r hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-6 flex items-center gap-2 font-bold text-xl text-slate-800">
            <div className="bg-blue-600 p-1.5 rounded-lg text-white">
                <div className="w-4 h-4 bg-white/20 rounded-sm"></div>
            </div>
            RecruitAI
        </div>
        <nav className="flex-1 px-4 space-y-1 mt-4">
            <NavItem label="Dashboard" icon={<BarChart3 className="w-4 h-4" />} />
            <NavItem label="Tuyển dụng" icon={<BriefcaseIcon className="w-4 h-4" />} />
            <NavItem label="Lịch phỏng vấn" icon={<Calendar className="w-4 h-4" />} active />
            <NavItem label="Ứng viên" icon={<UserIcon className="w-4 h-4" />} />
            <NavItem label="Báo cáo" icon={<FileIcon className="w-4 h-4" />} />
        </nav>
        {/* AI Banner Bottom */}
        <div className="p-4">
            <div className="bg-blue-600 rounded-xl p-4 text-white">
                <div className="flex items-center gap-2 font-bold text-sm mb-1">
                    <span className="text-yellow-300">✦</span> AI ASSISTANT
                </div>
                <p className="text-[10px] text-blue-100 mb-3">Bạn có 3 gợi ý phỏng vấn mới chưa xem.</p>
                <Button size="sm" variant="secondary" className="w-full h-7 text-xs bg-white/20 hover:bg-white/30 text-white border-none">Xem ngay</Button>
            </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Header */}
        <header className="bg-white border-b h-16 flex items-center justify-between px-8">
            <div className="relative w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input placeholder="Tìm kiếm ứng viên, lịch phỏng vấn..." className="pl-9 bg-slate-50 border-none rounded-full" />
            </div>
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon"><BellIcon className="w-5 h-5 text-slate-500" /></Button>
                <div className="flex items-center gap-2">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-bold">Admin HR</p>
                        <p className="text-xs text-slate-500">Recruiter</p>
                    </div>
                    <Avatar><AvatarFallback>HR</AvatarFallback></Avatar>
                </div>
            </div>
        </header>

        <main className="p-8 overflow-y-auto flex-1">
            
            {/* Title & Actions */}
            <div className="flex justify-between items-end mb-8">
                <div>
                    <div className="text-xs text-slate-500 mb-1">Trang chủ / Tuyển dụng / <span className="text-slate-900 font-medium">Phỏng vấn</span></div>
                    <h1 className="text-3xl font-bold tracking-tight">Quản lý Phỏng vấn</h1>
                    <p className="text-slate-500 mt-1">Theo dõi lịch trình, đánh giá ứng viên và tổng hợp kết quả.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="bg-white border-slate-300 gap-2">
                        <RotateCw className="w-4 h-4" /> Sync Calendar
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700 gap-2 shadow-lg shadow-blue-200">
                        <Plus className="w-4 h-4" /> Lên lịch mới
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <StatCard icon={<Calendar className="text-blue-600"/>} title="Phỏng vấn hôm nay" value="5" sub="+2 mới" subColor="bg-green-100 text-green-700" />
                <StatCard icon={<Clock className="text-orange-600"/>} title="Chờ phản hồi" value="2" />
                <StatCard icon={<CheckCircle2 className="text-green-600"/>} title="Hoàn thành tuần này" value="12" sub="+15%" subColor="bg-green-100 text-green-700" />
                
                {/* Blue Special Card */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
                    <div className="relative z-10">
                         <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center mb-3">
                            <BarChart3 className="w-5 h-5 text-white" />
                        </div>
                        <p className="text-sm text-blue-100 font-medium">Hiệu suất tuyển dụng</p>
                        <h3 className="text-2xl font-bold mt-1">Cao <span className="text-sm font-normal opacity-80">Top 10% thị trường</span></h3>
                    </div>
                    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                </div>
            </div>

            {/* Split Content */}
            <div className="grid grid-cols-12 gap-6 h-[600px]">
                
                {/* LEFT LIST (4 cols) */}
                <Card className="col-span-12 lg:col-span-4 border-none shadow-sm flex flex-col h-full">
                    <div className="p-4 border-b">
                        <div className="flex gap-2 mb-4">
                            <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer px-3 py-1">Sắp tới</Badge>
                            <Badge variant="outline" className="text-slate-500 border-slate-200 hover:bg-slate-50 cursor-pointer px-3 py-1">Cần xử lý</Badge>
                            <Badge variant="outline" className="text-slate-500 border-slate-200 hover:bg-slate-50 cursor-pointer px-3 py-1">Đã xong</Badge>
                        </div>
                        <Input placeholder="Lọc theo vị trí, người phỏng vấn..." className="bg-slate-50 border-none h-9 text-xs" />
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-2">
                        {/* Item Active */}
                        <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg cursor-pointer relative">
                             <div className="absolute right-3 top-3 w-2 h-2 rounded-full bg-blue-600"></div>
                             <div className="flex items-center gap-3">
                                <Avatar className="w-10 h-10"><AvatarImage src="https://randomuser.me/api/portraits/women/44.jpg"/></Avatar>
                                <div>
                                    <h4 className="font-bold text-sm text-slate-900">Nguyễn Văn A</h4>
                                    <p className="text-xs text-slate-500">Senior Backend Developer</p>
                                </div>
                             </div>
                             <div className="flex items-center gap-4 mt-3 text-xs font-medium text-slate-600">
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> 14:00 - 15:00</span>
                                <Badge className="bg-green-100 text-green-700 h-5 px-1.5 text-[10px] shadow-none hover:bg-green-100">Ready</Badge>
                             </div>
                        </div>

                         {/* Item Normal */}
                         <div className="hover:bg-slate-50 border border-transparent hover:border-slate-100 p-3 rounded-lg cursor-pointer transition-colors">
                             <div className="flex items-center gap-3">
                                <Avatar className="w-10 h-10"><AvatarImage src="https://randomuser.me/api/portraits/women/68.jpg"/></Avatar>
                                <div>
                                    <h4 className="font-bold text-sm text-slate-900">Trần Thị B</h4>
                                    <p className="text-xs text-slate-500">UX/UI Designer</p>
                                </div>
                             </div>
                             <div className="flex items-center gap-4 mt-3 text-xs font-medium text-slate-500">
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> 16:30 - 17:30</span>
                             </div>
                        </div>

                         {/* Item Normal */}
                         <div className="hover:bg-slate-50 border border-transparent hover:border-slate-100 p-3 rounded-lg cursor-pointer transition-colors">
                             <div className="flex items-center gap-3">
                                <Avatar className="w-10 h-10"><AvatarImage src="https://randomuser.me/api/portraits/men/32.jpg"/></Avatar>
                                <div>
                                    <h4 className="font-bold text-sm text-slate-900">Lê Minh C</h4>
                                    <p className="text-xs text-slate-500">Product Manager</p>
                                </div>
                             </div>
                             <div className="flex items-center gap-4 mt-3 text-xs font-medium text-slate-400">
                                <span className="flex items-center gap-1"><Calendar className="w-3 h-3"/> Ngày mai, 09:00</span>
                             </div>
                        </div>
                    </div>
                </Card>

                {/* RIGHT DETAIL (8 cols) */}
                <Card className="col-span-12 lg:col-span-8 border-none shadow-sm flex flex-col h-full overflow-hidden">
                    {/* Candidate Header */}
                    <div className="p-6 border-b flex justify-between items-center bg-white">
                        <div className="flex items-center gap-4">
                            <Avatar className="w-14 h-14 border-2 border-slate-100"><AvatarImage src="https://randomuser.me/api/portraits/women/44.jpg"/></Avatar>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                    Nguyễn Văn A 
                                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 text-[10px] gap-1"><SparklesIcon className="w-3 h-3"/> 92% Match</Badge>
                                </h2>
                                <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                                    <span className="flex items-center gap-1"><BriefcaseIcon className="w-3 h-3"/> Senior Backend Developer</span>
                                    <Link href="#" className="text-blue-600 hover:underline">Xem CV đầy đủ</Link>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="icon" className="rounded-full border-slate-200"><Phone className="w-4 h-4 text-slate-600"/></Button>
                            <Button className="bg-blue-600 hover:bg-blue-700 rounded-full px-6 shadow-lg shadow-blue-200 gap-2">
                                <Video className="w-4 h-4" /> Vào phòng họp
                            </Button>
                        </div>
                    </div>

                    {/* Tabs Content */}
                    <div className="flex-1 bg-white flex flex-col overflow-y-auto">
                        <Tabs defaultValue="grading" className="w-full h-full flex flex-col">
                            <div className="px-6 border-b">
                                <TabsList className="bg-transparent h-12 w-full justify-start gap-6 p-0">
                                    <TabsTrigger value="info" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 px-0">Thông tin ứng viên</TabsTrigger>
                                    <TabsTrigger value="grading" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 px-0">Đánh giá & Ghi chú</TabsTrigger>
                                    <TabsTrigger value="history" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 px-0">Lịch sử</TabsTrigger>
                                </TabsList>
                            </div>
                            
                            <TabsContent value="grading" className="flex-1 p-6 space-y-6 bg-slate-50/50">
                                {/* AI Suggestion Box */}
                                <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 relative">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-sm text-indigo-900 flex items-center gap-2">
                                            <SparklesIcon className="w-4 h-4 text-indigo-600"/> Gợi ý phỏng vấn từ AI
                                        </h4>
                                        <span className="text-xs text-indigo-500 underline cursor-pointer">Làm mới</span>
                                    </div>
                                    <p className="text-xs text-indigo-800 leading-relaxed">
                                        Dựa trên CV, ứng viên có kinh nghiệm sâu về <span className="font-bold">Microservices</span> nhưng chưa rõ về kinh nghiệm <span className="font-bold">Cloud Deployment</span>. Hãy tập trung hỏi về các dự án triển khai thực tế trên AWS.
                                    </p>
                                    <div className="flex gap-2 mt-3">
                                        <Badge variant="outline" className="bg-white border-indigo-200 text-indigo-600 hover:bg-white text-[10px] cursor-pointer">Gợi ý câu hỏi kỹ thuật</Badge>
                                        <Badge variant="outline" className="bg-white border-indigo-200 text-indigo-600 hover:bg-white text-[10px] cursor-pointer">Tóm tắt CV</Badge>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-8">
                                    {/* Rating Column */}
                                    <div className="space-y-6">
                                        <h3 className="font-bold text-sm text-slate-900">Đánh giá kỹ năng</h3>
                                        <RatingRow label="Technical Skills" score="4/5" stars={4} />
                                        <RatingRow label="Communication" score="3/5" stars={3} />
                                        <RatingRow label="Culture Fit" score="5/5" stars={5} />
                                    </div>

                                    {/* Notes Column */}
                                    <div className="space-y-2 h-full flex flex-col">
                                        <div className="flex justify-between items-center">
                                            <h3 className="font-bold text-sm text-slate-900">Ghi chú phỏng vấn</h3>
                                            <span className="text-xs text-blue-600 flex items-center gap-1 cursor-pointer"><Mic className="w-3 h-3"/> Dictate</span>
                                        </div>
                                        <div className="bg-white border border-slate-200 rounded-lg flex-1 flex flex-col shadow-sm focus-within:ring-1 focus-within:ring-blue-500">
                                            <div className="border-b p-2 flex gap-1 bg-slate-50 rounded-t-lg">
                                                <Button variant="ghost" size="icon" className="h-6 w-6"><span className="font-bold text-xs">B</span></Button>
                                                <Button variant="ghost" size="icon" className="h-6 w-6"><span className="italic text-xs">I</span></Button>
                                                <Button variant="ghost" size="icon" className="h-6 w-6"><span className="text-xs">=</span></Button>
                                                <div className="h-4 w-px bg-slate-300 mx-1 my-auto"></div>
                                                <Button variant="ghost" className="h-6 text-[10px] text-blue-600 px-2 bg-blue-50">Generate Summary</Button>
                                            </div>
                                            <textarea className="flex-1 w-full p-3 text-xs leading-relaxed resize-none outline-none text-slate-700 rounded-b-lg" placeholder="Nhập ghi chú..." defaultValue="Ứng viên có kiến thức nền tảng tốt. Đã trả lời xuất sắc câu hỏi về Database Optimisation.&#10;Tuy nhiên, kỹ năng tiếng Anh còn hạn chế (cần cải thiện).&#10;Về mặt văn hóa: Khá phù hợp, thái độ cầu tiến."></textarea>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </Card>
            </div>
        </main>
      </div>
    </div>
  );
}

// --- HELPER COMPONENTS ---

const NavItem = ({ label, icon, active }: any) => (
    <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${active ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}>
        <div className={active ? 'text-blue-600' : 'text-slate-400'}>{icon}</div>
        <span className="text-sm">{label}</span>
    </div>
)

const StatCard = ({ icon, title, value, sub, subColor }: any) => (
    <Card className="border-none shadow-sm">
        <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center">
                    {icon}
                </div>
                {sub && <Badge variant="secondary" className={`${subColor} text-[10px]`}>{sub}</Badge>}
            </div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <h3 className="text-3xl font-bold text-slate-900 mt-1">{value}</h3>
        </CardContent>
    </Card>
)

const RatingRow = ({ label, score, stars }: any) => (
    <div className="flex items-center justify-between">
        <div>
            <p className="text-sm text-slate-600 font-medium mb-1">{label}</p>
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className={`w-4 h-4 ${s <= stars ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'}`} />
                ))}
            </div>
        </div>
        <span className="font-bold text-sm text-slate-900">{score}</span>
    </div>
)

// Dummy Icons
const BriefcaseIcon = ({className}:any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
const UserIcon = ({className}:any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
const FileIcon = ({className}:any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
const BellIcon = ({className}:any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
const SparklesIcon = ({className}:any) => <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/></svg>