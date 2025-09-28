<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import type { StaffOrdersQueryParams } from '@/types/staff'

// Tipo mutable para filtros locales
type MutableFilters = {
  page: number
  limit: number
  status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded'
  deliveryZone?: 'samanes_suburbio' | 'norte_sur_esteros' | 'sambo' | 'via_costa' | 'aurora'
  startDate?: string
  endDate?: string
  search?: string
}

// Props
interface Props {
  loading?: boolean
  totalResults?: number
}

const props = defineProps({
  loading: {
    type: Boolean,
    required: false,
    default: false,
  },
  totalResults: {
    type: Number,
    required: false,
    default: 0,
  },
})

// Emits
const emit = defineEmits<{
  filtersChanged: [filters: StaffOrdersQueryParams]
  resetFilters: []
}>()

// Estado local de filtros
const filters = ref<MutableFilters>({
  page: 1,
  limit: 10,
  status: undefined,
  paymentStatus: undefined,
  deliveryZone: undefined,
  startDate: '',
  endDate: '',
  search: '',
})

// Estado de UI
const showAdvancedFilters = ref(false)
const isResetting = ref(false)

// Opciones para los filtros
const statusOptions = [
  { value: '', label: 'Todos los estados' },
  { value: 'pending', label: 'Pendiente' },
  { value: 'confirmed', label: 'Confirmada' },
  { value: 'processing', label: 'Procesando' },
  { value: 'shipped', label: 'Enviada' },
  { value: 'delivered', label: 'Entregada' },
  { value: 'cancelled', label: 'Cancelada' },
  { value: 'refunded', label: 'Reembolsada' },
]

const paymentStatusOptions = [
  { value: '', label: 'Todos los pagos' },
  { value: 'pending', label: 'Pendiente' },
  { value: 'paid', label: 'Pagado' },
  { value: 'failed', label: 'Fallido' },
  { value: 'refunded', label: 'Reembolsado' },
  { value: 'partially_refunded', label: 'Parcialmente reembolsado' },
]

const deliveryZoneOptions = [
  { value: '', label: 'Todas las zonas' },
  { value: 'samanes_suburbio', label: 'Samanes/Suburbio' },
  { value: 'norte_sur_esteros', label: 'Norte/Sur/Esteros' },
  { value: 'sambo', label: 'Sambo' },
  { value: 'via_costa', label: 'Vía Costa' },
  { value: 'aurora', label: 'Aurora' },
]

// Computed
const hasActiveFilters = computed(() => {
  return filters.value.status !== undefined ||
         filters.value.paymentStatus !== undefined ||
         filters.value.deliveryZone !== undefined ||
         filters.value.startDate !== '' ||
         filters.value.endDate !== '' ||
         filters.value.search !== ''
})

const activeFiltersCount = computed(() => {
  let count = 0
  if (filters.value.status) count++
  if (filters.value.paymentStatus) count++
  if (filters.value.deliveryZone) count++
  if (filters.value.startDate) count++
  if (filters.value.endDate) count++
  if (filters.value.search) count++
  return count
})

const dateRangeText = computed(() => {
  if (filters.value.startDate && filters.value.endDate) {
    return `${filters.value.startDate} - ${filters.value.endDate}`;
  } else if (filters.value.startDate) {
    return `Desde ${filters.value.startDate}`;
  } else if (filters.value.endDate) {
    return `Hasta ${filters.value.endDate}`;
  }
  return '';
})

// Métodos
const applyFilters = () => {
  // Reset page to 1 when applying new filters
  filters.value.page = 1
  emit('filtersChanged', { ...filters.value })
}

const resetFilters = () => {
  isResetting.value = true
  
  filters.value = {
    status: undefined,
    paymentStatus: undefined,
    deliveryZone: undefined,
    startDate: '',
    endDate: '',
    search: '',
    page: 1,
    limit: 20,
  }
  
  showAdvancedFilters.value = false
  
  setTimeout(() => {
    isResetting.value = false
    emit('resetFilters')
  }, 100)
}

const toggleAdvancedFilters = () => {
  showAdvancedFilters.value = !showAdvancedFilters.value
}

const setQuickDateFilter = (days: number) => {
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - days);
  
  filters.value.startDate = startDate.toISOString().split('T')[0];
  filters.value.endDate = today.toISOString().split('T')[0];
  applyFilters();
};

const clearDateFilter = () => {
  filters.value.startDate = '';
  filters.value.endDate = '';
  applyFilters();
};

// Watchers
watch(() => filters.value.search, (newSearch) => {
  // Debounce search
  const timeoutId = setTimeout(() => {
    applyFilters()
  }, 500)
  
  return () => clearTimeout(timeoutId)
}, { immediate: false })

// Lifecycle
onMounted(() => {
  // Apply initial filters
  applyFilters()
})
</script>

