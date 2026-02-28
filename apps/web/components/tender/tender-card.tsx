/**
 * TenderCard Component
 * 
 * Reusable card for displaying tender information
 * Used across draft, active, and completed tender lists
 */

"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  MapPin, 
  Calendar, 
  DollarSign, 
  Eye, 
  Edit, 
  Trash2,
  Clock
} from "lucide-react"
import Link from "next/link"
import type { Tender } from "@/data/tenders/tender-types"
import { formatDistanceToNow, format, parseISO } from "date-fns"

interface TenderCardProps {
  tender: Tender
  showStatus?: boolean
  showActions?: boolean
}

export function TenderCard({ tender, showStatus = true, showActions = false }: TenderCardProps) {
  const statusColors = {
    draft: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300",
    open: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300",
    closed: "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-200",
    awarded: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300",
    cancelled: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300",
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

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                {showStatus && (
                  <Badge className={statusColors[tender.status]}>
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
                <Link href={`/tenders/${tender.id}`}>
                  <Eye className="h-4 w-4" />
                </Link>
              </Button>
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
