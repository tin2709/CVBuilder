"use client";
import { useState } from "react"; // 1. Import useState

import Link from "next/link";
import { 
  Search, 
  Sparkles, 
  Star, 
  Palette, 
  Briefcase, 
  BookOpen, 
  Code, 
  CheckCircle2, 
  ChevronDown, 
  Menu,
  MessageSquarePlus,
  ArrowRight,X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// Dữ liệu mẫu giống hệt trong file HTML tham khảo
const TEMPLATES = [
  { 
    id: 1, 
    name: "Minimalist Blue", 
    desc: "Phù hợp: IT, Developers, System Admin",
    tags: ["ATS Friendly"], 
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDoA3WyqLPxF42a7fiCFatJqCrYNl-m_azave3_XiVQR-nltF6BPlDtKpmdJFLA49bgPNXu-W8VsgPrC5x9AeRCFpyaPmtS72wCeTOxG7eQ9-2ilRC_7qsV8m6_I1Z7C9oxpWr5gQBaPfK1RJ4CqV1rp6TGgBMIZyUZwiWpzZ3o_g9QiL_WG2l13_TlJVODFjX4rJwMYAEeUedhxrLa66UWp2cpiU66Qtcv2wBaBePG6lfyUy64flY807OQ_txmaMrYfSzo4xBNvVCA", 
    colorDot: "#136dec" 
  },
  { 
    id: 2, 
    name: "Creative Bold", 
    desc: "Phù hợp: Design, Marketing, Content",
    tags: ["AI Pick"], 
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDMSpCaCQfqH4RTEoDoz7PdFiVklRVAVExsf5-nqX7GCi4zlLv0u2015seSZt6dO9tcSenou7KKS6nLNeJsRoaKLlRX9mjkvMfGQbDyuD55qonIj-DSr8bHvZDM2z-3hvxwGE917zIRxC7bMxdk3f8laTuCRXcS_u_FJhQeFp2rsNDl8krTP7brHEmLBCC0yaUcSFw4NoEAVyrBdIPhRJ0dBaWSNs0WDnHZnNimmp7mkr1xrP7XgIONS3hfNwRmIweVsPHUoeT9nFjs", 
    colorDot: "#1e293b" // slate-800
  },
  { 
    id: 3, 
    name: "Corporate Clean", 
    desc: "Phù hợp: Banking, Finance, Admin",
    tags: ["ATS Friendly"], 
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDkw5Sada-VsgAkR4lX0_NHJNyMtfEgTzNexrKjhDJxUhxxUKhtqR1wS8SYcnA4rZrKvbFT6czXBPDRRfoyQRUB_0TSy3Vd0uQuyQRh9EWkJxecL1ZzYMlXRTThxd7-b5eBXMVW90c3k43Ehz7H-3KAFmJtdbaCfQE-1OWmW3ykMdPiuaQcJnunBPVKu_RG8jLJLOkowhn7lfo8mxafCr0DPpfZ6B_M5PVfBAAfSEoExGiv4J-BgNLf2HeDjx39gAOT333uYxh6j6nS", 
    colorDot: "#64748b" // slate-500
  },
  { 
    id: 4, 
    name: "Academic CV", 
    desc: "Phù hợp: Professors, Research, Students",
    tags: [], 
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB-OmzXTRTAAp3Xa7XkaNHRXyufmCBkbwTdhuN-wMWgvRBMlqqpyvt_L6pC2yfu5zTY9-YyzvqrTxn4Hdxn9flLfC6pXn-FfaZG0E2i7Q1n3eY5H3fwSFhm2xNfI6oVsfbOn9qkDjItZMOYTUuE0XJ-5toxHA2jhT3m2uEtYG_LXfn9dBGtyXxIfOqIxJpOBUSIgMS4ErYDdHVDN1QPUl0o67F8uYiqO8UBIOY1NEE43T9HrM5R7DiULA6Sx22_7gHqJ5JrEueTv6y2", 
    colorDot: "#1e293b" 
  },
  { 
    id: 5, 
    name: "Pink Accent", 
    desc: "Phù hợp: Fashion, Media, General",
    tags: [], 
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCi4QyMAprdpWMDYisz7N6aCngvEoR9YS0_PFANlUKAxJrZfLP7xUoiDOaiAQKRIoEI26p5PFkBAzy8RItvQYxbhoK3aDNC3OqkeBIcCDe9TvXzpL72oAI8yrUWQ30DiY5O34dx-lvGFwQZAofIGQmYwnhoZUEnIcVa7l0GWEHfvTtC-SPiGZZqcN05Kx7VxXzffjELt4Av7gaxpHhslHje2Lzz0vqzkoB-v1VK5_jrZ8JFyZSurXXYccBshkjQKBwL8FvYyn3BBaYQ", 
    colorDot: "#ec4899" // pink-500
  },
  { 
    id: 6, 
    name: "Executive Dark", 
    desc: "Phù hợp: Manager, C-Level, Director",
    tags: ["ATS Friendly"], 
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAmFslp49XpwjWY9zx_Wos09WTZVb2I3YTh5sLCTLKYLwfIw8ZHBnBDhFJoyCx8R1zVFr-31p0OliXcaZg1AcmlYN0U_0iskwNU3ctl4SOcSi5ZRyuJPGNZ9vWvidvlj6afDc7XVf6bUscvc4DC-u4xz8cQNrNjvKcnfEAI90pFBEZJ1XcVx3Kal30O2NBbOKpzFkea2K7O4rbSV6eEVmn3piWfdv9oalmf1bBOl0bvpQbLAGWuEc73_QlbxiP7uD5NgOk5iR0KeL9L", 
    colorDot: "#1e293b" 
  },
  { 
    id: 7, 
    name: "Tech Green", 
    desc: "Phù hợp: Developer, QA, Data Analyst",
    tags: [], 
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuABfgsZpvsl6pcCpk8IFsdjQ-ZEnv3R5_JSnI1Z-mvBqZ_TlHkLVeZzfyf07dGdtwWvWSMCIxnHMQueRDIQvpEHbpyA74lxtWdUPoSV-yKgpyjyceHyi22LV3dLNkAdKmM8K00Az0FSWoIEGDpSPdxAKGMbP0rYhxmL2s81OY_539Nf1nrtIvdTQzQP3EszeqWEYV3xlgpKzHLQigYGSibyJ6r_IZCJx0yxrclhHOAzoM35H8PynaA5LVed2RX8VFhePTHLqX6a1yVM", 
    colorDot: "#16a34a" // green-600
  },
  { 
    id: 8, 
    name: "Classic Simple", 
    desc: "Phù hợp: General, Entry-level, Intern",
    tags: ["ATS Friendly"], 
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB36DQGuFhDqF7Aq34jvw5AOWIRkZMQH0IYL8ddPQFFqv0IWTqaV_zLDi4KZ5GwNidmo_iveKAxttO_AaGJmtE3YMCfQ-qul0qghgrfGKUtGdYLfLjaOLA13dJ2-wNrbb19BDcaT0HR2fPq8aAGPmMMTMOicl99u7sCfRh_Jibb4iSXK2EJJVjmtMAZHXZyazcz4OZY6zMp3kiXkmQZaxYxAU0eweAlCJ02cM3MwCeQ0QOlCv9-N9Xt7lUfDHyRAR6dzbHlZKmm0-kA", 
    colorDot: "#94a3b8" // slate-400
  },
];

export default function TemplatesPage() {
      const [viewingTemplate, setViewingTemplate] = useState<typeof TEMPLATES[0] | null>(null);

  return (
    <div className="flex flex-col min-h-screen bg-[#f6f7f8] text-slate-900 font-sans">
      
      {/* 1. Header (Sticky) */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 bg-white border-b border-slate-200 lg:px-10">
        <div className="flex items-center gap-4">
          {/* Logo Icon */}
          <div className="size-8 text-[#136dec]">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
               <path d="M42.17 20.17L27.82 5.82C29.13 7.13 28.4 10.18 26.2 13.76C24.85 15.95 22.96 18.34 20.65 20.65C18.34 22.96 15.95 24.85 13.76 26.2C10.18 28.4 7.13 29.13 5.82 27.82L20.17 42.17C21.48 43.48 24.53 42.74 28.11 40.54C30.3 39.2 32.7 37.3 35 35C37.3 32.7 39.2 30.3 40.54 28.11C42.74 24.53 43.48 21.48 42.17 20.17Z" fill="currentColor"/>
               <path clipRule="evenodd" d="M7.24 26.41C7.31 26.44 7.64 26.56 8.52 26.37C9.59 26.14 11.03 25.53 12.72 24.5C14.76 23.24 17.02 21.45 19.24 19.24C21.45 17.02 23.24 14.76 24.5 12.72C25.53 11.03 26.14 9.59 26.37 8.52C26.56 7.64 26.44 7.31 26.4 7.24C26.34 7.21 26.14 7.14 25.66 7.19C24.97 7.26 23.99 7.55 22.77 8.14C20.33 9.32 17.33 11.49 14.41 14.41C11.49 17.33 9.32 20.33 8.14 22.77C7.55 23.99 7.26 24.97 7.19 25.66C7.14 26.14 7.21 26.34 7.24 26.41ZM29.9 10.73C29.45 12.03 28.76 13.41 27.9 14.81C26.46 17.15 24.47 19.66 22.06 22.06C19.66 24.47 17.15 26.46 14.81 27.9C13.41 28.76 12.03 29.45 10.73 29.9L21.57 40.74C21.6 40.76 21.9 40.93 22.87 40.72C23.94 40.49 25.38 39.88 27.06 38.84C29.1 37.59 31.37 35.8 33.58 33.58C35.8 31.37 37.59 29.1 38.84 27.06C39.88 25.38 40.49 23.94 40.72 22.87C40.93 21.9 40.76 21.6 40.74 21.57L29.9 10.73ZM29.24 4.41L43.59 18.76C44.97 20.14 44.97 22.12 44.63 23.71C44.27 25.39 43.41 27.26 42.25 29.16C40.81 31.5 38.81 34.01 36.41 36.41C34.01 38.81 31.5 40.81 29.16 42.25C27.26 43.41 25.39 44.27 23.71 44.63C22.12 44.97 20.14 44.97 18.76 43.59L4.41 29.24C3.29 28.12 3.08 26.6 3.21 25.28C3.34 23.94 3.83 22.48 4.54 21.02C5.96 18.09 8.43 14.73 11.58 11.58C14.73 8.43 18.09 5.96 21.02 4.54C22.48 3.83 23.94 3.34 25.28 3.21C26.6 3.08 28.12 3.29 29.24 4.41Z" fill="currentColor" fillRule="evenodd"/>
            </svg>
          </div>
          <h2 className="text-lg font-bold tracking-tight text-slate-900">SmartRecruit AI</h2>
        </div>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-8 lg:flex">
          <nav className="flex gap-9 text-sm font-medium">
            <Link href="#" className="text-slate-700 transition-colors hover:text-[#136dec]">Việc làm</Link>
            <Link href="#" className="font-bold text-[#136dec]">Tạo CV</Link>
            <Link href="#" className="text-slate-700 transition-colors hover:text-[#136dec]">Blog</Link>
            <Link href="#" className="text-slate-700 transition-colors hover:text-[#136dec]">Hồ sơ của tôi</Link>
          </nav>
          <Button className="h-10 px-4 text-sm font-bold text-white transition-colors bg-[#136dec] hover:bg-blue-600 rounded-lg">
            Đăng nhập
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="size-6" />
        </Button>
      </header>

      <main className="flex flex-col flex-1">
        {/* 2. Hero Section */}
        <section className="flex justify-center px-4 py-8 sm:px-10 lg:px-40 bg-[#f6f7f8]">
          <div className="w-full max-w-[1200px]">
            <div 
              className="relative flex flex-col items-center justify-center gap-6 p-8 overflow-hidden shadow-xl text-center rounded-2xl sm:p-12 lg:min-h-[320px] bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `linear-gradient(rgba(16, 24, 34, 0.7) 0%, rgba(19, 109, 236, 0.6) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuAVpKp9gfoxPKefUWJsElrpKsCrXtrjlsoc_UriHCaBuIubY75mBAlipM8VWFkD9pUoF4bWnLsx7JhrT2KdeVfuwwAawE3ppAHF1zohoh1z3DTTlWOagRGjQb4fWcrMPfNzOVbRYiwEL5oOPaH3WpIOkwf4rPJt0jEFvsRZdfhZWPVtSRUvQHmj4CCx5o3ZC8hbiDtbNQjAOiFiRDa0kv7Y4XVxrLKEb-RfLA5sJw5E-Se6MUpdCejfWrhu9x32d5ZyAl757ZcXe29s")`
              }}
            >
              <div className="z-10 flex flex-col max-w-2xl gap-3">
                <h1 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                  Chọn Mẫu CV Chuyên Nghiệp
                </h1>
                <p className="text-base font-normal text-slate-100 sm:text-lg">
                  Tăng cơ hội trúng tuyển với các mẫu thiết kế chuẩn ATS và được tối ưu bởi AI.
                </p>
              </div>
              <div className="z-10 flex flex-wrap justify-center gap-3">
                <Button className="h-12 px-6 text-base font-bold text-white shadow-lg bg-[#136dec] hover:bg-blue-600 hover:shadow-primary/50 gap-2">
                  <Sparkles className="size-5" /> Hỏi AI gợi ý
                </Button>
                <Button variant="outline" className="h-12 px-6 text-base font-bold text-white transition-all border border-white/20 bg-white/10 backdrop-blur-md hover:bg-white/20 hover:text-white">
                  Hướng dẫn viết CV
                </Button>
              </div>
            </div>
          </div>
        </section>
   {viewingTemplate && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setViewingTemplate(null)} // Bấm ra ngoài thì đóng
        >
          {/* Container chứa ảnh */}
          <div 
            className="relative w-full max-w-5xl h-full max-h-[90vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()} // Ngăn sự kiện đóng khi bấm vào ảnh
          >
            {/* Nút đóng */}
            <button 
              onClick={() => setViewingTemplate(null)}
              className="absolute -top-10 right-0 p-2 text-white/80 hover:text-white transition-colors"
            >
              <X className="size-8" />
            </button>

            {/* Ảnh phóng to */}
            <img 
              src={viewingTemplate.image} 
              alt={viewingTemplate.name} 
              className="object-contain w-auto h-full rounded-lg shadow-2xl"
            />

            {/* (Tùy chọn) Thanh hành động bên dưới ảnh */}
            <div className="absolute bottom-4 flex gap-3">
                 <Link href={`/cv/builder/${viewingTemplate.id}`}>
                    <Button className="bg-[#136dec] hover:bg-blue-600 font-bold shadow-lg">
                        Dùng mẫu này ngay
                    </Button>
                 </Link>
            </div>
          </div>
        </div>
      )}
        {/* 3. Filters & Search Toolbar (Sticky) */}
        <section className="sticky top-[64px] z-30 py-4 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
          <div className="max-w-[1400px] mx-auto px-4 lg:px-10">
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              {/* Search */}
              <div className="w-full lg:w-1/3">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="text-slate-400 size-5" />
                  </div>
                  <Input 
                    type="text"
                    placeholder="Tìm kiếm theo ngành nghề (IT, Marketing...)" 
                    className="block w-full py-2.5 pl-10 pr-3 text-sm transition-all border-slate-200 bg-slate-100 placeholder:text-slate-400 focus-visible:ring-[#136dec] focus-visible:border-[#136dec]"
                  />
                </div>
              </div>

              {/* Filter Chips */}
              <div className="flex-1 pb-2 overflow-x-auto lg:pb-0 scrollbar-hide">
                <div className="flex gap-2 min-w-max">
                  <Button variant="default" className="flex items-center gap-2 px-4 text-white bg-slate-900 hover:bg-slate-800 h-9">
                    <Star className="size-[18px]" /> Tất cả
                  </Button>
                  <Button variant="ghost" className="flex items-center gap-2 px-4 transition-colors bg-slate-100 hover:bg-slate-200 text-slate-700 h-9">
                    <Palette className="size-[18px] text-slate-600" /> Hiện đại
                  </Button>
                  <Button variant="ghost" className="flex items-center gap-2 px-4 transition-colors bg-slate-100 hover:bg-slate-200 text-slate-700 h-9">
                    <Briefcase className="size-[18px] text-slate-600" /> Chuyên nghiệp
                  </Button>
                  <Button variant="ghost" className="flex items-center gap-2 px-4 transition-colors bg-slate-100 hover:bg-slate-200 text-slate-700 h-9">
                    <BookOpen className="size-[18px] text-slate-600" /> Học thuật
                  </Button>
                  <Button variant="ghost" className="flex items-center gap-2 px-4 transition-colors bg-slate-100 hover:bg-slate-200 text-slate-700 h-9">
                    <Code className="size-[18px] text-slate-600" /> Kỹ thuật
                  </Button>
                </div>
              </div>

              {/* Color Picker */}
              <div className="hidden pl-4 border-l border-slate-200 xl:flex items-center gap-3">
                <span className="text-xs font-semibold tracking-wider uppercase text-slate-500">Màu sắc</span>
                <div className="flex gap-2">
                  <button className="transition-transform border rounded-full cursor-pointer size-6 border-slate-200 bg-[#136dec] hover:scale-110 ring-2 ring-offset-1 ring-[#136dec]"></button>
                  <button className="transition-transform border rounded-full cursor-pointer size-6 border-slate-200 bg-[#ff5733] hover:scale-110"></button>
                  <button className="transition-transform border rounded-full cursor-pointer size-6 border-slate-200 bg-[#28a745] hover:scale-110"></button>
                  <button className="transition-transform border rounded-full cursor-pointer size-6 border-slate-200 bg-[#343a40] hover:scale-110"></button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Templates Grid */}
        <section className="flex-1 w-full max-w-[1400px] px-4 py-10 mx-auto lg:px-10">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {TEMPLATES.map((tpl) => (
              <div key={tpl.id} className="relative flex flex-col overflow-hidden transition-all duration-300 bg-white border shadow-sm group rounded-xl border-slate-200 hover:shadow-xl hover:-translate-y-1">
                {/* Image & Overlay */}
                <div className="relative w-full aspect-[210/297] bg-slate-100 overflow-hidden">
                  <img 
                    src={tpl.image} 
                    alt={tpl.name}
                    className="object-cover object-top w-full h-full"
                  />
                  
                  {/* Hover Actions */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4 transition-opacity duration-300 opacity-0 bg-slate-900/60 backdrop-blur-[2px] group-hover:opacity-100">
                    <Button className="w-full max-w-[160px] bg-[#136dec] hover:bg-blue-600 font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75">
                      Dùng mẫu này
                    </Button>
                       <Button 
                        variant="secondary" 
                        className="w-full max-w-[160px] bg-white text-slate-900 font-bold hover:bg-slate-100 shadow-lg"
                        onClick={() => setViewingTemplate(tpl)} // <--- GỌI STATE MỞ MODAL
                    >
                      Xem chi tiết
                    </Button>
                  </div>

                  {/* Tags */}
                  {tpl.tags.length > 0 && (
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      {tpl.tags.map(tag => {
                        const isAI = tag === "AI Pick";
                        return (
                          <Badge 
                            key={tag}
                            className={`
                              px-2 py-1 text-xs font-bold rounded shadow-sm flex items-center gap-1 border-none
                              ${isAI ? 'bg-purple-100 text-purple-700 hover:bg-purple-100' : 'bg-white/90 text-green-600 hover:bg-white/90 backdrop-blur'}
                            `}
                          >
                            {isAI ? <Sparkles className="size-[14px]" /> : <CheckCircle2 className="size-[14px]" />}
                            {tag}
                          </Badge>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* Footer Card */}
                <div className="flex flex-col gap-2 p-4">
                  <div className="flex items-start justify-between">
                    <h3 className="text-base font-bold text-slate-900 line-clamp-1">{tpl.name}</h3>
                    <div 
                      className="size-3 rounded-full mt-1.5 shrink-0 border border-slate-200" 
                      style={{ backgroundColor: tpl.colorDot }}
                    ></div>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1">{tpl.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="flex justify-center mt-12">
            <button className="flex items-center gap-1 text-sm font-bold transition-all text-[#136dec] hover:underline">
              Xem thêm 20 mẫu khác
              <ChevronDown className="size-[18px]" />
            </button>
          </div>
        </section>
      </main>

      {/* 5. Footer */}
      <footer className="py-10 bg-white border-t border-slate-200">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-10">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2 text-slate-900">
              <div className="size-6 text-[#136dec]">
                <svg viewBox="0 0 48 48" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg"><path d="M42.17 20.17L27.82 5.82C29.13 7.13 28.4 10.18 26.2 13.76C24.85 15.95 22.96 18.34 20.65 20.65C18.34 22.96 15.95 24.85 13.76 26.2C10.18 28.4 7.13 29.13 5.82 27.82L20.17 42.17C21.48 43.48 24.53 42.74 28.11 40.54C30.3 39.2 32.7 37.3 35 35C37.3 32.7 39.2 30.3 40.54 28.11C42.74 24.53 43.48 21.48 42.17 20.17Z" fill="currentColor"></path></svg>
              </div>
              <span className="text-lg font-bold tracking-tight">SmartRecruit AI</span>
            </div>
            
            <div className="flex gap-6 text-sm font-medium text-slate-500">
              <Link href="#" className="transition-colors hover:text-[#136dec]">Điều khoản</Link>
              <Link href="#" className="transition-colors hover:text-[#136dec]">Bảo mật</Link>
              <Link href="#" className="transition-colors hover:text-[#136dec]">Liên hệ</Link>
            </div>

            <div className="text-sm text-slate-400">
              © 2024 SmartRecruit AI. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      {/* 6. AI Floating Action Button */}
      <button className="fixed z-50 flex items-center justify-center transition-transform rounded-full shadow-2xl group bottom-6 right-6 lg:bottom-10 lg:right-10 size-14 bg-[#136dec] text-white shadow-blue-500/40 hover:scale-110">
        <MessageSquarePlus className="size-[28px] transition-transform group-hover:rotate-12" />
        <div className="absolute right-full mr-3 bg-slate-900 text-white text-xs py-1.5 px-3 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-medium">
          Hỏi AI chọn mẫu CV
        </div>
      </button>

    </div>
  );
}