// components/landing/FinalCtaSection.tsx
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CtaSection() {
  return (
    <section className="py-20 md:py-32 bg-primary text-white">
      <div className="container mx-auto px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Ready to Digitize Your Tender Process?
        </h2>
        <p className="text-xl mb-10 max-w-3xl mx-auto opacity-90">
          Join Malaysia’s leading JMB tender platform — secure, compliant, and free to start.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Button size="lg" variant="secondary" className="h-16 px-12 text-xl font-semibold" asChild>
            <Link href="/register/jmb">Register as JMB Member</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-16 px-12 text-xl font-semibold border-white text-white hover:bg-white/10"
            asChild
          >
            <Link href="/register/contractor">Register as Contractor</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}