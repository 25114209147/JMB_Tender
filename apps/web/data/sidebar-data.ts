import { LayoutDashboard, FileText, CircleDollarSign, ChartNoAxesCombined, type LucideIcon } from "lucide-react";

export type NavSubItem = {
  readonly title: string;
  readonly url: string;
}

export type NavItem = {
  readonly title: string;
  readonly url: string;
  readonly icon?: LucideIcon;
  readonly isActive?: boolean;
  readonly items?: readonly NavSubItem[];
}

export type UserData = {
  readonly name: string;
  readonly email: string;
  readonly avatar: string;
}

export type SidebarData = {
  readonly user: UserData;
  readonly navMain: readonly NavItem[];
}

export const sidebarData: SidebarData = {
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
