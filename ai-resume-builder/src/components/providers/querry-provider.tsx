"use client"; // Bắt buộc phải là Client Component

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  // Khởi tạo QueryClient trong useState để tránh việc tạo mới 
  // mỗi khi Provider re-render trong Next.js
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Cấu hình mặc định nếu bạn muốn áp dụng cho toàn bộ app
            staleTime: Infinity, 
            gcTime: Infinity,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}