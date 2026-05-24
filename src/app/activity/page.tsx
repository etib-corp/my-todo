import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, CheckCircle2, MessageSquareMore, Clock3 } from "lucide-react"

const feed = [
  { title: "Maya merged the planning board", note: "Updated the sync flow and handoff queue.", time: "2 min ago", icon: CheckCircle2, tone: "text-emerald-600" },
  { title: "Ava requested a design review", note: "Needs one last pass before the release check-in.", time: "11 min ago", icon: MessageSquareMore, tone: "text-sky-600" },
  { title: "Noah opened the standup thread", note: "Daily sync is ready for async comments.", time: "21 min ago", icon: Clock3, tone: "text-amber-600" },
]

export default function ActivityPage() {
  return (
    <div className="@container/main flex flex-1 flex-col gap-6 px-4 py-4 md:gap-8 md:py-6 lg:px-6">
      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <Badge variant="outline" className="w-fit rounded-full"><Activity className="mr-1 size-3.5" />Activity stream</Badge>
            <CardTitle className="text-3xl font-semibold tracking-tight">Watch the latest changes as they happen.</CardTitle>
            <CardDescription className="max-w-2xl text-base leading-7">Use this page to see the live pulse of the workspace: updates, approvals, and completed handoffs.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {feed.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.title} className="flex items-start gap-3 rounded-2xl border bg-muted/20 p-4">
                  <Icon className={`mt-1 size-5 ${item.tone}`} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-medium">{item.title}</p>
                      <span className="text-xs text-muted-foreground">{item.time}</span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{item.note}</p>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">What changed today</CardTitle>
            <CardDescription>A short summary of the current state.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
            <div className="rounded-2xl border bg-muted/20 p-4">Two blockers were resolved and one review is still waiting.</div>
            <div className="rounded-2xl border bg-muted/20 p-4">The planning board was updated with the next release window.</div>
            <div className="rounded-2xl border bg-muted/20 p-4">Team sync cadence was moved earlier to protect focus time.</div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}