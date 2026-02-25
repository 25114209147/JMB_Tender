"use client"

import { Building2 } from "lucide-react"
import Link from "next/link"
import { ThemeToggleButton } from "../ui/theme-toggle-button"
import { Button } from "../ui/button"

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur w-full supports-[backdrop-filter]:bg-background/60">
      <div className="px-6 mx-auto flex h-16 items-center justify-between">
        
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Building2 className="h-4 w-4" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            <span className="md:hidden">JMB</span>
            <span className="hidden md:inline">JMB Tender System</span>
          </span>
        </Link>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <ThemeToggleButton />
          </div>

          {/* <Button variant="ghost" asChild className="hidden sm:flex">
            <Link href="/login">Login</Link>
          </Button> */}

          <Button asChild size="sm" className="md:sm text-white bg-primary !text-white hover:bg-primary/90">
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}