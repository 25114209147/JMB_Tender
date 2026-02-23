import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
// import { getCurrentUser } from "@/lib/auth"; 

import OwnerTenderList from "./components/owner/owner-tender-list";

export default async function TendersPage() {
  // const user = await getCurrentUser();
  // if (!user || user.role !== "owner") redirect("/dashboard");

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Tenders</h1>
          <p className="text-muted-foreground">Manage the tenders you have created</p>
        </div>
        <Link href="/tenders/create" className="cursor-pointer">
          <Button className="cursor-pointer">
            Create New Tender
          </Button>
        </Link>
      </div>

      <OwnerTenderList />
    </div>
  );
}
