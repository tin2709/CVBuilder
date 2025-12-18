"use client";

import { 
  Bell, Search, UploadCloud, FileSpreadsheet, Filter, 
  MoreHorizontal, Phone, Mail, MapPin, Sparkles, 
  CheckCircle, Briefcase, ChevronDown, Star, User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

export default function AiScreeningPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* HEADER */}
      <header className="bg-white border-b sticky top-0 z-50 px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
           <div className="flex items-center gap-2 font-bold text-xl text-indigo-600">
              <Sparkles className="w-6 h-6"/> AI Recruiter
           </div>
           <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
              <a href="#" className="hover:text-indigo-600">Dashboard</a>
              <a href="#" className="hover:text-indigo-600">Tin tuyển dụng</a>
              <a href="#" className="text-indigo-600 font-bold">Sàng lọc CV</a>
              <a href="#" className="hover:text-indigo-600">Báo cáo</a>
           </nav>
        </div>
        <div className="flex items-center gap-4">
           <Button variant="ghost" size="icon" className="text-slate-500"><Bell className="w-5 h-5"/></Button>
           <Avatar className="w-8 h-8 cursor-pointer">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>HR</AvatarFallback>
           </Avatar>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 py-6 space-y-6">
         
         {/* PAGE TITLE & ACTIONS */}
         <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
               <h1 className="text-2xl font-bold flex items-center gap-3">
                  Kết quả Sàng lọc AI 
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none font-medium px-2 py-0.5">Hoàn tất</Badge>
               </h1>
               <p className="text-slate-500 text-sm mt-1">Vị trí: <span className="font-semibold text-slate-800">Senior React Developer (JD-2023-01)</span></p>
            </div>
            <div className="flex gap-3">
               <Button variant="outline" className="bg-white"><UploadCloud className="w-4 h-4 mr-2"/> Tải lên CV mới</Button>
               <Button className="bg-indigo-600 hover:bg-indigo-700"><FileSpreadsheet className="w-4 h-4 mr-2"/> Xuất báo cáo</Button>
            </div>
         </div>

         {/* STATS CARDS */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="shadow-sm border-slate-200">
               <CardContent className="p-4 flex items-center justify-between">
                  <div>
                     <p className="text-sm text-slate-500 font-medium">Tổng CV đã quét</p>
                     <div className="text-3xl font-bold text-slate-900 mt-1">142</div>
                     <p className="text-xs text-green-600 flex items-center mt-1 font-medium"><span className="text-green-500 mr-1">↗</span> +12 tuần này</p>
                  </div>
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600"><FileSpreadsheet className="w-5 h-5"/></div>
               </CardContent>
            </Card>
            <Card className="shadow-sm border-slate-200">
               <CardContent className="p-4 flex items-center justify-between">
                  <div>
                     <p className="text-sm text-slate-500 font-medium">Ứng viên Tiềm năng ({'>'} 80%)</p>
                     <div className="text-3xl font-bold text-slate-900 mt-1">28</div>
                     <p className="text-xs text-slate-400 mt-1">Chiếm 19.7% tổng số</p>
                  </div>
                  <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-600"><Star className="w-5 h-5 fill-current"/></div>
               </CardContent>
            </Card>
            <Card className="shadow-sm border-slate-200">
               <CardContent className="p-4 flex items-center justify-between">
                  <div>
                     <p className="text-sm text-slate-500 font-medium">Điểm phù hợp trung bình</p>
                     <div className="text-3xl font-bold text-slate-900 mt-1">76%</div>
                     <p className="text-xs text-green-600 flex items-center mt-1 font-medium"><span className="text-green-500 mr-1">↗</span> +5% so với tháng trước</p>
                  </div>
                  <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600"><div className="w-5 h-5 flex items-end gap-0.5"><div className="w-1.5 h-2 bg-current rounded-sm"></div><div className="w-1.5 h-3 bg-current rounded-sm"></div><div className="w-1.5 h-4 bg-current rounded-sm"></div></div></div>
               </CardContent>
            </Card>
         </div>

         {/* FILTER BAR */}
         <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
            <div className="relative flex-1 min-w-[200px]">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
               <Input className="pl-9 border-none shadow-none focus-visible:ring-0 bg-transparent" placeholder="Tìm kiếm theo tên, kỹ năng..."/>
            </div>
            <div className="h-6 w-px bg-slate-200 hidden md:block"></div>
            <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 cursor-pointer px-3 py-1.5 h-auto">Điểm {'>'} 80% <span className="ml-2">×</span></Badge>
            <Button variant="ghost" size="sm" className="text-slate-600 font-normal">Kinh nghiệm {'>'} 3 năm <ChevronDown className="w-3 h-3 ml-2 text-slate-400"/></Button>
            <Button variant="ghost" size="sm" className="text-slate-600 font-normal">Trạng thái: Chưa xem <ChevronDown className="w-3 h-3 ml-2 text-slate-400"/></Button>
            <Button variant="ghost" size="sm" className="text-slate-600 font-normal">Kỹ năng quản lý <ChevronDown className="w-3 h-3 ml-2 text-slate-400"/></Button>
            <div className="flex items-center gap-1 border-l pl-2 ml-auto">
               <Button variant="ghost" size="icon" className="text-slate-400"><Filter className="w-4 h-4"/></Button>
               <Button variant="ghost" size="icon" className="text-slate-400"><MoreHorizontal className="w-4 h-4"/></Button>
            </div>
         </div>

         {/* MAIN SPLIT VIEW */}
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-320px)] min-h-[600px]">
            
            {/* LEFT SIDEBAR: LIST */}
            <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col">
               <div className="p-4 border-b bg-slate-50/50 flex justify-between items-center">
                  <span className="font-bold text-slate-700">Danh sách ứng viên (28)</span>
                  <span className="text-xs text-slate-400 cursor-pointer">Sắp xếp: Điểm cao nhất</span>
               </div>
               <div className="overflow-y-auto flex-1 p-2 space-y-1">
                  {/* Active Item */}
                  <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg cursor-pointer flex gap-3 relative">
                     <div className="absolute top-3 right-3 text-indigo-600 font-bold text-sm">94%</div>
                     <Avatar className="w-12 h-12 border-2 border-white shadow-sm">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>HV</AvatarFallback>
                     </Avatar>
                     <div>
                        <h4 className="font-bold text-slate-900 text-sm">Nguyễn Văn Hùng</h4>
                        <p className="text-xs text-slate-500 mt-0.5">Senior React Dev • 5 năm kn</p>
                        <div className="flex gap-1 mt-2">
                           <Badge variant="secondary" className="bg-white text-[10px] px-1.5 py-0 h-5 text-slate-500 border border-slate-200">ReactJS</Badge>
                           <Badge variant="secondary" className="bg-white text-[10px] px-1.5 py-0 h-5 text-slate-500 border border-slate-200">NodeJS</Badge>
                           <span className="text-[10px] text-slate-400 flex items-center">+3</span>
                        </div>
                     </div>
                     <div className="absolute left-0 top-3 bottom-3 w-1 bg-indigo-600 rounded-r"></div>
                  </div>

                  {/* Other Items */}
                  <div className="p-3 hover:bg-slate-50 rounded-lg cursor-pointer flex gap-3 relative opacity-70 hover:opacity-100 transition-opacity">
                     <div className="absolute top-3 right-3 text-green-600 font-bold text-sm">88%</div>
                     <Avatar className="w-12 h-12">
                         <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80"/>
                        <AvatarFallback>TM</AvatarFallback>
                     </Avatar>
                     <div>
                        <h4 className="font-bold text-slate-900 text-sm">Trần Thị Mai</h4>
                        <p className="text-xs text-slate-500 mt-0.5">Frontend Dev • 4 năm kn</p>
                        <div className="flex gap-1 mt-2">
                           <Badge variant="secondary" className="bg-slate-100 text-[10px] px-1.5 py-0 h-5 text-slate-500">React</Badge>
                           <Badge variant="secondary" className="bg-slate-100 text-[10px] px-1.5 py-0 h-5 text-slate-500">TypeScript</Badge>
                        </div>
                     </div>
                  </div>

                  <div className="p-3 hover:bg-slate-50 rounded-lg cursor-pointer flex gap-3 relative opacity-70 hover:opacity-100 transition-opacity">
                     <div className="absolute top-3 right-3 text-yellow-600 font-bold text-sm">76%</div>
                     <Avatar className="w-12 h-12">
                         <AvatarImage src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80"/>
                        <AvatarFallback>LH</AvatarFallback>
                     </Avatar>
                     <div>
                        <h4 className="font-bold text-slate-900 text-sm">Lê Văn Hải</h4>
                        <p className="text-xs text-slate-500 mt-0.5">Fullstack Dev • 2 năm kn</p>
                        <div className="flex gap-1 mt-2">
                           <Badge variant="secondary" className="bg-slate-100 text-[10px] px-1.5 py-0 h-5 text-slate-500">Java</Badge>
                           <Badge variant="secondary" className="bg-slate-100 text-[10px] px-1.5 py-0 h-5 text-slate-500">Spring</Badge>
                        </div>
                     </div>
                  </div>
                  
                   <div className="p-3 hover:bg-slate-50 rounded-lg cursor-pointer flex gap-3 relative opacity-70 hover:opacity-100 transition-opacity">
                     <div className="absolute top-3 right-3 text-red-500 font-bold text-sm">45%</div>
                     <Avatar className="w-12 h-12 grayscale">
                        <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80"/>
                        <AvatarFallback>PM</AvatarFallback>
                     </Avatar>
                     <div>
                        <h4 className="font-bold text-slate-900 text-sm">Phạm Minh Tuấn</h4>
                        <p className="text-xs text-slate-500 mt-0.5">Junior Dev • 1 năm kn</p>
                        <div className="flex gap-1 mt-2">
                           <Badge variant="secondary" className="bg-slate-100 text-[10px] px-1.5 py-0 h-5 text-slate-500">HTML/CSS</Badge>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* RIGHT CONTENT: DETAIL */}
            <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 flex flex-col overflow-hidden">
               {/* Detail Header */}
               <div className="p-6 border-b flex justify-between items-start">
                  <div className="flex gap-4">
                     <Avatar className="w-16 h-16 border-2 border-indigo-100">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>HV</AvatarFallback>
                     </Avatar>
                     <div>
                        <div className="flex items-center gap-2">
                           <h2 className="text-xl font-bold text-slate-900">Nguyễn Văn Hùng</h2>
                           <div className="w-4 h-4 bg-blue-500 text-white rounded-full flex items-center justify-center text-[10px]"><CheckCircle className="w-3 h-3"/></div>
                        </div>
                        <p className="text-indigo-600 font-medium">Senior React Developer</p>
                        <div className="flex gap-4 text-xs text-slate-500 mt-2">
                           <span className="flex items-center gap-1"><Mail className="w-3 h-3"/> hung.nguyen@email.com</span>
                           <span className="flex items-center gap-1"><Phone className="w-3 h-3"/> 0909 123 456</span>
                           <span className="flex items-center gap-1"><MapPin className="w-3 h-3"/> TP. Hồ Chí Minh</span>
                        </div>
                     </div>
                  </div>
                  <div className="flex gap-2">
                     <Button variant="outline" size="icon" className="text-slate-500"><User className="w-4 h-4"/></Button>
                     <Button className="bg-indigo-600 hover:bg-indigo-700 font-medium shadow-indigo-100 shadow-lg">
                        <Briefcase className="w-4 h-4 mr-2"/> Mời phỏng vấn
                     </Button>
                  </div>
               </div>

               {/* Scrollable Content */}
               <div className="overflow-y-auto p-6 flex-1 bg-slate-50/30">
                  
                  {/* AI Insight Box */}
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-6 relative">
                     <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                           <Sparkles className="w-4 h-4 fill-current"/>
                        </div>
                        <div>
                           <h3 className="font-bold text-slate-900 text-sm mb-1">Đánh giá từ AI</h3>
                           <p className="text-sm text-slate-700 leading-relaxed">
                              Ứng viên có độ phù hợp rất cao (<span className="font-bold text-blue-700">94%</span>) với vị trí Senior React Developer. Điểm mạnh nổi bật là 5 năm kinh nghiệm chuyên sâu với React Ecosystem và đã từng lead team 4 người. Tuy nhiên, mức lương mong muốn cao hơn 15% so với budget dự kiến.
                           </p>
                           <div className="flex gap-2 mt-3">
                              <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200 font-semibold"><CheckCircle className="w-3 h-3 mr-1"/> Strong Tech Stack</Badge>
                              <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200 font-semibold"><CheckCircle className="w-3 h-3 mr-1"/> Good Education</Badge>
                              <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-200 font-semibold">⚠️ High Salary Expectation</Badge>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {/* Criteria */}
                     <div className="space-y-5">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                           <Filter className="w-4 h-4 text-slate-400"/> Tiêu chí đánh giá
                        </h3>
                        
                        <div className="space-y-4">
                           {[
                              { label: "Kỹ năng chuyên môn", val: 95, color: "bg-blue-600" },
                              { label: "Kinh nghiệm làm việc", val: 90, color: "bg-blue-600" },
                              { label: "Kỹ năng mềm/Quản lý", val: 82, color: "bg-blue-600" },
                              { label: "Ngoại ngữ (Tiếng Anh)", val: 75, color: "bg-yellow-400" },
                           ].map((item, idx) => (
                              <div key={idx}>
                                 <div className="flex justify-between text-sm mb-1.5">
                                    <span className="text-slate-600 font-medium">{item.label}</span>
                                    <span className="font-bold text-slate-900">{item.val}/100</span>
                                 </div>
                                 <Progress value={item.val} className={`h-2 bg-slate-200 [&>div]:${item.color}`} />
                              </div>
                           ))}
                        </div>

                        <div className="pt-4">
                           <h4 className="font-bold text-xs text-slate-500 uppercase mb-2">Từ khóa tìm thấy</h4>
                           <div className="flex flex-wrap gap-2">
                              {['React.js', 'Redux Saga', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Scrum Master'].map(tag => (
                                 <Badge key={tag} variant="secondary" className="bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200">{tag}</Badge>
                              ))}
                           </div>
                        </div>
                     </div>

                     {/* Experience Timeline */}
                     <div className="space-y-5">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                           <Briefcase className="w-4 h-4 text-slate-400"/> Tóm tắt kinh nghiệm
                        </h3>
                        
                        <div className="space-y-0 relative border-l-2 border-slate-100 ml-1.5">
                           <div className="pb-6 pl-6 relative">
                              <div className="w-3 h-3 bg-blue-600 rounded-full absolute -left-[7px] top-1.5 border-2 border-white ring-1 ring-blue-100"></div>
                              <h4 className="font-bold text-slate-900 text-sm">Senior Frontend Developer</h4>
                              <p className="text-xs text-blue-600 font-medium mb-1">TechCorp Inc. • 2021 - Hiện tại</p>
                              <p className="text-xs text-slate-600 leading-relaxed">Dẫn dắt team frontend, migrate hệ thống legacy sang Next.js.</p>
                           </div>
                           <div className="pb-6 pl-6 relative">
                              <div className="w-3 h-3 bg-slate-300 rounded-full absolute -left-[7px] top-1.5 border-2 border-white"></div>
                              <h4 className="font-bold text-slate-900 text-sm">Frontend Developer</h4>
                              <p className="text-xs text-slate-500 font-medium mb-1">Creative Agency • 2018 - 2021</p>
                              <p className="text-xs text-slate-600 leading-relaxed">Phát triển các landing page và web app cho khách hàng quốc tế.</p>
                           </div>
                        </div>

                        <div className="pt-2">
                           <h4 className="font-bold text-xs text-slate-500 uppercase mb-2">Ghi chú tuyển dụng</h4>
                           <div className="bg-white border rounded-lg p-2">
                              <Textarea placeholder="Thêm ghi chú cá nhân của bạn..." className="border-none shadow-none focus-visible:ring-0 min-h-[60px] resize-none text-sm"/>
                              <div className="flex justify-end p-1">
                                 <Button variant="ghost" size="sm" className="h-6 text-xs text-blue-600">Lưu ghi chú</Button>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

         </div>

      </main>
    </div>
  );
}