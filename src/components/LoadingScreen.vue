<template>
    <div class="loading-screen" :class="{ 'loading-screen--leaving': leaving }" aria-live="polite">
        <div class="loading-screen__mark" aria-hidden="true">
            <span class="loading-screen__plane loading-screen__plane--front"></span>
            <span class="loading-screen__plane loading-screen__plane--back"></span>
            <span class="loading-screen__plane loading-screen__plane--core"></span>
        </div>
        <div class="loading-screen__content">
            <p class="loading-screen__brand">borderline<span>.</span></p>
            <p class="loading-screen__progress">{{ normalizedProgress }}%</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'LoadingScreen',
    props: {
        leaving: {
            type: Boolean,
            default: false
        },
        progress: {
            type: Number,
            default: 0
        }
    },
    computed: {
        normalizedProgress() {
            return Math.max(0, Math.min(100, Math.round(this.progress)))
        }
    }
}
</script>
