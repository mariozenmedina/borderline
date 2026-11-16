<template>
  <button type="button" class="reveal-button" :class="[`reveal-button--${tone}`, { 'reveal-button--layers': layers, 'is-preview': preview }]"
    :disabled="disabled" :aria-label="label">
    <span v-if="layers" class="reveal-button__back" aria-hidden="true"></span>
    <span class="reveal-button__front" aria-hidden="true"></span>
    <span class="reveal-button__icon" aria-hidden="true"><slot /></span>
    <span class="reveal-button__label" aria-hidden="true"><span>{{ label }}</span></span>
  </button>
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
  tone: { type: String, default: 'ink' },
  layers: Boolean,
  preview: Boolean,
  disabled: Boolean,
})
</script>

<style lang="less" scoped>
.reveal-button {
  --control-fill: var(--kit-ink); --control-ink: var(--kit-surface); --control-radius: 999px;
  position: relative; isolation: isolate; display: inline-flex; flex: none; align-items: center; vertical-align: middle;
  min-width: 56px; min-height: 56px; max-width: 100%; padding: 0; border: 0; border-radius: var(--control-radius);
  background: transparent; color: var(--control-ink); cursor: pointer; font: inherit;
}
.reveal-button--accent { --control-fill: var(--kit-action); --control-ink: #fff; }
.reveal-button--outline { --control-fill: var(--kit-surface); --control-ink: var(--kit-ink); }
.reveal-button__front, .reveal-button__back { position: absolute; inset: 0; border-radius: inherit; pointer-events: none; }
.reveal-button__front { z-index: -1; background: var(--control-fill); border: 1px solid transparent; transition: background var(--kit-duration); }
.reveal-button--outline .reveal-button__front { border-color: var(--kit-border-strong); }
.reveal-button__icon { width: 56px; height: 56px; flex: 0 0 56px; display: grid; place-items: center; }
.reveal-button__icon :deep(svg) { width: 25px; height: 25px; }
.reveal-button__label { display: grid; grid-template-columns: 0fr; opacity: 0; transition: grid-template-columns var(--kit-duration) var(--kit-ease), opacity var(--kit-duration); }
.reveal-button__label > span { min-width: 0; overflow: hidden; white-space: nowrap; font-size: 14px; font-weight: 700; line-height: 1.5; }
.reveal-button__label > span::after { content: ''; display: inline-block; width: 24px; }
.reveal-button:focus-visible .reveal-button__label, .reveal-button.is-preview .reveal-button__label { grid-template-columns: 1fr; opacity: 1; }
.reveal-button:active:not(:disabled) .reveal-button__front { filter: brightness(.88); }
.reveal-button:disabled { opacity: .35; cursor: not-allowed; }
.reveal-button--layers { --control-radius: 17px; }
.reveal-button__back { z-index: -2; background: var(--kit-red); transition: transform var(--kit-duration) var(--kit-ease); }
.reveal-button--layers:focus-visible .reveal-button__back, .reveal-button--layers.is-preview .reveal-button__back { transform: translate(7px, -7px) rotate(-9deg); }
@media (hover: hover) and (pointer: fine) {
  .reveal-button:hover:not(:disabled) .reveal-button__label { grid-template-columns: 1fr; opacity: 1; }
  .reveal-button--layers:hover:not(:disabled) .reveal-button__back { transform: translate(7px, -7px) rotate(-9deg); }
}
@media (hover: none), (pointer: coarse) {
  .reveal-button__label { grid-template-columns: 1fr; opacity: 1; }
  .reveal-button--layers .reveal-button__back { transform: translate(4px, -4px) rotate(-5deg); }
}
@media (prefers-reduced-motion: reduce) {
  .reveal-button__label, .reveal-button__front, .reveal-button__back { transition: none; }
}
</style>
