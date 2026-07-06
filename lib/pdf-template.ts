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
    pageMargins: [56, 60, 56, 60],
    defaultStyle: {
      font: "Roboto",
      fontSize: 10,
      lineHeight: 1.4,
      color: "#000000",
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
            width: 110,
            stack: [
              logoBase64
                ? { image: logoBase64, width: 96, height: 96, alignment: "left" }
                : {
                    text: "[LOGO]",
                    fontSize: 10,
                    color: "#999",
                    margin: [0, 32, 0, 0],
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
                color: "#000000",
                alignment: "right",
              },
              {
                text: kosData.alamat,
                fontSize: 9,
                color: "#333333",
                alignment: "right",
                lineHeight: 1.4,
                margin: [0, 4, 0, 0],
              },
              {
                text: kosData.kontak,
                fontSize: 9,
                color: "#333333",
                alignment: "right",
                margin: [0, 2, 0, 0],
              },
            ],
          },
        ],
        margin: [0, 0, 0, 24],
      },
      {
        canvas: [
          { type: "line", x1: 0, y1: 0, x2: 497, y2: 0, lineWidth: 1, lineColor: "#000000" },
        ],
        margin: [0, 0, 0, 28],
      },

      // ── TITLE ──
      {
        text: "INVOICE",
        fontSize: 22,
        bold: true,
        color: "#000000",
        alignment: "center",
        margin: [0, 0, 0, 24],
      },

      // ── INFO ROW ──
      {
        columns: [
          {
            width: "*",
            stack: [
              { text: "No. Invoice", fontSize: 8, color: "#666666", bold: true },
              {
                text: data.invoiceNumber,
                fontSize: 11,
                bold: true,
                color: "#000000",
                margin: [0, 2, 0, 0],
              },
            ],
          },
          {
            width: "*",
            stack: [
              { text: "Tanggal", fontSize: 8, color: "#666666", bold: true, alignment: "center" },
              {
                text: data.tanggal,
                fontSize: 10,
                color: "#000000",
                alignment: "center",
                margin: [0, 2, 0, 0],
              },
            ],
          },
          {
            width: "*",
            stack: [
              { text: "Jatuh Tempo", fontSize: 8, color: "#666666", bold: true, alignment: "right" },
              {
                text: data.jatuhTempo,
                fontSize: 10,
                color: "#000000",
                alignment: "right",
                margin: [0, 2, 0, 0],
              },
            ],
          },
        ],
        margin: [0, 0, 0, 24],
      },

      // ── CUSTOMER ──
      {
        text: "Kepada Yth.",
        fontSize: 9,
        color: "#666666",
        bold: true,
        margin: [0, 0, 0, 4],
      },
      {
        text: `${data.namaPenyewa}  ·  Kamar ${data.nomorKamar}`,
        fontSize: 12,
        bold: true,
        color: "#000000",
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
                fontSize: 9,
                bold: true,
                color: "#000000",
                fillColor: "#f5f5f5",
                margin: [8, 8, 8, 8],
              },
              {
                text: "Jumlah",
                fontSize: 9,
                bold: true,
                color: "#000000",
                alignment: "right",
                fillColor: "#f5f5f5",
                margin: [8, 8, 8, 8],
              },
            ],
            [
              {
                text: `Bayar Kos · ${data.periode}`,
                fontSize: 10,
                color: "#000000",
                margin: [8, 10, 8, 10],
              },
              {
                text: formatRupiah(data.nominal),
                fontSize: 10,
                color: "#000000",
                alignment: "right",
                margin: [8, 10, 8, 10],
              },
            ],
          ],
        },
        layout: {
          hLineWidth: (i: number) => (i === 0 || i === 1 ? 0.5 : 0),
          vLineWidth: () => 0,
          hLineColor: "#000000",
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
                fontSize: 11,
                bold: true,
                color: "#000000",
                alignment: "right",
                margin: [0, 10, 8, 10],
              },
              {
                text: formatRupiah(data.nominal),
                fontSize: 11,
                bold: true,
                color: "#000000",
                alignment: "right",
                margin: [0, 10, 8, 10],
              },
            ],
          ],
        },
        layout: {
          hLineWidth: () => 0.5,
          vLineWidth: () => 0,
          hLineColor: "#000000",
          paddingLeft: () => 0,
          paddingRight: () => 0,
          paddingTop: () => 0,
          paddingBottom: () => 0,
        },
        margin: [0, 0, 0, 28],
      },

      // ── PEMISAH ──
      {
        canvas: [
          { type: "line", x1: 0, y1: 0, x2: 497, y2: 0, lineWidth: 0.5, lineColor: "#999999" },
        ],
        margin: [0, 0, 0, 20],
      },

      // ── INFO BANK ──
      {
        stack: [
          { text: "PEMBAYARAN", fontSize: 9, bold: true, color: "#666666", margin: [0, 0, 0, 6] },
          {
            text: `Transfer ke ${kosData.bank}`,
            fontSize: 10,
            color: "#000000",
          },
          {
            text: "Harap konfirmasi setelah melakukan pembayaran.",
            fontSize: 9,
            color: "#999999",
            italics: true,
            margin: [0, 4, 0, 0],
          },
        ],
        margin: [0, 0, 0, 28],
      },

      // ── SIGNATURE ──
      {
        columns: [
          { width: "*", text: "" },
          {
            width: 200,
            stack: [
              {
                text: "Hormat kami,",
                alignment: "center",
                color: "#666666",
                fontSize: 10,
                margin: [0, 0, 0, 8],
              },
              {
                canvas: [
                  {
                    type: "line",
                    x1: 20,
                    y1: 0,
                    x2: 180,
                    y2: 0,
                    lineWidth: 0.5,
                    lineColor: "#666666",
                    dash: { length: 4, space: 2 },
                  },
                ],
                margin: [0, 0, 0, 12],
              },
              ttdBase64
                ? {
                    stack: [
                      {
                        image: ttdBase64,
                        width: 160,
                        height: 58,
                        alignment: "center",
                        margin: [0, -28, 0, 0],
                      },
                      {
                        text: kosData.pemilik,
                        alignment: "center",
                        bold: true,
                        fontSize: 11,
                        color: "#000000",
                        margin: [0, 2, 0, 2],
                      },
                      {
                        text: `Pemilik ${kosData.namaKos}`,
                        alignment: "center",
                        color: "#666666",
                        fontSize: 9,
                      },
                    ],
                  }
                : {
                    stack: [
                      {
                        text: "[TANDA TANGAN]",
                        color: "#999",
                        fontSize: 10,
                        alignment: "center",
                        margin: [0, 24, 0, 6],
                      },
                      {
                        text: kosData.pemilik,
                        alignment: "center",
                        bold: true,
                        fontSize: 11,
                        color: "#000000",
                        margin: [0, 0, 0, 2],
                      },
                      {
                        text: `Pemilik ${kosData.namaKos}`,
                        alignment: "center",
                        color: "#666666",
                        fontSize: 9,
                      },
                    ],
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
            { type: "line", x1: 56, y1: 0, x2: 553, y2: 0, lineWidth: 0.5, lineColor: "#999999" },
          ],
          margin: [0, 0, 0, 4],
        },
        {
          columns: [
            {
              text: `${kosData.namaKos}  |  ${kosData.kontak}`,
              color: "#999999",
              fontSize: 8,
              alignment: "left",
            },
            {
              text: `Hal ${currentPage} / ${pageCount}`,
              color: "#999999",
              fontSize: 8,
              alignment: "right",
            },
          ],
          margin: [56, 0, 56, 8],
        },
      ],
    }),
  }
}
