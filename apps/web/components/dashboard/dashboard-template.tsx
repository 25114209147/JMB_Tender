import { type ReactNode } from "react"
import SummaryCards, { type SummaryCardData } from "@/components/dashboard/dashboard-summary-card"
import DashboardHeader from "@/components/dashboard/dashboard-header"

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
    title?: string
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
      <DashboardHeader
        title={title}
        description={description}
        primaryAction={primaryAction}
      />

      
      {/* Summary Cards */}
      <SummaryCards data={summaryCards} />

      {/* Additional Sections */}
      {sections && sections.map((section, index) => (
        <div key={index} className={section.title ? "space-y-3" : ""}>
          {section.title && (
            <div>
              <h2 className="text-xl font-semibold">{section.title}</h2>
              {section.description && (
                <p className="text-muted-foreground">{section.description}</p>
              )}
            </div>
          )}
          {section.content}
        </div>
      ))}
    </div>
  )
}
