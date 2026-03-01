"use client"

import { use, useState, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ViewTenderDetails from "../components/view-tender-details"
import { useRole } from "@/contexts/role-context"
import { useTender } from "@/hooks/use-tender"
import { useTenderBids } from "@/hooks/use-tender-bids"
import { useCurrentUser } from "@/hooks/use-current-user"
import { useMyBids } from "@/hooks/use-my-bids"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ErrorMessage } from "@/components/ui/error-message"
import { BidFiltersMobile } from "@/components/bid/bid-filters-mobile"
import { BidListUnified } from "@/components/bid/bid-list-unified"
import { StatMiniCard } from "@/components/shared/stat-mini-card"
import { awardBid, rejectBid } from "@/lib/bids"
import PageHeader from "@/components/shared/page-header"

export default function TenderViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const tenderId = parseInt(id)
  const searchParams = useSearchParams()
  const from = searchParams.get('from')
  const { role } = useRole()
  const { user } = useCurrentUser()

  const [processingId, setProcessingId] = useState<number | null>(null)
  const [bidStatusFilter, setBidStatusFilter] = useState<string>("all")
  const [bidSortBy, setBidSortBy] = useState<string>("date-desc")

  // Determine back navigation based on 'from' query param
  const backNavigation = useMemo(() => {
    if (from === 'all-bids') {
      return { href: '/all-bids', label: 'Back to All Bids' }
    }
    if (from === 'my-bids') {
      return { href: '/my-bids', label: 'Back to My Bids' }
    }
    return { href: '/tenders', label: 'Back to Tenders' }
  }, [from])

  const { tender, loading: tenderLoading, error: tenderError } = useTender(tenderId)

  // Only JMB/Admin can see the full list of bids
  const canViewAllBids = user && (role === "admin" || role === "JMB")
  const { bids, loading: bidsLoading, error: bidsError, updateBidStatus } = useTenderBids(
    canViewAllBids ? tenderId : null,
    1,
    100
  )

  const { bids: myBids } = useMyBids(role === "contractor" ? 1 : 0, 100)

  const handleAward = async (bidId: number) => {
    setProcessingId(bidId)
    try {
      await awardBid(bidId)
      // Optimistically update the bid status
      updateBidStatus(bidId, "awarded")
    } catch (error) {
      console.error("Failed to award bid:", error)
    } finally {
      setProcessingId(null)
    }
  }

  const handleReject = async (bidId: number) => {
    setProcessingId(bidId)
    try {
      await rejectBid(bidId)
      // Optimistically update the bid status
      updateBidStatus(bidId, "rejected")
    } catch (error) {
      console.error("Failed to reject bid:", error)
    } finally {
      setProcessingId(null)
    }
  }

  // Memoized Filters
  const filteredBids = useMemo(() => {
    if (!bids) return []
    let result = [...bids]
    if (bidStatusFilter !== "all") result = result.filter(b => b.status === bidStatusFilter)

    return result.sort((a, b) => {
      if (bidSortBy === "amount-asc") return a.proposed_amount - b.proposed_amount
      if (bidSortBy === "amount-desc") return b.proposed_amount - a.proposed_amount
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })
  }, [bids, bidStatusFilter, bidSortBy])

  if (tenderLoading) return <LoadingSpinner message="Loading tender..." />
  if (tenderError || !tender) return <ErrorMessage message={tenderError || "Tender not found"} />

  const isOwner = user?.id === tender.created_by_id
  const canEdit = (role === "admin" || (role === "JMB" && isOwner)) && tender.status !== "awarded"
  const hasApplied = myBids.some(b => b.tender_id === tenderId)

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-7xl">
      {/* 1. TOP NAVIGATION & ACTIONS */}

      <PageHeader
        backHref={backNavigation.href}
        backLabel={backNavigation.label}
      />

      <header>
        <h1 className="text-xl font-bold tracking-tight">{tender.title}</h1>
        <p className="text-muted-foreground"> {tender.property_name}</p>
      </header>

      {/* 3. MAIN CONTENT */}
      <div className="space-y-6">
        {canViewAllBids ? (
          // JMB/Admin View: Show Tabs for both Details and Bids
          <Tabs defaultValue="details" className="w-full">
            <div className="flex items-center justify-between mb-4 border-b pb-2">
              <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="bids">
                  Bids <Badge variant="secondary" className="ml-2">({bids?.length || 0})</Badge>
                </TabsTrigger>
              </TabsList>
              {canEdit && (
                <Link href={`/tenders/${tender.id}/edit`}>
                  <Button variant="outline" size="sm" className="cursor-pointer">Edit Tender</Button>
                </Link>
              )}
            </div>

            <TabsContent value="details" className="pt-0">
              <Card>
                <CardContent className="pt-6">
                  <ViewTenderDetails formData={tender as any} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bids" className="pt-0 space-y-4">
              {/* Filters - Mobile-friendly */}
              <BidFiltersMobile
                statusFilter={bidStatusFilter}
                onStatusChange={setBidStatusFilter}
                onClearFilters={() => {
                  setBidStatusFilter("all")
                  setBidSortBy("date-desc")
                }}
                allBids={bids || []}
                showTenderFilter={false}
                showSortBy={true}
                sortBy={bidSortBy}
                onSortChange={setBidSortBy}
              />

              {/* Stats Overview */}
              {bids && bids.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatMiniCard label="Total Bids" value={tender.total_bids || 0} color="blue" />
                  <StatMiniCard 
                    label="Lowest Bid" 
                    value={tender.lowest_bid ? `RM ${tender.lowest_bid.toLocaleString()}` : 'N/A'} 
                    color="green" 
                  />
                  <StatMiniCard 
                    label="Average" 
                    value={tender.average_bid ? `RM ${tender.average_bid.toLocaleString()}` : 'N/A'} 
                    color="purple" 
                  />
                  <StatMiniCard 
                    label="Highest" 
                    value={tender.highest_bid ? `RM ${tender.highest_bid.toLocaleString()}` : 'N/A'} 
                    color="orange" 
                  />
                </div>
              )}

              {/* Bids List */}
              <BidListUnified
                bids={filteredBids}
                statusFilter={bidStatusFilter}
                showActions={true}
                role={role}
                processingId={processingId}
                onAward={handleAward}
                onReject={handleReject}
                showTenderLink={false}
              />
            </TabsContent>
          </Tabs>
        ) : (
          // Contractor View: No Tabs, just show details directly
          <div className="space-y-4">
            <div className="flex justify-end">
              {role === "contractor" && !hasApplied && tender.status === "open" && (
                <Link href={`/tenders/${tender.id}/apply-bid`}>
                  <Button className="cursor-pointer">Apply Now</Button>
                </Link>
              )}
            </div>
            <Card>
              <CardContent className="pt-6">
                <ViewTenderDetails formData={tender as any} />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
