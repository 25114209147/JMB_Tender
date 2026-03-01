/**
 * Tender Details Component
 * Shows tender information for a bid
 */

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTender } from "@/hooks/use-tender"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ErrorMessage } from "@/components/ui/error-message"
import { FileText, MapPin, Calendar, DollarSign } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { Bid } from "@/data/bids/bid-types"

interface TenderDetailsProps {
  bid: Bid
}

export function TenderDetails({ bid }: TenderDetailsProps) {
  const { tender, loading, error } = useTender(bid.tender_id)

  if (loading) {
    return (
      <div className="py-4">
        <LoadingSpinner message="Loading tender details..." size="sm" />
      </div>
    )
  }

  if (error || !tender) {
    return (
      <div className="py-4">
        <ErrorMessage message={error || "Failed to load tender"} title="" />
      </div>
    )
  }

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Tender Information
          </CardTitle>
          <Link href={`/tenders/${tender.id}`}>
            <Button variant="outline" size="sm">
              View Full Tender
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Title</p>
          <p className="text-base font-semibold">{tender.title}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              Property
            </p>
            <p className="text-base">{tender.property_name}, {tender.property_city}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              Closing Date
            </p>
            <p className="text-base">{format(new Date(tender.closing_date), "MMM dd, yyyy")}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <DollarSign className="h-3.5 w-3.5" />
              Budget Range
            </p>
            <p className="text-base">
              RM {tender.min_budget.toLocaleString()} - {tender.max_budget.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Service Type</p>
            <p className="text-base">{tender.service_type}</p>
          </div>
        </div>
        {tender.description && (
          <div>
            <p className="text-sm font-medium text-muted-foreground">Description</p>
            <p className="text-base text-muted-foreground line-clamp-3">{tender.description}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
