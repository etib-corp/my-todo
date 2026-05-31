"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { FolderKanban, Milestone, ListChecks, Plus, X, Trash2, Edit2, CheckCircle, AlertCircle, Archive, PlayCircle } from "lucide-react"

type User = {
  id: number
  name: string
  email: string
  subTeam: string
  status: string
}

type Project = {
  id: number
  name: string
  status: string
  note: string
  members: { id: number; name: string }[]
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [open, setOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [form, setForm] = useState({ name: "", status: "active", note: "" })
  const [selectedMembers, setSelectedMembers] = useState<User[]>([])

  useEffect(() => {
    fetchProjects()
    fetchUsers()
  }, [])

  async function fetchProjects() {
    try {
      const res = await fetch("/api/projects")
      const data = await res.json()
      setProjects(data.projects ?? [])
    } catch (error) {
      console.error("Error fetching projects:", error)
    }
  }

  async function fetchUsers() {
    try {
      const res = await fetch("/api/users")
      const data = await res.json()
      setUsers(data.users ?? [])
    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }

  function toggleMember(user: User) {
    setSelectedMembers((prev) =>
      prev.find((m) => m.id === user.id)
        ? prev.filter((m) => m.id !== user.id)
        : [...prev, user]
    )
  }

  async function handleCreate() {
    if (!form.name.trim()) return
    setLoading(true)
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          memberIds: selectedMembers.map((m) => m.id),
        }),
      })
      const newProject = await res.json()
      setProjects((prev) => [{ ...newProject.project, members: selectedMembers }, ...prev])
      setForm({ name: "", status: "active", note: "" })
      setSelectedMembers([])
      setOpen(false)
    } catch (error) {
      console.error("Error creating project:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleUpdateStatus(projectId: number, newStatus: string) {
    setLoading(true)
    try {
      const res = await fetch("/api/projects", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, status: newStatus }),
      })
      if (res.ok) {
        setProjects((prev) =>
          prev.map((project) =>
            project.id === projectId ? { ...project, status: newStatus } : project
          )
        )
      }
    } catch (error) {
      console.error("Error updating project status:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleUpdateNote(projectId: number, newNote: string) {
    setLoading(true)
    try {
      const res = await fetch("/api/projects", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, note: newNote }),
      })
      if (res.ok) {
        setProjects((prev) =>
          prev.map((project) =>
            project.id === projectId ? { ...project, note: newNote } : project
          )
        )
        setEditOpen(false)
        setEditingProject(null)
      }
    } catch (error) {
      console.error("Error updating project note:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDeleteProject(projectId: number) {
    if (!confirm("Are you sure you want to delete this project?")) return
    try {
      await fetch("/api/projects", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      })
      setProjects((prev) => prev.filter((p) => p.id !== projectId))
    } catch (error) {
      console.error("Error deleting project:", error)
    }
  }

  function openEditDialog(project: Project) {
    setEditingProject(project)
    setForm({ name: project.name, status: project.status, note: project.note || "" })
    setEditOpen(true)
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case "active": return <PlayCircle className="size-4 text-green-600" />
      case "blocked": return <AlertCircle className="size-4 text-red-600" />
      case "completed": return <CheckCircle className="size-4 text-blue-600" />
      case "archived": return <Archive className="size-4 text-gray-600" />
      default: return null
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 hover:bg-green-200"
      case "blocked": return "bg-red-100 text-red-800 hover:bg-red-200"
      case "completed": return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      case "archived": return "bg-gray-100 text-gray-800 hover:bg-gray-200"
      default: return ""
    }
  }

  function redirectToProject(projectId: number) {
    window.location.href = `/projects/${projectId}`
  }

  return (
    <div className="@container/main flex flex-1 flex-col gap-6 px-4 py-4 md:gap-8 md:py-6 lg:px-6">
      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="w-fit rounded-full">
                <FolderKanban className="mr-1 size-3.5" />Project board
              </Badge>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                  <Plus className="size-4" />
                  New project
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create project</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        placeholder="Project name"
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
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
                          <SelectItem value="blocked">Blocked</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="note">Note</Label>
                      <Textarea
                        id="note"
                        placeholder="Add a short note…"
                        rows={3}
                        value={form.note}
                        onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Assign members</Label>
                      {selectedMembers.length > 0 && (
                        <div className="mb-2 flex flex-wrap gap-1.5">
                          {selectedMembers.map((m) => (
                            <span
                              key={m.id}
                              className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                            >
                              {m.name}
                              <button onClick={() => toggleMember(m)} className="hover:text-destructive">
                                <X className="size-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="max-h-36 overflow-y-auto rounded-md border divide-y">
                        {users.length === 0 && (
                          <p className="px-3 py-2 text-sm text-muted-foreground">No users available.</p>
                        )}
                        {users.map((user) => {
                          const selected = !!selectedMembers.find((m) => m.id === user.id)
                          return (
                            <button
                              key={user.id}
                              type="button"
                              onClick={() => toggleMember(user)}
                              className={`flex w-full items-center justify-between px-3 py-2 text-sm transition-colors hover:bg-muted/50 ${
                                selected ? "bg-primary/5 font-medium text-primary" : ""
                              }`}
                            >
                              <div className="flex flex-col items-start">
                                <span>{user.name}</span>
                                <span className="text-xs text-muted-foreground">{user.subTeam} · {user.email}</span>
                              </div>
                              {selected && <span className="size-2 rounded-full bg-primary" />}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                    <Button className="w-full" onClick={handleCreate} disabled={loading}>
                      {loading ? "Creating…" : "Create project"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <CardTitle className="text-3xl font-semibold tracking-tight">
              Keep the work streams visible.
            </CardTitle>
            <CardDescription className="max-w-2xl text-base leading-7">
              The project view groups active initiatives, owners, and the next decision point so nothing gets lost between syncs.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {projects.map((project) => (
              <div key={project.id} className="rounded-2xl border bg-muted/20 p-4 cursor-pointer" onClick={() => redirectToProject(project.id)}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-medium text-lg">{project.name}</p>
                      <Badge className={getStatusColor(project.status)}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(project.status)}
                          {project.status}
                        </span>
                      </Badge>
                    </div>
                    {project.note && (
                      <p className="text-sm text-muted-foreground mb-3">{project.note}</p>
                    )}
                    {project.members && project.members.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {project.members.map((member) => (
                          <Badge key={member.id} variant="outline" className="text-xs">
                            {member.name}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Select
                      value={project.status}
                      onValueChange={(newStatus) => handleUpdateStatus(project.id, newStatus)}
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">
                          <span className="flex items-center gap-2">
                            <PlayCircle className="size-4 text-green-600" />Active
                          </span>
                        </SelectItem>
                        <SelectItem value="blocked">
                          <span className="flex items-center gap-2">
                            <AlertCircle className="size-4 text-red-600" />Blocked
                          </span>
                        </SelectItem>
                        <SelectItem value="completed">
                          <span className="flex items-center gap-2">
                            <CheckCircle className="size-4 text-blue-600" />Completed
                          </span>
                        </SelectItem>
                        <SelectItem value="archived">
                          <span className="flex items-center gap-2">
                            <Archive className="size-4 text-gray-600" />Archived
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="ghost" size="sm" onClick={() => openEditDialog(project)}>
                      <Edit2 className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteProject(project.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {projects.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No projects yet. Click "New project" to create one.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Milestone className="size-5 text-emerald-600" />Milestones
            </CardTitle>
            <CardDescription>What is coming up next.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
            <div className="rounded-2xl border bg-muted/20 p-4">
              Finalize design review and lock the onboarding release date.
            </div>
            <div className="rounded-2xl border bg-muted/20 p-4">
              Publish the handoff notes for the next sprint checkpoint.
            </div>
            <div className="rounded-2xl border bg-muted/20 p-4">
              Confirm the ops automation kickoff and required approvals.
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            Icon: ListChecks,
            label: `${projects.length} tracked`,
            detail: "Active projects in the current workspace.",
            color: "text-violet-600",
          },
          {
            Icon: FolderKanban,
            label: `${projects.filter((p) => p.status === "blocked").length} blocked`,
            detail: "Initiatives waiting on a decision.",
            color: "text-violet-600",
          },
          {
            Icon: Milestone,
            label: "4 next steps",
            detail: "Clear follow-up actions across the board.",
            color: "text-violet-600",
          },
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

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          {editingProject && (
            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) => setForm((f) => ({ ...f, status: v }))}
                >
                  <SelectTrigger id="edit-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-note">Note</Label>
                <Textarea
                  id="edit-note"
                  rows={3}
                  value={form.note}
                  onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  onClick={() => handleUpdateNote(editingProject.id, form.note)}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => setEditOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}