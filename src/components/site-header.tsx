import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/mode-toggle"

export function SiteHeader({
  title = "Documents",
  subtitle,
  status = "Live",
}: {
  title?: string
  subtitle?: string
  status?: string
}) {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 h-4 data-vertical:self-auto"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h1 className="truncate text-base font-semibold">{title}</h1>
            <Badge
              variant="outline"
              className="rounded-full px-2 py-0 text-[11px] font-medium text-emerald-700 dark:text-emerald-300"
            >
              {status}
            </Badge>
          </div>
          {subtitle ? (
            <p className="truncate text-xs text-muted-foreground">
              {subtitle}
            </p>
          ) : null}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
