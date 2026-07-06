import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export const config = {
  matcher: "/",
}

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("auth")?.value
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  try {
    const { verifyToken } = await import("@/lib/auth")
    const user = await verifyToken(token)
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  } catch {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}
