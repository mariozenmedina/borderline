<template>
  <section class="panel editorial-section editorial-section--right" data-scene="service-03" aria-labelledby="service-03-title">
    <div class="section-intro editorial-section__intro">
      <p class="section-kicker">{{ content.kicker }}</p>
      <h2 id="service-03-title" class="section-title">{{ content.title }}<span>.</span></h2>
      <p class="section-text">{{ content.text }}</p>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Service03Section',
  props: {
    content: {
      type: Object,
      required: true
    }
  }
}
</script>
