<template>
  <figure class="hero-delivery" :class="{ 'is-expanded': expanded }" :aria-label="content.label">
    <div ref="artwork" class="delivery-artwork" aria-hidden="true" @pointermove="tilt" @pointerleave="resetTilt">
      <div class="artwork-grid"></div>
      <span class="artwork-index">BL / 001</span>
      <span class="artwork-example">{{ content.example }}</span>
      <div class="delivery-layers">
        <div class="delivery-layer delivery-layer--infra">
          <div class="layer-heading"><span class="layer-number">03</span><div><strong>{{ content.infrastructure }}</strong><small>{{ content.infrastructureDetail }}</small></div><span class="layer-symbol">⌘</span></div>
          <div class="infra-nodes"><span v-for="(service, index) in content.services" :key="service"><i aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="6" rx="2"/><rect x="4" y="14" width="16" height="6" rx="2"/><path d="M7 7h1m-1 10h1m4-10h5m-5 10h5"/></svg></i><small>{{ service }}</small><b v-if="index < 2" aria-hidden="true"></b></span></div>
        </div>
        <div class="delivery-layer delivery-layer--development">
          <div class="layer-heading"><span class="layer-number">02</span><div><strong>{{ content.development }}</strong><small>{{ content.developmentDetail }}</small></div><span class="layer-symbol">↗</span></div>
          <div class="development-flow"><span v-for="(step, index) in content.steps" :key="step"><i>{{ String(index + 1).padStart(2, '0') }}</i>{{ step }}<b v-if="index < 2">→</b></span></div>
          <div class="development-lines"><span></span><span></span><span></span></div>
        </div>
        <div class="delivery-layer delivery-layer--website">
          <div class="browser-chrome"><span class="browser-dots"><i></i><i></i><i></i></span><span>{{ content.website }}</span><span class="browser-corner">↗</span></div>
          <div class="mini-site">
            <div class="mini-navigation"><span class="mini-brand">forma<span>®</span></span><span>{{ content.collection }}</span><span>{{ content.about }}</span><span>↗</span></div>
            <div class="mini-product">
              <div class="mini-product__copy"><small>{{ content.edition }}</small><strong><span v-for="line in content.objectTitle" :key="line">{{ line }}</span></strong><span class="mini-product__description">{{ content.objectSubtitle }}</span><span class="mini-product__cta">{{ content.objectCta }} <b>↗</b></span></div>
              <svg class="product-object" viewBox="0 0 220 240" fill="none">
                <defs>
                  <linearGradient id="hero-lamp-shade" x1="39" y1="59" x2="177" y2="137" gradientUnits="userSpaceOnUse"><stop stop-color="#efe8d5"/><stop offset=".38" stop-color="#d3c3a3"/><stop offset="1" stop-color="#998a6b"/></linearGradient>
                  <linearGradient id="hero-lamp-stem" x1="98" y1="140" x2="120" y2="140" gradientUnits="userSpaceOnUse"><stop stop-color="#9d8f71"/><stop offset=".5" stop-color="#ded1b6"/><stop offset="1" stop-color="#8d8167"/></linearGradient>
                  <radialGradient id="hero-lamp-glow"><stop stop-color="#f8e2a1" stop-opacity=".6"/><stop offset="1" stop-color="#eee5cb" stop-opacity="0"/></radialGradient>
                </defs>
                <ellipse cx="112" cy="212" rx="69" ry="13" fill="#2e4936" opacity=".12"/>
                <ellipse cx="112" cy="185" rx="86" ry="47" fill="url(#hero-lamp-glow)"/>
                <path d="M71 200c0-7 18-13 40-13s40 6 40 13v7H71v-7Z" fill="#94866a"/>
                <ellipse cx="111" cy="200" rx="40" ry="13" fill="#c3b18b"/>
                <rect x="101" y="103" width="20" height="97" rx="7" fill="url(#hero-lamp-stem)"/>
                <path d="M32 121c0-46 35-83 79-83s79 37 79 83H32Z" fill="url(#hero-lamp-shade)"/>
                <ellipse cx="111" cy="121" rx="79" ry="15" fill="#94876b"/>
                <ellipse cx="111" cy="122" rx="65" ry="9" fill="#f6e7bc"/>
                <path d="M54 93c10-27 31-44 56-45" stroke="#f5efdf" stroke-width="2" stroke-linecap="round" opacity=".5"/>
              </svg>
            </div>
            <div class="mini-footer"><span>01 — 03</span><span class="mini-rule"></span><span>← &nbsp; →</span></div>
          </div>
        </div>
      </div>
      <div class="agency-label"><span></span>{{ content.badge }}</div>
      <div class="technical-lead"><span class="lead-monogram">m<span>.</span></span><span><strong>{{ content.lead }}</strong><small>{{ content.leadRole }}</small></span><span class="lead-connector">↗</span></div>
    </div>
    <div class="delivery-controls" role="group" :aria-label="content.controls">
      <button type="button" :aria-pressed="!expanded" @click="expanded = false"><span aria-hidden="true">01</span>{{ content.delivery }}</button>
      <button type="button" :aria-pressed="expanded" @click="expanded = true"><span aria-hidden="true">02</span>{{ content.operation }}</button>
    </div>
    <figcaption aria-live="polite">{{ expanded ? content.operationCaption : content.deliveryCaption }}</figcaption>
    <ul v-if="expanded" class="sr-only"><li>{{ content.lead }} — {{ content.leadRole }}</li><li>{{ content.development }}: {{ content.steps.join(', ') }}</li><li>{{ content.infrastructure }}: {{ content.services.join(', ') }}</li></ul>
  </figure>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
