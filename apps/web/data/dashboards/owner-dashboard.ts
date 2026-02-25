import { CheckCircle, CircleDollarSign, Clock3, LayoutDashboard } from "lucide-react"
import { type SummaryCardData } from "@/components/layout/dashboard-summary-card"

export const ownerDashboardCards: SummaryCardData[] = [
  {
    title: "Total Tenders",
    value: 12,
    icon: LayoutDashboard,
    link: "/tenders",
  },
  {
    title: "Active Bids",
    value: 5,
    icon: CircleDollarSign,
    link: "/bids",
  },
  {
    title: "Pending Review",
    value: 3,
    icon: Clock3,
    link: "/review",
  },
  {
    title: "Completed",
    value: 4,
    icon: CheckCircle,
    link: "/completed",
  },
]
