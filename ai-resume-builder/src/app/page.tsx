"use client";

import Link from "next/link";
import { Search, Sparkles, Star, LayoutTemplate, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

// Mock data cho các mẫu CV
const TEMPLATES = [
  { id: 1, name: "Minimalist Blue", tags: ["ATS Friendly", "Simple"], image: "/templates/1.png", color: "bg-blue-500", category: "IT" },
  { id: 2, name: "Creative Bold", tags: ["AI Pick"], image: "/templates/2.png", color: "bg-orange-500", category: "Design" },
  { id: 3, name: "Corporate Clean", tags: ["ATS Friendly"], image: "/templates/3.png", color: "bg-slate-800", category: "Business" },
  { id: 4, name: "Modern Tech", tags: ["Modern"], image: "/templates/4.png", color: "bg-emerald-600", category: "Tech" },
  // ... thêm các mẫu khác
];

export default function TemplatesPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header đơn giản */}
      <header className="bg-white py-4 px-8 flex justify-between items-center border-b">
        <div className="font-bold text-xl text-blue-600 flex items-center gap-2">
           <LayoutTemplate className="w-6 h-6"/> SmartRecruit AI
        </div>
        <div className="flex gap-4 text-sm font-medium text-slate-600 items-center">
            <Link href="#">Việc làm</Link>
            <Link href="#">Tạo CV</Link>
            <Button size="sm" className="bg-blue-600">Đăng nhập</Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-16 px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">Chọn Mẫu CV Chuyên Nghiệp</h1>
        <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
          Tăng cơ hội trúng tuyển với các mẫu thiết kế chuẩn ATS và được tối ưu bởi AI.
        </p>
        <div className="flex justify-center gap-4">
            <Button className="bg-blue-500 hover:bg-blue-600 text-white gap-2">
                <Sparkles className="w-4 h-4" /> Hỏi AI gợi ý
            </Button>
            <Button variant="outline" className="text-blue-900 border-white hover:bg-white/90">
                Hướng dẫn viết CV
            </Button>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="max-w-7xl mx-auto px-6 -mt-8 relative z-10">
        <div className="bg-white p-4 rounded-xl shadow-lg border flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-1/3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4"/>
                <Input placeholder="Tìm kiếm theo ngành nghề (IT, Marketing...)" className="pl-10 bg-slate-50 border-none" />
            </div>
            
            <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                <Button size="sm" variant="default" className="bg-slate-900 text-white rounded-full px-4"><Star className="w-3 h-3 mr-1"/> Tất cả</Button>
                <Button size="sm" variant="ghost" className="rounded-full text-slate-600 hover:bg-slate-100">Hiện đại</Button>
                <Button size="sm" variant="ghost" className="rounded-full text-slate-600 hover:bg-slate-100">Chuyên nghiệp</Button>
                <Button size="sm" variant="ghost" className="rounded-full text-slate-600 hover:bg-slate-100">Học thuật</Button>
            </div>

            <div className="flex items-center gap-2 border-l pl-4">
                <span className="text-xs font-bold text-slate-500 uppercase">Màu sắc</span>
                <div className="flex gap-1">
                    <div className="w-5 h-5 rounded-full bg-blue-600 cursor-pointer ring-2 ring-offset-1 ring-blue-600"></div>
                    <div className="w-5 h-5 rounded-full bg-red-500 cursor-pointer"></div>
                    <div className="w-5 h-5 rounded-full bg-slate-800 cursor-pointer"></div>
                    <div className="w-5 h-5 rounded-full bg-green-500 cursor-pointer"></div>
                </div>
            </div>
        </div>
      </section>

      {/* Templates Grid */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {TEMPLATES.map((template) => (
                <Card key={template.id} className="group overflow-hidden border-slate-200 hover:shadow-xl transition-all duration-300 cursor-pointer">
                    <div className="relative bg-slate-100 aspect-[210/297] overflow-hidden">
                        {/* Giả lập hình ảnh thumbnail CV */}
                        <div className="absolute inset-0 flex flex-col p-4 scale-75 origin-top opacity-80 group-hover:opacity-100 transition-opacity">
                            <div className="w-full h-8 bg-slate-300 mb-2 rounded"></div>
                            <div className="flex gap-2">
                                <div className="w-1/3 h-64 bg-slate-200 rounded"></div>
                                <div className="w-2/3 h-64 bg-slate-50 rounded border border-slate-200"></div>
                            </div>
                        </div>
                        
                        {/* Overlay Button */}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                             <Link href={`/cv/builder?template=${template.id}`}>
                                <Button className="bg-blue-600 hover:bg-blue-700">Dùng mẫu này</Button>
                             </Link>
                        </div>

                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-1">
                            {template.tags.map(tag => (
                                <Badge key={tag} className={`${tag === 'AI Pick' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'} border-none shadow-sm`}>
                                    {tag === 'AI Pick' && <Sparkles className="w-3 h-3 mr-1"/>}
                                    {tag === 'ATS Friendly' && <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>}
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>
                    <CardFooter className="p-4 bg-white flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-slate-900">{template.name}</h3>
                            <p className="text-xs text-slate-500">Phù hợp: {template.category}, General</p>
                        </div>
                        <div className={`w-3 h-3 rounded-full ${template.color}`}></div>
                    </CardFooter>
                </Card>
            ))}
        </div>
      </section>
    </div>
  );
}