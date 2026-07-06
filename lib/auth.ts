export async function createToken(username: string): Promise<string> {
  const payload = JSON.stringify({
    user: username,
    exp: Date.now() + 24 * 60 * 60 * 1000,
  })
  const buf = Buffer.from(payload)
  const hmac = await crypto.subtle
    .sign(
      "HMAC",
      await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(process.env.AUTH_SECRET || "fallback"),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
      ),
      buf
    )
    .then((s) => Buffer.from(s).toString("base64url"))

  return `${buf.toString("base64url")}.${hmac}`
}

export async function verifyToken(token: string): Promise<string | null> {
  try {
    const parts = token.split(".")
    if (parts.length !== 2) return null

    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(process.env.AUTH_SECRET || "fallback"),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    )

    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      Buffer.from(parts[1], "base64url"),
      Buffer.from(parts[0], "base64url")
    )
    if (!valid) return null

    const data = JSON.parse(Buffer.from(parts[0], "base64url").toString())
    if (data.exp && data.exp < Date.now()) return null
    return data.user || null
  } catch {
    return null
  }
}
