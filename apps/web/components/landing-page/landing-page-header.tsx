"use client"

import { Building2 } from "lucide-react"
import Link from "next/link"
import { ThemeToggleButton } from "../ui/theme-toggle-button"
import { Button } from "../ui/button"
import { useCurrentUser } from "@/hooks/use-current-user"

export function LandingHeader() {
  const { user } = useCurrentUser()
  
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto px-6 flex h-16 items-center justify-between max-w-7xl">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2.5 group transition-opacity hover:opacity-80">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <Building2 className="h-5 w-5" />
          </div>
          <span className="text-xl font-semibold tracking-tight text-foreground">
            <span className="md:hidden">JMB</span>
            <span className="hidden md:inline">JMB Tender System</span>
          </span>
        </Link>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <ThemeToggleButton />
          </div>

          {/* Only show login button if user is not authenticated */}
          {!user && (
            <Button asChild size="sm" variant="default">
              <Link href="/login" className="!text-white">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
