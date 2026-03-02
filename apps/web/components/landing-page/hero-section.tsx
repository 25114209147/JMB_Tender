import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user"
import { useRole } from "@/contexts/role-context"
import { ArrowRight } from "lucide-react"

export default function LandingPageHeroSection() {
    const { user } = useCurrentUser()
    const { role } = useRole()

    const getDashboardPath = () => {
        if (role === "admin") return "/dashboard/admin"
        if (role === "JMB") return "/dashboard/JMB"
        if (role === "contractor") return "/dashboard/contractor"
    }

    return (
        <section className="relative flex-1 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/30" />
            
            <div className="relative flex flex-col items-center justify-center px-6 py-14 md:py-22 lg:py-32 text-center">
                <div className="max-w-4xl mx-auto space-y-8">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight">
                        Malaysia's Centralized Tender
                        <br />
                        <span className="text-primary">Management Platform</span>
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground mb-2">
                        Post tenders, manage submissions, and find the right partners
                        <br/>
                        <span className="font-semibold">All in one place.</span>
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        {!user ? (
                            <>
                                <Button asChild size="lg" variant="CTA" className="group h-12 px-8 text-base font-semibold">
                                    <Link href="/register" className="flex items-center gap-2 !text-white">
                                        Get Started
                                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                </Button>
                                {/* <Button asChild size="lg" variant="CTA" className="h-12 px-8 text-base font-semibold">
                                    <Link href="/login" className="!text-white">Sign In</Link>
                                </Button> */}
                            </>
                        ) : (
                            <Button asChild size="lg" className="group h-12 px-8 text-base font-semibold text-white">
                                <Link href={getDashboardPath() || "/dashboard"} className="flex items-center gap-2 text-white">
                                    Go to Dashboard
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </Button>
                        )}
                    </div>
                    {/* <p className="mt-4 text-sm text-muted-foreground">
                        Free to join • No hidden fees • SSM verification required
                    </p> */}
                </div>
            </div>
        </section>
    )
}
