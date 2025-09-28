<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart.store'
import { useAuthStore } from '@/stores/auth.store'
import { usePayphonePayment } from '@/composables/usePayphonePayment'
import { useModal } from '@/composables/useModal'
import Modal from '@/components/Modal.vue'
import type { BillingInfo, DeliveryAddress, DeliveryZone } from '@/types/orders'
import { validateEcuadorCedula } from '@/utils/ecuadorValidations'

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
  deliveryZone: ''
})

// Referencias a componentes
const shippingFormRef = ref<InstanceType<typeof ShippingForm> | null>(null)

// Computed properties
const isEmpty = computed(() => cartStore.items.length === 0)
const totalItems = computed(() => cartStore.totalItems)

// Obtener precio de envío desde ShippingForm
const shippingCost = computed(() => {
  return shippingFormRef.value?.selectedZonePrice || 0
})

// Obtener nombre de la zona de envío desde ShippingForm
const selectedZoneName = computed(() => {
  return shippingFormRef.value?.selectedZoneName || ''
})

// Validaciones individuales
const isBillingInfoValid = computed(() => {
  const billing = formData.value.billingInfo
  return billing.cedula.trim() !== '' && 
         validateEcuadorCedula(billing.cedula) &&
         billing.fullName.trim() !== '' && 
         billing.phone.trim() !== '' &&
         (billing.email ? billing.email.trim() !== '' : true)
})

const isDeliveryAddressValid = computed(() => {
  const delivery = formData.value.deliveryAddress
  return delivery.recipientName.trim() !== '' && 
         delivery.recipientPhone.trim() !== '' &&
         delivery.street.trim() !== ''
})

// Validar datos de envío y facturación
const isFormDataValid = computed(() => {
  return isBillingInfoValid.value && 
         isDeliveryAddressValid.value && 
         formData.value.deliveryZone !== null
})

