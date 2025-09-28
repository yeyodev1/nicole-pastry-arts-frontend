<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { useStaffStore } from '@/stores/staff.store'

// Stores
const authStore = useAuthStore()
const staffStore = useStaffStore()

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

// Computed para información del usuario
const currentUser = computed(() => authStore.user)

// Función para cerrar sesión
const handleLogout = async () => {
  await authStore.logout()
  closeMobileMenu()
}

// Navegación principal del staff
const staffNavigationItems = computed(() => [
  {
    name: 'Dashboard',
    href: '/staff/dashboard',
    icon: 'fas fa-chart-line',
    description: 'Panel principal'
  },
  {
    name: 'Órdenes',
    href: '/staff/orders',
    icon: 'fas fa-shopping-bag',
    description: 'Gestión de órdenes'
  },
])

// Computed para estadísticas rápidas
const quickStats = computed(() => ({
  pendingOrders: staffStore.pendingOrdersCount,
  todayOrders: staffStore.todayOrdersCount,
  todayRevenue: staffStore.dashboardData?.todayRevenue || 0
}))
</script>

<template>
  <header 
    class="staff-header"
    :class="{ 'staff-header--scrolled': isScrolled }"
  >
    <div class="staff-header__container">
      <!-- Logo y título del staff -->
      <div class="staff-header__brand">
        <router-link to="/staff/dashboard" class="staff-header__brand-link" @click="closeMobileMenu">
          <img 
            src="@/assets/logo/logo-nicole.svg" 
            alt="Nicole Pastry Arts" 
            class="staff-header__logo"
          >
          <div class="staff-header__brand-text">
            <h1 class="staff-header__title">Staff Panel</h1>
            <span class="staff-header__subtitle">Nicole Pastry Arts</span>
          </div>
        </router-link>
      </div>

      <!-- Estadísticas rápidas (solo desktop) -->
      <div class="staff-header__stats">
        <div class="staff-header__stat">
          <i class="fas fa-clock"></i>
          <span class="staff-header__stat-value">{{ quickStats.pendingOrders }}</span>
          <span class="staff-header__stat-label">Pendientes</span>
        </div>
        <div class="staff-header__stat">
          <i class="fas fa-calendar-day"></i>
          <span class="staff-header__stat-value">{{ quickStats.todayOrders }}</span>
          <span class="staff-header__stat-label">Hoy</span>
        </div>
        <div class="staff-header__stat">
          <i class="fas fa-dollar-sign"></i>
          <span class="staff-header__stat-value">${{ quickStats.todayRevenue.toFixed(2) }}</span>
          <span class="staff-header__stat-label">Ingresos</span>
        </div>
      </div>

      <!-- Navegación Desktop -->
      <nav class="staff-header__nav staff-header__nav--desktop">
        <ul class="staff-header__nav-list">
          <li 
            v-for="item in staffNavigationItems" 
            :key="item.name"
            class="staff-header__nav-item"
          >
            <router-link 
              :to="item.href" 
              class="staff-header__nav-link"
              active-class="staff-header__nav-link--active"
              :title="item.description"
            >
              <i :class="item.icon"></i>
              <span class="staff-header__nav-text">{{ item.name }}</span>
            </router-link>
          </li>
        </ul>
      </nav>

      <!-- Perfil del usuario y acciones -->
      <div class="staff-header__user">
        <div class="staff-header__user-info">
          <span class="staff-header__user-name">{{ currentUser?.firstName || 'Staff' }}</span>
          <span class="staff-header__user-role">{{ currentUser?.role || 'staff' }}</span>
        </div>
        <div class="staff-header__user-actions">
          <button 
            class="staff-header__user-button"
            @click="handleLogout"
            title="Cerrar sesión"
          >
            <i class="fas fa-sign-out-alt"></i>
          </button>
        </div>
      </div>

      <!-- Botón de menú móvil -->
      <button 
        class="staff-header__mobile-toggle"
        :class="{ 'staff-header__mobile-toggle--active': isMobileMenuOpen }"
        @click="toggleMobileMenu"
        aria-label="Abrir menú de navegación"
      >
        <span class="staff-header__mobile-toggle-line"></span>
        <span class="staff-header__mobile-toggle-line"></span>
        <span class="staff-header__mobile-toggle-line"></span>
      </button>
    </div>

    <!-- Navegación Móvil -->
    <nav 
      class="staff-header__nav staff-header__nav--mobile"
      :class="{ 'staff-header__nav--mobile-open': isMobileMenuOpen }"
    >
      <div class="staff-header__mobile-content">
        <!-- Estadísticas móviles -->
        <div class="staff-header__mobile-stats">
          <div class="staff-header__mobile-stat">
            <i class="fas fa-clock"></i>
            <span>{{ quickStats.pendingOrders }} Pendientes</span>
          </div>
          <div class="staff-header__mobile-stat">
            <i class="fas fa-calendar-day"></i>
            <span>{{ quickStats.todayOrders }} Hoy</span>
          </div>
          <div class="staff-header__mobile-stat">
            <i class="fas fa-dollar-sign"></i>
            <span>${{ quickStats.todayRevenue.toFixed(2) }}</span>
          </div>
        </div>

        <!-- Navegación móvil -->
        <ul class="staff-header__nav-list">
          <li 
            v-for="item in staffNavigationItems" 
            :key="item.name"
            class="staff-header__nav-item"
          >
            <router-link 
              :to="item.href" 
              class="staff-header__nav-link"
              active-class="staff-header__nav-link--active"
              @click="closeMobileMenu"
            >
              <i :class="item.icon"></i>
              <div class="staff-header__nav-content">
                <span class="staff-header__nav-text">{{ item.name }}</span>
                <span class="staff-header__nav-description">{{ item.description }}</span>
              </div>
            </router-link>
          </li>
        </ul>

        <!-- Acciones móviles -->
        <div class="staff-header__mobile-actions">
          <button 
            class="staff-header__mobile-logout"
            @click="handleLogout"
          >
            <i class="fas fa-sign-out-alt"></i>
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </nav>

    <!-- Overlay para cerrar menú móvil -->
    <div 
      v-if="isMobileMenuOpen"
      class="staff-header__overlay"
      @click="closeMobileMenu"
    ></div>
  </header>
