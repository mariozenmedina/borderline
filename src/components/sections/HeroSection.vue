<template>
  <section id="inicio" class="hero-section" aria-labelledby="hero-title" tabindex="-1">
    <div class="hero-layout">
      <div class="hero-copy">
        <p class="hero-eyebrow">{{ content.eyebrow }}</p>
        <h1 id="hero-title"><span>{{ content.headline }}</span><span>{{ content.emphasis }}<i aria-hidden="true"></i></span></h1>
        <p class="hero-description">{{ content.description }}</p>
        <div class="hero-actions">
          <RevealButton :label="content.primary" href="#capacidades" tone="accent"><MotionIcon kind="layers" /></RevealButton>
          <RevealButton :label="content.secondary" href="#contato" tone="outline"><MotionIcon kind="contact" /></RevealButton>
        </div>
      </div>
      <HeroDelivery :content="content.scene" />
    </div>
    <div class="hero-bottom">
      <dl class="hero-facts"><div v-for="fact in content.facts" :key="fact.title"><dt>{{ fact.title }}</dt><dd>{{ fact.text }}</dd></div></dl>
      <DotLink href="#capacidades">{{ content.next }}</DotLink>
    </div>
  </section>
</template>

<script setup>
import HeroDelivery from '../HeroDelivery.vue'
import RevealButton from '../design/RevealButton.vue'
import DotLink from '../design/DotLink.vue'
import MotionIcon from '../design/MotionIcon.vue'
defineProps({ content: { type: Object, required: true } })
</script>

<style lang="less" scoped>
.hero-section { max-width: 1536px; margin: auto; padding: 0 var(--page-gutter); }
.hero-layout { display: grid; grid-template-columns: .95fr 1.05fr; align-items: center; gap: clamp(30px, 4vw, 64px); padding: 60px 0 48px; min-height: min(780px, calc(100svh - 150px)); }
.hero-copy { min-width: 0; padding-bottom: 25px; }
.hero-eyebrow { margin: 0 0 26px; max-width: 36ch; font: 400 11px/1.8 var(--kit-font-accent); letter-spacing: .09em; text-transform: uppercase; color: var(--muted); }
h1 { margin: 0; font: 600 clamp(40px, 4.25vw, 66px)/1.13 var(--kit-font-body); letter-spacing: -.045em; text-wrap: balance; }
h1 > span { display: block; }
h1 > span + span { margin-top: .12em; }
h1 i { display: inline-block; width: .14em; height: .14em; margin-left: .06em; border-radius: 50%; background: var(--accent); }
.hero-description { max-width: 45ch; margin: 28px 0 0; color: var(--muted); font-size: 15px; line-height: 1.9; }
.hero-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 24px; margin-top: 34px; min-height: 58px; }
.hero-bottom { display: flex; justify-content: space-between; align-items: center; gap: 30px; padding: 28px 0 36px; border-top: 1px solid var(--line); }
.hero-facts { display: flex; flex-wrap: wrap; gap: clamp(22px, 3vw, 50px); margin: 0; }
.hero-facts dt { font: 400 11px/1.7 var(--kit-font-accent); }
.hero-facts dd { margin: 7px 0 0; font-size: 11px; color: var(--muted); }
@media (max-width: 1100px) { .hero-layout { gap: 28px; } .hero-bottom { flex-wrap: wrap; } }
@media (max-width: 900px) {
  .hero-layout { grid-template-columns: 1fr; padding-top: 44px; gap: 32px; }
  .hero-copy { max-width: 650px; padding-bottom: 0; }
  h1 { font-size: clamp(40px, 7vw, 66px); max-width: 18ch; }
  .hero-description { max-width: 53ch; }
  .hero-bottom { align-items: flex-start; }
}
@media (max-width: 480px) { .hero-layout { padding-top: 36px; } h1 { font-size: clamp(35px, 9.8vw, 46px); } .hero-facts { gap: 22px; } }
</style>
