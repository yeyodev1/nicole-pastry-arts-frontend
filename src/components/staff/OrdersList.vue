<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStaffStore } from '@/stores/staff.store'
import type { Order } from '@/types/orders'

// Interfaz para customer populado
interface PopulatedCustomer {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone: string
}

// Tipo extendido de Order con customer populado
interface OrderWithPopulatedCustomer extends Omit<Order, 'customer'> {
  customer: PopulatedCustomer | string
}

// Props
const props = defineProps({
  orders: {
    type: Array as () => Order[],
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  pagination: {
    type: Object,
    default: null,
  },
})

// Emits
const emit = defineEmits<{
  orderSelect: [order: Order]
  pageChange: [page: number]
  orderUpdate: []
}>()

// Store
const staffStore = useStaffStore()

// Estado local
const selectedOrderIds = ref<Set<string>>(new Set())
const sortColumn = ref<string>('createdAt')
const sortDirection = ref<'asc' | 'desc'>('desc')

// Computed
const sortedOrders = computed(() => {
  if (!props.orders.length) return []
  
  return [...props.orders].sort((a, b) => {
    const aValue = getNestedValue(a, sortColumn.value)
    const bValue = getNestedValue(b, sortColumn.value)
    
    if (aValue === bValue) return 0
    
    const comparison = aValue > bValue ? 1 : -1
    return sortDirection.value === 'asc' ? comparison : -comparison
  })
})

const hasSelection = computed(() => selectedOrderIds.value.size > 0)

const allSelected = computed(() => 
  props.orders.length > 0 && selectedOrderIds.value.size === props.orders.length
)

const someSelected = computed(() => 
  selectedOrderIds.value.size > 0 && selectedOrderIds.value.size < props.orders.length
)

// Métodos
const getNestedValue = (obj: any, path: string): any => {
  return path.split('.').reduce((current, key) => current?.[key], obj)
}

const formatDate = (dateString: string): string => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

const getCustomerName = (customer: any): string => {
  if (typeof customer === 'object' && customer) {
    const firstName = customer.firstName || ''
    const lastName = customer.lastName || ''
    return `${firstName} ${lastName}`.trim() || 'N/A'
  }
  return 'N/A'
}

const getCustomerEmail = (customer: any): string => {
  if (typeof customer === 'object' && customer?.email) {
    return customer.email
  }
  return 'N/A'
}

const getStatusClass = (status: string): string => {
  const statusClasses: Record<string, string> = {
    'pending': 'status-pending',
    'confirmed': 'status-confirmed',
    'preparing': 'status-preparing',
    'ready': 'status-ready',
    'delivered': 'status-delivered',
    'cancelled': 'status-cancelled'
  }
  return statusClasses[status] || 'status-default'
}

const getPaymentStatusClass = (status: string): string => {
  const statusClasses: Record<string, string> = {
    'pending': 'payment-pending',
    'paid': 'payment-paid',
    'failed': 'payment-failed',
    'refunded': 'payment-refunded'
  }
  return statusClasses[status] || 'payment-default'
}

const handleSort = (column: string) => {
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortColumn.value = column
    sortDirection.value = 'asc'
  }
}

const handleOrderClick = (order: Order) => {
  emit('orderSelect', order)
}

const toggleOrderSelection = (orderId: string) => {
  if (selectedOrderIds.value.has(orderId)) {
    selectedOrderIds.value.delete(orderId)
  } else {
    selectedOrderIds.value.add(orderId)
  }
}

const toggleSelectAll = () => {
  if (allSelected.value) {
    selectedOrderIds.value.clear()
  } else {
    selectedOrderIds.value = new Set(props.orders.map(order => order._id))
  }
}

const clearSelection = () => {
  selectedOrderIds.value.clear()
}

const handlePageChange = (page: number) => {
  clearSelection()
  emit('pageChange', page)
}

