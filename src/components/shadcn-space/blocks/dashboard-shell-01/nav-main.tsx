"use client"

import { ChevronRight } from "lucide-react"
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar"
import type { NavItem } from "@/components/shadcn-space/blocks/dashboard-shell-01/app-sidebar"
import { cn } from "@/lib/utils"
import { Link, useLocation } from "react-router"

export function NavMain({ items }: { items: NavItem[] }) {
  const { pathname } = useLocation()

  // Recursive render function
  const renderItem = (item: NavItem) => {
    //  Section label
    if (item.isSection && item.label) {
      return (
        <SidebarGroup key={item.label} className="p-0 pt-5 first:pt-0">
          <SidebarGroupLabel className="p-0 text-xs font-medium text-sidebar-foreground uppercase">
            {item.label}
          </SidebarGroupLabel>
        </SidebarGroup>
      )
    }
    const hasChildren = !!item.children?.length
    // Item with children → collapsible
    if (hasChildren && item.title) {
      return (
        <SidebarGroup key={item.title} className="px-0 py-0.5">
          <SidebarMenu>
            <Collapsible>
              <SidebarMenuItem>
                <CollapsibleTrigger
                  render={
                    <SidebarMenuButton
                      tooltip={item.title}
                      className="h-9 cursor-pointer rounded-xl text-sm"
                    >
                      {item.icon && <item.icon size={16} />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 ease-out group-aria-expanded/collapsible-trigger:rotate-90" />
                    </SidebarMenuButton>
                  }
                  className="group/collapsible-trigger w-full"
                />
                <CollapsibleContent>
                  <SidebarMenuSub className="me-0 pe-0">
                    {item.children!.map(renderItemSub)}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>
        </SidebarGroup>
      )
    }
    // Item without children
    if (item.title) {
      const isActive = item.isActive ?? pathname === item.href

      return (
        <SidebarGroup key={item.title} className="px-0 py-0.5">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip={item.title}
                isActive={isActive}
                render={<Link to={item.href ?? "#"} />}
                className={cn(
                  "h-9 rounded-lg text-sm",
                  isActive
                    ? "bg-primary text-white hover:bg-primary hover:text-white dark:bg-blue-500 dark:hover:bg-blue-500"
                    : ""
                )}
              >
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      )
    }
    return null
  }
  // Recursive render function for sub-items
  const renderItemSub = (item: NavItem) => {
    const isActive = item.isActive ?? pathname === item.href
    const hasChildren = !!item.children?.length

    if (hasChildren && item.title) {
      return (
        <SidebarMenuSubItem key={item.title}>
          <Collapsible>
            <CollapsibleTrigger className="group/collapsible-sub-trigger w-full">
              <SidebarMenuSubButton className="h-9 rounded-xl px-3 py-2 text-sm">
                {item.icon && <item.icon />}
                <span>{item.title}</span>
                <ChevronRight className="ml-auto transition-transform duration-200 ease-out group-aria-expanded/collapsible-sub-trigger:rotate-90" />
              </SidebarMenuSubButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub className="me-0 pe-0">
                {item.children!.map(renderItemSub)}
              </SidebarMenuSub>
            </CollapsibleContent>
          </Collapsible>
        </SidebarMenuSubItem>
      )
    }

    if (item.title) {
      return (
        <SidebarMenuSubItem key={item.title} className="w-full">
          <SidebarMenuSubButton
            className={cn(
              "w-full",
              isActive
                ? "bg-primary text-white hover:bg-primary hover:text-white dark:bg-blue-500 dark:hover:bg-blue-500"
                : ""
            )}
            isActive={isActive}
            render={<Link to={item.href ?? "#"}>{item.title}</Link>}
          />
        </SidebarMenuSubItem>
      )
    }
    return null
  }

  return <>{items.map(renderItem)}</>
}
