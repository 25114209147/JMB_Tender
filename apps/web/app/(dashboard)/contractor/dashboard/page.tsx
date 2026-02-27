"use client"

import DashboardTemplate, { type DashboardConfig } from "@/components/dashboard/dashboard-template"
import { contractorDashboardCards, contractorPerformanceCards } from "@/data/dashboards/contractor-dashboard"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Search } from "lucide-react"
import SummaryCards from "@/components/dashboard/dashboard-summary-card"

export default function ContractorDashboardPage() {
  const config: DashboardConfig = {
    title: "Contractor Dashboard",
    description: "Browse tenders and manage your bids",
    summaryCards: contractorDashboardCards,
    primaryAction: {
      label: "Browse Tenders",
      icon: <Search className="w-4 h-4 mr-2" />,
      href: "/tenders",
    },
    sections: [
      {
        title: "Performance Metrics",
        description: "Your bidding performance overview",
        content: <SummaryCards data={contractorPerformanceCards} columns={{ base: 1, md: 2, lg: 2 }} />,
      },
      {
        title: "Recent Activity",
        description: "Your latest bid submissions",
        content: (
          <Card>
            <CardHeader>
              <CardTitle>Recent Bids</CardTitle>
              <CardDescription>Bids you've submitted in the last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Swimming Pool Maintenance</p>
                    <p className="text-sm text-muted-foreground">Submitted 2 days ago</p>
                  </div>
                  <span className="px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full dark:bg-yellow-900/20 dark:text-yellow-300">
                    Pending
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ),
      },
    ],
  }

  return <DashboardTemplate config={config} />
}
