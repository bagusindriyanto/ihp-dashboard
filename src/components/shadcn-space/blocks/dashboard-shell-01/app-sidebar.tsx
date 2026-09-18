"use client"
import React from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"
import Logo from "@/assets/logo/logo"
import { NavMain } from "@/components/shadcn-space/blocks/dashboard-shell-01/nav-main"
import { BarChart3, CircleUserRound, ClipboardList, Table } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { SiteHeader } from "@/components/shadcn-space/blocks/dashboard-shell-01/site-header"

export type NavItem = {
  label?: string
  isSection?: boolean
  title?: string
  icon?: LucideIcon
  href?: string
  children?: NavItem[]
  isActive?: boolean
}

const navData: NavItem[] = [
  // Dashboards Section
  { label: "Dashboards", isSection: true },
  { title: "Analytics", icon: BarChart3, href: "/" },
  { title: "CRM Dashboard", icon: ClipboardList, href: "/crm" },

  // Pages Section
  { label: "Pages", isSection: true },
  { title: "Tables", icon: Table, href: "#" },
  { title: "Forms", icon: ClipboardList, href: "#" },
  { title: "User Profile", icon: CircleUserRound, href: "#" },
  {
    title: "Data",
    icon: ClipboardList,
    children: [{ title: "Man Power", href: "/man-power" }],
  },
]

/* -------------------------------------------------------------------------- */
/*                                   Page                                     */
/* -------------------------------------------------------------------------- */

const AppSidebar = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <Sidebar>
        {/* ---------------- Header ---------------- */}
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <a href="#" className="h-full w-full">
                <Logo />
              </a>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        {/* ---------------- Content ---------------- */}
        <SidebarContent className="p-4">
          <NavMain items={navData} />
        </SidebarContent>
      </Sidebar>

      {/* ---------------- Main ---------------- */}
      <SidebarInset>
        <header className="sticky top-0 z-50 flex items-center border-b bg-background px-6 py-3">
          <SiteHeader />
        </header>
        <main className="flex-1">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default AppSidebar
