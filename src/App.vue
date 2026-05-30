<template>
  <SceneBackdrop />

  <main ref="shell" class="site-shell" data-scene-root>
    <HeroSection />
    <AboutSection />
    <Service01Section />
    <Service02Section />
    <Service03Section />
    <Service04Section />
  </main>
</template>

<script>
import SceneBackdrop from './components/SceneBackdrop.vue'
import HeroSection from './components/sections/HeroSection.vue'
import AboutSection from './components/sections/AboutSection.vue'
import Service01Section from './components/sections/Service01Section.vue'
import Service02Section from './components/sections/Service02Section.vue'
import Service03Section from './components/sections/Service03Section.vue'
import Service04Section from './components/sections/Service04Section.vue'

export default {
  name: 'App',
  components: {
    SceneBackdrop,
    HeroSection,
    AboutSection,
    Service01Section,
    Service02Section,
    Service03Section,
    Service04Section
  }
}
</script>

<style lang="less" src="./styles/App.less"></style>
