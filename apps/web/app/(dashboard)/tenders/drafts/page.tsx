"use client"

import { useTenders } from "@/hooks/use-tenders"
import AllTendersList from "../components/shared/all-tenders-list"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function DraftTendersPage() {
  // Pass the status filter directly to the hook
  const { tenders, loading, error, refetch } = useTenders({ status: 'draft' })

  if (loading) return <LoadingSpinner message="Loading your drafts..." />
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Draft Tenders</h1>
        <p className="text-muted-foreground">Continue working on your unpublished tenders</p>
      </div>
      
      {/* Set showAllStatuses to true so it doesn't filter out drafts internally */}
      <AllTendersList 
        tenders={tenders} 
        showAllStatuses={true} 
        JMBOnly={true} 
      />
    </div>
  )
}