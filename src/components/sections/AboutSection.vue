<template>
  <section class="panel editorial-section editorial-section--left" data-scene="about" aria-labelledby="about-title">
    <div class="section-intro editorial-section__intro">
      <p class="section-kicker">{{ content.kicker }}</p>
      <h2 id="about-title" class="section-title">{{ content.title }}<span>.</span></h2>
      <p class="section-text">{{ content.text }}</p>
    </div>
  </section>
</template>

<script>
export default {
  name: 'AboutSection',
  props: {
    content: {
      type: Object,
      required: true
    }
  }
}
</script>
