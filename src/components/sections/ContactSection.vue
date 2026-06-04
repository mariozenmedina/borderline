<template>
  <section class="panel contact-section" data-scene="contact" aria-labelledby="contact-title">
    <div class="section-intro contact-section__intro">
      <p class="section-kicker">{{ content.kicker }}</p>
      <h2 id="contact-title" class="section-title">{{ content.title }}<span>.</span></h2>
      <p class="section-text">{{ content.text }}</p>
      <p class="section-text contact-section__followup">{{ content.followup }}</p>

      <a
        class="linkedin-profile-link"
        href="https://www.linkedin.com/in/mariovmedina/"
        target="_blank"
        rel="noopener noreferrer"
        :aria-label="content.linkAriaLabel"
      >
        <span class="linkedin-profile-link__mark" aria-hidden="true">in</span>
        <span>{{ content.linkLabel }}</span>
      </a>
    </div>

    <ul class="contact-section__reasons" :aria-label="content.reasonsLabel">
      <li v-for="reason in content.reasons" :key="reason">{{ reason }}</li>
    </ul>
  </section>
</template>

<script>
export default {
  name: 'ContactSection',
  props: {
    content: {
      type: Object,
      required: true
    }
  }
}
</script>
