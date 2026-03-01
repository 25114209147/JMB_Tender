"use client"

import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from "lucide-react"
import { forwardRef, useState } from "react"

interface PasswordInputProps extends Omit<React.ComponentProps<typeof Input>, "type"> {
  id: string
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ id, className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)

    return (
      <div className="relative">
        <Input
          ref={ref}
          id={id}
          type={showPassword ? "text" : "password"}
          className={`pr-10 ${className || ""}`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
          tabIndex={-1}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    )
  }
)

PasswordInput.displayName = "PasswordInput"
