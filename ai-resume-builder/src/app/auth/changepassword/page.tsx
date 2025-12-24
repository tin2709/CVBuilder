"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Zap, ShieldCheck, Lock, EyeOff, RotateCcw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClientService } from "@/services/Client/auth-client.service";

export default function ResetPasswordPage() {
  const [passwords, setPasswords] = useState({ new: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = sessionStorage.getItem("reset_email");
    const otp = sessionStorage.getItem("reset_otp");

    if (!email || !otp) return router.push("/auth/forgot-password");
    if (passwords.new !== passwords.confirm) return alert("Mật khẩu xác nhận không khớp");

    setLoading(true);
    try {
      await authClientService.submitResetPassword({
        email,
        otp,
        newPassword: passwords.new
      });
      alert("Đổi mật khẩu thành công!");
      sessionStorage.clear(); // Xóa sạch session
      router.push("/auth");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex font-sans">
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
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
            <h1 className="text-3xl font-black text-slate-900">Mật khẩu mới</h1>
            <form className="space-y-6" onSubmit={handleReset}>
                <div className="space-y-2">
                    <Label className="font-bold text-sm">Mật khẩu mới</Label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-4 w-5 h-5 text-slate-400" />
                        <Input 
                            type="password" required
                            className="h-13 pl-11 bg-slate-50"
                            value={passwords.new}
                            onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label className="font-bold text-sm">Xác nhận mật khẩu</Label>
                    <div className="relative">
                        <RotateCcw className="absolute left-3 top-4 w-5 h-5 text-slate-400" />
                        <Input 
                            type="password" required
                            className="h-13 pl-11 bg-slate-50"
                            value={passwords.confirm}
                            onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                        />
                    </div>
                </div>
                <Button disabled={loading} className="w-full h-14 bg-blue-600 hover:bg-blue-700 font-bold text-lg rounded-2xl shadow-xl">
                    {loading ? "Đang xử lý..." : "Hoàn tất đổi mật khẩu"}
                </Button>
            </form>
        </div>
      </div>
    </div>
  );
}