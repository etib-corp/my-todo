import { NextResponse } from "next/server"

import {
  createInboxItem,
  deleteInboxItem,
  listInboxItems,
  InboxItemCreationParams,
  InboxItemsListingParams
} from "@/lib/back/inbox_item"

export async function GET(params: URLSearchParams) {
  const idParam = params.get("id")
  const categoryParam = params.get("category")
  const userIdParam = params.get("userId")

  const searchParams: InboxItemsListingParams = {
    id: idParam ? parseInt(idParam) : undefined,
    category: categoryParam ?? undefined,
    userId: userIdParam ? parseInt(userIdParam) : undefined,
  }

  const inboxItems = await listInboxItems(searchParams)

  return NextResponse.json({ inboxItems })
}

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as {
    title?: string
    description?: string
    category?: string
    href?: string
    userId?: number
  } | null

  if (!payload) {
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 },
    )
  }

  const data: InboxItemCreationParams = {
    title: payload.title ?? "",
    description: payload.description ?? "",
    category: payload.category ?? "",
    href: payload.href ?? undefined,
    userId: payload.userId ?? 0,
  }

  if (!data.title || !data.description || !data.category || !data.userId) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    )
  }

  const inboxItem = await createInboxItem(data)

  return NextResponse.json({ inboxItem })
}

export async function DELETE(request: Request) {
  const payload = (await request.json().catch(() => null)) as {
    id?: number
  } | null

  if (!payload) {
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 },
    )
  }

  const { id } = payload

  if (!id) {
    return NextResponse.json(
      { error: "Inbox item ID is required" },
      { status: 400 },
    )
  }

  await deleteInboxItem(id)

  return NextResponse.json({ message: "Inbox item deleted successfully" })
}