</template>

<style lang="scss" scoped>
.staff-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: linear-gradient(135deg, $purple-primary 0%, $purple-dark 100%);
  border-bottom: 1px solid rgba($white, 0.1);
  transition: all 0.3s ease;

  &--scrolled {
    box-shadow: 0 4px 30px rgba($purple-primary, 0.3);
    backdrop-filter: blur(10px);
  }

  &__container {
    max-width: 1400px;
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

  // Brand Section
  &__brand {
    flex-shrink: 0;
    z-index: 1001;
  }

  &__brand-link {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    text-decoration: none;
    color: $white;
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.02);
    }
  }

  &__logo {
    height: 35px;
    width: auto;
    filter: brightness(0) invert(1);

    @media (min-width: 768px) {
      height: 40px;
    }
  }

  &__brand-text {
    display: none;

    @media (min-width: 768px) {
      display: block;
    }
  }

  &__title {
    font-size: 1.2rem;
    font-weight: 700;
    margin: 0;
    line-height: 1.2;
  }

  &__subtitle {
    font-size: 0.75rem;
    opacity: 0.8;
    font-weight: 400;
  }

  // Quick Stats
  &__stats {
    display: none;
    gap: 2rem;

    @media (min-width: 1024px) {
      display: flex;
    }
  }

  &__stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    color: $white;
    min-width: 80px;

    i {
      font-size: 1.1rem;
      opacity: 0.8;
    }
  }

  &__stat-value {
    font-size: 1.1rem;
    font-weight: 700;
    line-height: 1;
  }

  &__stat-label {
    font-size: 0.7rem;
    opacity: 0.8;
    font-weight: 500;
  }

  // Navigation Desktop
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
    gap: 1rem;

    @media (min-width: 1024px) {
      gap: 1.5rem;
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
    padding: 0.75rem 1rem;
    color: rgba($white, 0.9);
    text-decoration: none;
    font-weight: 500;
    font-size: 0.8rem;
    transition: all 0.3s ease;
    border-radius: 12px;
    position: relative;

    @media (min-width: 1024px) {
      font-size: 0.85rem;
      padding: 0.875rem 1.25rem;
    }

    i {
      font-size: 1.2rem;
      margin-bottom: 0.1rem;

      @media (min-width: 1024px) {
        font-size: 1.3rem;
      }
    }

    &:hover {
      color: $white;
      background-color: rgba($white, 0.15);
      transform: translateY(-2px);
    }

    &--active {
      color: $white;
      background-color: rgba($white, 0.2);
      box-shadow: 0 4px 15px rgba($white, 0.1);

      &::before {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 50%;
        transform: translateX(-50%);
        width: 30px;
        height: 3px;
        background-color: $white;
        border-radius: 2px;
      }
    }
  }

  &__nav-text {
    font-size: 0.75rem;
    font-weight: 600;

    @media (min-width: 1024px) {
      font-size: 0.8rem;
    }
  }

  // User Section
  &__user {
    display: none;
    align-items: center;
    gap: 1rem;
    color: $white;

    @media (min-width: 768px) {
      display: flex;
    }
  }

  &__user-info {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.1rem;
  }

  &__user-name {
    font-size: 0.9rem;
    font-weight: 600;
  }

  &__user-role {
    font-size: 0.7rem;
    opacity: 0.8;
    text-transform: uppercase;
    font-weight: 500;
  }

  &__user-actions {
    display: flex;
    gap: 0.5rem;
  }

  &__user-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: rgba($white, 0.15);
    border: none;
    border-radius: 10px;
    color: $white;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background: rgba($white, 0.25);
      transform: scale(1.05);
    }

    i {
      font-size: 1.1rem;
    }
  }

  // Mobile Toggle
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
    background-color: $white;
    margin: 2px 0;
    transition: all 0.3s ease;
    transform-origin: center;

    .staff-header__mobile-toggle--active & {
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

  // Mobile Navigation
  &__nav--mobile {
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    background: linear-gradient(135deg, $purple-primary 0%, $purple-hover 100%);
    border-bottom: 1px solid rgba($white, 0.1);
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    box-shadow: 0 8px 40px rgba($purple-primary, 0.3);
    backdrop-filter: blur(10px);

    &-open {
      transform: translateY(0);
      opacity: 1;
      visibility: visible;
    }

    @media (min-width: 768px) {
      display: none;
    }
  }

  &__mobile-content {
    padding: 1.5rem;
  }

  &__mobile-stats {
    display: flex;
    justify-content: space-around;
    margin-bottom: 2rem;
    padding: 1rem;
    background: rgba($white, 0.1);
    border-radius: 12px;
  }

  &__mobile-stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    color: $white;
    font-size: 0.8rem;

    i {
      font-size: 1.2rem;
      opacity: 0.8;
    }
  }

  // Mobile Navigation Links
  .staff-header__nav--mobile {
    .staff-header__nav-list {
      flex-direction: column;
      gap: 0.5rem;
    }

    .staff-header__nav-link {
      flex-direction: row;
      justify-content: flex-start;
      gap: 1rem;
      padding: 1.25rem;
      font-size: 1rem;
      border-radius: 12px;
      background: rgba($white, 0.05);
      border: 1px solid rgba($white, 0.1);

      i {
        font-size: 1.3rem;
        margin-bottom: 0;
        width: 24px;
        text-align: center;
      }

      &:hover,
      &--active {
        background: rgba($white, 0.15);
        border-color: rgba($white, 0.2);
      }
    }

    .staff-header__nav-content {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }

    .staff-header__nav-description {
      font-size: 0.8rem;
      opacity: 0.8;
      font-weight: 400;
    }
  }

  &__mobile-actions {
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid rgba($white, 0.1);
  }

  &__mobile-logout {
    display: flex;
    align-items: center;
    gap: 1rem;
    width: 100%;
    padding: 1rem;
    background: rgba($error, 0.2);
    border: 1px solid rgba($error, 0.3);
    border-radius: 12px;
    color: $white;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background: rgba($error, 0.3);
      border-color: rgba($error, 0.4);
    }

    i {
      font-size: 1.2rem;
    }
  }

  // Overlay
  &__overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba($text-dark, 0.6);
    z-index: 999;
    backdrop-filter: blur(2px);

    @media (min-width: 768px) {
      display: none;
    }
  }
}
</style>