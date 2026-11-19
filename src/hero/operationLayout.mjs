export const SERVICE_IDS = ['dev', 'infra', 'game', 'data', 'product', 'systems']

export function normalizeOpening(value) {
  const number = Number(value)
  return Number.isFinite(number) ? Math.min(100, Math.max(0, number)) : 0
}

// Abre durante 80% do percurso sticky e reserva o final para ler os cards.
export function getScrollOpening(trackTop, stickyTop, travel) {
  if (![trackTop, stickyTop, travel].every(Number.isFinite) || travel <= 0) return 100
  return normalizeOpening((stickyTop - trackTop) / (travel * 0.8) * 100)
}

export function getOperationLayout(value, { compact = false } = {}) {
  const progress = normalizeOpening(value) / 100
  const lerp = (from, to) => from + (to - from) * progress
  const stageRatio = compact ? lerp(0.48, 1) : 1
  return {
    stageRatio,
    agency: { left: lerp(12, 17), top: lerp(compact ? 3 : 30, 71) / stageRatio, width: lerp(76, 66), height: lerp(42, 25) / stageRatio, angle: lerp(compact ? 0 : -7, 0) },
    services: SERVICE_IDS.map((id, index) => ({
      id, left: lerp(16 + index * 1.2, index % 2 ? 52 : 4),
      top: lerp(compact ? 4 + index * 0.6 : 31 + index * 1.4, 5 + Math.floor(index / 2) * 21) / stageRatio,
      width: lerp(76, 44), height: lerp(compact ? 40 : 42, 18) / stageRatio, angle: lerp(compact ? 0 : -5 + index * 2, 0),
    })),
  }
}
