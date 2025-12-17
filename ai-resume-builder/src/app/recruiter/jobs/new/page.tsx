"use client";

import Link from "next/link";
import { 
  ChevronRight, Bot, Bold, Italic, List, AlignLeft, Link as LinkIcon, 
  Sparkles, X, MapPin, DollarSign, Briefcase, Building2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function PostJobPage() {
  return (
    <div className="min-h-screen bg-[#F3F4F6] pb-20 font-sans text-slate-900">
      
      {/* --- HEADER --- */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-slate-800">
            <div className="bg-blue-600 p-1.5 rounded-lg text-white">
               <Briefcase className="w-5 h-5" />
            </div>
            SmartRecruit AI
          </Link>
          
          <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
            <Link href="#" className="hover:text-blue-600">Tổng quan</Link>
            <Link href="#" className="hover:text-blue-600">Ứng viên</Link>
            <Link href="#" className="text-blue-600 font-semibold border-b-2 border-blue-600 pb-5 -mb-5">Tin tuyển dụng</Link>
            <Link href="#" className="hover:text-blue-600">Báo cáo</Link>
          </nav>

          <Avatar className="w-8 h-8 cursor-pointer">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>HR</AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        
        {/* Breadcrumb & Title */}
        <div className="mb-8">
            <div className="flex items-center text-xs text-slate-500 mb-2">
                <span className="hover:underline cursor-pointer">Trang chủ</span>
                <ChevronRight className="w-3 h-3 mx-1" />
                <span className="hover:underline cursor-pointer">Tuyển dụng</span>
                <ChevronRight className="w-3 h-3 mx-1" />
                <span className="font-semibold text-slate-900">Đăng tin mới</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Đăng tin tuyển dụng mới</h1>
            <p className="text-slate-500 mt-1 text-sm">Tạo vị trí tuyển dụng mới để tìm kiếm ứng viên tài năng. AI sẽ hỗ trợ bạn tối ưu hóa nội dung.</p>
        </div>

        {/* --- FORM CARD --- */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 space-y-10">
            
            {/* SECTION 1: THÔNG TIN CHUNG */}
            <section className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">1</div>
                    <h2 className="font-bold text-lg text-slate-900">Thông tin chung</h2>
                </div>

                <div className="space-y-4">
                    {/* Job Title */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Tiêu đề công việc <span className="text-red-500">*</span></Label>
                        <Input placeholder="Ví dụ: Senior Frontend Developer" className="bg-slate-50 border-slate-200" />
                    </div>

                    {/* Department & Level */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Phòng ban / Chuyên môn</Label>
                            <Select defaultValue="it">
                                <SelectTrigger className="bg-slate-50 border-slate-200">
                                    <SelectValue placeholder="Chọn phòng ban" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="it">Công nghệ thông tin</SelectItem>
                                    <SelectItem value="marketing">Marketing</SelectItem>
                                    <SelectItem value="sales">Sales</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Cấp bậc</Label>
                            <Select defaultValue="staff">
                                <SelectTrigger className="bg-slate-50 border-slate-200">
                                    <SelectValue placeholder="Chọn cấp bậc" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="intern">Thực tập sinh</SelectItem>
                                    <SelectItem value="staff">Nhân viên</SelectItem>
                                    <SelectItem value="manager">Quản lý</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Location & Type */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Địa điểm làm việc</Label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input defaultValue="Hà Nội, TPHCM..." className="pl-9 bg-slate-50 border-slate-200" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Hình thức làm việc</Label>
                            <RadioGroup defaultValue="fulltime" className="flex gap-4">
                                <div className="flex items-center space-x-2 border rounded-lg p-3 w-full bg-slate-50 cursor-pointer hover:bg-white hover:border-blue-400 transition-colors">
                                    <RadioGroupItem value="fulltime" id="fulltime" className="text-blue-600" />
                                    <Label htmlFor="fulltime" className="cursor-pointer">Toàn thời gian</Label>
                                </div>
                                <div className="flex items-center space-x-2 border rounded-lg p-3 w-full bg-slate-50 cursor-pointer hover:bg-white hover:border-blue-400 transition-colors">
                                    <RadioGroupItem value="parttime" id="parttime" className="text-blue-600" />
                                    <Label htmlFor="parttime" className="cursor-pointer">Bán thời gian</Label>
                                </div>
                            </RadioGroup>
                        </div>
                    </div>
                </div>
            </section>

            <hr className="border-slate-100" />

            {/* SECTION 2: CHI TIẾT CÔNG VIỆC */}
            <section className="space-y-6">
                 <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">2</div>
                        <h2 className="font-bold text-lg text-slate-900">Chi tiết công việc</h2>
                    </div>
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white gap-2 shadow-purple-200 shadow-md">
                        <Sparkles className="w-4 h-4" /> Viết bằng AI
                    </Button>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Mô tả công việc</Label>
                        <div className="border border-slate-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                            {/* Fake Toolbar */}
                            <div className="bg-slate-50 border-b border-slate-200 p-2 flex gap-1">
                                <Button variant="ghost" size="icon" className="h-7 w-7"><Bold className="w-4 h-4 text-slate-600" /></Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7"><Italic className="w-4 h-4 text-slate-600" /></Button>
                                <div className="w-px h-5 bg-slate-300 mx-1 my-auto"></div>
                                <Button variant="ghost" size="icon" className="h-7 w-7"><List className="w-4 h-4 text-slate-600" /></Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7"><AlignLeft className="w-4 h-4 text-slate-600" /></Button>
                                <div className="w-px h-5 bg-slate-300 mx-1 my-auto"></div>
                                <Button variant="ghost" size="icon" className="h-7 w-7"><LinkIcon className="w-4 h-4 text-slate-600" /></Button>
                            </div>
                            <Textarea 
                                placeholder="Mô tả chi tiết trách nhiệm công việc..." 
                                className="border-none shadow-none resize-none focus-visible:ring-0 min-h-[150px] p-4" 
                            />
                            {/* Resize handle giả */}
                             <div className="h-3 bg-slate-50 border-t border-slate-100 cursor-ns-resize flex justify-end px-2">
                                <div className="w-3 h-full border-r border-slate-300 -skew-x-12 opacity-50"></div>
                             </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-blue-500 mt-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                            Mẹo: Sử dụng AI để tạo bản nháp nhanh chóng dựa trên tiêu đề công việc.
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Yêu cầu ứng viên</Label>
                        <Textarea 
                            placeholder="Kinh nghiệm, kỹ năng chuyên môn, bằng cấp..." 
                            className="bg-white border-slate-200 min-h-[100px]" 
                        />
                    </div>
                </div>
            </section>
            
            <hr className="border-slate-100" />

            {/* SECTION 3: LƯƠNG & KỸ NĂNG */}
            <section className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">3</div>
                    <h2 className="font-bold text-lg text-slate-900">Lương & Kỹ năng</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Salary */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Mức lương (Tháng)</Label>
                        <div className="flex items-center gap-2">
                            <div className="relative flex-1">
                                <Input placeholder="Min" className="pr-10 bg-slate-50 border-slate-200" />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">VND</span>
                            </div>
                            <span className="text-slate-400">-</span>
                            <div className="relative flex-1">
                                <Input placeholder="Max" className="pr-10 bg-slate-50 border-slate-200" />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">VND</span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                            <Checkbox id="negotiable" />
                            <label htmlFor="negotiable" className="text-sm font-medium leading-none text-slate-600 cursor-pointer">
                                Thỏa thuận
                            </label>
                        </div>
                    </div>

                    {/* Skills Input */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Kỹ năng yêu cầu</Label>
                        <div className="min-h-[44px] p-2 bg-slate-50 border border-slate-200 rounded-md flex flex-wrap gap-2 items-center focus-within:ring-2 focus-within:ring-slate-900/10 focus-within:border-slate-400">
                             <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200 pl-2 pr-1 gap-1 h-7">
                                ReactJS <button><X className="w-3 h-3 hover:text-red-500"/></button>
                             </Badge>
                             <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200 pl-2 pr-1 gap-1 h-7">
                                TypeScript <button><X className="w-3 h-3 hover:text-red-500"/></button>
                             </Badge>
                             <input 
                                className="bg-transparent border-none outline-none text-sm flex-1 min-w-[120px]" 
                                placeholder="Nhập và ấn Enter..."
                             />
                        </div>
                        <div className="flex gap-2 text-xs text-slate-500 mt-1">
                            <span>Gợi ý:</span>
                            <span className="bg-slate-100 px-2 py-0.5 rounded cursor-pointer hover:bg-slate-200">NodeJS</span>
                            <span className="bg-slate-100 px-2 py-0.5 rounded cursor-pointer hover:bg-slate-200">Tailwind CSS</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ACTION BUTTONS */}
            <div className="flex justify-end gap-4 pt-6">
                <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50 px-6">
                    Lưu nháp
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 px-6 shadow-lg shadow-blue-200">
                    Đăng tuyển ngay
                </Button>
            </div>

        </div>
        
        {/* Footer Text */}
        <p className="text-center text-xs text-slate-400 mt-8">
            Bằng việc đăng tin, bạn đồng ý với <Link href="#" className="text-blue-500">Điều khoản dịch vụ</Link> và <Link href="#" className="text-blue-500">Chính sách quyền riêng tư</Link> của SmartRecruit.
        </p>

      </main>
    </div>
  );
}