const updateOrderStatus = async (orderId: string, status: string) => {
  try {
    const validStatus = status as 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
    await staffStore.updateOrderStatus(orderId, { status: validStatus })
    emit('orderUpdate')
  } catch (error) {
    console.error('Error updating order status:', error)
  }
}

const updatePaymentStatus = async (orderId: string, paymentStatus: string) => {
  try {
    const validPaymentStatus = paymentStatus as 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded'
    await staffStore.updatePaymentStatus(orderId, { paymentStatus: validPaymentStatus })
    emit('orderUpdate')
  } catch (error) {
    console.error('Error updating payment status:', error)
  }
}
</script>

<template>
  <div class="orders-list">
    <!-- Selection Actions -->
    <div v-if="hasSelection" class="selection-actions">
      <div class="selection-info">
        <span>{{ selectedOrderIds.size }} órdenes seleccionadas</span>
        <button @click="clearSelection" class="clear-selection">
          Limpiar selección
        </button>
      </div>
      
      <div class="bulk-actions">
        <select class="bulk-action-select">
          <option value="">Acciones en lote</option>
          <option value="confirm">Confirmar órdenes</option>
          <option value="prepare">Marcar como preparando</option>
          <option value="ready">Marcar como listas</option>
        </select>
        <button class="apply-bulk-action">Aplicar</button>
      </div>
    </div>

    <!-- Table -->
    <div class="table-container">
      <table class="orders-table">
        <thead>
          <tr>
            <th class="checkbox-column">
              <input
                type="checkbox"
                :checked="allSelected"
                :indeterminate="someSelected"
                @change="toggleSelectAll"
              />
            </th>
            <th 
              class="sortable"
              @click="handleSort('_id')"
              :class="{ 'sorted': sortColumn === '_id' }"
            >
              ID Orden
              <i 
                class="sort-icon"
                :class="{
                  'asc': sortColumn === '_id' && sortDirection === 'asc',
                  'desc': sortColumn === '_id' && sortDirection === 'desc'
                }"
              ></i>
            </th>
            <th 
              class="sortable"
              @click="handleSort('customer.firstName')"
              :class="{ 'sorted': sortColumn === 'customer.firstName' }"
            >
              Cliente
              <i 
                class="sort-icon"
                :class="{
                  'asc': sortColumn === 'customer.firstName' && sortDirection === 'asc',
                  'desc': sortColumn === 'customer.firstName' && sortDirection === 'desc'
                }"
              ></i>
            </th>
            <th 
              class="sortable"
              @click="handleSort('total')"
              :class="{ 'sorted': sortColumn === 'total' }"
            >
              Total
              <i 
                class="sort-icon"
                :class="{
                  'asc': sortColumn === 'total' && sortDirection === 'asc',
                  'desc': sortColumn === 'total' && sortDirection === 'desc'
                }"
              ></i>
            </th>
            <th>Estado</th>
            <th>Pago</th>
            <th 
              class="sortable"
              @click="handleSort('createdAt')"
              :class="{ 'sorted': sortColumn === 'createdAt' }"
            >
              Fecha
              <i 
                class="sort-icon"
                :class="{
                  'asc': sortColumn === 'createdAt' && sortDirection === 'asc',
                  'desc': sortColumn === 'createdAt' && sortDirection === 'desc'
                }"
              ></i>
            </th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="order in sortedOrders" 
            :key="order._id"
            class="order-row"
            :class="{ 'selected': selectedOrderIds.has(order._id) }"
            @click="handleOrderClick(order)"
          >
            <td class="checkbox-column" @click.stop>
              <input
                type="checkbox"
                :checked="selectedOrderIds.has(order._id)"
                @change="toggleOrderSelection(order._id)"
              />
            </td>
            <td class="order-id">
              <span class="id-text">#{{ order._id.slice(-8).toUpperCase() }}</span>
            </td>
            <td class="customer-info">
              <div class="customer-details">
                <span class="customer-name">{{ getCustomerName(order.customer) }}</span>
                <span class="customer-email">{{ getCustomerEmail(order.customer) }}</span>
              </div>
            </td>
            <td class="order-total">
              <span class="total-amount">{{ formatCurrency(order.total || 0) }}</span>
            </td>
            <td class="order-status">
              <select 
                :value="order.status"
                @change="updateOrderStatus(order._id, ($event.target as HTMLSelectElement).value)"
                @click.stop
                class="status-select"
                :class="getStatusClass(order.status)"
              >
                <option value="pending">Pendiente</option>
                <option value="confirmed">Confirmada</option>
                <option value="preparing">Preparando</option>
                <option value="ready">Lista</option>
                <option value="delivered">Entregada</option>
                <option value="cancelled">Cancelada</option>
              </select>
            </td>
            <td class="payment-status">
              <select 
                :value="order.paymentStatus"
                @change="updatePaymentStatus(order._id, ($event.target as HTMLSelectElement).value)"
                @click.stop
                class="payment-select"
                :class="getPaymentStatusClass(order.paymentStatus)"
              >
                <option value="pending">Pendiente</option>
                <option value="paid">Pagado</option>
                <option value="failed">Fallido</option>
                <option value="refunded">Reembolsado</option>
              </select>
            </td>
            <td class="order-date">
              <span class="date-text">{{ formatDate(order.createdAt) }}</span>
            </td>
            <td class="order-actions" @click.stop>
              <div class="action-buttons">
                <button 
                  @click="handleOrderClick(order)"
                  class="action-btn view-btn"
                  title="Ver detalles"
                >
                  <i class="icon-eye"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Empty State -->
      <div v-if="!loading && orders.length === 0" class="empty-state">
        <div class="empty-content">
          <i class="icon-empty"></i>
          <h3>No hay órdenes</h3>
          <p>No se encontraron órdenes con los filtros aplicados.</p>
        </div>
      </div>

      <!-- Loading Overlay -->
      <div v-if="loading" class="loading-overlay">
        <div class="loading-spinner"></div>
        <span>Cargando órdenes...</span>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="pagination && pagination.totalPages > 1" class="pagination">
      <div class="pagination-info">
        Mostrando {{ ((pagination.currentPage - 1) * 20) + 1 }} - 
        {{ Math.min(pagination.currentPage * 20, pagination.totalCount) }} 
        de {{ pagination.totalCount }} órdenes
      </div>
      
      <div class="pagination-controls">
        <button 
          @click="handlePageChange(pagination.currentPage - 1)"
          :disabled="!pagination.hasPrevPage"
          class="pagination-btn"
        >
          Anterior
        </button>
        
        <div class="page-numbers">
          <button
            v-for="page in Math.min(pagination.totalPages, 5)"
            :key="page"
            @click="handlePageChange(page)"
            :class="{ 'active': page === pagination.currentPage }"
            class="page-btn"
          >
            {{ page }}
          </button>
        </div>
        
        <button 
          @click="handlePageChange(pagination.currentPage + 1)"
          :disabled="!pagination.hasNextPage"
          class="pagination-btn"
        >
          Siguiente
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.orders-list {
  width: 100%;
}

