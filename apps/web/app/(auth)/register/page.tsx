import { SignupForm } from "@/components/auth/register-form"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Register",
  description: "Create a new account",
}

export default function Page() {
  return (
    <div className="mx-auto w-full max-w-sm">
      <SignupForm />
    </div>
  )
}