<template>
  <div class="order-filters">
    <!-- Search and Quick Actions -->
    <div class="filters-header">
      <div class="search-section">
        <div class="search-input-wrapper">
          <i class="search-icon icon-search"></i>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Buscar por cliente, email, teléfono o ID de orden..."
            class="search-input"
            :disabled="loading"
          />
          <button
            v-if="filters.search"
            @click="filters.search = ''; applyFilters()"
            class="clear-search-btn"
            title="Limpiar búsqueda"
          >
            <i class="icon-close"></i>
          </button>
        </div>
      </div>

      <div class="quick-actions">
        <button
          @click="toggleAdvancedFilters"
          class="toggle-filters-btn"
          :class="{ 'active': showAdvancedFilters }"
        >
          <i class="icon-filter"></i>
          Filtros
          <span v-if="activeFiltersCount > 0" class="filter-count">{{ activeFiltersCount }}</span>
        </button>

        <button
          v-if="hasActiveFilters"
          @click="resetFilters"
          class="reset-filters-btn"
          :disabled="isResetting"
        >
          <i class="icon-refresh"></i>
          Limpiar
        </button>
      </div>
    </div>

    <!-- Advanced Filters Panel -->
    <div v-if="showAdvancedFilters" class="advanced-filters">
      <div class="filters-grid">
        <!-- Status Filter -->
        <div class="filter-group">
          <label class="filter-label">Estado de Orden</label>
          <select v-model="filters.status" @change="applyFilters" class="filter-select">
            <option v-for="option in statusOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>

        <!-- Payment Status Filter -->
        <div class="filter-group">
          <label class="filter-label">Estado de Pago</label>
          <select v-model="filters.paymentStatus" @change="applyFilters" class="filter-select">
            <option v-for="option in paymentStatusOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>

        <!-- Delivery Zone Filter -->
        <div class="filter-group">
          <label class="filter-label">Zona de Entrega</label>
          <select v-model="filters.deliveryZone" @change="applyFilters" class="filter-select">
            <option v-for="option in deliveryZoneOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>


      </div>

      <!-- Date Range Filter -->
      <div class="date-filter-section">
        <div class="date-filter-header">
          <label class="filter-label">Rango de Fechas</label>
          <div class="quick-date-buttons">
            <button @click="setQuickDateFilter(1)" class="quick-date-btn">Hoy</button>
            <button @click="setQuickDateFilter(7)" class="quick-date-btn">7 días</button>
            <button @click="setQuickDateFilter(30)" class="quick-date-btn">30 días</button>
            <button @click="setQuickDateFilter(90)" class="quick-date-btn">90 días</button>
            <button v-if="dateRangeText" @click="clearDateFilter" class="clear-date-btn">
              Limpiar
            </button>
          </div>
        </div>

        <div class="date-inputs">
          <div class="date-input-group">
            <label class="date-label">Desde</label>
            <input
              v-model="filters.startDate"
              type="date"
              @change="applyFilters"
              class="date-input"
            />
          </div>
          <div class="date-input-group">
            <label class="date-label">Hasta</label>
            <input
              v-model="filters.endDate"
              type="date"
              @change="applyFilters"
              class="date-input"
            />
          </div>
        </div>

        <div v-if="dateRangeText" class="date-range-display">
          <i class="icon-calendar"></i>
          {{ dateRangeText }}
        </div>
      </div>
    </div>

    <!-- Active Filters Summary -->
    <div v-if="hasActiveFilters && !showAdvancedFilters" class="active-filters-summary">
      <div class="active-filters-list">
        <span class="active-filters-label">Filtros activos:</span>
        
        <span v-if="filters.status" class="filter-tag">
          Estado: {{ statusOptions.find(o => o.value === filters.status)?.label }}
          <button @click="filters.status = undefined; applyFilters()" class="remove-filter">×</button>
        </span>
        
        <span v-if="filters.paymentStatus" class="filter-tag">
          Pago: {{ paymentStatusOptions.find(o => o.value === filters.paymentStatus)?.label }}
          <button @click="filters.paymentStatus = undefined; applyFilters()" class="remove-filter">×</button>
        </span>
        
        <span v-if="filters.deliveryZone" class="filter-tag">
          Zona: {{ deliveryZoneOptions.find(o => o.value === filters.deliveryZone)?.label }}
          <button @click="filters.deliveryZone = undefined; applyFilters()" class="remove-filter">×</button>
        </span>
        
        <span v-if="dateRangeText" class="filter-tag">
          Fecha: {{ dateRangeText }}
          <button @click="clearDateFilter()" class="remove-filter">×</button>
        </span>
      </div>
      
      <button @click="resetFilters" class="clear-all-filters">
        Limpiar todos
      </button>
    </div>

    <!-- Results Summary -->
    <div v-if="totalResults !== null" class="results-summary">
      <span class="results-text">
        {{ totalResults }} {{ totalResults === 1 ? 'orden encontrada' : 'órdenes encontradas' }}
      </span>
      <span v-if="hasActiveFilters" class="filtered-indicator">
        (filtrado)
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.order-filters {
  background: $white;
  border: 1px solid $border-light;
  border-radius: 8px;
  overflow: hidden;
}

