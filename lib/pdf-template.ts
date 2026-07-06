import type { TDocumentDefinitions } from "pdfmake/interfaces"
import { kosData } from "./data"

export interface InvoiceFormData {
  invoiceNumber: string
  tanggal: string
  namaPenyewa: string
  nomorKamar: string
  periode: string
  nominal: number
  jatuhTempo: string
}

function formatRupiah(amount: number): string {
  return "Rp " + amount.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function formatNumber(amount: number): string {
  return amount.toLocaleString("id-ID", { minimumFractionDigits: 0, maximumFractionDigits: 2 })
}

export function buildDocDefinition(
  data: InvoiceFormData,
  logoBase64: string | null,
  ttdBase64: string | null
): TDocumentDefinitions {
  const navyBlue = "#172336" // navy from logo
  const orange = "#172336" // gold from logo
  const textDark = "#1e293b" // slate-800
  const textLight = "#64748b" // slate-500

  return {
    pageSize: "A4",
    pageMargins: [40, 40, 40, 40],
    defaultStyle: {
      font: "Roboto",
      fontSize: 10,
      lineHeight: 1.3,
      color: textDark,
    },
    info: {
      title: `INV-${data.invoiceNumber} - ${data.namaPenyewa}`,
      author: kosData.pemilik,
    },
    content: [
      // ── HEADER ──
      {
        columns: [
          {
            width: "*",
            stack: [
              {
                text: "INVOICE",
                fontSize: 28,
                bold: true,
                color: navyBlue,
                margin: [0, 0, 0, 12],
              },
              {
                text: kosData.namaKos,
                fontSize: 11,
                bold: true,
                color: navyBlue,
              },
              {
                text: kosData.alamat,
                fontSize: 9,
                margin: [0, 2, 0, 0],
              },
              {
                text: kosData.kontak,
                fontSize: 9,
                margin: [0, 2, 0, 0],
              },
            ],
          },
          {
            width: 100,
            stack: [
              logoBase64
                ? { image: logoBase64, width: 140, alignment: "right" }
                : {
                    text: "",
                    alignment: "right",
                  },
            ],
          },
        ],
        margin: [0, 0, 0, 24],
      },

      // ── BILLING INFO ──
      {
        columns: [
          {
            width: "50%",
            stack: [
              { text: "TAGIHAN KEPADA", fontSize: 9, bold: true, color: orange, margin: [0, 0, 0, 4] },
              { text: data.namaPenyewa, fontSize: 11, bold: true, color: navyBlue },
              { text: `Kamar ${data.nomorKamar}`, fontSize: 10, margin: [0, 2, 0, 0] },
            ],
          },
          {
            width: "50%",
            stack: [
              {
                columns: [
                  { text: "NO. INVOICE", width: 100, fontSize: 9, bold: true, color: orange },
                  { text: data.invoiceNumber, width: "*", fontSize: 10, alignment: "right", bold: true, color: navyBlue },
                ],
                margin: [0, 0, 0, 4],
              },
              {
                columns: [
                  { text: "TANGGAL", width: 100, fontSize: 9, bold: true, color: orange },
                  { text: data.tanggal, width: "*", fontSize: 10, alignment: "right" },
                ],
                margin: [0, 0, 0, 4],
              },
              {
                columns: [
                  { text: "JATUH TEMPO", width: 100, fontSize: 9, bold: true, color: orange },
                  { text: data.jatuhTempo, width: "*", fontSize: 10, alignment: "right" },
                ],
              },
            ],
          },
        ],
        margin: [0, 0, 0, 24],
      },

      // ── TABLE ──
      {
        table: {
          headerRows: 1,
          widths: [30, "*", 100, 100],
          body: [
            [
              { text: "QTY", fontSize: 9, bold: true, color: navyBlue, alignment: "center" },
              { text: "DESKRIPSI", fontSize: 9, bold: true, color: navyBlue },
              { text: "HARGA", fontSize: 9, bold: true, color: navyBlue, alignment: "right" },
              { text: "TOTAL", fontSize: 9, bold: true, color: navyBlue, alignment: "right" },
            ],
            [
              { text: "1", fontSize: 10, alignment: "center", margin: [0, 2, 0, 0] },
              {
                stack: [
                  { text: "Pembayaran Sewa Kamar Kos", fontSize: 10, bold: true, color: textDark },
                  { text: `Periode: ${data.periode}`, fontSize: 9, color: textLight, margin: [0, 2, 0, 0] },
                ],
              },
              { text: formatRupiah(data.nominal), fontSize: 10, alignment: "right", margin: [0, 2, 0, 0] },
              { text: formatRupiah(data.nominal), fontSize: 10, alignment: "right", margin: [0, 2, 0, 0] },
            ],
          ],
        },
        layout: {
          hLineWidth: (i, node) => {
            if (i === 0 || i === 1) return 1.5;
            if (i === node.table.body.length) return 1;
            return 0.5;
          },
          vLineWidth: () => 0,
          hLineColor: (i) => {
            if (i === 0 || i === 1) return orange;
            return "#cbd5e1"; // slate-300
          },
          paddingTop: () => 10,
          paddingBottom: () => 10,
        },
        margin: [0, 0, 0, 16],
      },

      // ── TOTALS ──
      {
        columns: [
          { width: "*", text: "" },
          {
            width: 240,
            table: {
              widths: ["*", "auto"],
              body: [
                [
                  { text: "Subtotal", fontSize: 10, margin: [0, 4, 16, 4], alignment: "right" },
                  { text: formatRupiah(data.nominal), fontSize: 10, alignment: "right", margin: [0, 4, 0, 4] },
                ],
                [
                  { text: "TOTAL", fontSize: 12, bold: true, color: navyBlue, margin: [0, 8, 16, 4], alignment: "right" },
                  { text: formatRupiah(data.nominal), fontSize: 12, bold: true, color: navyBlue, alignment: "right", margin: [0, 8, 0, 4] },
                ],
              ],
            },
            layout: {
              hLineWidth: (i) => (i === 1 ? 1.5 : 0),
              vLineWidth: () => 0,
              hLineColor: () => navyBlue,
              paddingTop: () => 4,
              paddingBottom: () => 4,
            },
          },
        ],
        margin: [0, 0, 0, 32],
      },

      // ── TERMS & SIGNATURE (SIDE BY SIDE) ──
      {
        columns: [
          {
            width: "*",
            stack: [
              { text: "SYARAT & KETENTUAN", fontSize: 9, bold: true, color: orange, margin: [0, 0, 0, 6] },
              { text: `Pembayaran paling lambat tanggal ${data.jatuhTempo}`, fontSize: 9, margin: [0, 0, 0, 2] },
              { text: `Pembayaran dapat ditransfer ke rekening berikut:`, fontSize: 9, margin: [0, 0, 0, 2] },
              { text: kosData.bank, fontSize: 9, bold: true, color: navyBlue, margin: [0, 0, 0, 12] },
              { text: "Terima kasih atas kepercayaannya!", fontSize: 11, bold: true, italics: true, color: navyBlue },
            ],
            margin: [0, 12, 0, 0],
          },
          {
            width: 200,
            stack: [
              ttdBase64
                ? {
                    image: ttdBase64,
                    width: 120,
                    alignment: "right",
                    margin: [0, 0, 0, 8],
                  }
                : {
                    text: "[CAP LUNAS]",
                    color: textLight,
                    fontSize: 10,
                    alignment: "right",
                    margin: [0, 20, 0, 20],
                  },
              {
                text: kosData.pemilik,
                alignment: "right",
                bold: true,
                fontSize: 11,
                color: navyBlue,
                margin: [0, 0, 0, 2],
              },
              {
                text: "Pemilik Kos",
                alignment: "right",
                fontSize: 9,
                color: textLight,
              },
            ],
          },
        ],
      },
    ],
  }
}
