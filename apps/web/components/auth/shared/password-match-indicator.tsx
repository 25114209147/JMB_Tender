"use client"

import { CheckCircle2, XCircle } from "lucide-react"

export function PasswordMatchIndicator({ 
  password, 
  confirmPassword 
}: { 
  password: string
  confirmPassword: string 
}) {
  if (!confirmPassword) return null
  
  const match = password === confirmPassword

  return (
    <div className="flex items-center gap-2 mt-1">
      {match ? (
        <>
          <CheckCircle2 className="h-3 w-3 text-green-700" />
          <span className="text-xs text-green-700">Passwords match</span>
        </>
      ) : (
        <>
          <XCircle className="h-3 w-3 text-destructive" />
          <span className="text-xs text-destructive">Passwords do not match</span>
        </>
      )}
    </div>
  )
}
