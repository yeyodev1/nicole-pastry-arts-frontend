<template>
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
          <button @click="$emit('edit-profile')" class="btn btn--secondary">
            <i class="fas fa-edit"></i>
            Editar Perfil
          </button>
          <button @click="$emit('logout')" class="btn btn--danger" :disabled="isLoggingOut">
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
import type { User, UserRole } from '@/types/auth'

// Props
const props = defineProps({
  user: {
    type: Object as () => User | null,
    required: false,
    default: null
  },
  isLoggingOut: {
    type: Boolean,
    required: false,
    default: false
  }
})

// Emits
defineEmits<{
  'edit-profile': []
  'logout': []
}>()

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
</script>

<style lang="scss" scoped>
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
</style>