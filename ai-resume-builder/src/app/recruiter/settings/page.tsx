"use client";

import { 
  Building2, Bell, CreditCard, Settings, Users, 
  Bot, CheckCircle2, ChevronRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function RecruiterSettingsPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans text-slate-900">
      
       {/* HEADER (Simplified) */}
       <header className="bg-white border-b h-16 flex items-center justify-between px-6 sticky top-0 z-50">
         <div className="flex items-center gap-2 font-bold text-lg text-blue-600">
             <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs">RA</div> RecruitAI
         </div>
         <div className="flex gap-4">
            <Button variant="ghost" size="icon"><Bell className="w-5 h-5 text-slate-500"/></Button>
            <div className="w-8 h-8 rounded-full bg-slate-200"></div>
         </div>
       </header>

       <main className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-12 gap-8">
          
          {/* SIDEBAR */}
          <aside className="col-span-12 md:col-span-3 space-y-6">
             <div className="flex items-center gap-3 mb-4">
                 <div className="w-10 h-10 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold">TS</div>
                 <div>
                     <h3 className="font-bold text-sm text-slate-900">Tech Solutions</h3>
                     <p className="text-[10px] text-slate-500 uppercase tracking-wide">Gói Professional</p>
                 </div>
             </div>
             
             <nav className="space-y-1">
                 <SidebarItem icon={Building2} label="Thông tin công ty" active />
                 <SidebarItem icon={Bell} label="Cài đặt thông báo" />
                 <SidebarItem icon={CreditCard} label="Gói & Thanh toán" />
                 <SidebarItem icon={Settings} label="Cấu hình Tuyển dụng" />
                 <SidebarItem icon={Users} label="Quản lý Team" />
             </nav>
          </aside>

          {/* MAIN CONTENT */}
          <div className="col-span-12 md:col-span-9 space-y-8">
              
              <div>
                  <div className="text-xs text-slate-500 mb-1">Trang chủ / Cài đặt / Nhà tuyển dụng</div>
                  <h1 className="text-2xl font-bold text-slate-900">Cài đặt Nhà tuyển dụng</h1>
                  <p className="text-slate-500 text-sm">Quản lý thông tin công ty, thương hiệu và cấu hình hệ thống AI.</p>
              </div>

              {/* Company Info Card */}
              <Card className="border-slate-200 shadow-sm">
                  <CardContent className="p-6">
                      
                      {/* Top Box */}
                      <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6">
                          <div className="flex items-center gap-4">
                              <div className="w-16 h-16 bg-slate-900 rounded-lg flex items-center justify-center border-2 border-white shadow">
                                  {/* Mock Logo */}
                                  <div className="text-teal-400 font-bold text-xs text-center leading-tight">TECH<br/>SOL</div>
                              </div>
                              <div>
                                  <div className="flex items-center gap-2">
                                      <h3 className="font-bold text-lg text-slate-900">Tech Solutions Inc.</h3>
                                      <CheckCircle2 className="w-4 h-4 text-blue-500 fill-blue-100" />
                                  </div>
                                  <p className="text-xs text-slate-500">Mã doanh nghiệp: #TS-2024-8892</p>
                                  <div className="flex gap-2 mt-2">
                                      <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">Đang hoạt động</Badge>
                                      <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100">Gói Professional</Badge>
                                  </div>
                              </div>
                          </div>
                          <div className="flex gap-2">
                              <Button variant="outline" size="sm">Xem hồ sơ công khai</Button>
                              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">Lưu thay đổi</Button>
                          </div>
                      </div>

                      {/* General Info Form */}
                      <div className="space-y-6">
                          <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2"><Building2 className="w-4 h-4 text-blue-500"/> Thông tin chung</h4>
                          
                          <div className="space-y-2">
                              <Label>Tên công ty hiển thị</Label>
                              <Input defaultValue="Tech Solutions Inc." className="bg-slate-50"/>
                          </div>

                          <div className="grid md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                  <Label>Website</Label>
                                  <Input defaultValue="https://techsolutions.com" className="bg-slate-50"/>
                              </div>
                              <div className="space-y-2">
                                  <Label>Lĩnh vực hoạt động</Label>
                                  <Select defaultValue="it">
                                    <SelectTrigger className="bg-slate-50"><SelectValue placeholder="Chọn lĩnh vực" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="it">Công nghệ thông tin</SelectItem>
                                        <SelectItem value="fin">Tài chính</SelectItem>
                                    </SelectContent>
                                  </Select>
                              </div>
                          </div>

                          <div className="space-y-2">
                              <Label>Giới thiệu ngắn (Bio)</Label>
                              <Textarea className="min-h-[100px] bg-slate-50" defaultValue="Công ty hàng đầu về giải pháp phần mềm doanh nghiệp với hơn 10 năm kinh nghiệm. Môi trường làm việc năng động, sáng tạo và luôn đổi mới." />
                              <p className="text-xs text-slate-400">Mô tả này sẽ xuất hiện trên trang tuyển dụng của công ty.</p>
                          </div>
                      </div>

                      <div className="my-8 border-t border-slate-100"></div>

                      {/* AI Config */}
                      <div className="space-y-6">
                          <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2"><Bot className="w-4 h-4 text-blue-500"/> Cấu hình Tuyển dụng & AI</h4>
                          
                          <div className="space-y-4">
                              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                  <div>
                                      <div className="font-medium text-sm">Sàng lọc hồ sơ tự động bằng AI</div>
                                      <div className="text-xs text-slate-500">Hệ thống sẽ tự động chấm điểm và xếp hạng ứng viên dựa trên JD.</div>
                                  </div>
                                  <Switch defaultChecked className="data-[state=checked]:bg-blue-600"/>
                              </div>

                              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                  <div>
                                      <div className="font-medium text-sm">Gửi email từ chối tự động</div>
                                      <div className="text-xs text-slate-500">Tự động gửi email cảm ơn khi bạn chuyển trạng thái ứng viên sang "Từ chối".</div>
                                  </div>
                                  <Switch />
                              </div>

                              {/* Email Template Editor */}
                              <div className="space-y-2 pt-2">
                                  <div className="flex justify-between items-center">
                                      <Label>Mẫu Email Xác nhận Ứng tuyển</Label>
                                      <span className="text-xs text-blue-600 cursor-pointer hover:underline">↺ Khôi phục mặc định</span>
                                  </div>
                                  <div className="border rounded-md bg-white">
                                      <div className="flex gap-2 p-2 border-b bg-slate-50">
                                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 font-bold">B</Button>
                                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 italic">I</Button>
                                          <div className="w-px h-4 bg-slate-300 mx-1 self-center"></div>
                                          <span className="text-xs bg-slate-200 px-2 py-0.5 rounded text-slate-600 cursor-pointer">Variable: {'{Ten_Ung_Vien}'}</span>
                                      </div>
                                      <Textarea className="border-none shadow-none min-h-[120px] focus-visible:ring-0" 
                                        defaultValue={`Chào {{Ten_Ung_Vien}},\n\nCảm ơn bạn đã quan tâm và ứng tuyển vào vị trí {{Ten_Vi_Tri}} tại Tech Solutions. Chúng tôi đã nhận được hồ sơ của bạn và sẽ tiến hành xem xét trong vòng 3-5 ngày làm việc.\n\nTrân trọng,\nĐội ngũ Tuyển dụng Tech Solutions.`} 
                                      />
                                  </div>
                              </div>
                          </div>
                      </div>
                  </CardContent>
              </Card>

              {/* Service Package Card */}
              <div className="bg-blue-600 rounded-xl p-6 text-white shadow-lg shadow-blue-200">
                  <div className="flex items-start gap-3 mb-4">
                      <div className="p-2 bg-white/20 rounded-lg"><CreditCard className="w-5 h-5 text-white"/></div>
                      <h4 className="font-bold text-lg">Gói dịch vụ</h4>
                  </div>
                  
                  <div className="flex items-center justify-between">
                      <div>
                          <div className="flex items-center gap-2 mb-1">
                              <span className="text-xl font-bold">Gói Professional</span>
                              <Badge className="bg-white/20 hover:bg-white/30 text-white border-none text-[10px]">Năm</Badge>
                          </div>
                          <p className="text-blue-100 text-sm max-w-lg">
                              Bạn đang sử dụng gói chuyên nghiệp với quyền truy cập không giới hạn vào AI Matching và 50 bài đăng tuyển dụng mỗi tháng.
                          </p>
                          <p className="text-xs text-blue-200 mt-2">Hết hạn vào: 12/12/2026</p>
                      </div>
                      <div className="flex gap-3">
                          <Button variant="secondary" className="bg-blue-700 text-white hover:bg-blue-800 border-none shadow-none">Lịch sử thanh toán</Button>
                          <Button className="bg-white text-blue-600 hover:bg-blue-50 font-bold">Nâng cấp Enterprise</Button>
                      </div>
                  </div>
              </div>

          </div>
       </main>
    </div>
  );
}

// Sub-component for Sidebar (Same as Page 2)
function SidebarItem({ icon: Icon, label, active }: any) {
    return (
        <div className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors ${active ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}>
            <Icon className={`w-5 h-5 ${active ? 'text-blue-600' : 'text-slate-400'}`} />
            <span className="text-sm">{label}</span>
        </div>
    )
}