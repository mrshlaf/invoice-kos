const AUTH_SECRET = process.env.AUTH_SECRET || "fallback-secret"

async function getKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(AUTH_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  )
}

function encodeBase64Url(buf: Uint8Array): string {
  return btoa(String.fromCharCode(...buf))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "")
}

function decodeBase64Url(str: string): ArrayBuffer {
  str = str.replace(/-/g, "+").replace(/_/g, "/")
  while (str.length % 4) str += "="
  return Uint8Array.from(atob(str), (c) => c.charCodeAt(0)).buffer as ArrayBuffer
}

export async function createToken(username: string): Promise<string> {
  const header = encodeBase64Url(new TextEncoder().encode('{"alg":"HS256"}'))
  const payload = encodeBase64Url(
    new TextEncoder().encode(
      JSON.stringify({
        user: username,
        exp: Date.now() + 24 * 60 * 60 * 1000,
      })
    )
  )
  const key = await getKey()
  const sigBuf = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(`${header}.${payload}`)
  )
  const sig = encodeBase64Url(new Uint8Array(sigBuf))
  return `${header}.${payload}.${sig}`
}

export async function verifyToken(token: string): Promise<string | null> {
  try {
    const parts = token.split(".")
    if (parts.length !== 3) return null
    const [header, payload, sig] = parts
    const key = await getKey()
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      decodeBase64Url(sig),
      new TextEncoder().encode(`${header}.${payload}`)
    )
    if (!valid) return null
    const data = JSON.parse(new TextDecoder().decode(decodeBase64Url(payload)))
    if (data.exp && data.exp < Date.now()) return null
    return data.user || null
  } catch {
    return null
  }
}
