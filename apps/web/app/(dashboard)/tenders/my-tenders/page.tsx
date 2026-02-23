"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import AllTendersList from "../components/shared/all-tenders-list"
import { hasPermission } from "@/lib/roles"
import { useRole } from "@/contexts/role-context"

export default function MyTendersPage() {
  const { role } = useRole()
  const canCreate = hasPermission(role, "tenders:create")

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Tenders</h1>
          <p className="text-muted-foreground">Manage the tenders you have created</p>
        </div>
        {canCreate && (
          <Link href="/tenders/create" className="cursor-pointer">
            <Button className="cursor-pointer">Create New Tender</Button>
          </Link>
        )}
      </div>
      <AllTendersList showAllStatuses={true} ownerOnly={true} />
    </div>
  )
}
