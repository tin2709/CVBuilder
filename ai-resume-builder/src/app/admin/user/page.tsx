"use client";

import { 
  LayoutDashboard, Briefcase, Users, FileText, Settings, LogOut, 
  Plus, Search, Filter, MoreHorizontal, Lock, Unlock, ChevronLeft, ChevronRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

export default function UserManagementPage() {
  return (
    <div className="flex min-h-screen bg-[#F8F9FC] font-sans text-slate-900">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r hidden lg:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b">
          <div className="flex items-center gap-2 font-bold text-xl text-blue-600">
            <div className="bg-blue-600 text-white p-1 rounded">AH</div> AdminHub
          </div>
        </div>
        <nav className="p-4 space-y-1 flex-1">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" />
          <SidebarItem icon={Briefcase} label="Tin tuyển dụng" />
          <SidebarItem icon={Users} label="Người dùng & Công ty" active />
          <SidebarItem icon={FileText} label="Báo cáo AI" />
          <SidebarItem icon={Settings} label="Cài đặt" />
        </nav>
        <div className="p-4 border-t">
          <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50">
            <LogOut className="w-4 h-4 mr-2" /> Đăng xuất
          </Button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="text-xs text-slate-500 mb-1">Trang chủ / Quản lý người dùng</div>
            <h1 className="text-2xl font-bold text-slate-800">Quản lý Người dùng và Công ty</h1>
            <p className="text-sm text-slate-500 mt-1">Quản lý hồ sơ ứng viên, nhà tuyển dụng và công ty. Theo dõi điểm số AI.</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700"><Plus className="w-4 h-4 mr-2"/> Thêm mới</Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatsCard label="Tổng người dùng" value="12,450" trend="+12%" color="blue" icon={Users} />
          <StatsCard label="Ứng viên" value="8,200" trend="+5%" color="green" icon={Users} />
          <StatsCard label="Nhà tuyển dụng" value="4,250" trend="+7%" color="purple" icon={Briefcase} />
          <StatsCard label="Tài khoản bị khóa" value="15" trend="-2%" color="red" icon={Lock} />
        </div>

        {/* Filters & Table Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          
          {/* Tabs */}
          <div className="flex border-b">
            <button className="px-6 py-3 text-sm font-semibold text-blue-600 border-b-2 border-blue-600">Người dùng cá nhân</button>
            <button className="px-6 py-3 text-sm font-medium text-slate-500 hover:text-slate-700">Doanh nghiệp</button>
          </div>

          {/* Toolbar */}
          <div className="p-4 flex flex-wrap gap-3 items-center justify-between">
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
              <Input placeholder="Tìm kiếm theo tên, email hoặc ID..." className="pl-9 bg-slate-50"/>
            </div>
            <div className="flex gap-3">
               <Select>
                  <SelectTrigger className="w-[150px]"><SelectValue placeholder="Tất cả vai trò" /></SelectTrigger>
                  <SelectContent><SelectItem value="all">Tất cả</SelectItem></SelectContent>
               </Select>
               <Select>
                  <SelectTrigger className="w-[150px]"><SelectValue placeholder="Tất cả trạng thái" /></SelectTrigger>
                  <SelectContent><SelectItem value="all">Tất cả</SelectItem></SelectContent>
               </Select>
               <Button variant="outline"><Filter className="w-4 h-4 mr-2"/> Bộ lọc</Button>
            </div>
          </div>

          {/* Table */}
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium border-y">
              <tr>
                <th className="p-4 w-10"><Checkbox /></th>
                <th className="p-4">THÔNG TIN NGƯỜI DÙNG</th>
                <th className="p-4">VAI TRÒ</th>
                <th className="p-4">AI SCORE</th>
                <th className="p-4">TRẠNG THÁI</th>
                <th className="p-4">NGÀY THAM GIA</th>
                <th className="p-4 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {[
                { name: "Nguyễn Văn A", email: "ng.vana@gmail.com", role: "Ứng viên", roleColor: "bg-blue-100 text-blue-700", score: "92/100", status: "Hoạt động", date: "12/10/2023", avatar: "A" },
                { name: "Trần Thị B", email: "hr@techsolutions.vn", role: "Nhà tuyển dụng", roleColor: "bg-purple-100 text-purple-700", score: "85/100", status: "Hoạt động", date: "05/10/2023", avatar: "B" },
                { name: "Lê Văn C", email: "levanc@outlook.com", role: "Ứng viên", roleColor: "bg-blue-100 text-blue-700", score: "15/100", status: "Đã khóa", date: "20/09/2023", avatar: "C" },
                { name: "Phạm Thị D", email: "recruiter@corp.com", role: "Nhà tuyển dụng", roleColor: "bg-purple-100 text-purple-700", score: "98/100", status: "Chờ duyệt", date: "12/03/2023", avatar: "D" },
              ].map((user, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="p-4"><Checkbox /></td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 bg-slate-200 text-slate-600 font-bold"><AvatarFallback>{user.avatar}</AvatarFallback></Avatar>
                      <div>
                        <div className="font-semibold text-slate-900">{user.name}</div>
                        <div className="text-xs text-slate-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4"><Badge variant="secondary" className={`${user.roleColor} border-none`}>{user.role}</Badge></td>
                  <td className="p-4 font-bold text-green-600 flex items-center gap-1">
                     <div className="w-2 h-2 rounded-full bg-green-500"></div> {user.score}
                  </td>
                  <td className="p-4">
                     <span className={`flex items-center gap-2 text-xs font-medium ${user.status === 'Đã khóa' ? 'text-red-500' : user.status === 'Chờ duyệt' ? 'text-orange-500' : 'text-green-600'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Đã khóa' ? 'bg-red-500' : user.status === 'Chờ duyệt' ? 'bg-orange-500' : 'bg-green-600'}`}></div>
                        {user.status}
                     </span>
                  </td>
                  <td className="p-4 text-slate-500">{user.date}</td>
                  <td className="p-4 text-right"><Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4"/></Button></td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="p-4 border-t flex items-center justify-between text-sm text-slate-500">
             <span>Hiển thị 1 đến 10 trong số 12,450 kết quả</span>
             <div className="flex gap-1">
                <Button variant="outline" size="sm" disabled>Trước</Button>
                <Button variant="default" size="sm" className="bg-blue-600">1</Button>
                <Button variant="outline" size="sm">2</Button>
                <Button variant="outline" size="sm">3</Button>
                <span className="px-2 py-1">...</span>
                <Button variant="outline" size="sm">12</Button>
                <Button variant="outline" size="sm">Tiếp</Button>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Sub-components used in the first page
function SidebarItem({ icon: Icon, label, active }: any) {
  return (
    <div className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer ${active ? 'bg-blue-50 text-blue-600 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}>
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </div>
  );
}

function StatsCard({ label, value, trend, color, icon: Icon }: any) {
   return (
      <Card className="shadow-sm border-none">
         <CardContent className="p-5">
            <div className="flex justify-between items-start">
               <div>
                  <p className="text-slate-500 text-xs font-medium uppercase">{label}</p>
                  <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
                  <p className={`text-xs mt-1 font-medium ${trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>{trend} tháng này</p>
               </div>
               <div className={`p-2 rounded-lg bg-${color}-50 text-${color}-600`}>
                  <Icon className="w-5 h-5" />
               </div>
            </div>
         </CardContent>
      </Card>
   )
}