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
            <div className="hidden lg:flex lg:flex-col lg:justify-center lg:backdrop-blur-md lg:bg-gradient-to-br lg:from-[#283754] lg:via-[#283754]/95 lg:to-[#283754]/35">
                <div className="mx-auto max-w-md space-y-6 text-center">
                    <Link href="/" className="flex items-center justify-center gap-2 mb-2">
                        <div className="flex flex-col items-center justify-center gap-2">
                            <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-primary">
                                <Building2 className="h-16 w-16 text-primary-foreground" />
                            </div>
                            <span className="text-4xl font-bold text-white">JMB Tender System</span>
                        </div>
                    </Link>
                    <p className="text-medium text-white/70">
                        Transparency in Management,<br />
                        Excellence in Living.
                    </p>


                    {/* <div className="space-y-4 pt-8">
            <div className="rounded-lg border bg-card p-6 text-left shadow-sm">
              <h3 className="font-semibold mb-2">For JMB Member</h3>
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
          </div> */}
                </div>
            </div>
            <div className="flex items-center justify-center py-12">
                <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
                    {children}
                </div>
            </div>
        </div>
    );
}