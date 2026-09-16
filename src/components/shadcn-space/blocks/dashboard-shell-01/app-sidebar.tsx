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
import { ScrollArea } from "@/components/ui/scroll-area"

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
  { title: "Man Power", icon: ClipboardList, href: "/man-power" },

  // Pages Section
  { label: "Pages", isSection: true },
  { title: "Tables", icon: Table, href: "#" },
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

  // Form Elements Section
  { label: "Form Elements", isSection: true },
  {
    title: "Shadcn Forms",
    icon: NotepadText,
    children: [
      { title: "Button", href: "#" },
      { title: "Input", href: "#" },
      { title: "Select", href: "#" },
      { title: "Checkbox", href: "#" },
      { title: "Radio", href: "#" },
    ],
  },
  {
    title: "Form layouts",
    icon: AlignStartVertical,
    children: [
      { title: "Forms Horizontal", href: "#" },
      { title: "Forms Vertical", href: "#" },
      { title: "Forms Validation", href: "#" },
      { title: "Forms Examples", href: "#" },
      { title: "Forms Wizard", href: "#" },
    ],
  },
  { label: "WIDGETS", isSection: true },
  {
    title: "Cards",
    icon: CreditCard,
    children: [
      { title: "Ecommerce Actions", href: "#" },
      { title: "Course ", href: "#" },
      { title: "Campaign Performance ", href: "#" },
      { title: "Selling Products ", href: "#" },
      { title: "Activity Timeline ", href: "#" },
    ],
  },
  {
    title: "Banners",
    icon: LayoutPanelTop,
    children: [{ title: "Analytic Banner ", href: "#" }],
  },
  {
    title: "Charts",
    icon: ChartPie,
    children: [
      { title: "Sales Report", href: "#" },
      { title: "Weekly Sales", href: "#" },
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
        <div className="flex flex-col gap-6 bg-background">
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
          <SidebarContent className="gap-0 overflow-hidden px-0">
            <ScrollArea className="h-[calc(100vh-348px)] border-b border-border">
              <div className="px-4">
                <NavMain items={navData} />
              </div>
            </ScrollArea>
            {/* card */}
            <div className="px-4 pt-4">
              <Card className="bg-blue-500/10 px-4 py-6 shadow-none ring-0">
                <CardContent className="flex flex-col items-center gap-3 p-0">
                  <img
                    src="https://images.shadcnspace.com/assets/backgrounds/download-img.png"
                    alt="sidebar-img"
                    width={74}
                    height={74}
                    className="h-20 w-20"
                  />
                  <div className="flex flex-col items-center gap-4">
                    <div>
                      <p className="text-center text-base font-semibold text-card-foreground">
                        Grab Pro Now
                      </p>
                      <p className="font-regular text-center text-sm text-muted-foreground">
                        Customize your admin
                      </p>
                    </div>
                    <Button className="h-9 w-fit cursor-pointer rounded-xl bg-blue-500 px-4 py-2 font-medium shadow-none hover:bg-blue-500/80">
                      Get Premium
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </SidebarContent>
        </div>
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
