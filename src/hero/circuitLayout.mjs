import { SERVICE_IDS, normalizeOpening } from './operationLayout.mjs'

export const CIRCUIT_CORE = { x: 5, z: 0, size: 2.6 }
const positions = [[-8, -8], [11, -9], [-5, -1], [16, 1], [-6, 9], [10, 10]]

// Straight runs and a 45-degree elbow, shared by WebGL and the static illustration.
export function routeCircuit(start, end) {
  const dx = end[0] - start[0], dz = end[1] - start[1]
  const diagonal = Math.min(Math.abs(dx), Math.abs(dz))
  const elbow = [end[0] - Math.sign(dx) * diagonal, start[1]]
  const lastElbow = [end[0], start[1] + Math.sign(dz) * diagonal]
  return [start, elbow, lastElbow, end].filter((point, index, points) =>
    !index || point[0] !== points[index - 1][0] || point[1] !== points[index - 1][1])
}

export function createCircuitLayout() {
  const nodes = SERVICE_IDS.map((id, index) => ({ id, x: positions[index][0], z: positions[index][1], size: 1.55 }))
  const traces = []
  const vias = []
  const components = []
  for (const [index, node] of nodes.entries()) {
    const side = node.x < CIRCUIT_CORE.x ? -1 : 1
    for (let lane = 0; lane < 7; lane++) {
      const offset = (lane - 3) * 0.19
      const start = [node.x - side * 0.9, node.z + offset]
      const end = [CIRCUIT_CORE.x + side * 1.5, (index % 3 - 1) * 0.8 + offset * 0.65]
      const points = routeCircuit(start, end)
      traces.push({ service: index, primary: lane === 3, points })
      vias.push(...[points[0], points.at(-1)].map(([x, z]) => ({ x, z })))
    }
    for (let detail = 0; detail < 12; detail++) {
      const row = Math.floor(detail / 4), column = detail % 4
      const x = node.x + side * (1.5 + column * 0.55)
      const z = node.z - 1.5 + row * 1.5
      components.push({ x, z, width: 0.23 + (detail % 3) * 0.11, depth: 0.52, height: 0.12 + (detail % 2) * 0.08 })
      traces.push({ service: index, primary: false, points: routeCircuit([x, z], [node.x + side * 0.85, node.z + (row - 1) * 0.28]) })
      vias.push({ x, z: z + 0.38 })
    }
  }
  // Peripheral buses extend beyond the frame, giving the board a larger scale.
  for (let lane = 0; lane < 18; lane++) {
    const offset = lane * 0.25
    traces.push({ service: -1, primary: false, points: [[-24, -13 + offset], [-11 - offset, -13 + offset], [-6 - offset, -8 + offset]] })
    traces.push({ service: -1, primary: false, points: [[24, 13 - offset], [15 + offset, 13 - offset], [10 + offset, 8 - offset]] })
  }
  return { core: CIRCUIT_CORE, nodes, traces, vias, components }
}

export function sampleCircuitPath(points, progress) {
  const distances = points.slice(1).map((point, index) => Math.hypot(point[0] - points[index][0], point[1] - points[index][1]))
  let remaining = Math.min(1, Math.max(0, Number.isFinite(progress) ? progress : 0)) * distances.reduce((sum, length) => sum + length, 0)
  for (let index = 0; index < distances.length; index++) {
    const length = distances[index]
    if (remaining <= length && length > 0) {
      const ratio = remaining / length
      return points[index].map((value, axis) => value + (points[index + 1][axis] - value) * ratio)
    }
    remaining -= length
  }
  return [...points.at(-1)]
}

export function circuitActivation(opening, index) {
  return Math.min(1, Math.max(0, (normalizeOpening(opening) - index * 10) / 35))
}

export function projectCircuitPoint([x, z]) {
  return [760 + (x - 5) * 30 + z * 16, 380 + z * 18 - (x - 5) * 7]
}
