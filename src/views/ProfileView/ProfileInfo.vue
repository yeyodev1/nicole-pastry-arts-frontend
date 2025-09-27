<template>
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
</template>

<script setup lang="ts">
import type { User, UserRole } from '@/types/auth'

// Props
const props = defineProps({
  user: {
    type: Object as () => User | null,
    required: false,
    default: null
  }
})

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
.info-section {
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
</style>