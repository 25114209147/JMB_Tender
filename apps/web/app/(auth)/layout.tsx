import { Metadata } from "next";
import Link from "next/link";
import { Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

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
                    <LogoSection textColor="text-white" subTextColor="text-white/70" />

                </div>
            </div>
            <div className="flex flex-col items-center justify-center py-12">
                <div className="lg:hidden mb-8 text-center">
                    <LogoSection textColor="text-primary" subTextColor="text-muted-foreground" />
                </div>

                <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
                    {children}
                </div>
            </div>
        </div>
    );
}

function LogoSection({ textColor, subTextColor }: { textColor: string; subTextColor: string }) {
    return (
        <div className="mx-auto max-w-md space-y-4 text-center">
            <Link href="/" className="flex flex-col items-center justify-center gap-2 mb-2">
                <div className="flex h-16 w-16 lg:h-24 lg:w-24 items-center justify-center rounded-lg bg-primary">
                    <Building2 className="h-10 w-10 lg:h-16 lg:w-16 text-primary-foreground" />
                </div>
                <span className={cn("text-2xl lg:text-4xl font-bold", textColor)}>
                    JMB Tender System
                </span>
            </Link>
            <p className={cn("hidden lg:block text-sm lg:text-medium", subTextColor)}>
                Transparency in Management,<br />
                Excellence in Living.
            </p>
        </div>
    );
}