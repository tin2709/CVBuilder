"use client";
import Link from "next/link";
import { useState } from "react";
import { 
  Menu, LogOut, User as UserIcon, Briefcase, ChevronDown, Globe 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Trans } from "@lingui/react/macro";
import { useLingui } from "@lingui/react";

// Định nghĩa các ngôn ngữ hỗ trợ
const languages = {
  vi: { label: "Tiếng Việt", flag: "🇻🇳" },
  en: { label: "English", flag: "🇺🇸" },
};

interface HeaderProps {
  user: any;
  handleLogout: () => void;
}

export function Header({ user, handleLogout }: HeaderProps) {
  const { i18n } = useLingui();
  const currentLocale = i18n.locale as keyof typeof languages;

  const handleChangeLanguage = (locale: string) => {
    // Trong thực tế, bạn sẽ gọi hàm để load catalog và activate locale
    // Ví dụ: i18n.activate(locale)
    console.log("Đổi sang ngôn ngữ:", locale);
    // Nếu dùng Next.js, thường bạn sẽ redirect hoặc update cookie
    window.location.search = `?lang=${locale}`; 
  };

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 bg-white border-b border-slate-200 lg:px-10">
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="size-8 text-[#136dec]">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
               <path d="M42.17 20.17L27.82 5.82C29.13 7.13 28.4 10.18 26.2 13.76C24.85 15.95 22.96 18.34 20.65 20.65C18.34 22.96 15.95 24.85 13.76 26.2C10.18 28.4 7.13 29.13 5.82 27.82L20.17 42.17C21.48 43.48 24.53 42.74 28.11 40.54C30.3 39.2 32.7 37.3 35 35C37.3 32.7 39.2 30.3 40.54 28.11C42.74 24.53 43.48 21.48 42.17 20.17Z" fill="currentColor"/>
            </svg>
          </div>
          <h2 className="text-lg font-bold tracking-tight text-slate-900">SmartRecruit AI</h2>
        </Link>
      </div>

      <div className="hidden items-center gap-6 lg:flex">
        <nav className="flex gap-7 text-sm font-medium">
          <Link href="#" className="text-slate-700 transition-colors hover:text-[#136dec]">
            <Trans>Việc làm</Trans>
          </Link>
          <Link href="#" className="font-bold text-[#136dec]">
            <Trans>Tạo CV</Trans>
          </Link>
          <Link href="#" className="text-slate-700 transition-colors hover:text-[#136dec]">
            <Trans>Blog</Trans>
          </Link>
        </nav>

        <div className="h-6 w-px bg-slate-200 mx-2" />

        {/* Nút đổi ngôn ngữ */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="flex items-center gap-2 h-9 px-2">
              <span className="text-lg">{languages[currentLocale]?.flag || "🇻🇳"}</span>
              <span className="text-xs font-bold uppercase">{currentLocale}</span>
              <ChevronDown className="size-3 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            {Object.entries(languages).map(([code, { label, flag }]) => (
              <DropdownMenuItem 
                key={code} 
                onClick={() => handleChangeLanguage(code)}
                className="flex items-center gap-3 cursor-pointer"
              >
                <span className="text-base">{flag}</span>
                <span className={currentLocale === code ? "font-bold" : ""}>{label}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {user ? (
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative size-10 overflow-hidden rounded-full border-2 border-[#136dec] transition-transform hover:scale-105 outline-none">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt="avatar" className="size-full object-cover" />
                  ) : (
                    <div className="size-full bg-blue-100 flex items-center justify-center text-[#136dec] font-bold">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-2">
                <DropdownMenuLabel><Trans>Tài khoản của tôi</Trans></DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <UserIcon className="mr-2 h-4 w-4" /> <Trans>Hồ sơ cá nhân</Trans>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                  <LogOut className="mr-2 h-4 w-4" /> <Trans>Đăng xuất</Trans>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <Link href="/auth">
            <Button className="h-10 px-4 text-sm font-bold text-white bg-[#136dec] hover:bg-blue-600 rounded-lg">
              <Trans>Đăng nhập</Trans>
            </Button>
          </Link>
        )}
      </div>

      <Button variant="ghost" size="icon" className="lg:hidden">
        <Menu className="size-6" />
      </Button>
    </header>
  );
}