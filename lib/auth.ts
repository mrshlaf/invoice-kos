function toBase64Url(buf: Uint8Array): string {
  let s = ""
  for (let i = 0; i < buf.length; i++) s += String.fromCharCode(buf[i])
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

function fromBase64Url(str: string): Uint8Array {
  str = str.replace(/-/g, "+").replace(/_/g, "/")
  while (str.length % 4) str += "="
  return Uint8Array.from(atob(str), (c) => c.charCodeAt(0))
}

function encodeText(s: string): Uint8Array {
  return new TextEncoder().encode(s)
}

function decodeText(buf: Uint8Array): string {
  return new TextDecoder().decode(buf)
}

async function getHmacKey(usage: Array<"sign" | "verify">): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encodeText(process.env.AUTH_SECRET || "fallback") as unknown as BufferSource,
    { name: "HMAC", hash: "SHA-256" },
    false,
    usage
  )
}

export async function createToken(username: string): Promise<string> {
  const payload = encodeText(
    JSON.stringify({ user: username, exp: Date.now() + 86400000 })
  )
  const sig = new Uint8Array(
    await crypto.subtle.sign(
      "HMAC",
      await getHmacKey(["sign"]),
      payload as unknown as BufferSource
    )
  )
  return `${toBase64Url(payload)}.${toBase64Url(sig)}`
}

export async function verifyToken(token: string): Promise<string | null> {
  try {
    const parts = token.split(".")
    if (parts.length !== 2) return null

    const payload = fromBase64Url(parts[0])
    const sig = fromBase64Url(parts[1])

    const valid = await crypto.subtle.verify(
      "HMAC",
      await getHmacKey(["verify"]),
      sig as unknown as BufferSource,
      payload as unknown as BufferSource
    )
    if (!valid) return null

    const data = JSON.parse(decodeText(payload))
    if (data.exp && data.exp < Date.now()) return null
    return data.user || null
  } catch {
    return null
  }
}
