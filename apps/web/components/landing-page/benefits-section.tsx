// components/landing/BenefitsSection.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle2, BarChart3, FileText, Users, ShieldCheck, Bell } from "lucide-react";

export function BenefitsSection() {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* JMB Benefits */}
          <div className="space-y-10">
            <h2 className="text-4xl md:text-5xl font-bold">Built for JMB Members</h2>

            <div className="space-y-8">
              {[
                {
                  icon: ShieldCheck,
                  title: "Act 757 Compliance",
                  desc: "Full transparency and audit-ready records for strata management compliance.",
                },
                {
                  icon: BarChart3,
                  title: "Smart Bid Comparison",
                  desc: "Side-by-side view of price, experience, methodology & timeline.",
                },
                {
                  icon: FileText,
                  title: "Secure Document Vault",
                  desc: "All tenders, bids and contracts stored safely with role-based access.",
                },
                {
                  icon: Users,
                  title: "Reach Verified Contractors",
                  desc: "Only SSM-registered contractors can submit bids.",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2">{item.title}</h4>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button size="lg" className="mt-4" asChild>
              <Link href="/register/jmb">Register as JMB Member</Link>
            </Button>
          </div>

          {/* Contractor Benefits */}
          <div className="space-y-10 lg:order-first">
            <h2 className="text-4xl md:text-5xl font-bold">Built for Contractors</h2>

            <div className="space-y-8">
              {[
                {
                  icon: Bell,
                  title: "Instant Tender Alerts",
                  desc: "Get notified the moment a matching tender is posted.",
                },
                {
                  icon: FileText,
                  title: "One-Click Download",
                  desc: "Access full tender documents instantly — no email chasing.",
                },
                {
                  icon: CheckCircle2,
                  title: "Easy Bid Submission",
                  desc: "Submit via simple form or upload your full proposal.",
                },
                {
                  icon: ShieldCheck,
                  title: "Only Verified JMBs",
                  desc: "Work with legitimate, SSM-verified JMBs only.",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2">{item.title}</h4>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button variant="outline" size="lg" className="mt-4" asChild>
              <Link href="/register/contractor">Register as Contractor</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}