<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useStaffStore } from '@/stores/staff.store'
import { useOrdersStore } from '@/stores/orders.store'
import StaffHeader from '@/components/staff/StaffHeader.vue'

// Stores
const staffStore = useStaffStore()
const ordersStore = useOrdersStore()

// Estado local
const refreshing = ref(false)

// Datos computados del dashboard
const dashboardMetrics = computed(() => {
  const dashboard = staffStore.dashboardSummary
  const orderStats = ordersStore.orderStats
  
  return {
    // Métricas principales del staff store
    todayOrders: dashboard?.todayOrders || 0,
    todayRevenue: dashboard?.todayRevenue || 0,
    pendingOrders: dashboard?.pendingOrders || 0,
    processingOrders: dashboard?.processingOrders || 0,
    deliveredToday: dashboard?.deliveredToday || 0,
    weeklyRevenue: dashboard?.weeklyRevenue || 0,
    monthlyRevenue: dashboard?.monthlyRevenue || 0,
    
    // Métricas adicionales del orders store
    totalOrders: orderStats.total,
    confirmedOrders: orderStats.confirmed,
    paidOrders: orderStats.paid,
    
    // Zonas de entrega y órdenes recientes
    topDeliveryZones: dashboard?.topDeliveryZones || [],
    recentOrders: dashboard?.recentOrders || [],
  }
})

// Métricas de rendimiento
const performanceMetrics = computed(() => {
  const stats = ordersStore.orderStats
  const totalRevenue = dashboardMetrics.value?.todayRevenue || 0
  const avgOrderValue = stats.total > 0 ? totalRevenue / stats.total : 0
  
  return {
    averageOrderValue: avgOrderValue,
    totalRevenue: totalRevenue,
    conversionRate: stats.total > 0 
      ? (stats.paid / stats.total * 100).toFixed(1)
      : '0.0',
    fulfillmentRate: stats.total > 0
      ? (stats.delivered / stats.total * 100).toFixed(1)
      : '0.0'
  }
})

// Estados de carga
const isLoading = computed(() => 
  staffStore.isLoading || ordersStore.isLoading || refreshing.value
)

// Función para refrescar datos
const refreshDashboard = async (): Promise<void> => {
  try {
    refreshing.value = true
    await Promise.allSettled([
      staffStore.refreshDashboard(),
      ordersStore.refreshOrders()
    ])
  } catch (error) {
    console.error('Error refrescando dashboard:', error)
  } finally {
    refreshing.value = false
  }
}

// Formatear moneda
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-EC', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount)
}

// Formatear porcentaje
const formatPercentage = (value: string | number): string => {
  return `${value}%`
}

// Formatear nombre del cliente
const getCustomerDisplayName = (customer: any): string => {
  if (!customer) return 'Cliente'
  
  // Si es un string, devolverlo directamente
  if (typeof customer === 'string') return customer
  
  // Si es un objeto con firstName y lastName
  if (typeof customer === 'object' && customer.firstName && customer.lastName) {
    return `${customer.firstName} ${customer.lastName}`
  }
  
  // Si es un objeto con solo firstName
  if (typeof customer === 'object' && customer.firstName) {
    return customer.firstName
  }
  
  // Si es un objeto con email como fallback
  if (typeof customer === 'object' && customer.email) {
    return customer.email.split('@')[0]
  }
  
  return 'Cliente'
}

// Cargar datos al montar
onMounted(async () => {
  await refreshDashboard()
})
</script>

