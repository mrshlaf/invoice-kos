import Image from "next/image"
import InvoiceForm from "@/app/components/invoice-form"

export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh bg-white">
      <header className="flex items-center justify-between px-6 py-3 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Kost Babe Aji"
            width={40}
            height={40}
            className="rounded"
          />
          <span className="text-sm font-semibold text-gray-800">Kost Babe Aji</span>
        </div>
        <span className="text-[11px] text-gray-400 font-medium">Invoice Generator</span>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center mb-8">
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Buat Invoice Baru</h1>
          <p className="text-sm text-gray-500 mt-1">
            Masukkan data penyewa untuk membuat invoice
          </p>
        </div>

        <div className="w-full bg-white border border-gray-200 rounded-lg p-6 sm:p-8">
          <InvoiceForm />
        </div>

        <p className="text-[11px] text-gray-400 mt-8 text-center max-w-xs leading-relaxed">
          Invoice akan otomatis menyertakan logo, nomor invoice,
          dan tanda tangan resmi.
        </p>
      </main>
    </div>
  )
}
