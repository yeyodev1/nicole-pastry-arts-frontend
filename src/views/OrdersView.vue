<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { useOrdersStore } from '@/stores/orders.store'
import type { Order } from '@/types/orders'

// ===== STORES =====
const authStore = useAuthStore()
const ordersStore = useOrdersStore()

// ===== ESTADO REACTIVO =====
const selectedStatus = ref<string>('all')
const selectedPaymentStatus = ref<string>('all')
const currentPage = ref(1)
const searchQuery = ref('')
const showOrderDetails = ref(false)
const selectedOrder = ref<Order | null>(null)

// ===== COMPUTED =====
const isAuthenticated = computed(() => authStore.isAuthenticated)
const user = computed(() => authStore.user)
const customerOrders = computed(() => ordersStore.customerOrders)
const isLoading = computed(() => ordersStore.isLoading)
const hasError = computed(() => ordersStore.hasError)
const error = computed(() => ordersStore.error)
const pagination = computed(() => ordersStore.currentCustomerPagination)

// Filtros de estado
const statusOptions = [
  { value: 'all', label: 'Todos los estados', icon: 'fas fa-list' },
  { value: 'pending', label: 'Pendiente', icon: 'fas fa-clock' },
  { value: 'confirmed', label: 'Confirmado', icon: 'fas fa-check-circle' },
  { value: 'preparing', label: 'Preparando', icon: 'fas fa-utensils' },
  { value: 'ready', label: 'Listo', icon: 'fas fa-bell' },
  { value: 'delivered', label: 'Entregado', icon: 'fas fa-truck' },
  { value: 'cancelled', label: 'Cancelado', icon: 'fas fa-times-circle' }
]

const paymentStatusOptions = [
  { value: 'all', label: 'Todos los pagos', icon: 'fas fa-credit-card' },
  { value: 'pending', label: 'Pendiente', icon: 'fas fa-hourglass-half' },
  { value: 'paid', label: 'Pagado', icon: 'fas fa-check-circle' },
  { value: 'failed', label: 'Fallido', icon: 'fas fa-times-circle' },
  { value: 'refunded', label: 'Reembolsado', icon: 'fas fa-undo' }
]

// Órdenes filtradas
const filteredOrders = computed(() => {
  let filtered = [...customerOrders.value]

  // Filtrar por estado
  if (selectedStatus.value !== 'all') {
    filtered = filtered.filter(order => order.status === selectedStatus.value)
  }

  // Filtrar por estado de pago
  if (selectedPaymentStatus.value !== 'all') {
    filtered = filtered.filter(order => order.paymentStatus === selectedPaymentStatus.value)
  }

  // Filtrar por búsqueda
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(order => 
      order._id.toLowerCase().includes(query) ||
      order.items.some(item => item.productName.toLowerCase().includes(query))
    )
  }

  return filtered
})

// Estadísticas
const orderStats = computed(() => {
  const orders = customerOrders.value
  return {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    paid: orders.filter(o => o.paymentStatus === 'paid').length
  }
})

// ===== MÉTODOS =====
const loadUserOrders = async () => {
  if (!user.value?._id) {
    console.error('[ORDERS] No hay usuario autenticado')
    return
  }

  try {
    await ordersStore.fetchOrdersByCustomer(user.value._id, {
      page: currentPage.value,
      limit: 10
    })
  } catch (error) {
    console.error('[ORDERS] Error al cargar órdenes:', error)
  }
}

const loadMoreOrders = async () => {
  if (!pagination.value?.hasNextPage || isLoading.value) return
  
  currentPage.value += 1
  await loadUserOrders()
}

const openOrderDetails = (order: Order) => {
  selectedOrder.value = order
  showOrderDetails.value = true
}

const closeOrderDetails = () => {
  selectedOrder.value = null
  showOrderDetails.value = false
}

const getStatusColor = (status: string) => {
  const colors = {
    pending: 'warning',
    confirmed: 'info',
    preparing: 'primary',
    ready: 'success',
    delivered: 'success',
    cancelled: 'danger'
  }
  return colors[status as keyof typeof colors] || 'secondary'
}

