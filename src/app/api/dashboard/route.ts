import { NextResponse } from "next/server"
import { getOverviewData } from "@/lib/dashboard"

export async function GET() {
    const overview = await getOverviewData()
    return NextResponse.json({ overview })
}