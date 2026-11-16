export const SERVICE_IDS = ['dev', 'infra', 'game', 'data', 'product', 'systems']

export function normalizeOpening(value) {
  const number = Number(value)
  return Number.isFinite(number) ? Math.min(100, Math.max(0, number)) : 0
}

export function getOperationLayout(value) {
  const progress = normalizeOpening(value) / 100
  const lerp = (from, to) => from + (to - from) * progress
  return {
    agency: { left: lerp(12, 17), top: lerp(30, 71), width: lerp(76, 66), height: lerp(42, 25), angle: lerp(-7, 0) },
    services: SERVICE_IDS.map((id, index) => ({
      id, left: lerp(16 + index * 1.2, index % 2 ? 52 : 4),
      top: lerp(31 + index * 1.4, 5 + Math.floor(index / 2) * 21),
      width: lerp(76, 44), height: lerp(42, 18), angle: lerp(-5 + index * 2, 0),
    })),
  }
}
