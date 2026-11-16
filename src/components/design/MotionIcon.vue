<template>
  <svg class="motion-icon" :class="{ 'is-active': active }" viewBox="0 0 48 48" fill="none" aria-hidden="true" focusable="false">
    <template v-if="kind === 'dev'">
      <rect class="icon-tint" x="5" y="7" width="38" height="33" rx="5" />
      <path d="M5 17h38M11 12h1m4 0h1m4 0h1" />
      <g class="motion-detail"><path d="m17 23-6 5 6 5m14-10 6 5-6 5m-5-11-4 13" /></g>
    </template>
    <template v-else-if="kind === 'infra'">
      <path d="M24 20v9M9 34v-5h30v5" />
      <g class="motion-detail"><rect class="icon-tint" x="12" y="5" width="24" height="15" rx="4" /><path d="M17 11h9m-9 4h14" /></g>
      <rect x="3" y="34" width="12" height="9" rx="2" /><rect x="18" y="34" width="12" height="9" rx="2" /><rect x="33" y="34" width="12" height="9" rx="2" />
    </template>
    <template v-else-if="kind === 'game'">
      <path class="icon-tint" d="M16 13h16c6 0 9 6 11 18 1 6-5 9-9 4l-4-4H18l-4 4c-4 5-10 2-9-4 2-12 5-18 11-18Z" />
      <path d="M24 13V8h6V4M11 23h10m-5-5v10" />
      <g class="motion-detail"><circle cx="32" cy="20" r="2" /><circle cx="37" cy="26" r="2" /></g>
    </template>
    <template v-else-if="kind === 'data'">
      <path d="M6 6v36h37" />
      <g class="motion-detail motion-detail--bars"><rect class="icon-tint" x="12" y="26" width="6" height="10" rx="1" /><rect x="23" y="18" width="6" height="18" rx="1" /><rect class="icon-tint" x="34" y="8" width="6" height="28" rx="1" /></g>
      <path d="m12 17 11-8 8 2" />
    </template>
    <template v-else-if="kind === 'product'">
      <path class="icon-tint" d="m24 4 18 10v20L24 44 6 34V14L24 4Z" />
      <path d="m6 14 18 10 18-10M24 24v20" />
      <g class="motion-detail"><path d="m15 9 18 10v11l-9 5-9-5V19l18-10" /></g>
    </template>
    <template v-else-if="kind === 'systems'">
      <rect class="icon-tint" x="3" y="5" width="15" height="15" rx="4" /><rect x="30" y="28" width="15" height="15" rx="4" />
      <g class="motion-detail"><path d="M18 12h15a5 5 0 0 1 5 5v6m-4-4 4 4 4-4M30 36H15a5 5 0 0 1-5-5v-6m-4 4 4-4 4 4" /></g>
      <path d="M8 12h5m22 24h5" />
    </template>
    <template v-else-if="kind === 'contact'">
      <path class="icon-tint" d="M8 7h32a4 4 0 0 1 4 4v22a4 4 0 0 1-4 4H20l-10 7v-7H8a4 4 0 0 1-4-4V11a4 4 0 0 1 4-4Z" />
      <g class="motion-detail"><path d="M12 16h24M12 23h19M12 30h12" /></g>
    </template>
    <template v-else>
      <path d="m5 31 19 11 19-11M5 23l19 11 19-11" />
      <g class="motion-detail"><path class="icon-tint" d="m5 15 19-11 19 11-19 11L5 15Z" /></g>
    </template>
  </svg>
</template>

<script setup>
defineProps({ kind: { type: String, default: 'layers' }, active: Boolean })
</script>

<style scoped>
.motion-icon { width: 36px; height: 36px; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; overflow: visible; }
.icon-tint { fill: currentColor; fill-opacity: .1; }
.motion-detail { transform-box: fill-box; transform-origin: center; }
.is-active .motion-detail, :global(.motion-trigger:focus-visible .motion-icon .motion-detail) { animation: detail-reveal 650ms cubic-bezier(.22, 1, .36, 1) both; }
@media (hover: hover) and (pointer: fine) { :global(.motion-trigger:hover .motion-icon .motion-detail) { animation: detail-reveal 650ms cubic-bezier(.22, 1, .36, 1) both; } }
@keyframes detail-reveal { 0% { opacity: .4; transform: translateY(3px) scale(.85); } 65% { opacity: 1; transform: translateY(-1px) scale(1.04); } 100% { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) { .motion-detail { animation: none !important; } }
</style>
