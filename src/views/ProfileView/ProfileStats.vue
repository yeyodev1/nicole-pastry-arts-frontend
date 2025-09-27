<template>
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
</template>

<script setup lang="ts">
import type { User } from '@/types/auth'

// Props
const props = defineProps({
  user: {
    type: Object as () => User | null,
    required: false,
    default: null
  },
  totalOrders: {
    type: Number,
    required: false,
    default: 0
  },
  favoriteProducts: {
    type: Number,
    required: false,
    default: 0
  }
})

// Métodos
const formatDate = (date?: Date | string): string => {
  if (!date) return 'No disponible'
  
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style lang="scss" scoped>
.stats-section {
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
</style>