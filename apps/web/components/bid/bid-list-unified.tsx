"use client"

import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { BidCard } from "@/components/bid/bid-card"
import { BidDetailDialog } from "@/components/bid/bid-detail-dialog"
import { Award, XCircle, FileText } from "lucide-react"
import type { Bid } from "@/data/bids/bid-types"

interface BidListUnifiedProps {
  bids: Bid[]
  statusFilter: string
  showActions?: boolean // Whether to show Award/Reject buttons
  role?: string | null
  processingId?: number | null
  onAward?: (bidId: number) => void
  onReject?: (bidId: number) => void
  showTenderLink?: boolean // Whether to show tender link in card
  fromPage?: 'all-bids' | 'my-bids' // Track where the user came from for proper back navigation
}

export function BidListUnified({
  bids,
  statusFilter,
  showActions = false,
  role,
  processingId,
  onAward,
  onReject,
  showTenderLink = false,
  fromPage,
}: BidListUnifiedProps) {
  if (bids.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title={statusFilter === "all" ? "No bids found" : `No ${statusFilter} bids`}
        description={
          statusFilter === "all"
            ? "There are no bids yet."
            : `There are no ${statusFilter} bids. Try adjusting your filters.`
        }
      />
    )
  }

  return (
    <div className="space-y-4 w-full">
      {bids.map((bid) => (
        <BidCard
          key={bid.id}
          bid={bid}
          showTenderLink={showTenderLink}
          collapsible={true}
          fromPage={fromPage}
          actions={
            <div className="flex flex-wrap items-center gap-2">
              {/* View Details Button - Always shown */}
              <BidDetailDialog bid={bid} />
              
              {/* Award/Reject buttons - Only shown when showActions is true */}
              {showActions &&
                (role === "admin" || role === "JMB") &&
                bid.status === "submitted" && (
                  <>
                    <Button
                      size="sm"
                      variant="default"
                      className="w-9 sm:w-auto px-0 sm:px-3 gap-1.5 cursor-pointer"
                      onClick={() => onAward?.(bid.id)}
                      disabled={processingId === bid.id}
                    >
                      <Award className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Award</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="w-9 sm:w-auto px-0 sm:px-3 gap-1.5 cursor-pointer text-white"
                      onClick={() => onReject?.(bid.id)}
                      disabled={processingId === bid.id}
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline text-white">Reject</span>
                    </Button>
                  </>
                )}
            </div>
          }
        />
      ))}
    </div>
  )
}
