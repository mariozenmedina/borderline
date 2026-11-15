<template>
  <section id="inicio" class="hero-section" aria-labelledby="hero-title" tabindex="-1">
    <div class="hero-layout">
      <div class="hero-copy">
        <p class="hero-eyebrow"><span aria-hidden="true"></span>{{ content.eyebrow }}</p>
        <h1 id="hero-title">
          <span v-for="line in content.headline" :key="line">{{ line }}</span>
          <span v-for="line in content.emphasis" :key="line" class="hero-title__accent">{{ line }}</span>
        </h1>
        <p class="hero-description">{{ content.description }}</p>
        <div class="hero-actions">
          <a class="button-primary" href="#capacidades">{{ content.primary }}<span aria-hidden="true">↗</span></a>
          <a class="hero-secondary" href="#contato">{{ content.secondary }}<span aria-hidden="true">→</span></a>
        </div>
      </div>
      <HeroDelivery :content="content.scene" />
    </div>
    <div class="hero-bottom">
      <dl class="hero-facts"><div v-for="fact in content.facts" :key="fact.title"><dt>{{ fact.title }}</dt><dd>{{ fact.text }}</dd></div></dl>
      <a class="hero-next" href="#capacidades"><span><strong>{{ content.next }}</strong><small>{{ content.nextDetail }}</small></span><span class="hero-next__arrow" aria-hidden="true">↓</span></a>
    </div>
  </section>
</template>

<script setup>
import HeroDelivery from '../HeroDelivery.vue'
defineProps({ content: { type: Object, required: true } })
</script>

<style lang="less" scoped>
.hero-section { max-width: 1536px; margin: auto; padding: 0 var(--page-gutter); scroll-margin-top: 100px; }
.hero-layout { min-height: min(740px, calc(100svh - 185px)); display: grid; grid-template-columns: 0.94fr 1.06fr; align-items: center; gap: 24px; padding: clamp(52px, 6vh, 85px) 0 45px; }
.hero-copy { position: relative; z-index: 2; padding-bottom: 15px; }
.hero-eyebrow { display: flex; align-items: center; gap: 10px; margin: 0 0 30px; font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); }
.hero-eyebrow > span { width: 6px; height: 6px; flex: 0 0 6px; background: var(--accent); border-radius: 50%; }
h1 { font-size: clamp(48px, 4.6vw, 76px); font-weight: 500; letter-spacing: -0.065em; line-height: 1.035; margin: 0; }
h1 > span { display: block; } .hero-title__accent { color: var(--muted-heading); }
.hero-description { max-width: 385px; margin: 28px 0 0; color: var(--muted); font-size: 15px; line-height: 1.8; }
.hero-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 20px 24px; margin-top: 30px; }
.button-primary { display: inline-flex; align-items: center; justify-content: space-between; gap: 25px; min-height: 50px; padding: 14px 20px; background: var(--accent); border: 1px solid transparent; border-radius: 7px; font-size: 12px; font-weight: 600; color: #fff; text-decoration: none; transition: background 180ms ease, transform 180ms ease; }
.button-primary:hover { background: var(--accent-hover); transform: translateY(-2px); }
.button-primary > span { font-size: 19px; font-weight: 400; line-height: 1; }
.hero-secondary { display: inline-flex; align-items: center; gap: 14px; min-height: 44px; color: var(--ink); font-size: 12px; text-decoration: underline; text-decoration-color: var(--line-strong); text-underline-offset: 6px; }
.hero-secondary:hover { text-decoration-color: var(--accent); }
.hero-bottom { display: flex; justify-content: space-between; align-items: center; gap: 30px; padding: 28px 0 34px; border-top: 1px solid var(--line); }
.hero-facts { display: flex; gap: clamp(25px, 4vw, 65px); margin: 0; }
.hero-facts dt { font-size: 12px; font-weight: 600; }
.hero-facts dd { margin: 7px 0 0; font-size: 11px; color: var(--muted); }
.hero-next { display: flex; align-items: center; gap: 24px; text-decoration: none; color: var(--ink); }
.hero-next strong, .hero-next small { display: block; font-weight: 400; }
.hero-next strong { font-size: 12px; } .hero-next small { margin-top: 7px; font-size: 10px; color: var(--muted); }
.hero-next__arrow { display: grid; place-items: center; border: 1px solid var(--line-strong); width: 37px; height: 46px; border-radius: 22px; transition: transform 180ms ease; }
.hero-next:hover .hero-next__arrow { transform: translateY(3px); }
@media (min-width: 1600px) { .hero-layout { min-height: 780px; } }
@media (max-width: 1100px) { h1 { font-size: clamp(42px, 5.2vw, 58px); } .hero-layout { gap: 0; } .hero-next small { display: none; } }
@media (max-width: 800px) {
  .hero-layout { grid-template-columns: 1fr; gap: 16px; padding-top: 48px; padding-bottom: 12px; }
  .hero-copy { max-width: 600px; } h1 { font-size: clamp(48px, 8.5vw, 74px); }
  .hero-description { max-width: 470px; }
  .hero-bottom { align-items: start; flex-direction: column; gap: 25px; }
  .hero-facts { justify-content: space-between; width: 100%; gap: 15px; }
  .hero-next { justify-content: space-between; width: 100%; border-top: 1px solid var(--line); padding-top: 20px; }
  .hero-next small { display: block; }
}
@media (max-width: 380px) { h1 { font-size: 43px; } .hero-eyebrow { font-size: 9px; } .hero-facts { flex-wrap: wrap; gap: 22px; } }
@media (prefers-reduced-motion: reduce) { .button-primary, .hero-next__arrow { transition: none; transform: none !important; } }
</style>
