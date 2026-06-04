<template>
  <section class="end-section" aria-labelledby="end-title">
    <div class="end-section__content">
      <span class="end-section__cursor" aria-hidden="true"></span>
      <p id="end-title" class="end-section__line">{{ content.line }}<span>.</span></p>
    </div>
  </section>
</template>

<script>
export default {
  name: 'EndSection',
  props: {
    content: {
      type: Object,
      required: true
    }
  }
}
</script>
