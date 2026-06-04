<template>
  <section class="panel how-we-work-section" data-scene="how-we-work" aria-labelledby="how-we-work-title">
    <div class="section-intro how-we-work-section__intro">
      <p class="section-kicker">{{ content.kicker }}</p>
      <h2 id="how-we-work-title" class="section-title">{{ content.title }}<span>.</span></h2>
    </div>

    <ol class="process-steps" :aria-label="content.stepsLabel">
      <li v-for="step in content.steps" :key="step.title" class="process-step">
        <span class="process-step__number" aria-hidden="true">{{ step.number }}</span>
        <div class="process-step__content">
          <h3>{{ step.title }}</h3>
          <p>{{ step.text }}</p>
        </div>
      </li>
    </ol>
  </section>
</template>

<script>
export default {
  name: 'HowWeWorkSection',
  props: {
    content: {
      type: Object,
      required: true
    }
  }
}
</script>
