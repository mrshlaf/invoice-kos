import { NextRequest, NextResponse } from "next/server"
import { createToken } from "@/lib/auth"

const USERNAME = "murozih"
const PASSWORD = "kostbabeaji2026"

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { username?: string; password?: string }

    if (body.username !== USERNAME || body.password !== PASSWORD) {
      return NextResponse.json(
        { error: "Username atau password salah" },
        { status: 401 }
      )
    }

    const token = await createToken(body.username)

    const response = NextResponse.json({ success: true })
    response.cookies.set("auth", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    })

    return response
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 })
  }
}
