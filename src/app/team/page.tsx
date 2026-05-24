import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquareMore, Users, Video, CircleAlert } from "lucide-react"

const members = [
  { name: "Ava", role: "Design", initials: "AV", status: "Reviewing handoff" },
  { name: "Noah", role: "Product", initials: "NO", status: "Running standup" },
  { name: "Maya", role: "Engineering", initials: "MY", status: "Merging changes" },
  { name: "Leila", role: "Ops", initials: "LE", status: "Waiting on approval" },
]

export default function TeamPage() {
  return (
    <div className="@container/main flex flex-1 flex-col gap-6 px-4 py-4 md:gap-8 md:py-6 lg:px-6">
      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <Badge variant="outline" className="w-fit rounded-full">
              <Users className="mr-1 size-3.5" />
              Team sync
            </Badge>
            <CardTitle className="text-3xl font-semibold tracking-tight">See who is online and what needs attention.</CardTitle>
            <CardDescription className="max-w-2xl text-base leading-7">
              The team view keeps collaborators visible, with quick context on status, handoffs, and blockers.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            {members.map((member) => (
              <div key={member.name} className="flex items-center gap-3 rounded-2xl border bg-muted/20 p-4">
                <Avatar className="size-11">
                  <AvatarFallback>{member.initials}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium">{member.name}</p>
                    <Badge variant="secondary">{member.role}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{member.status}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl"><CircleAlert className="size-5 text-amber-600" />Current blockers</CardTitle>
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
          [Video, "Next huddle", "14:30 with design and engineering."],
          [MessageSquareMore, "12 notes", "Async messages since the last sync."],
          [Users, "8 online", "People currently active in the workspace."],
        ].map(([Icon, label, detail]) => (
          <Card key={label as string} className="border-border/60 shadow-sm">
            <CardHeader>
              <Icon className="size-5 text-sky-600" />
              <CardTitle className="text-xl">{label as string}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{detail as string}</CardContent>
          </Card>
        ))}
      </section>
    </div>
  )
}