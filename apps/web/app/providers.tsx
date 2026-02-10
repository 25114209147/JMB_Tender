"use client";

import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"              // Adds 'class="dark"' to <html>
      defaultTheme="system"          // Use system preference by default
      enableSystem                   // Enable system preference detection
      enableColorScheme              // Adds color-scheme to document element
      disableTransitionOnChange      // Prevent CSS transitions during theme switch
      storageKey="jmb-tender-theme"  // Custom localStorage key
    >
      {children}
    </ThemeProvider>
  );
}