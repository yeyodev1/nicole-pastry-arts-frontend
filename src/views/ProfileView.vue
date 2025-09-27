<template>
  <div class="profile-view">
    <!-- Header del Perfil -->
    <div class="profile-header">
      <div class="container">
        <div class="header-content">
          <div class="profile-avatar">
            <div class="avatar-circle">
              <i class="fas fa-user"></i>
            </div>
            <div class="avatar-status" :class="{ 'avatar-status--verified': user?.isEmailVerified }">
              <i class="fas fa-check" v-if="user?.isEmailVerified"></i>
              <i class="fas fa-exclamation" v-else></i>
            </div>
          </div>
          
          <div class="profile-info">
            <h1 class="profile-name">
              {{ user?.firstName }} {{ user?.lastName }}
            </h1>
            <p class="profile-email">{{ user?.email }}</p>
            <div class="profile-badges">
              <span class="badge badge--role" :class="`badge--${user?.role}`">
                <i class="fas fa-crown" v-if="user?.role === 'admin'"></i>
                <i class="fas fa-users" v-else-if="user?.role === 'staff'"></i>
                <i class="fas fa-user" v-else></i>
                {{ getRoleLabel(user?.role) }}
              </span>
              <span class="badge badge--status" :class="{ 'badge--verified': user?.isEmailVerified }">
                <i class="fas fa-shield-check" v-if="user?.isEmailVerified"></i>
                <i class="fas fa-shield-exclamation" v-else></i>
                {{ user?.isEmailVerified ? 'Verificado' : 'Sin Verificar' }}
              </span>
            </div>
          </div>

          <div class="profile-actions">
            <button @click="showEditModal = true" class="btn btn--secondary">
              <i class="fas fa-edit"></i>
              Editar Perfil
            </button>
            <button @click="handleLogout" class="btn btn--danger" :disabled="isLoggingOut">
              <i class="fas fa-sign-out-alt" v-if="!isLoggingOut"></i>
              <i class="fas fa-spinner fa-spin" v-else></i>
              {{ isLoggingOut ? 'Cerrando...' : 'Cerrar Sesión' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenido Principal -->
    <div class="profile-content">
      <div class="container">
        <div class="content-grid">
          <!-- Información Personal -->
          <div class="info-section">
            <div class="section-header">
              <h2 class="section-title">
                <i class="fas fa-user-circle"></i>
                Información Personal
              </h2>
            </div>
            
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Nombre Completo:</span>
                <span class="info-value">{{ user?.firstName }} {{ user?.lastName }}</span>
              </div>
              
              <div class="info-item">
                <span class="info-label">Correo Electrónico:</span>
                <span class="info-value">{{ user?.email }}</span>
              </div>
              
              <div class="info-item" v-if="user?.phone">
                <span class="info-label">Teléfono:</span>
                <span class="info-value">{{ user.phone }}</span>
              </div>
              
              <div class="info-item">
                <span class="info-label">Rol:</span>
                <span class="info-value">{{ getRoleLabel(user?.role) }}</span>
              </div>
              
              <div class="info-item">
                <span class="info-label">Estado de la Cuenta:</span>
                <span class="info-value" :class="{ 'text-success': user?.isActive, 'text-danger': !user?.isActive }">
                  {{ user?.isActive ? 'Activa' : 'Inactiva' }}
                </span>
              </div>
              
              <div class="info-item">
                <span class="info-label">Email Verificado:</span>
                <span class="info-value" :class="{ 'text-success': user?.isEmailVerified, 'text-warning': !user?.isEmailVerified }">
                  {{ user?.isEmailVerified ? 'Sí' : 'No' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Estadísticas de Actividad -->
          <div class="stats-section">
            <div class="section-header">
              <h2 class="section-title">
                <i class="fas fa-chart-line"></i>
                Actividad de la Cuenta
              </h2>
            </div>
            
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-icon stat-icon--primary">
                  <i class="fas fa-calendar-plus"></i>
                </div>
                <div class="stat-content">
                  <span class="stat-label">Miembro desde</span>
                  <span class="stat-value">{{ formatDate(user?.createdAt) }}</span>
                </div>
              </div>
              
              <div class="stat-card" v-if="user?.lastLogin">
                <div class="stat-icon stat-icon--success">
                  <i class="fas fa-clock"></i>
                </div>
                <div class="stat-content">
                  <span class="stat-label">Último acceso</span>
                  <span class="stat-value">{{ formatDate(user.lastLogin) }}</span>
                </div>
              </div>
              
              <div class="stat-card">
                <div class="stat-icon stat-icon--info">
                  <i class="fas fa-shopping-bag"></i>
                </div>
                <div class="stat-content">
                  <span class="stat-label">Órdenes totales</span>
                  <span class="stat-value">{{ totalOrders }}</span>
                </div>
              </div>
              
              <div class="stat-card">
                <div class="stat-icon stat-icon--warning">
                  <i class="fas fa-heart"></i>
                </div>
                <div class="stat-content">
                  <span class="stat-label">Productos favoritos</span>
                  <span class="stat-value">{{ favoriteProducts }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Acciones Rápidas -->
          <div class="actions-section">
            <div class="section-header">
              <h2 class="section-title">
                <i class="fas fa-bolt"></i>
                Acciones Rápidas
              </h2>
            </div>
            
            <div class="actions-grid">
              <router-link to="/orders" class="action-card">
                <div class="action-icon">
                  <i class="fas fa-shopping-bag"></i>
                </div>
                <div class="action-content">
                  <h3 class="action-title">Mis Órdenes</h3>
                  <p class="action-description">Ver historial de pedidos</p>
                </div>
                <i class="fas fa-chevron-right action-arrow"></i>
              </router-link>
              
              <router-link to="/products" class="action-card">
                <div class="action-icon">
                  <i class="fas fa-birthday-cake"></i>
                </div>
                <div class="action-content">
                  <h3 class="action-title">Productos</h3>
                  <p class="action-description">Explorar catálogo</p>
                </div>
                <i class="fas fa-chevron-right action-arrow"></i>
              </router-link>
              
              <router-link to="/cart" class="action-card">
                <div class="action-icon">
                  <i class="fas fa-shopping-cart"></i>
                </div>
                <div class="action-content">
                  <h3 class="action-title">Mi Carrito</h3>
                  <p class="action-description">Revisar productos</p>
                </div>
                <i class="fas fa-chevron-right action-arrow"></i>
              </router-link>
              
              <a href="#" @click.prevent="showEditModal = true" class="action-card">
                <div class="action-icon">
                  <i class="fas fa-cog"></i>
                </div>
                <div class="action-content">
                  <h3 class="action-title">Configuración</h3>
                  <p class="action-description">Editar información</p>
                </div>
                <i class="fas fa-chevron-right action-arrow"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Edición (Placeholder) -->
    <div v-if="showEditModal" class="modal-overlay" @click="showEditModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">
            <i class="fas fa-edit"></i>
            Editar Perfil
          </h3>
          <button @click="showEditModal = false" class="modal-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <p class="text-center text-muted">
            <i class="fas fa-tools"></i>
            Funcionalidad de edición próximamente disponible
          </p>
        </div>
        
        <div class="modal-footer">
          <button @click="showEditModal = false" class="btn btn--secondary">
            Cerrar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de Confirmación de Logout -->
    <div v-if="showLogoutModal" class="modal-overlay" @click="showLogoutModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">
            <i class="fas fa-sign-out-alt"></i>
            Confirmar Cierre de Sesión
          </h3>
          <button @click="showLogoutModal = false" class="modal-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <p class="text-center">
            ¿Estás seguro de que deseas cerrar sesión?
          </p>
        </div>
        
        <div class="modal-footer">
          <button @click="showLogoutModal = false" class="btn btn--secondary">
            Cancelar
          </button>
          <button @click="confirmLogout" class="btn btn--danger" :disabled="isLoggingOut">
            <i class="fas fa-sign-out-alt" v-if="!isLoggingOut"></i>
            <i class="fas fa-spinner fa-spin" v-else></i>
            {{ isLoggingOut ? 'Cerrando...' : 'Cerrar Sesión' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useOrdersStore } from '@/stores/orders.store'
import type { UserRole } from '@/types/auth'

// Stores
const authStore = useAuthStore()
const ordersStore = useOrdersStore()
const router = useRouter()

// Estado reactivo
const showEditModal = ref(false)
const showLogoutModal = ref(false)
const isLoggingOut = ref(false)

// Computed
const user = computed(() => authStore.user)
const totalOrders = computed(() => ordersStore.customerOrders?.length || 0)
const favoriteProducts = computed(() => 0) // Placeholder para futura funcionalidad

// Métodos
const getRoleLabel = (role?: UserRole): string => {
  switch (role) {
    case 'admin':
      return 'Administrador'
    case 'staff':
      return 'Personal'
    case 'customer':
      return 'Cliente'
    default:
      return 'Usuario'
  }
}

const formatDate = (date?: Date | string): string => {
  if (!date) return 'No disponible'
  
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const handleLogout = (): void => {
  showLogoutModal.value = true
}

const confirmLogout = async (): Promise<void> => {
  try {
    isLoggingOut.value = true
    
    // Cerrar sesión
    await authStore.logout()
    
    // Limpiar stores relacionados
    ordersStore.clearState()
    
    // Redirigir al home
    await router.push('/')
    
    // Mostrar mensaje de éxito (opcional)
    console.log('[SUCCESS] Sesión cerrada exitosamente')
    
  } catch (error) {
    console.error('[ERROR] Error al cerrar sesión:', error)
  } finally {
    isLoggingOut.value = false
    showLogoutModal.value = false
  }
}

// Lifecycle
onMounted(async () => {
  // Cargar órdenes del usuario para mostrar estadísticas
  if (user.value?._id) {
    try {
      await ordersStore.fetchOrdersByCustomer(user.value._id)
    } catch (error) {
      console.warn('[WARNING] No se pudieron cargar las órdenes del usuario:', error)
    }
  }
})
</script>

<style lang="scss" scoped>
.profile-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

// ===== HEADER DEL PERFIL =====
.profile-header {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  color: white;
  padding: 3rem 0;

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  .header-content {
    display: flex;
    align-items: center;
    gap: 2rem;
    flex-wrap: wrap;

    @media (max-width: 768px) {
      flex-direction: column;
      text-align: center;
      gap: 1.5rem;
    }
  }

  .profile-avatar {
    position: relative;
    flex-shrink: 0;

    .avatar-circle {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(10px);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3rem;
      border: 4px solid rgba(255, 255, 255, 0.3);
      color: #2c3e50;

      @media (max-width: 768px) {
        width: 100px;
        height: 100px;
        font-size: 2.5rem;
      }
    }

    .avatar-status {
      position: absolute;
      bottom: 8px;
      right: 8px;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #dc3545;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 0.9rem;
      border: 3px solid white;

      &--verified {
        background: #28a745;
      }
    }
  }

  .profile-info {
    flex: 1;
    min-width: 0;

    .profile-name {
      font-size: 2.5rem;
      font-weight: 700;
      margin: 0 0 0.5rem 0;
      color: black;

      @media (max-width: 768px) {
        font-size: 2rem;
      }
    }

    .profile-email {
      font-size: 1.2rem;
      opacity: 0.9;
      margin: 0 0 1rem 0;
      color: black;
    }

    .profile-badges {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;

      @media (max-width: 768px) {
        justify-content: center;
      }
    }
  }

  .profile-actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;

    @media (max-width: 768px) {
      width: 100%;
      justify-content: center;
    }
  }
}

// ===== BADGES =====
.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);

  &--admin {
    background: rgba(255, 193, 7, 0.9);
    color: #000;
  }

  &--staff {
    background: rgba(0, 123, 255, 0.9);
    color: white;
  }

  &--customer {
    background: rgba(40, 167, 69, 0.9);
    color: white;
  }

  &--verified {
    background: rgba(40, 167, 69, 0.9);
    color: white;
  }
}

// ===== BOTONES =====
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &--secondary {
    background: rgba(0, 0, 0, 0.7);
    color: white;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);

    &:hover:not(:disabled) {
      background: rgba(0, 0, 0, 0.8);
      border-color: rgba(255, 255, 255, 0.5);
      transform: translateY(-2px);
    }
  }

  &--danger {
    background: #dc3545;
    color: white;

    &:hover:not(:disabled) {
      background: #c82333;
      transform: translateY(-2px);
    }
  }
}

// ===== CONTENIDO PRINCIPAL =====
.profile-content {
  padding: 3rem 0;

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  .content-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;

    @media (min-width: 768px) {
      grid-template-columns: 2fr 1fr;
    }

    @media (min-width: 1024px) {
      grid-template-columns: 1fr 1fr;
    }
  }
}

// ===== SECCIONES =====
.info-section,
.stats-section,
.actions-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }
}

