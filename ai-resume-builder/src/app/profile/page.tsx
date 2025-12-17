"use client";

import Link from "next/link";
import { 
  User, Briefcase, GraduationCap, Settings, FileText, 
  Upload, Sparkles, Plus, Trash2, PenLine, X, 
  CheckCircle2, Circle, CloudUpload, Wand2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

export default function CandidateProfilePage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans text-slate-900">
      
      {/* --- 1. HEADER --- */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-slate-800">
              <div className="bg-blue-600 p-1.5 rounded-lg text-white">
                <div className="w-5 h-5 bg-white/20 rounded-sm" /> {/* Placeholder logo shape */}
              </div>
              RecruitAI
            </Link>
            
            <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
              <Link href="#" className="hover:text-blue-600">Việc làm</Link>
              <Link href="#" className="hover:text-blue-600">Công ty</Link>
              <Link href="#" className="text-blue-600 font-semibold">Hồ sơ của tôi</Link>
              <Link href="#" className="hover:text-blue-600">Cài đặt</Link>
            </nav>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-4">
             <Button variant="ghost" className="text-slate-500 text-sm font-normal hover:bg-transparent">Đăng xuất</Button>
             <Avatar className="w-9 h-9 border cursor-pointer">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>User</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* --- 2. MAIN CONTAINER --- */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Page Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Quản lý Hồ sơ</h1>
                <p className="text-slate-500 mt-1 text-sm">Cập nhật thông tin để nhà tuyển dụng dễ dàng tìm thấy bạn và AI có thể gợi ý công việc phù hợp.</p>
            </div>
            <div className="flex gap-3">
                <Button variant="outline" className="bg-white">Xem trước</Button>
                <Button className="bg-blue-600 hover:bg-blue-700">Lưu thay đổi</Button>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* === LEFT SIDEBAR (3 cols) === */}
            <div className="lg:col-span-3 space-y-6">
                
                {/* 1. Profile Summary Card */}
                <Card className="border-none shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex flex-col items-center text-center">
                            <Avatar className="w-20 h-20 mb-4 border-4 border-blue-50">
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>NV</AvatarFallback>
                            </Avatar>
                            <h3 className="font-bold text-lg text-slate-900">Nguyễn Văn A</h3>
                            <p className="text-sm text-slate-500">nguyen.vana@email.com</p>
                        </div>

                        <div className="mt-6 space-y-2">
                            <div className="flex justify-between text-sm font-medium">
                                <span className="text-slate-600">Độ hoàn thiện</span>
                                <span className="text-blue-600">85%</span>
                            </div>
                            <Progress value={85} className="h-2" />
                            <p className="text-[11px] text-slate-400 mt-1">Hồ sơ mạnh giúp bạn nổi bật hơn 3x.</p>
                        </div>

                        {/* Navigation Menu */}
                        <div className="mt-6 space-y-1">
                            <NavItem icon={<User className="w-4 h-4"/>} label="Tổng quan" active />
                            <NavItem icon={<Briefcase className="w-4 h-4"/>} label="Kinh nghiệm làm việc" completed />
                            <NavItem icon={<GraduationCap className="w-4 h-4"/>} label="Học vấn" completed />
                            <NavItem icon={<Settings className="w-4 h-4"/>} label="Kỹ năng" />
                            <NavItem icon={<FileText className="w-4 h-4"/>} label="CV đính kèm" />
                        </div>
                    </CardContent>
                </Card>

                {/* 2. AI Assistant Banner */}
                <div className="rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 p-6 text-white shadow-lg relative overflow-hidden">
                    <Sparkles className="w-6 h-6 mb-3 text-yellow-300" />
                    <h4 className="font-bold text-sm uppercase tracking-wider mb-1">AI ASSISTANT</h4>
                    <p className="text-xs text-purple-100 leading-relaxed mb-4">
                        Hồ sơ của bạn có tiềm năng cho vị trí "Senior Frontend Developer". Hãy bổ sung thêm chứng chỉ React.
                    </p>
                    <Button size="sm" variant="secondary" className="w-full bg-white/20 hover:bg-white/30 text-white border-none text-xs h-8">
                        Xem gợi ý chi tiết
                    </Button>
                    
                    {/* Decorative Gear Icon */}
                    <Settings className="absolute -bottom-4 -right-4 w-24 h-24 text-white/10 animate-spin-slow" />
                </div>

            </div>


            {/* === RIGHT CONTENT (9 cols) === */}
            <div className="lg:col-span-9 space-y-6">
                
                {/* 1. UPLOAD CV SECTION */}
                <Card className="border-none shadow-sm">
                    <CardContent className="p-6">
                        <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 bg-slate-50/50 hover:bg-slate-50 transition-colors text-center relative group cursor-pointer">
                            <div className="flex flex-col items-center gap-3 relative z-10">
                                <div className="flex items-center gap-4">
                                     <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                                        <CloudUpload className="w-6 h-6" />
                                     </div>
                                     <div className="text-left">
                                        <h3 className="font-bold text-slate-900">Tải lên CV (PDF/Word)</h3>
                                        <p className="text-sm text-slate-500">
                                            Hệ thống sẽ dùng <span className="text-blue-600 font-bold">AI</span> để tự động trích xuất và điền thông tin vào hồ sơ của bạn.
                                        </p>
                                     </div>
                                     <Button variant="secondary" className="ml-auto bg-white shadow-sm border">
                                        <Briefcase className="w-4 h-4 mr-2" /> Chọn tệp tin
                                     </Button>
                                </div>
                                <div className="mt-4 w-full h-px bg-slate-200"></div>
                                <p className="text-xs text-slate-400 mt-2">Kéo thả tệp tin của bạn vào đây</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 2. GENERAL INFO FORM */}
                <Card className="border-none shadow-sm">
                    <CardHeader className="border-b pb-4">
                         <CardTitle className="text-lg flex items-center gap-2">
                            <User className="w-5 h-5 text-blue-600" /> Thông tin chung
                         </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Họ và tên</label>
                                <Input defaultValue="Nguyễn Văn A" className="bg-slate-50 border-slate-200 focus:bg-white" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Chức danh hiện tại</label>
                                <Input placeholder="Ví dụ: Frontend Developer" className="bg-slate-50 border-slate-200 focus:bg-white" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Email</label>
                                <Input defaultValue="nguyen.vana@email.com" className="bg-slate-50 border-slate-200 focus:bg-white" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Số điện thoại</label>
                                <Input placeholder="09xx xxx xxx" className="bg-slate-50 border-slate-200 focus:bg-white" />
                            </div>
                        </div>

                        <div className="space-y-2 relative">
                            <label className="text-sm font-medium text-slate-700">Giới thiệu bản thân</label>
                            <div className="relative">
                                <Textarea 
                                    placeholder="Tóm tắt ngắn gọn về kinh nghiệm và mục tiêu nghề nghiệp của bạn..." 
                                    className="min-h-[120px] bg-slate-50 border-slate-200 focus:bg-white resize-none pb-10" 
                                />
                                <Button size="sm" variant="ghost" className="absolute bottom-2 right-2 text-blue-600 bg-blue-50 hover:bg-blue-100 h-7 text-xs">
                                    <Wand2 className="w-3 h-3 mr-1.5" /> Viết bằng AI
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 3. EXPERIENCE SECTION */}
                <Card className="border-none shadow-sm">
                    <CardHeader className="border-b pb-4 flex flex-row items-center justify-between">
                         <CardTitle className="text-lg flex items-center gap-2">
                            <Briefcase className="w-5 h-5 text-blue-600" /> Kinh nghiệm làm việc
                         </CardTitle>
                         <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                            <Plus className="w-4 h-4 mr-1" /> Thêm mới
                         </Button>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        
                        {/* Job Item 1 */}
                        <div className="group relative pl-4 border-l-2 border-slate-200 hover:border-blue-400 transition-colors">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-bold text-slate-900 text-base">Senior UI/UX Designer</h4>
                                    <p className="text-sm text-slate-600">Tech Solutions Inc. • Hà Nội</p>
                                    <p className="text-xs text-slate-400 mt-1">Tháng 01/2021 - Hiện tại (3 năm 2 tháng)</p>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-blue-600"><PenLine className="w-4 h-4"/></Button>
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4"/></Button>
                                </div>
                            </div>
                            <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                                Chịu trách nhiệm thiết kế giao diện người dùng cho các sản phẩm SaaS. Phối hợp với team Product và Engineering để tối ưu trải nghiệm người dùng.
                            </p>
                        </div>

                        <Separator />

                        {/* Job Item 2 */}
                        <div className="group relative pl-4 border-l-2 border-slate-200 hover:border-blue-400 transition-colors">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-bold text-slate-900 text-base">Junior Graphic Designer</h4>
                                    <p className="text-sm text-slate-600">Creative Agency X • TP. HCM</p>
                                    <p className="text-xs text-slate-400 mt-1">Tháng 06/2019 - 12/2020</p>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-blue-600"><PenLine className="w-4 h-4"/></Button>
                                </div>
                            </div>
                        </div>

                    </CardContent>
                </Card>
                
                 {/* 4. EDUCATION SECTION */}
                 <Card className="border-none shadow-sm">
                    <CardHeader className="border-b pb-4 flex flex-row items-center justify-between">
                         <CardTitle className="text-lg flex items-center gap-2">
                            <GraduationCap className="w-5 h-5 text-blue-600" /> Học vấn
                         </CardTitle>
                         <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                            <Plus className="w-4 h-4 mr-1" /> Thêm mới
                         </Button>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="group flex justify-between items-start">
                             <div className="flex gap-4">
                                <div className="w-12 h-12 bg-slate-100 rounded border flex items-center justify-center">
                                    <span className="text-xs font-bold text-slate-500">HUST</span> {/* Giả logo */}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-base">Đại học Bách Khoa Hà Nội</h4>
                                    <p className="text-sm text-slate-600">Cử nhân Công nghệ thông tin</p>
                                    <p className="text-xs text-slate-400 mt-1">2015 - 2019</p>
                                </div>
                             </div>
                             <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-blue-600 opacity-0 group-hover:opacity-100"><PenLine className="w-4 h-4"/></Button>
                        </div>
                    </CardContent>
                </Card>

                 {/* 5. SKILLS SECTION */}
                 <Card className="border-none shadow-sm">
                    <CardHeader className="border-b pb-4 flex flex-row items-center justify-between">
                         <CardTitle className="text-lg flex items-center gap-2">
                            <Settings className="w-5 h-5 text-blue-600" /> Kỹ năng chuyên môn
                         </CardTitle>
                         <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> Gợi ý từ AI dựa trên CV
                         </span>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                        <Input placeholder="Tìm kiếm kỹ năng (ví dụ: Photoshop, Java...)" className="bg-slate-50 border-slate-200" />
                        
                        <div className="flex flex-wrap gap-2">
                            {/* Selected Skills */}
                            <Badge className="bg-blue-100 hover:bg-blue-200 text-blue-700 border-blue-200 pl-3 pr-1 py-1 text-sm font-medium gap-1">
                                Figma <button className="hover:bg-blue-300 rounded-full p-0.5"><X className="w-3 h-3"/></button>
                            </Badge>
                            <Badge className="bg-blue-100 hover:bg-blue-200 text-blue-700 border-blue-200 pl-3 pr-1 py-1 text-sm font-medium gap-1">
                                Adobe XD <button className="hover:bg-blue-300 rounded-full p-0.5"><X className="w-3 h-3"/></button>
                            </Badge>
                             <Badge className="bg-blue-100 hover:bg-blue-200 text-blue-700 border-blue-200 pl-3 pr-1 py-1 text-sm font-medium gap-1">
                                HTML/CSS <button className="hover:bg-blue-300 rounded-full p-0.5"><X className="w-3 h-3"/></button>
                            </Badge>

                            {/* Suggested Skills */}
                            <Badge variant="outline" className="bg-slate-50 text-slate-600 border-dashed border-slate-300 hover:border-slate-400 cursor-pointer py-1 text-sm font-normal">
                                + ReactJS
                            </Badge>
                            <Badge variant="outline" className="bg-slate-50 text-slate-600 border-dashed border-slate-300 hover:border-slate-400 cursor-pointer py-1 text-sm font-normal">
                                + Tailwind CSS
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t bg-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
            <p>© 2024 RecruitAI. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
                <Link href="#" className="hover:text-slate-900">Điều khoản sử dụng</Link>
                <Link href="#" className="hover:text-slate-900">Chính sách bảo mật</Link>
                <Link href="#" className="hover:text-slate-900">Trợ giúp</Link>
            </div>
        </div>
      </footer>
    </div>
  );
}

// Helper Component for Sidebar Menu Item
const NavItem = ({ icon, label, active = false, completed = false }: { icon: React.ReactNode, label: string, active?: boolean, completed?: boolean }) => {
    return (
        <div className={`
            flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors
            ${active ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-slate-600 hover:bg-slate-50'}
        `}>
            <div className="flex items-center gap-3">
                {icon}
                <span className="text-sm">{label}</span>
            </div>
            {completed && <CheckCircle2 className="w-4 h-4 text-green-500" />}
            {!completed && !active && <Circle className="w-4 h-4 text-slate-200" />}
        </div>
    )
}