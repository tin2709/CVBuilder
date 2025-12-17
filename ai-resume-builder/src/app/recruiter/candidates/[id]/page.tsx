"use client";

import Link from "next/link";
import { 
  Mail, Phone, Linkedin, Download, MapPin, Briefcase, DollarSign, 
  CheckCircle2, AlertTriangle, Send, MoreHorizontal, FileText, 
  Clock, Calendar, ThumbsUp, XCircle, ChevronLeft 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

export default function CandidateDetailPage() {
  return (
    <div className="min-h-screen bg-[#F3F4F6] pb-10">
      
      {/* HEADER NAV */}
      <header className="bg-white border-b sticky top-0 z-40 px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
            <Link href="/" className="font-bold text-xl flex items-center gap-2">
                <div className="bg-blue-600 p-1 rounded text-white"><Briefcase className="w-4 h-4"/></div> RecruitAI
            </Link>
            <div className="h-6 w-px bg-slate-300 mx-2"></div>
            <div className="relative w-64">
                <Input className="bg-slate-100 border-none h-9 rounded-full pl-8" placeholder="Tìm kiếm ứng viên..." />
            </div>
        </div>
        <div className="flex gap-4 text-sm font-medium text-slate-600">
            <Link href="#">Dashboard</Link>
            <Link href="#">Jobs</Link>
            <Link href="#" className="text-blue-600">Candidates</Link>
            <Link href="#">Reports</Link>
        </div>
        <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8"><AvatarImage src="https://github.com/shadcn.png"/></Avatar>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 py-6 space-y-6">
        
        {/* BREADCRUMB */}
        <div className="flex items-center text-xs text-slate-500">
            <span>Ứng viên</span> <ChevronLeft className="w-3 h-3 mx-1 rotate-180" />
            <span>Tất cả hồ sơ</span> <ChevronLeft className="w-3 h-3 mx-1 rotate-180" />
            <span className="font-bold text-slate-900">Nguyễn Văn A</span>
        </div>

        {/* PROFILE HEADER CARD */}
        <Card className="border-none shadow-sm">
            <CardContent className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-5">
                    <div className="relative">
                        <Avatar className="w-24 h-24 border-4 border-slate-50">
                            <AvatarImage src="https://randomuser.me/api/portraits/women/44.jpg" />
                            <AvatarFallback>NA</AvatarFallback>
                        </Avatar>
                        <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-slate-900">Nguyễn Văn A</h1>
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 uppercase text-[10px] font-bold tracking-wider">High Match</Badge>
                        </div>
                        <p className="text-lg text-slate-600">Senior Frontend Developer tại TechCorp</p>
                        <div className="flex flex-wrap gap-4 text-sm text-slate-500 mt-2">
                            <span className="flex items-center gap-1"><MapPin className="w-4 h-4"/> Hà Nội, Việt Nam</span>
                            <span className="flex items-center gap-1"><Briefcase className="w-4 h-4"/> 5 Năm kinh nghiệm</span>
                            <span className="flex items-center gap-1"><DollarSign className="w-4 h-4"/> Mong muốn: $2000</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="gap-2 border-slate-300 text-slate-700">
                        <Mail className="w-4 h-4" /> Gửi Email
                    </Button>
                    <Button className="gap-2 bg-blue-600 hover:bg-blue-700 shadow-blue-200 shadow-md">
                        <Calendar className="w-4 h-4" /> Mời phỏng vấn
                    </Button>
                </div>
            </CardContent>
        </Card>

        {/* MAIN GRID LAYOUT */}
        <div className="grid grid-cols-12 gap-6">
            
            {/* LEFT SIDEBAR (3 cols) */}
            <div className="col-span-12 lg:col-span-3 space-y-6">
                {/* Contact Info */}
                <Card className="border-none shadow-sm">
                    <CardHeader className="pb-3"><CardTitle className="text-base font-bold">Thông tin liên hệ</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded bg-blue-50 flex items-center justify-center text-blue-600"><Mail className="w-4 h-4"/></div>
                            <div className="overflow-hidden">
                                <p className="text-xs text-slate-400 font-bold uppercase">Email</p>
                                <p className="text-sm font-medium truncate">nguyenvana@example.com</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded bg-blue-50 flex items-center justify-center text-blue-600"><Phone className="w-4 h-4"/></div>
                            <div>
                                <p className="text-xs text-slate-400 font-bold uppercase">Điện thoại</p>
                                <p className="text-sm font-medium">+84 901 234 567</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded bg-blue-50 flex items-center justify-center text-blue-600"><Linkedin className="w-4 h-4"/></div>
                            <div>
                                <p className="text-xs text-slate-400 font-bold uppercase">Social</p>
                                <Link href="#" className="text-sm font-medium text-blue-600 hover:underline">LinkedIn Profile</Link>
                            </div>
                        </div>
                        <Button variant="outline" className="w-full mt-2 border-dashed border-slate-300">
                            <Download className="w-4 h-4 mr-2" /> Tải xuống CV gốc
                        </Button>
                    </CardContent>
                </Card>

                {/* Skills */}
                <Card className="border-none shadow-sm">
                    <CardHeader className="pb-3"><CardTitle className="text-base font-bold">Kỹ năng</CardTitle></CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {["ReactJS", "TypeScript", "Tailwind CSS", "Node.js", "Git", "Figma"].map(skill => (
                                <Badge key={skill} variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-200 font-medium">
                                    {skill}
                                </Badge>
                            ))}
                            <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">+3 more</Badge>
                        </div>
                    </CardContent>
                </Card>

                 {/* Education */}
                 <Card className="border-none shadow-sm">
                    <CardHeader className="pb-3"><CardTitle className="text-base font-bold">Học vấn & Ngôn ngữ</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="font-bold text-sm text-slate-900">Đại học Bách Khoa HN</p>
                            <p className="text-xs text-slate-500">Cử nhân CNTT • 2014 - 2018</p>
                        </div>
                        <Separator />
                        <div>
                            <p className="font-bold text-sm text-slate-900">Tiếng Anh</p>
                            <p className="text-xs text-slate-500">IELTS 7.0 (Professional)</p>
                        </div>
                        <div>
                            <p className="font-bold text-sm text-slate-900">Tiếng Nhật</p>
                            <p className="text-xs text-slate-500">N3 (Conversational)</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* CENTER CONTENT (6 cols) */}
            <div className="col-span-12 lg:col-span-6 space-y-6">
                
                {/* AI Analysis Card */}
                <Card className="border-none shadow-sm overflow-hidden">
                    <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-white flex flex-row justify-between items-center">
                        <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-800">
                            <span className="text-blue-600">✨</span> Phân tích AI
                        </CardTitle>
                        <span className="text-[10px] text-slate-400">Cập nhật: 10 phút trước</span>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-6">
                            {/* Circular Progress Simulated */}
                            <div className="relative w-24 h-24 flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" />
                                    <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-blue-500" strokeDasharray="251.2" strokeDashoffset="37.6" strokeLinecap="round" />
                                </svg>
                                <span className="absolute text-xl font-bold text-blue-600">85%</span>
                            </div>
                            
                            <div className="flex-1 space-y-2">
                                <h3 className="font-bold text-slate-900 text-lg">Rất phù hợp</h3>
                                <p className="text-xs text-slate-500">Vị trí: Sr Frontend Dev</p>
                                <div className="space-y-1 mt-2">
                                    <div className="flex items-center gap-2 text-xs text-slate-600">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> Kinh nghiệm phù hợp (5+ năm)
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-600">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> Stack công nghệ trùng khớp 90%
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-600">
                                        <AlertTriangle className="w-3.5 h-3.5 text-orange-500" /> Mức lương mong muốn cao hơn budget
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Tabs & Content */}
                <div className="bg-white rounded-xl shadow-sm">
                    <Tabs defaultValue="detail" className="w-full">
                        <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                            <TabsTrigger value="detail" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 px-6 py-3">Hồ sơ chi tiết</TabsTrigger>
                            <TabsTrigger value="cv" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 px-6 py-3">CV Gốc (PDF)</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="detail" className="p-6">
                            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-slate-400" /> Kinh nghiệm làm việc
                            </h3>
                            
                            <div className="relative border-l-2 border-slate-200 ml-3 space-y-8 pb-4">
                                {/* Experience 1 */}
                                <div className="ml-6 relative">
                                    <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 border-blue-600 bg-white"></div>
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold text-slate-900">Senior Frontend Developer</h4>
                                        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">2021 - Hiện tại</span>
                                    </div>
                                    <p className="text-sm font-medium text-blue-600 mb-2">TechCorp Solutions</p>
                                    <p className="text-sm text-slate-600 leading-relaxed mb-3">
                                        Chịu trách nhiệm xây dựng và bảo trì hệ thống dashboard cho khách hàng doanh nghiệp. Tối ưu hóa hiệu năng React app, giảm thời gian load trang 40%. Mentor cho 3 Junior developers.
                                    </p>
                                    <div className="flex gap-2">
                                        <Badge variant="outline" className="text-xs font-normal text-slate-500 bg-slate-50">React</Badge>
                                        <Badge variant="outline" className="text-xs font-normal text-slate-500 bg-slate-50">Redux</Badge>
                                    </div>
                                </div>

                                {/* Experience 2 */}
                                <div className="ml-6 relative">
                                    <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 border-slate-300 bg-white"></div>
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold text-slate-900">Frontend Developer</h4>
                                        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">2018 - 2021</span>
                                    </div>
                                    <p className="text-sm font-medium text-blue-600 mb-2">Creative Agency X</p>
                                    <p className="text-sm text-slate-600 leading-relaxed mb-3">
                                        Phát triển các landing page và website thương mại điện tử. Làm việc trực tiếp với designer để chuyển đổi UI/UX thành code pixel-perfect.
                                    </p>
                                    <div className="flex gap-2">
                                        <Badge variant="outline" className="text-xs font-normal text-slate-500 bg-slate-50">VueJS</Badge>
                                        <Badge variant="outline" className="text-xs font-normal text-slate-500 bg-slate-50">Sass</Badge>
                                    </div>
                                </div>
                            </div>

                            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2 mt-8">
                                <FileText className="w-5 h-5 text-slate-400" /> Dự án nổi bật
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                    <h5 className="font-bold text-slate-900 text-sm">E-commerce Dashboard</h5>
                                    <p className="text-xs text-slate-500 mt-1 mb-2">Hệ thống quản lý đơn hàng realtime</p>
                                    <Link href="#" className="text-xs text-blue-600 hover:underline">Xem chi tiết ↗</Link>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                    <h5 className="font-bold text-slate-900 text-sm">Travel Booking App</h5>
                                    <p className="text-xs text-slate-500 mt-1 mb-2">Ứng dụng đặt vé máy bay & khách sạn</p>
                                    <Link href="#" className="text-xs text-blue-600 hover:underline">Xem chi tiết ↗</Link>
                                </div>
                            </div>

                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            {/* RIGHT SIDEBAR (3 cols) */}
            <div className="col-span-12 lg:col-span-3 space-y-6">
                
                {/* Timeline History */}
                <Card className="border-none shadow-sm">
                    <CardHeader className="pb-3"><CardTitle className="text-base font-bold">Lịch sử ứng tuyển</CardTitle></CardHeader>
                    <CardContent>
                        <div className="relative border-l border-slate-200 ml-2 space-y-6">
                            
                            {/* Step 1 */}
                            <div className="ml-5 relative">
                                <div className="absolute -left-[25px] top-1 w-3 h-3 rounded-full bg-blue-600 ring-4 ring-blue-100"></div>
                                <p className="font-bold text-sm text-slate-900">Phỏng vấn Kỹ thuật</p>
                                <p className="text-xs text-slate-500">15:00, Hôm nay</p>
                                <Badge className="mt-1 bg-blue-100 text-blue-600 hover:bg-blue-100 h-5 px-2 text-[10px]">Đang diễn ra</Badge>
                            </div>

                             {/* Step 2 */}
                             <div className="ml-5 relative">
                                <div className="absolute -left-[25px] top-1 w-3 h-3 rounded-full bg-green-500"></div>
                                <p className="font-bold text-sm text-slate-900">Sơ loại hồ sơ</p>
                                <p className="text-xs text-slate-500">10/10/2023</p>
                                <p className="text-xs text-slate-600 italic mt-1">"CV ấn tượng, match cao"</p>
                            </div>

                            {/* Step 3 */}
                            <div className="ml-5 relative">
                                <div className="absolute -left-[25px] top-1 w-3 h-3 rounded-full bg-green-500"></div>
                                <p className="font-bold text-sm text-slate-900">Ứng tuyển</p>
                                <p className="text-xs text-slate-500">09/10/2023</p>
                                <p className="text-xs text-slate-500">Qua LinkedIn</p>
                            </div>
                        </div>

                        <div className="flex gap-2 mt-6">
                            <Button variant="outline" className="flex-1 text-red-500 border-red-100 hover:bg-red-50 hover:text-red-600">Từ chối</Button>
                            <Button variant="outline" className="flex-1 border-slate-200">Lưu vào kho</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Internal Notes */}
                <Card className="border-none shadow-sm">
                    <CardHeader className="pb-3 flex flex-row justify-between items-center">
                        <CardTitle className="text-base font-bold">Ghi chú nội bộ</CardTitle>
                        <Badge variant="secondary" className="bg-slate-100">2</Badge>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <div className="flex justify-between items-center mb-1">
                                <div className="flex items-center gap-2">
                                    <Avatar className="w-5 h-5"><AvatarFallback className="bg-purple-600 text-white text-[9px]">LT</AvatarFallback></Avatar>
                                    <span className="text-xs font-bold text-slate-900">Lê Thu (HR)</span>
                                </div>
                                <span className="text-[10px] text-slate-400">Hôm qua</span>
                            </div>
                            <p className="text-xs text-slate-600 leading-snug">
                                Ứng viên giao tiếp tốt bằng tiếng Anh. Tuy nhiên mong muốn lương hơi cao so với range Junior.
                            </p>
                        </div>

                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <div className="flex justify-between items-center mb-1">
                                <div className="flex items-center gap-2">
                                    <Avatar className="w-5 h-5"><AvatarFallback className="bg-blue-600 text-white text-[9px]">TM</AvatarFallback></Avatar>
                                    <span className="text-xs font-bold text-slate-900">Trần Minh (PM)</span>
                                </div>
                                <span className="text-[10px] text-slate-400">2 giờ trước</span>
                            </div>
                            <p className="text-xs text-slate-600 leading-snug">
                                Đã xem qua portfolio, dự án E-commerce khá ấn tượng. Nên hỏi sâu về cách optimize performance.
                            </p>
                        </div>

                        <div className="relative">
                            <Input placeholder="Thêm ghi chú..." className="pr-8 h-9 text-xs bg-white" />
                            <Send className="w-3.5 h-3.5 absolute right-2.5 top-3 text-blue-600 cursor-pointer" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
      </main>
    </div>
  );
}