"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClientService } from "@/services/Client/auth-client.service";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return alert("Vui lòng nhập email");

    setLoading(true);
    try {
      await authClientService.requestForgotPassword(email);
      // Lưu email vào sessionStorage để các bước sau sử dụng
      sessionStorage.setItem("reset_email", email);
      router.push("/auth/otp"); // Chuyển sang trang nhập OTP
    } catch (error: any) {
      alert(error.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex font-sans">
      {/* LEFT SIDE: BRANDING (Giữ nguyên) */}
      <div className="hidden lg:flex w-5/12 bg-[#0F172A] relative flex-col justify-between p-12 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500 rounded-full blur-[80px]"></div>
        </div>
        <div className="relative z-10 flex items-center gap-2 font-bold text-xl">
          <div className="bg-blue-600 p-1.5 rounded-lg"><Zap className="w-5 h-5 text-white" /></div> RecruitAI
        </div>
        <div className="relative z-10 space-y-4 max-w-md">
           <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center text-blue-500 mb-4">
              <ShieldCheck className="w-6 h-6" />
           </div>
           <blockquote className="text-xl font-medium leading-relaxed">
             "Bảo mật thông tin của bạn là ưu tiên hàng đầu của chúng tôi."
           </blockquote>
        </div>
      </div>

      {/* RIGHT SIDE: FORM */}
      <div className="flex-1 bg-white flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
            <Link href="/auth/login" className="inline-flex items-center text-sm text-slate-500 hover:text-blue-600 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại Đăng nhập
            </Link>
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-slate-900">Quên Mật khẩu?</h1>
                <p className="text-slate-500 text-sm">Nhập email để nhận mã OTP xác thực.</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-700 font-semibold text-sm">Email</Label>
                    <Input 
                        id="email" 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="nguyenvana@example.com" 
                        className="h-11 bg-slate-50 border-slate-200"
                        required
                    />
                </div>
                <Button disabled={loading} className="w-full h-11 bg-blue-600 hover:bg-blue-700 font-bold shadow-lg">
                    {loading ? "Đang gửi..." : "Gửi mã xác nhận"}
                </Button>
            </form>
        </div>
      </div>
    </div>
  );
}