import { FileText, Send, Award, Clock, TrendingUp } from "lucide-react"
import { type SummaryCardData } from "@/components/layout/dashboard-summary-card"

export const contractorDashboardCards: SummaryCardData[] = [
  {
    title: "Available Tenders",
    value: 24,
    icon: FileText,
    link: "/tenders",
  },
  {
    title: "My Bids",
    value: 8,
    icon: Send,
    link: "/bids",
  },
  {
    title: "Won Projects",
    value: 3,
    icon: Award,
    link: "/contractor/projects",
  },
  {
    title: "Pending Response",
    value: 5,
    icon: Clock,
    link: "/contractor/pending",
  },
]

export const contractorPerformanceCards: SummaryCardData[] = [
  {
    title: "Success Rate",
    value: 38, // percentage
    icon: TrendingUp,
    link: "/contractor/performance",
  },
  {
    title: "Total Earnings",
    value: 125000, // RM
    icon: Award,
    link: "/contractor/earnings",
  },
]
