import { CheckCircle, CircleDollarSign, Clock3, LayoutDashboard, type LucideIcon } from "lucide-react";

export type DashboardCardData = {
    title: string;
    value: number;
    icon: LucideIcon;
    link: string;
}

export const dashboardCardData: DashboardCardData[] = [
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