"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Search } from "lucide-react"
import { ThemeToggleButton } from "../ui/theme-toggle-button"
import { NavUser } from "@/components/layout/nav-user"
import { sidebarData } from "@/data/sidebar-data"
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group"
import { useEffect, useRef } from "react"

export function AppHeader() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const isMac = typeof navigator !== "undefined" && navigator.platform.includes("Mac");

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur w-full supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-12 items-center justify-between md:h-14 lg:h-16">
        {/* Left section: Toggle button and Search */}
        <div className="flex flex-row items-center sm:gap-3 md:gap-4 flex-1 min-w-0">
          <SidebarTrigger className=" flex-shrink-0" />
          <div className="hidden sm:block flex-1 max-w-md">
            <InputGroup className="w-full">
              <InputGroupInput 
                ref={inputRef} 
                placeholder="Search..." 
                className="w-full"
              />
              <InputGroupAddon>
                <Search className="h-4 w-4" />
              </InputGroupAddon>
              <InputGroupAddon align="inline-end">
              <kbd className="pointer-events-none rounded border bg-muted px-1.5 py-0.5 text-[10px]">
                ⌘
              </kbd>
              <kbd className="pointer-events-none rounded border bg-muted px-1.5 py-0.5 text-[10px]">
                K
              </kbd>
              </InputGroupAddon>
            </InputGroup>
          </div>
        </div>
        
        {/* Right section: Theme toggle and User */}
        <div className="flex flex-row items-center gap-2 sm:gap-3 md:gap-4 flex-shrink-0">
          <ThemeToggleButton />
          <NavUser user={sidebarData.user} hideTextOnMobile={true} />
        </div>
      </div>
    </header>
  )
}