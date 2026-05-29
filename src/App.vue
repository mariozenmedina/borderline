<template>
  <SceneBackdrop />

  <main ref="shell" class="site-shell" data-scene-root>
    <HeroSection />
    <AboutSection />
  </main>
</template>

<script>
import SceneBackdrop from './components/SceneBackdrop.vue'
import HeroSection from './components/sections/HeroSection.vue'
import AboutSection from './components/sections/AboutSection.vue'

export default {
  name: 'App',
  components: {
    SceneBackdrop,
    HeroSection,
    AboutSection
  }
}
</script>

<style lang="less" src="./styles/App.less"></style>
