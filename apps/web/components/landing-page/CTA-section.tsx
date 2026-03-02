import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useRole } from "@/contexts/role-context";
import { ArrowRight } from "lucide-react";

export function CtaSection() {
    const { user } = useCurrentUser()
    const { role } = useRole()
    
    const getDashboardPath = () => {
        if (role === "admin") return "/dashboard/admin"
        if (role === "JMB") return "/dashboard/JMB"
        if (role === "contractor") return "/dashboard/contractor"
        return "/dashboard"
    }

  return (
    <section className="py-20 md:py-32 bg-primary dark:bg-slate-900 border-t dark:border-slate-800 text-white transition-colors duration-300">
      <div className="container mx-auto px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 dark:text-slate-50">
          Ready to Digitize Your Tender Process?
        </h2>
        <p className="text-xl mb-10 max-w-3xl mx-auto opacity-90 dark:text-slate-300">
          Join Malaysia’s leading JMB tender platform — secure, compliant, and free to start.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
           { !user ? (
            <Button 
              asChild 
              size="lg" 
              variant="CTA" 
              // AMENDED: Matches your request (group, h-16 for hero feel, font-semibold)
              className="group h-16 px-12 text-xl font-semibold transition-all duration-300"
            >
                <Link href="/register" className="flex items-center gap-2 !text-white">
                    Join Now
                    {/* The icon that moves on hover */}
                    <ArrowRight className="h-6 w-6 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
            </Button>
            ) : (
              <Button 
                asChild
                size="lg" 
                variant="CTA" 
                className="group h-16 px-12 text-xl font-semibold text-primary-foreground dark:bg-primary dark:text-white dark:hover:bg-primary/90 transition-all duration-300" 
              >
                <Link href={getDashboardPath()} className="flex items-center gap-2">
                  Go to Dashboard 
                  <ArrowRight className="h-6 w-6 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
            )}
        </div>
      </div>
    </section>
  );
}