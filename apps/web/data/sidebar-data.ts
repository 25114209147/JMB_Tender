import { LayoutDashboard, FileText, CircleDollarSign, ChartNoAxesCombined } from "lucide-react";

export const sidebarData = {
  user: {
    name: "Yan Ting",
    email: "yt@gmail.com",
    avatar: "/avatars/yt.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/owner/dashboard",
      icon: LayoutDashboard,
      items: [],
    },
    {
      title: "My Tenders",
      url: "/owner/tenders",
      icon: FileText,
      items: [],
    },
    {
      title: "All Bids",
      url: "/owner/all-bids",
      icon: CircleDollarSign,
      items: [],
    },
    {
      title: "Analytics",
      url: "/owner/analytics",
      icon: ChartNoAxesCombined,
      items: [],
    },
  ],
} as const;
