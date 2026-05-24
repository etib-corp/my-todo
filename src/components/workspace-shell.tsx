"use client"

import * as React from "react"
import { usePathname } from "next/navigation"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

const routeMeta = [
  {
    path: "/",
    title: "Workspace overview",
    subtitle: "Everything the team needs to stay aligned at a glance.",
    status: "Live",
  },
  {
    path: "/focus",
    title: "Personal focus",
    subtitle: "Protect deep work, capture priorities, and keep momentum high.",
    status: "Focus mode",
  },
  {
    path: "/team",
    title: "Team sync",
    subtitle: "See who is online, what is blocked, and what is moving.",
    status: "8 online",
  },
  {
    path: "/projects",
    title: "Project board",
    subtitle: "Track work streams, milestones, and the next decision point.",
    status: "3 active",
  },
  {
    path: "/activity",
    title: "Activity stream",
    subtitle: "Follow the latest updates, reviews, and handoffs in real time.",
    status: "Updated now",
  },
]

function getRouteMeta(pathname: string) {
  return routeMeta.find((route) => route.path === pathname) ?? routeMeta[0]
}

export function WorkspaceShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const currentRoute = getRouteMeta(pathname)

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader
          title={currentRoute.title}
          subtitle={currentRoute.subtitle}
          status={currentRoute.status}
        />
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}