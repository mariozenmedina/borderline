<template>
  <div id="kit-top" class="design-kit" :data-kit-theme="theme">
    <a class="kit-skip" href="#kit-content">{{ copy.skip }}</a>
    <header class="kit-header kit-shell">
      <a href="#kit-top" class="kit-wordmark" aria-label="Borderline.Dev">borderline<b>.</b>dev</a>
      <div class="kit-header-tools">
        <span class="kit-meta">{{ copy.edition }}</span>
        <nav class="kit-locales" :aria-label="copy.language">
          <a v-for="option in languageOptions" :key="option.code" :href="option.href" :hreflang="option.hreflang"
            :lang="option.lang" :aria-current="locale === option.code ? 'page' : undefined"
            @click="selectLocale(option.code, $event)">{{ option.code.toUpperCase() }}</a>
        </nav>
        <button class="kit-theme" type="button" :aria-label="theme === 'light' ? copy.themeDark : copy.themeLight" @click="$emit('toggle-theme')">
          <component :is="theme === 'light' ? PhMoonStars : PhSun" :size="20" weight="duotone" aria-hidden="true" />
          <span>{{ theme === 'light' ? copy.light : copy.dark }}</span>
        </button>
      </div>
    </header>

    <main id="kit-content" class="kit-shell" tabindex="-1">
      <div class="kit-intro">
        <div><p class="kit-meta">{{ copy.eyebrow }}</p><h1>{{ copy.titleLine1 }}<br>{{ copy.titleLine2 }}<span class="kit-dot" aria-hidden="true"></span></h1></div>
        <p class="kit-copy">{{ copy.intro }}</p>
      </div>
      <nav class="kit-nav" :aria-label="copy.skip">
        <DotLink v-for="(id, index) in sectionIds" :key="id" :href="`#${id}`">{{ copy.nav[index] }}</DotLink>
      </nav>

      <section id="kit-color" class="kit-section" aria-labelledby="kit-color-title" tabindex="-1">
        <div class="kit-section-heading"><h2 id="kit-color-title"><span>01</span>{{ copy.paletteTitle }}</h2><p class="kit-meta">{{ copy.paletteMeta }}</p></div>
        <div class="kit-palette">
          <div v-for="(color, index) in colors" :key="color" class="kit-swatch">
            <div class="kit-swatch-color" :style="{ background: color }"></div>
            <div class="kit-swatch-label"><b>{{ copy.colors[index] }}</b><code>{{ color }}</code></div>
          </div>
        </div>
        <p class="kit-caption kit-palette-note">{{ copy.paletteNote }}</p>
      </section>

      <section id="kit-type" class="kit-section" aria-labelledby="kit-type-title" tabindex="-1">
        <div class="kit-section-heading"><h2 id="kit-type-title"><span>02</span>{{ copy.typeTitle }}</h2><p class="kit-meta">{{ copy.typeMeta }}</p></div>
        <div class="kit-type-row"><span class="kit-meta">{{ copy.typeLabels[0] }}</span><p class="kit-type-display">{{ copy.typeDisplay }}<span class="kit-dot" aria-hidden="true"></span></p></div>
        <div class="kit-type-row"><span class="kit-meta">{{ copy.typeLabels[1] }}</span><p class="kit-type-heading">{{ copy.typeHeading }}</p></div>
        <div class="kit-type-row"><span class="kit-meta">{{ copy.typeLabels[2] }}</span><p class="kit-type-subheading">{{ copy.typeSubheading }}</p></div>
        <div class="kit-type-row"><span class="kit-meta">{{ copy.typeLabels[3] }}</span><p class="kit-type-body">{{ copy.typeBody }}</p></div>
        <div class="kit-type-row"><span class="kit-meta">{{ copy.typeLabels[4] }}</span><p class="kit-meta">{{ copy.typeSupport }}</p></div>
      </section>

      <section id="kit-links" class="kit-section" aria-labelledby="kit-links-title" tabindex="-1">
        <div class="kit-section-heading"><h2 id="kit-links-title"><span>03</span>{{ copy.linksTitle }}</h2><p class="kit-meta">{{ copy.linksMeta }}</p></div>
        <div class="kit-stage">
          <div v-for="tone in ['light', 'dark']" :key="tone" class="kit-panel" :data-kit-tone="tone">
            <p class="kit-meta">{{ tone === 'light' ? copy.onLight : copy.onDark }}</p>
            <div class="kit-link-samples">
              <DotLink href="#kit-white-label">{{ copy.linkLabel }}</DotLink>
              <DotLink href="#kit-icons" tone="accent">{{ copy.linkAccent }}</DotLink>
              <DotLink href="#kit-composition" preview>{{ copy.linkExpanded }}</DotLink>
            </div>
            <p class="kit-caption">{{ copy.linksNote }}</p>
          </div>
        </div>
      </section>

      <section id="kit-buttons" class="kit-section" aria-labelledby="kit-buttons-title" tabindex="-1">
        <div class="kit-section-heading"><h2 id="kit-buttons-title"><span>04</span>{{ copy.buttonsTitle }}</h2><p class="kit-meta">{{ copy.buttonsMeta }}</p></div>
        <div class="kit-controls">
          <label class="kit-preview-toggle"><input v-model="previewOpen" type="checkbox">{{ copy.preview }}</label>
          <p class="kit-caption" style="margin-top: 0">{{ copy.buttonsHint }}</p>
        </div>
        <div class="kit-button-studies">
          <article class="kit-button-study">
            <h3>{{ copy.roundTitle }}</h3><p class="kit-caption">{{ copy.roundNote }}</p>
            <div class="kit-button-row">
              <div class="kit-button-slot"><RevealButton :label="copy.contact" tone="accent" :preview="previewOpen" @click="demonstrate('contact')"><PhChatCircleDots weight="duotone" /></RevealButton><small>{{ copy.primary }}</small></div>
              <div class="kit-button-slot"><RevealButton :label="copy.explore" :preview="previewOpen" @click="demonstrate('explore')"><PhArrowUpRight weight="bold" /></RevealButton><small>{{ copy.neutral }}</small></div>
              <div class="kit-button-slot"><RevealButton :label="copy.reset" tone="outline" :preview="previewOpen" @click="resetSamples"><PhArrowCounterClockwise weight="bold" /></RevealButton><small>{{ copy.outline }}</small></div>
            </div>
          </article>
          <article class="kit-button-study">
            <h3>{{ copy.layerTitle }}</h3><p class="kit-caption">{{ copy.layerNote }}</p>
            <div class="kit-button-row">
              <div class="kit-button-slot"><RevealButton :label="copy.operation" layers :preview="previewOpen" @click="demonstrate('operation')"><PhStack weight="duotone" /></RevealButton><small>{{ copy.layers }}</small></div>
              <div class="kit-button-slot"><RevealButton :label="copy.explore" layers tone="outline" :preview="previewOpen" @click="demonstrate('explore')"><PhCube weight="duotone" /></RevealButton><small>{{ copy.outline }}</small></div>
            </div>
          </article>
        </div>
        <div class="kit-button-disabled"><RevealButton :label="copy.disabled" disabled><PhArrowUpRight weight="bold" /></RevealButton><p>{{ copy.disabledNote }}</p></div>
        <p class="kit-status" role="status" aria-live="polite" aria-atomic="true">{{ actionKey ? `${copy.statusAction} ${copy[actionKey]} · ${actionCount} ${copy.statusCount}` : copy.statusIdle }}</p>

        <div id="kit-white-label" class="kit-white-label" tabindex="-1">
          <div><h3>{{ copy.whiteLabelTitle }}</h3><p class="kit-copy">{{ copy.whiteLabelCopy }}</p></div>
          <div class="kit-layer-stage">
            <button class="kit-layer-sample" type="button" :aria-label="copy.layerToggle" :aria-pressed="layersOpen" @click="layersOpen = !layersOpen">
              <span class="kit-layer-back" aria-hidden="true"><PhStack :size="16" weight="duotone" />{{ copy.team }}</span>
              <span class="kit-layer-front" aria-hidden="true"><small>{{ copy.agencyCaption }}</small><strong>{{ copy.agency }}<span class="kit-dot"></span></strong><PhArrowUpRight :size="22" /></span>
            </button>
          </div>
        </div>
        <p class="kit-caption"><a class="kit-reference-link" href="https://uiverse.io/vinodjangid07/great-ape-33" target="_blank" rel="noopener noreferrer">{{ copy.layerReference }} ↗</a></p>
      </section>

      <section id="kit-icons" class="kit-section" aria-labelledby="kit-icons-title" tabindex="-1">
        <div class="kit-section-heading"><h2 id="kit-icons-title"><span>05</span>{{ copy.iconsTitle }}</h2><p class="kit-meta">{{ copy.iconsMeta }}</p></div>
        <p class="kit-copy">{{ copy.iconsIntro }}</p>
        <fieldset class="kit-icon-weights"><legend>{{ copy.iconWeight }}</legend>
          <label v-for="(weight, index) in weights" :key="weight"><input v-model="iconWeight" type="radio" name="icon-weight" :value="weight"><span>{{ copy.weights[index] }}</span></label>
        </fieldset>
        <div class="kit-icon-grid">
          <div v-for="(icon, index) in serviceIcons" :key="index" class="kit-icon-item"><component :is="icon" :size="44" :weight="iconWeight" aria-hidden="true" /><span>{{ copy.iconNames[index] }}</span></div>
        </div>
        <div class="kit-references">
          <article v-for="reference in copy.references" :key="reference.name"><h3>{{ reference.name }}</h3><p class="kit-copy">{{ reference.description }}</p><DotLink :href="reference.href" external target="_blank" rel="noopener noreferrer">{{ reference.label }}</DotLink></article>
        </div>
        <p class="kit-caption">{{ copy.iconNote }}</p>
      </section>

      <section id="kit-composition" class="kit-section" aria-labelledby="kit-composition-title" tabindex="-1">
        <div class="kit-section-heading"><h2 id="kit-composition-title"><span>06</span>{{ copy.compositionTitle }}</h2><p class="kit-meta">{{ copy.compositionMeta }}</p></div>
        <div class="kit-stage">
          <article v-for="tone in ['light', 'dark']" :key="tone" class="kit-composition" :data-kit-tone="tone">
            <p class="kit-meta">{{ copy.compositionEyebrow }}</p><h3>{{ copy.compositionHeading }}<span class="kit-dot" aria-hidden="true"></span></h3>
            <p class="kit-copy">{{ copy.compositionCopy }}</p>
            <div class="kit-composition-actions">
              <RevealButton :label="copy.contact" tone="accent" :preview="previewOpen" @click="demonstrate('contact')"><PhChatCircleDots weight="duotone" /></RevealButton>
              <DotLink href="#kit-white-label">{{ copy.compositionLink }}</DotLink>
            </div>
          </article>
        </div>
        <p class="kit-status">{{ actionKey ? `${copy.statusAction} ${copy[actionKey]} · ${actionCount} ${copy.statusCount}` : copy.statusIdle }}</p>
      </section>
    </main>
    <footer class="kit-footer kit-shell"><p class="kit-meta">{{ copy.footer }}</p><DotLink :href="heroHref">{{ copy.previous }}</DotLink><DotLink href="#kit-top">{{ copy.top }}</DotLink></footer>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { PhMoonStars, PhSun, PhChatCircleDots, PhArrowUpRight, PhArrowCounterClockwise, PhStack, PhBrowser, PhCube, PhGameController, PhChartLineUp, PhNetwork, PhPlugsConnected } from '@phosphor-icons/vue'
