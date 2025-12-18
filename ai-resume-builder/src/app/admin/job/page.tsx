"use client";

import { 
  LayoutGrid, Briefcase, Users, Calendar, Settings, 
  Search, Download, SlidersHorizontal, Plus, MoreHorizontal 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function JobCategoryPage() {
  return (
    <div className="flex min-h-screen bg-[#F3F4F6] font-sans text-slate-900">
      
      {/* SIDEBAR - Styled for SmartRecruit */}
      <aside className="w-64 bg-white border-r hidden lg:block">
        <div className="h-16 flex items-center px-6 gap-2 font-bold text-xl text-indigo-700">
           <div className="bg-indigo-600 p-1 rounded text-white"><LayoutGrid className="w-5 h-5"/></div> SmartRecruit
        </div>
        <nav className="p-4 space-y-1">
          <SidebarItem icon={LayoutGrid} label="Tổng quan" />
          <SidebarItem icon={Briefcase} label="Việc làm" />
          <SidebarItem icon={Users} label="Ứng viên" />
          <SidebarItem icon={Calendar} label="Lịch phỏng vấn" />
          <SidebarItem icon={Briefcase} label="Danh mục" active />
          <SidebarItem icon={Settings} label="Cài đặt" />
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <div className="text-xs text-slate-500 mb-1">Trang chủ {'>'} Cấu hình {'>'} Danh mục công việc</div>
            <h1 className="text-3xl font-bold text-slate-900">Quản lý Danh mục Công việc</h1>
            <p className="text-slate-500 mt-2 max-w-2xl">
              Quản lý và đồng bộ hóa các nhóm ngành nghề cho hệ thống AI matching. Định nghĩa từ khóa để tối ưu hóa việc kết nối ứng viên.
            </p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 h-10 px-6"><Plus className="w-4 h-4 mr-2"/> Thêm Danh mục</Button>
        </div>

        {/* Toolbar */}
        <div className="bg-white p-4 rounded-t-xl border-b flex justify-between items-center shadow-sm">
           <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
              <Input placeholder="Tìm kiếm theo tên danh mục, mã hoặc từ khóa AI..." className="pl-9 bg-slate-50 border-none"/>
           </div>
           <div className="flex gap-3">
              <Select>
                 <SelectTrigger className="w-[160px]"><SelectValue placeholder="Tất cả trạng thái" /></SelectTrigger>
                 <SelectContent><SelectItem value="active">Hoạt động</SelectItem></SelectContent>
              </Select>
              <Button variant="outline" className="text-slate-600"><Download className="w-4 h-4 mr-2"/> Export</Button>
              <Button variant="ghost" className="text-blue-600 font-medium"><SlidersHorizontal className="w-4 h-4 mr-2"/> Lọc nâng cao</Button>
           </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-b-xl shadow-sm border border-t-0 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-bold text-xs uppercase tracking-wider">
              <tr>
                <th className="p-4 w-10"><Checkbox /></th>
                <th className="p-4">Tên danh mục / Mã</th>
                <th className="p-4">AI Keywords</th>
                <th className="p-4">Số lượng Job</th>
                <th className="p-4">Cập nhật cuối</th>
                <th className="p-4">Trạng thái</th>
                <th className="p-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <CategoryRow 
                name="IT - Phần mềm" code="CAT-IT-001" 
                keywords={['Developer', 'Engineer', 'Coding']} 
                jobs="142" trend="+12%" updated="2 giờ trước" status="Hoạt động" 
              />
              <CategoryRow 
                name="Marketing & PR" code="CAT-PR-002" 
                keywords={['SEO', 'Content', 'Branding']} 
                jobs="56" trend="" updated="1 ngày trước" status="Hoạt động" 
              />
              <CategoryRow 
                name="Kế toán / Kiểm toán" code="CAT-AC-003" 
                keywords={['Finance', 'Tax']} 
                jobs="12" trend="-2%" updated="5 ngày trước" status="Tạm ẩn" 
              />
              <CategoryRow 
                name="Hành chính - Nhân sự" code="CAT-HR-004" 
                keywords={['Recruitment', 'C&B']} 
                jobs="28" trend="" updated="1 tuần trước" status="Hoạt động" 
              />
            </tbody>
          </table>
          
          {/* Footer Pagination */}
          <div className="p-4 border-t flex items-center justify-between text-xs text-slate-500">
             <span>Hiển thị 1 đến 4 trong tổng số 42 kết quả</span>
             <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" disabled>Trước</Button>
                <Button variant="default" size="sm" className="h-8 w-8 p-0 bg-blue-600">1</Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">2</Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">3</Button>
                <span className="flex items-center">...</span>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">8</Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">Sau</Button>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Helpers for Page 2
function SidebarItem({ icon: Icon, label, active }: any) {
   return (
      <div className={`flex items-center gap-3 px-3 py-2.5 rounded-md mb-1 cursor-pointer transition-colors ${active ? 'bg-indigo-50 text-indigo-700 font-bold border-r-4 border-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}>
         <Icon className={`w-5 h-5 ${active ? 'text-indigo-700' : 'text-slate-400'}`} />
         <span>{label}</span>
      </div>
   )
}

function CategoryRow({ name, code, keywords, jobs, trend, updated, status }: any) {
   return (
      <tr className="hover:bg-slate-50">
         <td className="p-4"><Checkbox /></td>
         <td className="p-4">
            <div className="font-bold text-slate-900">{name}</div>
            <div className="text-xs text-slate-400 font-mono mt-1">{code}</div>
         </td>
         <td className="p-4">
            <div className="flex flex-wrap gap-1.5">
               {keywords.map((k:string) => (
                  <Badge key={k} variant="secondary" className="bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-100 font-normal">{k}</Badge>
               ))}
               <span className="text-xs text-slate-400 flex items-center ml-1">+5</span>
            </div>
         </td>
         <td className="p-4">
            <div className="flex items-center gap-2">
               <span className="font-bold">{jobs}</span>
               {trend && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${trend.includes('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{trend}</span>
               )}
            </div>
         </td>
         <td className="p-4 text-slate-500 text-xs flex items-center gap-1">
             <Calendar className="w-3 h-3"/> {updated}
         </td>
         <td className="p-4">
            <Badge className={`${status === 'Hoạt động' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'} shadow-none border-none`}>
               • {status}
            </Badge>
         </td>
         <td className="p-4 text-right">
            <Button variant="ghost" size="icon" className="text-slate-400"><MoreHorizontal className="w-4 h-4"/></Button>
         </td>
      </tr>
   )
}