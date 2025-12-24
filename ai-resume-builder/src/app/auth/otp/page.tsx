"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mail, Clock, Zap, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClientService } from "@/services/Client/auth-client.service";

export default function OTPPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [email, setEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    const savedEmail = sessionStorage.getItem("reset_email");
    if (!savedEmail) router.push("/auth/forgot-password");
    else setEmail(savedEmail);
  }, []);

  // Hàm che mờ email (vd: n***@gmail.com)
  const maskEmail = (str: string) => {
    const [name, domain] = str.split("@");
    return `${name.substring(0, 3)}***@${domain}`;
  };

  const handleChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Tự động nhảy sang ô tiếp theo
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleConfirm = () => {
    const otpCode = otp.join("");
    if (otpCode.length < 6) return alert("Vui lòng nhập đủ 6 số");
    
    sessionStorage.setItem("reset_otp", otpCode);
    router.push("/auth/changepassword"); // Chuyển sang bước cuối
  };

  return (
    <div className="min-h-screen w-full flex font-sans bg-slate-50/30">
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
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-[480px] bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
            <div className="h-1.5 w-full bg-blue-600"></div>
            <div className="p-10 flex flex-col items-center text-center space-y-8">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600"><Mail /></div>
                <div className="space-y-3">
                    <h1 className="text-3xl font-black text-slate-900">Nhập Mã OTP</h1>
                    <p className="text-slate-500 text-sm">
                        Mã đã gửi đến <span className="font-bold text-slate-900">{email ? maskEmail(email) : ""}</span>
                    </p>
                </div>
                <div className="flex gap-3 justify-center">
                    {otp.map((digit, i) => (
                        <input
                            key={i} id={`otp-${i}`} type="text" maxLength={1} value={digit}
                            onChange={(e) => handleChange(e.target.value, i)}
                            className="w-12 h-16 text-center text-2xl font-bold border-2 border-slate-200 rounded-xl focus:border-blue-600 outline-none"
                        />
                    ))}
                </div>
                <Button onClick={handleConfirm} className="w-full h-14 bg-blue-600 hover:bg-blue-700 font-bold text-lg rounded-2xl group">
                    Tiếp tục <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
}