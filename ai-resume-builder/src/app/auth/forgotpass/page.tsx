"use client";

import Link from "next/link";
import { ArrowLeft, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen w-full flex font-sans">
      
      {/* LEFT SIDE: BRANDING */}
      <div className="hidden lg:flex w-5/12 bg-[#0F172A] relative flex-col justify-between p-12 text-white overflow-hidden">
        {/* Abstract Background Effect */}
        <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500 rounded-full blur-[80px]"></div>
            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        </div>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2 font-bold text-xl">
          <div className="bg-blue-600 p-1.5 rounded-lg"><Zap className="w-5 h-5 text-white" /></div>
          RecruitAI
        </div>

        {/* Quote */}
        <div className="relative z-10 space-y-4 max-w-md">
           <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center text-blue-500 mb-4">
              <ShieldCheck className="w-6 h-6" />
           </div>
           <blockquote className="text-xl font-medium leading-relaxed">
             "Bảo mật thông tin của bạn là ưu tiên hàng đầu của chúng tôi trong hành trình kết nối nhân tài."
           </blockquote>
           <p className="text-sm text-slate-400">Hệ thống bảo mật đa lớp chuẩn quốc tế.</p>
        </div>
      </div>

      {/* RIGHT SIDE: FORM */}
      <div className="flex-1 bg-white flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
            {/* Top Link */}
            <Link href="/login" className="inline-flex items-center text-sm text-slate-500 hover:text-blue-600 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại Đăng nhập
            </Link>

            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-slate-900">Quên Mật khẩu?</h1>
                <p className="text-slate-500 text-sm leading-relaxed">
                    Đừng lo lắng, chúng tôi sẽ giúp bạn lấy lại tài khoản. Vui lòng nhập email đăng ký của bạn bên dưới để nhận liên kết đặt lại mật khẩu.
                </p>
            </div>

            <form className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-700 font-semibold text-sm">Email hoặc Tên người dùng</Label>
                    <Input 
                        id="email" 
                        placeholder="nguyenvana@example.com" 
                        className="h-11 bg-slate-50 border-slate-200 focus:border-blue-500"
                    />
                </div>

                <Button className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-lg shadow-blue-200">
                    Gửi liên kết xác nhận
                </Button>
            </form>

            <div className="text-center pt-4">
                <p className="text-xs text-slate-400">
                    Nếu bạn vẫn gặp sự cố, vui lòng liên hệ <a href="#" className="text-blue-600 hover:underline font-medium">Bộ phận hỗ trợ</a>
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}