<template>
  <div class="staff-dashboard">
    <!-- Header -->
    <StaffHeader />
    
    <!-- Contenido principal -->
    <main class="dashboard-content">
      <!-- Título y acciones -->
      <div class="dashboard-header">
        <div class="header-content">
          <h1 class="dashboard-title">
            <i class="fas fa-chart-line"></i>
            Dashboard de Staff
          </h1>
          <p class="dashboard-subtitle">
            Panel de control y métricas principales
          </p>
        </div>
        
        <div class="header-actions">
          <button 
            @click="refreshDashboard"
            :disabled="isLoading"
            class="refresh-btn"
            :class="{ 'loading': isLoading }"
          >
            <i class="fas fa-sync-alt"></i>
            <span>Actualizar</span>
          </button>
        </div>
      </div>

      <!-- Estado de carga -->
      <div v-if="isLoading && !dashboardMetrics.todayOrders" class="loading-state">
        <div class="loading-spinner">
          <i class="fas fa-spinner"></i>
        </div>
        <p>Cargando métricas del dashboard...</p>
      </div>

      <!-- Métricas principales -->
      <div v-else class="dashboard-grid">
        <!-- Fila 1: Métricas de hoy -->
        <section class="metrics-section">
          <h2 class="section-title">Métricas de Hoy</h2>
          <div class="metrics-grid">
            <div class="metric-card primary">
              <div class="metric-icon">
                <i class="fas fa-shopping-cart"></i>
              </div>
              <div class="metric-content">
                <h3 class="metric-value">{{ dashboardMetrics.todayOrders }}</h3>
                <p class="metric-label">Órdenes de Hoy</p>
              </div>
            </div>

            <div class="metric-card success">
              <div class="metric-icon">
                <i class="fas fa-dollar-sign"></i>
              </div>
              <div class="metric-content">
                <h3 class="metric-value">{{ formatCurrency(dashboardMetrics.todayRevenue) }}</h3>
                <p class="metric-label">Ingresos de Hoy</p>
              </div>
            </div>

            <div class="metric-card warning">
              <div class="metric-icon">
                <i class="fas fa-clock"></i>
              </div>
              <div class="metric-content">
                <h3 class="metric-value">{{ dashboardMetrics.pendingOrders }}</h3>
                <p class="metric-label">Órdenes Pendientes</p>
              </div>
            </div>

            <div class="metric-card info">
              <div class="metric-icon">
                <i class="fas fa-truck"></i>
              </div>
              <div class="metric-content">
                <h3 class="metric-value">{{ dashboardMetrics.deliveredToday }}</h3>
                <p class="metric-label">Entregas de Hoy</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Fila 2: Métricas de rendimiento -->
        <section class="metrics-section">
          <h2 class="section-title">Rendimiento</h2>
          <div class="metrics-grid">
            <div class="metric-card accent">
              <div class="metric-icon">
                <i class="fas fa-chart-bar"></i>
              </div>
              <div class="metric-content">
                <h3 class="metric-value">{{ formatCurrency(performanceMetrics.averageOrderValue) }}</h3>
                <p class="metric-label">Valor Promedio</p>
              </div>
            </div>

            <div class="metric-card secondary">
              <div class="metric-icon">
                <i class="fas fa-percentage"></i>
              </div>
              <div class="metric-content">
                <h3 class="metric-value">{{ formatPercentage(performanceMetrics.conversionRate) }}</h3>
                <p class="metric-label">Tasa de Conversión</p>
              </div>
            </div>

            <div class="metric-card success">
              <div class="metric-icon">
                <i class="fas fa-check-circle"></i>
              </div>
              <div class="metric-content">
                <h3 class="metric-value">{{ formatPercentage(performanceMetrics.fulfillmentRate) }}</h3>
                <p class="metric-label">Tasa de Cumplimiento</p>
              </div>
            </div>

            <div class="metric-card primary">
              <div class="metric-icon">
                <i class="fas fa-cogs"></i>
              </div>
              <div class="metric-content">
                <h3 class="metric-value">{{ dashboardMetrics.processingOrders }}</h3>
                <p class="metric-label">En Proceso</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Fila 3: Ingresos por período -->
        <section class="metrics-section">
          <h2 class="section-title">Ingresos por Período</h2>
          <div class="revenue-grid">
            <div class="revenue-card">
              <div class="revenue-header">
                <i class="fas fa-calendar-week"></i>
                <h3>Esta Semana</h3>
              </div>
              <div class="revenue-amount">
                {{ formatCurrency(dashboardMetrics.weeklyRevenue) }}
              </div>
            </div>

            <div class="revenue-card">
              <div class="revenue-header">
                <i class="fas fa-calendar-alt"></i>
                <h3>Este Mes</h3>
              </div>
              <div class="revenue-amount">
                {{ formatCurrency(dashboardMetrics.monthlyRevenue) }}
              </div>
            </div>

            <div class="revenue-card">
              <div class="revenue-header">
                <i class="fas fa-chart-line"></i>
                <h3>Total General</h3>
              </div>
              <div class="revenue-amount">
                {{ formatCurrency(performanceMetrics.totalRevenue) }}
              </div>
            </div>
          </div>
        </section>

        <!-- Fila 4: Zonas de entrega principales -->
        <section v-if="dashboardMetrics.topDeliveryZones.length > 0" class="metrics-section">
          <h2 class="section-title">Zonas de Entrega Principales</h2>
          <div class="zones-list">
            <div 
              v-for="zone in dashboardMetrics.topDeliveryZones" 
              :key="zone._id"
              class="zone-item"
            >
              <div class="zone-info">
                <i class="fas fa-map-marker-alt"></i>
                <span class="zone-name">{{ zone._id }}</span>
              </div>
              <div class="zone-stats">
                <span class="zone-count">{{ zone.count }} órdenes</span>
                <span class="zone-revenue">{{ formatCurrency(zone.revenue || 0) }}</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Fila 5: Órdenes recientes -->
        <section v-if="dashboardMetrics.recentOrders.length > 0" class="metrics-section full-width">
          <h2 class="section-title">Órdenes Recientes</h2>
          <div class="recent-orders">
            <div class="orders-table">
              <div class="table-header">
                <span>ID</span>
                <span>Cliente</span>
                <span>Estado</span>
                <span>Total</span>
                <span>Fecha</span>
              </div>
              <div 
                v-for="order in dashboardMetrics.recentOrders.slice(0, 5)" 
                :key="order._id"
                class="table-row"
              >
                <span class="order-id">#{{ order._id.slice(-6) }}</span>
                <span class="customer-name">
                  {{ getCustomerDisplayName(order.customer) }}
                </span>
                <span class="order-status" :class="`status-${order.status}`">
                  {{ order.status }}
                </span>
                <span class="order-total">{{ formatCurrency(order.total || 0) }}</span>
                <span class="order-date">
                  {{ new Date(order.createdAt).toLocaleDateString('es-EC') }}
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.staff-dashboard {
  min-height: 100vh;
  background: $background-light;
}

