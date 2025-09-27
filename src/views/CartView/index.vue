<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart.store'
import { useAuthStore } from '@/stores/auth.store'
import { usePayphonePayment } from '@/composables/usePayphonePayment'
import { useModal } from '@/composables/useModal'
import Modal from '@/components/Modal.vue'
import type { BillingInfo, DeliveryAddress, DeliveryZone } from '@/types/orders'

// Stores
import CartHeader from './CartHeader.vue'
import CartItem from './CartItem.vue'
import ShippingForm from './ShippingForm.vue'
import CartSummary from './CartSummary.vue'

// Stores
const cartStore = useCartStore()
const authStore = useAuthStore()

// Composables
const { initiatePayment, isProcessing, hasError, error } = usePayphonePayment()
const { modalState, showError, showWarning, alert: showAlert } = useModal()
const router = useRouter()

// Definir tipo FormData
interface FormData {
  billingInfo: BillingInfo
  deliveryAddress: DeliveryAddress
  deliveryZone: DeliveryZone
}

// Estado local
const isProcessingCheckout = ref(false)

// Estado de carga combinado
const isLoadingCheckout = computed(() =>
  isProcessingCheckout.value || isProcessing.value
)
const formData = ref<FormData>({
  billingInfo: {
    cedula: '',
    fullName: '',
    phone: '',
    email: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Ecuador'
    }
  },
  deliveryAddress: {
    street: '',
    city: 'Guayaquil',
    state: 'Guayas',
    zipCode: '090101',
    country: 'Ecuador',
    recipientName: '',
    recipientPhone: '',
    latitude: undefined,
    longitude: undefined,
    googleMapsLink: '',
    locationNotes: ''
  },
  deliveryZone: 'samanes_suburbio'
})

// Referencias a componentes
const shippingFormRef = ref<InstanceType<typeof ShippingForm> | null>(null)

// Computed properties
const isEmpty = computed(() => cartStore.items.length === 0)
const totalItems = computed(() => cartStore.totalItems)

// Validar datos de envío y facturación
const isFormDataValid = computed(() => {
  const billing = formData.value.billingInfo
  const delivery = formData.value.deliveryAddress

  return billing.cedula.trim() !== '' &&
    billing.fullName.trim() !== '' &&
    billing.phone.trim() !== '' &&
    delivery.recipientName.trim() !== '' &&
    delivery.recipientPhone.trim() !== '' &&
    delivery.street.trim() !== ''
})

// Formatear precio
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-EC', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(price)
}

// Navegación
const goToProducts = () => {
  router.push('/products')
}

// Funciones del carrito
const incrementQuantity = (productId: string) => {
  const currentQuantity = cartStore.getItemQuantity(productId)
  cartStore.updateQuantity(productId, currentQuantity + 1)
}

const decrementQuantity = (productId: string) => {
  const currentQuantity = cartStore.getItemQuantity(productId)
  if (currentQuantity > 1) {
    cartStore.updateQuantity(productId, currentQuantity - 1)
  } else {
    console.log('⚠️ CartView: No se puede decrementar, cantidad mínima alcanzada')
  }
}

const removeFromCart = (productId: string) => {
  cartStore.removeItem(productId)
}

const clearCart = () => {
  if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
    cartStore.clearCart()
  }
}

const generateOrderNumber = (): string => {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 1000)
  return `NPA-${timestamp}-${random}`
}

const proceedToCheckout = async () => {
  try {
    console.log('🛒 Iniciando proceso de checkout...')

    // Validar que el usuario esté autenticado
    if (!authStore.isAuthenticated || !authStore.user?._id) {
      showError('Debes iniciar sesión para proceder con el pago', {
        title: 'Autenticación requerida'
      })
      router.push('/login')
      return
    }

    if (cartStore.isEmpty) {
      console.log('❌ Carrito vacío')
      showWarning('Tu carrito está vacío', {
        title: 'Carrito vacío'
      })
      return
    }

    if (!isFormDataValid.value) {
      console.log('❌ Datos de formulario incompletos')
      showWarning('Por favor completa todos los datos obligatorios de facturación y entrega', {
        title: 'Datos incompletos'
      })
      return
    }

    console.log('✅ Validaciones pasadas, preparando datos de pago...')

    isProcessingCheckout.value = true

    // Guardar datos del formulario en localStorage para recuperar después del pago
    console.log('💾 Guardando datos del formulario en localStorage...')
    localStorage.setItem('formData', JSON.stringify(formData.value))
    localStorage.setItem('cartItems', JSON.stringify(cartStore.items))

    // Preparar datos para Payphone usando el mismo formato que el componente funcional
    const payphoneData = {
      productId: `CART-${Date.now()}`, // ID único para esta compra
      productName: `Compra de ${cartStore.totalItems} productos`,
      price: cartStore.totalPrice,
      description: `Carrito con ${cartStore.items.map(item => `${item.name} (x${item.quantity})`).join(', ')}`
    }

    console.log('💳 Iniciando pago con Payphone:', payphoneData)
    console.log('📊 Detalles del carrito:', {
      totalItems: cartStore.totalItems,
      totalPrice: cartStore.totalPrice,
      items: cartStore.items.map(item => ({ name: item.name, quantity: item.quantity, price: item.price }))
    })

    // Iniciar el pago con Payphone usando el composable
    await initiatePayment(payphoneData)

    console.log('✅ Pago iniciado correctamente, el usuario será redirigido a Payphone')

  } catch (err) {
    console.error('❌ Error en checkout:', err)
    const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
    console.error('📝 Detalles del error:', errorMessage)
    showError(`Error al procesar el pago: ${errorMessage}`, {
      title: 'Error en el pago'
    })
  } finally {
    isProcessingCheckout.value = false
    console.log('🔄 Proceso de checkout finalizado')
  }
}

