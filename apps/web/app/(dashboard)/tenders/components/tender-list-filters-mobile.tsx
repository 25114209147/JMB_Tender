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
import { Filter } from "lucide-react"
import TenderListFilters from "./tender-list-filters"

interface TenderListFiltersMobileProps {
  search: string
  onSearchChange: (value: string) => void
  status: string
  onStatusChange: (value: string) => void
  sort: string
  onSortChange: (value: string) => void
}

export default function TenderListFiltersMobile({
  search,
  onSearchChange,
  status,
  onStatusChange,
  sort,
  onSortChange,
}: TenderListFiltersMobileProps) {
  const [open, setOpen] = useState(false)
  const hasActiveFilters = status !== "all" || search !== ""

  return (
    <>
      {/* Mobile: Filter Button */}
      <Sheet open={open} onOpenChange={setOpen} modal={false}>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="sm:hidden gap-2 cursor-pointer">
            <Filter className="h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <span className="ml-1 rounded-full bg-primary text-primary-foreground text-xs px-1.5 py-0.5">
                {status !== "all" && search ? "2" : "1"}
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[80vh]">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
            <SheetDescription>
              Filter and sort tenders to find what you're looking for
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <TenderListFilters
              search={search}
              onSearchChange={onSearchChange}
              status={status}
              onStatusChange={onStatusChange}
              sort={sort}
              onSortChange={onSortChange}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop: Inline Filters */}
      <div className="hidden sm:block w-full">
        <TenderListFilters
          search={search}
          onSearchChange={onSearchChange}
          status={status}
          onStatusChange={onStatusChange}
          sort={sort}
          onSortChange={onSortChange}
        />
      </div>
    </>
  )
}