.section-header {
  margin-bottom: 1.5rem;

  .section-title {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 1.5rem;
    font-weight: 700;
    color: #2c3e50;
    margin: 0;

    i {
      color: #2c3e50;
    }
  }
}

// ===== INFORMACIÓN PERSONAL =====
.info-grid {
  display: grid;
  gap: 1rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid var(--primary-color);

  .info-label {
    font-weight: 600;
    color: #495057;
  }

  .info-value {
    font-weight: 500;
    color: #2c3e50;

    &.text-success {
      color: #28a745;
    }

    &.text-danger {
      color: #dc3545;
    }

    &.text-warning {
      color: #ffc107;
    }
  }
}

// ===== ESTADÍSTICAS =====
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }

  .stat-icon {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    color: white;

    &--primary {
      background: #2c3e50;
    }

    &--success {
      background: #1e7e34;
    }

    &--info {
      background: #138496;
    }

    &--warning {
      background: #e0a800;
      color: #2c3e50;
    }
  }

  .stat-content {
    display: flex;
    flex-direction: column;

    .stat-label {
      font-size: 0.9rem;
      color: #6c757d;
      margin-bottom: 0.25rem;
    }

    .stat-value {
      font-size: 1.2rem;
      font-weight: 700;
      color: #2c3e50;
    }
  }
}

