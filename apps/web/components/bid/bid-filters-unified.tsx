"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { X, Search } from "lucide-react"
import type { Bid } from "@/data/bids/bid-types"

interface BidFiltersUnifiedProps {
  searchQuery?: string
  onSearchChange?: (value: string) => void
  statusFilter: string
  tenderFilter?: string // Optional - only shown when showTenderFilter is true
  onStatusChange: (value: string) => void
  onTenderChange?: (value: string) => void // Optional
  onClearFilters: () => void
  allBids: Bid[]
  showTenderFilter?: boolean // Whether to show tender filter (for All Bids page)
  showSortBy?: boolean // Whether to show sort options (for Tender detail page)
  sortBy?: string
  onSortChange?: (value: string) => void
}

export function BidFiltersUnified({
  searchQuery = "",
  onSearchChange,
  statusFilter,
  tenderFilter,
  onStatusChange,
  onTenderChange,
  onClearFilters,
  allBids,
  showTenderFilter = false,
  showSortBy = false,
  sortBy,
  onSortChange,
}: BidFiltersUnifiedProps) {
  // Get unique tender IDs with their titles (only if showTenderFilter is true)
  const tenderOptions = showTenderFilter
    ? Array.from(
        new Map(
          allBids.map((bid) => [
            bid.tender_id,
            bid.tender_title || `Tender #${bid.tender_id}`,
          ])
        ).entries()
      ).map(([id, title]) => ({ id, title }))
    : []

  const hasActiveFilters =
    statusFilter !== "all" || 
    (showTenderFilter && tenderFilter !== "all") ||
    searchQuery !== ""

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Search Bar - First Priority */}
      {/* {onSearchChange && (
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none z-10" />
          <Input
            placeholder="Search by company name, tender title..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
      )} */}

      {/* Filters Row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center w-full">
        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="w-full sm:w-fit sm:min-w-[180px] whitespace-nowrap gap-3 shrink-0">
            <div className="max-w-[300px] sm:max-w-[500px] overflow-hidden">
        <SelectValue placeholder="All Tenders" />
      </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="submitted">Submitted</SelectItem>
            <SelectItem value="awarded">Awarded</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="withdrawn">Withdrawn</SelectItem>
          </SelectContent>
        </Select>

        {/* Tender Filter - Only shown for All Bids */}
        {showTenderFilter && tenderOptions.length > 0 && onTenderChange && (
          <TooltipProvider>
            <Select value={tenderFilter || "all"} onValueChange={onTenderChange}>
              <SelectTrigger className="w-full sm:w-[220px] shrink-0">
                <SelectValue placeholder="All Tenders" />
              </SelectTrigger>
              <SelectContent className="max-w-[min(90vw,400px)]">
                <SelectItem value="all">All Tenders</SelectItem>
                {tenderOptions.map(({ id, title }) => {
                  const isLong = title.length > 50
                  return (
                    <Tooltip key={id} delayDuration={300}>
                      <TooltipTrigger asChild>
                        <SelectItem value={String(id)} className="max-w-full">
                          <span className="block truncate max-w-[min(70vw,350px)]">
                            {title}
                          </span>
                        </SelectItem>
                      </TooltipTrigger>
                      {isLong && (
                        <TooltipContent side="right" className="max-w-[400px]">
                          <p className="text-sm">{title}</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  )
                })}
              </SelectContent>
            </Select>
          </TooltipProvider>
        )}

        {/* Sort By - Only shown for Tender detail page */}
        {showSortBy && sortBy && onSortChange && (
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-fit sm:w-[180px] shrink-0">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">Newest First</SelectItem>
              <SelectItem value="date-asc">Oldest First</SelectItem>
              <SelectItem value="amount-asc">Amount: Low to High</SelectItem>
              <SelectItem value="amount-desc">Amount: High to Low</SelectItem>
            </SelectContent>
          </Select>
        )}

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="gap-2 cursor-pointer shrink-0 w-full sm:w-auto"
        >
          <X className="h-4 w-4" />
          Clear filters
        </Button>
      )}
      </div>
    </div>
  )
}
