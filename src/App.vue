<template>
  <component
    :is="sceneBackdropComponent"
    v-if="sceneBackdropComponent"
    @ready="handleSceneBackdropReady"
  />
  <LoadingScreen
    v-if="isLoadingVisible"
    :leaving="isLoadingLeaving"
    :progress="loadingProgress"
  />
  <nav class="language-switcher" :aria-label="content.ui.languageSwitcherLabel">
    <a
      v-for="option in languageOptions"
      :key="option.code"
      class="language-switcher__option"
      :class="{ 'language-switcher__option--active': option.code === locale }"
      :href="option.href"
      :lang="option.lang"
      :hreflang="option.hreflang"
      :aria-current="option.code === locale ? 'page' : null"
      @click="handleLanguageClick(option.code, $event)"
    >
      {{ option.label }}
    </a>
  </nav>

  <main
    ref="shell"
    class="site-shell"
    :class="{ 'site-shell--loading': isLoadingVisible }"
    data-scene-root
  >
    <HeroSection :content="content.hero" />
    <AboutSection :content="content.about" />
    <Service01Section :content="content.service01" />
    <Service02Section :content="content.service02" />
    <Service03Section :content="content.service03" />
    <Service04Section :content="content.service04" />
    <div class="closing-sections">
      <HowWeWorkSection :content="content.howWeWork" />
      <ContactSection :content="content.contact" />
      <EndSection :content="content.end" />
    </div>
  </main>
</template>

<script>
import { markRaw } from 'vue'
import LoadingScreen from './components/LoadingScreen.vue'
import HeroSection from './components/sections/HeroSection.vue'
import AboutSection from './components/sections/AboutSection.vue'
import Service01Section from './components/sections/Service01Section.vue'
import Service02Section from './components/sections/Service02Section.vue'
import Service03Section from './components/sections/Service03Section.vue'
import Service04Section from './components/sections/Service04Section.vue'
import HowWeWorkSection from './components/sections/HowWeWorkSection.vue'
import ContactSection from './components/sections/ContactSection.vue'
import EndSection from './components/sections/EndSection.vue'
import {
  DEFAULT_LOCALE,
  LOCALES,
  getLocaleFromPath,
  getLocalePath,
  getMessages,
  updateDocumentSeo
} from './i18n/siteContent.mjs'

const LOADING_MIN_DURATION = 1200
const LOADING_EXIT_DURATION = 520
const PRELOAD_TIMEOUT = 6500
const PRELOAD_ASSETS = [
  'models/gltf/facecap.glb',
  'models/obj/oculos.obj',
  'basis_transcoder.wasm',
  'basis_transcoder.js'
]

const getPublicBaseUrl = () => {
  const configuredBase = import.meta.env.BASE_URL || '/'

  if (configuredBase === './') {
    const currentPath = window.location.pathname.toLowerCase()
    const relativeBase = currentPath === '/en' || currentPath.startsWith('/en/') ? '../' : './'

    return new URL(relativeBase, window.location.href).href
  }

  return new URL(configuredBase, window.location.origin).href
}

const PUBLIC_BASE_URL = getPublicBaseUrl()
const publicAssetPath = (path) => new URL(path.replace(/^\/+/, ''), PUBLIC_BASE_URL).href
const wait = (duration) => new Promise((resolve) => window.setTimeout(resolve, duration))
const withTimeout = (promise, duration) => Promise.race([promise, wait(duration)])
const waitForWindowLoad = () => new Promise((resolve) => {
  if (document.readyState === 'complete') {
    resolve()
    return
  }

  window.addEventListener('load', resolve, { once: true })
})

