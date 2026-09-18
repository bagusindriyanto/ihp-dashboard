"use client"
import React from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Logo from "@/assets/logo/logo"
import { NavMain } from "@/components/shadcn-space/blocks/dashboard-shell-01/nav-main"
import {
  AlignStartVertical,
  CreditCard,
  LayoutPanelTop,
  ChartPie,
  BarChart3,
  CircleUserRound,
  ClipboardList,
  Languages,
  Notebook,
  NotepadText,
  Table,
  Ticket,
} from "lucide-react"
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

export const navData: NavItem[] = [
  // Dashboards Section
  { label: "Dashboards", isSection: true },
  { title: "Analytics", icon: BarChart3, href: "/" },
  { title: "CRM Dashboard", icon: ClipboardList, href: "/crm" },

  // Pages Section
  { label: "Pages", isSection: true },
  {
    title: "Data Source",
    icon: Table,
    children: [
      { title: "Man Power", href: "/man-power" },
      { title: "All Target IHP", href: "/all-target" },
      { title: "Output Printing", href: "/output-printing" },
      { title: "Output TPR", href: "/output-tpr" },
      { title: "Output Dirbon", href: "/output-dirbon" },
    ],
  },
  { title: "Forms", icon: ClipboardList, href: "#" },
  { title: "User Profile", icon: CircleUserRound, href: "#" },

  // Apps Section
  { label: "Apps", isSection: true },
  { title: "Notes", icon: Notebook, href: "#" },
  { title: "Tickets", icon: Ticket, href: "#" },
  {
    title: "Blogs",
    icon: Languages,
    children: [
      { title: "Blog Post", href: "#" },
      { title: "Blog Detail", href: "#" },
      { title: "Blog Edit", href: "#" },
      { title: "Blog Create", href: "#" },
      { title: "Manage Blogs", href: "#" },
    ],
  },
]

/* -------------------------------------------------------------------------- */
/*                                   Page                                     */
/* -------------------------------------------------------------------------- */

const AppSidebar = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <Sidebar className="bg-background px-0 py-4">
        {/* ---------------- Header ---------------- */}
        <SidebarHeader className="px-4 py-0">
          <SidebarMenu>
            <SidebarMenuItem>
              <a href="#" className="h-full w-full">
                <Logo />
              </a>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        {/* ---------------- Content ---------------- */}
        <SidebarContent>
          <NavMain items={navData} />
        </SidebarContent>
      </Sidebar>

      {/* ---------------- Main ---------------- */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-50 flex items-center border-b bg-background px-6 py-3">
          <SiteHeader />
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </SidebarProvider>
  )
}

export default AppSidebar
