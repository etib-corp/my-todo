import { NextResponse } from "next/server"

import { createTask } from "@/lib/dashboard"

export async function GET() {
  return NextResponse.json({ ok: true })
}

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as
    | { title?: string; details?: string }
    | null

  const title = payload?.title?.trim()
  const details = payload?.details?.trim() ?? ""

  if (!title) {
    return NextResponse.json({ error: "Task title is required" }, { status: 400 })
  }

  const task = await createTask({ title, details })

  return NextResponse.json({ task })
}