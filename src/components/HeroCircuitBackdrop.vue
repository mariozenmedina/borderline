<template>
  <div ref="host" class="circuit-backdrop" aria-hidden="true">
    <div ref="viewport" class="circuit-viewport">
      <svg class="circuit-fallback" :class="{ 'is-hidden': ready }" viewBox="0 0 1200 760" preserveAspectRatio="xMidYMid slice" focusable="false">
        <g class="fallback-grid">
          <path v-for="(path, index) in gridPaths" :key="index" :d="path" />
        </g>
        <g class="fallback-traces">
          <path v-for="(trace, index) in layout.traces" :key="index" :d="pathData(trace.points)" :class="{ 'is-primary': trace.primary }" />
        </g>
        <g class="fallback-vias">
          <ellipse v-for="(via, index) in layout.vias" :key="index" :cx="project([via.x, via.z])[0]" :cy="project([via.x, via.z])[1]" rx="2.5" ry="1.4" />
        </g>
        <g class="fallback-parts">
          <path v-for="(part, index) in layout.components" :key="index" :d="plate(part.x, part.z, part.width, part.depth)" />
        </g>
        <g v-for="chip in [layout.core, ...layout.nodes]" :key="chip.id || 'core'">
          <path class="fallback-socket" :d="plate(chip.x, chip.z, chip.size + .5, chip.size + .5)" />
          <path class="fallback-chip" :d="plate(chip.x, chip.z, chip.size, chip.size, 5)" />
          <path class="fallback-chip-top" :d="plate(chip.x, chip.z, chip.size * .7, chip.size * .7, 6)" />
        </g>
        <ellipse class="fallback-core" :cx="project([layout.core.x, 0])[0]" :cy="project([layout.core.x, 0])[1] - 7" rx="7" ry="4" />
      </svg>
      <canvas ref="canvas" :class="{ 'is-ready': ready }"></canvas>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { createCircuitLayout, projectCircuitPoint as project } from '../hero/circuitLayout.mjs'

const props = defineProps({ opening: { type: Number, default: 0 } })
const host = ref(null), viewport = ref(null), canvas = ref(null), ready = ref(false)
const layout = createCircuitLayout()
const pathData = points => points.map((point, index) => `${index ? 'L' : 'M'}${project(point).join(',')}`).join(' ')
function plate(x, z, width, depth, lift = 0) {
  const points = [[x - width / 2, z - depth / 2], [x + width / 2, z - depth / 2], [x + width / 2, z + depth / 2], [x - width / 2, z + depth / 2]]
  return points.map((point, index) => {
    const [px, py] = project(point)
    return `${index ? 'L' : 'M'}${px},${py - lift}`
  }).join(' ') + ' Z'
}
const gridPaths = []
for (let x = -24; x <= 24; x += 2) gridPaths.push(pathData([[x, -18], [x, 18]]))
for (let z = -18; z <= 18; z += 2) gridPaths.push(pathData([[-24, z], [24, z]]))

let runtime, intersection, resizeObserver, themeObserver, reduced, coarse, section
let visible = false, disposed = false, loading = false, failed = false, lowPower = false
let frame = 0, previousTime = 0, elapsed = 0, pointerX = 0, pointerY = 0