.selection-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: $purple-light;
  border-bottom: 1px solid $border-light;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
}

.selection-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-weight: 600;
  color: $purple-primary;

  .clear-selection {
    background: none;
    border: none;
    color: $purple-primary;
    text-decoration: underline;
    cursor: pointer;
    font-size: 0.875rem;

    &:hover {
      color: $purple-dark;
    }
  }
}

.bulk-actions {
  display: flex;
  gap: 0.5rem;

  .bulk-action-select {
    padding: 0.5rem;
    border: 1px solid $border-light;
    border-radius: 6px;
    background: $white;
  }

  .apply-bulk-action {
    padding: 0.5rem 1rem;
    background: $purple-primary;
    color: $white;
    border: none;
    border-radius: 6px;
    cursor: pointer;

    &:hover {
      background: $purple-dark;
    }
  }
}

.table-container {
  position: relative;
  overflow-x: auto;
}

.orders-table {
  width: 100%;
  border-collapse: collapse;
  background: $white;

  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid $border-light;

    @media (max-width: 768px) {
      padding: 0.75rem 0.5rem;
      font-size: 0.875rem;
    }
  }

  th {
    background: $background-light;
    font-weight: 600;
    color: $text-dark;
    position: sticky;
    top: 0;
    z-index: 10;

    &.sortable {
      cursor: pointer;
      user-select: none;
      position: relative;

      &:hover {
        background: $gray-200;
      }

      &.sorted {
        background: $purple-light;
        color: $purple-primary;
      }
    }
  }

  .sort-icon {
    margin-left: 0.5rem;
    opacity: 0.5;
    font-size: 0.75rem;

    &.asc::before { content: "▲"; }
    &.desc::before { content: "▼"; }
  }

  .checkbox-column {
    width: 50px;
    text-align: center;
  }

  .order-row {
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
      background: $background-light;
    }

    &.selected {
      background: $purple-light;
    }
  }

  .order-id {
    font-family: monospace;
    font-weight: 600;
    color: $purple-primary;
  }

  .customer-details {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    .customer-name {
      font-weight: 600;
      color: $text-dark;
    }

    .customer-email {
      font-size: 0.875rem;
      color: $text-light;
    }
  }

  .total-amount {
    font-weight: 700;
    color: $success;
    font-size: 1.1rem;
  }

  .status-select,
  .payment-select {
    padding: 0.25rem 0.5rem;
    border: 1px solid $border-light;
    border-radius: 4px;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;

    &.status-pending { background: $warning-light; color: $warning-dark; }
    &.status-confirmed { background: $purple-light; color: $purple-dark; }
    &.status-preparing { background: $purple-light; color: $purple-primary; }
    &.status-ready { background: $success-light; color: $success-dark; }
    &.status-delivered { background: $success; color: $white; }
    &.status-cancelled { background: $error-light; color: $error-dark; }

    &.payment-pending { background: $warning-light; color: $warning-dark; }
    &.payment-paid { background: $success; color: $white; }
    &.payment-failed { background: $error-light; color: $error-dark; }
    &.payment-refunded { background: $purple-light; color: $purple-dark; }
  }

  .date-text {
    font-size: 0.875rem;
    color: $text-light;
  }

  .action-buttons {
    display: flex;
    gap: 0.5rem;
  }

  .action-btn {
    padding: 0.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;

    &.view-btn {
      background: $purple-light;
      color: $purple-primary;

      &:hover {
        background: $purple-primary;
        color: $white;
      }
    }
  }
}

