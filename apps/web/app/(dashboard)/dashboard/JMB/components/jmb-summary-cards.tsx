/**
 * JMB Summary Cards Component
 * 
 * Generates summary cards for JMB dashboard using real data
 * This is a component (not data) because it uses hooks
 */

"use client"

import { useMemo } from "react"
import { useDashboardStats } from "@/hooks/use-dashboard-stats"
import { type SummaryCardData } from "@/components/dashboard/dashboard-summary-card"
import { CheckCircle, FileText, List, SquarePen } from "lucide-react"

export function useJMBDashboardCards(): SummaryCardData[] {
  const { stats } = useDashboardStats()

  return useMemo(() => {
    return [
      {
        title: "My Tenders",
        value: stats?.total_tenders || 0,
        icon: List,
        link: "/tenders/my-tenders",
        iconColor: "text-blue-700",
        iconBoxColor: "bg-blue-50",
      },
      {
        title: "Active Tenders",
        value: stats?.active_tenders || 0,
        icon: FileText,
        link: "/tenders",
        iconColor: "text-purple-800",
        iconBoxColor: "bg-purple-50",
      },
      {
        title: "Drafts",
        value: stats?.draft_tenders || 0,
        icon: SquarePen,
        link: "/dashboard/JMB/drafts",
        iconColor: "text-yellow-600",
        iconBoxColor: "bg-yellow-50",
      },
      {
        title: "Completed Tenders",
        value: stats?.completed_tenders || 0,
        icon: CheckCircle,
        link: "/dashboard/JMB/completed",
        iconColor: "text-green-600",
        iconBoxColor: "bg-green-50",
      },
    ]
  }, [stats])
}
