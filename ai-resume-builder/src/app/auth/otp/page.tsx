"use client";

import Link from "next/link";
import { ArrowRight, Mail, Clock, Zap, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function OTPPage() {
  return (
    <div className="min-h-screen w-full flex font-sans bg-slate-50/30">
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

      {/* RIGHT SIDE: OTP FORM */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-[480px] bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
            {/* Thanh màu xanh trang trí phía trên */}
            <div className="h-1.5 w-full bg-blue-600"></div>

            <div className="p-10 flex flex-col items-center text-center space-y-8">
                {/* Icon Email */}
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 relative">
                   <Mail className="w-8 h-8" />
                   <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-sm">
                      <div className="bg-blue-600 rounded-full p-0.5"><Zap className="w-3 h-3 text-white" /></div>
                   </div>
                </div>

                <div className="space-y-3">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Nhập Mã OTP</h1>
                    <p className="text-slate-500 text-sm px-4">
                        Vui lòng nhập mã xác thực gồm 6 chữ số đã được gửi đến email <span className="font-bold text-slate-900">nguyen***@gmail.com</span>
                    </p>
                </div>

                {/* OTP Inputs */}
                <div className="flex gap-3 justify-center">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <input
                            key={i}
                            type="text"
                            maxLength={1}
                            className="w-12 h-16 text-center text-2xl font-bold border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:ring-0 outline-none transition-all bg-slate-50/50"
                        />
                    ))}
                </div>

                {/* Timer */}
                <div className="inline-flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full text-blue-600 font-bold text-sm">
                    <Clock className="w-4 h-4" /> 00:59
                </div>

                <div className="text-sm text-slate-500">
                    Bạn chưa nhận được mã? <button className="text-blue-600 font-bold hover:underline">Gửi lại mã</button>
                </div>

                <div className="w-full space-y-4">
                    <Button className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-2xl shadow-lg shadow-blue-200 group">
                        Xác nhận <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <Link href="/login" className="block text-slate-500 text-sm font-medium hover:text-slate-900 transition-colors">
                        Quay lại đăng nhập
                    </Link>
                </div>
            </div>

            {/* Footer contact */}
            <div className="bg-slate-50/80 p-5 border-t border-slate-100 text-center">
                <p className="text-xs text-slate-400">
                    Cần hỗ trợ? Liên hệ <a href="mailto:support@smartrecruit.ai" className="text-slate-600 font-medium underline">support@smartrecruit.ai</a>
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}