<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Props para controlar el estado de carga desde el componente padre
const props = defineProps({
  onLoadingComplete: {
    type: Function,
    required: true,
  },
})

// Estado interno del componente
const isVisible = ref(true)
const isLoading = ref(true)
const showFadeOut = ref(false)

onMounted(() => {
  // Iniciar animación de progreso después de un pequeño delay
  setTimeout(() => {
    isLoading.value = false
  }, 100)

  // Secuencia de animaciones con timeouts
  setTimeout(() => {
    // Después de 2 segundos, comenzar fade out
    showFadeOut.value = true
    
    // Después de la animación de fade out, ocultar completamente
    setTimeout(() => {
      isVisible.value = false
      props.onLoadingComplete()
    }, 800)
  }, 2000)
})
</script>

<template>
  <div 
    v-if="isVisible" 
    class="loading-screen"
    :class="{ 'loading-screen--fade-out': showFadeOut }"
  >
    <div class="loading-screen__content">
      <div class="loading-screen__logo">
        <i class="fas fa-birthday-cake"></i>
      </div>
      <div 
        class="loading-screen__text"
        :class="{ 'loading-screen__text--fade-out': showFadeOut }"
      >
        Nicole Pastry Arts
      </div>
      <div class="loading-screen__progress">
        <div 
          class="loading-screen__progress-fill"
          :class="{ 'loading-screen__progress-fill--complete': !isLoading }"
        ></div>
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
  opacity: 1;
  transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1);

  &--fade-out {
    opacity: 0;
  }

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
    opacity: 1;
    transform: translateY(0);
    transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), 
                transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);

    &--fade-out {
      opacity: 0;
      transform: translateY(-20px);
    }
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
    transition: width 2s cubic-bezier(0.4, 0, 0.2, 1);

    &--complete {
      width: 100%;
    }
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