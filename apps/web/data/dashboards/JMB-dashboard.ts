/**
 * @deprecated This file is no longer used.
 * Dashboard cards are now generated dynamically from real API data.
 * See: apps/web/app/(dashboard)/JMB/dashboard/page.tsx
 * Uses: useDashboardStats hook for real-time data
 * 
 * This file can be safely removed.
 */

import { CheckCircle, CircleDollarSign, FileText, LayoutDashboard, SquarePen } from "lucide-react"
import { type SummaryCardData } from "@/components/dashboard/dashboard-summary-card"


export const JMBDashboardCards: SummaryCardData[] = [
  {
    title: "My Tenders",
    value: 12,
    icon: FileText,
    link: "/tenders/my-tenders",
    iconColor: "text-blue-500",
    iconBoxColor: "bg-blue-50",
  },
  {
    title: "Active Bids",
    value: 5,
    icon: CircleDollarSign,
    link: "/all-bids",
    iconColor: "text-teal-700",
    iconBoxColor: "bg-teal-50",
  },
  {
    title: "Drafts",
    value: 3,
    icon: SquarePen,
    link: "/JMB/drafts",
    iconColor: "text-yellow-600",
    iconBoxColor: "bg-yellow-50",
  },
  {
    title: "Completed Tenders",
    value: 4,
    icon: CheckCircle,
    link: "/JMB/completed",
    iconColor: "text-green-600",
    iconBoxColor: "bg-green-50",
  },
]
