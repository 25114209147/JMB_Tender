import { CheckCircle, CircleDollarSign, Clock3, LayoutDashboard } from "lucide-react";
import { type SummaryCardData } from "@/components/layout/dashboard-summary-card";

export const dashboardCardData: SummaryCardData[] = [
    {
        title: "Total Tenders",
        value: 12,
        icon: LayoutDashboard,
        link: "/owner/tenders",
    },
    {
        title: "Active Bids",
        value: 5,
        icon: CircleDollarSign,
        link: "/owner/bids",
    },
    {
        title: "Pending Review",
        value: 3,
        icon: Clock3,
        link: "/owner/review",
    },
    {
        title: "Completed",
        value: 4,
        icon: CheckCircle,
        link: "/owner/completed",
    }
]