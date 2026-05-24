"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { CirclePlusIcon, InboxIcon, Clock3Icon, MessageSquareMoreIcon } from "lucide-react"
import { toast } from "sonner"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: React.ReactNode
  }[]
}) {
  const pathname = usePathname()
  const [isQuickCreateOpen, setIsQuickCreateOpen] = React.useState(false)
  const [isInboxOpen, setIsInboxOpen] = React.useState(false)
  const [taskTitle, setTaskTitle] = React.useState("")
  const [taskDetails, setTaskDetails] = React.useState("")

  const inboxItems = [
    {
      title: "Design review requested",
      description: "Ava needs a quick pass on the onboarding handoff.",
      time: "2m ago",
      tone: "emerald",
    },
    {
      title: "Standup starting soon",
      description: "Team sync is queued for 14:30 with product and ops.",
      time: "14m ago",
      tone: "sky",
    },
    {
      title: "Blocker cleared",
      description: "Maya resolved the planning board sync issue.",
      time: "41m ago",
      tone: "amber",
    },
  ]

  function closeQuickCreate() {
    setIsQuickCreateOpen(false)
    setTaskTitle("")
    setTaskDetails("")
  }

  function handleCreateTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    toast.success(taskTitle.trim() ? `Created ${taskTitle.trim()}` : "Created task")
    closeQuickCreate()
  }

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Quick Create"
              type="button"
              onClick={() => setIsQuickCreateOpen(true)}
              className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
            >
              <CirclePlusIcon />
              <span>Quick Create</span>
            </SidebarMenuButton>
            <Button
              size="icon"
              type="button"
              onClick={() => setIsInboxOpen(true)}
              className="size-8 group-data-[collapsible=icon]:opacity-0"
              variant="outline"
            >
              <InboxIcon />
              <span className="sr-only">Inbox</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                render={<Link href={item.url} />}
                isActive={
                  item.url === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.url)
                }
              >
                {item.icon}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>

      <Dialog open={isQuickCreateOpen} onOpenChange={setIsQuickCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Quick create</DialogTitle>
            <DialogDescription>
              Capture a task, note, or handoff without leaving the sidebar.
            </DialogDescription>
          </DialogHeader>
          <form className="grid gap-4" onSubmit={handleCreateTask}>
            <div className="grid gap-2">
              <Label htmlFor="quick-create-title">Title</Label>
              <Input
                id="quick-create-title"
                placeholder="Follow up on onboarding review"
                value={taskTitle}
                onChange={(event) => setTaskTitle(event.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="quick-create-details">Details</Label>
              <Input
                id="quick-create-details"
                placeholder="Add context, owner, or a due date"
                value={taskDetails}
                onChange={(event) => setTaskDetails(event.target.value)}
              />
            </div>
            <div className="grid gap-2 rounded-2xl border bg-muted/20 p-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-2 text-foreground">
                <Clock3Icon className="size-4" />
                Default to today
              </span>
              <span>Use this for tasks that should land in the current workstream.</span>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeQuickCreate}>
                Cancel
              </Button>
              <Button type="submit">Create item</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Drawer open={isInboxOpen} onOpenChange={setIsInboxOpen} direction="right">
        <DrawerContent>
          <DrawerHeader className="border-b">
            <DrawerTitle className="flex items-center gap-2">
              <MessageSquareMoreIcon className="size-5 text-sky-600" />
              Inbox
            </DrawerTitle>
            <DrawerDescription>
              Catch up on the latest comments, reviews, and blockers.
            </DrawerDescription>
          </DrawerHeader>
          <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
            {inboxItems.map((item) => (
              <div key={item.title} className="rounded-2xl border bg-background p-4 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">{item.title}</p>
                  <Badge variant="outline" className="rounded-full">
                    {item.time}
                  </Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </DrawerContent>
      </Drawer>
    </SidebarGroup>
  )
}
