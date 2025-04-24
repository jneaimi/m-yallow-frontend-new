"use client";

import { useEffect, useState } from "react";
import { useTheme as useNextTheme } from "next-themes";

export type Theme = "light" | "dark" | "system";

export function useTheme() {
  const { theme, setTheme, resolvedTheme, systemTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);

  // After mounting, we have access to the theme
  useEffect(() => {
    setMounted(true);
  }, []);

  // Toggle between light and dark themes
  const toggleTheme = () => {
    if (!mounted) return;
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  // Set a specific theme
  const setThemeWithFallback = (newTheme: Theme) => {
    if (!mounted) return;
    setTheme(newTheme);
  };

  return {
    theme: theme as Theme | undefined,
    setTheme: setThemeWithFallback,
    resolvedTheme: mounted ? resolvedTheme as "light" | "dark" | undefined : undefined,
    systemTheme: mounted ? systemTheme as "light" | "dark" | undefined : undefined,
    toggleTheme,
    mounted,
  };
}
