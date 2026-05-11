<template>
  <SceneBackdrop />

  <main class="site-shell">
    <section class="hero" aria-labelledby="brand-title">
      <h1 id="brand-title" class="brand-mark" aria-label="Borderline.Dev">
        <span>Borderline</span><span class="brand-dot">.</span><span>Dev</span>
      </h1>
    </section>
  </main>
</template>

<script>
import SceneBackdrop from './components/SceneBackdrop.vue'

export default {
  name: 'App',
  components: {
    SceneBackdrop
  }
}
</script>

<style lang="less">
@black: #000;
@white: #f5f5f5;
@red: #e50914;

* {
  box-sizing: border-box;
}

html,
body,
#app {
  width: 100%;
  min-width: 320px;
  min-height: 100%;
  margin: 0;
}

body {
  overflow-x: hidden;
  background: @black;
  color: @white;
  font-family: Arial, Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.site-shell {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  min-height: 100svh;
}

.hero {
  display: grid;
  width: 100%;
  min-height: 100vh;
  min-height: 100svh;
  place-items: center;
  overflow: hidden;
  padding: clamp(24px, 6vw, 72px);
  background: transparent;
}

.brand-mark {
  position: relative;
  margin: 0;
  color: @white;
  font-family: 'Offside', Arial, Helvetica, sans-serif;
  font-size: clamp(2.35rem, 8vw, 7.5rem);
  font-weight: 400;
  line-height: 1;
  letter-spacing: 0;
  text-align: center;
  text-rendering: geometricPrecision;
  text-shadow: 0 0 18px fade(@black, 82%), 0 0 48px fade(@black, 72%);
  white-space: nowrap;
}

.brand-dot {
  color: @red;
}

@media (max-width: 420px) {
  .brand-mark {
    font-size: clamp(2rem, 13vw, 3.25rem);
  }
}
</style>