import { getMediakitContent } from '../i18n/mediakitContent.mjs'
import DotLink from './design/DotLink.vue'
import RevealButton from './design/RevealButton.vue'

const props = defineProps({
  locale: { type: String, required: true }, theme: { type: String, required: true },
  languageOptions: { type: Array, required: true }, heroHref: { type: String, required: true },
})
const emit = defineEmits(['change-locale', 'toggle-theme'])
const copy = computed(() => getMediakitContent(props.locale))
const colors = ['#111111', '#E50914', '#FFFFFF', '#F5F5F5', '#8A8A8A', '#333333']
const sectionIds = ['kit-color', 'kit-type', 'kit-links', 'kit-buttons', 'kit-icons', 'kit-composition']
const serviceIcons = [PhBrowser, PhCube, PhGameController, PhChartLineUp, PhNetwork, PhPlugsConnected]
const weights = ['duotone', 'regular', 'fill']
const previewOpen = ref(false)
const layersOpen = ref(false)
const iconWeight = ref('duotone')
const actionKey = ref('')
const actionCount = ref(0)
function demonstrate(key) { actionKey.value = key; actionCount.value += 1 }
function resetSamples() { previewOpen.value = false; layersOpen.value = false; iconWeight.value = 'duotone'; actionKey.value = ''; actionCount.value = 0 }
function selectLocale(locale, event) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return
  event.preventDefault()
  emit('change-locale', locale)
}
onMounted(() => { document.getElementById(window.location.hash.slice(1))?.scrollIntoView({ behavior: 'instant' }) })
</script>

<style lang="less" src="../styles/mediakit.less"></style>
<style scoped>
.kit-reference-link { color: inherit; text-underline-offset: 4px; }
</style>
