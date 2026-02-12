import SummaryCards from "@/components/layout/dashboard-summary-card"
import DashboardBigCard from "@/components/layout/dashboard-big-card"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your dashboard</p>
      </div>
      <SummaryCards />
      <DashboardBigCard />
    </div>
  )
}