.empty-state {
  padding: 4rem 2rem;
  text-align: center;
  color: $text-light;

  .empty-content {
    max-width: 300px;
    margin: 0 auto;

    .icon-empty {
      font-size: 3rem;
      margin-bottom: 1rem;
      opacity: 0.5;
    }

    h3 {
      margin: 0 0 0.5rem 0;
      color: $text-dark;
    }

    p {
      margin: 0;
      font-size: 0.875rem;
    }
  }
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  z-index: 20;

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid $border-light;
    border-top: 4px solid $purple-primary;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-top: 1px solid $border-light;
  background: $background-light;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
}

.pagination-info {
  color: $text-light;
  font-size: 0.875rem;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pagination-btn,
.page-btn {
  padding: 0.5rem 1rem;
  border: 1px solid $border-light;
  background: $white;
  color: $text-dark;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: $purple-light;
    border-color: $purple-primary;
    color: $purple-primary;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &.active {
    background: $purple-primary;
    border-color: $purple-primary;
    color: $white;
  }
}

.page-numbers {
  display: flex;
  gap: 0.25rem;
}

// Font Awesome icon classes
.icon-eye::before { 
  font-family: "Font Awesome 6 Free";
  font-weight: 900;
  content: "\f06e"; 
}
.icon-empty::before { 
  font-family: "Font Awesome 6 Free";
  font-weight: 900;
  content: "\f0ea"; 
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>