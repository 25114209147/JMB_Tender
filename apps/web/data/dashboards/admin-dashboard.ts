import { Users, FileText, Building, Activity, AlertCircle, CheckCircle } from "lucide-react"
import { type SummaryCardData } from "@/components/dashboard/dashboard-summary-card"

export const adminDashboardCards: SummaryCardData[] = [
  {
    title: "Total Users",
    value: 456,
    icon: Users,
    link: "/admin/users",
  },
  {
    title: "Active Tenders",
    value: 89,
    icon: FileText,
    link: "/admin/tenders",
  },
  {
    title: "Registered Companies",
    value: 234,
    icon: Building,
    link: "/admin/companies",
  },
  {
    title: "System Activity",
    value: 1250, // daily transactions
    icon: Activity,
    link: "/admin/activity",
  },
]

export const adminAlertCards: SummaryCardData[] = [
  {
    title: "Pending Approvals",
    value: 12,
    icon: AlertCircle,
    link: "/admin/approvals",
  },
  {
    title: "Reported Issues",
    value: 3,
    icon: AlertCircle,
    link: "/admin/issues",
  },
  {
    title: "Resolved Today",
    value: 8,
    icon: CheckCircle,
    link: "/admin/resolved",
  },
]
