"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, Bot, Star, Check, ArrowRight } from "lucide-react";

export default function AuthPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full h-screen grid lg:grid-cols-2">
      {/* --- LEFT SIDE: MARKETING --- */}
      <div className="hidden lg:flex flex-col justify-between bg-[#0052cc] p-12 relative overflow-hidden">
        {/* Background Overlay Image (Giả lập ảnh mờ phía sau) */}
        <div 
            className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"
        ></div>
        
        {/* Gradient Overlay để chữ dễ đọc hơn */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0044aa] to-transparent"></div>

        {/* Content bên trái */}
        <div className="relative z-10 space-y-12 h-full flex flex-col justify-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg w-fit text-white/90 text-xs font-bold uppercase tracking-wider border border-white/20">
            <Bot className="w-4 h-4" />
            AI Powered Recruitment
          </div>

          {/* Headline */}
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-white leading-tight">
              Kết nối nhân tài với cơ hội bằng sức mạnh AI
            </h1>
            <p className="text-blue-100 text-lg max-w-md leading-relaxed">
              Hệ thống tuyển dụng thông minh giúp bạn tiết kiệm 80% thời gian sàng lọc và tìm kiếm ứng viên phù hợp nhất.
            </p>
          </div>

          {/* Divider Line */}
          <div className="h-px w-full bg-gradient-to-r from-white/30 to-transparent"></div>

          {/* Social Proof */}
      
        </div>
      </div>


      {/* --- RIGHT SIDE: FORM --- */}
      <div className="flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-[440px] space-y-8">
          
          {/* Logo Mobile (Chỉ hiện khi màn hình nhỏ) */}
          <div className="lg:hidden flex justify-center mb-4">
             <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                <Bot className="w-8 h-8" />
             </div>
          </div>

          {/* Icon Logo ở giữa (Desktop) */}
          <div className="hidden lg:flex justify-center mb-6">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                  <path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z"/>
                </svg>
             </div>
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Chào mừng trở lại!</h2>
            <p className="text-slate-500 text-sm">Nhập thông tin đăng nhập để truy cập tài khoản của bạn.</p>
          </div>

          {/* TABS SWITCHER */}
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 h-12 bg-slate-100/80 p-1">
              <TabsTrigger value="login" className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all">Đăng nhập</TabsTrigger>
              <TabsTrigger value="register" className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all">Đăng ký</TabsTrigger>
            </TabsList>

            {/* --- FORM LOGIN --- */}
            <TabsContent value="login" className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email hoặc Tên đăng nhập</Label>
                  <Input id="email" placeholder="name@company.com" className="h-11 bg-slate-50 border-slate-200 focus:bg-white transition-colors" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <div className="relative">
                    <Input 
                        id="password" 
                        type={showPassword ? "text" : "password"} 
                        placeholder="••••••••" 
                        className="h-11 bg-slate-50 border-slate-200 focus:bg-white transition-colors pr-10" 
                    />
                    <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                    >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" className="border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600" />
                  <label htmlFor="remember" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-600">
                    Ghi nhớ đăng nhập
                  </label>
                </div>
                <Link href="#" className="text-sm font-medium text-blue-600 hover:underline">
                  Quên mật khẩu?
                </Link>
              </div>

              <Button className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-base font-semibold shadow-lg shadow-blue-600/20">
                Đăng nhập <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </TabsContent>

            {/* --- FORM REGISTER (Placeholder) --- */}
            <TabsContent value="register" className="space-y-4">
               <div className="space-y-2">
                  <Label htmlFor="reg-email">Email công việc</Label>
                  <Input id="reg-email" placeholder="name@company.com" className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-pass">Mật khẩu</Label>
                  <Input id="reg-pass" type="password" placeholder="••••••••" className="h-11" />
                </div>
                <Button className="w-full h-11 bg-blue-600 hover:bg-blue-700 font-semibold mt-4">
                    Tạo tài khoản mới
                </Button>
            </TabsContent>
          </Tabs>

          {/* Social Login */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-500 font-medium">Hoặc tiếp tục với</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-11 border-slate-200 hover:bg-slate-50 hover:text-slate-900 font-normal">
              <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
              Google
            </Button>
            <Button variant="outline" className="h-11 border-slate-200 hover:bg-slate-50 hover:text-slate-900 font-normal">
               <svg className="mr-2 h-4 w-4 text-[#0077b5]" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
               LinkedIn
            </Button>
          </div>

          {/* Footer Links */}
          <div className="text-center space-y-4">
             <p className="text-sm text-slate-500">
                Bạn chưa có tài khoản?{" "}
                <Link href="#" className="font-semibold text-blue-600 hover:underline">
                  Đăng ký ngay
                </Link>
             </p>
             
             <div className="flex justify-center gap-6 text-xs text-slate-400">
                <Link href="#" className="hover:text-slate-600">Điều khoản sử dụng</Link>
                <Link href="#" className="hover:text-slate-600">Chính sách bảo mật</Link>
                <Link href="#" className="hover:text-slate-600">Trợ giúp</Link>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}