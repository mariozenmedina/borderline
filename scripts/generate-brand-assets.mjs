import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { deflateSync, inflateSync } from 'node:zlib'

const publicDir = join(process.cwd(), 'public')
const BRAND_RED = [229, 9, 20, 255]
const BRAND_BLACK = [1, 9, 17, 255]
const BRAND_WHITE = [245, 245, 245, 255]
const SOFT_WHITE = [245, 245, 245, 178]
const DIM_WHITE = [245, 245, 245, 92]

const GLYPHS = {
  ' ': ['000', '000', '000', '000', '000', '000', '000'],
  A: ['01110', '10001', '10001', '11111', '10001', '10001', '10001'],
  B: ['11110', '10001', '10001', '11110', '10001', '10001', '11110'],
  C: ['01111', '10000', '10000', '10000', '10000', '10000', '01111'],
  D: ['11110', '10001', '10001', '10001', '10001', '10001', '11110'],
  E: ['11111', '10000', '10000', '11110', '10000', '10000', '11111'],
  F: ['11111', '10000', '10000', '11110', '10000', '10000', '10000'],
  G: ['01111', '10000', '10000', '10011', '10001', '10001', '01111'],
  H: ['10001', '10001', '10001', '11111', '10001', '10001', '10001'],
  I: ['11111', '00100', '00100', '00100', '00100', '00100', '11111'],
  J: ['00111', '00010', '00010', '00010', '10010', '10010', '01100'],
  K: ['10001', '10010', '10100', '11000', '10100', '10010', '10001'],
  L: ['10000', '10000', '10000', '10000', '10000', '10000', '11111'],
  M: ['10001', '11011', '10101', '10101', '10001', '10001', '10001'],
  N: ['10001', '11001', '10101', '10011', '10001', '10001', '10001'],
  O: ['01110', '10001', '10001', '10001', '10001', '10001', '01110'],
  P: ['11110', '10001', '10001', '11110', '10000', '10000', '10000'],
  Q: ['01110', '10001', '10001', '10001', '10101', '10010', '01101'],
  R: ['11110', '10001', '10001', '11110', '10100', '10010', '10001'],
  S: ['01111', '10000', '10000', '01110', '00001', '00001', '11110'],
  T: ['11111', '00100', '00100', '00100', '00100', '00100', '00100'],
  U: ['10001', '10001', '10001', '10001', '10001', '10001', '01110'],
  V: ['10001', '10001', '10001', '10001', '10001', '01010', '00100'],
  W: ['10001', '10001', '10001', '10101', '10101', '10101', '01010'],
  X: ['10001', '10001', '01010', '00100', '01010', '10001', '10001'],
  Y: ['10001', '10001', '01010', '00100', '00100', '00100', '00100'],
  Z: ['11111', '00001', '00010', '00100', '01000', '10000', '11111'],
  0: ['01110', '10001', '10011', '10101', '11001', '10001', '01110'],
  1: ['00100', '01100', '00100', '00100', '00100', '00100', '01110'],
  2: ['01110', '10001', '00001', '00010', '00100', '01000', '11111'],
  3: ['11110', '00001', '00001', '01110', '00001', '00001', '11110'],
  4: ['10010', '10010', '10010', '11111', '00010', '00010', '00010'],
  5: ['11111', '10000', '10000', '11110', '00001', '00001', '11110'],
  6: ['01110', '10000', '10000', '11110', '10001', '10001', '01110'],
  7: ['11111', '00001', '00010', '00100', '01000', '01000', '01000'],
  8: ['01110', '10001', '10001', '01110', '10001', '10001', '01110'],
  9: ['01110', '10001', '10001', '01111', '00001', '00001', '01110'],
  '.': ['000', '000', '000', '000', '000', '110', '110'],
  ',': ['000', '000', '000', '000', '000', '010', '100'],
  ':': ['000', '110', '110', '000', '110', '110', '000'],
  '-': ['00000', '00000', '00000', '11111', '00000', '00000', '00000'],
  '&': ['01100', '10010', '10100', '01000', '10101', '10010', '01101'],
  '/': ['00001', '00010', '00010', '00100', '01000', '01000', '10000'],
  '?': ['01110', '10001', '00001', '00010', '00100', '00000', '00100']
}

