import SummaryCards from "@/components/layout/dashboard-summary-card"
import { allBidsCardData } from "@/data/bids"
import DashboardBigCard from "@/components/layout/dashboard-big-card"

export default function AllBidsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">All Bids</h1>
        <p className="text-muted-foreground">View and manage all your bids</p>
      </div>
      <SummaryCards data={allBidsCardData} />
      <DashboardBigCard />    
    </div>
  )
}

