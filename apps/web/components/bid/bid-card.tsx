"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Eye, DollarSign, Calendar, Building2, Clock, CheckCircle2, XCircle, AlertCircle, ChevronDown, ChevronUp } from "lucide-react"
import Link from "next/link"
import type { Bid } from "@/data/bids/bid-types"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface BidCardProps {
  bid: Bid
  showTenderLink?: boolean
  actions?: React.ReactNode
  collapsible?: boolean 
  fromPage?: 'all-bids' | 'my-bids' //For back navigation from view tender details
}

export function BidCard({ bid, showTenderLink = true, actions, collapsible = false, fromPage }: BidCardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const tenderLink = fromPage ? `/tenders/${bid.tender_id}?from=${fromPage}` : `/tenders/${bid.tender_id}`
  const statusColors = {
    submitted: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800",
    awarded: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800",
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

  // Collapsible mode for mobile
  if (collapsible) {
    return (
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CardContent className="p-5">
            <div className="flex flex-col gap-2">
              {/* Top Row: Status + Company + Actions */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0 flex items-center gap-3">
                  <Badge
                    className={cn(
                      statusColors[bid.status] || statusColors.submitted,
                      "shrink-0 text-xs px-2 py-0.5 font-medium flex items-center gap-1"
                    )}
                  >
                    <StatusIcon className="h-3 w-3" />
                    {bid.status.toUpperCase()}
                  </Badge>
                  
                  <TooltipProvider>
                    <div className="flex-1 min-w-0">
                      <Tooltip delayDuration={300}>
                        <TooltipTrigger asChild>
                          <p className="text-sm font-semibold line-clamp-1 cursor-default">{bid.company_name}</p>
                        </TooltipTrigger>
                        {bid.company_name && bid.company_name.length > 30 && (
                          <TooltipContent side="top">
                            <p className="text-sm max-w-[300px]">{bid.company_name}</p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                      {showTenderLink && (
                        <Tooltip delayDuration={300}>
                          <TooltipTrigger asChild>
                            <p className="text-xs text-muted-foreground line-clamp-1 cursor-default">{bid.tender_title}</p>
                          </TooltipTrigger>
                          {bid.tender_title && bid.tender_title.length > 40 && (
                            <TooltipContent side="top">
                              <p className="text-sm max-w-[300px]">{bid.tender_title}</p>
                            </TooltipContent>
                          )}
                        </Tooltip>
                      )}
                    </div>
                  </TooltipProvider>

                  {/* Quick amount display when collapsed */}
                  {!isOpen && (
                    <div className="hidden sm:flex items-center gap-1.5">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold text-sm">RM {bid.proposed_amount.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                {/* Right: Actions + Expand */}
                <div className="flex items-center gap-2 shrink-0">
                  {showTenderLink && (
                    <Link href={tenderLink}>
                      <Button variant="outline" size="sm" className="gap-1.5 cursor-pointer">
                        <Eye className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">View Tender</span>
                      </Button>
                    </Link>
                  )}
                  
                  {actions}

                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
                      {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </CollapsibleTrigger>
                </div>
              </div>

              {/* Expandable Content */}
              <CollapsibleContent className="space-y-3">
                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                      <DollarSign className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Proposed Amount</p>
                      <p className="text-base font-semibold">
                        RM {bid.proposed_amount.toLocaleString()}
                        {bid.include_sst && <span className="text-xs text-muted-foreground ml-1">(incl. SST)</span>}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Submitted</p>
                      <p className="text-base font-semibold">
                        {format(new Date(bid.created_at), "MMM dd, yyyy")}
                      </p>
                    </div>
                  </div>

                  {bid.proposed_timeline && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Timeline</p>
                        <p className="text-base font-semibold">{bid.proposed_timeline} days</p>
                      </div>
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </div>
          </CardContent>
        </Collapsible>
      </Card>
    )
  }

  // Simple mode (non-collapsible)
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md w-full">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col gap-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1 min-w-0 w-full sm:w-auto">
              <div className="flex flex-wrap items-center gap-2 mb-2">
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
                  <h3 className="text-base sm:text-lg font-semibold line-clamp-2 break-words">{bid.tender_title}</h3>
                )}
              </div>
              <p className="text-sm text-muted-foreground flex items-center gap-1 break-words">
                <Building2 className="h-3.5 w-3.5 shrink-0" /> <span className="truncate">{bid.company_name}</span>
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 shrink-0 w-full sm:w-auto">
              {showTenderLink && (
                <Link href={tenderLink} className="w-full sm:w-auto">
                  <Button variant="outline" size="sm" className="gap-1.5 cursor-pointer w-full sm:w-auto">
                    <Eye className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">View Tender</span>
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