const normalizeText = (value) => {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\x20-\x7E]/g, '')
    .toUpperCase()
}

const createImage = (width, height, fill = [0, 0, 0, 0]) => {
  const data = new Uint8ClampedArray(width * height * 4)

  for (let i = 0; i < data.length; i += 4) {
    data[i] = fill[0]
    data[i + 1] = fill[1]
    data[i + 2] = fill[2]
    data[i + 3] = fill[3]
  }

  return { width, height, data }
}

const mixAlpha = (color, alpha) => [color[0], color[1], color[2], Math.round(color[3] * alpha)]

const blendPixel = (image, x, y, color) => {
  const px = Math.round(x)
  const py = Math.round(y)

  if (px < 0 || py < 0 || px >= image.width || py >= image.height || color[3] <= 0) {
    return
  }

  const index = (py * image.width + px) * 4
  const srcA = color[3] / 255
  const dstA = image.data[index + 3] / 255
  const outA = srcA + dstA * (1 - srcA)

  if (outA <= 0) {
    return
  }

  image.data[index] = Math.round((color[0] * srcA + image.data[index] * dstA * (1 - srcA)) / outA)
  image.data[index + 1] = Math.round((color[1] * srcA + image.data[index + 1] * dstA * (1 - srcA)) / outA)
  image.data[index + 2] = Math.round((color[2] * srcA + image.data[index + 2] * dstA * (1 - srcA)) / outA)
  image.data[index + 3] = Math.round(outA * 255)
}

const fillRect = (image, x, y, width, height, color) => {
  const x1 = Math.max(0, Math.floor(x))
  const y1 = Math.max(0, Math.floor(y))
  const x2 = Math.min(image.width, Math.ceil(x + width))
  const y2 = Math.min(image.height, Math.ceil(y + height))

  for (let py = y1; py < y2; py += 1) {
    for (let px = x1; px < x2; px += 1) {
      blendPixel(image, px, py, color)
    }
  }
}

const drawCircle = (image, cx, cy, radius, color) => {
  const x1 = Math.floor(cx - radius - 1)
  const y1 = Math.floor(cy - radius - 1)
  const x2 = Math.ceil(cx + radius + 1)
  const y2 = Math.ceil(cy + radius + 1)

  for (let y = y1; y <= y2; y += 1) {
    for (let x = x1; x <= x2; x += 1) {
      const distance = Math.hypot(x + 0.5 - cx, y + 0.5 - cy)
      const coverage = Math.max(0, Math.min(1, radius + 0.5 - distance))
      blendPixel(image, x, y, mixAlpha(color, coverage))
    }
  }
}

const distanceToSegment = (px, py, x1, y1, x2, y2) => {
  const dx = x2 - x1
  const dy = y2 - y1
  const lengthSquared = dx * dx + dy * dy
  const t = lengthSquared === 0 ? 0 : Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / lengthSquared))
  const x = x1 + t * dx
  const y = y1 + t * dy

  return Math.hypot(px - x, py - y)
}

const drawLine = (image, x1, y1, x2, y2, width, color) => {
  const radius = width / 2
  const left = Math.floor(Math.min(x1, x2) - radius - 1)
  const right = Math.ceil(Math.max(x1, x2) + radius + 1)
  const top = Math.floor(Math.min(y1, y2) - radius - 1)
  const bottom = Math.ceil(Math.max(y1, y2) + radius + 1)

  for (let y = top; y <= bottom; y += 1) {
    for (let x = left; x <= right; x += 1) {
      const distance = distanceToSegment(x + 0.5, y + 0.5, x1, y1, x2, y2)
      const coverage = Math.max(0, Math.min(1, radius + 0.5 - distance))
      blendPixel(image, x, y, mixAlpha(color, coverage))
    }
  }
}

