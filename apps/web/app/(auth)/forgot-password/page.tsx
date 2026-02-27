"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { ArrowLeft, CheckCircle2, Loader2, Mail } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    
    const formData = new FormData(e.currentTarget)
    const emailValue = formData.get("email") as string

    // Basic validation
    if (!emailValue || !/\S+@\S+\.\S+/.test(emailValue)) {
      setError("Please enter a valid email address")
      setIsLoading(false)
      return
    }

    // TODO: Implement actual password reset logic
    await new Promise(resolve => setTimeout(resolve, 1500))
    setEmail(emailValue)
    setIsSubmitted(true)
    setIsLoading(false)
  }

  if (isSubmitted) {
    return (
      <div className="mx-auto max-w-sm space-y-6">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
              <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl">Check your email</CardTitle>
            <CardDescription>
              We&apos;ve sent a password reset link to
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted p-3 text-center">
              <p className="text-sm font-medium break-all">{email}</p>
            </div>
            
            <Alert>
              <Mail className="h-4 w-4" />
              <AlertTitle>Didn&apos;t receive the email?</AlertTitle>
              <AlertDescription className="text-sm">
                Check your spam folder or{" "}
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="underline underline-offset-4 hover:text-primary font-medium"
                >
                  try another email address
                </button>
              </AlertDescription>
            </Alert>

            <div className="pt-4">
              <Link href="/login">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-sm space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Reset your password</CardTitle>
          <CardDescription>
            Enter your email address and we&apos;ll send you a link to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
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
                  autoFocus
                />
                {error && (
                  <p className="text-sm text-destructive mt-1">{error}</p>
                )}
              </Field>

              <Field>
                <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending reset link...
                    </>
                  ) : (
                    "Send reset link"
                  )}
                </Button>
              </Field>

              <FieldDescription className="text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1 text-primary underline-offset-4 hover:underline font-medium"
                >
                  <ArrowLeft className="h-3 w-3" />
                  Back to login
                </Link>
              </FieldDescription>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="space-y-2 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Need help?</p>
            <p>
              If you&apos;re having trouble resetting your password, please contact our support team at{" "}
              <a href="mailto:support@tenderplatform.com" className="text-primary underline-offset-4 hover:underline">
                support@tenderplatform.com
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
