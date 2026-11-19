<template>
  <div ref="track" class="delivery-track" :class="{ 'is-scroll': scrollMode, 'is-static': staticMode }" :style="{ '--scene-scale': layout.stageRatio }">
    <div ref="scrollDistance" class="delivery-scroll-distance" aria-hidden="true"></div>
    <figure ref="figure" class="hero-delivery" :aria-label="content.label" tabindex="0" role="group"
      @pointerenter="hovered = true" @pointerleave="hovered = false"
      @focus="focused = $event.target.matches(':focus-visible')" @blur="focused = false">
      <div class="delivery-artwork" aria-hidden="true">
        <div class="operation-boundary" :style="{ opacity: opening / 100 }"><span class="operation-brand">borderline<b>.</b></span></div>
        <div v-for="(card, index) in layout.services" :key="card.id" class="service-card motion-trigger" :class="`service-card--${card.id}`" :style="cardStyle(card)">
          <div class="service-card__heading"><MotionIcon :kind="card.id" :active="opening > 65" /><span>{{ String(index + 1).padStart(2, '0') }}</span></div>
          <strong>{{ content.services[index].name }}</strong>
          <small>{{ content.services[index].detail }}</small>
        </div>
        <div class="agency-card" :style="cardStyle(layout.agency)">
          <div class="agency-card__top"><span>{{ content.agencyEyebrow }}</span><span class="agency-sign">a<span>.</span></span></div>
          <strong>{{ content.agency }}<i></i></strong>
          <div class="agency-card__bottom"><span>{{ content.agencyDetail }}</span><span class="agency-arrow">↗</span></div>
        </div>
      </div>
      <ul class="sr-only"><li v-for="service in content.services" :key="service.id">{{ service.name }}: {{ service.detail }}</li></ul>
    </figure>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import MotionIcon from './design/MotionIcon.vue'
import { getOperationLayout, getScrollOpening } from '../hero/operationLayout.mjs'
const props = defineProps({ content: { type: Object, required: true } })
const emit = defineEmits(['opening-change'])
const track = ref(null)
const figure = ref(null)
const scrollDistance = ref(null)
const hovered = ref(false)
const focused = ref(false)
const scrollMode = ref(false)
const staticMode = ref(false)
const scrollOpening = ref(0)
const opening = computed(() => staticMode.value || focused.value ? 100 : scrollMode.value ? scrollOpening.value : hovered.value ? 100 : 0)
const layout = computed(() => getOperationLayout(opening.value, { compact: scrollMode.value }))
watch(opening, value => emit('opening-change', value), { immediate: true })
let frame = 0
let resizeObserver
let media = []
let disposed = false

function measureScroll() {
  frame = 0
  if (!scrollMode.value || staticMode.value || !track.value || !figure.value) return
  const top = parseFloat(getComputedStyle(figure.value).top) || 0
  scrollOpening.value = getScrollOpening(track.value.getBoundingClientRect().top, top, scrollDistance.value.getBoundingClientRect().height)
}
function scheduleMeasure() {
  if (!frame && scrollMode.value && !staticMode.value) frame = requestAnimationFrame(measureScroll)
}
watch(() => props.content, scheduleMeasure, { flush: 'post' })
async function syncMode() {
  scrollMode.value = media[0].matches
  staticMode.value = media[1].matches || (scrollMode.value && media[2].matches)
  hovered.value = false
  await nextTick()
  if (!disposed) scheduleMeasure()
}
onMounted(() => {
  media = [window.matchMedia('(max-width: 900px), (hover: none), (pointer: coarse)'), window.matchMedia('(prefers-reduced-motion: reduce)'), window.matchMedia('(max-height: 599px)')]
  media.forEach(query => query.addEventListener('change', syncMode))
  window.addEventListener('scroll', scheduleMeasure, { passive: true })
  window.addEventListener('resize', scheduleMeasure, { passive: true })
  resizeObserver = new ResizeObserver(scheduleMeasure)
  resizeObserver.observe(track.value)
  resizeObserver.observe(figure.value)
  resizeObserver.observe(track.value.parentElement)
  syncMode()
})
onBeforeUnmount(() => {
  disposed = true
  cancelAnimationFrame(frame)
  resizeObserver?.disconnect()
  media.forEach(query => query.removeEventListener('change', syncMode))
  window.removeEventListener('scroll', scheduleMeasure)
  window.removeEventListener('resize', scheduleMeasure)
})
function cardStyle(card) {
  return { left: `${card.left}%`, top: `${card.top}%`, width: `${card.width}%`, height: `${card.height}%`, transform: `rotateX(${Math.abs(card.angle) / 2}deg) rotateY(${card.angle / 2}deg) rotateZ(${card.angle}deg)` }
}
</script>

