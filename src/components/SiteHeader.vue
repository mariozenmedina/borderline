<template>
  <a class="skip-link" href="#conteudo">{{ content.skip }}</a>
  <header ref="header" class="site-header" @keydown.esc="closeMenu(true)">
    <div class="site-header__inner">
      <a class="wordmark" href="#inicio" :aria-label="content.home" @click="closeMenu()">borderline<span class="wordmark__dot">.</span><span class="wordmark__dev">dev</span></a>
      <nav class="desktop-navigation" :aria-label="content.label">
        <DotLink href="#capacidades">{{ content.capabilities }}</DotLink>
        <DotLink href="#parceria">{{ content.partnership }}</DotLink>
      </nav>
      <div class="header-actions">
        <nav class="locale-switch" :aria-label="content.language">
          <a v-for="option in languageOptions" :key="option.code"
            :href="option.href" :lang="option.lang" :hreflang="option.hreflang"
            :aria-current="locale === option.code ? 'page' : null"
            @click="selectLocale(option.code, $event)"
          >{{ option.label }}</a>
        </nav>
        <span class="header-divider" aria-hidden="true"></span>
        <button class="icon-button theme-toggle" type="button"
          :aria-label="theme === 'light' ? content.dark : content.light"
          :title="theme === 'light' ? content.dark : content.light" @click="$emit('toggle-theme')">
          <svg v-if="theme === 'light'" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 13.1A8.7 8.7 0 0 1 10.9 3.5 8.7 8.7 0 1 0 20.5 13.1Z" /></svg>
          <svg v-else viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
        </button>
        <RevealButton class="header-contact" :label="content.contact" href="#contato" tone="accent"><MotionIcon kind="contact" /></RevealButton>
        <button ref="menuButton" class="icon-button menu-toggle" type="button"
          :aria-expanded="menuOpen" aria-controls="mobile-navigation"
          :aria-label="menuOpen ? content.close : content.open" @click="menuOpen = !menuOpen">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path :d="menuOpen ? 'm6 6 12 12M6 18 18 6' : 'M4 8h16M4 16h16'" /></svg>
        </button>
      </div>
    </div>
    <nav id="mobile-navigation" class="mobile-navigation" :hidden="!menuOpen" :aria-label="content.label">
      <a href="#capacidades" @click="closeMenu()">{{ content.capabilities }} <span aria-hidden="true">↗</span></a>
      <a href="#parceria" @click="closeMenu()">{{ content.partnership }} <span aria-hidden="true">↗</span></a>
      <a href="#contato" @click="closeMenu()">{{ content.contact }} <span aria-hidden="true">↗</span></a>
    </nav>
  </header>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import DotLink from './design/DotLink.vue'
import RevealButton from './design/RevealButton.vue'
import MotionIcon from './design/MotionIcon.vue'
defineProps({
  content: { type: Object, required: true }, locale: { type: String, required: true },
  theme: { type: String, required: true }, languageOptions: { type: Array, required: true }
})
const emit = defineEmits(['change-locale', 'toggle-theme'])
const header = ref(null)
const menuButton = ref(null)
const menuOpen = ref(false)
function closeMenu(restoreFocus = false) {
  if (!menuOpen.value) return
  menuOpen.value = false
  if (restoreFocus) nextTick(() => menuButton.value?.focus())
}
function selectLocale(locale, event) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return
  event.preventDefault()
  closeMenu()
  emit('change-locale', locale)
}
function handleOutside(event) { if (!header.value?.contains(event.target)) closeMenu() }
function handleFocus(event) { if (!header.value?.contains(event.relatedTarget)) closeMenu() }
let desktopQuery
function handleBreakpoint(event) { if (event.matches) closeMenu() }
onMounted(() => {
  document.addEventListener('pointerdown', handleOutside)
  header.value?.addEventListener('focusout', handleFocus)
  desktopQuery = window.matchMedia('(min-width: 961px)')
  desktopQuery.addEventListener('change', handleBreakpoint)
})
onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', handleOutside)
  header.value?.removeEventListener('focusout', handleFocus)
  desktopQuery?.removeEventListener('change', handleBreakpoint)
})
</script>

<style lang="less" scoped>
.skip-link { position: fixed; top: 12px; left: 16px; z-index: 100; padding: 12px 20px; background: var(--ink); color: var(--surface); border-radius: 8px; transform: translateY(-160%); }
.skip-link:focus { transform: translateY(0); }
.site-header { position: sticky; top: 0; z-index: 30; background: var(--header-background); border-bottom: 1px solid var(--line); backdrop-filter: blur(18px); }
.site-header__inner { max-width: 1536px; min-height: 90px; margin: auto; padding: 0 var(--page-gutter); display: flex; align-items: center; gap: 36px; }
.wordmark { font-family: 'Offside', Arial, sans-serif; font-size: 23px; letter-spacing: -1.3px; white-space: nowrap; text-decoration: none; color: var(--ink); }
.wordmark__dot { color: var(--accent); } .wordmark__dev { color: var(--ink); }
.desktop-navigation { display: flex; gap: 8px; margin-left: auto; }
.desktop-navigation :deep(.dot-link) { font-size: 12px; }
.locale-switch a { text-decoration: none; font-size: 13px; font-weight: 500; }
.header-actions { display: flex; align-items: center; gap: 13px; }
.locale-switch { display: flex; align-items: center; gap: 2px; }
.locale-switch a { display: grid; place-items: center; width: 30px; min-height: 40px; color: var(--muted); font-size: 11px; }
.locale-switch a[aria-current] { color: var(--ink); text-decoration: underline; text-underline-offset: 5px; text-decoration-color: var(--accent); }
.header-divider { height: 18px; border-left: 1px solid var(--line); }
.icon-button { width: 40px; height: 40px; display: grid; place-items: center; border: 0; border-radius: 50%; background: transparent; color: var(--ink); cursor: pointer; }
.icon-button:hover { background: var(--surface-alt); }
.icon-button svg { width: 19px; fill: none; stroke: currentColor; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; }
.menu-toggle, .mobile-navigation { display: none; }
@media (max-width: 1120px) { .site-header__inner { gap: 18px; } .desktop-navigation { gap: 0; } .header-actions { gap: 8px; } }
@media (max-width: 960px) {
  .site-header__inner { min-height: 76px; justify-content: space-between; gap: 12px; }
  .desktop-navigation, .header-contact { display: none; } .menu-toggle { display: grid; }
  .mobile-navigation:not([hidden]) { display: grid; padding: 8px var(--page-gutter) 24px; background: var(--surface); border-top: 1px solid var(--line); }
  .mobile-navigation a { display: flex; justify-content: space-between; padding: 18px 0; border-bottom: 1px solid var(--line); text-decoration: none; color: var(--ink); font-family: var(--kit-font-accent); }
}
@media (max-width: 480px) {
  .wordmark { font-size: 18px; letter-spacing: -1px; }
  .header-actions { gap: 2px; } .header-divider { display: none; }
  .icon-button { width: 34px; height: 40px; } .locale-switch a { width: 27px; }
}
</style>
