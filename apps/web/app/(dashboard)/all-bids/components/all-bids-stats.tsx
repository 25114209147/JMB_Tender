"use client"

import { FileText, Clock, CheckCircle, XCircle, TrendingDown } from "lucide-react"
import type { SummaryCardData } from "@/components/dashboard/dashboard-summary-card"
import type { Bid } from "@/data/bids/bid-types"

interface AllBidsStatsProps {
  allBids: Bid[]
}

export function getAllBidsStats({ allBids }: AllBidsStatsProps): SummaryCardData[] {
  const stats = {
    total: allBids.length,
    submitted: allBids.filter((b) => b.status === "submitted").length,
    awarded: allBids.filter((b) => b.status === "awarded").length,
    rejected: allBids.filter((b) => b.status === "rejected").length,
    withdrawn: allBids.filter((b) => b.status === "withdrawn").length,
  }

  return [
    {
      title: "Total Bids",
      value: stats.total,
      icon: FileText,
      iconColor: "text-blue-500",
      iconBoxColor: "bg-blue-50",
    },
    {
      title: "Submitted",
      value: stats.submitted,
      icon: Clock,
      iconColor: "text-yellow-600",
      iconBoxColor: "bg-yellow-50",
    },
    {
      title: "Awarded",
      value: stats.awarded,
      icon: CheckCircle,
      iconColor: "text-green-600",
      iconBoxColor: "bg-green-50",
    },
    {
      title: "Rejected",
      value: stats.rejected,
      icon: XCircle,
      iconColor: "text-red-600",
      iconBoxColor: "bg-red-50",
    },
    ...(stats.withdrawn > 0
      ? [
          {
            title: "Withdrawn",
            value: stats.withdrawn,
            icon: TrendingDown,
            iconColor: "text-gray-600",
            iconBoxColor: "bg-gray-50",
          } as SummaryCardData,
        ]
      : []),
  ]
}