<style lang="less" scoped>
.delivery-track { position: relative; min-width: 0; width: 100%; align-self: start; }
.delivery-scroll-distance { position: absolute; visibility: hidden; pointer-events: none; width: 0; height: 0; }
.hero-delivery { position: relative; min-width: 0; width: 100%; margin: 0; isolation: isolate; border-radius: 18px; }
.delivery-artwork { position: relative; aspect-ratio: 1 / 1.02; perspective: 1200px; }
.service-card, .agency-card { transition: left 750ms var(--kit-ease), top 750ms var(--kit-ease), width 750ms var(--kit-ease), height 750ms var(--kit-ease), transform 750ms var(--kit-ease); }
.operation-boundary { transition: opacity 750ms var(--kit-ease); }
.is-scroll { --scene-height: clamp(460px, calc(100svh - 96px), 620px); --scroll-travel: 80svh; --reading-travel: 40svh; max-width: 620px; justify-self: center; min-height: calc(var(--scene-height) + var(--scroll-travel) + var(--reading-travel)); }
.is-scroll .delivery-scroll-distance { height: var(--scroll-travel); }
.is-scroll .hero-delivery { position: sticky; top: 68px; }
.is-scroll .delivery-artwork { height: calc(var(--scene-height) * var(--scene-scale)); aspect-ratio: auto; }
.is-scroll .service-card, .is-scroll .agency-card, .is-scroll .operation-boundary,
.is-static .service-card, .is-static .agency-card, .is-static .operation-boundary { transition: none; }
.is-static { min-height: 0; }
.is-static .hero-delivery { position: relative; top: auto; }
.operation-boundary { position: absolute; inset: 0 0 32%; border: 1px solid var(--line); border-radius: 18px; pointer-events: none; }
.operation-boundary::before { content: ''; position: absolute; inset: 4px; border: 1px solid var(--accent); border-radius: 14px; }
.operation-brand { position: absolute; z-index: 1; right: clamp(14px, 3%, 24px); bottom: 2px; transform: translateY(50%); padding: 2px 10px; background: var(--surface); font: 400 clamp(16px, 1.6vw, 24px)/1 var(--kit-font-accent); white-space: nowrap; color: var(--ink); }
.operation-brand b { color: var(--accent); font-weight: inherit; }
.service-card { position: absolute; overflow: hidden; padding: clamp(10px, 1vw, 14px); border: 1px solid var(--line-strong); border-radius: 14px; background: var(--surface); box-shadow: 0 8px 18px -12px var(--scene-shadow); }
.service-card--infra, .service-card--data, .service-card--systems { background: var(--surface-alt); }
.service-card__heading { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; color: var(--accent); }
.service-card__heading > span { font: 9px var(--kit-font-accent); color: var(--muted); }
.service-card__heading :deep(svg) { width: clamp(22px, 2vw, 26px); height: clamp(22px, 2vw, 26px); }
.service-card strong { display: block; font-size: clamp(11px, 1.1vw, 16px); font-weight: 500; letter-spacing: -.025em; line-height: 1.4; }
.service-card small { display: block; margin-top: 4px; color: var(--muted); font-size: clamp(8px, .7vw, 10px); line-height: 1.5; }
.agency-card { position: absolute; z-index: 10; display: flex; flex-direction: column; justify-content: space-between; padding: clamp(16px, 1.6vw, 24px); border: 1px solid var(--ink); border-radius: 18px; color: var(--surface); background: var(--ink); box-shadow: 0 25px 50px -20px var(--scene-shadow); }
.agency-card::before { content: ''; position: absolute; z-index: -1; inset: 7px -7px -7px 7px; border: 1px solid var(--accent); border-radius: inherit; }
.agency-card__top, .agency-card__bottom { display: flex; justify-content: space-between; align-items: center; gap: 16px; }
.agency-card__top > span:first-child { font: 400 9px/1.6 var(--kit-font-accent); text-transform: uppercase; letter-spacing: .07em; }
.agency-sign { font: 22px var(--kit-font-accent); }.agency-sign > span { color: var(--accent); }
.agency-card > strong { font-size: clamp(24px, 2.8vw, 42px); font-weight: 500; letter-spacing: -.045em; line-height: 1.15; }
.agency-card > strong i { display: inline-block; height: .13em; width: .13em; margin-left: .06em; border-radius: 50%; background: var(--accent); }
.agency-card__bottom { font-size: 9px; line-height: 1.7; }
.agency-arrow { font-size: 20px; }
@media (max-width: 1200px) and (min-width: 901px) {
  .service-card { padding: 10px 12px; } .service-card__heading { margin-bottom: 4px; }
  .service-card__heading :deep(svg) { width: 20px; height: 20px; } .service-card small { margin-top: 2px; font-size: 8px; }
  .agency-card { padding: 14px 20px; } .agency-card > strong { font-size: 27px; } .agency-sign { font-size: 18px; }
}
@media (max-width: 900px) {
  .hero-delivery { max-width: 620px; justify-self: center; }
  .service-card { padding: 14px 18px; } .service-card strong { font-size: 14px; } .service-card small { font-size: 10px; }
  .agency-card { padding: 20px 28px; } .agency-card > strong { font-size: 34px; }
}
@media (max-width: 600px) and (min-width: 481px) {
  .service-card { padding: 10px 12px; } .service-card__heading { margin-bottom: 3px; }
  .service-card__heading :deep(svg) { width: 22px; height: 22px; }
  .service-card strong { font-size: 12px; } .service-card small { font-size: 9px; margin-top: 2px; }
  .agency-card { padding: 14px 18px; } .agency-card > strong { font-size: 28px; } .agency-sign { font-size: 18px; }
}
@media (max-width: 480px) {
  .delivery-artwork { aspect-ratio: 1 / 1.4; }
  .service-card { padding: 9px 10px; border-radius: 10px; } .service-card__heading { margin-bottom: 4px; }
  .service-card strong { font-size: 11px; } .service-card small { font-size: 8px; margin-top: 3px; }
  .service-card__heading :deep(svg) { width: 22px; height: 22px; }
  .agency-card { padding: 14px 16px; border-radius: 12px; } .agency-card > strong { font-size: 24px; }
  .agency-card__top > span:first-child { font-size: 7px; }.agency-sign { font-size: 17px; }
  .agency-card__bottom { font-size: 8px; } .agency-arrow { font-size: 16px; }
}
@media (max-width: 360px) { .delivery-artwork { aspect-ratio: 1 / 1.6; } }
.is-scroll .service-card { padding: 10px 12px; }
.is-scroll .service-card__heading { margin-bottom: 4px; }
.is-scroll .service-card__heading :deep(svg) { width: 22px; height: 22px; }
.is-scroll .service-card strong { font-size: 12px; }
.is-scroll .service-card small { font-size: 9px; margin-top: 2px; }
.is-scroll .agency-card { padding: 14px 16px; }
.is-scroll .agency-card > strong { font-size: 26px; }
.is-scroll .agency-sign { font-size: 18px; }
@media (max-width: 360px) { .is-scroll .service-card strong { font-size: 11px; } }
@media (prefers-reduced-motion: reduce) { .service-card, .agency-card, .operation-boundary { transition: none; } }
</style>
