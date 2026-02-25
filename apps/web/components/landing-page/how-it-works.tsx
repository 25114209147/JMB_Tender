import { Bell, Building2, CheckCircle2, ChevronRight, FileText } from "lucide-react"

export default function HowItWorks() {
    return (
        <section className="py-10 md:py-20 bg-muted/40 border-y">
            <div className="container mx-auto px-6 lg:px-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
                    <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                        Simple, transparent and compliant process from posting to awarding
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-7xl mx-auto justify-center">
                    {[
                        {
                            icon: Building2,
                            title: "Post Tender",
                            description: "JMB publishes tender details and with documents digitally."
                        },
                        {
                            icon: Bell,
                            title: "Instant Alerts",
                            description: "Verified contractors get real-time alerts."
                        },
                        {
                            icon: FileText,
                            title: "Receive Bids",
                            description: "Contractors submit bids easily via form or by uploading full proposals."
                        },
                        {
                            icon: CheckCircle2,
                            title: "Compare & Award",
                            description: "JMB compares bids side-by-side and awards the contract."
                        }
                    ].map((step, i) => (
                        <div key={i} className="relative group">
                            <div className="bg-background rounded-xl border p-6 h-full shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:-translate-y-1 justify-center items-center text-center">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                    <step.icon className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                            </div>

                            {/* The Arrow - only shows between items on desktop */}
                            {i < 3 && (
                                <div className="hidden lg:block absolute top-1/2 -right-6 transform -translate-y-1/2 z-10">
                                    <ChevronRight className="h-8 w-8 text-muted-foreground/30" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}