// Actualizar datos de envío
const updateFormData = (data: FormData) => {
  formData.value = data
}

// Lifecycle
onMounted(() => {
  // Cargar datos de envío guardados si existen
  const savedFormData = localStorage.getItem('formData')
  if (savedFormData) {
    try {
      formData.value = JSON.parse(savedFormData)
    } catch (error) {
      console.error('Error al cargar datos del formulario:', error)
    }
  }
})

// Guardar datos de envío cuando cambien
const saveFormData = () => {
  localStorage.setItem('formData', JSON.stringify(formData.value))
}

// Watch para guardar automáticamente
watch(formData, saveFormData, { deep: true })
</script>

<template>
  <div class="cart-view">
    <div class="cart-view__container">
      <!-- Header del carrito -->
      <CartHeader 
        :is-empty="isEmpty"
        :total-items="totalItems"
        @go-to-products="goToProducts"
      />

      <!-- Contenido principal -->
      <div v-if="!isEmpty" class="cart-view__content">
        <!-- Lista de productos -->
        <div class="cart-view__items">
          <CartItem
            v-for="item in cartStore.items"
            :key="item.id"
            :item="item"
            @incrementQuantity="incrementQuantity"
            @decrementQuantity="decrementQuantity"
            @removeItem="removeFromCart"
          />
        </div>

        <!-- Formulario de envío -->
        <ShippingForm
          ref="shippingFormRef"
          :form-data="formData"
          @update:form-data="updateFormData"
        />

        <!-- Resumen del carrito -->
        <div class="cart-view__summary">
          <CartSummary
            :cart-total="cartStore.totalPrice"
            :is-shipping-valid="isFormDataValid"
            :is-loading="isLoadingCheckout"
            @proceed-checkout="proceedToCheckout"
            @continue-shopping="goToProducts"
            @clear-cart="clearCart"
          />
        </div>
      </div>
    </div>
  </div>

  <!-- Modal -->
  <Modal
    :is-open="modalState.isOpen"
    :title="modalState.title"
    :type="modalState.type"
    :show-close-button="modalState.showCloseButton"
    :persistent="modalState.persistent"
    @close="modalState.isOpen = false"
    @confirm="modalState.isOpen = false"
  >
    {{ modalState.message }}
    
    <template v-if="modalState.showConfirm || modalState.showCancel" #footer>
      <button
        v-if="modalState.showCancel"
        class="btn btn--secondary"
        @click="modalState.isOpen = false"
      >
        {{ modalState.cancelText }}
      </button>
      <button
        v-if="modalState.showConfirm"
        class="btn btn--primary"
        @click="modalState.isOpen = false"
      >
        {{ modalState.confirmText }}
      </button>
    </template>
  </Modal>
</template>

<style lang="scss" scoped>
.cart-view {
  min-height: calc(100vh - 160px);
  // Mobile First: Más padding vertical para respirar mejor
  padding: 1.5rem 0 3rem;
  background-color: $background-light;

  @media (min-width: 768px) {
    padding: 2rem 0;
  }

  &__container {
    max-width: 1200px;
    margin: 0 auto;
    // Mobile First: Padding más generoso en mobile
    padding: 0 1.25rem;

    @media (min-width: 768px) {
      padding: 0 2rem;
    }

    @media (min-width: 1024px) {
      padding: 0 3rem;
    }
  }

  &__content {
    // Mobile First: Layout vertical en mobile
    display: flex;
    flex-direction: column;
    gap: 2rem;

    @media (min-width: 1024px) {
      // Desktop: Layout en grid con sidebar
      display: grid;
      grid-template-columns: 1fr 400px;
      grid-template-rows: auto auto;
      gap: 2.5rem;
      align-items: start;
    }
  }

  &__items {
    // Mobile First: Ocupa todo el ancho
    width: 100%;

    @media (min-width: 1024px) {
      // Desktop: Ocupa las dos filas de la primera columna
      grid-column: 1;
      grid-row: 1 / 3;
    }
  }

  &__summary {
    // Mobile First: Ocupa todo el ancho
    width: 100%;

    @media (min-width: 1024px) {
      // Desktop: Sidebar fijo
      grid-column: 2;
      grid-row: 2;
    }
  }
}
</style>