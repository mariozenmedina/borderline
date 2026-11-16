<template>
  <MediakitPage v-if="isMediakit" :locale="locale" :theme="theme" :language-options="languageOptions" :hero-href="getLocalePath(locale)" @change-locale="setLocale" @toggle-theme="toggleTheme" />
  <template v-else>
  <SiteHeader :content="heroContent.nav" :locale="locale" :theme="theme" :language-options="languageOptions" @change-locale="setLocale" @toggle-theme="toggleTheme" />
  <main id="conteudo" tabindex="-1">
    <HeroSection :content="heroContent.hero" />
    <section id="capacidades" class="continuation" data-tone="dark" aria-labelledby="about-title" tabindex="-1">
      <div class="content-shell">
        <AboutSection :content="content.about" />
        <div class="services-grid">
          <Service01Section :content="content.service01" />
          <Service02Section :content="content.service02" />
          <Service03Section :content="content.service03" />
          <Service04Section :content="content.service04" />
        </div>
      </div>
    </section>
    <div id="parceria" class="content-shell partnership-content" tabindex="-1"><HowWeWorkSection :content="content.howWeWork" /></div>
    <div id="contato" class="contact-content" tabindex="-1"><div class="content-shell"><ContactSection :content="content.contact" /></div></div>
    <footer class="site-footer content-shell"><span class="footer-brand">borderline<span>.</span>dev</span><EndSection :content="content.end" /></footer>
  </main>
  </template>
</template>

<script setup>
import { computed, defineAsyncComponent, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import SiteHeader from './components/SiteHeader.vue'
import HeroSection from './components/sections/HeroSection.vue'
import AboutSection from './components/sections/AboutSection.vue'
import Service01Section from './components/sections/Service01Section.vue'
import Service02Section from './components/sections/Service02Section.vue'
import Service03Section from './components/sections/Service03Section.vue'
import Service04Section from './components/sections/Service04Section.vue'
import HowWeWorkSection from './components/sections/HowWeWorkSection.vue'
import ContactSection from './components/sections/ContactSection.vue'
import EndSection from './components/sections/EndSection.vue'
import { LOCALES, getLocaleFromPath, getLocalePath, getMessages, updateDocumentSeo } from './i18n/siteContent.mjs'
import { getHeroContent } from './i18n/heroContent.mjs'
import { getMediakitContent } from './i18n/mediakitContent.mjs'
import { applyTheme, normalizeTheme, THEME_STORAGE_KEY } from './theme.mjs'

const locale = ref(getLocaleFromPath(window.location.pathname))
const theme = ref(normalizeTheme(document.documentElement.dataset.theme))
const locationSuffix = ref(window.location.search + window.location.hash)
const isMediakit = computed(() => new URLSearchParams(locationSuffix.value.split('#')[0]).get('view') === 'mediakit')
const MediakitPage = defineAsyncComponent(() => import('./components/MediakitPage.vue'))
const content = computed(() => getMessages(locale.value))
const heroContent = computed(() => getHeroContent(locale.value))
const languageOptions = computed(() => LOCALES.map(option => ({ ...option, href: getLocalePath(option.code) + locationSuffix.value })))

function setLocale(value) {
  const path = getLocalePath(value)
  if (locale.value === value && window.location.pathname === path) return
  window.history.pushState({ locale: value }, '', path + window.location.search + window.location.hash)
  locale.value = value
  locationSuffix.value = window.location.search + window.location.hash
}
function syncLocation() {
  locale.value = getLocaleFromPath(window.location.pathname)
  locationSuffix.value = window.location.search + window.location.hash
}
function toggleTheme() { theme.value = applyTheme(theme.value === 'light' ? 'dark' : 'light', { persist: true }) }
function syncTheme(event) {
  if (event.key === THEME_STORAGE_KEY || event.key === null) theme.value = applyTheme(event.newValue)
}
watch([locale, isMediakit], () => {
  document.documentElement.dataset.view = isMediakit.value ? 'mediakit' : 'site'
  updateDocumentSeo(locale.value)
  if (isMediakit.value) {
    document.title = getMediakitContent(locale.value).title
    for (const name of ['robots', 'googlebot']) document.querySelector(`meta[name="${name}"]`)?.setAttribute('content', 'noindex, nofollow')
  }
  applyTheme(theme.value)
}, { immediate: true })

onMounted(() => {
  window.addEventListener('popstate', syncLocation)
  window.addEventListener('hashchange', syncLocation)
  window.addEventListener('storage', syncTheme)
  // Os destinos existem sincronamente; corrige a chegada direta após montar o Vue.
  const target = document.getElementById(window.location.hash.slice(1))
  target?.scrollIntoView({ behavior: 'instant' })
})
onBeforeUnmount(() => {
  window.removeEventListener('popstate', syncLocation)
  window.removeEventListener('hashchange', syncLocation)
  window.removeEventListener('storage', syncTheme)
})
</script>

<style lang="less" src="./styles/site.less"></style>
