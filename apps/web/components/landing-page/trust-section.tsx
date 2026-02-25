// components/landing/TrustSection.tsx
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, FileText, Lock, CheckCircle2 } from "lucide-react";

const trustItems = [
  {
    icon: ShieldCheck,
    title: "SSM Verified",
    desc: "All users verified via SSM registration for maximum trust.",
  },
  {
    icon: FileText,
    title: "Act 757 Compliant",
    desc: "Designed in full compliance with Strata Management Act 2013.",
  },
  {
    icon: Lock,
    title: "Secure & Encrypted",
    desc: "All documents stored with role-based access and encryption.",
  },
  {
    icon: CheckCircle2,
    title: "No Hidden Fees",
    desc: "Free registration and basic use — transparent pricing only.",
  },
];

export function TrustSection() {
  return (
    <section className="py-20 md:py-32 bg-muted/40">
      <div className="container mx-auto px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-16">Built for Trust & Compliance</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 max-w-6xl mx-auto">
          {trustItems.map((item, i) => (
            <Card key={i} className="border-primary/10">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <item.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}