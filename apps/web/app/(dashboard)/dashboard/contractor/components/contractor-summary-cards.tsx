/**
 * Contractor Summary Cards Component
 * 
 * Generates summary cards for contractor dashboard using real data
 * Similar to JMB dashboard but with contractor-specific metrics
 */

"use client"

import { useMemo } from "react"
import { useTenders } from "@/hooks/use-tenders"
import { useMyBids } from "@/hooks/use-my-bids"
import { type SummaryCardData } from "@/components/dashboard/dashboard-summary-card"
import { FileText, Send, Award, Clock, CircleDollarSign } from "lucide-react"

export function useContractorDashboardCards(): SummaryCardData[] {
  // Fetch available tenders (open status) - use useMemo to prevent infinite re-renders
  const tenderFilters = useMemo(() => ({ 
    page: 1, 
    page_size: 100,
    status: "open" as const
  }), [])
  
  const { tenders, loading: tendersLoading } = useTenders(tenderFilters)
  
  // Fetch contractor's bids
  const { bids, loading: bidsLoading } = useMyBids(1, 100)

  return useMemo(() => {
    // Count bids by status
    const wonBids = bids.filter(bid => bid.status === "awarded").length
    const pendingBids = bids.filter(bid => bid.status === "submitted").length
    
    // Progressive rendering - show 0 or actual value, don't block on loading
    // This matches My Bids pattern for fast perceived performance
    return [
      {
        title: "Available Tenders",
        value: tendersLoading ? "..." : tenders.length,
        icon: FileText,
        link: "/tenders",
        iconColor: "text-purple-700",
        iconBoxColor: "bg-purple-50",
      },
      {
        title: "My Bids",
        value: bidsLoading ? "..." : bids.length,
        icon: CircleDollarSign,
        link: "/my-bids",
        iconColor: "text-teal-700",
        iconBoxColor: "bg-teal-50",
      },
      {
        title: "Won Projects",
        value: bidsLoading ? "..." : wonBids,
        icon: Award,
        link: "/my-bids?status=awarded",
        iconColor: "text-green-600",
        iconBoxColor: "bg-green-50",
      },
      {
        title: "Pending Response",
        value: bidsLoading ? "..." : pendingBids,
        icon: Clock,
        link: "/my-bids?status=submitted",
        iconColor: "text-orange-600",
        iconBoxColor: "bg-orange-50",
      },
    ]
  }, [tenders, tendersLoading, bids, bidsLoading])
}
