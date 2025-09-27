<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart.store'
import { useAuthStore } from '@/stores/auth.store'
import type { BillingInfo, DeliveryAddress, DeliveryZone } from '@/types/orders'
import CartHeader from './CartHeader.vue'
import CartItem from './CartItem.vue'
import ShippingForm from './ShippingForm.vue'
import CartSummary from './CartSummary.vue'

// Declarar tipos globales para Payphone
declare global {
  interface Window {
    PayphoneButton?: {
      init: (config: any) => void
    }
  }
}

// Stores
const cartStore = useCartStore()
const authStore = useAuthStore()
const router = useRouter()

// Definir tipo FormData
interface FormData {
  billingInfo: BillingInfo
  deliveryAddress: DeliveryAddress
  deliveryZone: DeliveryZone
}

// Estado local
const isLoadingCheckout = ref(false)
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

// Generar número de orden único
const generateOrderNumber = (): string => {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 1000)
  return `NPA-${timestamp}-${random}`
}

// Proceder al checkout
const proceedToCheckout = async () => {
  try {
    isLoadingCheckout.value = true

    // Verificar autenticación
    if (!authStore.isAuthenticated) {
      router.push('/login')
      return
    }

    // Verificar que hay items en el carrito
    if (cartStore.items.length === 0) {
      alert('Tu carrito está vacío')
      return
    }

    // Verificar datos de envío y facturación
    if (!isFormDataValid.value) {
      alert('Por favor completa todos los datos obligatorios de facturación y entrega')
      return
    }

    // Preparar datos para Payphone
    const orderNumber = generateOrderNumber()
    const amount = cartStore.totalPrice
    const tax = 0
    const service = 0
    const tip = 0
    const currency = 'USD'

    // Preparar datos del pedido
    const orderData = {
      orderNumber,
      amount,
      tax,
      service,
      tip,
      currency,
      items: cartStore.items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        description: item.description
      })),
      customer: {
        name: formData.value.billingInfo.fullName,
        email: formData.value.billingInfo.email || '',
        phone: formData.value.billingInfo.phone
      },
      billing: formData.value.billingInfo,
      delivery: formData.value.deliveryAddress,
      deliveryZone: formData.value.deliveryZone,
      // Mantener compatibilidad con formato anterior
      shipping: {
        recipientName: formData.value.deliveryAddress.recipientName,
        recipientPhone: formData.value.deliveryAddress.recipientPhone,
        street: formData.value.deliveryAddress.street,
        city: formData.value.deliveryAddress.city,
        notes: formData.value.deliveryAddress.locationNotes || ''
      },
      createdAt: new Date().toISOString()
    }

    // Guardar datos en localStorage para recuperar después del pago
    localStorage.setItem('pendingOrder', JSON.stringify(orderData))
    localStorage.setItem('cartData', JSON.stringify(cartStore.items))
    localStorage.setItem('customerData', JSON.stringify(orderData.customer))

    // Configurar Payphone
    const payphoneConfig = {
      token: import.meta.env.VITE_PAYPHONE_TOKEN,
      amount,
      amountWithoutTax: amount,
      tax,
      service,
      tip,
      currency,
      reference: orderNumber,
      clientTransactionId: `${orderNumber}-${Date.now()}`,
      // URLs de respuesta
      responseUrl: `${window.location.origin}/payment-response`,
      cancelUrl: `${window.location.origin}/cart`,
      // Datos del cliente
      clientName: orderData.customer.name,
      clientEmail: orderData.customer.email,
      clientPhone: orderData.customer.phone,
      // Metadatos adicionales
      metadata: {
        orderNumber,
        shippingData: orderData.shipping,
        items: orderData.items
      }
    }

    // Inicializar Payphone
    if (window.PayphoneButton) {
      window.PayphoneButton.init(payphoneConfig)
    } else {
      console.error('Payphone no está disponible')
      alert('Error al inicializar el sistema de pagos. Por favor intenta de nuevo.')
    }

  } catch (error) {
    console.error('Error en checkout:', error)
    alert('Ocurrió un error al procesar tu pedido. Por favor intenta de nuevo.')
  } finally {
    isLoadingCheckout.value = false
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
            @increment="incrementQuantity"
            @decrement="decrementQuantity"
            @remove="removeFromCart"
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