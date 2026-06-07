import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"
import bcrypt from "bcrypt";

export async function POST(req: Request) {
    const { name, password } = await req.json()

    const hashedPassword = await bcrypt.hash(password, process.env.PASSWORD_SALT!);

    const user = await prisma.user.findFirst({
        where: { name: name, password: hashedPassword },
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