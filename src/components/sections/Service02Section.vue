<template>
  <section class="panel editorial-section editorial-section--left" data-scene="service-02" aria-labelledby="service-02-title">
    <div class="section-intro editorial-section__intro">
      <p class="section-kicker">{{ content.kicker }}</p>
      <h2 id="service-02-title" class="section-title">{{ content.title }}<span>.</span></h2>
      <p class="section-text">{{ content.text }}</p>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Service02Section',
  props: {
    content: {
      type: Object,
      required: true
    }
  }
}
</script>
