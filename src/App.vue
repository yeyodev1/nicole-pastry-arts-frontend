<script setup lang="ts">
import { ref, provide, onMounted } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import AppHeader from '@/components/globals/AppHeader.vue'
import AppFooter from '@/components/globals/AppFooter.vue'

const route = useRoute()

// Estado global de carga
const isAppLoaded = ref(false)
const showLoadingScreen = ref(false)

// Función para manejar cuando la carga global termine
const handleGlobalLoadingComplete = () => {
  isAppLoaded.value = true
  showLoadingScreen.value = false
}

// Función para mostrar la pantalla de carga (solo para HomeView)
const showGlobalLoading = () => {
  showLoadingScreen.value = true
  isAppLoaded.value = false
}

// Al montar la aplicación, verificar si estamos en la página de inicio
onMounted(() => {
  // Si estamos en la página de inicio, mostrar la pantalla de carga
  if (route.path === '/' || route.path === '/home') {
    showGlobalLoading()
  } else {
    // Para todas las demás páginas, mostrar inmediatamente el header y footer
    isAppLoaded.value = true
    showLoadingScreen.value = false
  }
})

// Proveer el estado y funciones a todos los componentes hijos
provide('isAppLoaded', isAppLoaded)
provide('showLoadingScreen', showLoadingScreen)
provide('handleGlobalLoadingComplete', handleGlobalLoadingComplete)
provide('showGlobalLoading', showGlobalLoading)
</script>

<template>
  <div id="app">
    <!-- Header - Se muestra siempre excepto durante la pantalla de carga inicial -->
    <AppHeader v-if="!showLoadingScreen" />
    
    <!-- Contenido principal -->
    <main class="main-content">
      <RouterView />
    </main>
    
    <!-- Footer - Se muestra siempre excepto durante la pantalla de carga inicial -->
    <AppFooter v-if="!showLoadingScreen" />
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
