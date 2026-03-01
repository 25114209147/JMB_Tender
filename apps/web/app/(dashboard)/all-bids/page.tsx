"use client"

import { useState, useMemo } from "react"
import { useBids } from "@/hooks/use-bids"
import { useTenders } from "@/hooks/use-tenders"
import { useRole } from "@/contexts/role-context"
import { useCurrentUser } from "@/hooks/use-current-user"
import { hasPermission } from "@/lib/roles"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ErrorMessage } from "@/components/ui/error-message"
import { BidFiltersMobile } from "@/components/bid/bid-filters-mobile"
import { BidListUnified } from "@/components/bid/bid-list-unified"
import { getAllBidsStats } from "./components/all-bids-stats"
import { awardBid, rejectBid } from "@/lib/bids"
import DashboardTemplate, { type DashboardConfig } from "@/components/dashboard/dashboard-template"

export default function AllBidsPage() {
  const { role } = useRole()
  const { user } = useCurrentUser()
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [tenderFilter, setTenderFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [bidSortBy, setBidSortBy] = useState<string>("date-desc")
  const [processingId, setProcessingId] = useState<number | null>(null)

  // Fetch all bids once (no filters) - use for both stats and display
  const bidsFilters = useMemo(() => ({ page: 1, page_size: 100 }), [])
  const { bids: allBids, loading: bidsLoading, error: bidsError, total, refetch } = useBids(bidsFilters)

  // fetch bids by owned tenders
  const shouldFetchTenders = role === "JMB"
  const tendersFilters = useMemo(
    () => (shouldFetchTenders ? { page: 1, page_size: 100 } : { page: 1, page_size: 0 }),
    [shouldFetchTenders]
  )
  const { tenders: myTenders, loading: tendersLoading, error: tendersError } = useTenders(tendersFilters)

  // Only Admin and JMB can view bids
  if (!hasPermission(role, "bids:manage") && role !== "JMB") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-lg font-semibold mb-2">Access Denied</p>
          <p className="text-muted-foreground mb-4">
            You don't have permission to view bids. This page is for admins and JMB only.
          </p>
        </div>
      </div>
    )
  }

  // - Admin: sees all bids
  // - JMB: sees only bids for tenders they created
  const visibleBids = useMemo(() => {
    if (hasPermission(role, "bids:manage")) {
      return allBids
    } else if (role === "JMB" && user) {
      const myTenderIds = new Set(myTenders.map((t) => t.id))
      return allBids.filter((bid) => myTenderIds.has(bid.tender_id))
    }
    return []
  }, [allBids, myTenders, role, user])

  const filteredBids = useMemo(() => {
    let filtered = visibleBids
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((bid) => 
        bid.company_name?.toLowerCase().includes(query) ||
        bid.tender_title?.toLowerCase().includes(query)
      )
    }
    
    if (statusFilter !== "all") {
      filtered = filtered.filter((bid) => bid.status === statusFilter)
    }
    
    if (tenderFilter !== "all") {
      filtered = filtered.filter((bid) => bid.tender_id === parseInt(tenderFilter))
    }
    
    return filtered.sort((a, b) => {
      if (bidSortBy === "amount-asc") return a.proposed_amount - b.proposed_amount
      if (bidSortBy === "amount-desc") return b.proposed_amount - a.proposed_amount
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })
  }, [visibleBids, statusFilter, tenderFilter, searchQuery, bidSortBy])

  const dashboardCards = useMemo(() => getAllBidsStats({ allBids: visibleBids }), [visibleBids])

  const handleAward = async (bidId: number) => {
    setProcessingId(bidId)
    try {
      const result = await awardBid(bidId)
      if (result) {
        // Force refetch to get updated data
        await refetch()
      }
    } catch (error) {
      console.error("Failed to award bid:", error)
    } finally {
      setProcessingId(null)
    }
  }

  const handleReject = async (bidId: number) => {
    setProcessingId(bidId)
    try {
      const result = await rejectBid(bidId)
      if (result) {
        // Force refetch to get updated data
        await refetch()
      }
    } catch (error) {
      console.error("Failed to reject bid:", error)
    } finally {
      setProcessingId(null)
    }
  }

  const loading = bidsLoading || (shouldFetchTenders && tendersLoading)
  if (loading) {
    return <LoadingSpinner message="Loading bids..." />
  }

  const error = bidsError || tendersError
  if (error) {
    return (
      <ErrorMessage 
        message={error}
        title="Failed to load bids"
        onRetry={refetch}
      />
    )
  }

  const config: DashboardConfig = {
    title: role === "JMB" ? "My Tenders' Bids" : "All Bids",
    description:
      role === "JMB"
        ? `View and manage bids for your tenders (${visibleBids.length} ${visibleBids.length === 1 ? "bid" : "bids"})`
        : `View and manage all bids in the system (${total} ${total === 1 ? "bid" : "bids"})`,
    summaryCards: dashboardCards,
    sections: [
      {
        content: (
          <div className="space-y-4">
            {/* Filters - Mobile-friendly */}
            <BidFiltersMobile
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              statusFilter={statusFilter}
              tenderFilter={tenderFilter}
              onStatusChange={setStatusFilter}
              onTenderChange={setTenderFilter}
              onClearFilters={() => {
                setSearchQuery("")
                setStatusFilter("all")
                setTenderFilter("all")
                setBidSortBy("date-desc")
              }}
              allBids={visibleBids}
              showTenderFilter={true}
              showSortBy={true}
              sortBy={bidSortBy}
              onSortChange={setBidSortBy}
            />

            {/* Bids List */}
            <BidListUnified
              bids={filteredBids}
              statusFilter={statusFilter}
              showActions={true}
              role={role}
              processingId={processingId}
              onAward={handleAward}
              onReject={handleReject}
              showTenderLink={true}
              fromPage="all-bids"
            />
          </div>
        ),
      },
    ],
  }

  return <DashboardTemplate config={config} />
}

