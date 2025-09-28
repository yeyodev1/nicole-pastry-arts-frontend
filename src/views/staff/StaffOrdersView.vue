<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useStaffStore } from '@/stores/staff.store'
import OrderFilters from '@/components/staff/OrderFilters.vue'
import OrdersList from '@/components/staff/OrdersList.vue'
import OrderDetailsModal from '@/components/staff/OrderDetailsModal.vue'
import LoadingScreen from '@/components/LoadingScreen.vue'
import type { StaffOrdersQueryParams } from '@/types/staff'
import type { Order } from '@/types/orders'

// Tipo mutable para filtros locales
interface MutableFilters {
  page?: number
  limit?: number
  search?: string
  status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded'
  deliveryZone?: 'samanes_suburbio' | 'norte_sur_esteros' | 'sambo' | 'via_costa' | 'aurora'
  startDate?: string
  endDate?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// Store
const staffStore = useStaffStore()

// Estado local
const showFilters = ref(false)
const selectedOrderId = ref<string | null>(null)
const showOrderDetails = ref(false)
const currentPage = ref(1)
const searchQuery = ref('')

// Filtros activos
const activeFilters = ref<MutableFilters>({
  page: 1,
  limit: 20,
  sortBy: 'createdAt',
  sortOrder: 'desc'
})

// Computed properties
const isLoading = computed(() => staffStore.isLoading)
const orders = computed(() => staffStore.orders)
const pagination = computed(() => staffStore.pagination)
const hasErrors = computed(() => staffStore.hasErrors)
const ordersError = computed(() => staffStore.ordersError)

const totalOrders = computed(() => pagination.value?.totalCount || 0)
const currentPageDisplay = computed(() => pagination.value?.currentPage || 1)
const totalPages = computed(() => pagination.value?.totalPages || 1)

// Métodos
const fetchOrders = async (filters?: StaffOrdersQueryParams) => {
  try {
    const params = { ...activeFilters.value, ...filters }
    await staffStore.fetchOrders(params)
  } catch (error) {
    console.error('Error fetching orders:', error)
  }
}

const handleFiltersChange = (filters: StaffOrdersQueryParams) => {
  activeFilters.value = { ...activeFilters.value, ...filters, page: 1 }
  currentPage.value = 1
  fetchOrders(activeFilters.value)
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  activeFilters.value.page = page
  fetchOrders(activeFilters.value)
}

const handleOrderSelect = (order: Order) => {
  selectedOrderId.value = order._id
  showOrderDetails.value = true
}

const handleOrderUpdate = () => {
  // Refrescar la lista después de actualizar una orden
  fetchOrders(activeFilters.value)
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    activeFilters.value.search = searchQuery.value.trim()
  } else {
    delete activeFilters.value.search
  }
  activeFilters.value.page = 1
  currentPage.value = 1
  fetchOrders(activeFilters.value)
}

const clearSearch = () => {
  searchQuery.value = ''
  delete activeFilters.value.search
  activeFilters.value.page = 1
  currentPage.value = 1
  fetchOrders(activeFilters.value)
}

const refreshOrders = () => {
  fetchOrders(activeFilters.value)
}

// Lifecycle
onMounted(() => {
  fetchOrders()
})

// Watchers
watch(searchQuery, (newValue) => {
  if (!newValue.trim()) {
    clearSearch()
  }
})
</script>

