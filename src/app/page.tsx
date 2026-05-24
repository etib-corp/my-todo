import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles } from "lucide-react"

export default function Page() {
  return (
    <div className="flex flex-1 flex-col bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.12),transparent_34%),radial-gradient(circle_at_top_right,rgba(15,23,42,0.06),transparent_28%)]">
      <div className="@container/main flex flex-1 flex-col gap-6 px-4 py-4 md:gap-8 md:py-6 lg:px-6">
        <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <Card className="overflow-hidden border-border/60 bg-linear-to-br from-card via-card to-emerald-500/5 shadow-sm">
            <CardHeader className="gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className="rounded-full border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                >
                  <span className="mr-1 size-2 rounded-full bg-emerald-500" />
                  Live workspace
                </Badge>
                <Badge variant="secondary" className="rounded-full">
                  <Sparkles className="mr-1 size-3.5" />
                  Organized for quick handoff
                </Badge>
              </div>
              <div className="space-y-3">
                <CardTitle className="max-w-3xl text-3xl font-semibold tracking-tight md:text-4xl">
                  One place for focused work, team coordination, and live updates.
                </CardTitle>
                <CardDescription className="max-w-2xl text-base leading-7 text-muted-foreground">
                  Use the sidebar to move between personal focus, team sync, project planning, and live activity without losing context.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="grid gap-5 md:grid-cols-3">
              {[
                ["Focus time", "4h 32m", "Protected blocks for deep work."],
                ["Team updates", "12", "Async notes that moved work forward."],
                ["Open blockers", "2", "Issues still waiting on a decision."],
              ].map(([label, value, detail]) => (
                <div key={label} className="rounded-2xl border bg-background/70 p-4 shadow-sm">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
                  <p className="mt-2 text-2xl font-semibold">{value}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">What to do next</CardTitle>
              <CardDescription>
                Jump into the most relevant workspace section.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                ["Open Focus", "/focus"],
                ["Check Team Sync", "/team"],
                ["Review Projects", "/projects"],
                ["Scan Activity", "/activity"],
              ].map(([label, href]) => (
                <Link
                  key={label}
                  href={href}
                  className="flex items-center justify-between rounded-2xl border bg-muted/20 px-4 py-3 text-sm font-medium transition-colors hover:bg-muted/40"
                >
                  <span>{label}</span>
                  <span aria-hidden>→</span>
                </Link>
              ))}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}