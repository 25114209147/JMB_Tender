// components/landing/CategoriesSection.tsx
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, Smartphone, Globe, Mail, Building2, Bug } from "lucide-react";

const categories = [
  { icon: ShieldCheck, label: "Security" },
  { icon: Smartphone, label: "Cleaning" },
  { icon: Globe, label: "M&E" },
  { icon: Mail, label: "Landscaping" },
  { icon: Building2, label: "Lift Maintenance" },
  { icon: Bug, label: "Pest Control" },
];

export function CategoriesSection() {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-16">Popular Tender Categories</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto">
          {categories.map((cat, i) => (
            <Card key={i} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <cat.icon className="h-6 w-6 text-primary" />
                </div>
                <p className="font-medium">{cat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}