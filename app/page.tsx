import InvoiceForm from "@/app/components/invoice-form"

export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh bg-gradient-to-b from-slate-50 to-white">
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center shadow-sm">
            <svg
              className="w-4 h-4 text-white"
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
          <span className="text-sm font-semibold text-slate-800">Invoice Kos</span>
        </div>
        <span className="text-[11px] text-slate-400 font-medium">Generate · Download</span>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Buat Invoice</h1>
          <p className="text-sm text-slate-500 mt-1.5">
            Masukkan data penyewa, unduh PDF siap pakai
          </p>
        </div>

        <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <InvoiceForm />
        </div>

        <p className="text-[11px] text-slate-400 mt-8 text-center max-w-xs leading-relaxed">
          Logo & tanda tangan tercantum otomatis di PDF. Hasil unduhan bisa langsung
          dicetak atau dikirim ke penyewa.
        </p>
      </main>
    </div>
  )
}
