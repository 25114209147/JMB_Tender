import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user"
import {useRole} from "@/contexts/role-context"

export default function LandingPageHeroSection() {
    const { user } = useCurrentUser()
    const { role } = useRole()

    const getDashboardPath = () => {
        if (role === "admin") return "/dashboard/admin"
        if (role === "JMB") return "/dashboard/JMB"
        if (role === "contractor") return "/dashboard/contractor"
    }

    return (
        <section className="flex-1">
            <div className="flex flex-col items-center justify-center px-6 py-10 md:py-20 text-center">
                <div className="max-w-3xl">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                        Malaysia’s Centralized Tender Platform
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground mb-6">
                        Post tenders, manage submissions, and find the right partners
                        <br/>
                        <span className="font-semibold">All in one place.</span>
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        { !user ? (
                            <Button asChild size="lg" className="md:sm text-white bg-primary !text-white hover:bg-primary/90">
                                <Link href="/register">Get Started</Link>
                            </Button>
                        ):
                         (
                            <Button asChild size="lg" className="md:sm text-white bg-primary !text-white hover:bg-primary/90">
                                <Link href={getDashboardPath() || "/dashboard"}>Go to Dashboard</Link>
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