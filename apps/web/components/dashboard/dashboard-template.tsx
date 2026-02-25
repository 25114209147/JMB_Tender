import { type ReactNode } from "react"
import Link from "next/link"
import SummaryCards, { type SummaryCardData } from "@/components/layout/dashboard-summary-card"
import { Button } from "@/components/ui/button"

export interface DashboardConfig {
  title: string
  description: string
  summaryCards: SummaryCardData[]
  primaryAction?: {
    label: string
    icon: ReactNode
    href?: string
    onClick?: () => void
  }
  sections?: Array<{
    title: string
    description?: string
    content: ReactNode
  }>
}

interface DashboardTemplateProps {
  config: DashboardConfig
}

export default function DashboardTemplate({ config }: DashboardTemplateProps) {
  const { title, description, summaryCards, primaryAction, sections } = config

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-row gap-2 justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
        
        {primaryAction && (
          <div>
            {primaryAction.href ? (
              <Link href={primaryAction.href}>
                <Button variant="default" className="hover:cursor-pointer">
                  {primaryAction.icon}
                  {primaryAction.label}
                </Button>
              </Link>
            ) : (
              <Button 
                variant="default" 
                className="hover:cursor-pointer"
                onClick={primaryAction.onClick}
              >
                {primaryAction.icon}
                {primaryAction.label}
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <SummaryCards data={summaryCards} />

      {/* Additional Sections */}
      {sections && sections.map((section, index) => (
        <div key={index} className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold">{section.title}</h2>
            {section.description && (
              <p className="text-muted-foreground">{section.description}</p>
            )}
          </div>
          {section.content}
        </div>
      ))}
    </div>
  )
}
