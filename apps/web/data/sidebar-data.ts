import { LayoutDashboard, FileText, CircleDollarSign, List, Users, type LucideIcon, Edit2, SquarePen } from "lucide-react";
import type { UserRole } from "@/lib/roles";

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
  readonly iconColor?: string; 
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

export function getNavItemsForRole(role: UserRole): readonly NavItem[] {
  const navItems: Record<UserRole, readonly NavItem[]> = {
    JMB: [
      {
        title: "Dashboard",
        url: "/dashboard/JMB",
        icon: LayoutDashboard,
        iconColor: "text-primary",
      },
      {
        title: "All Tenders",
        url: "/tenders",
        icon: FileText,
        iconColor: "text-purple-800",
      },
      {
        title: "My Tenders",
        url: "/tenders/my-tenders",
        icon: List,
        iconColor: "text-blue-700",
      },
      // {
      //   title: "Draft Tenders",
      //   url: "/dashboard/JMB/drafts",
      //   icon: FileText,
      // },
      // {
      //   title: "Completed Tenders",
      //   url: "/dashboard/JMB/completed",
      //   icon: FileText,
      // },
      {
        title: "All Bids",
        url: "/all-bids",
        icon: CircleDollarSign,
        iconColor: "text-teal-800",
      },
    ],
    contractor: [
      {
        title: "Dashboard",
        url: "/contractor/dashboard",
        icon: LayoutDashboard,
        iconColor: "text-primary",
      },
      {
        title: "All Tenders",
        url: "/tenders",
        icon: FileText,
        iconColor: "text-purple-800",
      },
      {
        title: "My Bids",
        url: "/my-bids",
        icon: CircleDollarSign,
        iconColor: "text-teal-800",
      },
      {
        title: "Drafts",
        url: "/contractor/drafts",
        icon: SquarePen,
        iconColor: "text-amber-800",
      },
    ],
    admin: [
      {
        title: "Dashboard",
        url: "/admin/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "All Users",
        url: "/admin/users",
        icon: Users,
      },
      {
        title: "All Tenders",
        url: "/tenders",
        icon: FileText,
      },
      {
        title: "All Bids",
        url: "/all-bids",
        icon: CircleDollarSign,
      },
    ],
  };

  return navItems[role] || navItems.JMB;
}

// Default sidebar data (fallback)
export const sidebarData: SidebarData = {
  user: {
    name: "User",
    email: "user@example.com",
    avatar: "/avatars/default.jpg",
  },
  navMain: getNavItemsForRole("JMB"),
} as const;
