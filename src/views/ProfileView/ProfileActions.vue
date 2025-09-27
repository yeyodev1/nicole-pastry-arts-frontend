<template>
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
      
      <a href="#" @click.prevent="$emit('edit-profile')" class="action-card">
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
</template>

<script setup lang="ts">
// Emits
defineEmits<{
  'edit-profile': []
}>()
</script>

<style lang="scss" scoped>
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
</style>