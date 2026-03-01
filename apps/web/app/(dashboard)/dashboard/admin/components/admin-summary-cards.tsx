/**
 * Admin Summary Cards Component
 * 
 * Generates summary cards for Admin dashboard using real data
 * This is a component (not data) because it uses hooks
 */

"use client"

import { useMemo } from "react"
import { useDashboardStats } from "@/hooks/use-dashboard-stats"
import { type SummaryCardData } from "@/components/dashboard/dashboard-summary-card"
import { CheckCircle, CircleDollarSign, FileText, Users } from "lucide-react"

export function useAdminDashboardCards(): SummaryCardData[] {
  const { stats } = useDashboardStats()

  return useMemo(() => {
    return [
      {
        title: "Total Users",
        value: stats?.total_users || 0,
        icon: Users,
        link: "/admin/users",
        iconColor: "text-blue-700",
        iconBoxColor: "bg-blue-50",
      },
      {
        title: "Total Tenders",
        value: stats?.total_tenders || 0,
        icon: FileText,
        link: "/tenders",
        iconColor: "text-purple-800",
        iconBoxColor: "bg-purple-50",
      },
      {
        title: "Total Bids",
        value: stats?.total_bids || 0,
        icon: CircleDollarSign,
        link: "/all-bids",
        iconColor: "text-teal-800",
        iconBoxColor: "bg-teal-50",
      },
      {
        title: "Completed Tenders",
        value: stats?.completed_tenders || 0,
        icon: CheckCircle,
        link: "/tenders?status=completed",
        iconColor: "text-green-600",
        iconBoxColor: "bg-green-50",
      },
    ]
  }, [stats])
}
