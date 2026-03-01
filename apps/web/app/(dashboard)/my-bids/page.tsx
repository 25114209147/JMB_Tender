"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, X, FileText, Clock, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"
import { useMyBids } from "@/hooks/use-my-bids"
import { useRole } from "@/contexts/role-context"
import { hasPermission } from "@/lib/roles"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ErrorMessage } from "@/components/ui/error-message"
import { EmptyState } from "@/components/ui/empty-state"
import { BidCard } from "@/components/bid/bid-card"
import { BidDetailDialog } from "@/components/bid/bid-detail-dialog"
import DashboardTemplate, { type DashboardConfig } from "@/components/dashboard/dashboard-template"
import { type SummaryCardData } from "@/components/dashboard/dashboard-summary-card"

export default function MyBidsPage() {
  const { role } = useRole()
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [search, setSearch] = useState<string>("")
  const [sort, setSort] = useState<string>("date-desc")

  // ✅ Use hook to fetch real data
  const { bids, loading, error, total, refetch } = useMyBids(1, 100)

  // Only contractors can view their bids
  if (!hasPermission(role, "bids:view")) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-lg font-semibold mb-2">Access Denied</p>
          <p className="text-muted-foreground mb-4">
            You don't have permission to view bids. This page is for contractors only.
          </p>
          <Link href="/tenders">
            <Button className="cursor-pointer">Go to Tenders</Button>
          </Link>
        </div>
      </div>
    )
  }

  // ✅ Filter and sort bids
  const filteredBids = useMemo(() => {
    let filtered = [...bids]
    
    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase()
      filtered = filtered.filter(
        (bid) =>
          bid.tender_title?.toLowerCase().includes(q) ||
          bid.company_name?.toLowerCase().includes(q) ||
          bid.status.toLowerCase().includes(q)
      )
    }
    
    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((bid) => bid.status === statusFilter)
    }
    
    // Sort
    filtered.sort((a, b) => {
      if (sort === "date-desc") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
      if (sort === "date-asc") {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      }
      if (sort === "amount-asc") {
        return a.proposed_amount - b.proposed_amount
      }
      if (sort === "amount-desc") {
        return b.proposed_amount - a.proposed_amount
      }
      return 0
    })
    
    return filtered
  }, [bids, statusFilter, search, sort])

  // ✅ Calculate stats from real data
  const stats = useMemo(() => {
    return {
      total: bids.length,
      submitted: bids.filter((b) => b.status === "submitted").length,
      awarded: bids.filter((b) => b.status === "awarded").length,
      rejected: bids.filter((b) => b.status === "rejected").length,
      withdrawn: bids.filter((b) => b.status === "withdrawn").length,
    }
  }, [bids])

  // ✅ Handle loading
  if (loading) {
    return <LoadingSpinner message="Loading your bids..." />
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
      iconColor: "text-green-500",
      iconBoxColor: "bg-green-50",
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
      iconColor: "text-blue-600",
      iconBoxColor: "bg-blue-50",
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
    title: "My Bids",
    description: `Track your bid submissions and their status (${total} ${total === 1 ? "bid" : "bids"})`,
    summaryCards: dashboardCards,
    sections: [
      {
        content: (
          <div className="space-y-4">
            {/* Filters - Standardized with All Tenders format */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center w-full">
              {/* Search */}
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none z-10" />
                <Input
                  placeholder="Search by tender title, company name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 w-full cursor-pointer"
                />
              </div>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px] shrink-0">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="awarded">Awarded</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="withdrawn">Withdrawn</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="w-full sm:w-[180px] shrink-0">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">Newest First</SelectItem>
                  <SelectItem value="date-asc">Oldest First</SelectItem>
                  <SelectItem value="amount-asc">Amount: Low to High</SelectItem>
                  <SelectItem value="amount-desc">Amount: High to Low</SelectItem>
                </SelectContent>
              </Select>

              {/* Clear Filters */}
              {(statusFilter !== "all" || search.trim()) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setStatusFilter("all")
                    setSearch("")
                    setSort("date-desc")
                  }}
                  className="gap-2 cursor-pointer shrink-0 w-full sm:w-auto"
                >
                  <X className="h-4 w-4" />
                  Clear filters
                </Button>
              )}
            </div>

            {/* Bids List */}
            {filteredBids.length === 0 ? (
              <EmptyState
                icon={FileText}
                title={statusFilter === "all" ? "No bids yet" : `No ${statusFilter} bids`}
                description={
                  statusFilter === "all"
                    ? "You haven't submitted any bids yet. Browse tenders to get started."
                    : `You don't have any ${statusFilter} bids.`
                }
                action={
                  <Link href="/tenders">
                    <Button className="cursor-pointer">Browse Tenders</Button>
                  </Link>
                }
              />
            ) : (
              <div className="space-y-4">
                {filteredBids.map((bid) => (
                  <BidCard
                    key={bid.id}
                    bid={bid}
                    showTenderLink={true}
                    fromPage="my-bids"
                    actions={<BidDetailDialog bid={bid} />}
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
