<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStaffStore } from '@/stores/staff.store'
import type { Order } from '@/types/orders'

// Tipos para los status basados en la definición de Order
type OrderStatus = Order['status']
type PaymentStatus = Order['paymentStatus']

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
  order: {
    type: Object as () => OrderWithPopulatedCustomer | null,
    default: null,
  },
  isVisible: {
    type: Boolean,
    default: false,
  },
})

// Emits
const emit = defineEmits<{
  close: []
  orderUpdated: []
}>()

// Store
const staffStore = useStaffStore()

// Estado local
const isLoading = ref(false)

// Computed properties
const customerEmail = computed(() => {
  if (!props.order?.customer || typeof props.order.customer === 'string') {
    return 'N/A'
  }
  return props.order.customer.email || 'N/A'
})

const customerPhone = computed(() => {
  if (!props.order?.customer || typeof props.order.customer === 'string') {
    return 'N/A'
  }
  return props.order.customer.phone || 'N/A'
})

const customerName = computed(() => {
  if (!props.order?.customer || typeof props.order.customer === 'string') {
    return 'N/A'
  }
  const customer = props.order.customer
  return `${customer.firstName} ${customer.lastName}`.trim() || 'N/A'
})

// Métodos
const closeModal = () => {
  emit('close')
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
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

const updateOrderStatus = async (newStatus: OrderStatus) => {
  if (!props.order) return
  
  try {
    isLoading.value = true
    await staffStore.updateOrderStatus(props.order._id, { status: newStatus })
    emit('orderUpdated')
  } catch (error) {
    console.error('Error updating order status:', error)
  } finally {
    isLoading.value = false
  }
}

const updatePaymentStatus = async (newStatus: PaymentStatus) => {
  if (!props.order) return
  
  try {
    isLoading.value = true
    await staffStore.updatePaymentStatus(props.order._id, { paymentStatus: newStatus })
    emit('orderUpdated')
  } catch (error) {
    console.error('Error updating payment status:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div v-if="isVisible" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>Detalles de la Orden</h2>
        <button class="close-button" @click="closeModal">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div class="modal-body">
        <div v-if="isLoading" class="loading-state">
          <div class="spinner"></div>
          <p>Cargando detalles de la orden...</p>
        </div>

        <div v-else-if="order" class="order-details">
          <!-- Order Header -->
          <div class="order-header">
            <div class="order-number">
              <h3>Orden #{{ order.orderNumber }}</h3>
              <div class="status-badges">
                <span class="status-badge" :class="`status-${order.status}`">
                  {{ order.status }}
                </span>
                <span class="status-badge" :class="`status-${order.paymentStatus}`">
                  {{ order.paymentStatus }}
                </span>
              </div>
            </div>
            <div class="order-dates">
              <p><strong>Creada:</strong> {{ formatDate(order.createdAt) }}</p>
              <p v-if="order.deliveryDateWithMargin">
                <strong>Entrega:</strong> {{ formatDate(order.deliveryDateWithMargin) }}
              </p>
            </div>
          </div>

          <!-- Customer Information -->
          <div class="info-section">
            <h3>Información del Cliente</h3>
            <div class="customer-info">
              <div class="info-item">
                <label>Nombre:</label>
                <span>{{ customerName }}</span>
              </div>
              <div class="info-item">
                <label>Email:</label>
                <span>{{ customerEmail }}</span>
              </div>
              <div class="info-item">
                <label>Teléfono:</label>
                <span>{{ customerPhone }}</span>
              </div>
            </div>
          </div>

          <!-- Delivery Information -->
          <div v-if="order.deliveryAddress" class="info-section">
            <h3>Dirección de Entrega</h3>
            <div class="address-details">
              <p><strong>{{ order.deliveryAddress.recipientName }}</strong></p>
              <p>{{ order.deliveryAddress.street }}</p>
              <p>{{ order.deliveryAddress.city }}, {{ order.deliveryAddress.state }}</p>
              <p v-if="order.deliveryAddress.zipCode">{{ order.deliveryAddress.zipCode }}</p>
              <p v-if="order.deliveryAddress.recipientPhone">
                Tel: {{ order.deliveryAddress.recipientPhone }}
              </p>
              <p v-if="order.deliveryAddress.locationNotes" class="location-notes">
                <em>{{ order.deliveryAddress.locationNotes }}</em>
              </p>
            </div>
          </div>

          <!-- Order Items -->
          <div class="info-section">
            <h3>Productos</h3>
            <div class="items-list">
              <div v-for="item in order.items" :key="item.productId" class="order-item">
                <div class="item-image">
                  <img 
                    v-if="item.productImage" 
                    :src="item.productImage" 
                    :alt="item.productName"
                    class="product-image"
                  >
                  <div v-else class="placeholder-image">
                    <span>{{ item.productName.charAt(0) }}</span>
                  </div>
                </div>
                <div class="item-details">
                  <h4>{{ item.productName }}</h4>
                  <p class="item-sku">SKU: {{ item.productSku }}</p>
                  <div class="item-pricing">
                    <span class="quantity">Cantidad: {{ item.quantity }}</span>
                    <span class="unit-price">{{ formatCurrency(item.unitPrice) }} c/u</span>
                    <span class="total-price">{{ formatCurrency(item.totalPrice) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Summary -->
          <div class="info-section">
            <h3>Resumen de la Orden</h3>
            <div class="order-summary">
              <div class="summary-row">
                <span>Subtotal:</span>
                <span>{{ formatCurrency(order.subtotal) }}</span>
              </div>
              <div v-if="order.shippingCost > 0" class="summary-row">
                <span>Envío:</span>
                <span>{{ formatCurrency(order.shippingCost) }}</span>
              </div>
              <div v-if="order.discount > 0" class="summary-row discount">
                <span>Descuento:</span>
                <span>-{{ formatCurrency(order.discount) }}</span>
              </div>
              <div class="summary-row total">
                <span><strong>Total:</strong></span>
                <span><strong>{{ formatCurrency(order.total) }}</strong></span>
              </div>
            </div>
          </div>

          <!-- Additional Information -->
          <div class="info-section">
            <h3>Información Adicional</h3>
            <div class="additional-info">
              <div class="info-item">
                <label>Zona de Entrega:</label>
                <span>{{ order.deliveryZone }}</span>
              </div>
              <div v-if="order.notes" class="info-item">
                 <label>Notas:</label>
                 <span>{{ order.notes }}</span>
               </div>
              <div v-if="order.internalNotes" class="info-item">
                <label>Notas Internas:</label>
                <span>{{ order.internalNotes }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
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
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  
  h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: #111827;
  }
}

.close-button {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 6px;
  color: #6b7280;
  transition: all 0.2s;
  
  &:hover {
    background-color: #f3f4f6;
    color: #374151;
  }
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  max-height: calc(90vh - 80px);
}

.loading-state, .error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f4f6;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.retry-button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  
  &:hover {
    background-color: #2563eb;
  }
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
  
  .order-number h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.25rem;
    color: #111827;
  }
  
  .status-badges {
    display: flex;
    gap: 0.5rem;
  }
  
  .order-dates {
    text-align: right;
    font-size: 0.875rem;
    color: #6b7280;
    
    p {
      margin: 0.25rem 0;
    }
  }
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;
  
  &.status-orange { background-color: #fed7aa; color: #9a3412; }
  &.status-blue { background-color: #dbeafe; color: #1e40af; }
  &.status-purple { background-color: #e9d5ff; color: #7c3aed; }
  &.status-indigo { background-color: #e0e7ff; color: #4338ca; }
  &.status-green { background-color: #dcfce7; color: #166534; }
  &.status-red { background-color: #fecaca; color: #dc2626; }
  &.status-gray { background-color: #f3f4f6; color: #374151; }
  &.status-yellow { background-color: #fef3c7; color: #92400e; }
}

.info-section {
  margin-bottom: 2rem;
  
  h3 {
    margin: 0 0 1rem 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: #111827;
  }
}

.customer-info, .additional-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  
  label {
    font-weight: 500;
    color: #374151;
    font-size: 0.875rem;
  }
  
  span {
    color: #111827;
  }
}

.address-details {
  background-color: #f9fafb;
  padding: 1rem;
  border-radius: 8px;
  
  p {
    margin: 0.25rem 0;
    color: #374151;
  }
  
  .location-notes {
    margin-top: 0.5rem;
    color: #6b7280;
  }
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.order-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background-color: #f9fafb;
  border-radius: 8px;
  
  .item-image {
    flex-shrink: 0;
    width: 60px;
    height: 60px;
    
    .product-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 6px;
    }
    
    .placeholder-image {
      width: 100%;
      height: 100%;
      background-color: #e5e7eb;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      color: #6b7280;
    }
  }
  
  .item-details {
    flex: 1;
    
    h4 {
      margin: 0 0 0.25rem 0;
      font-size: 1rem;
      color: #111827;
    }
    
    .item-sku {
      margin: 0 0 0.5rem 0;
      font-size: 0.875rem;
      color: #6b7280;
    }
    
    .item-pricing {
      display: flex;
      gap: 1rem;
      font-size: 0.875rem;
      
      .quantity {
        color: #6b7280;
      }
      
      .unit-price {
        color: #6b7280;
      }
      
      .total-price {
        font-weight: 600;
        color: #111827;
        margin-left: auto;
      }
    }
  }
}

.order-summary {
  background-color: #f9fafb;
  padding: 1rem;
  border-radius: 8px;
  
  .summary-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    
    &.discount {
      color: #dc2626;
    }
    
    &.total {
      margin-top: 0.5rem;
      padding-top: 0.5rem;
      border-top: 1px solid #e5e7eb;
      font-size: 1.125rem;
    }
  }
}

@media (max-width: 768px) {
  .modal-overlay {
    padding: 0.5rem;
  }
  
  .modal-content {
    max-height: 95vh;
  }
  
  .modal-header, .modal-body {
    padding: 1rem;
  }
  
  .order-header {
    flex-direction: column;
    gap: 1rem;
    
    .order-dates {
      text-align: left;
    }
  }
  
  .customer-info, .additional-info {
    grid-template-columns: 1fr;
  }
  
  .order-item {
    flex-direction: column;
    
    .item-pricing {
      flex-direction: column;
      gap: 0.25rem;
      
      .total-price {
        margin-left: 0;
      }
    }
  }
}
</style>