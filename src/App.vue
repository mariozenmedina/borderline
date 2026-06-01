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

  <main
    ref="shell"
    class="site-shell"
    :class="{ 'site-shell--loading': isLoadingVisible }"
    data-scene-root
  >
    <HeroSection />
    <AboutSection />
    <Service01Section />
    <Service02Section />
    <Service03Section />
    <Service04Section />
    <div class="final-sections-snap-group">
      <HowWeWorkSection />
      <ContactSection />
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

const PUBLIC_BASE_URL = new URL(import.meta.env.BASE_URL || './', window.location.href).href
const LOADING_MIN_DURATION = 1200
const LOADING_EXIT_DURATION = 520
const PRELOAD_TIMEOUT = 6500
const PRELOAD_ASSETS = [
  'models/gltf/facecap.glb',
  'models/obj/oculos.obj',
  'basis_transcoder.wasm',
  'basis_transcoder.js'
]

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
    ContactSection
  },
  data() {
    return {
      isLoadingVisible: true,
      isLoadingLeaving: false,
      loadingProgress: 8,
      sceneBackdropComponent: null,
      sceneBackdropReadyPromise: null,
      resolveSceneBackdropReady: null
    }
  },
  mounted() {
    this.sceneBackdropReadyPromise = new Promise((resolve) => {
      this.resolveSceneBackdropReady = resolve
    })
    this.preloadExperience()
  },
  methods: {
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
