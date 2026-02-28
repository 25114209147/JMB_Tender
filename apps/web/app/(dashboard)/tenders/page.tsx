"use client"

import { useRole } from "@/contexts/role-context"
import TenderListPage from "./components/shared/tender-list-page"

export default function TendersPage() {
  const { role } = useRole()

  const getDescription = () => {
    if (role === "admin") {
      return "View and manage all open tenders in the system"
    }
    if (role === "contractor") {
      return "Browse and apply for open tenders"
    }
    return "Browse all open tenders (you can only edit your own)"
  }

  return (
    <TenderListPage
      title="All Tenders"
      description={getDescription()}
      filters={{ status: "open" }} // Only show open tenders
      showCreateButton={true}
      showAllStatuses={false}
      JMBOnly={false}
    />
  )
}
