import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"

export async function getSession() {
    const cookieStore = await cookies()
    const userId = cookieStore.get("session_user_id")?.value
    if (!userId) return null

    const user = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
        select: { id: true, name: true, email: true, status: true },
    })

    return user ?? null
}