import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FolderKanban, Milestone, ListChecks } from "lucide-react"

const projects = [
  { name: "Onboarding refresh", status: "In progress", owner: "Ava", note: "Waiting on copy and final QA." },
  { name: "Team planning flow", status: "Review", owner: "Maya", note: "Needs a decision on the release window." },
  { name: "Ops automation", status: "Planned", owner: "Leila", note: "Ready to start after this sprint." },
]

export default function ProjectsPage() {
  return (
    <div className="@container/main flex flex-1 flex-col gap-6 px-4 py-4 md:gap-8 md:py-6 lg:px-6">
      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <Badge variant="outline" className="w-fit rounded-full"><FolderKanban className="mr-1 size-3.5" />Project board</Badge>
            <CardTitle className="text-3xl font-semibold tracking-tight">Keep the work streams visible.</CardTitle>
            <CardDescription className="max-w-2xl text-base leading-7">The project view groups active initiatives, owners, and the next decision point so nothing gets lost between syncs.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {projects.map((project) => (
              <div key={project.name} className="rounded-2xl border bg-muted/20 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-medium">{project.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">Owner: {project.owner}</p>
                  </div>
                  <Badge variant="secondary">{project.status}</Badge>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{project.note}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl"><Milestone className="size-5 text-emerald-600" />Milestones</CardTitle>
            <CardDescription>What is coming up next.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
            <div className="rounded-2xl border bg-muted/20 p-4">Finalize design review and lock the onboarding release date.</div>
            <div className="rounded-2xl border bg-muted/20 p-4">Publish the handoff notes for the next sprint checkpoint.</div>
            <div className="rounded-2xl border bg-muted/20 p-4">Confirm the ops automation kickoff and required approvals.</div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          [ListChecks, "3 tracked", "Active projects in the current workspace."],
          [FolderKanban, "1 blocked", "One initiative is waiting on a decision."],
          [Milestone, "4 next steps", "Clear follow-up actions across the board."],
        ].map(([Icon, label, detail]) => (
          <Card key={label as string} className="border-border/60 shadow-sm">
            <CardHeader>
              <Icon className="size-5 text-violet-600" />
              <CardTitle className="text-xl">{label as string}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{detail as string}</CardContent>
          </Card>
        ))}
      </section>
    </div>
  )
}