.filters-header {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  border-bottom: 1px solid $border-light;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
}

.search-section {
  flex: 1;
}

.search-input-wrapper {
  position: relative;
  width: 100%;

  .search-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: $text-light;
    font-size: 1rem;
  }

  .search-input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.5rem;
    border: 1px solid $border-light;
    border-radius: 6px;
    font-size: 1rem;
    transition: border-color 0.2s ease;

    &:focus {
      outline: none;
      border-color: $purple-primary;
      box-shadow: 0 0 0 3px rgba($purple-primary, 0.1);
    }

    &::placeholder {
      color: $text-light;
    }

    &:disabled {
      background: $background-light;
      cursor: not-allowed;
    }
  }

  .clear-search-btn {
    position: absolute;
    right: 0.5rem;
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
      color: $text-dark;
    }
  }
}

.quick-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.toggle-filters-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: $background-light;
  border: 1px solid $border-light;
  border-radius: 6px;
  color: $text-dark;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    background: $purple-light;
    border-color: $purple-primary;
    color: $purple-primary;
  }

  &.active {
    background: $purple-primary;
    border-color: $purple-primary;
    color: $white;
  }

  .filter-count {
    background: $error;
    color: $white;
    font-size: 0.75rem;
    padding: 0.125rem 0.375rem;
    border-radius: 10px;
    font-weight: 600;
    min-width: 1.25rem;
    text-align: center;
  }
}

.reset-filters-btn {
  padding: 0.75rem 1rem;
  background: $error-light;
  border: 1px solid $error;
  border-radius: 6px;
  color: $error-dark;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover:not(:disabled) {
    background: $error;
    color: $white;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.advanced-filters {
  padding: 1.5rem;
  background: $background-light;
  border-bottom: 1px solid $border-light;
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-label {
  font-weight: 600;
  color: $text-dark;
  font-size: 0.875rem;
}

.filter-select {
  padding: 0.5rem;
  border: 1px solid $border-light;
  border-radius: 6px;
  background: $white;
  color: $text-dark;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: $purple-primary;
    box-shadow: 0 0 0 3px rgba($purple-primary, 0.1);
  }
}

.date-filter-section {
  border-top: 1px solid $border-light;
  padding-top: 1.5rem;
}

.date-filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
}

.quick-date-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.quick-date-btn,
.clear-date-btn {
  padding: 0.375rem 0.75rem;
  border: 1px solid $border-light;
  background: $white;
  color: $text-dark;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s ease;

  &:hover {
    background: $purple-light;
    border-color: $purple-primary;
    color: $purple-primary;
  }
}

.clear-date-btn {
  background: $error-light;
  border-color: $error;
  color: $error-dark;

  &:hover {
    background: $error;
    color: $white;
  }
}

.date-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.date-input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.date-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: $text-dark;
}

.date-input {
  padding: 0.5rem;
  border: 1px solid $border-light;
  border-radius: 6px;
  background: $white;

  &:focus {
    outline: none;
    border-color: $purple-primary;
    box-shadow: 0 0 0 3px rgba($purple-primary, 0.1);
  }
}

.date-range-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: $purple-light;
  border: 1px solid $purple-primary;
  border-radius: 6px;
  color: $purple-primary;
  font-weight: 600;
}

.active-filters-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: $purple-light;
  border-bottom: 1px solid $border-light;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
}

.active-filters-list {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.active-filters-label {
  font-weight: 600;
  color: $purple-primary;
  margin-right: 0.5rem;
}

.filter-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  background: $white;
  border: 1px solid $purple-primary;
  border-radius: 20px;
  font-size: 0.875rem;
  color: $purple-primary;

  .remove-filter {
    background: none;
    border: none;
    color: $purple-primary;
    cursor: pointer;
    font-weight: bold;
    padding: 0;
    margin-left: 0.25rem;

    &:hover {
      color: $error;
    }
  }
}

.clear-all-filters {
  padding: 0.5rem 1rem;
  background: $error-light;
  border: 1px solid $error;
  border-radius: 6px;
  color: $error-dark;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s ease;

  &:hover {
    background: $error;
    color: $white;
  }
}

.results-summary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: $background-light;
  font-size: 0.875rem;
}

.results-text {
  font-weight: 600;
  color: $text-dark;
}

.filtered-indicator {
  color: $purple-primary;
  font-style: italic;
}

// Font Awesome icon classes
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
.icon-filter::before { 
  font-family: "Font Awesome 6 Free";
  font-weight: 900;
  content: "\f0b0"; 
}
.icon-refresh::before { 
  font-family: "Font Awesome 6 Free";
  font-weight: 900;
  content: "\f021"; 
}
.icon-calendar::before { 
  font-family: "Font Awesome 6 Free";
  font-weight: 900;
  content: "\f073"; 
}
</style>