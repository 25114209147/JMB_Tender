"use client"

import DashboardTemplate, { type DashboardConfig } from "@/components/dashboard/dashboard-template"
import { contractorPerformanceCards } from "@/data/dashboards/contractor-dashboard"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Search, AlertCircle, User } from "lucide-react"
import Link from "next/link"
import SummaryCards from "@/components/dashboard/dashboard-summary-card"
import { useCurrentUser } from "@/hooks/use-current-user"
import { isContractorProfileComplete, getMissingProfileFields } from "@/lib/profile-utils"
import { useContractorDashboardCards } from "./components/contractor-summary-cards"
import { RecentActivitySection } from "./components/recent-activity-section"

export default function ContractorDashboardPage() {
  const { user, loading } = useCurrentUser()
  const profileComplete = isContractorProfileComplete(user)
  const missingFields = getMissingProfileFields(user)
  const dashboardCards = useContractorDashboardCards()

  const config: DashboardConfig = {
    title: "Contractor Dashboard",
    description: "Browse tenders and manage your bids",
    summaryCards: dashboardCards,
    primaryAction: {
      label: "Browse Tenders",
      icon: <Search className="w-4 h-4 mr-2" />,
      href: "/tenders",
    },
    sections: [
      // Only show Profile Completion if profile is incomplete
      ...(!loading && !profileComplete ? [{
        title: "Profile Completion",
        content: (
          <Alert variant="warning" className="mb-6 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertTitle className="text-yellow-800 dark:text-yellow-300">
              Complete Your Profile to Start Bidding
            </AlertTitle>
            <AlertDescription className="text-yellow-700 dark:text-yellow-400">
              <div>
                <p className="text-sm">
                  Missing information: <strong>{missingFields.join(", ")}</strong>
                </p>
                <Link href="/profile">
                  <Button variant="default" className="cursor-pointer mt-1">
                    <User className="mr-2 h-4 w-4" />
                    Complete Profile
                  </Button>
                </Link>
              </div>
            </AlertDescription>
          </Alert>
        ),
      }] : []),
      {
        title: "Recent Activity",
        description: "Your latest bid submissions",
        content: <RecentActivitySection />,
      },
    ],
  }

  return <DashboardTemplate config={config} />
}
