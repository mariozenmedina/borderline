<template>
  <SceneBackdrop :active-scene="activeScene" />

  <main ref="shell" class="site-shell">
    <section class="panel hero" data-scene="hero" aria-labelledby="brand-title">
      <h1 id="brand-title" class="brand-mark" aria-label="Borderline.Dev">
        <span class="brand-name">Borderline</span><span class="brand-extension"><span class="brand-dot">.</span><span>Dev</span></span>
      </h1>
    </section>
    <section class="panel about" data-scene="about" aria-labelledby="about-title">
      <div class="section-copy">
        <p class="section-kicker">Sobre a Borderline.Dev</p>
        <h2 id="about-title">Desenvolvimento premium para agências.</h2>
        <p>
          Atuamos como um time técnico integrado à sua operação, assumindo projetos aprovados,
          manutenções mensais e entregas B2B com alto padrão, discrição e fôlego para cronogramas apertados.
        </p>
      </div>
    </section>
  </main>
</template>

<script>
import SceneBackdrop from './components/SceneBackdrop.vue'

export default {
  name: 'App',
  components: {
    SceneBackdrop
  },
  data() {
    return {
      activeScene: 'hero',
      sectionVisibility: {}
    }
  },
  mounted() {
    this.observeSections()
  },
  beforeUnmount() {
    this.sectionObserver?.disconnect()
  },
  methods: {
    observeSections() {
      const shell = this.$refs.shell
      const sections = shell.querySelectorAll('[data-scene]')

      this.sectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            this.sectionVisibility[entry.target.dataset.scene] = entry.intersectionRatio
          })

          const [nextScene] = Object.entries(this.sectionVisibility)
            .sort((a, b) => b[1] - a[1])[0] || ['hero']

          this.activeScene = nextScene
        },
        {
          root: shell,
          threshold: [0, 0.2, 0.4, 0.6, 0.8, 1]
        }
      )

      sections.forEach((section) => {
        this.sectionVisibility[section.dataset.scene] = 0
        this.sectionObserver.observe(section)
      })
    }
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
  height: 100%;
  min-height: 100%;
  margin: 0;
}

body {
  height: 100%;
  overflow: hidden;
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
  height: 100vh;
  height: 100svh;
  overflow-x: hidden;
  overflow-y: auto;
  scroll-snap-type: y mandatory;
  overscroll-behavior-y: contain;

  .panel {
    display: grid;
    width: 100%;
    min-height: 100vh;
    min-height: 100svh;
    overflow: hidden;
    padding: 28px;
    background: transparent;
    scroll-snap-align: start;
    scroll-snap-stop: always;
  }

  .hero {
    align-items: end;
    justify-items: center;

    .brand-mark {
      align-self: end;
      position: relative;
      margin: 0;
      color: @white;
      font-family: 'Offside', Arial, Helvetica, sans-serif;
      font-size: clamp(2rem, 13vw, 3.25rem);
      font-weight: 400;
      line-height: 1;
      letter-spacing: 0;
      text-align: center;
      text-rendering: geometricPrecision;
      text-shadow: 0 0 18px fade(@black, 82%), 0 0 48px fade(@black, 72%);
      white-space: normal;

      .brand-name,
      .brand-extension {
        display: block;
      }

      .brand-dot {
        color: @red;
      }
    }
  }

  .about {
    align-items: end;
    justify-items: center;

    .section-copy {
      width: min(620px, 100%);
      margin: 0 0 clamp(38px, 7vh, 68px);
      text-shadow: 0 0 22px fade(@black, 88%), 0 0 54px fade(@black, 76%);

      .section-kicker {
        margin: 0 0 18px;
        color: @red;
        font-size: clamp(0.72rem, 1.1vw, 0.88rem);
        font-weight: 700;
        letter-spacing: 0.12em;
        text-transform: uppercase;
      }

      h2 {
        max-width: 100%;
        margin: 0;
        font-family: 'Offside', Arial, Helvetica, sans-serif;
        font-size: clamp(2rem, 10vw, 2.55rem);
        font-weight: 400;
        line-height: 1;
        letter-spacing: 0;
      }

      p:last-child {
        max-width: 560px;
        margin: clamp(20px, 3vw, 32px) 0 0;
        color: fade(@white, 82%);
        font-size: clamp(1rem, 1.45vw, 1.28rem);
        line-height: 1.55;
      }
    }
  }

  @media (min-width: 421px) {
    .hero {
      .brand-mark {
        font-size: clamp(2.75rem, 14vw, 3.8rem);
      }
    }
  }

  @media (min-width: 721px) {
    .panel {
      padding: clamp(24px, 6vw, 72px);
    }

    .hero {
      .brand-mark {
        font-size: clamp(2.35rem, 8vw, 7.5rem);
        white-space: nowrap;

        .brand-name,
        .brand-extension {
          display: inline;
        }
      }
    }

    .about {
      .section-copy {
        margin-bottom: clamp(34px, 7vh, 76px);

        h2 {
          max-width: 13ch;
          font-size: clamp(2.2rem, 4.4vw, 4.35rem);
        }
      }
    }
  }
}
</style>
