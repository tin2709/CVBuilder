"use client";

import Link from "next/link";
import { Zap, ShieldCheck, Lock, EyeOff, RotateCcw, CheckCircle2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen w-full flex font-sans">
       {/* LEFT SIDE: BRANDING (Giữ nguyên) */}
       <div className="hidden lg:flex w-5/12 bg-[#0F172A] relative flex-col justify-between p-12 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500 rounded-full blur-[80px]"></div>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        </div>
        <div className="relative z-10 flex items-center gap-2 font-bold text-xl">
          <div className="bg-blue-600 p-1.5 rounded-lg"><Zap className="w-5 h-5 text-white" /></div>
          RecruitAI
        </div>
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

      {/* RIGHT SIDE: RESET PASSWORD FORM */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
            <div className="space-y-2 text-left">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Thay đổi Mật khẩu</h1>
                <p className="text-slate-500 text-sm">
                    Vui lòng nhập mật khẩu mới cho tài khoản của bạn.
                </p>
            </div>

            <form className="space-y-6">
                {/* Mật khẩu mới */}
                <div className="space-y-2">
                    <Label className="text-slate-700 font-bold text-sm">Mật khẩu mới</Label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600">
                            <Lock className="w-5 h-5" />
                        </div>
                        <Input 
                            type="password"
                            placeholder="Nhập mật khẩu mới" 
                            className="h-13 pl-11 pr-11 bg-slate-50 border-slate-200 rounded-xl focus:border-blue-600 focus:bg-white transition-all outline-none"
                        />
                        <button type="button" className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600">
                            <EyeOff className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Xác nhận mật khẩu */}
                <div className="space-y-2">
                    <Label className="text-slate-700 font-bold text-sm">Xác nhận mật khẩu</Label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600">
                            <RotateCcw className="w-5 h-5" />
                        </div>
                        <Input 
                            type="password"
                            placeholder="Nhập lại mật khẩu mới" 
                            className="h-13 pl-11 pr-11 bg-slate-50 border-slate-200 rounded-xl focus:border-blue-600 focus:bg-white transition-all outline-none"
                        />
                        <button type="button" className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600">
                            <EyeOff className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Yêu cầu bảo mật */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Yêu cầu bảo mật</p>
                    <div className="space-y-2.5">
                        <div className="flex items-center gap-3">
                            <Checkbox id="req1" checked className="data-[state=checked]:bg-blue-600 rounded-md" />
                            <label htmlFor="req1" className="text-sm font-medium text-slate-600 cursor-pointer">Ít nhất 8 ký tự</label>
                        </div>
                        <div className="flex items-center gap-3">
                            <Checkbox id="req2" className="border-slate-300 rounded-md" />
                            <label htmlFor="req2" className="text-sm font-medium text-slate-600 cursor-pointer">Chứa ký tự hoa và số</label>
                        </div>
                    </div>
                </div>

                <Button className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-2xl shadow-xl shadow-blue-200 transition-all">
                    Đổi Mật khẩu
                </Button>

                <Link href="/login" className="flex items-center justify-center gap-2 text-slate-500 text-sm font-medium hover:text-slate-900 transition-colors pt-2">
                    <ArrowLeft className="w-4 h-4" /> Quay lại đăng nhập
                </Link>
            </form>
        </div>
      </div>
    </div>
  );
}