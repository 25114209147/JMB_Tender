/**
 * TenderCard Component
 * 
 * Unified reusable card for displaying tender information
 * Supports both simple and collapsible modes
 * Used across all tender lists
 */

"use client"

import { useState, type ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { 
  MapPin, 
  Calendar, 
  DollarSign, 
  Eye, 
  Edit, 
  Clock,
  ChevronDown,
  ChevronUp,
  Users,
  Trophy
} from "lucide-react"
import Link from "next/link"
import type { Tender } from "@/data/tenders/tender-types"
import { formatDistanceToNow, format, parseISO } from "date-fns"
import { cn } from "@/lib/utils"
import CountdownTimer from "./countdown-timer"

interface TenderCardProps {
  tender: Tender
  showStatus?: boolean
  showActions?: boolean
  viewHref?: string // Optional custom view href (defaults to /tenders/{id})
  actions?: ReactNode // Custom actions to display
  collapsible?: boolean // Enable collapsible mode (like in all-tenders-list)
}

export function TenderCard({ 
  tender, 
  showStatus = true, 
  showActions = false,
  viewHref,
  actions,
  collapsible = false
}: TenderCardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const defaultViewHref = viewHref || `/tenders/${tender.id}`
  const statusColors = {
    draft: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800",
    open: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800",
    closed: "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700",
    awarded: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800",
    cancelled: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800",
  }

  const getClosingStatus = () => {
    try {
      const closingDate = parseISO(tender.closing_date)
      const now = new Date()
      const daysUntilClose = Math.ceil((closingDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      
      if (daysUntilClose < 0) return { text: "Closed", color: "text-gray-500" }
      if (daysUntilClose === 0) return { text: "Closes today", color: "text-red-600" }
      if (daysUntilClose === 1) return { text: "Closes tomorrow", color: "text-orange-600" }
      if (daysUntilClose <= 7) return { text: `Closes in ${daysUntilClose} days`, color: "text-orange-500" }
      return { text: `Closes in ${daysUntilClose} days`, color: "text-muted-foreground" }
    } catch (error) {
      console.error("Error parsing closing date:", error)
      return { text: "Invalid date", color: "text-gray-500" }
    }
  }

  const closingStatus = getClosingStatus()

  // Collapsible mode (for all-tenders-list)
  if (collapsible) {
    return (
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CardContent className="p-5">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-4">
                {/* Left: Status + Title + Quick Stats */}
                <div className="flex-1 min-w-0 flex items-center gap-3">
                  {showStatus && (
                    <Badge
                      className={cn(
                        statusColors[tender.status as keyof typeof statusColors] || statusColors.closed,
                        "shrink-0 text-xs px-2 py-0.5 font-medium"
                      )}
                    >
                      {tender.status.toUpperCase()}
                    </Badge>
                  )}

                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold line-clamp-1">{tender.title}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {tender.property_name}
                    </p>
                  </div>

                  {/* Quick stats inline - only when collapsed */}
                  {!isOpen && (
                    <div className="hidden lg:flex items-center gap-4 text-sm">
                      <Badge variant="secondary">{tender.service_type}</Badge>
                      <div className="flex items-center gap-1.5">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{tender.total_bids ?? 0}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right: Actions + Expand */}
                <div className="flex items-center gap-2 shrink-0">
                  <Link href={defaultViewHref}>
                    <Button variant="outline" size="sm" className="gap-1.5 cursor-pointer">
                      <Eye className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">View</span>
                    </Button>
                  </Link>

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
                {/* Info Grid: Bids and Budget */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Total Bids</p>
                      <p className="text-base font-semibold">{tender.total_bids ?? 0}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                      <DollarSign className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-muted-foreground">Budget Range</p>
                      <p className="text-sm font-semibold truncate">
                        RM {Number(tender.min_budget).toLocaleString()} - {Number(tender.max_budget).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                      <Trophy className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-muted-foreground">Highest Bid</p>
                      <p className="text-sm font-semibold truncate">
                        RM {tender.highest_bid?.toLocaleString() ?? 0}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Additional Details */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t">
                  <div className="flex flex-wrap items-center gap-3">
                    {tender.closing_date && tender.closing_date.trim() ? (
                      <CountdownTimer 
                        closingDate={tender.closing_date} 
                        closingTime={tender.closing_time || undefined} 
                      />
                    ) : (
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        <span>No closing date specified</span>
                      </div>
                    )}
                    <Badge variant="secondary">{tender.service_type}</Badge>
                  </div>

                  {tender.tender_fee && tender.tender_fee > 0 && (
                    <Badge variant="outline" className="self-start sm:self-center">
                      Fee: RM {tender.tender_fee.toLocaleString()}
                    </Badge>
                  )}
                </div>
              </CollapsibleContent>
            </div>
          </CardContent>
        </Collapsible>
      </Card>
    )
  }

  // Simple mode (for completed page, etc.)
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                {showStatus && (
                  <Badge className={cn(statusColors[tender.status as keyof typeof statusColors] || statusColors.closed)}>
                    {tender.status.toUpperCase()}
                  </Badge>
                )}
                <Badge variant="outline">{tender.service_type}</Badge>
              </div>
              <h3 className="text-lg font-semibold line-clamp-2 mb-1">
                {tender.title}
              </h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                <span className="line-clamp-1">
                  {tender.property_name}, {tender.property_city}
                </span>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex gap-2">
              {showActions && tender.status === "draft" && (
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/tenders/${tender.id}/edit`}>
                    <Edit className="h-4 w-4" />
                  </Link>
                </Button>
              )}
              <Button size="sm" variant="outline" asChild>
                <Link href={defaultViewHref}>
                  <Eye className="h-4 w-4" />
                </Link>
              </Button>
              {actions}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Budget</p>
                <p className="font-medium">
                  RM {tender.min_budget.toLocaleString()} - {tender.max_budget.toLocaleString()}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Closing Date</p>
                <p className={`font-medium ${closingStatus.color}`}>
                  {format(parseISO(tender.closing_date), "MMM dd, yyyy")}
                </p>
              </div>
            </div>
          </div>

          {/* Closing Status for Open Tenders */}
          {tender.status === "open" && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className={`h-4 w-4 ${closingStatus.color}`} />
              <span className={closingStatus.color}>{closingStatus.text}</span>
            </div>
          )}

          {/* Footer - Created Date */}
          <div className="text-xs text-muted-foreground border-t pt-3">
            Created {formatDistanceToNow(parseISO(tender.created_at), { addSuffix: true })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
