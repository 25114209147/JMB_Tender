import { Users, CheckCircle, Clock, XCircle } from "lucide-react";
import { type SummaryCardData } from "@/components/layout/dashboard-summary-card";

export const allBidsCardData: SummaryCardData[] = [
    {
        title: "Total Bids",
        value: 45,
        icon: Users,
        link: "/all-bids",
    },
    {
        title: "Accepted Bids",
        value: 12,
        icon: CheckCircle,
        link: "/all-bids?status=accepted",
    },
    {
        title: "Pending Review",
        value: 18,
        icon: Clock,
        link: "/all-bids?status=pending",
    },
    {
        title: "Rejected Bids",
        value: 15,
        icon: XCircle,
        link: "/all-bids?status=rejected",
    }
]
