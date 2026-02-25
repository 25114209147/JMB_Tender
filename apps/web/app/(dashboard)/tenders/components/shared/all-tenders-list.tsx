"use client"

import { useMemo } from "react"
import { mockTenders } from "@/data/tenders"
import { mockBids } from "@/data/bids"
import TenderList from "./tender-list"
import TenderCard from "./tender-card"
import type { Tender } from "@/data/tenders"
import { useRole } from "@/contexts/role-context"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Edit, MoreVertical, Trash2, CheckCircle2 } from "lucide-react"
import Link from "next/link"

interface AllTendersListProps {
  showAllStatuses?: boolean
  ownerOnly?: boolean // If true, only show tenders belonging to the current owner
}

export default function AllTendersList({ 
  showAllStatuses = false,
  ownerOnly = false
}: AllTendersListProps = {}) {
  const { role } = useRole()
  
  // Mock function to check if current contractor has applied to a tender
  // In production, this would check against the current user's ID
  const hasContractorApplied = (tenderId: string): boolean => {
    // Mock: Check if there's a bid for this tender
    // In production: filter by current contractor's user ID
    return mockBids.some(bid => bid.tender_id === tenderId)
  }

  // Mock function to check if tender belongs to current owner
  // In production, this would check: tender.owner_id === currentUser.id
  const isOwnerTender = (tender: Tender): boolean => {
    // Mock: For demo purposes, show all tenders as owner's tenders when ownerOnly is true
    // In production: return tender.owner_id === currentUser.id
    if (ownerOnly) {
      return true // For "My Tenders", show all tenders (in production, filter by owner_id)
    }
    // For "All Tenders", use the same mock logic (IDs "1" and "2")
    return tender.id === "1" || tender.id === "2"
  }
  
  // Filter tenders based on showAllStatuses and ownerOnly props
  const filteredTenders = useMemo(() => {
    let tenders = mockTenders
    
    // Filter by owner if ownerOnly is true
    if (ownerOnly) {
      // In production: tenders = mockTenders.filter(t => t.owner_id === currentUser.id)
      tenders = mockTenders // Mock: show all for now
    }
    
    // Filter by status
    if (!showAllStatuses) {
      tenders = tenders.filter((tender) => tender.status === "open")
    }
    
    return tenders
  }, [showAllStatuses, ownerOnly])

  const renderTenderCard = (tender: Tender) => {
    // Admin: Can view and edit all open tenders
    if (role === "admin") {
      const canEdit = tender.status === "open" || tender.status === "draft"
      const actions = canEdit ? (
        <>
          <Link href={`/tenders/${tender.id}/edit`}>
            <Button size="sm" className="gap-1.5 cursor-pointer">
              <Edit className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Edit</span>
            </Button>
          </Link>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem className="cursor-pointer">Duplicate</DropdownMenuItem>
              <DropdownMenuItem disabled>Export PDF</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : null

      return <TenderCard tender={tender} viewHref={`/tenders/${tender.id}`} actions={actions} />
    }

    // Contractor: Can view or apply (if not yet applied)
    if (role === "contractor") {
      if (tender.status === "open") {
        const hasApplied = hasContractorApplied(tender.id)
        const actions = hasApplied ? (
          <Button size="sm" variant="outline" disabled className="gap-1.5 cursor-not-allowed">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Applied</span>
            <span className="sm:hidden">Applied</span>
          </Button>
        ) : (
          <Link href={`/tenders/${tender.id}/apply`}>
            <Button size="sm" className="gap-1.5 cursor-pointer">
              <span className="hidden sm:inline">Apply</span>
              <span className="sm:hidden">Apply</span>
            </Button>
          </Link>
        )

        return <TenderCard tender={tender} viewHref={`/tenders/${tender.id}`} actions={actions} />
      }
      // For non-open tenders, contractor can only view
      return <TenderCard tender={tender} viewHref={`/tenders/${tender.id}`} />
    }

    // Owner: Different behavior for "My Tenders" vs "All Tenders"
    if (role === "owner") {
      const isOwnTender = isOwnerTender(tender)
      
      // For "My Tenders" (ownerOnly=true), show edit for all tenders (all statuses)
      // For "All Tenders" (ownerOnly=false), only show edit for own tenders
      const canEdit = ownerOnly 
        ? (tender.status === "open" || tender.status === "draft") // My Tenders: edit all own tenders
        : isOwnTender && (tender.status === "open" || tender.status === "draft") // All Tenders: edit only own
      
      const actions = canEdit ? (
        <>
          <Link href={`/tenders/${tender.id}/edit`}>
            <Button size="sm" className="gap-1.5 cursor-pointer">
              <Edit className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Edit</span>
            </Button>
          </Link>
          {ownerOnly && ( // Show dropdown menu only in "My Tenders"
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem className="cursor-pointer">Duplicate</DropdownMenuItem>
                <DropdownMenuItem disabled>Export PDF</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </>
      ) : null

      return <TenderCard tender={tender} viewHref={`/tenders/${tender.id}`} actions={actions} />
    }

    // Fallback: Just view
    return <TenderCard tender={tender} viewHref={`/tenders/${tender.id}`} />
  }

  const emptyState = (
    <div className="rounded-lg border border-dashed p-12 text-center">
      <p className="mb-4 text-muted-foreground">
        {ownerOnly
          ? "You haven't created any tenders yet"
          : showAllStatuses 
          ? "No tenders available at the moment" 
          : "No open tenders available at the moment"}
      </p>
      <p className="text-sm text-muted-foreground">
        {ownerOnly
          ? "Create your first tender to get started"
          : "Check back later for new opportunities"}
      </p>
    </div>
  )

  return <TenderList tenders={filteredTenders} renderCard={renderTenderCard} emptyState={emptyState} />
}
