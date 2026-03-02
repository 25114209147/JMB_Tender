import { Bell, Building2, CheckCircle2, FileText } from "lucide-react"

export default function HowItWorks() {
    const steps = [
        { icon: Building2, title: "Post Tender", description: "JMB publishes tender details and documents digitally." },
        { icon: Bell, title: "Instant Alerts", description: "Verified contractors get real-time alerts." },
        { icon: FileText, title: "Receive Bids", description: "Contractors submit bids easily via form or proposals." },
        { icon: CheckCircle2, title: "Compare & Award", description: "JMB compares bids side-by-side and awards." }
    ]

    return (
        // Changed bg-white to dark:bg-slate-950 and border-y to dark:border-slate-800
        <section className="py-20 md:py-28 bg-white dark:bg-slate-950 border-y dark:border-slate-800 overflow-hidden">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="text-center mb-16 md:mb-24">
                    {/* Added dark:text-white */}
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-slate-900 dark:text-white">
                        How It Works
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto dark:text-slate-400">
                        A fully digital procurement cycle for transparent management.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-0">
                    {steps.map((step, i) => (
                        <div key={i} className="relative flex flex-col items-center text-center group">
                            
                            {/* Connector Line Logic */}
                            {i < steps.length - 1 && (
                                <>
                                    {/* Desktop: Added dark:bg-slate-800 */}
                                    <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-slate-100 dark:bg-slate-800 z-0">
                                        <div className="h-full w-0 group-hover:w-full bg-primary transition-all duration-700 ease-in-out" />
                                    </div>
                                    
                                    {/* Mobile: Added dark:bg-slate-800 */}
                                    <div className="lg:hidden absolute top-[100%] left-1/2 w-0.5 h-12 bg-slate-100 dark:bg-slate-800 -translate-x-1/2 mt-4">
                                        <div className="w-full h-0 group-hover:h-full bg-primary transition-all duration-700 ease-in-out" />
                                    </div>
                                </>
                            )}

                            {/* Icon Box */}
                            <div className="relative z-10 mb-8">
                                {/* Added dark:bg-slate-900 and dark:border-slate-700 */}
                                <div className="w-24 h-24 rounded-3xl bg-white dark:bg-slate-900 border-2 border-primary/20 dark:border-primary/10 shadow-sm flex items-center justify-center transition-all duration-500 group-hover:border-primary group-hover:shadow-xl group-hover:shadow-primary/10 group-hover:-translate-y-2">
                                    {/* Added dark:text-slate-400 */}
                                    <step.icon className="h-10 w-10 text-slate-600 dark:text-slate-400 group-hover:text-primary transition-colors duration-500" />
                                </div>
                            </div>

                            {/* Text Content */}
                            <div className="relative z-10 px-4">
                                {/* Added dark:text-slate-100 */}
                                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3 group-hover:text-primary transition-colors">
                                    {step.title}
                                </h3>
                                {/* Added dark:text-slate-400 */}
                                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-[220px] mx-auto">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}