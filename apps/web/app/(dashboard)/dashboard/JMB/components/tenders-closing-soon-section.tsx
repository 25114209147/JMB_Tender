/**
 * Tenders Closing Soon Section Component
 * 
 * Displays tenders closing within 7 days
 */

"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, AlertTriangle, Loader2, AlertCircle, ArrowRight, Plus } from "lucide-react"
import Link from "next/link"
import { differenceInDays, parseISO } from "date-fns"
import { useDashboardStats } from "@/hooks/use-dashboard-stats"
import getStatusBadge from "./get-status"

export function TendersClosingSoonSection() {
  const { stats, loading, error, refetch } = useDashboardStats()
  const now = new Date()

  const getUrgencyIndicator = (closingDate: string) => {
    const daysUntil = differenceInDays(parseISO(closingDate), now)
    if (daysUntil <= 2) {
      return (
        <div className="flex items-center gap-1 text-red-600">
          <AlertTriangle className="h-4 w-4" />
          <span className="text-xs font-medium">Urgent</span>
        </div>
      )
    } else if (daysUntil <= 5) {
      return (
        <div className="flex items-center gap-1 text-orange-600">
          <Clock className="h-4 w-4" />
          <span className="text-xs font-medium">Soon</span>
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Tenders Closing Soon</CardTitle>
            <CardDescription>
              {loading ? (
                "Loading..."
              ) : stats?.tenders_closing_soon && stats.tenders_closing_soon.length > 0 ? (
                `${stats.tenders_closing_soon.length} ${stats.tenders_closing_soon.length === 1 ? "tender" : "tenders"} closing within 7 days`
              ) : (
                "No tenders closing soon"
              )}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-3 text-muted-foreground">Loading dashboard data...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <AlertCircle className="h-12 w-12 text-red-500" />
            <h3 className="mt-4 text-lg font-semibold text-red-700">
              Failed to load dashboard
            </h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-md">
              {error}
            </p>
            <Button 
              onClick={() => refetch()} 
              variant="outline" 
              className="mt-4"
            >
              Try Again
            </Button>
          </div>
        ) : stats?.tenders_closing_soon && stats.tenders_closing_soon.length > 0 ? (
          <div className="space-y-3">
            {stats.tenders_closing_soon.slice(0, 5).map((tender) => {
              const closingDate = parseISO(tender.closing_date)
              const daysUntil = differenceInDays(closingDate, now)
              const timeText =
                daysUntil === 0
                  ? "Today"
                  : daysUntil === 1
                    ? "Tomorrow"
                    : `in ${daysUntil} days`

              return (
                <Link
                  key={tender.id}
                  href={`/tenders/${tender.id}`}
                  className="block"
                >
                  <div className="group flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-accent">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium group-hover:text-primary">
                          {tender.title}
                        </p>
                        {getUrgencyIndicator(tender.closing_date)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Closes {timeText}
                        </span>
                        <span>•</span>
                        <span>{tender.service_type}</span>
                        <span>•</span>
                        <span>{tender.property_name}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(tender.status)}
                      <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                  </div>
                </Link>
              )
            })}
            {stats.tenders_closing_soon.length > 5 && (
              <div className="text-center pt-2">
                <Link href="/JMB/tenders">
                  <Button variant="outline" size="sm">
                    View All {stats.tenders_closing_soon.length} Tenders
                  </Button>
                </Link>
              </div>
            )}
          </div>
        ) : !loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Clock className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">
              No tenders closing soon
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              All your tenders have enough time before closing
            </p>
            <Link href="/tenders/create">
              <Button className="mt-4 cursor-pointer">
                <Plus className="mr-2 h-4 w-4" />
                Create Tender
              </Button>
            </Link>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
