"use client"

import TenderListPage from "../../tenders/components/shared/tender-list-page"

export default function DraftsPage() {
  return (
    <TenderListPage
      title="Draft Tenders"
      description="Manage and publish your draft tenders"
      filters={{ status: "draft" }}
      showCreateButton={true}
      showAllStatuses={true}
      JMBOnly={true}
    />
  )
}
