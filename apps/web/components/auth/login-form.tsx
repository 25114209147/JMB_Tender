"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { validateLoginForm, type LoginFormErrors } from "@/data/auth/auth-form-validation"
import { LoginFormData } from "@/data/auth/auth-form"
import { PasswordInput } from "./shared/password-input"
import { GoogleButton } from "./shared/google-button"
import { FormDivider } from "./shared/form-divider"
import { FieldError } from "./shared/field-error"
import { login } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { ApiClientError } from "@/lib/api"
import { Checkbox } from "@/components/ui/checkbox"
import { useUser } from "@/contexts/user-context"

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const router = useRouter()
  const { refetch } = useUser()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<LoginFormErrors>({})
  const [apiError, setApiError] = useState<string | null>(null)
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})
    setApiError(null)
    
    const formData = new FormData(e.currentTarget)
    const loginData: LoginFormData = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      rememberMe: rememberMe,
    }

    const validation = validateLoginForm(loginData)
    
    if (!validation.isValid) {
      setErrors(validation.errors)
      setIsLoading(false)
      return
    }

    try {
      // Refetch user data after successful login
      await refetch()
      
      const response = await login(loginData)
      
      if (response.user.role === "JMB" || response.user.role === "JMB") {
        router.push("/JMB/dashboard")
      } else if (response.user?.role === "contractor") {
        router.push("/contractor/dashboard")
      } else {
        router.push("/admin/dashboard")
      }
    } catch (error) {
      if (error instanceof ApiClientError) {
        setApiError(error.detail)
      } else {
        setApiError("Login failed. Please try again.")
      }
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              {apiError && (
                <div className="mb-4 rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {apiError}
                </div>
              )}
              
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  autoComplete="email"
                  disabled={isLoading}
                  aria-invalid={!!errors.email}
                />
                <FieldError error={errors.email} id="email-error" />
              </Field>
              
              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Link href="/forgot-password" className="text-sm text-primary underline-offset-4 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <PasswordInput
                  id="password"
                  name="password"
                  required
                  autoComplete="current-password"
                  disabled={isLoading}
                  aria-invalid={!!errors.password}
                />
                <FieldError error={errors.password} id="password-error" />
              </Field>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="remember-me" 
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                  disabled={isLoading}
                  className="cursor-pointer"
                />
                <label
                  htmlFor="remember-me"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Remember me 
                </label>
              </div>

              <Field>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </Field>
              

              <FormDivider />

              <Field>
                <GoogleButton disabled={isLoading} text="Sign in with Google" />
              </Field>

              <FieldDescription className="text-center">
                Don't have an account?{" "}
                <Link href="/register" className="text-primary underline-offset-4 hover:underline font-medium cursor-pointer">
                  Sign up
                </Link>
              </FieldDescription>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
