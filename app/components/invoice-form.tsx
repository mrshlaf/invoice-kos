"use client"

import { useState, type FormEvent } from "react"

type FormState = "idle" | "loading" | "success" | "error"

function getDefaultPeriode(): string {
  return new Date().toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  })
}

export default function InvoiceForm() {
  const today = new Date().toISOString().slice(0, 10)

  const [form, setForm] = useState({
    tanggal: today,
    namaPenyewa: "",
    nomorKamar: "",
    periode: getDefaultPeriode(),
    nominal: "",
    jatuhTempo: "",
  })

  const [state, setState] = useState<FormState>("idle")
  const [errorMsg, setErrorMsg] = useState("")

  const formatNominal = (value: string): string => {
    const num = value.replace(/\D/g, "")
    if (!num) return ""
    return Number(num).toLocaleString("id-ID")
  }

  const handleNominalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "")
    setForm((prev) => ({ ...prev, nominal: raw }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setState("loading")
    setErrorMsg("")

    if (!form.namaPenyewa || !form.nomorKamar || !form.jatuhTempo) {
      setState("idle")
      setErrorMsg("Lengkapi semua field yang wajib diisi")
      return
    }

    try {
      const res = await fetch("/api/generate-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tanggal: form.tanggal,
          namaPenyewa: form.namaPenyewa,
          nomorKamar: form.nomorKamar,
          periode: form.periode || getDefaultPeriode(),
          nominal: Number(form.nominal) || 0,
          jatuhTempo: form.jatuhTempo,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Gagal membuat PDF")
      }

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `INV-${form.tanggal}_${form.namaPenyewa.replace(/\s+/g, "_").toLowerCase()}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setState("success")
      setTimeout(() => setState("idle"), 3000)
    } catch (err) {
      setState("error")
      setErrorMsg(err instanceof Error ? err.message : "Terjadi kesalahan")
    }
  }

  const displayNominal = form.nominal ? formatNominal(form.nominal) : ""

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto space-y-4">
      <div className="space-y-1">
        <label
          htmlFor="tanggal"
          className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider"
        >
          Tanggal Invoice
        </label>
        <input
          id="tanggal"
          type="date"
          value={form.tanggal}
          onChange={(e) => setForm((p) => ({ ...p, tanggal: e.target.value }))}
          className="w-full px-3 py-2.5 border border-gray-300 rounded text-sm text-gray-900 bg-white placeholder:text-gray-400 focus:outline-none focus:border-[#172336] focus:ring-1 focus:ring-[#172336] transition-colors"
        />
      </div>

      <div className="space-y-1">
        <label
          htmlFor="namaPenyewa"
          className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider"
        >
          Nama Penyewa
        </label>
        <input
          id="namaPenyewa"
          type="text"
          placeholder="cth: Mouza Ayesha Chana"
          value={form.namaPenyewa}
          onChange={(e) => setForm((p) => ({ ...p, namaPenyewa: e.target.value }))}
          className="w-full px-3 py-2.5 border border-gray-300 rounded text-sm text-gray-900 bg-white placeholder:text-gray-400 focus:outline-none focus:border-[#172336] focus:ring-1 focus:ring-[#172336] transition-colors"
          required
        />
      </div>

      <div className="space-y-1">
        <label
          htmlFor="nomorKamar"
          className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider"
        >
          Nomor Kamar
        </label>
        <input
          id="nomorKamar"
          type="text"
          placeholder="cth: 3A"
          value={form.nomorKamar}
          onChange={(e) => setForm((p) => ({ ...p, nomorKamar: e.target.value }))}
          className="w-full px-3 py-2.5 border border-gray-300 rounded text-sm text-gray-900 bg-white placeholder:text-gray-400 focus:outline-none focus:border-[#172336] focus:ring-1 focus:ring-[#172336] transition-colors"
          required
        />
      </div>

      <div className="space-y-1">
        <label
          htmlFor="periode"
          className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider"
        >
          Periode Pembayaran
        </label>
        <input
          id="periode"
          type="text"
          placeholder={getDefaultPeriode()}
          value={form.periode}
          onChange={(e) => setForm((p) => ({ ...p, periode: e.target.value }))}
          className="w-full px-3 py-2.5 border border-gray-300 rounded text-sm text-gray-900 bg-white placeholder:text-gray-400 focus:outline-none focus:border-[#172336] focus:ring-1 focus:ring-[#172336] transition-colors"
        />
      </div>

      <div className="space-y-1">
        <label
          htmlFor="nominal"
          className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider"
        >
          Nominal
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">Rp</span>
          <input
            id="nominal"
            type="text"
            placeholder="1.500.000"
            value={displayNominal ? `Rp ${displayNominal}` : ""}
            onChange={handleNominalChange}
            className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded text-sm text-gray-900 bg-white placeholder:text-gray-400 focus:outline-none focus:border-[#172336] focus:ring-1 focus:ring-[#172336] transition-colors"
            required
          />
        </div>
      </div>

      <div className="space-y-1">
        <label
          htmlFor="jatuhTempo"
          className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider"
        >
          Jatuh Tempo
        </label>
        <input
          id="jatuhTempo"
          type="date"
          value={form.jatuhTempo}
          onChange={(e) => setForm((p) => ({ ...p, jatuhTempo: e.target.value }))}
          className="w-full px-3 py-2.5 border border-gray-300 rounded text-sm text-gray-900 bg-white focus:outline-none focus:border-[#172336] focus:ring-1 focus:ring-[#172336] transition-colors"
          required
        />
      </div>

      {errorMsg && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2.5">
          {errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={state === "loading"}
        className="w-full py-3 px-4 rounded bg-[#172336] hover:bg-[#1f2f4a] active:bg-[#131d2e] disabled:bg-gray-400 text-white text-sm font-semibold tracking-wide transition-all cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {state === "loading" ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            Memproses...
          </>
        ) : state === "success" ? (
          "✓ PDF Terunduh"
        ) : (
          "Download PDF"
        )}
      </button>
    </form>
  )
}
