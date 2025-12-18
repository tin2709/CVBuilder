"use client";

import { 
  Bell, Search, User, Lock, Shield, CreditCard, 
  MapPin, Phone, Mail, Camera, Save 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

export default function CandidateSettingsPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans text-slate-900">
      
      {/* HEADER */}
      <header className="bg-white border-b sticky top-0 z-50 h-16 flex items-center justify-between px-6">
         <div className="flex items-center gap-2 font-bold text-lg text-blue-600">
             <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs">RA</div> RecruitAI
         </div>
         <div className="flex-1 max-w-md mx-8 relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input className="pl-9 bg-slate-100 border-none h-9" placeholder="Tìm kiếm việc làm" />
         </div>
         <div className="flex items-center gap-4 text-sm font-medium text-slate-600">
             <a href="#" className="hover:text-blue-600">Việc làm</a>
             <a href="#" className="hover:text-blue-600">Công ty</a>
             <a href="#" className="hover:text-blue-600">Hồ sơ của tôi</a>
             <Avatar className="w-8 h-8"><AvatarImage src="https://github.com/shadcn.png"/><AvatarFallback>NA</AvatarFallback></Avatar>
         </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-12 gap-8">
          
          {/* SIDEBAR */}
          <aside className="col-span-12 md:col-span-3 space-y-6">
             <div className="flex items-center gap-3 mb-6">
                 <Avatar className="w-12 h-12"><AvatarImage src="https://github.com/shadcn.png"/><AvatarFallback>NA</AvatarFallback></Avatar>
                 <div>
                     <h3 className="font-bold text-slate-900">Nguyễn Văn A</h3>
                     <p className="text-xs text-slate-500">Ứng viên</p>
                 </div>
             </div>
             
             <nav className="space-y-1">
                 <SidebarItem icon={User} label="Thông tin cá nhân" active />
                 <SidebarItem icon={Bell} label="Thông báo" />
                 <SidebarItem icon={Lock} label="Quyền riêng tư" />
                 <SidebarItem icon={Shield} label="Tài khoản" />
             </nav>
             
             {/* Promo Box */}
             <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mt-6">
                 <div className="text-xs font-bold text-blue-700 uppercase mb-1">✨ Tiêu chuẩn hoá</div>
                 <p className="text-xs text-blue-600/80 mb-3">AI có thể giúp bạn cải thiện hồ sơ để tăng 50% cơ hội trúng tuyển.</p>
             </div>
          </aside>

          {/* MAIN CONTENT */}
          <div className="col-span-12 md:col-span-9 space-y-6">
              
              <div>
                  <div className="text-xs text-slate-500 mb-1">Trang chủ / Cài đặt</div>
                  <h1 className="text-2xl font-bold text-slate-900">Thông tin cá nhân</h1>
                  <p className="text-slate-500 text-sm">Quản lý thông tin hiển thị trên hồ sơ ứng tuyển của bạn.</p>
              </div>

              {/* Profile Card */}
              <Card className="border-slate-200 shadow-sm">
                  <CardContent className="p-6 space-y-6">
                      
                      {/* Avatar Section */}
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                          <div className="flex items-center gap-4">
                              <Avatar className="w-16 h-16 border-4 border-white shadow-sm">
                                  <AvatarImage src="https://github.com/shadcn.png" />
                                  <AvatarFallback>NA</AvatarFallback>
                              </Avatar>
                              <div>
                                  <h4 className="font-bold text-slate-900">Ảnh đại diện</h4>
                                  <p className="text-xs text-slate-500">Cho phép định dạng PNG, JPG. Dung lượng tối đa 5MB.</p>
                              </div>
                          </div>
                          <div className="flex gap-2">
                              <Button variant="outline" size="sm" className="h-8">Xóa</Button>
                              <Button size="sm" className="h-8 bg-blue-600 hover:bg-blue-700">Tải ảnh mới</Button>
                          </div>
                      </div>

                      {/* Form Fields */}
                      <div className="grid gap-6">
                          <div className="space-y-2">
                              <Label>Họ và tên</Label>
                              <div className="relative">
                                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
                                  <Input defaultValue="Nguyễn Văn A" className="pl-9 bg-slate-50"/>
                              </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                  <Label>Chức danh hiện tại</Label>
                                  <div className="relative">
                                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
                                      <Input defaultValue="Senior Product Designer" className="pl-9 bg-slate-50"/>
                                  </div>
                              </div>
                              <div className="space-y-2">
                                  <Label>Địa điểm</Label>
                                  <div className="relative">
                                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
                                      <Input defaultValue="Hồ Chí Minh, Việt Nam" className="pl-9 bg-slate-50"/>
                                  </div>
                              </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                  <Label>Email</Label>
                                  <div className="relative">
                                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
                                      <Input defaultValue="nguyenvana@example.com" className="pl-9 bg-slate-50"/>
                                  </div>
                              </div>
                              <div className="space-y-2">
                                  <Label>Số điện thoại</Label>
                                  <div className="relative">
                                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
                                      <Input defaultValue="0912 345 678" className="pl-9 bg-slate-50"/>
                                  </div>
                              </div>
                          </div>

                          <div className="space-y-2">
                              <Label>Giới thiệu bản thân</Label>
                              <Textarea placeholder="Viết ngắn gọn về kinh nghiệm..." className="min-h-[100px] bg-slate-50" />
                              <div className="text-right text-xs text-slate-400">0/500</div>
                          </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-2">
                          <Button variant="outline">Hủy bỏ</Button>
                          <Button className="bg-blue-600 hover:bg-blue-700">Lưu thay đổi</Button>
                      </div>
                  </CardContent>
              </Card>
            
              {/* Notification Settings */}
              <Card className="border-slate-200 shadow-sm">
                 <CardContent className="p-6">
                    <h3 className="font-bold text-slate-900 mb-4">Cài đặt thông báo</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="font-medium text-sm text-slate-800">Cơ hội việc làm mới</div>
                                <div className="text-xs text-slate-500">Nhận email khi có việc làm phù hợp với hồ sơ.</div>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="font-medium text-sm text-slate-800">Trạng thái ứng tuyển</div>
                                <div className="text-xs text-slate-500">Thông báo ngay khi nhà tuyển dụng xem hồ sơ.</div>
                            </div>
                            <Switch defaultChecked />
                        </div>
                    </div>
                 </CardContent>
              </Card>

              {/* Bottom Split */}
              <div className="grid md:grid-cols-2 gap-6">
                   <Card className="border-slate-200 shadow-sm">
                        <CardContent className="p-6">
                            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><EyeIcon className="w-4 h-4 text-blue-500"/> Hiển thị hồ sơ</h3>
                            <div className="space-y-3">
                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input type="radio" name="vis" defaultChecked className="mt-1" />
                                    <div>
                                        <div className="text-sm font-medium text-slate-800">Công khai</div>
                                        <div className="text-xs text-slate-500">Mọi nhà tuyển dụng đều có thể tìm thấy bạn.</div>
                                    </div>
                                </label>
                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input type="radio" name="vis" className="mt-1" />
                                    <div>
                                        <div className="text-sm font-medium text-slate-800">Riêng tư</div>
                                        <div className="text-xs text-slate-500">Chỉ những công việc bạn ứng tuyển mới thấy hồ sơ.</div>
                                    </div>
                                </label>
                            </div>
                        </CardContent>
                   </Card>

                   <Card className="border-slate-200 shadow-sm">
                        <CardContent className="p-6">
                            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Shield className="w-4 h-4 text-blue-500"/> Bảo mật</h3>
                            <div className="space-y-2">
                                <Button variant="outline" className="w-full justify-between">Đổi mật khẩu <span className="text-slate-400">›</span></Button>
                                <Button variant="outline" className="w-full justify-between text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100">Xóa tài khoản <span className="text-slate-400">🗑</span></Button>
                            </div>
                        </CardContent>
                   </Card>
              </div>

          </div>
      </main>
    </div>
  );
}

// Sub-component for Sidebar
function SidebarItem({ icon: Icon, label, active }: any) {
    return (
        <div className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors ${active ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}>
            <Icon className={`w-5 h-5 ${active ? 'text-blue-600' : 'text-slate-400'}`} />
            <span className="text-sm">{label}</span>
        </div>
    )
}
function EyeIcon({className}: {className?: string}) { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg> }