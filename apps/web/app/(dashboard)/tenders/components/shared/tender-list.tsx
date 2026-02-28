"use client"

import { useMemo, useState, ReactNode } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tender } from "@/data/tenders"
import TenderListFilters from "./tender-list-filters"

interface TenderListProps {
  tenders: Tender[]
  renderCard: (tender: Tender) => ReactNode
  emptyState?: ReactNode
}

export default function TenderList({ tenders, renderCard, emptyState }: TenderListProps) {
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("all")
  const [sort, setSort] = useState("closing_date")

  const filtered = useMemo(() => {
    let list = [...tenders]

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.property_name.toLowerCase().includes(q) ||
          t.service_type.toLowerCase().includes(q)
      )
    }

    // Status filter
    if (status !== "all") {
      list = list.filter((t) => t.status === status)
    }

    // Sort
    list.sort((a, b) => {
      if (sort === "closing_date") {
        return new Date(a.closing_date).getTime() - new Date(b.closing_date).getTime()
      }
      if (sort === "bids") {
        return (b?.total_bids || 0) - (a?.total_bids || 0)
      }
      if (sort === "created") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
      return 0
    })

    return list
  }, [tenders, search, status, sort])

  const defaultEmptyState = (
    <div className="rounded-lg border p-12 text-center">
      <p className="mb-4 text-muted-foreground">No tenders available at the moment.</p>
      <Link href="/tenders/create" className="cursor-pointer">
        <Button className="cursor-pointer">Create Tender</Button>
      </Link>
    </div>
  )

  return (
    <div className="space-y-6 w-full">
      <TenderListFilters
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        sort={sort}
        onSortChange={setSort}
      />

      {filtered.length === 0 ? (
        emptyState || defaultEmptyState
      ) : (
        <div className="grid gap-8">
          {filtered.map((tender) => (
            <div key={tender.id}>{renderCard(tender)}</div>
          ))}
        </div>
      )}
    </div>
  )
}
