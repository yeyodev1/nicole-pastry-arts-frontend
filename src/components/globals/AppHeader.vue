<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth.store'

// Stores
const authStore = useAuthStore()

// Estado para el menú móvil
const isMobileMenuOpen = ref(false)
const isScrolled = ref(false)

// Función para alternar el menú móvil
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

// Función para cerrar el menú móvil
const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

// Detectar scroll para cambiar el estilo del header
const handleScroll = () => {
  isScrolled.value = window.scrollY > 10
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// Computed para navegación dinámica
const isAuthenticated = computed(() => authStore.isAuthenticated)

// Navegación principal
const navigationItems = computed(() => {
  const baseItems = [
    { name: 'Productos', href: '/products', icon: 'fas fa-shopping-bag' },
    { name: 'Carrito', href: '/cart', icon: 'fas fa-shopping-cart' }
  ]

  if (isAuthenticated.value) {
    baseItems.push(
      { name: 'Mis Órdenes', href: '/orders', icon: 'fas fa-receipt' },
      { name: 'Perfil', href: '/profile', icon: 'fas fa-user' }
    )
  } else {
    baseItems.push(
      { name: 'Iniciar Sesión', href: '/login', icon: 'fas fa-user' }
    )
  }

  return baseItems
})
</script>

<template>
  <header 
    class="app-header"
    :class="{ 'app-header--scrolled': isScrolled }"
  >
    <div class="app-header__container">
      <!-- Logo -->
      <div class="app-header__logo">
        <router-link to="/" class="app-header__logo-link" @click="closeMobileMenu">
          <img 
            src="@/assets/logo/logo-nicole.svg" 
            alt="Nicole Pastry Arts" 
            class="app-header__logo-image"
          >
        </router-link>
      </div>

      <!-- Navegación Desktop -->
      <nav class="app-header__nav app-header__nav--desktop">
        <ul class="app-header__nav-list">
          <li 
            v-for="item in navigationItems" 
            :key="item.name"
            class="app-header__nav-item"
          >
            <router-link 
              :to="item.href" 
              class="app-header__nav-link"
              active-class="app-header__nav-link--active"
              :title="item.name"
            >
              <i :class="item.icon"></i>
              <span class="app-header__nav-text">{{ item.name }}</span>
            </router-link>
          </li>
        </ul>
      </nav>

      <!-- Botón de menú móvil -->
      <button 
        class="app-header__mobile-toggle"
        :class="{ 'app-header__mobile-toggle--active': isMobileMenuOpen }"
        @click="toggleMobileMenu"
        aria-label="Abrir menú de navegación"
      >
        <span class="app-header__mobile-toggle-line"></span>
        <span class="app-header__mobile-toggle-line"></span>
        <span class="app-header__mobile-toggle-line"></span>
      </button>
    </div>

    <!-- Navegación Móvil -->
    <nav 
      class="app-header__nav app-header__nav--mobile"
      :class="{ 'app-header__nav--mobile-open': isMobileMenuOpen }"
    >
      <ul class="app-header__nav-list">
        <li 
          v-for="item in navigationItems" 
          :key="item.name"
          class="app-header__nav-item"
        >
          <router-link 
            :to="item.href" 
            class="app-header__nav-link"
            active-class="app-header__nav-link--active"
            @click="closeMobileMenu"
          >
            <i :class="item.icon"></i>
            <span class="app-header__nav-text">{{ item.name }}</span>
          </router-link>
        </li>
      </ul>
    </nav>

    <!-- Overlay para cerrar menú móvil -->
    <div 
      v-if="isMobileMenuOpen"
      class="app-header__overlay"
      @click="closeMobileMenu"
    ></div>
  </header>
</template>

<style lang="scss" scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: $white;
  border-bottom: 1px solid $border-light;
  transition: all 0.3s ease;

  &--scrolled {
    box-shadow: 0 2px 20px rgba($purple-primary, 0.1);
    border-bottom-color: rgba($purple-primary, 0.1);
  }

  &__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 70px;

    @media (min-width: 768px) {
      padding: 0 2rem;
      height: 80px;
    }

    @media (min-width: 1024px) {
      padding: 0 3rem;
    }
  }

  &__logo {
    flex-shrink: 0;
    z-index: 1001;
  }

  &__logo-link {
    display: block;
    line-height: 0;
  }

  &__logo-image {
    height: 40px;
    width: auto;
    transition: transform 0.3s ease;

    @media (min-width: 768px) {
      height: 50px;
    }

    &:hover {
      transform: scale(1.05);
    }
  }

  // Navegación Desktop
  &__nav--desktop {
    display: none;

    @media (min-width: 768px) {
      display: block;
    }
  }

  &__nav-list {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    gap: 2rem;

    @media (min-width: 1024px) {
      gap: 3rem;
    }
  }

  &__nav-item {
    position: relative;
  }

  &__nav-link {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    padding: 0.5rem;
    color: $text-dark;
    text-decoration: none;
    font-weight: 500;
    font-size: 0.8rem;
    transition: all 0.3s ease;
    position: relative;
    border-radius: 8px;

    @media (min-width: 1024px) {
      font-size: 0.85rem;
      padding: 0.75rem;
    }

    i {
      font-size: 1.2rem;
      margin-bottom: 0.1rem;

      @media (min-width: 1024px) {
        font-size: 1.4rem;
      }
    }

    &:hover {
      color: $purple-primary;
      background-color: rgba($purple-primary, 0.1);
    }

    &--active {
      color: $purple-primary;
      background-color: rgba($purple-primary, 0.15);
    }
  }

  &__nav-text {
    font-size: 0.75rem;
    font-weight: 500;

    @media (min-width: 1024px) {
      font-size: 0.8rem;
    }
  }

  // Botón de menú móvil
  &__mobile-toggle {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    z-index: 1001;

    @media (min-width: 768px) {
      display: none;
    }
  }

  &__mobile-toggle-line {
    width: 20px;
    height: 2px;
    background-color: $purple-primary;
    margin: 2px 0;
    transition: all 0.3s ease;
    transform-origin: center;

    .app-header__mobile-toggle--active & {
      &:nth-child(1) {
        transform: rotate(45deg) translate(4px, 4px);
      }

      &:nth-child(2) {
        opacity: 0;
      }

      &:nth-child(3) {
        transform: rotate(-45deg) translate(4px, -4px);
      }
    }
  }

  // Navegación Móvil
  &__nav--mobile {
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    z-index: 1002;
    background-color: $white;
    border-bottom: 1px solid $border-light;
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    box-shadow: 0 4px 20px rgba($purple-primary, 0.1);

    &-open {
      transform: translateY(0);
      opacity: 1;
      visibility: visible;
    }

    .app-header__nav-list {
      flex-direction: column;
      gap: 0;
      padding: 1rem;
    }

    .app-header__nav-link {
      flex-direction: row;
      justify-content: flex-start;
      gap: 1rem;
      padding: 1rem;
      font-size: 1.1rem;
      border-bottom: 1px solid $background-light;
      border-radius: 0;

      &:last-child {
        border-bottom: none;
      }

      i {
        font-size: 1.3rem;
        margin-bottom: 0;
      }

      &:hover,
      &--active {
        background-color: $background-light;
        color: $purple-primary;
      }
    }

    @media (min-width: 768px) {
      display: none;
    }
  }

  // Overlay
  &__overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba($text-dark, 0.5);
    z-index: 1001;

    @media (min-width: 768px) {
      display: none;
    }
  }
}

// Espaciado para el contenido principal
body {
  padding-top: 70px;

  @media (min-width: 768px) {
    padding-top: 80px;
  }
}
</style>