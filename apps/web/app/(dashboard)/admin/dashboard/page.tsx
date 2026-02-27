"use client"

import DashboardTemplate, { type DashboardConfig } from "@/components/dashboard/dashboard-template"
import { adminDashboardCards, adminAlertCards } from "@/data/dashboards/admin-dashboard"
import SummaryCards from "@/components/dashboard/dashboard-summary-card"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Settings } from "lucide-react"

export default function AdminDashboardPage() {
  const config: DashboardConfig = {
    title: "Admin Dashboard",
    description: "System overview and management",
    summaryCards: adminDashboardCards,
    primaryAction: {
      label: "System Settings",
      icon: <Settings className="w-4 h-4 mr-2" />,
      href: "/admin/settings",
    },
    sections: [
      {
        title: "Alerts & Actions",
        description: "Items requiring immediate attention",
        content: <SummaryCards data={adminAlertCards} columns={{ base: 1, md: 3, lg: 3 }} />,
      },
      {
        title: "System Health",
        description: "Real-time system monitoring",
        content: (
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>All systems operational</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Database</span>
                  <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full dark:bg-green-900/20 dark:text-green-300">
                    Online
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">API Services</span>
                  <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full dark:bg-green-900/20 dark:text-green-300">
                    Healthy
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Storage</span>
                  <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full dark:bg-blue-900/20 dark:text-blue-300">
                    78% Used
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
