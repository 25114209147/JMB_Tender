"use client"

import DashboardTemplate, { type DashboardConfig } from "@/components/dashboard/dashboard-template"
import { JMBDashboardCards } from "@/data/dashboards/JMB-dashboard"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Plus } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function OwnerDashboardPage() {
  const config: DashboardConfig = {
    title: "Owner Dashboard",
    description: "Manage your tenders and track bids",
    summaryCards: JMBDashboardCards,
    primaryAction: {
      label: "Create New Tender",
      icon: <Plus className="w-4 h-4 mr-2" />,
      href: "/tenders/create",
    },
    sections: [
      {
        title: "Recent Activity",
        description: "Your latest tender activities",
        content: (
          <Card>
            <CardHeader>
              <CardTitle>Recent Tenders</CardTitle>
              <CardDescription>Tenders you've created or updated recently</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Security Services Contract 2026</p>
                    <p className="text-sm text-muted-foreground">Updated 2 days ago</p>
                  </div>
                  <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full dark:bg-green-900/20 dark:text-green-300">
                    Open
                  </span>
                </div>
                <div className="text-center pt-2">
                  <Link href="/tenders">
                    <Button variant="outline" className="cursor-pointer">
                      View All Tenders
                    </Button>
                  </Link>
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
