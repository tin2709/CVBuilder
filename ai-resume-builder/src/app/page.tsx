import Link from "next/link";
import { templates } from "@/lib/templates";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, PenTool, Sparkles } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-white border-b py-20 text-center space-y-4">
        <Badge variant="secondary" className="mb-2">v1.0.0 Alpha</Badge>
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-slate-900">
          Tạo CV chuyên nghiệp với <span className="text-blue-600">AI Support</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Chọn một mẫu CV ưng ý, hoặc tự thiết kế từ đầu. Công nghệ AI sẽ giúp bạn viết lại kinh nghiệm làm việc chuẩn chỉnh.
        </p>
        <div className="flex justify-center gap-4 pt-4">
           <Link href="/editor/blank">
            <Button size="lg" className="gap-2">
              <PenTool className="w-4 h-4" />
              Tự thiết kế (Blank)
            </Button>
           </Link>
        </div>
      </section>

      {/* Templates Grid */}
      <section className="max-w-7xl mx-auto py-16 px-6">
        <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold tracking-tight">Mẫu CV Đề Xuất</h2>
            <Button variant="ghost" className="text-blue-600">Xem tất cả &rarr;</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((template) => (
            <Card key={template.id} className="group hover:shadow-lg transition-all duration-300 border-slate-200 overflow-hidden">
              {/* Thumbnail Container */}
              <div className="aspect-[1/1.41] bg-slate-100 relative overflow-hidden">
                 {/* Giả lập ảnh mẫu */}
                 <img 
                    src={template.thumbnail} 
                    alt={template.name}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                 />
                 {/* Overlay button khi hover */}
                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Link href={`/editor/${template.id}`}>
                        <Button className="rounded-full">Sử dụng mẫu này</Button>
                    </Link>
                 </div>
              </div>

              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    {template.name}
                    {template.id === 'modern' && <Badge className="bg-green-500">Popular</Badge>}
                </CardTitle>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}