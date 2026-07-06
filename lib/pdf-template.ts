import type { TDocumentDefinitions } from "pdfmake/interfaces"
import { kosData, bankInfo } from "./data"

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

const navy = "#172336"
const gold = "#cca373"
const creamBg = "#fdfbf7"
const textDark = "#1e293b"
const textLight = "#64748b"
const textMuted = "#94a3b8"

export function buildDocDefinition(
  data: InvoiceFormData,
  logoBase64: string | null,
  ttdBase64: string | null
): TDocumentDefinitions {
  return {
    pageSize: "A4",
    pageMargins: [0, 0, 0, 0],
    defaultStyle: {
      font: "Roboto",
      fontSize: 10,
      lineHeight: 1.35,
      color: textDark,
    },
    info: {
      title: `${data.invoiceNumber} - ${data.namaPenyewa}`,
      author: kosData.pemilik,
    },
    content: [
      // ════════════════════════════════════════════
      // 1. HEADER BANNER (full-width, navy background)
      // ════════════════════════════════════════════
      {
        table: {
          widths: ["*"],
          body: [
            [
              {
                columns: [
                  {
                    width: "auto",
                    stack: [
                      logoBase64
                        ? {
                            image: logoBase64,
                            width: 42,
                            height: 42,
                            alignment: "left",
                            margin: [0, 2, 14, 2],
                          }
                        : { text: "", margin: [0, 0, 14, 0] },
                    ],
                  },
                  {
                    width: "*",
                    stack: [
                      { text: "KOST BABE AJI", fontSize: 17, bold: true, color: "#ffffff", margin: [0, 0, 0, 2] },
                    ],
                  },
                  {
                    width: "auto",
                    stack: [
                      {
                        text: "INVOICE",
                        fontSize: 26,
                        bold: true,
                        color: "#ffffff",
                        alignment: "right",
                        margin: [0, 2, 0, 2],
                      },
                    ],
                  },
                ],
                fillColor: navy,
                margin: [0, 0, 0, 0],
              },
            ],
          ],
        },
        layout: {
          hLineWidth: () => 0,
          vLineWidth: () => 0,
          paddingLeft: () => 40,
          paddingRight: () => 40,
          paddingTop: () => 22,
          paddingBottom: () => 22,
        },
        margin: [0, 0, 0, 28],
      },

      // ── content wrapper (rest of page with side margins) ──
      {
        stack: [
          // ════════════════════════════════════════════
          // 2. INFO TAGIHAN (2 kolom)
          // ════════════════════════════════════════════
          {
            columns: [
              {
                width: "50%",
                stack: [
                  { text: "TAGIHAN KEPADA", fontSize: 9, bold: true, color: gold, margin: [0, 0, 0, 6] },
                  { text: data.namaPenyewa, fontSize: 13, bold: true, color: navy, margin: [0, 0, 0, 2] },
                  { text: `Kamar ${data.nomorKamar}`, fontSize: 10, color: textLight },
                ],
              },
              {
                width: "50%",
                stack: [
                  {
                    columns: [
                      { text: "No. Invoice", width: 80, fontSize: 9, bold: true, color: textLight },
                      {
                        text: data.invoiceNumber,
                        width: "*",
                        fontSize: 11,
                        bold: true,
                        color: navy,
                        alignment: "right",
                      },
                    ],
                    margin: [0, 0, 0, 4],
                  },
                  {
                    columns: [
                      { text: "Tanggal", width: 80, fontSize: 9, bold: true, color: textLight },
                      { text: data.tanggal, width: "*", fontSize: 10, alignment: "right" },
                    ],
                    margin: [0, 0, 0, 4],
                  },
                  {
                    columns: [
                      { text: "Jatuh Tempo", width: 80, fontSize: 9, bold: true, color: textLight },
                      { text: data.jatuhTempo, width: "*", fontSize: 10, alignment: "right" },
                    ],
                  },
                ],
              },
            ],
            margin: [40, 0, 40, 24],
          },

          // ════════════════════════════════════════════
          // 3. TABEL TRANSAKSI
          // ════════════════════════════════════════════
          {
            table: {
              headerRows: 1,
              widths: ["*", "auto"],
              body: [
                [
                  {
                    text: "DESKRIPSI",
                    fontSize: 10,
                    bold: true,
                    color: "#ffffff",
                    fillColor: gold,
                    margin: [12, 10, 12, 10],
                  },
                  {
                    text: "JUMLAH",
                    fontSize: 10,
                    bold: true,
                    color: "#ffffff",
                    fillColor: gold,
                    alignment: "right",
                    margin: [12, 10, 12, 10],
                  },
                ],
                [
                  {
                    stack: [
                      { text: "Bayar Kos", fontSize: 11, bold: true, color: textDark, margin: [12, 10, 12, 0] },
                      {
                        text: `Periode ${data.periode}`,
                        fontSize: 9,
                        color: textLight,
                        margin: [12, 2, 12, 10],
                      },
                    ],
                    fillColor: creamBg,
                  },
                  {
                    text: formatRupiah(data.nominal),
                    fontSize: 11,
                    bold: true,
                    color: textDark,
                    alignment: "right",
                    margin: [12, 10, 12, 10],
                    fillColor: creamBg,
                  },
                ],
              ],
            },
            layout: {
              hLineWidth: (i, node) => {
                if (i === 0 || i === 1) return 1.5
                return 0.5
              },
              vLineWidth: () => 0,
              hLineColor: () => gold,
              paddingTop: () => 0,
              paddingBottom: () => 0,
            },
            margin: [40, 0, 40, 0],
          },

          // ════════════════════════════════════════════
          // 4. TOTAL
          // ════════════════════════════════════════════
          {
            columns: [
              { width: "*", text: "" },
              {
                width: 220,
                table: {
                  widths: ["*", "auto"],
                  body: [
                    [
                      {
                        text: "TOTAL",
                        fontSize: 13,
                        bold: true,
                        color: navy,
                        alignment: "right",
                        margin: [0, 10, 12, 10],
                      },
                      {
                        text: formatRupiah(data.nominal),
                        fontSize: 13,
                        bold: true,
                        color: navy,
                        alignment: "right",
                        margin: [0, 10, 0, 10],
                      },
                    ],
                  ],
                },
                layout: {
                  hLineWidth: (i) => (i === 0 ? 1.5 : 0),
                  vLineWidth: () => 0,
                  hLineColor: () => navy,
                  paddingTop: () => 4,
                  paddingBottom: () => 4,
                },
              },
            ],
            margin: [40, 16, 40, 28],
          },

          // ════════════════════════════════════════════
          // 5. BOX INFO PEMBAYARAN + KONTAK
          // ════════════════════════════════════════════
          {
            table: {
              widths: ["50%", "50%"],
              body: [
                [
                  {
                    stack: [
                      { text: "INFORMASI PEMBAYARAN", fontSize: 9, bold: true, color: navy, margin: [0, 0, 0, 8] },
                      {
                        columns: [
                          { text: "Metode", width: 65, color: textLight, fontSize: 9 },
                          { text: ":  Transfer Bank", width: "*", fontSize: 10 },
                        ],
                        margin: [0, 0, 0, 3],
                      },
                      {
                        columns: [
                          { text: "Bank", width: 65, color: textLight, fontSize: 9 },
                          { text: `:  ${bankInfo.name}`, width: "*", fontSize: 10 },
                        ],
                        margin: [0, 0, 0, 3],
                      },
                      {
                        columns: [
                          { text: "No. Rekening", width: 65, color: textLight, fontSize: 9 },
                          { text: `:  ${bankInfo.accountNumber}`, width: "*", fontSize: 10, bold: true, color: navy },
                        ],
                        margin: [0, 0, 0, 3],
                      },
                      {
                        columns: [
                          { text: "a/n", width: 65, color: textLight, fontSize: 9 },
                          { text: `:  ${bankInfo.accountName}`, width: "*", fontSize: 10, bold: true, color: textDark },
                        ],
                      },
                    ],
                    fillColor: creamBg,
                  },
                  {
                    stack: [
                      { text: "KONTAK", fontSize: 9, bold: true, color: navy, margin: [0, 0, 0, 8] },
                      {
                        columns: [
                          { text: "WhatsApp", width: 65, color: textLight, fontSize: 9 },
                          { text: `:  ${kosData.kontak}`, width: "*", fontSize: 10 },
                        ],
                        margin: [0, 0, 0, 3],
                      },
                      {
                        columns: [
                          { text: "Kos", width: 65, color: textLight, fontSize: 9 },
                          { text: `:  ${kosData.namaKos}`, width: "*", fontSize: 10 },
                        ],
                      },
                    ],
                    fillColor: creamBg,
                  },
                ],
              ],
            },
            layout: {
              hLineWidth: () => 0,
              vLineWidth: (i, node) => (i === 1 && node.columns === 2 ? 0.5 : 0),
              vLineColor: () => "#d1d5db",
              paddingLeft: () => 20,
              paddingRight: () => 20,
              paddingTop: () => 14,
              paddingBottom: () => 14,
            },
            margin: [40, 0, 40, 20],
          },

          // ════════════════════════════════════════════
          // 6. CATATAN
          // ════════════════════════════════════════════
          {
            stack: [
              { text: "Catatan:", fontSize: 9, bold: true, color: textLight, margin: [0, 0, 0, 6] },
              {
                ol: [
                  {
                    text: "Harap konfirmasi ke WhatsApp setelah melakukan pembayaran.",
                    fontSize: 9,
                    color: textLight,
                    margin: [0, 0, 0, 3],
                  },
                  {
                    text: "Invoice ini sah tanpa tanda tangan basah.",
                    fontSize: 9,
                    color: textLight,
                  },
                ],
                margin: [16, 0, 0, 0],
              },
            ],
            margin: [40, 0, 40, 24],
          },

          // ════════════════════════════════════════════
          // 7. TANDA TANGAN (kanan bawah)
          // ════════════════════════════════════════════
          {
            columns: [
              { width: "*", text: "" },
              {
                width: 200,
                stack: [
                  { text: "Hormat kami,", alignment: "center", color: textLight, fontSize: 10, margin: [0, 0, 0, 6] },
                  ttdBase64
                    ? {
                        image: ttdBase64,
                        width: 140,
                        alignment: "center",
                        margin: [0, 0, 0, 4],
                      }
                    : { text: "[TANDA TANGAN]", color: "#ccc", fontSize: 10, alignment: "center", margin: [0, 16, 0, 16] },
                  {
                    canvas: [
                      {
                        type: "line",
                        x1: 0,
                        y1: 0,
                        x2: 200,
                        y2: 0,
                        lineWidth: 0.5,
                        lineColor: "#999999",
                      },
                    ],
                    margin: [0, 0, 0, 6],
                  },
                  {
                    text: kosData.pemilik,
                    alignment: "center",
                    bold: true,
                    fontSize: 11,
                    color: navy,
                    margin: [0, 0, 0, 2],
                  },
                  {
                    text: "Pemilik Kost Babe Aji",
                    alignment: "center",
                    fontSize: 9,
                    color: textLight,
                  },
                ],
              },
            ],
            margin: [40, 0, 40, 0],
          },
        ],
        margin: [0, 0, 0, 0],
      },
    ],

    // ════════════════════════════════════════════
    // 8. FOOTER
    // ════════════════════════════════════════════
    footer: () => ({
      stack: [
        {
          canvas: [
            { type: "line", x1: 40, y1: 0, x2: 555, y2: 0, lineWidth: 0.5, lineColor: "#d1d5db" },
          ],
          margin: [0, 0, 0, 4],
        },
        {
          text: "Terima kasih telah mempercayai Kost Babe Aji.",
          alignment: "center",
          fontSize: 8,
          color: textMuted,
          italics: true,
          margin: [40, 0, 40, 8],
        },
      ],
    }),
  }
}
