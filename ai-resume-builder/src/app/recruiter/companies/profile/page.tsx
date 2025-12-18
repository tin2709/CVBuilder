"use client";

import { 
  Bell, Search, LayoutGrid, Briefcase, Building2, 
  Users, Calendar, Settings, HelpCircle, Eye, 
  MapPin, Globe, Camera, MessageSquare, Phone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export default function CompanyProfilePage() {
  return (
    <div className="min-h-screen bg-[#F0F2F5] font-sans text-slate-900 flex">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-white h-screen sticky top-0 border-r border-slate-200 flex flex-col justify-between z-20 hidden lg:flex">
         <div>
            <div className="h-16 flex items-center gap-2 px-6 border-b border-slate-100">
               <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold"><Building2 className="w-5 h-5"/></div>
               <div>
                  <h1 className="font-bold text-sm text-slate-900">TechRecruit AI</h1>
                  <p className="text-[10px] text-slate-500">Nhà tuyển dụng</p>
               </div>
            </div>
            
            <nav className="p-4 space-y-1">
               <SidebarItem icon={LayoutGrid} label="Tổng quan" />
               <SidebarItem icon={Briefcase} label="Tin tuyển dụng" />
               <SidebarItem icon={Building2} label="Hồ sơ công ty" active />
               <SidebarItem icon={Users} label="Ứng viên" />
               <SidebarItem icon={Calendar} label="Lịch phỏng vấn" />
               
               <div className="pt-4 pb-2">
                  <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hệ thống</p>
               </div>
               <SidebarItem icon={Settings} label="Cài đặt" />
               <SidebarItem icon={HelpCircle} label="Trợ giúp" />
            </nav>
         </div>

         <div className="p-4 border-t border-slate-100">
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
               <Avatar className="w-9 h-9">
                  <AvatarImage src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80" />
                  <AvatarFallback>NA</AvatarFallback>
               </Avatar>
               <div>
                  <p className="text-sm font-bold text-slate-700">Nguyễn Văn A</p>
                  <p className="text-xs text-slate-500">HR Manager</p>
               </div>
            </div>
         </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 min-w-0">
         
         {/* Top Header */}
         <header className="h-16 bg-white border-b px-6 flex items-center justify-between sticky top-0 z-10">
            <h2 className="font-bold text-lg text-slate-800">Quản lý tuyển dụng</h2>
            <div className="flex items-center gap-4">
               <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
                  <Input placeholder="Tìm kiếm..." className="pl-9 h-9 bg-slate-50 border-none"/>
               </div>
               <div className="flex gap-3 text-slate-400">
                  <Bell className="w-5 h-5 cursor-pointer hover:text-slate-600"/>
                  <MessageSquare className="w-5 h-5 cursor-pointer hover:text-slate-600"/>
               </div>
            </div>
         </header>

         {/* Content Body */}
         <div className="p-6 md:p-8 max-w-5xl mx-auto">
            
            {/* Breadcrumb & Title */}
            <div className="mb-6">
               <div className="flex text-xs text-slate-500 mb-2 gap-2">
                  <span className="hover:text-blue-600 cursor-pointer">Trang chủ</span> 
                  <span>/</span> 
                  <span className="font-medium text-slate-800">Hồ sơ công ty</span>
               </div>
               <div className="flex justify-between items-end">
                  <div>
                     <h1 className="text-3xl font-bold text-slate-900 mb-2">Hồ sơ Công ty</h1>
                     <p className="text-slate-500">Quản lý thông tin hiển thị với ứng viên và xây dựng thương hiệu tuyển dụng.</p>
                  </div>
                  <div className="flex gap-3">
                     <Button variant="outline" className="bg-white text-slate-600 border-slate-300">
                        <Eye className="w-4 h-4 mr-2"/> Xem trang công khai
                     </Button>
                     <Button className="bg-blue-600 hover:bg-blue-700 font-semibold">Lưu thay đổi</Button>
                  </div>
               </div>
            </div>

            {/* Form Section */}
            <Card className="border-none shadow-sm overflow-hidden">
               {/* Cover Image Area */}
               <div className="h-48 bg-gradient-to-r from-blue-300 to-cyan-200 relative group cursor-pointer">
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <Button variant="secondary" size="sm" className="gap-2"><Camera className="w-4 h-4"/> Thay đổi ảnh bìa</Button>
                  </div>
               </div>
               
               <div className="px-8 pb-8">
                  {/* Logo Area (Overlapping) */}
                  <div className="relative -mt-16 mb-8 inline-block group">
                     <div className="w-32 h-32 bg-teal-800 rounded-xl border-4 border-white shadow-md flex items-center justify-center overflow-hidden">
                         {/* Fake Logo */}
                        <div className="text-white text-center">
                           <div className="w-10 h-10 border-2 border-white/50 rounded-full mx-auto mb-1 flex items-center justify-center"><Briefcase className="w-5 h-5"/></div>
                        </div>
                     </div>
                     <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <Camera className="w-6 h-6 text-white"/>
                     </div>
                     <p className="mt-2 text-xs text-slate-400 font-medium ml-1">ẢNH ĐẠI DIỆN</p>
                     <p className="text-[10px] text-slate-400 ml-1">PNG, JPG tối thiểu 200x200px</p>
                  </div>

                  {/* Form Inputs */}
                  <div className="space-y-6">
                     <div className="flex items-center gap-2 text-blue-600 font-bold border-b pb-2 mb-4">
                        <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-xs">i</div>
                        Thông tin chung
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <Label htmlFor="companyName">Tên công ty <span className="text-red-500">*</span></Label>
                           <Input id="companyName" defaultValue="TechRecruit Inc." className="bg-slate-50"/>
                        </div>
                        <div className="space-y-2">
                           <Label htmlFor="website">Website</Label>
                           <div className="relative">
                              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
                              <Input id="website" defaultValue="https://techrecruit.ai" className="pl-9 bg-slate-50"/>
                           </div>
                        </div>
                        <div className="space-y-2">
                           <Label>Lĩnh vực hoạt động</Label>
                           <Select defaultValue="it">
                              <SelectTrigger className="bg-slate-50">
                                 <SelectValue placeholder="Chọn lĩnh vực" />
                              </SelectTrigger>
                              <SelectContent>
                                 <SelectItem value="it">Công nghệ thông tin</SelectItem>
                                 <SelectItem value="marketing">Marketing & Truyền thông</SelectItem>
                                 <SelectItem value="finance">Tài chính ngân hàng</SelectItem>
                              </SelectContent>
                           </Select>
                        </div>
                        <div className="space-y-2">
                           <Label>Quy mô nhân sự</Label>
                           <Select defaultValue="50-100">
                              <SelectTrigger className="bg-slate-50">
                                 <SelectValue placeholder="Chọn quy mô" />
                              </SelectTrigger>
                              <SelectContent>
                                 <SelectItem value="10-50">10 - 50 nhân viên</SelectItem>
                                 <SelectItem value="50-100">50 - 100 nhân viên</SelectItem>
                                 <SelectItem value="100+">Trên 100 nhân viên</SelectItem>
                              </SelectContent>
                           </Select>
                        </div>
                     </div>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <Label htmlFor="phone">Số điện thoại liên hệ</Label>
                           <div className="relative">
                              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
                              <Input id="phone" defaultValue="0912 345 678" className="pl-9 bg-slate-50"/>
                           </div>
                        </div>
                     </div>
                     
                     <div className="pt-4">
                        <div className="flex items-center gap-2 text-blue-600 font-bold border-b pb-2 mb-4">
                           <MapPin className="w-5 h-5"/>
                           Địa chỉ trụ sở
                        </div>
                        {/* Placeholder for address inputs if needed */}
                     </div>
                  </div>
               </div>
            </Card>
         </div>

      </main>
    </div>
  );
}

// Helper component for Sidebar items
function SidebarItem({ icon: Icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
   return (
      <div className={`
         flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-colors
         ${active 
            ? "bg-blue-50 text-blue-600" 
            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}
      `}>
         <Icon className={`w-5 h-5 ${active ? "text-blue-600" : "text-slate-400"}`} />
         {label}
      </div>
   )
}