import { NextRequest, NextResponse } from "next/server"
import { readFileSync } from "fs"
import path from "path"
import { buildDocDefinition } from "@/lib/pdf-template"
import type { InvoiceFormData } from "@/lib/pdf-template"

// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfmake = require("pdfmake/js/index") as {
  createPdf(
    docDefinition: unknown,
    options?: unknown
  ): { getBuffer(): Promise<Buffer> }
  addFonts(fonts: Record<string, Record<string, string>>): void
  setLocalAccessPolicy(callback: (path: string) => boolean): void
}

function initPdfmake() {
  const fontsDir = path.join(
    process.cwd(),
    "node_modules/pdfmake/build/fonts/Roboto"
  )
  pdfmake.addFonts({
    Roboto: {
      normal: path.join(fontsDir, "Roboto-Regular.ttf"),
      bold: path.join(fontsDir, "Roboto-Medium.ttf"),
      italics: path.join(fontsDir, "Roboto-Italic.ttf"),
      bolditalics: path.join(fontsDir, "Roboto-MediumItalic.ttf"),
    },
  })
  pdfmake.setLocalAccessPolicy(
    (p: string) => p.startsWith(process.cwd()) || p.startsWith("Roboto")
  )
}

initPdfmake()

async function readImageAsBase64(relativePath: string): Promise<string | null> {
  try {
    const filePath = path.join(process.cwd(), "public", relativePath)
    const buffer = readFileSync(filePath)
    const ext = path.extname(relativePath).slice(1).toLowerCase()
    if (ext !== "png" && ext !== "jpg" && ext !== "jpeg") return null
    return `data:image/${ext === "jpg" ? "jpeg" : ext};base64,${buffer.toString("base64")}`
  } catch {
    return null
  }
}

function generateInvoiceNumber(tanggal: string): string {
  const d = new Date(tanggal + "T00:00:00")
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `INV-${y}${m}${day}`
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Record<string, unknown>

    if (
      !body.tanggal ||
      !body.namaPenyewa ||
      !body.nomorKamar ||
      !body.nominal ||
      !body.jatuhTempo
    ) {
      return NextResponse.json({ error: "Semua field harus diisi" }, { status: 400 })
    }

    const data: InvoiceFormData = {
      invoiceNumber: generateInvoiceNumber(body.tanggal as string),
      tanggal: body.tanggal as string,
      namaPenyewa: body.namaPenyewa as string,
      nomorKamar: body.nomorKamar as string,
      periode: (body.periode as string) || "",
      nominal: Number(body.nominal) || 0,
      jatuhTempo: body.jatuhTempo as string,
    }

    const [logoBase64, ttdBase64] = await Promise.all([
      readImageAsBase64("logo.png"),
      readImageAsBase64("lunas-kost.png"),
    ])

    const docDefinition = buildDocDefinition(data, logoBase64, ttdBase64)
    const pdfDoc = pdfmake.createPdf(docDefinition)
    const buffer = await pdfDoc.getBuffer()

    const safeName = data.namaPenyewa.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase()
    const filename = `INV-${data.invoiceNumber}_${safeName}.pdf`

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error("PDF generation error:", error)
    return NextResponse.json({ error: "Gagal membuat PDF" }, { status: 500 })
  }
}
