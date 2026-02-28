"use client"

import TenderListPage from "../../../tenders/components/shared/tender-list-page"
import type { Tender } from "@/data/tenders/tender-types"

export default function CompletedPage() {
  // Filter for completed tenders (awarded or closed)
  const completedFilter = (tender: Tender) => {
    return tender.status === "awarded" || tender.status === "closed"
  }

  return (
    <TenderListPage
      title="Completed Tenders"
      description="View awarded and closed tenders"
      filters={undefined}
      showCreateButton={false}
      showAllStatuses={true}
      JMBOnly={true}
      clientSideFilter={completedFilter}
    />
  )
}