function stop() {
  cancelAnimationFrame(frame)
  frame = 0
  previousTime = 0
}
function release() {
  stop()
  runtime?.dispose()
  runtime = undefined
  ready.value = false
}
function fail() {
  failed = true
  release()
}
function allowed() {
  return !disposed && !failed && !lowPower && !reduced.matches
}
function tick(now) {
  frame = 0
  if (!runtime || !visible || document.hidden || !allowed()) return
  // Cap animation at 30fps; resume without advancing time while offscreen.
  if (!previousTime || now - previousTime >= 1000 / 30) {
    const delta = previousTime ? Math.min((now - previousTime) / 1000, 0.1) : 1 / 30
    elapsed += delta
    previousTime = now
    try {
      runtime.render({ pointerX, pointerY, opening: props.opening, time: elapsed, delta })
      ready.value = true
    } catch {
      fail()
      return
    }
  }
  frame = requestAnimationFrame(tick)
}
function resume() {
  if (runtime && visible && !document.hidden && allowed() && !frame) frame = requestAnimationFrame(tick)
}
function resize() {
  if (!runtime) return
  const { width, height } = viewport.value.getBoundingClientRect()
  try { runtime.resize(width, height, coarse.matches) } catch { fail() }
}
function theme() {
  runtime?.setTheme(document.documentElement.dataset.theme === 'dark')
}
async function initialize() {
  if (runtime || loading || !visible || !allowed()) return
  loading = true
  try {
    const { createCircuitScene } = await import('../hero/createCircuitScene.mjs')
    if (!allowed() || !visible) return
    runtime = createCircuitScene(canvas.value, { compact: coarse.matches })
    resize()
    theme()
    resume()
  } catch {
    fail()
  } finally {
    loading = false
  }
}
function syncMotion() {
  pointerX = pointerY = 0
  if (!allowed()) release()
  else { resize(); initialize(); resume() }
}
function pointer(event) {
  if (coarse.matches || reduced.matches || !visible || event.pointerType === 'touch') return
  const rect = section.getBoundingClientRect()
  pointerX = Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1))
  pointerY = Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1))
}
function resetPointer() { pointerX = pointerY = 0 }
function visibility() {
  if (document.hidden) stop()
  else { initialize(); resume() }
}
function contextLost(event) {
  event.preventDefault()
  // Keep the already available SVG instead of repeatedly recreating a lost context.
  fail()
}
onMounted(() => {
  section = host.value.parentElement
  reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
  coarse = window.matchMedia('(max-width: 900px), (hover: none), (pointer: coarse)')
  lowPower = (navigator.deviceMemory > 0 && navigator.deviceMemory <= 2) || (navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 2)
  reduced.addEventListener('change', syncMotion)
  coarse.addEventListener('change', syncMotion)
  section.addEventListener('pointermove', pointer, { passive: true })
  section.addEventListener('pointerleave', resetPointer, { passive: true })
  document.addEventListener('visibilitychange', visibility)
  canvas.value.addEventListener('webglcontextlost', contextLost)
  resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(viewport.value)
  themeObserver = new MutationObserver(theme)
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
  intersection = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting
    if (visible) { initialize(); resume() } else stop()
  })
  intersection.observe(viewport.value)
})
onBeforeUnmount(() => {
  disposed = true
  intersection?.disconnect()
  resizeObserver?.disconnect()
  themeObserver?.disconnect()
  reduced?.removeEventListener('change', syncMotion)
  coarse?.removeEventListener('change', syncMotion)
  section?.removeEventListener('pointermove', pointer)
  section?.removeEventListener('pointerleave', resetPointer)
  document.removeEventListener('visibilitychange', visibility)
  canvas.value?.removeEventListener('webglcontextlost', contextLost)
  release()
})
</script>

<style lang="less" scoped>
.circuit-backdrop { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
.circuit-viewport { position: relative; height: 100%; overflow: hidden; mask-image: linear-gradient(transparent, #000 4%, #000 94%, transparent); }
.circuit-viewport::after { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, color-mix(in srgb, var(--surface) 85%, transparent), color-mix(in srgb, var(--surface) 90%, transparent) 22%, color-mix(in srgb, var(--surface) 65%, transparent) 40%, transparent 65%); }
.circuit-fallback, canvas { position: absolute; width: 100%; height: 100%; inset: 0; }
canvas { opacity: 0; }
canvas.is-ready { opacity: 1; }
.circuit-fallback.is-hidden { visibility: hidden; }
.fallback-grid { fill: none; stroke: var(--line-strong); stroke-width: .5; opacity: .2; }
.fallback-traces { fill: none; stroke: var(--muted); stroke-width: 1; opacity: .48; }
.fallback-traces .is-primary { stroke: var(--accent); stroke-width: 1.7; }
.fallback-vias { fill: var(--surface); stroke: var(--line-strong); stroke-width: 1; }
.fallback-parts { fill: var(--muted); opacity: .55; }
.fallback-socket { fill: var(--line); stroke: var(--line-strong); stroke-width: 1; }
.fallback-chip { fill: var(--muted); }
.fallback-chip-top { fill: var(--surface-alt); stroke: var(--line-strong); stroke-width: 1; }
.fallback-core { fill: var(--accent); }
@media (max-width: 900px), (hover: none), (pointer: coarse) {
  .circuit-viewport { position: sticky; top: 68px; height: min(740px, calc(100svh - 68px)); opacity: .64; }
  .circuit-viewport::after { background: linear-gradient(180deg, color-mix(in srgb, var(--surface) 78%, transparent), transparent 60%); }
}
</style>