const getPaymentStatusColor = (status: string) => {
  const colors = {
    pending: 'warning',
    paid: 'success',
    failed: 'danger',
    refunded: 'info'
  }
  return colors[status as keyof typeof colors] || 'secondary'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

// ===== WATCHERS =====
watch([selectedStatus, selectedPaymentStatus], () => {
  currentPage.value = 1
})

// ===== LIFECYCLE =====
onMounted(() => {
  if (isAuthenticated.value) {
    loadUserOrders()
  }
})

watch(isAuthenticated, (newValue) => {
  if (newValue) {
    loadUserOrders()
  }
})
</script>

<template>
  <div class="orders-view">
    <!-- Header -->
    <header class="orders-header">
      <div class="container">
        <div class="header-content">
          <div class="title-section">
            <h1 class="page-title">
              <i class="fas fa-shopping-bag"></i>
              Mis Órdenes
            </h1>
            <p class="page-subtitle">
              Gestiona y revisa todas tus órdenes
            </p>
          </div>

          <!-- Estadísticas -->
          <div class="stats-grid" v-if="!isLoading && customerOrders.length > 0">
            <div class="stat-card">
              <div class="stat-icon">
                <i class="fas fa-shopping-cart"></i>
              </div>
              <div class="stat-content">
                <span class="stat-number">{{ orderStats.total }}</span>
                <span class="stat-label">Total</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon stat-icon--warning">
                <i class="fas fa-clock"></i>
              </div>
              <div class="stat-content">
                <span class="stat-number">{{ orderStats.pending }}</span>
                <span class="stat-label">Pendientes</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon stat-icon--success">
                <i class="fas fa-truck"></i>
              </div>
              <div class="stat-content">
                <span class="stat-number">{{ orderStats.delivered }}</span>
                <span class="stat-label">Entregadas</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon stat-icon--primary">
                <i class="fas fa-check-circle"></i>
              </div>
              <div class="stat-content">
                <span class="stat-number">{{ orderStats.paid }}</span>
                <span class="stat-label">Pagadas</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Filtros y Búsqueda -->
    <section class="filters-section">
      <div class="container">
        <div class="filters-content">
          <!-- Búsqueda -->
          <div class="search-box">
            <div class="search-input-wrapper">
              <i class="fas fa-search search-icon"></i>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Buscar por ID de orden o producto..."
                class="search-input"
              />
            </div>
          </div>

          <!-- Filtros -->
          <div class="filters-grid">
            <div class="filter-group">
              <label class="filter-label">Estado de Orden</label>
              <select v-model="selectedStatus" class="filter-select">
                <option
                  v-for="option in statusOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
            </div>

            <div class="filter-group">
              <label class="filter-label">Estado de Pago</label>
              <select v-model="selectedPaymentStatus" class="filter-select">
                <option
                  v-for="option in paymentStatusOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contenido Principal -->
    <main class="orders-main">
      <div class="container">
        <!-- Estado de Carga -->
        <div v-if="isLoading && customerOrders.length === 0" class="loading-state">
          <div class="loading-spinner">
            <i class="fas fa-spinner fa-spin"></i>
          </div>
          <p class="loading-text">Cargando tus órdenes...</p>
        </div>

        <!-- Estado de Error -->
        <div v-else-if="hasError" class="error-state">
          <div class="error-icon">
            <i class="fas fa-exclamation-triangle"></i>
          </div>
          <h3 class="error-title">Error al cargar órdenes</h3>
          <p class="error-message">{{ error }}</p>
          <button @click="loadUserOrders" class="retry-button">
            <i class="fas fa-redo"></i>
            Reintentar
          </button>
        </div>

        <!-- Estado Vacío -->
        <div v-else-if="!isLoading && customerOrders.length === 0" class="empty-state">
          <div class="empty-icon">
            <i class="fas fa-shopping-bag"></i>
          </div>
          <h3 class="empty-title">No tienes órdenes aún</h3>
          <p class="empty-message">
            Cuando realices tu primera compra, aparecerá aquí.
          </p>
          <router-link to="/products" class="shop-button">
            <i class="fas fa-shopping-cart"></i>
            Ir a Comprar
          </router-link>
        </div>

        <!-- Lista de Órdenes -->
        <div v-else class="orders-list">
          <div
            v-for="order in filteredOrders"
            :key="order._id"
            class="order-card"
            @click="openOrderDetails(order)"
          >
            <!-- Header de la Orden -->
            <div class="order-header">
              <div class="order-id">
                <i class="fas fa-receipt"></i>
                <span class="order-number">#{{ order._id.slice(-8) }}</span>
              </div>
              <div class="order-date">
                {{ formatDate(order.createdAt) }}
              </div>
            </div>

            <!-- Estados -->
            <div class="order-status">
              <span class="status-badge" :class="`status-badge--${getStatusColor(order.status)}`">
                <i class="fas fa-circle"></i>
                {{ order.status }}
              </span>
              <span class="payment-badge" :class="`payment-badge--${getPaymentStatusColor(order.paymentStatus)}`">
                <i class="fas fa-credit-card"></i>
                {{ order.paymentStatus }}
              </span>
            </div>

            <!-- Items Preview -->
            <div class="order-items">
              <div class="items-summary">
                <span class="items-count">
                  {{ order.items.length }} {{ order.items.length === 1 ? 'producto' : 'productos' }}
                </span>
                <span class="items-preview">
                  {{ order.items.slice(0, 2).map(item => item.productName).join(', ') }}
                  <span v-if="order.items.length > 2">...</span>
                </span>
              </div>
            </div>

            <!-- Footer de la Orden -->
            <div class="order-footer">
              <div class="order-total">
                <span class="total-label">Total:</span>
                <span class="total-amount">{{ formatCurrency(order.total) }}</span>
              </div>
              <div class="order-actions">
                <button class="view-details-btn">
                  <i class="fas fa-eye"></i>
                  Ver Detalles
                </button>
              </div>
            </div>
          </div>

          <!-- Cargar Más -->
          <div v-if="pagination?.hasNextPage" class="load-more-section">
            <button
              @click="loadMoreOrders"
              :disabled="isLoading"
              class="load-more-button"
            >
              <i v-if="isLoading" class="fas fa-spinner fa-spin"></i>
              <i v-else class="fas fa-plus"></i>
              {{ isLoading ? 'Cargando...' : 'Cargar Más Órdenes' }}
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal de Detalles de Orden -->
    <div v-if="showOrderDetails && selectedOrder" class="modal-overlay" @click="closeOrderDetails">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">
            <i class="fas fa-receipt"></i>
            Detalles de Orden #{{ selectedOrder._id.slice(-8) }}
          </h3>
          <button @click="closeOrderDetails" class="modal-close">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="modal-body">
          <!-- Información General -->
          <div class="order-info-section">
            <h4 class="section-title">Información General</h4>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Fecha de Orden:</span>
                <span class="info-value">{{ formatDate(selectedOrder.createdAt) }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Estado:</span>
                <span class="status-badge" :class="`status-badge--${getStatusColor(selectedOrder.status)}`">
                  {{ selectedOrder.status }}
                </span>
              </div>
              <div class="info-item">
                <span class="info-label">Estado de Pago:</span>
                <span class="payment-badge" :class="`payment-badge--${getPaymentStatusColor(selectedOrder.paymentStatus)}`">
                  {{ selectedOrder.paymentStatus }}
                </span>
              </div>
              <div class="info-item">
                <span class="info-label">Método de Pago:</span>
                <span class="info-value">{{ selectedOrder.paymentMethod }}</span>
              </div>
            </div>
          </div>

          <!-- Items de la Orden -->
          <div class="order-items-section">
            <h4 class="section-title">Productos</h4>
            <div class="items-list">
              <div
                v-for="item in selectedOrder.items"
                :key="item.productId"
                class="item-row"
              >
                <div class="item-info">
                  <span class="item-name">{{ item.productName }}</span>
                  <span class="item-quantity">Cantidad: {{ item.quantity }}</span>
                </div>
                <div class="item-pricing">
                  <span class="item-unit-price">{{ formatCurrency(item.unitPrice) }}</span>
                  <span class="item-total-price">{{ formatCurrency(item.totalPrice) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Resumen de Costos -->
          <div class="order-summary-section">
            <h4 class="section-title">Resumen</h4>
            <div class="summary-rows">
              <div class="summary-row">
                <span class="summary-label">Subtotal:</span>
                <span class="summary-value">{{ formatCurrency(selectedOrder.subtotal) }}</span>
              </div>
              <div v-if="selectedOrder.discount > 0" class="summary-row">
                <span class="summary-label">Descuento:</span>
                <span class="summary-value summary-value--discount">
                  -{{ formatCurrency(selectedOrder.discount) }}
                </span>
              </div>
              <div v-if="selectedOrder.shippingCost > 0" class="summary-row">
                <span class="summary-label">Envío:</span>
                <span class="summary-value">{{ formatCurrency(selectedOrder.shippingCost) }}</span>
              </div>
              <div v-if="selectedOrder.tax > 0" class="summary-row">
                <span class="summary-label">Impuestos:</span>
                <span class="summary-value">{{ formatCurrency(selectedOrder.tax) }}</span>
              </div>
              <div class="summary-row summary-row--total">
                <span class="summary-label">Total:</span>
                <span class="summary-value">{{ formatCurrency(selectedOrder.total) }}</span>
              </div>
            </div>
          </div>

          <!-- Dirección de Envío -->
          <div v-if="selectedOrder.shippingAddress" class="shipping-section">
            <h4 class="section-title">Dirección de Envío</h4>
            <div class="address-info">
              <p class="address-line">
                <strong>{{ selectedOrder.shippingAddress.recipientName }}</strong>
              </p>
              <p class="address-line">{{ selectedOrder.shippingAddress.recipientPhone }}</p>
              <p v-if="selectedOrder.shippingAddress.street" class="address-line">
                {{ selectedOrder.shippingAddress.street }}
              </p>
              <p v-if="selectedOrder.shippingAddress.city" class="address-line">
                {{ selectedOrder.shippingAddress.city }}, {{ selectedOrder.shippingAddress.state }}
              </p>
            </div>
          </div>

          <!-- Notas -->
          <div v-if="selectedOrder.notes" class="notes-section">
            <h4 class="section-title">Notas</h4>
            <p class="notes-text">{{ selectedOrder.notes }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.orders-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

// ===== HEADER =====
.orders-header {
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  color: white;
  padding: 2rem 0;

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  .header-content {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .title-section {
    text-align: center;

    .page-title {
      font-size: 2.5rem;
      font-weight: 700;
      margin: 0 0 0.5rem 0;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      color: white;

      i {
        font-size: 2rem;
        color: white;
      }
    }

    .page-subtitle {
      font-size: 1.1rem;
      opacity: 0.9;
      margin: 0;
      color: white;
    }
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
  }

  .stat-card {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 12px;
    padding: 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    transition: transform 0.3s ease;

    &:hover {
      transform: translateY(-2px);
    }

    .stat-icon {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      color: #2c3e50;

      &--warning {
        background: #e0a800;
        color: white;
      }

      &--success {
        background: #1e7e34;
        color: white;
      }

      &--primary {
        background: #138496;
        color: white;
      }
    }

    .stat-content {
      display: flex;
      flex-direction: column;

      .stat-number {
        font-size: 1.8rem;
        font-weight: 700;
        line-height: 1;
      }

      .stat-label {
        font-size: 0.9rem;
        opacity: 0.8;
      }
    }
  }
}

// ===== FILTROS =====
.filters-section {
  background: white;
  border-bottom: 1px solid #e9ecef;
  padding: 1.5rem 0;

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  .filters-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .search-box {
    .search-input-wrapper {
      position: relative;
      max-width: 400px;

      .search-icon {
        position: absolute;
        left: 1rem;
        top: 50%;
        transform: translateY(-50%);
        color: #6c757d;
      }

      .search-input {
        width: 100%;
        padding: 0.75rem 1rem 0.75rem 2.5rem;
        border: 2px solid #e9ecef;
        border-radius: 8px;
        font-size: 1rem;
        transition: border-color 0.3s ease;

        &:focus {
          outline: none;
          border-color: #2c3e50;
        }
      }
    }
  }

  .filters-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }

  .filter-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    .filter-label {
      font-weight: 600;
      color: #495057;
      font-size: 0.9rem;
    }

    .filter-select {
      padding: 0.75rem;
      border: 2px solid #e9ecef;
      border-radius: 8px;
      font-size: 1rem;
      background: white;
      transition: border-color 0.3s ease;

      &:focus {
        outline: none;
        border-color: #2c3e50;
      }
    }
  }
}

// ===== CONTENIDO PRINCIPAL =====
.orders-main {
  padding: 2rem 0;

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }
}

// ===== ESTADOS =====
.loading-state,
.error-state,
.empty-state {
  text-align: center;
  padding: 4rem 2rem;

  .loading-spinner,
  .error-icon,
  .empty-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    color: #6c757d;
  }

  .loading-text,
  .error-title,
  .empty-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #495057;
  }

  .error-message,
  .empty-message {
    color: #6c757d;
    margin-bottom: 2rem;
  }

  .retry-button,
  .shop-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: #2c3e50;
    color: white;
    border: none;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 600;
    transition: background-color 0.3s ease;

    &:hover {
      background: #1a252f;
    }
  }
}

