"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, DollarSign, Calendar, Building2, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import type { Bid } from "@/data/bids/bid-types"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface BidCardProps {
  bid: Bid
  showTenderLink?: boolean
  actions?: React.ReactNode
}

export function BidCard({ bid, showTenderLink = true, actions }: BidCardProps) {
  console.log("Rendering BidCard with bid:", bid)
  const statusColors = {
    submitted: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800",
    awarded: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800",
    rejected: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800",
    withdrawn: "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700",
  }

  const statusIcons = {
    submitted: Clock,
    awarded: CheckCircle2,
    rejected: XCircle,
    withdrawn: AlertCircle,
  }

  const StatusIcon = statusIcons[bid.status] || Clock

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Badge
                  className={cn(
                    statusColors[bid.status] || statusColors.submitted,
                    "shrink-0 text-xs px-2 py-0.5 font-medium w-fit flex items-center gap-1"
                  )}
                >
                  <StatusIcon className="h-3 w-3" />
                  {bid.status.toUpperCase()}
                </Badge>
                {showTenderLink && (
                  <h3 className="text-lg font-semibold line-clamp-2">{bid.tender_title}</h3>
                )}
              </div>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5" /> {bid.company_name}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {showTenderLink && (
                <Link href={`/tenders/${bid.tender_id}`}>
                  <Button variant="outline" size="sm" className="gap-1.5 cursor-pointer">
                    <Eye className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">View</span>
                  </Button>
                </Link>
              )}
              {actions}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                <DollarSign className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Proposed Amount</p>
                <p className="text-base font-semibold">
                  RM {bid.proposed_amount.toLocaleString()}
                  {bid.include_sst && <span className="text-xs text-muted-foreground ml-1">(incl. SST)</span>}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Submitted</p>
                <p className="text-base font-semibold">
                  {format(new Date(bid.created_at), "MMM dd, yyyy")}
                </p>
              </div>
            </div>
            {bid.proposed_timeline && (
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Timeline</p>
                  <p className="text-base font-semibold">{bid.proposed_timeline}</p>
                </div>
              </div>
            )}
          </div>

          {/* Additional Info */}
          {(bid.payment_terms || bid.validity_period_days) && (
            <div className="flex flex-wrap items-center gap-4 pt-2 border-t text-sm text-muted-foreground">
              {bid.payment_terms && (
                <span>Payment: {bid.payment_terms}</span>
              )}
              {bid.validity_period_days && (
                <span>Validity: {bid.validity_period_days || 0} days</span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
