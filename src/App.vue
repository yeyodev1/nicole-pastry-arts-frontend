<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppHeader from '@/components/globals/AppHeader.vue'
import AppFooter from '@/components/globals/AppFooter.vue'
</script>

<template>
  <div id="app">
    <AppHeader />
    
    <main class="main-content">
      <RouterView />
    </main>

    <AppFooter />
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
