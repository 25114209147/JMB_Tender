import { LayoutDashboard, FileText, CircleDollarSign, Users, type LucideIcon } from "lucide-react";
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
        url: "/JMB/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "All Tenders",
        url: "/tenders",
        icon: FileText,
      },
      {
        title: "My Tenders",
        url: "/tenders/my-tenders",
        icon: FileText,
      },
      {
        title: "Draft Tenders",
        url: "/JMB/drafts",
        icon: FileText,
      },
      {
        title: "Completed Tenders",
        url: "/JMB/completed",
        icon: FileText,
      },
      {
        title: "All Bids",
        url: "/all-bids",
        icon: CircleDollarSign,
      },
    ],
    contractor: [
      {
        title: "Dashboard",
        url: "/contractor/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "All Tenders",
        url: "/tenders",
        icon: FileText,
      },
      {
        title: "My Bids",
        url: "/my-bids",
        icon: CircleDollarSign,
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
