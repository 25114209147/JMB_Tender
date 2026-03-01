/**
 * Recent Activity Section for Admin Dashboard
 * Shows recent system activity
 */

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function RecentActivitySection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest system activity and events</CardDescription>
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
  )
}