.dashboard-content {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
}

.header-content {
  .dashboard-title {
    font-size: 2rem;
    font-weight: 700;
    color: $text-dark;
    margin: 0 0 0.5rem 0;
    display: flex;
    align-items: center;
    gap: 0.75rem;

    i {
      color: $purple-primary;
    }
  }

  .dashboard-subtitle {
    color: $text-light;
    margin: 0;
    font-size: 1rem;
  }
}

.header-actions {
  .refresh-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: $purple-primary;
    color: $white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover:not(:disabled) {
      background: $purple-hover;
      transform: translateY(-1px);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    &.loading i {
      animation: spin 1s linear infinite;
    }
  }
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: $text-light;

  .loading-spinner {
    font-size: 2rem;
    margin-bottom: 1rem;
    color: $purple-primary;

    i {
      animation: spin 1s linear infinite;
    }
  }
}

.dashboard-grid {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.metrics-section {
  .section-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: $text-dark;
    margin: 0 0 1rem 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &.full-width {
    grid-column: 1 / -1;
  }
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.metric-card {
  background: $white;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border-left: 4px solid transparent;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }

  &.primary {
    border-left-color: $purple-primary;
    .metric-icon {
      background: rgba($purple-primary, 0.1);
      color: $purple-primary;
    }
  }

  &.success {
    border-left-color: $success;
    .metric-icon {
      background: rgba($success, 0.1);
      color: $success;
    }
  }

  &.warning {
    border-left-color: $warning;
    .metric-icon {
      background: rgba($warning, 0.1);
      color: $warning;
    }
  }

  &.info {
    border-left-color: $info;
    .metric-icon {
      background: rgba($info, 0.1);
      color: $info;
    }
  }

  &.accent {
    border-left-color: $NICOLE-PURPLE;
    .metric-icon {
      background: rgba($NICOLE-PURPLE, 0.1);
      color: $NICOLE-PURPLE;
    }
  }

  &.secondary {
    border-left-color: $NICOLE-SECONDARY;
    .metric-icon {
      background: rgba($NICOLE-SECONDARY, 0.1);
      color: $NICOLE-SECONDARY;
    }
  }
}

.metric-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.metric-content {
  flex: 1;

  .metric-value {
    font-size: 1.75rem;
    font-weight: 700;
    color: $text-dark;
    margin: 0 0 0.25rem 0;
    line-height: 1;
  }

  .metric-label {
    color: $text-light;
    margin: 0;
    font-size: 0.875rem;
    font-weight: 500;
  }
}

.revenue-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

.revenue-card {
  background: $white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }

  .revenue-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;

    i {
      color: $purple-primary;
      font-size: 1.25rem;
    }

    h3 {
      margin: 0;
      font-size: 1rem;
      font-weight: 600;
      color: $text-dark;
    }
  }

  .revenue-amount {
    font-size: 1.5rem;
    font-weight: 700;
    color: $success;
  }
}

