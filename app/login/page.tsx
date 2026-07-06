"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Username atau password salah")
      }

      router.push("/")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#fdfbf7] px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Image
            src="/logo.png"
            alt="Kost Babe Aji"
            width={120}
            height={120}
            className="rounded mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-[#172336]">Sistem Invoice</h1>
          <p className="text-sm text-gray-500 mt-1">Masuk untuk membuat invoice Kost Babe Aji</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-lg p-6 space-y-4"
        >
          <div className="space-y-1">
            <label
              htmlFor="username"
              className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Masukkan username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded text-sm text-[#172336] bg-white placeholder:text-gray-400 focus:outline-none focus:border-[#172336] focus:ring-1 focus:ring-[#172336] transition-colors"
              required
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="password"
              className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded text-sm text-[#172336] bg-white placeholder:text-gray-400 focus:outline-none focus:border-[#172336] focus:ring-1 focus:ring-[#172336] transition-colors"
              required
            />
          </div>

          {error && (
            <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2.5">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded bg-[#172336] hover:bg-gray-800 active:bg-gray-700 disabled:bg-gray-400 text-white text-sm font-semibold tracking-wide transition-all cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Memproses...
              </>
            ) : (
              "Masuk"
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