const drawPolyline = (image, points, width, color, closed = false) => {
  for (let i = 0; i < points.length - 1; i += 1) {
    drawLine(image, points[i][0], points[i][1], points[i + 1][0], points[i + 1][1], width, color)
  }

  if (closed) {
    const first = points[0]
    const last = points[points.length - 1]
    drawLine(image, last[0], last[1], first[0], first[1], width, color)
  }
}

const drawGrid = (image, spacing, color) => {
  for (let x = spacing; x < image.width; x += spacing) {
    drawLine(image, x, 0, x, image.height, 1, color)
  }

  for (let y = spacing; y < image.height; y += spacing) {
    drawLine(image, 0, y, image.width, y, 1, color)
  }
}

const drawBrandMark = (image, cx, cy, size, glow = true) => {
  const outer = [
    [cx, cy - size * 0.48],
    [cx + size * 0.48, cy],
    [cx, cy + size * 0.48],
    [cx - size * 0.48, cy]
  ]
  const inner = [
    [cx, cy - size * 0.27],
    [cx + size * 0.27, cy],
    [cx, cy + size * 0.27],
    [cx - size * 0.27, cy]
  ]

  if (glow) {
    drawPolyline(image, outer, size * 0.08, mixAlpha(BRAND_RED, 0.16), true)
    drawPolyline(image, inner, size * 0.06, mixAlpha(BRAND_WHITE, 0.12), true)
  }

  drawPolyline(image, outer, Math.max(2, size * 0.034), BRAND_RED, true)
  drawPolyline(image, inner, Math.max(1.4, size * 0.024), BRAND_WHITE, true)
  drawLine(image, cx, cy - size * 0.48, cx, cy + size * 0.48, Math.max(1, size * 0.012), mixAlpha(BRAND_RED, 0.64))
  drawLine(image, cx - size * 0.48, cy, cx + size * 0.48, cy, Math.max(1, size * 0.008), DIM_WHITE)
  drawLine(image, cx - size * 0.24, cy - size * 0.24, cx + size * 0.24, cy + size * 0.24, Math.max(1, size * 0.01), mixAlpha(BRAND_RED, 0.52))
  drawCircle(image, cx + size * 0.33, cy + size * 0.33, size * 0.045, BRAND_RED)
}

const glyphWidth = (glyph) => glyph.reduce((width, row) => Math.max(width, row.length), 0)

const measureText = (text, scale, tracking = 1) => {
  return [...text].reduce((width, character, index) => {
    const glyph = GLYPHS[character] || GLYPHS['?']
    return width + glyphWidth(glyph) * scale + (index < text.length - 1 ? tracking * scale : 0)
  }, 0)
}

const drawText = (image, text, x, y, scale, color, tracking = 1) => {
  let cursor = x

  for (const character of text) {
    const glyph = GLYPHS[character] || GLYPHS['?']

    for (let row = 0; row < glyph.length; row += 1) {
      for (let col = 0; col < glyph[row].length; col += 1) {
        if (glyph[row][col] === '1') {
          fillRect(image, cursor + col * scale, y + row * scale, scale, scale, color)
        }
      }
    }

    cursor += (glyphWidth(glyph) + tracking) * scale
  }

  return cursor
}

const wrapWords = (text, scale, maxWidth) => {
  const lines = []
  const words = normalizeText(text).split(/\s+/).filter(Boolean)
  let current = ''

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word

    if (measureText(candidate, scale) <= maxWidth || !current) {
      current = candidate
    } else {
      lines.push(current)
      current = word
    }
  }

  if (current) {
    lines.push(current)
  }

  return lines
}

const drawWrappedText = (image, text, x, y, scale, maxWidth, lineGap, color) => {
  const lines = wrapWords(text, scale, maxWidth)

  lines.forEach((line, index) => {
    drawText(image, line, x, y + index * (7 * scale + lineGap), scale, color)
  })

  return y + lines.length * (7 * scale + lineGap)
}

