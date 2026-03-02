import { ShieldCheck, Lock, CheckCircle2 } from "lucide-react";

const trustItems = [
  {
    icon: ShieldCheck,
    title: "SSM Verified",
    desc: "All users verified via SSM registration for maximum trust and compliance.",
  },
  {
    icon: Lock,
    title: "Secure & Encrypted",
    desc: "All documents stored with role-based access and enterprise-grade encryption.",
  },
  {
    icon: CheckCircle2,
    title: "No Hidden Fees",
    desc: "Free registration and basic use — transparent pricing with no surprises.",
  },
];

export function TrustSection() {
  return (
    <section className="py-20 md:py-28 bg-background border-y">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-foreground">
            Built for Trust & Security
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Enterprise-grade security and compliance for your tender management needs
          </p>
        </div>

        {/* Trust Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {trustItems.map((item, i) => (
            <div 
              key={i} 
              className="flex flex-col items-center text-center p-6 rounded-xl bg-muted/50 border border-primary-700/80 transition-all duration-300 hover:bg-muted hover:border-primary/20"
            >
              <div className="w-14 h-14 rounded-xl bg-background border flex items-center justify-center mb-4">
                <item.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