// Detectar error específico de cédula
const cedulaValidationError = computed(() => {
  const cedula = formData.value.billingInfo.cedula.trim()
  if (!cedula) {
    return 'La cédula es obligatoria'
  }
  if (!validateEcuadorCedula(cedula)) {
    return 'Ingresa una cédula ecuatoriana válida'
  }
  return ''
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
    console.log('🚀 [CHECKOUT] ===== INICIANDO PROCESO DE CHECKOUT =====')
    console.log('🕐 [CHECKOUT] Timestamp:', new Date().toISOString())

    // Validar que el usuario esté autenticado
    if (!authStore.isAuthenticated || !authStore.user?._id) {
      console.log('❌ [AUTH] Usuario no autenticado')
      showError('Debes iniciar sesión para proceder con el pago', {
        title: 'Autenticación requerida'
      })
      router.push('/login')
      return
    }
    console.log('✅ [AUTH] Usuario autenticado:', authStore.user.email)

    if (cartStore.isEmpty) {
      console.log('❌ [CART] Carrito vacío')
      showWarning('Tu carrito está vacío', {
        title: 'Carrito vacío'
      })
      return
    }
    console.log('✅ [CART] Carrito contiene', cartStore.totalItems, 'productos')

    if (!isFormDataValid.value) {
      console.log('❌ [FORM] Datos de formulario incompletos')
      console.log('📋 [FORM] Estado de validación:', {
        billingValid: isBillingInfoValid.value,
        deliveryValid: isDeliveryAddressValid.value,
        formValid: isFormDataValid.value
      })
      showWarning('Por favor completa todos los datos obligatorios de facturación y entrega', {
        title: 'Datos incompletos'
      })
      return
    }
    console.log('✅ [FORM] Datos de formulario válidos')

    console.log('🔄 [CHECKOUT] Preparando datos de pago...')
    isProcessingCheckout.value = true

    // Generar orderNumber único
    const timestamp = Date.now()
    const randomSuffix = Math.random().toString(36).substring(2, 8).toLowerCase()
    const orderNumber = `NPA-CART-${timestamp}-${randomSuffix}`
    
    console.log('🔢 [ORDER] Order Number generado:', orderNumber)

    // Calcular totales correctamente según validación del backend
    // subtotal = suma de todos los item.totalPrice
    // tax = subtotal × taxRate  
    // total = subtotal + tax + shippingCost - discount
    
    const subtotal = cartStore.items.reduce((sum, item) => {
      return sum + (item.price * item.quantity)
    }, 0)
    
    const taxRate = 0.12
    const tax = Math.round((subtotal * taxRate) * 100) / 100
    const shippingCost = 0 // Por ahora sin costo de envío
    const discount = 0 // Por ahora sin descuento
    const total = Math.round((subtotal + tax + shippingCost - discount) * 100) / 100

    console.log('💰 [TOTALS] Cálculo de totales corregido:', {
      itemsCount: cartStore.items.length,
      itemPrices: cartStore.items.map(item => ({ name: item.name, price: item.price, quantity: item.quantity, total: item.price * item.quantity })),
      subtotal: subtotal,
      tax: tax,
      taxRate: taxRate,
      shippingCost: shippingCost,
      discount: discount,
      total: total,
      cartStoreTotal: cartStore.totalPrice // Para comparación
    })

    // Preparar datos completos del carrito para preservar
    const completeCartData = {
      // Información básica de la orden
      orderNumber: orderNumber,
      customer: authStore.user._id,
      
      // Items del carrito transformados
      items: cartStore.items.map(item => ({
        productId: item.id,
        productName: item.name,
        productSku: `SKU-${item.id}`,
        quantity: item.quantity,
        unitPrice: Math.round(item.price * 100) / 100,
        totalPrice: Math.round((item.price * item.quantity) * 100) / 100,
        productImage: item.image || '/images/default-product.jpg'
      })),
      
      // Totales calculados
      subtotal: subtotal,
      tax: tax,
      taxRate: taxRate,
      discount: discount,
      discountType: 'fixed',
      total: total,
      
      // Método de pago
      paymentMethod: 'payphone',
      paymentReference: null, // Se llenará después del pago
      
      // Información de facturación del formulario
      billingInfo: {
        cedula: formData.value.billingInfo.cedula,
        fullName: formData.value.billingInfo.fullName,
        phone: formData.value.billingInfo.phone,
        email: formData.value.billingInfo.email || authStore.user.email,
        address: {
          street: formData.value.billingInfo.address?.street || formData.value.deliveryAddress.street,
          city: formData.value.billingInfo.address?.city || formData.value.deliveryAddress.city,
          state: formData.value.billingInfo.address?.state || formData.value.deliveryAddress.state,
          zipCode: formData.value.billingInfo.address?.zipCode || formData.value.deliveryAddress.zipCode,
          country: formData.value.billingInfo.address?.country || formData.value.deliveryAddress.country || 'Ecuador'
        }
      },
      
      // Dirección de entrega del formulario
      deliveryAddress: {
        street: formData.value.deliveryAddress.street,
        city: formData.value.deliveryAddress.city,
        state: formData.value.deliveryAddress.state,
        zipCode: formData.value.deliveryAddress.zipCode,
        country: formData.value.deliveryAddress.country,
        recipientName: formData.value.deliveryAddress.recipientName,
        recipientPhone: formData.value.deliveryAddress.recipientPhone,
        latitude: formData.value.deliveryAddress.latitude,
        longitude: formData.value.deliveryAddress.longitude,
        googleMapsLink: formData.value.deliveryAddress.googleMapsLink || '',
        locationNotes: formData.value.deliveryAddress.locationNotes || ''
      },
      
      // Zona de entrega
      deliveryZone: formData.value.deliveryZone,
      
      // Dirección de envío (para compatibilidad)
      shippingAddress: {
        recipientName: formData.value.deliveryAddress.recipientName,
        recipientPhone: formData.value.deliveryAddress.recipientPhone,
        street: formData.value.deliveryAddress.street,
        city: formData.value.deliveryAddress.city,
        state: formData.value.deliveryAddress.state,
        zipCode: formData.value.deliveryAddress.zipCode,
        country: formData.value.deliveryAddress.country,
        notes: formData.value.deliveryAddress.locationNotes || ''
      },
      
      // Método y costo de envío
      shippingMethod: 'delivery',
      shippingCost: shippingCost,
      
      // Notas adicionales
      notes: `Orden creada desde carrito. Items: ${cartStore.items.map(item => `${item.name} (x${item.quantity})`).join(', ')}`
    }

    console.log('📦 [CART_DATA] Datos completos del carrito preparados:', completeCartData)

    // Guardar datos completos en localStorage con múltiples claves para redundancia
    console.log('💾 [STORAGE] Guardando datos en localStorage...')
    
    // Clave principal para PaymentConfirmationView
    localStorage.setItem('cart', JSON.stringify(completeCartData))
    
    // Claves de respaldo
    localStorage.setItem('formData', JSON.stringify(formData.value))
    localStorage.setItem('cartItems', JSON.stringify(cartStore.items))
    localStorage.setItem('customerData', JSON.stringify({
      id: authStore.user._id,
      email: authStore.user.email,
      name: formData.value.billingInfo.fullName,
      phone: formData.value.billingInfo.phone
    }))

    console.log('✅ [STORAGE] Datos guardados en localStorage con claves:', ['cart', 'formData', 'cartItems', 'customerData'])

    // Preparar datos para Payphone
    const payphoneData = {
      productId: `CART-${timestamp}`,
      productName: `Compra de ${cartStore.totalItems} productos - ${orderNumber}`,
      price: total,
      description: `${cartStore.items.map(item => `${item.name} (x${item.quantity})`).join(', ')}`
    }

    console.log('💳 [PAYPHONE] Datos para Payphone preparados:', payphoneData)
    
    // Guardar datos de Payphone también
    localStorage.setItem('payphoneData', JSON.stringify(payphoneData))
    console.log('💾 [PAYPHONE] Datos de Payphone guardados en localStorage')

    console.log('🚀 [PAYMENT] Iniciando pago con Payphone...')
    console.log('📊 [SUMMARY] Resumen del proceso:', {
      orderNumber: orderNumber,
      totalItems: cartStore.totalItems,
      totalPrice: total,
      customerEmail: authStore.user.email,
      deliveryZone: formData.value.deliveryZone
    })

    // Iniciar el pago con Payphone
    await initiatePayment(payphoneData)

    console.log('✅ [PAYMENT] Pago iniciado correctamente')
    console.log('🔄 [REDIRECT] Usuario será redirigido a Payphone')

  } catch (err) {
    console.error('💥 [ERROR] Error crítico en checkout:', err)
    const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
    console.error('📚 [ERROR] Stack trace:', err instanceof Error ? err.stack : 'No stack available')
    console.error('🔍 [ERROR] Detalles del contexto:', {
      isAuthenticated: authStore.isAuthenticated,
      cartItems: cartStore.totalItems,
      formValid: isFormDataValid.value
    })
    
    showError(`Error al procesar el pago: ${errorMessage}`, {
      title: 'Error en el pago'
    })
  } finally {
    isProcessingCheckout.value = false
    console.log('🏁 [CHECKOUT] ===== PROCESO DE CHECKOUT FINALIZADO =====')
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
            :shipping-cost="shippingCost"
            :zone-name="selectedZoneName"
            :is-shipping-valid="isFormDataValid"
            :is-loading="isLoadingCheckout"
            :cedula-error="cedulaValidationError"
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