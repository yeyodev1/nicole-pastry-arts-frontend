<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

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

// Navegación principal
const navigationItems = [
  { name: 'Inicio', href: '/' },
  { name: 'Productos', href: '/productos' },
  { name: 'Sobre Nosotros', href: '/sobre-nosotros' },
  { name: 'Contacto', href: '/contacto' }
]
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
            >
              {{ item.name }}
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
            {{ item.name }}
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
    display: block;
    padding: 0.5rem 0;
    color: $text-dark;
    text-decoration: none;
    font-weight: 500;
    font-size: 0.95rem;
    transition: all 0.3s ease;
    position: relative;

    @media (min-width: 1024px) {
      font-size: 1rem;
    }

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 2px;
      background-color: $purple-primary;
      transition: width 0.3s ease;
    }

    &:hover {
      color: $purple-primary;

      &::after {
        width: 100%;
      }
    }

    &--active {
      color: $purple-primary;

      &::after {
        width: 100%;
      }
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
      padding: 1rem;
      font-size: 1.1rem;
      border-bottom: 1px solid $background-light;

      &:last-child {
        border-bottom: none;
      }

      &::after {
        display: none;
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
    z-index: 999;

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