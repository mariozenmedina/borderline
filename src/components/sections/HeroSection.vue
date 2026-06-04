<template>
    <section class="panel hero-section" data-scene="hero" aria-labelledby="brand-title">
        <div class="hero-section__brand-lockup">
            <h1 id="brand-title" class="brand-mark" aria-label="Borderline.Dev">
                <span class="brand-name">borderline</span><br>
                <span class="brand-extension"><span class="brand-dot">.</span><span>dev</span><span
                        class="brand-dot">.</span><span>br</span></span>
            </h1>
            <h2 class="hero-subtitle">{{ content.subtitle }}</h2>
        </div>
    </section>
</template>

<script>
export default {
    name: 'HeroSection',
    props: {
        content: {
            type: Object,
            required: true
        }
    }
}
</script>