const drawSocialBrand = (image, x, y, scale) => {
  let cursor = drawText(image, 'BORDERLINE', x, y, scale, BRAND_WHITE)
  cursor = drawText(image, '.', cursor, y, scale, BRAND_RED)
  cursor = drawText(image, 'DEV', cursor, y, scale, BRAND_WHITE)
  cursor = drawText(image, '.', cursor, y, scale, BRAND_RED)
  drawText(image, 'BR', cursor, y, scale, BRAND_WHITE)
}

const createOgImage = ({ title, description }) => {
  const image = createImage(1200, 630, BRAND_BLACK)

  drawGrid(image, 42, mixAlpha(BRAND_RED, 0.07))
  drawGrid(image, 84, mixAlpha(BRAND_WHITE, 0.035))
  fillRect(image, 0, 0, 1200, 8, BRAND_RED)
  fillRect(image, 80, 100, 78, 5, BRAND_RED)
  fillRect(image, 80, 510, 480, 2, mixAlpha(BRAND_RED, 0.64))
  fillRect(image, 80, 535, 118, 5, mixAlpha(BRAND_WHITE, 0.58))
  fillRect(image, 217, 535, 118, 5, mixAlpha(BRAND_RED, 0.58))

  drawSocialBrand(image, 80, 126, 9)
  drawWrappedText(image, title, 80, 250, 5, 690, 18, BRAND_WHITE)
  drawWrappedText(image, description, 80, 395, 3, 700, 15, SOFT_WHITE)
  drawText(image, 'WEB   INTERACTIVE   SYSTEMS   INFRA', 80, 560, 3, DIM_WHITE)

  drawBrandMark(image, 900, 316, 330, true)
  drawCircle(image, 900, 316, 7, BRAND_RED)
  drawLine(image, 808, 202, 992, 430, 1.6, mixAlpha(BRAND_WHITE, 0.18))
  drawLine(image, 992, 202, 808, 430, 1.6, mixAlpha(BRAND_RED, 0.18))

  return image
}

const crcTable = Array.from({ length: 256 }, (_, index) => {
  let crc = index

  for (let bit = 0; bit < 8; bit += 1) {
    crc = crc & 1 ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1
  }

  return crc >>> 0
})

const crc32 = (buffer) => {
  let crc = 0xffffffff

  for (const byte of buffer) {
    crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8)
  }

  return (crc ^ 0xffffffff) >>> 0
}

const pngChunk = (type, data = Buffer.alloc(0)) => {
  const typeBuffer = Buffer.from(type)
  const chunk = Buffer.alloc(12 + data.length)

  chunk.writeUInt32BE(data.length, 0)
  typeBuffer.copy(chunk, 4)
  data.copy(chunk, 8)
  chunk.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 8 + data.length)

  return chunk
}

const encodePng = (image) => {
  const header = Buffer.alloc(13)
  const scanlines = Buffer.alloc((image.width * 4 + 1) * image.height)

  header.writeUInt32BE(image.width, 0)
  header.writeUInt32BE(image.height, 4)
  header[8] = 8
  header[9] = 6
  header[10] = 0
  header[11] = 0
  header[12] = 0

  for (let y = 0; y < image.height; y += 1) {
    const rowStart = y * (image.width * 4 + 1)
    scanlines[rowStart] = 0
    Buffer.from(image.data.buffer, y * image.width * 4, image.width * 4).copy(scanlines, rowStart + 1)
  }

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    pngChunk('IHDR', header),
    pngChunk('IDAT', deflateSync(scanlines, { level: 9 })),
    pngChunk('IEND')
  ])
}

const encodeIco = (pngEntries) => {
  const headerSize = 6 + pngEntries.length * 16
  const totalSize = headerSize + pngEntries.reduce((size, entry) => size + entry.buffer.length, 0)
  const ico = Buffer.alloc(totalSize)
  let offset = headerSize

  ico.writeUInt16LE(0, 0)
  ico.writeUInt16LE(1, 2)
  ico.writeUInt16LE(pngEntries.length, 4)

  pngEntries.forEach((entry, index) => {
    const directoryOffset = 6 + index * 16

    ico[directoryOffset] = entry.size >= 256 ? 0 : entry.size
    ico[directoryOffset + 1] = entry.size >= 256 ? 0 : entry.size
    ico[directoryOffset + 2] = 0
    ico[directoryOffset + 3] = 0
    ico.writeUInt16LE(1, directoryOffset + 4)
    ico.writeUInt16LE(32, directoryOffset + 6)
    ico.writeUInt32LE(entry.buffer.length, directoryOffset + 8)
    ico.writeUInt32LE(offset, directoryOffset + 12)
    entry.buffer.copy(ico, offset)
    offset += entry.buffer.length
  })

  return ico
}

