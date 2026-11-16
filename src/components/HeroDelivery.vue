<template>
  <figure class="hero-delivery" :aria-label="content.label">
    <div class="delivery-topline"><span>{{ content.frontLabel }}</span><span>{{ content.backLabel }}</span></div>
    <div class="delivery-artwork" aria-hidden="true">
      <div class="operation-grid"></div>
      <div class="operation-boundary" :style="{ opacity: opening / 100 }"><span>borderline<b>.</b>dev</span></div>
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
    <div class="operation-slider">
      <div class="slider-heading"><label for="operation-opening">{{ content.sliderLabel }}</label><output for="operation-opening" aria-hidden="true">{{ opening }}<span>%</span></output></div>
      <input id="operation-opening" type="range" min="0" max="100" step="1" :value="opening"
        :style="{ '--opening': `${opening}%` }" :aria-valuetext="`${opening}% — ${content.openingValue}`"
        aria-describedby="operation-help operation-caption" @input="updateOpening($event.target.value)">
      <div class="slider-endpoints"><button type="button" @click="updateOpening(0)">{{ content.closed }}</button><span aria-hidden="true">↔</span><button type="button" @click="updateOpening(100)">{{ content.open }}</button></div>
      <p id="operation-help" class="slider-help">{{ content.sliderHelp }}</p>
    </div>
    <figcaption id="operation-caption"><span class="operation-caption__dot" aria-hidden="true"></span>{{ content.caption }}</figcaption>
    <ul class="sr-only"><li v-for="service in content.services" :key="service.id">{{ service.name }}: {{ service.detail }}</li></ul>
  </figure>
</template>

<script setup>
import { computed, ref } from 'vue'
import MotionIcon from './design/MotionIcon.vue'
import { getOperationLayout, normalizeOpening } from '../hero/operationLayout.mjs'
defineProps({ content: { type: Object, required: true } })
const opening = ref(0)
const layout = computed(() => getOperationLayout(opening.value))
function updateOpening(value) { opening.value = normalizeOpening(value) }
function cardStyle(card) {
  return { left: `${card.left}%`, top: `${card.top}%`, width: `${card.width}%`, height: `${card.height}%`, transform: `rotateX(${Math.abs(card.angle) / 2}deg) rotateY(${card.angle / 2}deg) rotateZ(${card.angle}deg)` }
}
</script>

<style lang="less" scoped>
.hero-delivery { position: relative; min-width: 0; width: 100%; margin: 0; isolation: isolate; }
.delivery-topline { display: flex; justify-content: space-between; gap: 18px; font: 400 9px/1.6 var(--kit-font-accent); color: var(--muted); text-transform: uppercase; letter-spacing: .08em; }
.delivery-artwork { position: relative; aspect-ratio: 1 / 1.02; margin-top: 16px; perspective: 1200px; }
.operation-grid { position: absolute; inset: 0; background-image: radial-gradient(var(--line-strong) .7px, transparent .7px); background-size: 22px 22px; mask-image: radial-gradient(ellipse, #000 15%, transparent 72%); opacity: .55; }
.operation-boundary { position: absolute; inset: 0 0 32%; border: 1px solid var(--line); border-radius: 18px; }
.operation-boundary > span { position: absolute; bottom: -8px; left: 24px; padding: 0 10px; background: var(--surface); font: 10px var(--kit-font-accent); }
.operation-boundary b { color: var(--accent); font-weight: 400; }
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
.operation-slider { position: relative; margin: 18px 4% 0; }
.slider-heading { display: flex; align-items: center; justify-content: space-between; gap: 20px; }
.slider-heading label { font: 400 11px/1.7 var(--kit-font-accent); cursor: pointer; }
.slider-heading output { font: 12px var(--kit-font-accent); font-variant-numeric: tabular-nums; }
.slider-heading output span { color: var(--muted); margin-left: 3px; }
input[type='range'] { display: block; appearance: none; -webkit-appearance: none; width: 100%; height: 44px; margin: 4px 0 0; background: transparent; cursor: ew-resize; border-radius: 999px; }
input[type='range']::-webkit-slider-runnable-track { height: 3px; border-radius: 3px; background: linear-gradient(to right, var(--accent) var(--opening), var(--line-strong) var(--opening)); }
input[type='range']::-moz-range-track { height: 3px; border-radius: 3px; background: linear-gradient(to right, var(--accent) var(--opening), var(--line-strong) var(--opening)); }
input[type='range']::-webkit-slider-thumb { appearance: none; -webkit-appearance: none; height: 24px; width: 24px; margin-top: -10.5px; border: 6px solid var(--surface); border-radius: 50%; background: var(--accent); box-shadow: 0 0 0 1px var(--accent); }
input[type='range']::-moz-range-thumb { height: 12px; width: 12px; border: 6px solid var(--surface); border-radius: 50%; background: var(--accent); box-shadow: 0 0 0 1px var(--accent); }
.slider-endpoints { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.slider-endpoints button { min-height: 32px; padding: 2px 0; border: 0; color: var(--muted); background: transparent; font: 400 10px/1.6 var(--kit-font-accent); cursor: pointer; }
.slider-endpoints button:hover { color: var(--ink); }
.slider-endpoints > span { color: var(--muted); font-size: 16px; }
.slider-help { margin: 5px 0 0; font-size: 10px; color: var(--muted); line-height: 1.7; }
figcaption { display: flex; gap: 9px; align-items: flex-start; margin: 24px 4% 0; padding-top: 18px; border-top: 1px solid var(--line); font-size: 10px; line-height: 1.8; color: var(--muted); }
.operation-caption__dot { width: 5px; height: 5px; flex: 0 0 5px; margin-top: 6px; border-radius: 50%; background: var(--accent); }
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
  .delivery-artwork { aspect-ratio: 1 / 1.4; margin-top: 10px; }
  .delivery-topline { font-size: 8px; }
  .service-card { padding: 9px 10px; border-radius: 10px; } .service-card__heading { margin-bottom: 4px; }
  .service-card strong { font-size: 11px; } .service-card small { font-size: 8px; margin-top: 3px; }
  .service-card__heading :deep(svg) { width: 22px; height: 22px; }
  .agency-card { padding: 14px 16px; border-radius: 12px; } .agency-card > strong { font-size: 24px; }
  .agency-card__top > span:first-child { font-size: 7px; }.agency-sign { font-size: 17px; }
  .agency-card__bottom { font-size: 8px; } .agency-arrow { font-size: 16px; }
  .slider-heading label { font-size: 10px; }
}
@media (max-width: 360px) { .delivery-artwork { aspect-ratio: 1 / 1.6; } }
</style>
