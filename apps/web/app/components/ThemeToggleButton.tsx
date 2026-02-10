"use client";

import { useTheme } from 'next-themes';
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from 'react';

/**
 * ThemeToggleButton - Reusable dark mode toggle button
 * 
 * Features:
 * - Uses next-themes for zero-flash dark mode
 * - Shows sun icon in dark mode (click to switch to light)
 * - Shows moon icon in light mode (click to switch to dark)
 * - Handles SSR/hydration with mounted state
 * - Smooth transitions and hover effects
 * 
 * Fallback Strategy:
 * 1. Shows placeholder during SSR to prevent hydration mismatch
 * 2. Renders actual button after client-side mount
 * 3. Gracefully handles theme resolution
 * 
 * Usage:
 * ```tsx
 * <ThemeToggleButton />
 * ```
 */
export function ThemeToggleButton() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Only render after mounting to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Show placeholder during SSR/hydration to prevent layout shift
  if (!mounted) {
    return (
      <div 
        className="w-10 h-10 rounded-full bg-white border border-gray-200 dark:border-gray-700 dark:bg-gray-800"
        aria-hidden="true"
      />
    );
  }

  // Resolve the actual theme being displayed
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDark = currentTheme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="flex h-10 w-10 items-center justify-center rounded-full border bg-white text-gray-600 transition hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Current theme: ${theme}${theme === 'system' ? ` (${systemTheme})` : ''}`}
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}