const decodePng = (buffer) => {
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])

  if (!buffer.subarray(0, 8).equals(signature)) {
    throw new Error('Invalid PNG signature')
  }

  let offset = 8
  let width = 0
  let height = 0
  let bitDepth = 0
  let colorType = 0
  let interlaceMethod = 0
  let palette = null
  let transparency = null
  const idatChunks = []

  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset)
    const type = buffer.toString('ascii', offset + 4, offset + 8)
    const data = buffer.subarray(offset + 8, offset + 8 + length)
    offset += length + 12

    if (type === 'IHDR') {
      width = data.readUInt32BE(0)
      height = data.readUInt32BE(4)
      bitDepth = data[8]
      colorType = data[9]
      interlaceMethod = data[12]
    } else if (type === 'PLTE') {
      palette = data
    } else if (type === 'tRNS') {
      transparency = data
    } else if (type === 'IDAT') {
      idatChunks.push(data)
    } else if (type === 'IEND') {
      break
    }
  }

  if (bitDepth !== 8 || interlaceMethod !== 0) {
    throw new Error('Only non-interlaced 8-bit PNG files are supported')
  }

  const channelsByType = {
    0: 1,
    2: 3,
    3: 1,
    4: 2,
    6: 4
  }
  const channels = channelsByType[colorType]

  if (!channels) {
    throw new Error(`Unsupported PNG color type: ${colorType}`)
  }

  const inflated = inflateSync(Buffer.concat(idatChunks))
  const rowLength = width * channels
  const raw = Buffer.alloc(rowLength * height)
  let sourceOffset = 0
  let previousRow = Buffer.alloc(rowLength)

  for (let y = 0; y < height; y += 1) {
    const filter = inflated[sourceOffset]
    sourceOffset += 1
    const row = Buffer.from(inflated.subarray(sourceOffset, sourceOffset + rowLength))
    sourceOffset += rowLength

    for (let x = 0; x < rowLength; x += 1) {
      const left = x >= channels ? row[x - channels] : 0
      const up = previousRow[x] || 0
      const upLeft = x >= channels ? previousRow[x - channels] || 0 : 0
      let predictor = 0

      if (filter === 1) {
        predictor = left
      } else if (filter === 2) {
        predictor = up
      } else if (filter === 3) {
        predictor = Math.floor((left + up) / 2)
      } else if (filter === 4) {
        const pa = Math.abs(up - upLeft)
        const pb = Math.abs(left - upLeft)
        const pc = Math.abs(left + up - 2 * upLeft)
        predictor = pa <= pb && pa <= pc ? left : pb <= pc ? up : upLeft
      } else if (filter !== 0) {
        throw new Error(`Unsupported PNG filter: ${filter}`)
      }

      row[x] = (row[x] + predictor) & 0xff
    }

    row.copy(raw, y * rowLength)
    previousRow = row
  }

  const image = createImage(width, height)

  for (let index = 0; index < width * height; index += 1) {
    const sourceIndex = index * channels
    const targetIndex = index * 4

    if (colorType === 0) {
      const gray = raw[sourceIndex]
      image.data[targetIndex] = gray
      image.data[targetIndex + 1] = gray
      image.data[targetIndex + 2] = gray
      image.data[targetIndex + 3] = transparency && transparency.length >= 2 && gray === transparency.readUInt16BE(0) ? 0 : 255
    } else if (colorType === 2) {
      image.data[targetIndex] = raw[sourceIndex]
      image.data[targetIndex + 1] = raw[sourceIndex + 1]
      image.data[targetIndex + 2] = raw[sourceIndex + 2]
      image.data[targetIndex + 3] = 255
    } else if (colorType === 3) {
      const paletteIndex = raw[sourceIndex]
      image.data[targetIndex] = palette?.[paletteIndex * 3] ?? 0
      image.data[targetIndex + 1] = palette?.[paletteIndex * 3 + 1] ?? 0
      image.data[targetIndex + 2] = palette?.[paletteIndex * 3 + 2] ?? 0
      image.data[targetIndex + 3] = transparency?.[paletteIndex] ?? 255
    } else if (colorType === 4) {
      const gray = raw[sourceIndex]
      image.data[targetIndex] = gray
      image.data[targetIndex + 1] = gray
      image.data[targetIndex + 2] = gray
      image.data[targetIndex + 3] = raw[sourceIndex + 1]
    } else if (colorType === 6) {
      image.data[targetIndex] = raw[sourceIndex]
      image.data[targetIndex + 1] = raw[sourceIndex + 1]
      image.data[targetIndex + 2] = raw[sourceIndex + 2]
      image.data[targetIndex + 3] = raw[sourceIndex + 3]
    }
  }

  return image
}

