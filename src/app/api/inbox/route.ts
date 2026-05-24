import { NextResponse } from "next/server"

import { listInboxItems } from "@/lib/dashboard"

export async function GET() {
  const inboxItems = await listInboxItems()

  return NextResponse.json({ inboxItems })
}