defineProps({ content: { type: Object, required: true } })
const artwork = ref(null)
const expanded = ref(false)
let motionQuery
function resetTilt() {
  artwork.value?.style.setProperty('--pointer-x', '0deg')
  artwork.value?.style.setProperty('--pointer-y', '0deg')
}
function tilt(event) {
  if (event.pointerType !== 'mouse' || motionQuery?.matches) return
  const bounds = artwork.value.getBoundingClientRect()
  if (!bounds.width || !bounds.height) return
  artwork.value.style.setProperty('--pointer-x', `${((event.clientX - bounds.left) / bounds.width - 0.5) * 5}deg`)
  artwork.value.style.setProperty('--pointer-y', `${((event.clientY - bounds.top) / bounds.height - 0.5) * -4}deg`)
}
onMounted(() => {
  motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  motionQuery.addEventListener('change', resetTilt)
})
onBeforeUnmount(() => motionQuery?.removeEventListener('change', resetTilt))
</script>

<style lang="less" scoped>
.hero-delivery { position: relative; min-width: 0; margin: 0; isolation: isolate; }
.delivery-artwork { position: relative; height: clamp(440px, 38vw, 580px); perspective: 1400px; }
.artwork-grid { position: absolute; inset: 0 -3% 0 3%; background-image: linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px); background-size: 46px 46px; mask-image: radial-gradient(ellipse at center, #000 5%, transparent 69%); opacity: .7; }
.artwork-index, .artwork-example { position: absolute; top: 8px; font-size: 8px; color: var(--muted); letter-spacing: .12em; text-transform: uppercase; }
.artwork-index { left: 8%; } .artwork-example { right: 5%; }
.delivery-layers { position: absolute; inset: 4% 0 5%; transform-style: preserve-3d; transform: rotateX(calc(12deg + var(--pointer-y, 0deg))) rotateY(calc(-17deg + var(--pointer-x, 0deg))) rotateZ(-5deg); transition: transform 550ms ease; }
.delivery-layer { position: absolute; left: 9%; width: 84%; border: 1px solid var(--scene-border); border-radius: 12px; transition: transform 850ms cubic-bezier(.22,.68,0,1), top 850ms cubic-bezier(.22,.68,0,1), height 850ms cubic-bezier(.22,.68,0,1), box-shadow 850ms ease; overflow: hidden; }
.delivery-layer--website { top: 16%; height: 62%; background: #fbfaf6; color: #2b3931; transform: translateZ(100px); box-shadow: 0 35px 60px -28px var(--scene-shadow), 0 2px 0 var(--scene-border); }
.delivery-layer--development { top: 26%; height: 46%; padding: 22px; background: var(--scene-middle); color: var(--ink); transform: translate3d(20px, 20px, 0); box-shadow: 0 25px 45px -30px var(--scene-shadow); }
.delivery-layer--infra { top: 40%; height: 40%; padding: 22px; background: var(--scene-back); color: var(--ink); transform: translate3d(42px, 30px, -90px); box-shadow: 0 30px 50px -30px var(--scene-shadow); }
.browser-chrome { height: 30px; display: flex; align-items: center; justify-content: space-between; padding: 0 15px; border-bottom: 1px solid #e5e6df; background: #f0f1eb; color: #768176; font-size: 8px; }
.browser-dots { display: flex; gap: 4px; } .browser-dots i { width: 4px; height: 4px; border: 1px solid #99a394; border-radius: 50%; } .browser-corner { font-size: 12px; }
.mini-site { display: flex; flex-direction: column; height: calc(100% - 30px); padding: 16px 23px 12px; }
.mini-navigation { display: flex; align-items: center; gap: 17px; font-size: 8px; }
.mini-brand { margin-right: auto; font-size: 27px; letter-spacing: -1.8px; font-weight: 600; } .mini-brand > span { font-size: 9px; vertical-align: top; margin-left: 2px; }
.mini-product { position: relative; display: flex; align-items: center; min-height: 0; flex: 1; margin-top: 12px; background: #e3e8dc; padding: 20px; border-radius: 3px; }
.mini-product__copy { position: relative; z-index: 1; width: 58%; }
.mini-product__copy > small { display: block; font-size: 6px; letter-spacing: .1em; margin-bottom: 12px; }
.mini-product__copy > strong { display: block; font-family: Georgia, serif; font-size: clamp(20px, 2.5vw, 37px); line-height: 1.05; letter-spacing: -1.2px; font-weight: 400; }
.mini-product__copy > strong > span { display: block; }
.mini-product__description { display: block; font-size: 7px; margin-top: 9px; }
.mini-product__cta { display: inline-flex; gap: 14px; font-size: 7px; margin-top: 18px; padding-bottom: 5px; border-bottom: 1px solid #a3afa0; }
.product-object { position: absolute; width: 52%; height: 100%; right: -1%; bottom: 0; }
.mini-footer { display: flex; align-items: center; gap: 15px; font-size: 7px; padding-top: 12px; } .mini-rule { height: 1px; flex: 1; background: #daddd4; }
.layer-heading { display: flex; gap: 12px; align-items: center; }
.layer-number { font-size: 9px; color: var(--muted); align-self: flex-start; padding-top: 2px; }
.layer-heading strong, .layer-heading small { display: block; }
.layer-heading strong { font-size: 14px; font-weight: 500; letter-spacing: -.3px; }
.layer-heading small { font-size: 9px; color: var(--muted); margin-top: 5px; }
.layer-symbol { margin-left: auto; font-size: 24px; color: var(--muted); }
.development-flow { display: flex; gap: 8px; margin-top: 23px; }
.development-flow > span { display: flex; align-items: center; gap: 6px; flex: 1; font-size: 9px; }
.development-flow i { display: grid; place-items: center; width: 23px; height: 23px; border: 1px solid var(--line-strong); border-radius: 4px; font-size: 7px; font-style: normal; }
.development-flow b { font-size: 13px; margin-left: auto; color: var(--muted); font-weight: 400; }
.development-lines { display: flex; gap: 8px; margin-top: 20px; } .development-lines span { height: 3px; background: var(--line); width: 20%; border-radius: 3px; } .development-lines span:first-child { width: 40%; }
.infra-nodes { display: flex; justify-content: space-between; margin-top: 18px; }
.infra-nodes > span { display: flex; align-items: center; position: relative; gap: 7px; }
.infra-nodes small { font-size: 8px; }
.infra-nodes i { display: grid; place-items: center; width: 24px; height: 28px; }
.infra-nodes svg { width: 23px; fill: none; stroke: var(--muted); stroke-width: 1.1; stroke-linecap: round; }
.infra-nodes b { display: none; }
.agency-label { position: absolute; top: 13%; right: -1%; z-index: 2; display: flex; align-items: center; gap: 8px; padding: 12px 15px; background: var(--surface); border: 1px solid var(--line); border-radius: 6px; box-shadow: 0 8px 30px -20px var(--scene-shadow); font-size: 10px; transform: rotate(3deg); transition: opacity 400ms ease, transform 600ms ease; }
.agency-label > span { height: 5px; width: 5px; border-radius: 50%; background: var(--accent); }
.technical-lead { position: absolute; display: flex; align-items: center; gap: 10px; bottom: 16%; left: 0; z-index: 2; padding: 12px 16px 12px 12px; border: 1px solid var(--line); border-radius: 9px; background: var(--surface); box-shadow: 0 14px 30px -22px var(--scene-shadow); transform: rotate(-3deg); transition: bottom 850ms ease, transform 850ms ease; }
.lead-monogram { display: grid; place-content: center; grid-auto-flow: column; width: 35px; height: 35px; border-radius: 7px; font-family: 'Offside', Arial, sans-serif; font-size: 18px; background: var(--surface-alt); } .lead-monogram > span { color: var(--accent); }
.technical-lead strong, .technical-lead small { display: block; }
.technical-lead strong { font-size: 11px; font-weight: 500; }
.technical-lead small { font-size: 8px; margin-top: 5px; color: var(--muted); }
.lead-connector { margin-left: 12px; color: var(--accent); font-size: 18px; }
.is-expanded .delivery-layers { transform: rotateX(5deg) rotateY(-7deg) rotateZ(-2deg); }
.is-expanded .delivery-layer--website { top: -7%; transform: translate3d(5%, 0, 65px) scale(.8); }
.is-expanded .delivery-layer--development { top: 46%; height: 31%; transform: translate3d(0, 0, 0) scale(.94); }
.is-expanded .delivery-layer--infra { top: 78%; height: 27%; transform: translate3d(-2%, 0, -30px) scale(.97); }
.is-expanded .technical-lead { bottom: 52%; transform: rotate(0); }
.is-expanded .agency-label { opacity: 0; transform: translateY(-15px); }
.delivery-controls { position: relative; z-index: 3; display: flex; width: fit-content; margin: 24px auto 0; padding: 4px; gap: 3px; border: 1px solid var(--line); border-radius: 30px; background: var(--surface-alt); }
.delivery-controls button { min-height: 38px; border: 0; border-radius: 24px; padding: 10px 16px; color: var(--muted); background: transparent; font-size: 11px; cursor: pointer; transition: background 200ms ease, color 200ms ease; }
.delivery-controls button > span { font-size: 8px; margin-right: 8px; opacity: .65; }
.delivery-controls button[aria-pressed="true"] { background: var(--surface); color: var(--ink); box-shadow: 0 2px 8px #00000008; }
figcaption { max-width: 90%; min-height: 34px; margin: 12px auto 0; font-size: 10px; text-align: center; color: var(--muted); line-height: 1.6; }
@media (max-width: 1100px) {
  .delivery-artwork { height: 460px; } .delivery-layer { left: 7%; width: 86%; }
  .mini-site { padding: 12px 16px; } .mini-product { padding: 14px; }
  .mini-navigation { gap: 10px; font-size: 7px; } .mini-brand { font-size: 22px; }
  .delivery-layer--website { height: 57%; }
  .delivery-layer--infra, .delivery-layer--development { padding: 17px; }
  .infra-nodes { gap: 6px; } .infra-nodes > span { gap: 3px; } .infra-nodes small { font-size: 7px; }
  .layer-heading strong { font-size: 12px; } .layer-heading small { font-size: 8px; }
  .development-flow { gap: 5px; } .development-flow > span { font-size: 8px; gap: 4px; }
  .development-flow i { width: 18px; height: 20px; }
  .is-expanded .delivery-layer--website { top: -3%; } .is-expanded .delivery-layer--development { top: 45%; } .is-expanded .delivery-layer--infra { top: 78%; }
  .agency-label { right: -2%; font-size: 9px; }
}
@media (max-width: 800px) {
  .hero-delivery { width: min(600px, 100%); justify-self: center; margin-top: 10px; }
  .delivery-artwork { height: clamp(410px, 78vw, 540px); }
  .mini-product__copy > strong { font-size: clamp(25px, 5vw, 37px); }
  .is-expanded .delivery-layer--website { top: -2%; }
  .artwork-grid { inset: 0; } .agency-label { right: 0; }
}
@media (max-width: 430px) {
  .delivery-artwork { height: 380px; }
  .delivery-layer { left: 4%; width: 89%; border-radius: 8px; }
  .delivery-layers { transform: rotateX(8deg) rotateY(-12deg) rotateZ(-4deg); }
  .delivery-layer--website { height: 60%; }
  .delivery-layer--infra, .delivery-layer--development { padding: 12px; }
  .browser-chrome { height: 23px; padding: 0 10px; font-size: 6px; }
  .mini-site { height: calc(100% - 23px); padding: 10px 12px; }
  .mini-navigation { font-size: 6px; } .mini-brand { font-size: 20px; }
  .mini-product { margin-top: 8px; padding: 12px; }
  .mini-product__copy > strong { font-size: 24px; }
  .mini-product__copy > small { font-size: 5px; margin-bottom: 8px; }
  .mini-product__description { font-size: 6px; }
  .mini-product__cta { font-size: 6px; margin-top: 12px; }
  .mini-footer { padding-top: 8px; font-size: 6px; }
  .technical-lead { padding: 9px; gap: 8px; left: -4px; bottom: 12%; }
  .lead-monogram { width: 28px; height: 28px; font-size: 16px; } .lead-connector { margin-left: 3px; }
  .technical-lead strong { font-size: 10px; } .technical-lead small { font-size: 7px; }
  .layer-heading { gap: 8px; } .layer-heading strong { font-size: 11px; } .layer-heading small { font-size: 7px; }
  .layer-symbol { font-size: 18px; }
  .development-flow { margin-top: 17px; } .development-flow > span { font-size: 7px; } .development-lines { margin-top: 14px; }
  .infra-nodes { margin-top: 12px; } .infra-nodes i { width: 18px; } .infra-nodes svg { width: 18px; } .infra-nodes small { font-size: 6px; }
  .is-expanded .delivery-layer--development { top: 47%; } .is-expanded .delivery-layer--infra { top: 80%; }
  .is-expanded .technical-lead { bottom: 49%; }
  .delivery-controls { margin-top: 28px; } .delivery-controls button { font-size: 10px; padding: 10px 13px; }
}
@media (prefers-reduced-motion: reduce) {
  .delivery-layers, .delivery-layer, .technical-lead, .agency-label, .delivery-controls button { transition: none; }
  .delivery-layers { transform: rotateX(8deg) rotateY(-12deg) rotateZ(-4deg); }
}
</style>
