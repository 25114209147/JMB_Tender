"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Filter, X } from "lucide-react"
import { BidFiltersUnified } from "./bid-filters-unified"
import type { Bid } from "@/data/bids/bid-types"

interface BidFiltersMobileProps {
  searchQuery?: string
  onSearchChange?: (value: string) => void
  statusFilter: string
  tenderFilter?: string
  onStatusChange: (value: string) => void
  onTenderChange?: (value: string) => void
  onClearFilters: () => void
  allBids: Bid[]
  showTenderFilter?: boolean
  showSortBy?: boolean
  sortBy?: string
  onSortChange?: (value: string) => void
}

export function BidFiltersMobile({
  searchQuery,
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
}: BidFiltersMobileProps) {
  const [open, setOpen] = useState(false)
  const hasActiveFilters =
    statusFilter !== "all" || 
    (showTenderFilter && tenderFilter !== "all") ||
    (searchQuery && searchQuery.length > 0)

  return (
    <>
      {/* Mobile: Filter Button */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="sm:hidden gap-2 cursor-pointer">
            <Filter className="h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <span className="ml-1 rounded-full bg-primary text-primary-foreground text-xs px-1.5 py-0.5">
                {statusFilter !== "all" && showTenderFilter && tenderFilter !== "all" ? "2" : "1"}
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[80vh]">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
            <SheetDescription>
              Filter and sort bids to find what you're looking for
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <BidFiltersUnified
              searchQuery={searchQuery}
              onSearchChange={onSearchChange}
              statusFilter={statusFilter}
              tenderFilter={tenderFilter}
              onStatusChange={onStatusChange}
              onTenderChange={onTenderChange}
              onClearFilters={onClearFilters}
              allBids={allBids}
              showTenderFilter={showTenderFilter}
              showSortBy={showSortBy}
              sortBy={sortBy}
              onSortChange={onSortChange}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop: Inline Filters */}
      <div className="hidden sm:block w-full">
        <BidFiltersUnified
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          statusFilter={statusFilter}
          tenderFilter={tenderFilter}
          onStatusChange={onStatusChange}
          onTenderChange={onTenderChange}
          onClearFilters={onClearFilters}
          allBids={allBids}
          showTenderFilter={showTenderFilter}
          showSortBy={showSortBy}
          sortBy={sortBy}
          onSortChange={onSortChange}
        />
      </div>
    </>
  )
}
