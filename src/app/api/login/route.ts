import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"

export async function POST(req: Request) {
    const { email, password } = await req.json()

    const user = await prisma.user.findFirst({
        where: { email, password },
    })

    if (!user) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const cookieStore = await cookies()
    cookieStore.set("session_user_id", String(user.id), {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
    })

    return NextResponse.json({ success: true })
}