export default {
  name: 'App',
  components: {
    LoadingScreen,
    HeroSection,
    AboutSection,
    Service01Section,
    Service02Section,
    Service03Section,
    Service04Section,
    HowWeWorkSection,
    ContactSection,
    EndSection
  },
  data() {
    return {
      locale: getLocaleFromPath(window.location.pathname || DEFAULT_LOCALE),
      isLoadingVisible: true,
      isLoadingLeaving: false,
      loadingProgress: 8,
      sceneBackdropComponent: null,
      sceneBackdropReadyPromise: null,
      resolveSceneBackdropReady: null
    }
  },
  computed: {
    content() {
      return getMessages(this.locale)
    },

    languageOptions() {
      return LOCALES.map((option) => ({
        ...option,
        href: getLocalePath(option.code)
      }))
    }
  },
  created() {
    this.updateLocaleSeo()
    window.addEventListener('popstate', this.handlePopState)
  },
  mounted() {
    this.sceneBackdropReadyPromise = new Promise((resolve) => {
      this.resolveSceneBackdropReady = resolve
    })
    this.preloadExperience()
  },
  beforeUnmount() {
    window.removeEventListener('popstate', this.handlePopState)
  },
  methods: {
    handleLanguageClick(locale, event) {
      if (this.shouldUseNativeNavigation(event)) {
        return
      }

      event.preventDefault()
      this.setLocale(locale)
    },

    shouldUseNativeNavigation(event) {
      return event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.altKey ||
        event.ctrlKey ||
        event.shiftKey
    },

    setLocale(locale) {
      if (locale === this.locale && window.location.pathname === getLocalePath(locale)) {
        return
      }

      this.locale = locale

      const nextPath = getLocalePath(locale)
      const nextUrl = `${nextPath}${window.location.hash || ''}`
      window.history.pushState({ locale }, '', nextUrl)
      this.updateLocaleSeo()
    },

    handlePopState() {
      this.locale = getLocaleFromPath(window.location.pathname)
      this.updateLocaleSeo()
    },

    updateLocaleSeo() {
      updateDocumentSeo(this.locale)
    },

    async preloadExperience() {
      await wait(80)
      this.setLoadingProgress(12)

      await Promise.all([
        this.loadSceneBackdrop(),
        this.preloadAssets(),
        document.fonts?.ready || Promise.resolve(),
        waitForWindowLoad(),
        wait(LOADING_MIN_DURATION)
      ])

      if (!this.isLoadingVisible) {
        return
      }

      this.isLoadingLeaving = true
      this.setLoadingProgress(100)
      window.setTimeout(() => {
        this.isLoadingVisible = false
      }, LOADING_EXIT_DURATION)
    },

    async loadSceneBackdrop() {
      const sceneBackdropModule = await import('./components/SceneBackdrop.vue')
      this.sceneBackdropComponent = markRaw(sceneBackdropModule.default)
      this.setLoadingProgress(35)
      await withTimeout(this.sceneBackdropReadyPromise || Promise.resolve(), PRELOAD_TIMEOUT)
      this.setLoadingProgress(96)
    },

    async preloadAssets() {
      let loadedAssets = 0

      await withTimeout(Promise.all(PRELOAD_ASSETS.map(async (assetPath) => {
        try {
          const response = await fetch(publicAssetPath(assetPath), {
            cache: 'force-cache'
          })

          if (!response.ok) {
            return
          }

          await response.arrayBuffer()
        } catch (error) {
          console.warn(`[Loader] Nao foi possivel pre-carregar ${assetPath}.`, error)
        } finally {
          loadedAssets += 1
          this.setLoadingProgress(35 + (loadedAssets / PRELOAD_ASSETS.length) * 55)
        }
      })), PRELOAD_TIMEOUT)

      this.setLoadingProgress(92)
    },

    setLoadingProgress(progress) {
      this.loadingProgress = Math.max(this.loadingProgress, progress)
    },

    handleSceneBackdropReady() {
      this.resolveSceneBackdropReady?.()
      this.resolveSceneBackdropReady = null
    }
  }
}
</script>

<style lang="less" src="./styles/App.less"></style>