// ===== LISTA DE ÓRDENES =====
.orders-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.order-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }

  .order-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;

    .order-id {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 600;
      color: #2c3e50;

      i {
        font-size: 1.2rem;
      }

      .order-number {
        font-family: 'Courier New', monospace;
      }
    }

    .order-date {
      color: #6c757d;
      font-size: 0.9rem;
    }
  }

  .order-status {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }

  .status-badge,
  .payment-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: capitalize;

    i {
      font-size: 0.6rem;
    }
  }

  .status-badge {
    &--warning {
      background: #fff3cd;
      color: #856404;
    }

    &--info {
      background: #d1ecf1;
      color: #0c5460;
    }

    &--primary {
      background: #d1ecf1;
      color: #004085;
    }

    &--success {
      background: #d4edda;
      color: #155724;
    }

    &--danger {
      background: #f8d7da;
      color: #721c24;
    }
  }

  .payment-badge {
    &--warning {
      background: #fff3cd;
      color: #856404;
    }

    &--success {
      background: #d4edda;
      color: #155724;
    }

    &--danger {
      background: #f8d7da;
      color: #721c24;
    }

    &--info {
      background: #d1ecf1;
      color: #0c5460;
    }
  }

  .order-items {
    margin-bottom: 1rem;

    .items-summary {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;

      .items-count {
        font-weight: 600;
        color: #495057;
      }

      .items-preview {
        color: #6c757d;
        font-size: 0.9rem;
      }
    }
  }

  .order-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 1rem;
    border-top: 1px solid #e9ecef;

    .order-total {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;

      .total-label {
        font-size: 0.9rem;
        color: #6c757d;
      }

      .total-amount {
        font-size: 1.2rem;
        font-weight: 700;
        color: #2c3e50;
      }
    }

    .view-details-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: #2c3e50;
      color: white;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      transition: background-color 0.3s ease;

      &:hover {
        background: #1a252f;
      }
    }
  }
}

