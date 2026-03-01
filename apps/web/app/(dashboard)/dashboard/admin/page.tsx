"use client"

import DashboardTemplate, { type DashboardConfig } from "@/components/dashboard/dashboard-template"
import { Users } from "lucide-react"
import { useAdminDashboardCards } from "./components/admin-summary-cards"
import { TendersClosingSoonSection } from "./components/tenders-closing-soon-section"

export default function AdminDashboardPage() {
  const dashboardCards = useAdminDashboardCards()

  const config: DashboardConfig = {
    title: "Admin Dashboard",
    description: "System overview and management",
    summaryCards: dashboardCards,
    primaryAction: {
      label: "Manage Users",
      icon: <Users className="w-4 h-4 mr-2" />,
      href: "/admin/users",
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
