"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, FileText, Award, XCircle, Clock, CheckCircle } from "lucide-react"
import { useBids } from "@/hooks/use-bids"
import { useRole } from "@/contexts/role-context"
import { hasPermission } from "@/lib/roles"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ErrorMessage } from "@/components/ui/error-message"
import { EmptyState } from "@/components/ui/empty-state"
import { BidCard } from "@/components/bid/bid-card"
import { awardBid, rejectBid } from "@/lib/bids"
import type { BidStatus } from "@/data/bids/bid-types"
import DashboardTemplate, { type DashboardConfig } from "@/components/dashboard/dashboard-template"
import { type SummaryCardData } from "@/components/dashboard/dashboard-summary-card"

export default function AllBidsPage() {
  const { role } = useRole()
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [tenderFilter, setTenderFilter] = useState<string>("all")
  const [processingId, setProcessingId] = useState<number | null>(null)

  // ✅ Fetch all bids once (no filters) - use for both stats and display
  // Filter client-side for better performance and to avoid duplicate API calls
  const { bids: allBids, loading, error, total, refetch } = useBids({
    page: 1,
    page_size: 100,
  })

  // Only Admin and JMB can view all bids
  if (!hasPermission(role, "bids:manage") && role !== "JMB") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-lg font-semibold mb-2">Access Denied</p>
          <p className="text-muted-foreground mb-4">
            You don't have permission to view all bids. This page is for admins and JMB only.
          </p>
        </div>
      </div>
    )
  }

  // ✅ Filter bids client-side by status and tender_id
  const filteredBids = useMemo(() => {
    let filtered = allBids
    
    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((bid) => bid.status === statusFilter)
    }
    
    // Filter by tender_id
    if (tenderFilter !== "all") {
      filtered = filtered.filter((bid) => bid.tender_id === parseInt(tenderFilter))
    }
    
    return filtered
  }, [allBids, statusFilter, tenderFilter])

  // ✅ Calculate stats from ALL bids (not filtered)
  const stats = useMemo(() => {
    return {
      total: allBids.length,
      submitted: allBids.filter((b) => b.status === "submitted").length,
      awarded: allBids.filter((b) => b.status === "awarded").length,
      rejected: allBids.filter((b) => b.status === "rejected").length,
      withdrawn: allBids.filter((b) => b.status === "withdrawn").length,
    }
  }, [allBids])

  // ✅ Get unique tender IDs for filter (from all bids)
  const tenderIds = useMemo(() => {
    const uniqueIds = Array.from(new Set(allBids.map((bid) => bid.tender_id)))
    return uniqueIds
  }, [allBids])

  // ✅ Handle award bid (Owner/Admin only)
  const handleAward = async (bidId: number) => {
    setProcessingId(bidId)
    try {
      await awardBid(bidId)
      // Refetch bids to update UI
      await refetch()
    } catch (err) {
      console.error("Failed to award bid:", err)
      alert("Failed to award bid")
    } finally {
      setProcessingId(null)
    }
  }

  // ✅ Handle reject bid (Owner/Admin only)
  const handleReject = async (bidId: number) => {
    setProcessingId(bidId)
    try {
      await rejectBid(bidId)
      // Refetch bids to update UI
      await refetch()
    } catch (err) {
      console.error("Failed to reject bid:", err)
      alert("Failed to reject bid")
    } finally {
      setProcessingId(null)
    }
  }

  // ✅ Handle loading
  if (loading) {
    return <LoadingSpinner message="Loading all bids..." />
  }

  // ✅ Handle error
  if (error) {
    return (
      <ErrorMessage 
        message={error}
        title="Failed to load bids"
        onRetry={refetch}
      />
    )
  }

  // Dashboard summary cards
  const dashboardCards: SummaryCardData[] = [
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
  ]

  const config: DashboardConfig = {
    title: "All Bids",
    description: `View and manage all bids in the system (${total} ${total === 1 ? "bid" : "bids"})`,
    summaryCards: dashboardCards,
    sections: [
      {
        title: "Bids Management",
        content: (
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex items-center gap-4 flex-wrap">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="awarded">Awarded</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="withdrawn">Withdrawn</SelectItem>
                </SelectContent>
              </Select>
              {tenderIds.length > 0 && (
                <Select value={tenderFilter} onValueChange={setTenderFilter}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filter by tender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tenders</SelectItem>
                    {tenderIds.map((tenderId) => {
                      const tenderBid = allBids.find((b) => b.tender_id === tenderId)
                      return (
                        <SelectItem key={tenderId} value={String(tenderId)}>
                          {tenderBid?.tender_title || `Tender #${tenderId}`}
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              )}
              {(statusFilter !== "all" || tenderFilter !== "all") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setStatusFilter("all")
                    setTenderFilter("all")
                  }}
                >
                  Clear filters
                </Button>
              )}
            </div>

            {/* Bids List */}
            {filteredBids.length === 0 ? (
              <EmptyState
                icon={FileText}
                title={statusFilter === "all" ? "No bids found" : `No ${statusFilter} bids`}
                description={
                  statusFilter === "all"
                    ? "There are no bids in the system yet."
                    : `There are no ${statusFilter} bids.`
                }
              />
            ) : (
              <div className="space-y-4">
                {filteredBids.map((bid) => (
                  <BidCard
                    key={bid.id}
                    bid={bid}
                    showTenderLink={true}
                    actions={
                      // Show award/reject buttons for Owner/Admin on submitted bids
                      (role === "admin" || role === "JMB") && bid.status === "submitted" ? (
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="default"
                            className="gap-1.5 cursor-pointer"
                            onClick={() => handleAward(bid.id)}
                            disabled={processingId === bid.id}
                          >
                            <Award className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Award</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="gap-1.5 cursor-pointer"
                            onClick={() => handleReject(bid.id)}
                            disabled={processingId === bid.id}
                          >
                            <XCircle className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Reject</span>
                          </Button>
                        </div>
                      ) : null
                    }
                  />
                ))}
              </div>
            )}
          </div>
        ),
      },
    ],
  }

  return <DashboardTemplate config={config} />
}