// ===== CARGAR MÁS =====
.load-more-section {
  text-align: center;
  margin-top: 2rem;

  .load-more-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 2rem;
    background: #2c3e50;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    transition: background-color 0.3s ease;

    &:hover:not(:disabled) {
      background: #1a252f;
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }
}

// ===== MODAL =====
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
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;

  .modal-title {
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #2c3e50;
  }

  .modal-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    color: #6c757d;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 50%;
    transition: background-color 0.3s ease;

    &:hover {
      background: #f8f9fa;
    }
  }
}

.modal-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.section-title {
  margin: 0 0 1rem 0;
  color: #495057;
  font-size: 1.1rem;
  font-weight: 600;
  border-bottom: 2px solid #e9ecef;
  padding-bottom: 0.5rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  .info-label {
    font-weight: 600;
    color: #6c757d;
    font-size: 0.9rem;
  }

  .info-value {
    color: #495057;
  }
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.item-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;

  .item-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    .item-name {
      font-weight: 600;
      color: #495057;
    }

    .item-quantity {
      font-size: 0.9rem;
      color: #6c757d;
    }
  }

  .item-pricing {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.25rem;

    .item-unit-price {
      font-size: 0.9rem;
      color: #6c757d;
    }

    .item-total-price {
      font-weight: 600;
      color: #2c3e50;
    }
  }
}

