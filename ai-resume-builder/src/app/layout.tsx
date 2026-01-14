import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Import các Provider
import QueryProvider from "@/providers/querry-provider";
import { ThemeProvider } from "@/providers/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SmartRecruit AI | Nền tảng tuyển dụng thông minh",
  description: "Tạo CV chuyên nghiệp và tìm kiếm việc làm với sức mạnh AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning> 
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* 
            Quy tắc: Provider nào cung cấp dữ liệu cơ bản nhất (như API Query) 
            thường bọc ngoài cùng. 
        */}
        <QueryProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}