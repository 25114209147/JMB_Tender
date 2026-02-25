import { LoginForm } from "@/components/auth/login-form"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your account",
}

export default function Page() {
  return (
    <div className="mx-auto w-full max-w-sm">
      <LoginForm />
    </div>
  )
}
