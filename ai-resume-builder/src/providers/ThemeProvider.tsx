"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import * as DarkReader from "darkreader";
import { useReactiveStorage } from "@/hooks/use-reactive-storage";
import { themeStorage } from "@/lib/reactive-storage";

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useReactiveStorage(themeStorage);
  const isDarkMode = theme === "dark";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Chỉ set fetch method ở client
    if (typeof window !== 'undefined') {
      DarkReader.setFetchMethod(window.fetch);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Chỉ thực hiện logic DarkReader khi đã mounted ở client
    if (isDarkMode) {
      DarkReader.enable({
        brightness: 100,
        contrast: 95,
        sepia: 0,
      });
    } else {
      DarkReader.disable();
    }
  }, [isDarkMode, mounted]);

  const toggleTheme = () => {
    const nextTheme = isDarkMode ? "light" : "dark";
    themeStorage.set(nextTheme);
  };

  // Tránh render nội dung con khi chưa mounted để tránh lỗi lệch giao diện (Hydration)
  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <div style={{ visibility: mounted ? 'visible' : 'hidden' }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};