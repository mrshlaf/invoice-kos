const sharp = require("sharp")
const path = require("path")

async function main() {
  const img = sharp(path.join(process.cwd(), "public/logo.png"))
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true })

  // Filter out near-white/background pixels first
  const pixels = []
  for (let i = 0; i < data.length; i += 150) {
    const r = data[i], g = data[i + 1], b = data[i + 2]
    // Skip near-white (>240 all channels)
    if (r > 240 && g > 240 && b > 240) continue
    pixels.push({ r, g, b })
  }

  // Finer quantization (16-block)
  const counts = {}
  for (const p of pixels) {
    const key = Math.floor(p.r / 16) * 16 + "," + Math.floor(p.g / 16) * 16 + "," + Math.floor(p.b / 16) * 16
    counts[key] = (counts[key] || 0) + 1
  }

  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1])
  console.log("Non-white colors (quantized 16-block):")
  sorted.slice(0, 15).forEach(([key, count]) => {
    const [r, g, b] = key.split(",").map(Number)
    const pct = ((count / pixels.length) * 100).toFixed(1)
    const hex = "#" + [r, g, b].map((c) => (c + 8).toString(16).padStart(2, "0")).join("")
    console.log("  RGB(" + r + "," + g + "," + b + ") ~ " + hex + "  " + pct + "%")
  })
}
main().catch((e) => console.error(e))