.summary-rows {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;

  &--total {
    border-top: 2px solid #e9ecef;
    margin-top: 0.5rem;
    padding-top: 1rem;
    font-weight: 700;
    font-size: 1.1rem;
  }

  .summary-label {
    color: #6c757d;
  }

  .summary-value {
    font-weight: 600;
    color: #495057;

    &--discount {
      color: #28a745;
    }
  }
}

.address-info {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;

  .address-line {
    margin: 0 0 0.5rem 0;
    color: #495057;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.notes-text {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  margin: 0;
  color: #495057;
  font-style: italic;
}

// ===== RESPONSIVE =====
@media (max-width: 768px) {
  .orders-header {
    .page-title {
      font-size: 2rem;
      flex-direction: column;
      gap: 0.5rem;
    }

    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .filters-content {
    .search-box .search-input-wrapper {
      max-width: 100%;
    }

    .filters-grid {
      grid-template-columns: 1fr;
    }
  }

  .order-card {
    .order-footer {
      flex-direction: column;
      gap: 1rem;
      align-items: stretch;

      .view-details-btn {
        justify-content: center;
      }
    }
  }

  .modal-content {
    margin: 1rem;
    max-height: calc(100vh - 2rem);
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .item-row {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;

    .item-pricing {
      align-items: flex-start;
    }
  }
}

@media (max-width: 480px) {
  .orders-header {
    .stats-grid {
      grid-template-columns: 1fr;
    }

    .stat-card {
      padding: 1rem;
    }
  }

  .order-card {
    padding: 1rem;

    .order-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }
  }
}
</style>