.zones-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.zone-item {
  background: $white;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);

  .zone-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;

    i {
      color: $purple-primary;
    }

    .zone-name {
      font-weight: 600;
      color: $text-dark;
    }
  }

  .zone-stats {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.25rem;

    .zone-count {
      font-size: 0.875rem;
      color: $text-light;
    }

    .zone-revenue {
      font-weight: 600;
      color: $success;
    }
  }
}

.recent-orders {
  background: $white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.orders-table {
  .table-header {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr 1fr 1fr;
    gap: 1rem;
    padding: 1rem 1.5rem;
    background: $background-cream;
    font-weight: 600;
    color: $text-dark;
    border-bottom: 1px solid $border-light;

    @media (max-width: 768px) {
      grid-template-columns: 1fr 1fr 1fr;
      span:nth-child(4),
      span:nth-child(5) {
        display: none;
      }
    }
  }

  .table-row {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr 1fr 1fr;
    gap: 1rem;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid $border-light;
    transition: background-color 0.2s ease;

    &:hover {
      background: $background-cream;
    }

    &:last-child {
      border-bottom: none;
    }

    @media (max-width: 768px) {
      grid-template-columns: 1fr 1fr 1fr;
      span:nth-child(4),
      span:nth-child(5) {
        display: none;
      }
    }
  }

  .order-id {
    font-family: 'Courier New', monospace;
    font-weight: 600;
    color: $purple-primary;
  }

  .customer-name {
    color: $text-dark;
    font-weight: 500;
  }

  .order-status {
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    text-align: center;

    &.status-pending {
      background: rgba($warning, 0.1);
      color: $warning;
    }

    &.status-confirmed {
      background: rgba($info, 0.1);
      color: $info;
    }

    &.status-processing {
      background: rgba($purple-primary, 0.1);
      color: $purple-primary;
    }

    &.status-delivered {
      background: rgba($success, 0.1);
      color: $success;
    }

    &.status-cancelled {
      background: rgba($error, 0.1);
      color: $error;
    }
  }

  .order-total {
    font-weight: 600;
    color: $success;
  }

  .order-date {
    color: $text-light;
    font-size: 0.875rem;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

// Responsive design
@media (max-width: 768px) {
  .dashboard-content {
    padding: 1rem;
  }

  .metrics-grid {
    grid-template-columns: 1fr;
  }

  .revenue-grid {
    grid-template-columns: 1fr;
  }
}
</style>