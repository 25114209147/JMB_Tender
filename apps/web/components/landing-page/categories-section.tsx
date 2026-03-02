import { 
  ShieldCheck, 
  Wrench, 
  Leaf, 
  Trash2, 
  Bug, 
  Sparkles,
} from "lucide-react";

const categories = [
  { icon: ShieldCheck, label: "Security", description: "Guards & CCTV" },
  { icon: Sparkles, label: "Cleaning", description: "General & Deep Clean" },
  { icon: Wrench, label: "Maintenance", description: "M&E and Lift" },
  { icon: Leaf, label: "Landscaping", description: "Garden & Pool" },
  { icon: Trash2, label: "Waste", description: "Refuse Collection" },
  { icon: Bug, label: "Pest Control", description: "Termite & Fogging" },
];

export function CategoriesSection() {
  return (
    <section className="py-20 md:py-28 bg-muted/30">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <div className="mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-4">
            Service Categories
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Explore the most active service sectors in Malaysian property management
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {categories.map((cat, i) => (
            <div 
              key={i} 
              className="group relative bg-background border rounded-xl p-6 text-center transition-all duration-300 hover:border-primary/50 hover:shadow-md cursor-pointer"
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/10 group-hover:scale-110 transition-all duration-300">
                <cat.icon className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
              </div>

              {/* Label */}
              <h3 className="font-semibold text-sm text-foreground mb-1">
                {cat.label}
              </h3>
              
              {/* Description */}
              <p className="text-xs text-muted-foreground">
                {cat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
