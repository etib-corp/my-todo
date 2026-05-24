import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Sparkles, TimerReset, CalendarDays, ShieldCheck } from "lucide-react"

const focusBlocks = [
  { label: "Morning deep work", time: "8:30 - 10:00", status: "Booked", progress: 100 },
  { label: "Inbox zero window", time: "10:15 - 10:45", status: "Next", progress: 55 },
  { label: "Planning and prep", time: "11:00 - 11:30", status: "Open", progress: 20 },
]

export default function FocusPage() {
  return (
    <div className="@container/main flex flex-1 flex-col gap-6 px-4 py-4 md:gap-8 md:py-6 lg:px-6">
      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <Badge variant="outline" className="w-fit rounded-full">
              <Sparkles className="mr-1 size-3.5" />
              Personal focus
            </Badge>
            <CardTitle className="text-3xl font-semibold tracking-tight">
              Protect the hours that matter most.
            </CardTitle>
            <CardDescription className="max-w-2xl text-base leading-7">
              This view keeps your own work visible: focus blocks, short admin windows, and the smallest set of next actions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {focusBlocks.map((block) => (
              <div key={block.label} className="space-y-3 rounded-2xl border bg-muted/20 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">{block.label}</p>
                    <p className="text-sm text-muted-foreground">{block.time}</p>
                  </div>
                  <Badge variant="secondary">{block.status}</Badge>
                </div>
                <Progress value={block.progress} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Focus rules</CardTitle>
            <CardDescription>Simple constraints that keep work moving.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
            <div className="rounded-2xl border bg-muted/20 p-4">Mute non-urgent pings during the first deep work block.</div>
            <div className="rounded-2xl border bg-muted/20 p-4">Use the admin window to clear small tasks instead of expanding the focus block.</div>
            <div className="rounded-2xl border bg-muted/20 p-4">Capture new work in the project board before context switches happen.</div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          [TimerReset, "3 resets", "Focus sessions restarted after interruptions."],
          [CalendarDays, "2 held", "Meetings that stayed inside their slots."],
          [ShieldCheck, "87%", "Time protected from unplanned work."],
        ].map(([Icon, value, detail]) => (
          <Card key={value as string} className="border-border/60 shadow-sm">
            <CardHeader className="space-y-3 pb-3">
              <Icon className="size-5 text-emerald-600" />
              <CardTitle className="text-3xl font-semibold">{value as string}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-sm text-muted-foreground">{detail as string}</CardContent>
          </Card>
        ))}
      </section>
    </div>
  )
}