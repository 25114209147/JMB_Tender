"use client"

import { useRole } from "@/contexts/role-context"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import AllTendersList from "./components/shared/all-tenders-list"
import { hasPermission } from "@/lib/roles"

export default function TendersPage() {
  const { role } = useRole()
  const canCreate = hasPermission(role, "tenders:create")

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Tenders</h1>
          <p className="text-muted-foreground">
            {role === "admin" 
              ? "View and manage all open tenders in the system"
              : role === "contractor"
              ? "Browse and apply for open tenders"
              : "Browse all open tenders (you can only edit your own)"}
          </p>
        </div>
        {canCreate && (
          <Link href="/tenders/create" className="cursor-pointer">
            <Button className="cursor-pointer">Create Tender</Button>
          </Link>
        )}
      </div>
      <AllTendersList showAllStatuses={false} />
    </div>
  )
}
