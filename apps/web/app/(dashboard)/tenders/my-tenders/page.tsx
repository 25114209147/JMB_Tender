"use client"

import TenderListPage from "../components/shared/tender-list-page"

export default function MyTendersPage() {
  return (
    <TenderListPage
      title="My Tenders"
      description="Manage the tenders you have created"
      useMyTendersHook={true}
      showCreateButton={true}
      showAllStatuses={true}
      JMBOnly={true}
    />
  )
}
