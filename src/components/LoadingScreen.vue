<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'

// Props para controlar el estado de carga desde el componente padre
const props = defineProps({
  onLoadingComplete: {
    type: Function,
    required: true,
  },
})

// Estado interno del componente
const isVisible = ref(true)

onMounted(() => {
  // Loading screen animation
  const loadingTl = gsap.timeline()
  loadingTl
    .to('.loading-screen__progress-fill', {
      width: '100%',
      duration: 2,
      ease: 'power2.out'
    })
    .to('.loading-screen__text', {
      opacity: 0,
      y: -20,
      duration: 0.5,
      ease: 'power2.inOut'
    }, '-=0.5')
    .to('.loading-screen', {
      opacity: 0,
      duration: 0.8,
      ease: 'power2.inOut',
      onComplete: () => {
        isVisible.value = false
        props.onLoadingComplete()
      }
    })
})
</script>

<template>
  <div v-if="isVisible" class="loading-screen">
    <div class="loading-screen__content">
      <div class="loading-screen__logo">
        <i class="fas fa-birthday-cake"></i>
      </div>
      <div class="loading-screen__text">Nicole Pastry Arts</div>
      <div class="loading-screen__progress">
        <div class="loading-screen__progress-fill"></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// Loading Screen Styles
.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, $purple-primary 0%, $purple-dark 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;

  &__content {
    text-align: center;
    color: $white;
  }

  &__logo {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.9;

    i {
      animation: pulse 2s ease-in-out infinite;
    }
  }

  &__text {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 2rem;
    letter-spacing: 2px;
  }

  &__progress {
    width: 200px;
    height: 4px;
    background: rgba($white, 0.2);
    border-radius: 2px;
    overflow: hidden;
    margin: 0 auto;
  }

  &__progress-fill {
    width: 0%;
    height: 100%;
    background: $white;
    border-radius: 2px;
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.9;
  }

  50% {
    opacity: 0.6;
  }
}
</style>