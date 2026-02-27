"use client"

import { NavMain } from "@/components/layout/nav-main"
import { NavUser } from "@/components/layout/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  // SidebarRail,
} from "@/components/ui/sidebar"
import { sidebarData } from "@/data/sidebar-data"
import { Building2 } from "lucide-react"
import Link from "next/link"
import { useUser } from "@/contexts/user-context"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, loading } = useUser()

  return (
    <Sidebar collapsible="icon" {...props} >
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Building2 className="h-4 w-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
            <span className="truncate font-semibold text-primary">JMB Tender</span>
            {/* <span className="truncate text-xs text-muted-foreground">Enterprise</span> */}
          </div>
        </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebarData.navMain} />
      </SidebarContent>
      <SidebarFooter className="border-t">
        {!loading && user ? (
          <NavUser 
            user={{
              name: user.name || "User",
              email: user.email,
              avatar: "/avatars/default.jpg"
            }} 
          />
        ) : (
          <NavUser user={sidebarData.user} />
        )}
      </SidebarFooter>
      {/* <SidebarRail /> */}
    </Sidebar>
  )
}
