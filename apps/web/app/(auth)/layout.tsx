import { Metadata } from "next";
import Link from "next/link";
import { Building2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Sign in or create an account",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center justify-center gap-2 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Building2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Tender Platform</span>
          </Link>

          {children}
        </div>
      </div>

      {/* Right Side - Branding/Image */}
      <div className="hidden lg:flex lg:flex-col lg:justify-center lg:bg-gradient-to-br lg:from-primary/10 lg:via-primary/5 lg:to-background lg:p-12">
        <div className="mx-auto max-w-md space-y-6 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">
              Welcome to Tender Platform
            </h2>
            <p className="text-lg text-muted-foreground">
              Streamline your tendering process with our comprehensive management system
            </p>
          </div>
          
          <div className="space-y-4 pt-8">
            <div className="rounded-lg border bg-card p-6 text-left shadow-sm">
              <h3 className="font-semibold mb-2">For JMB & Property Owners</h3>
              <p className="text-sm text-muted-foreground">
                Create, publish, and manage tenders efficiently. Track bids and make informed decisions.
              </p>
            </div>
            
            <div className="rounded-lg border bg-card p-6 text-left shadow-sm">
              <h3 className="font-semibold mb-2">For Contractors</h3>
              <p className="text-sm text-muted-foreground">
                Browse available tenders, submit competitive bids, and grow your business.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}