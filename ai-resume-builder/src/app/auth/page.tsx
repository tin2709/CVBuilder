"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Eye, EyeOff, Bot, ArrowRight,
  User, Briefcase, Camera, Upload
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, RegisterSchema, LoginPayload, RegisterPayload } from "@/lib/schema"; // Import Schema
import { authClientService } from "@/services/Client/auth-client.service"; // Import service mới
import { useRouter } from "next/navigation"; // Để chuyển hướng sau khi login

export default function AuthPage() {
  const [showPassword, setShowPassword] = useState(false);

  // State cho phần Đăng ký
  const [role, setRole] = useState<"candidate" | "recruiter">("candidate");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false); // Thêm state loading để quản lý UI
  const router = useRouter();

  const loginForm = useForm<LoginPayload>({
    resolver: zodResolver(LoginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  /* ================= REGISTER FORM ================= */
  const registerForm = useForm<RegisterPayload>({
    resolver: zodResolver(RegisterSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      role: "candidate",
      avatar: "",
    },
  });

  /* ================= HANDLERS ================= */

  const handleRoleSelect = (value: "candidate" | "recruiter") => {
    setRole(value);
    registerForm.setValue("role", value, {
      shouldValidate: true,
    });
  };

  const handleAvatarChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setAvatarPreview(base64);
      registerForm.setValue("avatar", base64, {
        shouldValidate: true,
      });
    };
    reader.readAsDataURL(file);
  };
  const onLoginSubmit = async (data: LoginPayload) => {
    setLoading(true);
    try {
      const response = await authClientService.login(data);
      if (response.success) {
        alert("Đăng nhập thành công!");
        router.push("/"); // Chuyển hướng sau khi thành công
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const onRegisterSubmit = async (data: RegisterPayload) => {
    setLoading(true);
    try {
      const response = await authClientService.register(data);
      if (response.success) {
        alert("Đăng ký thành công! Hãy đăng nhập.");
        // Có thể tự động chuyển sang tab login hoặc reload
        window.location.reload();
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="w-full h-screen grid lg:grid-cols-2">
      {/* --- LEFT SIDE: MARKETING --- */}
      <div className="hidden lg:flex flex-col justify-between bg-[#0052cc] p-12 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0044aa] to-transparent"></div>

        <div className="relative z-10 space-y-12 h-full flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg w-fit text-white/90 text-xs font-bold uppercase tracking-wider border border-white/20">
            <Bot className="w-4 h-4" />
            AI Powered Recruitment
          </div>
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-white leading-tight">
              Kết nối nhân tài với cơ hội bằng sức mạnh AI
            </h1>
            <p className="text-blue-100 text-lg max-w-md leading-relaxed">
              Hệ thống tuyển dụng thông minh giúp bạn tiết kiệm 80% thời gian sàng lọc và tìm kiếm ứng viên phù hợp nhất.
            </p>
          </div>
          <div className="h-px w-full bg-gradient-to-r from-white/30 to-transparent"></div>
        </div>
      </div>


      {/* --- RIGHT SIDE: FORM --- */}
      <div className="flex items-center justify-center p-8 bg-white overflow-y-auto">
        <div className="w-full max-w-[440px] space-y-8">

          {/* Logo Mobile */}
          <div className="lg:hidden flex justify-center mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
              <Bot className="w-8 h-8" />
            </div>
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Chào mừng!</h2>
            <p className="text-slate-500 text-sm">Hãy bắt đầu hành trình sự nghiệp của bạn.</p>
          </div>

          {/* TABS SWITCHER */}
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 h-12 bg-slate-100/80 p-1">
              <TabsTrigger value="login">Đăng nhập</TabsTrigger>
              <TabsTrigger value="register">Đăng ký</TabsTrigger>
            </TabsList>

            {/* --- FORM LOGIN --- */}
            <TabsContent value="login" className="space-y-6">
              <form
                onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email hoặc Tên đăng nhập</Label>
                    <Input
                      id="email"
                      placeholder="name@company.com"
                      {...loginForm.register("email")}
                      className="h-11 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                    />
                    {loginForm.formState.errors.email && (
                      <p className="text-xs text-red-500">
                        {loginForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Mật khẩu</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        {...loginForm.register("password")}
                        className="h-11 bg-slate-50 border-slate-200 focus:bg-white transition-colors pr-10"
                      />

                      {loginForm.formState.errors.password && (
                        <p className="text-xs text-red-500">
                          {loginForm.formState.errors.password.message}
                        </p>
                      )}
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
                    <label htmlFor="remember" className="text-sm font-medium leading-none text-slate-600">
                      Ghi nhớ đăng nhập
                    </label>
                  </div>
                  <Link href="#" className="text-sm font-medium text-blue-600 hover:underline">
                    Quên mật khẩu?
                  </Link>
                </div>

                <Button className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-base font-semibold shadow-lg shadow-blue-600/20"
                  disabled={loading}

                >
                  {loading ? "Đang xử lý..." : "Đăng nhập"} <ArrowRight className="w-4 h-4 ml-2" />

                </Button>
              </form>
            </TabsContent>

            {/* --- FORM REGISTER --- */}
            <TabsContent value="register" className="space-y-6">
              <form
                onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
                className="space-y-6"
              >
                {/* 1. Avatar Upload (Optional) */}
                <div className="flex flex-col items-center gap-3">
                  <div
                    className="relative group cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Avatar className="w-24 h-24 border-4 border-slate-50 shadow-sm group-hover:border-blue-100 transition-all">
                      <AvatarImage src={avatarPreview || ""} className="object-cover" />
                      <AvatarFallback className="bg-slate-100 text-slate-400">
                        <Camera className="w-8 h-8" />
                      </AvatarFallback>
                    </Avatar>

                    {/* Icon dấu cộng nhỏ hoặc icon upload */}
                    <div className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full border-2 border-white shadow-sm">
                      <Upload className="w-3.5 h-3.5" />
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </div>
                  <span className="text-xs text-slate-400 font-medium">Ảnh đại diện (Không bắt buộc)</span>
                </div>

                {/* 2. Role Selection */}
                <div className="space-y-2">
                  <Label>Bạn là ai?</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div
                      onClick={() => handleRoleSelect("candidate")}
                      className={`
                        cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center gap-2 transition-all
                        ${role === "candidate" ? "border-blue-600 bg-blue-50 text-blue-700" : "border-slate-200 hover:border-blue-200 hover:bg-slate-50 text-slate-600"}
                      `}
                    >
                      <User className="w-6 h-6" />
                      <span className="text-sm font-bold">Ứng viên</span>
                    </div>

                    <div
                      onClick={() => handleRoleSelect("recruiter")}
                      className={`
                        cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center gap-2 transition-all
                        ${role === "recruiter" ? "border-blue-600 bg-blue-50 text-blue-700" : "border-slate-200 hover:border-blue-200 hover:bg-slate-50 text-slate-600"}
                      `}
                    >
                      <Briefcase className="w-6 h-6" />
                      <span className="text-sm font-bold">Nhà tuyển dụng</span>
                    </div>
                  </div>
                </div>

                {/* 3. Inputs */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullname">Họ và tên</Label>
                      <Input
                        id="fullname"
                        placeholder="Nguyễn Văn A"
                        {...registerForm.register("fullName")}
                        className="h-11"
                      />

                      {registerForm.formState.errors.fullName && (
                        <p className="text-xs text-red-500">
                          {registerForm.formState.errors.fullName.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-email">Email</Label>
                      <Input
                        id="reg-email"
                        placeholder="name@example.com"
                        {...registerForm.register("email")}
                        className="h-11"
                      />

                      {registerForm.formState.errors.email && (
                        <p className="text-xs text-red-500">
                          {registerForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reg-pass">Mật khẩu</Label>
                    <Input
                      id="reg-pass"
                      type="password"
                      placeholder="••••••••"
                      {...registerForm.register("password")}
                      className="h-11"
                    />

                    {registerForm.formState.errors.password && (
                      <p className="text-xs text-red-500">
                        {registerForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>
                </div>

                <Button className="w-full h-11 bg-blue-600 hover:bg-blue-700 font-semibold shadow-lg shadow-blue-600/20"
                  disabled={loading}

                >
                  {loading ? "Đang tạo tài khoản..." : "Tạo tài khoản mới"}

                </Button>
              </form>
            </TabsContent>
          </Tabs>

          {/* Social Login & Footer (Giữ nguyên) */}
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
              Google
            </Button>
            <Button variant="outline" className="h-11 border-slate-200 hover:bg-slate-50 hover:text-slate-900 font-normal">
              LinkedIn
            </Button>
          </div>

          <div className="text-center space-y-4">
            <p className="text-sm text-slate-500">
              Đã có tài khoản?{" "}
              <Link href="#" className="font-semibold text-blue-600 hover:underline">
                Đăng nhập
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}