// ===== ACCIONES RÁPIDAS =====
.actions-grid {
  display: grid;
  gap: 1rem;
}

.action-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  border: 2px solid transparent;

  &:hover {
    background: #e9ecef;
    border-color: var(--primary-color);
    transform: translateX(4px);
  }

  .action-icon {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: #2c3e50;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    color: white;
    flex-shrink: 0;
  }

  .action-content {
    flex: 1;

    .action-title {
      font-size: 1.1rem;
      font-weight: 700;
      color: #2c3e50;
      margin: 0 0 0.25rem 0;
    }

    .action-description {
      font-size: 0.9rem;
      color: #6c757d;
      margin: 0;
    }
  }

  .action-arrow {
    color: #6c757d;
    font-size: 1.2rem;
    transition: transform 0.3s ease;
  }

  &:hover .action-arrow {
    transform: translateX(4px);
  }
}

// ===== MODALES =====
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;

  .modal-title {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 1.25rem;
    font-weight: 700;
    color: #2c3e50;
    margin: 0;

    i {
      color: var(--primary-color);
    }
  }

  .modal-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    color: #6c757d;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 50%;
    transition: all 0.3s ease;

    &:hover {
      background: #f8f9fa;
      color: #dc3545;
    }
  }
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding: 1.5rem;
  border-top: 1px solid #e9ecef;
}

// ===== UTILIDADES =====
.text-center {
  text-align: center;
}

.text-muted {
  color: #6c757d;
}

// ===== RESPONSIVE =====
@media (max-width: 768px) {
  .profile-content {
    padding: 2rem 0;
  }

  .info-section,
  .stats-section,
  .actions-section {
    padding: 1.5rem;
  }

  .content-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>