import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const PUBLIC_PATHS = ["/login", "/api/login"]

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p))

    if (isPublic) return NextResponse.next()

    const session = request.cookies.get("session_user_id")?.value
    if (!session) {
        const loginUrl = new URL("/login", request.url)
        return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}