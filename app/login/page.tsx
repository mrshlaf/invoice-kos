"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"

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
    <div className="flex min-h-dvh items-center justify-center bg-gradient-to-b from-slate-50 to-white px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center shadow-sm mx-auto mb-4">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-slate-800">Invoice Kos</h1>
          <p className="text-sm text-slate-500 mt-1">Masuk untuk melanjutkan</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4"
        >
          <div className="space-y-1.5">
            <label
              htmlFor="username"
              className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Masukkan username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3.5 py-3 border border-slate-200 rounded-xl text-sm text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-shadow shadow-sm"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-3 border border-slate-200 rounded-xl text-sm text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-shadow shadow-sm"
              required
            />
          </div>

          {error && (
            <div className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:bg-emerald-300 text-white text-sm font-semibold tracking-wide transition-all cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
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