<template>
  <div class="staff-orders-view">
    <!-- Header -->
    <div class="orders-header">
      <div class="header-content">
        <div class="title-section">
          <h1 class="page-title">Gestión de Órdenes</h1>
          <p class="page-subtitle">
            Administra y supervisa todas las órdenes del sistema
          </p>
        </div>
        
        <div class="header-actions">
          <button 
            class="btn-refresh"
            @click="refreshOrders"
            :disabled="isLoading"
          >
            <i class="icon-refresh" :class="{ 'spinning': isLoading }"></i>
            Actualizar
          </button>
          
          <button 
            class="btn-filters"
            @click="showFilters = !showFilters"
            :class="{ 'active': showFilters }"
          >
            <i class="icon-filter"></i>
            Filtros
          </button>
        </div>
      </div>

      <!-- Search Bar -->
      <div class="search-section">
        <div class="search-container">
          <div class="search-input-wrapper">
            <i class="icon-search"></i>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar por ID, cliente, email o teléfono..."
              class="search-input"
              @keyup.enter="handleSearch"
            />
            <button 
              v-if="searchQuery"
              @click="clearSearch"
              class="clear-search"
            >
              <i class="icon-close"></i>
            </button>
          </div>
          <button 
            @click="handleSearch"
            class="search-btn"
            :disabled="!searchQuery.trim()"
          >
            Buscar
          </button>
        </div>
      </div>

      <!-- Stats Summary -->
      <div class="stats-summary">
        <div class="stat-item">
          <span class="stat-label">Total de Órdenes</span>
          <span class="stat-value">{{ totalOrders.toLocaleString() }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Página Actual</span>
          <span class="stat-value">{{ currentPageDisplay }} de {{ totalPages }}</span>
        </div>
      </div>
    </div>

    <!-- Filters Panel -->
    <Transition name="slide-down">
      <OrderFilters
        v-if="showFilters"
        :active-filters="activeFilters"
        @filters-change="handleFiltersChange"
        @close="showFilters = false"
      />
    </Transition>

    <!-- Error State -->
    <div v-if="hasErrors && ordersError" class="error-container">
      <div class="error-message">
        <i class="icon-error"></i>
        <span>{{ ordersError }}</span>
        <button @click="refreshOrders" class="retry-btn">
          Reintentar
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <LoadingScreen 
      v-if="isLoading && orders.length === 0" 
      :onLoadingComplete="() => {}"
    />

    <!-- Orders List -->
    <div v-else class="orders-content">
      <OrdersList
        :orders="[...orders]"
        :loading="isLoading"
        :pagination="pagination || undefined"
        @order-select="handleOrderSelect"
        @page-change="handlePageChange"
        @order-update="handleOrderUpdate"
      />
    </div>

    <!-- Order Details Modal -->
    <OrderDetailsModal
      v-if="showOrderDetails && selectedOrderId"
      :order-id="selectedOrderId"
      @close="showOrderDetails = false"
      @order-updated="handleOrderUpdate"
    />
  </div>
</template>

<style lang="scss" scoped>
.staff-orders-view {
  min-height: 100vh;
  background: $background-light;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
}

.orders-header {
  background: $white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 1.5rem;
    margin-bottom: 1rem;
  }
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
}

.title-section {
  .page-title {
    font-size: 2rem;
    font-weight: 700;
    color: $text-dark;
    margin: 0 0 0.5rem 0;
    font-family: $font-principal;

    @media (max-width: 768px) {
      font-size: 1.5rem;
    }
  }

  .page-subtitle {
    color: $text-light;
    font-size: 1rem;
    margin: 0;
  }
}

.header-actions {
  display: flex;
  gap: 1rem;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-end;
  }
}

.btn-refresh,
.btn-filters {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: 2px solid $purple-primary;
  border-radius: 8px;
  background: transparent;
  color: $purple-primary;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: $purple-primary;
    color: $white;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &.active {
    background: $purple-primary;
    color: $white;
  }

  i {
    font-size: 1rem;

    &.spinning {
      animation: spin 1s linear infinite;
    }
  }
}

.search-section {
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
  }
}

.search-container {
  display: flex;
  gap: 1rem;
  max-width: 600px;

  @media (max-width: 768px) {
    flex-direction: column;
    max-width: 100%;
  }
}

.search-input-wrapper {
  position: relative;
  flex: 1;

  .icon-search {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: $text-light;
    font-size: 1rem;
  }

  .search-input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 3rem;
    border: 2px solid $border-light;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.3s ease;

    &:focus {
      outline: none;
      border-color: $purple-primary;
    }

    &::placeholder {
      color: $text-light;
    }
  }

  .clear-search {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: $text-light;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 4px;

    &:hover {
      background: $background-light;
    }
  }
}

.search-btn {
  padding: 0.75rem 2rem;
  background: $purple-primary;
  color: $white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover:not(:disabled) {
    background: $purple-dark;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
}

.stats-summary {
  display: flex;
  gap: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid $border-light;

  @media (max-width: 768px) {
    gap: 1rem;
    flex-wrap: wrap;
  }
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  .stat-label {
    font-size: 0.875rem;
    color: $text-light;
    font-weight: 500;
  }

  .stat-value {
    font-size: 1.25rem;
    font-weight: 700;
    color: $purple-primary;
  }
}

.error-container {
  margin-bottom: 2rem;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: $error-light;
  border: 1px solid $error;
  border-radius: 8px;
  color: $error-dark;

  .icon-error {
    font-size: 1.25rem;
    color: $error;
  }

  .retry-btn {
    margin-left: auto;
    padding: 0.5rem 1rem;
    background: $error;
    color: $white;
    border: none;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background: $error-dark;
    }
  }
}

.orders-content {
  background: $white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

// Transitions
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

// Animations
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

// Font Awesome icon classes
.icon-refresh::before { 
  font-family: "Font Awesome 6 Free";
  font-weight: 900;
  content: "\f021"; 
}
.icon-filter::before { 
  font-family: "Font Awesome 6 Free";
  font-weight: 900;
  content: "\f0b0"; 
}
.icon-search::before { 
  font-family: "Font Awesome 6 Free";
  font-weight: 900;
  content: "\f002"; 
}
.icon-close::before { 
  font-family: "Font Awesome 6 Free";
  font-weight: 900;
  content: "\f00d"; 
}
.icon-error::before { 
  font-family: "Font Awesome 6 Free";
  font-weight: 900;
  content: "\f071"; 
}
</style>