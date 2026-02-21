import SummaryCards from "@/components/layout/dashboard-summary-card"
import DashboardBigCard from "@/components/layout/dashboard-big-card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-row gap-2 justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your dashboard</p>
        </div>
        <div>
          <Button variant="default" className="hover:cursor-pointer">
            <Plus className="w-4 h-4" /> 
            New Tender
          </Button>
        </div>
      </div>
      <SummaryCards />
      <DashboardBigCard />
    </div>
  )
}
