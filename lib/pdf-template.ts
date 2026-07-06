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
  return "Rp " + amount.toLocaleString("id-ID")
}

export function buildDocDefinition(
  data: InvoiceFormData,
  logoBase64: string | null,
  ttdBase64: string | null
): TDocumentDefinitions {
  return {
    pageSize: "A4",
    pageMargins: [56, 48, 56, 48],
    defaultStyle: {
      font: "Roboto",
      fontSize: 12,
      lineHeight: 1.6,
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
            width: 90,
            stack: [
              logoBase64
                ? { image: logoBase64, width: 72, height: 72, alignment: "left" }
                : {
                    text: "[LOGO]",
                    fontSize: 11,
                    color: "#bbb",
                    margin: [0, 24, 0, 0],
                  },
            ],
          },
          {
            width: "*",
            stack: [
              {
                text: kosData.namaKos,
                fontSize: 14,
                bold: true,
                color: "#1e293b",
                alignment: "right",
              },
              {
                text: kosData.alamat,
                fontSize: 9,
                color: "#64748b",
                alignment: "right",
                lineHeight: 1.5,
                margin: [0, 4, 0, 0],
              },
              {
                text: kosData.kontak,
                fontSize: 9,
                color: "#64748b",
                alignment: "right",
                margin: [0, 2, 0, 0],
              },
            ],
          },
        ],
        margin: [0, 0, 0, 20],
      },
      {
        canvas: [
          { type: "line", x1: 0, y1: 0, x2: 497, y2: 0, lineWidth: 2, lineColor: "#0d9488" },
        ],
        margin: [0, 0, 0, 28],
      },

      // ── TITLE ──
      {
        text: "INVOICE",
        fontSize: 28,
        bold: true,
        color: "#0f172a",
        alignment: "center",
        margin: [0, 0, 0, 28],
      },

      // ── INFO 3-COLUMN ──
      {
        columns: [
          {
            width: "auto",
            stack: [
              { text: "No. Invoice", fontSize: 9, color: "#94a3b8", bold: true },
              {
                text: data.invoiceNumber,
                fontSize: 13,
                bold: true,
                color: "#0f172a",
                margin: [0, 2, 0, 0],
              },
            ],
          },
          {
            width: "*",
            stack: [
              { text: "Tanggal", fontSize: 9, color: "#94a3b8", bold: true, alignment: "center" },
              {
                text: data.tanggal,
                fontSize: 12,
                color: "#1e293b",
                alignment: "center",
                margin: [0, 2, 0, 0],
              },
            ],
          },
          {
            width: "auto",
            stack: [
              { text: "Jatuh Tempo", fontSize: 9, color: "#94a3b8", bold: true, alignment: "right" },
              {
                text: data.jatuhTempo,
                fontSize: 12,
                color: "#1e293b",
                alignment: "right",
                margin: [0, 2, 0, 0],
              },
            ],
          },
        ],
        margin: [0, 0, 0, 28],
      },

      // ── KEPADA ──
      {
        canvas: [
          { type: "line", x1: 0, y1: 0, x2: 497, y2: 0, lineWidth: 0.5, lineColor: "#e2e8f0" },
        ],
        margin: [0, 0, 0, 14],
      },
      { text: "Kepada Yth.", fontSize: 10, color: "#64748b", bold: true, margin: [0, 0, 0, 4] },
      {
        text: `${data.namaPenyewa}  ·  Kamar ${data.nomorKamar}`,
        fontSize: 13,
        bold: true,
        color: "#0f172a",
        margin: [0, 0, 0, 14],
      },
      {
        canvas: [
          { type: "line", x1: 0, y1: 0, x2: 497, y2: 0, lineWidth: 0.5, lineColor: "#e2e8f0" },
        ],
        margin: [0, 0, 0, 20],
      },

      // ── TABLE ──
      {
        table: {
          headerRows: 1,
          widths: ["*", "auto"],
          body: [
            [
              {
                text: "Deskripsi",
                fontSize: 10,
                bold: true,
                color: "#475569",
                fillColor: "#f1f5f9",
                margin: [10, 10, 10, 10],
              },
              {
                text: "Jumlah",
                fontSize: 10,
                bold: true,
                color: "#475569",
                alignment: "right",
                fillColor: "#f1f5f9",
                margin: [10, 10, 10, 10],
              },
            ],
            [
              {
                text: `Bayar Kos · ${data.periode}`,
                fontSize: 12,
                color: "#1e293b",
                margin: [10, 12, 10, 12],
              },
              {
                text: formatRupiah(data.nominal),
                fontSize: 12,
                color: "#1e293b",
                alignment: "right",
                margin: [10, 12, 10, 12],
              },
            ],
          ],
        },
        layout: {
          hLineWidth: () => 0.5,
          vLineWidth: () => 0,
          hLineColor: "#e2e8f0",
          paddingLeft: () => 0,
          paddingRight: () => 0,
          paddingTop: () => 0,
          paddingBottom: () => 0,
        },
        margin: [0, 0, 0, 0],
      },

      // ── TOTAL ──
      {
        table: {
          headerRows: 0,
          widths: ["*", "auto"],
          body: [
            [
              {
                text: "TOTAL",
                fontSize: 13,
                bold: true,
                color: "#0f172a",
                alignment: "right",
                margin: [0, 14, 10, 14],
              },
              {
                text: formatRupiah(data.nominal),
                fontSize: 13,
                bold: true,
                color: "#0f172a",
                alignment: "right",
                margin: [0, 14, 10, 14],
              },
            ],
          ],
        },
        layout: {
          hLineWidth: () => 0.5,
          vLineWidth: () => 0,
          hLineColor: "#0d9488",
          paddingLeft: () => 0,
          paddingRight: () => 0,
          paddingTop: () => 0,
          paddingBottom: () => 0,
        },
        margin: [0, 0, 0, 24],
      },

      // ── PEMISAH ──
      {
        canvas: [
          { type: "line", x1: 0, y1: 0, x2: 497, y2: 0, lineWidth: 0.5, lineColor: "#cbd5e1" },
        ],
        margin: [0, 0, 0, 20],
      },

      // ── INFO BANK ──
      {
        stack: [
          { text: "PEMBAYARAN", fontSize: 9, bold: true, color: "#64748b", margin: [0, 0, 0, 6] },
          {
            text: `Transfer ke ${kosData.bank}`,
            fontSize: 11,
            color: "#1e293b",
          },
          {
            text: "Harap konfirmasi setelah melakukan pembayaran.",
            fontSize: 9,
            color: "#94a3b8",
            italics: true,
            margin: [0, 4, 0, 0],
          },
        ],
        margin: [0, 0, 0, 32],
      },

      // ── SIGNATURE ──
      {
        columns: [
          { width: "*", text: "" },
          {
            width: 180,
            stack: [
              {
                text: "Hormat kami,",
                alignment: "center",
                color: "#64748b",
                fontSize: 10,
                margin: [0, 0, 0, 10],
              },
              ttdBase64
                ? {
                    image: ttdBase64,
                    width: 110,
                    height: 44,
                    alignment: "center",
                    margin: [0, 0, 0, 6],
                  }
                : {
                    text: "[TANDA TANGAN]",
                    color: "#bbb",
                    fontSize: 10,
                    alignment: "center",
                    margin: [0, 28, 0, 6],
                  },
              {
                text: kosData.pemilik,
                alignment: "center",
                bold: true,
                fontSize: 12,
                color: "#0f172a",
                margin: [0, 0, 0, 2],
              },
              {
                text: `Pemilik ${kosData.namaKos}`,
                alignment: "center",
                color: "#64748b",
                fontSize: 10,
              },
            ],
          },
        ],
      },
    ],

    // ── FOOTER ──
    footer: (currentPage: number, pageCount: number) => ({
      stack: [
        {
          canvas: [
            { type: "line", x1: 56, y1: 0, x2: 553, y2: 0, lineWidth: 0.5, lineColor: "#cbd5e1" },
          ],
          margin: [0, 0, 0, 6],
        },
        {
          columns: [
            {
              text: `${kosData.namaKos}  |  ${kosData.kontak}`,
              color: "#94a3b8",
              fontSize: 8,
              alignment: "left",
            },
            {
              text: `Hal ${currentPage} / ${pageCount}`,
              color: "#94a3b8",
              fontSize: 8,
              alignment: "right",
            },
          ],
          margin: [56, 0, 56, 12],
        },
      ],
    }),
  }
}
