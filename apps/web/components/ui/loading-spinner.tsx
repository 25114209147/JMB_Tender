/**
 * Standardized Loading Spinner Component
 * 
 * Usage:
 * ```tsx
 * import { LoadingSpinner } from "@/components/ui/loading-spinner"
 * 
 * if (loading) return <LoadingSpinner message="Loading..." />
 * ```
 */

import { Loader2 } from "lucide-react"

interface LoadingSpinnerProps {
  message?: string
  size?: "sm" | "md" | "lg"
  className?: string
}

export function LoadingSpinner({ 
  message = "Loading...", 
  size = "md",
  className = ""
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12"
  }

  return (
    <div className={`flex h-[400px] items-center justify-center ${className}`}>
      <div className="flex flex-col items-center gap-2">
        <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
        {message && (
          <p className="text-sm text-muted-foreground">{message}</p>
        )}
      </div>
    </div>
  )
}
