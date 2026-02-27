"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  type RegisterFormErrors,
  validateRegisterForm,
} from "@/data/auth/auth-form-validation"
import { RegisterFormData, UserType, USER_TYPE_OPTIONS } from "@/data/auth/auth-form"
import { PasswordInput } from "./shared/password-input"
import { PasswordStrength } from "./shared/password-strength"
import { PasswordMatchIndicator } from "./shared/password-match-indicator"
import { GoogleButton } from "./shared/google-button"
import { FormDivider } from "./shared/form-divider"
import { FieldError } from "./shared/field-error"
import { register } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { ApiClientError } from "@/lib/api"

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [userType, setUserType] = useState<UserType>("contractor")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errors, setErrors] = useState<RegisterFormErrors>({})
  const [apiError, setApiError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})
    setApiError(null)
    
    const formData = new FormData(e.currentTarget)
    const registerData: RegisterFormData = {
      userType,
      name: formData.get("name") as string,
      companyName: formData.get("companyName") as string,
      email: formData.get("email") as string,
      password,
      confirmPassword,
    }

    const validation = validateRegisterForm(registerData)
    
    if (!validation.isValid) {
      setErrors(validation.errors)
      setIsLoading(false)
      return
    }

    try {
      const response = await register(registerData)
      if (response.user?.role === "JMB"){
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
        setApiError("Registration failed. Please try again.")
      }
      setIsLoading(false)
    }
  }

  return (
    <Card {...props}>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Create an account</CardTitle>
        <CardDescription>Enter your information to get started</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup className="gap-4">
            {apiError && (
              <div className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {apiError}
              </div>
            )}
            
            {/* User Type Selection */}
            <Field>
              <FieldLabel>I am a</FieldLabel>
              <RadioGroup value={userType} onValueChange={(value) => setUserType(value as UserType)}>
                <div className="grid grid-cols-2 gap-2">
                  {USER_TYPE_OPTIONS.map((option) => (
                    <div key={option.value} className="relative">
                      <RadioGroupItem value={option.value} id={option.value} className="peer sr-only" />
                      <Label
                        htmlFor={option.value}
                        className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary-700 [&:has([data-state=checked])]:border-primary-700 cursor-pointer"
                      >
                        <span className="text-sm font-medium">{option.label}</span>
                        <span className="text-xs text-muted-foreground">{option.description}</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </Field>

            <Field>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                required
                autoComplete="name"
                disabled={isLoading}
                aria-invalid={!!errors.name}
              />
              <FieldError error={errors.name} />
            </Field>

            {userType === "contractor" && (
              <Field>
                <FieldLabel htmlFor="companyName">Company Name</FieldLabel>
                <Input
                  id="companyName"
                  name="companyName"
                  placeholder="ABC Construction Sdn Bhd"
                  required
                  autoComplete="organization"
                  disabled={isLoading}
                  aria-invalid={!!errors.companyName}
                />
                <FieldError error={errors.companyName} />
              </Field>
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
              <FieldError error={errors.email} />
            </Field>

            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <PasswordInput
                id="password"
                name="password"
                required
                autoComplete="new-password"
                disabled={isLoading}
                aria-invalid={!!errors.password}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <PasswordStrength password={password} />
              <FieldError error={errors.password} />
            </Field>

            <Field>
              <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
              <PasswordInput
                id="confirm-password"
                name="confirmPassword"
                required
                autoComplete="new-password"
                disabled={isLoading}
                aria-invalid={!!errors.confirmPassword}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <PasswordMatchIndicator password={password} confirmPassword={confirmPassword} />
              <FieldError error={errors.confirmPassword} />
            </Field>

            <Field>
              <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create account"
                )}
              </Button>
            </Field>

            {/* <FormDivider />

            <Field>
              <GoogleButton disabled={isLoading} text="Sign up with Google" />
            </Field> */}

            <FieldDescription className="text-center">
              Already have an account?{" "}
              <Link href="/login" className="text-primary underline-offset-2 hover:underline font-semibold">
                Sign in
              </Link>
            </FieldDescription>

            {/* <FieldDescription className="text-center text-xs">
              By creating an account, you agree to our{" "}
              <Link href="/terms" className="underline-offset-4 hover:underline">Terms of Service</Link>
              {" "}and{" "}
              <Link href="/privacy" className="underline-offset-4 hover:underline">Privacy Policy</Link>
            </FieldDescription> */}
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