const getPixel = (image, x, y) => {
  const px = Math.max(0, Math.min(image.width - 1, x))
  const py = Math.max(0, Math.min(image.height - 1, y))
  const index = (py * image.width + px) * 4

  return [
    image.data[index],
    image.data[index + 1],
    image.data[index + 2],
    image.data[index + 3]
  ]
}

const sampleImage = (image, x, y) => {
  const x0 = Math.floor(x)
  const y0 = Math.floor(y)
  const x1 = x0 + 1
  const y1 = y0 + 1
  const tx = x - x0
  const ty = y - y0
  const pixels = [
    [getPixel(image, x0, y0), (1 - tx) * (1 - ty)],
    [getPixel(image, x1, y0), tx * (1 - ty)],
    [getPixel(image, x0, y1), (1 - tx) * ty],
    [getPixel(image, x1, y1), tx * ty]
  ]
  let alpha = 0
  let red = 0
  let green = 0
  let blue = 0

  pixels.forEach(([pixel, weight]) => {
    const pixelAlpha = (pixel[3] / 255) * weight
    alpha += pixelAlpha
    red += pixel[0] * pixelAlpha
    green += pixel[1] * pixelAlpha
    blue += pixel[2] * pixelAlpha
  })

  if (alpha <= 0) {
    return [0, 0, 0, 0]
  }

  return [
    Math.round(red / alpha),
    Math.round(green / alpha),
    Math.round(blue / alpha),
    Math.round(alpha * 255)
  ]
}

const resizeImage = (source, size) => {
  const image = createImage(size, size)
  const scale = Math.min(size / source.width, size / source.height)
  const drawWidth = Math.max(1, Math.round(source.width * scale))
  const drawHeight = Math.max(1, Math.round(source.height * scale))
  const offsetX = Math.floor((size - drawWidth) / 2)
  const offsetY = Math.floor((size - drawHeight) / 2)

  for (let y = 0; y < drawHeight; y += 1) {
    for (let x = 0; x < drawWidth; x += 1) {
      const sourceX = ((x + 0.5) / drawWidth) * source.width - 0.5
      const sourceY = ((y + 0.5) / drawHeight) * source.height - 0.5
      const pixel = sampleImage(source, sourceX, sourceY)
      const targetIndex = ((offsetY + y) * size + offsetX + x) * 4

      image.data[targetIndex] = pixel[0]
      image.data[targetIndex + 1] = pixel[1]
      image.data[targetIndex + 2] = pixel[2]
      image.data[targetIndex + 3] = pixel[3]
    }
  }

  return image
}

