<script setup lang="ts">
import { ref, provide } from 'vue'
import { RouterView } from 'vue-router'
import AppHeader from '@/components/globals/AppHeader.vue'
import AppFooter from '@/components/globals/AppFooter.vue'

// Estado global de carga
const isAppLoaded = ref(false)

// Función para manejar cuando la carga global termine
const handleGlobalLoadingComplete = () => {
  isAppLoaded.value = true
}

// Proveer el estado y función a todos los componentes hijos
provide('isAppLoaded', isAppLoaded)
provide('handleGlobalLoadingComplete', handleGlobalLoadingComplete)
</script>

<template>
  <div id="app">
    <AppHeader v-show="isAppLoaded" />
    
    <main class="main-content" :class="{ 'main-content--loading': !isAppLoaded }">
      <RouterView />
    </main>

    <AppFooter v-show="isAppLoaded" />
  </div>
</template>

<style lang="scss">
// Reset y estilos globales
* {
  box-sizing: border-box;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding-top: 70px; // Espacio para el header fijo

  @media (min-width: 768px) {
    padding-top: 80px;
  }

  // Cuando está cargando, no necesita padding para el header
  &--loading {
    padding-top: 0;
  }
}

// Smooth scroll para toda la página
html {
  scroll-behavior: smooth;
}

// Estilos para los enlaces del router
.router-link-active {
  color: $purple-primary !important;
}
</style>
