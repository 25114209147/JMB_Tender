/**
 * Standardized Error Message Component
 * 
 * Usage:
 * ```tsx
 * import { ErrorMessage } from "@/components/ui/error-message"
 * 
 * if (error) return <ErrorMessage message={error} onRetry={refetch} />
 * ```
 */

import { AlertCircle } from "lucide-react"
import { Button } from "./button"

interface ErrorMessageProps {
  message: string
  title?: string
  onRetry?: () => void | Promise<void>
  className?: string
}

export function ErrorMessage({ 
  message, 
  title = "Something went wrong",
  onRetry,
  className = ""
}: ErrorMessageProps) {
  return (
    <div className={`flex h-[400px] items-center justify-center ${className}`}>
      <div className="text-center max-w-md">
        <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
        <h3 className="mt-4 text-lg font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>
        {onRetry && (
          <Button onClick={onRetry} className="mt-4" variant="outline">
            Try Again
          </Button>
        )}
      </div>
    </div>
  )
}