const webManifest = {
  name: 'Borderline.Dev',
  short_name: 'Borderline',
  description: 'Premium development partner for websites, interactive experiences, systems, and infrastructure.',
  lang: 'pt-BR',
  start_url: '/',
  scope: '/',
  display: 'standalone',
  background_color: '#010911',
  theme_color: '#010911',
  icons: [
    {
      src: '/android-chrome-192x192.png',
      sizes: '192x192',
      type: 'image/png',
      purpose: 'any'
    },
    {
      src: '/android-chrome-512x512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'any'
    },
    {
      src: '/android-chrome-192x192.png',
      sizes: '192x192',
      type: 'image/png',
      purpose: 'maskable'
    },
    {
      src: '/android-chrome-512x512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'maskable'
    }
  ]
}

const browserConfig = `<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
  <msapplication>
    <tile>
      <square150x150logo src="/mstile-150x150.png"/>
      <TileColor>#010911</TileColor>
    </tile>
  </msapplication>
</browserconfig>
`

const faviconSizes = [16, 32, 48]
const platformIconSizes = [
  ['apple-touch-icon', 180],
  ['android-chrome', 192],
  ['android-chrome', 512],
  ['mstile', 150]
]
const faviconSources = [
  ['dark', 'true_fav_dark.png'],
  ['light', 'true_fav_light.png']
]

const socialImages = [
  [
    'og-image-pt.png',
    {
      title: 'Desenvolvimento premium para agencias',
      description: 'Sites, experiencias interativas, sistemas e infraestrutura para times criativos.'
    }
  ],
  [
    'og-image-en.png',
    {
      title: 'Premium development for agencies',
      description: 'Websites, interactive experiences, systems and infrastructure for creative teams.'
    }
  ],
  [
    'og-image.png',
    {
      title: 'Desenvolvimento premium para agencias',
      description: 'Sites, experiencias interativas, sistemas e infraestrutura para times criativos.'
    }
  ]
]

const createPlatformIconFileName = (name, size, variant = null) => {
  if (name === 'apple-touch-icon') {
    return variant ? `${name}-${variant}.png` : `${name}.png`
  }

  return variant ? `${name}-${variant}-${size}x${size}.png` : `${name}-${size}x${size}.png`
}

const iconWrites = []
const iconBuffers = new Map()

for (const [variant, fileName] of faviconSources) {
  const source = decodePng(await readFile(join(publicDir, fileName)))

  for (const size of faviconSizes) {
    const pngBuffer = encodePng(resizeImage(source, size))
    iconBuffers.set(`${variant}-${size}`, pngBuffer)
    iconWrites.push(writeFile(join(publicDir, `favicon-${variant}-${size}x${size}.png`), pngBuffer))

    if (variant === 'dark') {
      iconWrites.push(writeFile(join(publicDir, `favicon-${size}x${size}.png`), pngBuffer))
    }
  }

  for (const [name, size] of platformIconSizes) {
    const pngBuffer = encodePng(resizeImage(source, size))
    iconWrites.push(writeFile(join(publicDir, createPlatformIconFileName(name, size, variant)), pngBuffer))

    if (variant === 'dark') {
      iconWrites.push(writeFile(join(publicDir, createPlatformIconFileName(name, size)), pngBuffer))
    }
  }
}

for (const variant of ['dark', 'light']) {
  const icoEntries = faviconSizes.map((size) => ({
    size,
    buffer: iconBuffers.get(`${variant}-${size}`)
  }))

  iconWrites.push(writeFile(join(publicDir, `favicon-${variant}.ico`), encodeIco(icoEntries)))

  if (variant === 'dark') {
    iconWrites.push(writeFile(join(publicDir, 'favicon.ico'), encodeIco(icoEntries)))
  }
}

await Promise.all([
  writeFile(join(publicDir, 'site.webmanifest'), `${JSON.stringify(webManifest, null, 2)}\n`, 'utf8'),
  writeFile(join(publicDir, 'browserconfig.xml'), browserConfig, 'utf8'),
  ...iconWrites,
  ...socialImages.map(([fileName, options]) => writeFile(join(publicDir, fileName), encodePng(createOgImage(options))))
])

console.log('Generated favicon variants from true_fav_dark.png and true_fav_light.png, plus social images.')
