<script setup lang="ts">
import { ref, provide, onMounted, watch, computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import AppHeader from '@/components/globals/AppHeader.vue'
import AppFooter from '@/components/globals/AppFooter.vue'
import StaffHeader from '@/components/staff/StaffHeader.vue'
import { useAuthStore } from '@/stores/auth.store'

const route = useRoute()
const authStore = useAuthStore()

// Computed para determinar si el usuario es staff
const isStaffUser = computed(() => {
  return authStore.isAuthenticated && authStore.user?.role === 'staff'
})

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

// Función para verificar si debe mostrar la pantalla de carga
const shouldShowLoadingScreen = (path: string) => {
  return path === '/' || path === '/home' || path === ''
}

// Función para inicializar el estado de carga basado en la ruta
const initializeLoadingState = (path: string) => {
  if (shouldShowLoadingScreen(path)) {
    showGlobalLoading()
  } else {
    // Para todas las demás páginas, mostrar inmediatamente el header y footer
    isAppLoaded.value = true
    showLoadingScreen.value = false
  }
}

// Watcher para cambios de ruta
watch(() => route.path, (newPath) => {
  // Solo reinicializar si no estamos ya en una pantalla de carga
  if (!showLoadingScreen.value) {
    initializeLoadingState(newPath)
  }
}, { immediate: false })

// Al montar la aplicación, verificar si estamos en la página de inicio
onMounted(() => {
  // Obtener la ruta actual de manera más robusta
  const currentPath = window.location.pathname
  
  // Pequeño delay para asegurar que el router esté completamente inicializado
  setTimeout(() => {
    initializeLoadingState(currentPath)
  }, 10)
})

// Proveer el estado y funciones a todos los componentes hijos
provide('isAppLoaded', isAppLoaded)
provide('showLoadingScreen', showLoadingScreen)
provide('handleGlobalLoadingComplete', handleGlobalLoadingComplete)
provide('showGlobalLoading', showGlobalLoading)
</script>

<template>
  <div id="app">
    <!-- Header - Condicional basado en el rol del usuario -->
    <template v-if="!showLoadingScreen">
      <!-- Header para Staff -->
      <StaffHeader v-if="isStaffUser" />
      <!-- Header para Clientes -->
      <AppHeader v-else />
    </template>
    
    <!-- Contenido principal -->
    <main class="main-content">
      <RouterView />
    </main>
    
    <!-- Footer - Se muestra siempre excepto durante la pantalla de carga inicial y para staff -->
    <AppFooter v-if="!showLoadingScreen && !isStaffUser" />
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
