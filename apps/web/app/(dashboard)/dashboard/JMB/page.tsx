"use client"

import DashboardTemplate, { type DashboardConfig } from "@/components/dashboard/dashboard-template"
import { Plus } from "lucide-react"
import { useJMBDashboardCards } from "./components/jmb-summary-cards"
import { TendersClosingSoonSection } from "./components/tenders-closing-soon-section"

export default function JMBDashboardPage() {
  const dashboardCards = useJMBDashboardCards()

  const config: DashboardConfig = {
    title: "JMB Dashboard",
    description: "Manage your tenders and track bids",
    summaryCards: dashboardCards,
    primaryAction: {
      label: "Create Tender",
      icon: <Plus className="w-4 h-4 mr-2" />,
      href: "/tenders/create",
    },
    sections: [
      {
        title: "Recent Activity",
        content: <TendersClosingSoonSection />,
      },
    ],
  }

  return <DashboardTemplate config={config} />
}
