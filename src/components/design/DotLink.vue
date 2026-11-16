<template>
  <a :href="href" class="dot-link" :class="[`dot-link--${tone}`, { 'is-preview': preview }]">
    <span class="dot-link__surface" aria-hidden="true"></span>
    <span class="dot-link__text"><slot /></span>
    <span v-if="external" class="dot-link__arrow" aria-hidden="true">↗</span>
  </a>
</template>

<script setup>
defineProps({
  href: { type: String, required: true },
  tone: { type: String, default: 'ink' },
  external: Boolean,
  preview: Boolean,
})
</script>

<style lang="less" scoped>
.dot-link {
  position: relative; isolation: isolate; display: inline-flex; align-items: center; gap: 14px;
  min-height: 44px; padding: 10px 20px; max-width: 100%;
  color: var(--kit-ink); text-decoration: none; font-family: var(--kit-font-accent); font-size: 14px; font-weight: 400; line-height: 1.5;
  border-radius: 999px; transition: color var(--kit-duration) var(--kit-ease);
}
.dot-link--accent { color: var(--kit-link); }
.dot-link__surface {
  position: absolute; z-index: -1; right: 0; top: 50%; width: 8px; height: 8px;
  transform: translateY(-50%); background: var(--kit-red); border-radius: 999px;
  transition: width var(--kit-duration) var(--kit-ease), height var(--kit-duration) var(--kit-ease), background var(--kit-duration);
}
.dot-link__text { position: relative; }
.dot-link__arrow { flex: none; font-size: 18px; }
.dot-link:focus-visible, .dot-link.is-preview { color: #fff; }
.dot-link:focus-visible .dot-link__surface, .dot-link.is-preview .dot-link__surface { width: 100%; height: 100%; background: var(--kit-action); }
@media (hover: hover) and (pointer: fine) {
  .dot-link:hover { color: #fff; }
  .dot-link:hover .dot-link__surface { width: 100%; height: 100%; background: var(--kit-action); }
}
@media (prefers-reduced-motion: reduce) { .dot-link, .dot-link__surface { transition: none; } }
</style>
