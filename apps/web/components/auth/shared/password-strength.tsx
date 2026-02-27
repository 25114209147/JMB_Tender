"use client"

import { CheckCircle2, XCircle } from "lucide-react"
import { getPasswordStrength } from "@/data/auth/auth-form-validation"

const requirements = [
  { key: "hasLength", label: "At least 8 characters" },
  { key: "hasUpper", label: "Upper and lowercase letters", check: (s: ReturnType<typeof getPasswordStrength>) => s.hasUpper && s.hasLower },
  { key: "hasNumber", label: "At least one number" },
  { key: "hasSpecial", label: "Special character (!@#$%...)" },
] as const

export function PasswordStrength({ password }: { password: string }) {
  if (!password) return null
  
  const strength = getPasswordStrength(password)

  return (
    <div className="mt-1 text-xs">
      {requirements.map((req) => {
        const { key, label } = req
        const isValid = 'check' in req ? req.check(strength) : strength[key]
        return (
          <div key={key} className="flex items-center gap-1">
            {isValid ? (
              <CheckCircle2 className="h-3 w-3 text-green-700" />
            ) : (
              <XCircle className="h-3 w-3 text-muted-foreground" />
            )}
            <span className={isValid ? "text-green-700" : "text-muted-foreground"}>
              {label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
