import assert from 'node:assert/strict'
import test from 'node:test'
import { circuitActivation, createCircuitLayout, projectCircuitPoint, routeCircuit, sampleCircuitPath } from '../src/hero/circuitLayout.mjs'
import { SERVICE_IDS } from '../src/hero/operationLayout.mjs'

test('cada serviço tem uma conexão contínua entre seu núcleo e o centro', () => {
  const layout = createCircuitLayout()
  assert.deepEqual(layout.nodes.map(node => node.id), SERVICE_IDS)
  const primary = layout.traces.filter(trace => trace.primary)
  assert.equal(primary.length, SERVICE_IDS.length)
  for (const trace of primary) {
    const node = layout.nodes[trace.service]
    assert.ok(Math.hypot(trace.points[0][0] - node.x, trace.points[0][1] - node.z) <= 1)
    const end = trace.points.at(-1)
    assert.ok(Math.abs(end[0] - layout.core.x) <= 1.5 && Math.abs(end[1] - layout.core.z) <= 1.5)
  }
  assert.deepEqual(createCircuitLayout(), layout)
})

test('trilhas usam trechos ortogonais ou a 45 graus, sem segmentos vazios', () => {
  const paths = createCircuitLayout().traces.map(trace => trace.points)
  for (const end of [[0, 0], [2, 5], [-8, 2], [-6, -4], [0, 7], [3, 0]]) {
    const path = routeCircuit([0, 0], end)
    assert.deepEqual(path[0], [0, 0])
    assert.deepEqual(path.at(-1), end)
    paths.push(path)
  }
  for (const points of paths) {
    for (let index = 1; index < points.length; index++) {
      const dx = Math.abs(points[index][0] - points[index - 1][0])
      const dz = Math.abs(points[index][1] - points[index - 1][1])
      assert.ok(dx + dz > 0)
      assert.ok(dx < 1e-8 || dz < 1e-8 || Math.abs(dx - dz) < 1e-8)
    }
  }
})

test('pulso percorre distância real sem saltar nas curvas e termina no centro', () => {
  const path = [[0, 0], [3, 0], [3, 4]]
  assert.deepEqual(sampleCircuitPath(path, -1), [0, 0])
  assert.deepEqual(sampleCircuitPath(path, 3 / 7), [3, 0])
  assert.deepEqual(sampleCircuitPath(path, 5 / 7), [3, 2])
  assert.deepEqual(sampleCircuitPath(path, 2), [3, 4])
  assert.deepEqual(sampleCircuitPath(path, NaN), [0, 0])
  for (const trace of createCircuitLayout().traces) {
    assert.deepEqual(sampleCircuitPath(trace.points, 0), trace.points[0])
    const end = sampleCircuitPath(trace.points, 1)
    assert.ok(Math.hypot(end[0] - trace.points.at(-1)[0], end[1] - trace.points.at(-1)[1]) < 1e-8)
  }
})

test('conexões ativam em sequência, revertem e mantêm valores finitos', () => {
  for (let opening = 0; opening <= 100; opening++) {
    const values = SERVICE_IDS.map((_, index) => circuitActivation(opening, index))
    assert.ok(values.every(value => value >= 0 && value <= 1))
    for (let index = 1; index < values.length; index++) assert.ok(values[index] <= values[index - 1])
  }
  for (let index = 0; index < SERVICE_IDS.length; index++) {
    assert.equal(circuitActivation(100, index), 1)
    assert.equal(circuitActivation(0, index), 0)
    assert.equal(circuitActivation(NaN, index), 0)
  }
})

test('alternativa estática projeta os seis núcleos sem perder os dados da cena', () => {
  const layout = createCircuitLayout()
  for (const node of [layout.core, ...layout.nodes]) {
    const [x, y] = projectCircuitPoint([node.x, node.z])
    assert.ok(x > 0 && x < 1200 && y > 0 && y < 760)
  }
  for (const trace of layout.traces) {
    for (const point of trace.points) assert.ok(projectCircuitPoint(point).every(Number.isFinite))
  }
})
