"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { MessageSquareMore, Users, Video, CircleAlert, Plus } from "lucide-react"

type User = {
  id: number
  name: string
  email: string
  subTeam: string
  status: string
}

export default function TeamPage() {
  const [users, setUsers] = useState<User[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    subTeam: "",
    status: "active",
  })

  useEffect(() => {
    fetch("/api/users")
      .then((r) => r.json())
      .then((data) => setUsers(data.users ?? []))
      .catch(console.error)
  }, [])

  function getInitials(name: string) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  async function handleCreate() {
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) return
    setLoading(true)
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          subTeam: form.subTeam,
          status: form.status,
          tasks: [],
          projects: [],
        }),
      })
      const data = await res.json()
      setUsers((prev) => [data.user, ...prev])
      setForm({ name: "", email: "", password: "", subTeam: "", status: "active" })
      setOpen(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="@container/main flex flex-1 flex-col gap-6 px-4 py-4 md:gap-8 md:py-6 lg:px-6">
      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="w-fit rounded-full">
                <Users className="mr-1 size-3.5" />
                Team sync
              </Badge>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-1 size-4" />
                    New member
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add team member</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        placeholder="Full name"
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="email@example.com"
                        value={form.email}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={form.password}
                        onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="subTeam">Sub-team</Label>
                      <Input
                        id="subTeam"
                        placeholder="e.g. Design, Engineering, Ops"
                        value={form.subTeam}
                        onChange={(e) => setForm((f) => ({ ...f, subTeam: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={form.status}
                        onValueChange={(v) => setForm((f) => ({ ...f, status: v }))}
                      >
                        <SelectTrigger id="status">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="away">Away</SelectItem>
                          <SelectItem value="offline">Offline</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      className="w-full"
                      onClick={handleCreate}
                      disabled={loading}
                    >
                      {loading ? "Adding…" : "Add member"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <CardTitle className="text-3xl font-semibold tracking-tight">
              See who is online and what needs attention.
            </CardTitle>
            <CardDescription className="max-w-2xl text-base leading-7">
              The team view keeps collaborators visible, with quick context on status, handoffs, and blockers.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            {users.map((user) => (
              <div key={user.id} className="flex items-center gap-3 rounded-2xl border bg-muted/20 p-4">
                <Avatar className="size-11">
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium">{user.name}</p>
                    <Badge variant="secondary">{user.subTeam}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{user.status}</p>
                </div>
              </div>
            ))}
            {users.length === 0 && (
              <p className="col-span-2 py-6 text-center text-sm text-muted-foreground">
                No team members yet.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <CircleAlert className="size-5 text-amber-600" />Current blockers
            </CardTitle>
            <CardDescription>What the team should clear first.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
            <div className="rounded-2xl border bg-muted/20 p-4">Approval needed on the onboarding rollout date.</div>
            <div className="rounded-2xl border bg-muted/20 p-4">One design review is waiting on final copy updates.</div>
            <div className="rounded-2xl border bg-muted/20 p-4">Engineering is ready to merge once QA signs off.</div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          { Icon: Video, label: "Next huddle", detail: "14:30 with design and engineering.", color: "text-sky-600" },
          { Icon: MessageSquareMore, label: "12 notes", detail: "Async messages since the last sync.", color: "text-sky-600" },
          { Icon: Users, label: `${users.length} online`, detail: "People currently active in the workspace.", color: "text-sky-600" },
        ].map(({ Icon, label, detail, color }) => (
          <Card key={detail} className="border-border/60 shadow-sm">
            <CardHeader>
              <Icon className={`size-5 ${color}`} />
              <CardTitle className="text-xl">{label}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{detail}</CardContent>
          </Card>
        ))}
      </section>
    </div>
  )
}