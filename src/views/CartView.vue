<script setup lang="ts">
import { computed, ref } from 'vue'
import { useCartStore } from '@/stores/cart.store'
import { useAuthStore } from '@/stores/auth.store'
import { usePayphonePayment } from '@/composables/usePayphonePayment'
import { useRouter } from 'vue-router'

const cartStore = useCartStore()
const authStore = useAuthStore()
const { initiatePayment, isProcessing, hasError, error } = usePayphonePayment()
const router = useRouter()

// Estado local
const isProcessingCheckout = ref(false)

// Datos de envío del destinatario
const shippingData = ref({
  recipientName: '',
  recipientPhone: '',
  street: '',
  city: '',
  notes: ''
})

// Validar datos de envío
const isShippingDataValid = computed(() => {
  return shippingData.value.recipientName.trim() !== '' && 
         shippingData.value.recipientPhone.trim() !== ''
})

// Formatear precio
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-EC', {
    style: 'currency',
    currency: 'USD'
  }).format(price)
}

// Navegar a productos
const goToProducts = () => {
  router.push('/products')
}

// Generar número de orden único
const generateOrderNumber = (): string => {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `ORD-${timestamp}-${random}`
}

// Proceder al checkout con Payphone
const proceedToCheckout = async () => {
  try {
    // Validar que el usuario esté autenticado
    if (!authStore.isAuthenticated || !authStore.user?._id) {
      alert('Debes iniciar sesión para proceder con el pago')
      router.push('/login')
      return
    }

    // Validar que el carrito no esté vacío
    if (cartStore.isEmpty) {
      alert('Tu carrito está vacío')
      return
    }

    // Validar datos de envío
    if (!isShippingDataValid.value) {
      alert('Por favor completa los datos de envío (nombre y teléfono del destinatario)')
      return
    }

    isProcessingCheckout.value = true

    // Preparar datos completos para la orden
    const orderNumber = generateOrderNumber()
    
    const payphoneData = {
      // Datos básicos del producto (mantenemos compatibilidad)
      productId: cartStore.items[0].id,
      productName: cartStore.items[0].name,
      price: cartStore.totalPrice,
      description: `Orden de ${cartStore.totalItems} producto(s) - ${cartStore.items.map(item => `${item.name} (x${item.quantity})`).join(', ')}`,
      
      // Campos requeridos por el backend
      orderNumber: orderNumber,
      paymentMethod: 'payphone', // Valor válido del enum
      
      // Dirección de envío con datos del destinatario
      shippingAddress: {
        recipientName: shippingData.value.recipientName,
        recipientPhone: shippingData.value.recipientPhone,
        street: shippingData.value.street || undefined,
        city: shippingData.value.city || undefined,
        notes: shippingData.value.notes || undefined
      },
      
      // Items con datos completos
      items: cartStore.items.map(item => ({
        productId: item.id, // ID del producto
        productSku: item.id, // Usando el ID como SKU por ahora
        productName: item.name,
        quantity: item.quantity,
        unitPrice: item.price,
        totalPrice: item.price * item.quantity,
        notes: item.description
      })),
      
      // Datos del cliente (básicos)
      customer: {
        firstName: shippingData.value.recipientName.split(' ')[0] || '',
        lastName: shippingData.value.recipientName.split(' ').slice(1).join(' ') || '',
        phone: shippingData.value.recipientPhone
      },
      
      // Totales
      subtotal: cartStore.totalPrice,
      total: cartStore.totalPrice,
      shippingCost: 0,
      shippingMethod: 'delivery'
    }

    console.log('💳 Iniciando pago con Payphone:', payphoneData)
    
    // Guardar datos de payphone en localStorage para PaymentConfirmationView
    localStorage.setItem('payphoneData', JSON.stringify(payphoneData))
    
    // También guardar datos del carrito y cliente por separado como backup
    localStorage.setItem('cart', JSON.stringify({
      items: cartStore.items,
      subtotal: cartStore.totalPrice,
      total: cartStore.totalPrice,
      shippingCost: 0,
      tax: cartStore.totalPrice * 0.12,
      taxRate: 0.12,
      discount: 0,
      discountType: 'fixed'
    }))
    
    localStorage.setItem('customerData', JSON.stringify({
      email: authStore.user?.email || '',
      firstName: authStore.user?.firstName || shippingData.value.recipientName.split(' ')[0] || '',
      lastName: authStore.user?.lastName || shippingData.value.recipientName.split(' ').slice(1).join(' ') || '',
      phone: authStore.user?.phone || shippingData.value.recipientPhone || ''
    }))
    
    console.log('💾 Datos guardados en localStorage para PaymentConfirmationView')
    
    // Iniciar el pago con Payphone
    await initiatePayment(payphoneData)

    // Si llegamos aquí, el pago se inició correctamente
    // El usuario será redirigido a Payphone
    
  } catch (err) {
    console.error('❌ Error en checkout:', err)
    const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
    alert(`Error al procesar el pago: ${errorMessage}`)
  } finally {
    isProcessingCheckout.value = false
  }
}

// Estado de carga combinado
const isLoadingCheckout = computed(() => 
  isProcessingCheckout.value || isProcessing.value
)

// Incrementar cantidad
const incrementQuantity = (productId: string) => {
  const currentQuantity = cartStore.getItemQuantity(productId)
  cartStore.updateQuantity(productId, currentQuantity + 1)
}

// Decrementar cantidad
const decrementQuantity = (productId: string) => {
  const currentQuantity = cartStore.getItemQuantity(productId)
  if (currentQuantity > 1) {
    cartStore.updateQuantity(productId, currentQuantity - 1)
  }
}
</script>

<template>
  <div class="cart-view">
    <div class="cart-view__container">
      <!-- Header -->
      <div class="cart-view__header">
        <h1 class="cart-view__title">
          <i class="fas fa-shopping-cart"></i>
          Mi Carrito
        </h1>
        <p class="cart-view__subtitle" v-if="!cartStore.isEmpty">
          {{ cartStore.totalItems }} {{ cartStore.totalItems === 1 ? 'producto' : 'productos' }} en tu carrito
        </p>
      </div>

      <!-- Carrito vacío -->
      <div v-if="cartStore.isEmpty" class="cart-view__empty">
        <div class="cart-view__empty-icon">
          <i class="fas fa-shopping-cart"></i>
        </div>
        <h2 class="cart-view__empty-title">Tu carrito está vacío</h2>
        <p class="cart-view__empty-description">
          ¡Descubre nuestros deliciosos productos y añade algunos a tu carrito!
        </p>
        <button 
          @click="goToProducts"
          class="cart-view__empty-button"
        >
          <i class="fas fa-shopping-bag"></i>
          Ver Productos
        </button>
      </div>

      <!-- Carrito con productos -->
      <div v-else class="cart-view__content">
        <!-- Lista de productos -->
        <div class="cart-view__items">
          <div 
            v-for="item in cartStore.items" 
            :key="item.id"
            class="cart-item"
          >
            <!-- Header: Imagen + Info + Remove (Mobile First) -->
            <div class="cart-item__header">
              <!-- Imagen del producto -->
              <div class="cart-item__image">
                <img 
                  :src="item.image || '/placeholder-product.jpg'" 
                  :alt="item.name"
                  class="cart-item__img"
                >
              </div>

              <!-- Información del producto -->
              <div class="cart-item__info">
                <h3 class="cart-item__name">{{ item.name }}</h3>
                <div class="cart-item__description" v-if="item.description" v-html="item.description">
                </div>
                <div class="cart-item__price">
                  {{ formatPrice(item.price) }}
                </div>
              </div>

              <!-- Botón eliminar -->
              <button 
                @click="cartStore.removeItem(item.id)"
                class="cart-item__remove"
                title="Eliminar producto"
              >
                <i class="fas fa-trash"></i>
              </button>
            </div>

            <!-- Footer: Cantidad + Subtotal (Mobile First) -->
            <div class="cart-item__footer">
              <!-- Controles de cantidad -->
              <div class="cart-item__quantity">
                <button 
                  @click="decrementQuantity(item.id)"
                  class="cart-item__quantity-btn cart-item__quantity-btn--minus"
                  :disabled="item.quantity <= 1"
                >
                  <i class="fas fa-minus"></i>
                </button>
                <span class="cart-item__quantity-value">{{ item.quantity }}</span>
                <button 
                  @click="incrementQuantity(item.id)"
                  class="cart-item__quantity-btn cart-item__quantity-btn--plus"
                >
                  <i class="fas fa-plus"></i>
                </button>
              </div>

              <!-- Subtotal -->
              <div class="cart-item__subtotal">
                {{ formatPrice(item.price * item.quantity) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Formulario de datos de envío -->
        <div class="cart-view__shipping">
          <div class="shipping-form">
            <h3 class="shipping-form__title">
              <i class="fas fa-shipping-fast"></i>
              Datos de Envío
            </h3>
            
            <div class="shipping-form__fields">
              <div class="shipping-form__field">
                <label for="recipientName" class="shipping-form__label">
                  Nombre del destinatario *
                </label>
                <input
                  id="recipientName"
                  v-model="shippingData.recipientName"
                  type="text"
                  class="shipping-form__input"
                  placeholder="Nombre completo del destinatario"
                  required
                >
              </div>

              <div class="shipping-form__field">
                <label for="recipientPhone" class="shipping-form__label">
                  Teléfono del destinatario *
                </label>
                <input
                  id="recipientPhone"
                  v-model="shippingData.recipientPhone"
                  type="tel"
                  class="shipping-form__input"
                  placeholder="Ej: +593 99 123 4567"
                  required
                >
              </div>

              <div class="shipping-form__field">
                <label for="street" class="shipping-form__label">
                  Dirección (opcional)
                </label>
                <input
                  id="street"
                  v-model="shippingData.street"
                  type="text"
                  class="shipping-form__input"
                  placeholder="Calle y número"
                >
              </div>

              <div class="shipping-form__field">
                <label for="city" class="shipping-form__label">
                  Ciudad (opcional)
                </label>
                <input
                  id="city"
                  v-model="shippingData.city"
                  type="text"
                  class="shipping-form__input"
                  placeholder="Ciudad"
                >
              </div>

              <div class="shipping-form__field">
                <label for="notes" class="shipping-form__label">
                  Notas adicionales (opcional)
                </label>
                <textarea
                  id="notes"
                  v-model="shippingData.notes"
                  class="shipping-form__textarea"
                  placeholder="Instrucciones especiales para la entrega..."
                  rows="3"
                ></textarea>
              </div>
            </div>

            <div v-if="!isShippingDataValid" class="shipping-form__warning">
              <i class="fas fa-exclamation-triangle"></i>
              Por favor completa los campos obligatorios (nombre y teléfono del destinatario)
            </div>
          </div>
        </div>

        <!-- Resumen del carrito -->
        <div class="cart-view__summary">
          <div class="cart-summary">
            <h3 class="cart-summary__title">Resumen del Pedido</h3>
            
            <div class="cart-summary__line">
              <span class="cart-summary__label">Subtotal:</span>
              <span class="cart-summary__value">{{ formatPrice(cartStore.totalPrice) }}</span>
            </div>
            
            <div class="cart-summary__line">
              <span class="cart-summary__label">Envío:</span>
              <span class="cart-summary__value">Gratis</span>
            </div>
            
            <div class="cart-summary__line cart-summary__line--total">
              <span class="cart-summary__label">Total:</span>
              <span class="cart-summary__value">{{ formatPrice(cartStore.totalPrice) }}</span>
            </div>

            <button 
              @click="proceedToCheckout"
              class="cart-summary__checkout"
              :disabled="isLoadingCheckout"
              :class="{ 'cart-summary__checkout--loading': isLoadingCheckout }"
            >
              <i v-if="!isLoadingCheckout" class="fas fa-credit-card"></i>
              <i v-else class="fas fa-spinner fa-spin"></i>
              {{ isLoadingCheckout ? 'Procesando...' : 'Proceder al Pago' }}
            </button>

            <button 
              @click="goToProducts"
              class="cart-summary__continue"
            >
              <i class="fas fa-arrow-left"></i>
              Continuar Comprando
            </button>

            <button 
              @click="cartStore.clearCart"
              class="cart-summary__clear"
            >
              <i class="fas fa-trash"></i>
              Vaciar Carrito
            </button>
          </div>
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

  &__header {
    text-align: center;
    // Mobile First: Menos margen en mobile para aprovechar espacio
    margin-bottom: 2rem;

    @media (min-width: 768px) {
      margin-bottom: 3rem;
    }
  }

  &__title {
    // Mobile First: Tamaño más moderado en mobile
    font-size: 2rem;
    font-weight: 700;
    color: $NICOLE-PRIMARY;
    margin-bottom: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    line-height: 1.2;

    @media (min-width: 768px) {
      font-size: 2.5rem;
      gap: 1rem;
      margin-bottom: 0.5rem;
    }

    @media (min-width: 1024px) {
      font-size: 3rem;
    }

    i {
      // Mobile First: Icono proporcionado al texto
      font-size: 1.75rem;

      @media (min-width: 768px) {
        font-size: 2rem;
      }

      @media (min-width: 1024px) {
        font-size: 2.5rem;
      }
    }
  }

  &__subtitle {
    font-size: 1rem;
    color: $text-light;
    margin: 0;
    
    @media (min-width: 768px) {
      font-size: 1.1rem;
    }
  }

  // Carrito vacío - Mobile First
  &__empty {
    text-align: center;
    // Mobile First: Padding más cómodo en mobile
    padding: 3rem 1.5rem;
    background-color: $white;
    border-radius: 20px;
    box-shadow: 0 8px 32px rgba($NICOLE-PRIMARY, 0.08);
    margin: 0 0.5rem;

    @media (min-width: 768px) {
      padding: 4rem 2rem;
      margin: 0;
      border-radius: 16px;
    }
  }

  &__empty-icon {
    // Mobile First: Tamaño más moderado en mobile
    font-size: 3.5rem;
    color: $purple-light;
    margin-bottom: 1.5rem;

    @media (min-width: 768px) {
      font-size: 4rem;
      margin-bottom: 2rem;
    }

    @media (min-width: 1024px) {
      font-size: 5rem;
    }
  }

  &__empty-title {
    // Mobile First: Tamaño más legible en mobile
    font-size: 1.5rem;
    font-weight: 600;
    color: $text-dark;
    margin-bottom: 1rem;
    line-height: 1.3;

    @media (min-width: 768px) {
      font-size: 1.8rem;
    }

    @media (min-width: 1024px) {
      font-size: 2.2rem;
    }
  }

  &__empty-description {
    font-size: 1rem;
    color: $text-light;
    margin-bottom: 2rem;
    max-width: 320px;
    margin-left: auto;
    margin-right: auto;
    line-height: 1.5;

    @media (min-width: 768px) {
      font-size: 1.1rem;
      max-width: 400px;
    }
  }

  &__empty-button {
    background: linear-gradient(135deg, $NICOLE-PRIMARY, $purple-light);
    color: $white;
    border: none;
    // Mobile First: Botón más grande y táctil en mobile
    padding: 1.125rem 2.5rem;
    border-radius: 16px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    min-height: 52px;

    @media (min-width: 768px) {
      padding: 1rem 2rem;
      border-radius: 12px;
      font-size: 1.1rem;
      gap: 0.5rem;
    }

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba($NICOLE-PRIMARY, 0.3);
    }

    &:active {
      transform: translateY(0);
    }
  }

  // Contenido del carrito - Mobile First
  &__content {
    display: flex;
    flex-direction: column;
    // Mobile First: Gap más generoso en mobile
    gap: 1.5rem;

    @media (min-width: 768px) {
      gap: 2rem;
    }

    @media (min-width: 1024px) {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
    }

    @media (min-width: 1200px) {
      grid-template-columns: 2fr 1fr;
      gap: 3rem;
    }
  }

  &__items {
    background-color: $white;
    border-radius: 20px;
    // Mobile First: Padding más cómodo en mobile
    padding: 1.5rem;
    box-shadow: 0 8px 32px rgba($NICOLE-PRIMARY, 0.08);
    order: 1;

    @media (min-width: 768px) {
      padding: 2rem;
      border-radius: 16px;
    }
  }

  &__shipping {
    order: 2;

    @media (min-width: 1024px) {
      order: 1;
    }
  }

  &__summary {
    align-self: start;
    order: 3;

    @media (min-width: 1024px) {
      order: 2;
    }
  }
}

// Item del carrito - Mobile First
.cart-item {
  // Mobile First: Layout vertical más espacioso
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem 0;
  border-bottom: 1px solid $border-light;

  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: 100px 1fr auto auto auto;
    gap: 1.5rem;
    align-items: center;
    flex-direction: unset;
  }

  &:last-child {
    border-bottom: none;
  }

  // Mobile First: Header del producto (imagen + info + remove)
  &__header {
    display: flex;
    gap: 1rem;
    align-items: flex-start;

    @media (min-width: 768px) {
      display: contents; // Elimina el wrapper en desktop
    }
  }

  &__image {
    // Mobile First: Imagen más grande y prominente
    width: 90px;
    height: 90px;
    border-radius: 16px;
    overflow: hidden;
    background-color: $background-light;
    flex-shrink: 0;

    @media (min-width: 768px) {
      width: 100px;
      height: 100px;
      border-radius: 12px;
    }
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__info {
    flex: 1;
    min-width: 0;
  }

  &__name {
    // Mobile First: Título más prominente
    font-size: 1.125rem;
    font-weight: 600;
    color: $text-dark;
    margin-bottom: 0.5rem;
    line-height: 1.3;

    @media (min-width: 768px) {
      font-size: 1.2rem;
      margin-bottom: 0.25rem;
    }
  }

  &__description {
    font-size: 0.875rem;
    color: $text-light;
    margin-bottom: 0.75rem;
    line-height: 1.4;

    @media (min-width: 768px) {
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
    }

    // Estilos para contenido HTML anidado
    :deep(p) {
      margin: 0 0 0.25rem 0;
      
      &:last-child {
        margin-bottom: 0;
      }
    }

    // Asegurar que el texto se mantenga legible
    :deep(strong), :deep(b) {
      font-weight: 600;
      color: $text-dark;
    }
  }

  &__price {
    font-size: 1.125rem;
    font-weight: 700;
    color: $NICOLE-PRIMARY;

    @media (min-width: 768px) {
      font-size: 1rem;
      font-weight: 600;
    }

    @media (min-width: 1024px) {
      font-size: 1.1rem;
    }
  }

  // Mobile First: Botón remove en el header
  &__remove {
    // Mobile First: Botón más grande y táctil
    width: 44px;
    height: 44px;
    border: none;
    background-color: rgba($error, 0.1);
    color: $error;
    border-radius: 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    flex-shrink: 0;

    @media (min-width: 768px) {
      width: 40px;
      height: 40px;
      background-color: transparent;
      color: $gray-600;
      border-radius: 8px;
    }

    &:hover {
      background-color: rgba($error, 0.15);
      color: $error;
      transform: scale(1.05);
    }

    &:active {
      transform: scale(0.95);
    }
  }

  // Mobile First: Footer del producto (cantidad + subtotal)
  &__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    padding-top: 0.5rem;

    @media (min-width: 768px) {
      display: contents; // Elimina el wrapper en desktop
      padding-top: 0;
    }
  }

  &__quantity {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    background-color: $background-light;
    border-radius: 12px;
    padding: 0.5rem;

    @media (min-width: 768px) {
      gap: 0.5rem;
      border-radius: 8px;
      padding: 0.25rem;
    }
  }

  &__quantity-btn {
    // Mobile First: Botones más grandes y táctiles
    width: 40px;
    height: 40px;
    border: none;
    background-color: $white;
    color: $NICOLE-PRIMARY;
    border-radius: 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    font-size: 0.875rem;

    @media (min-width: 768px) {
      width: 32px;
      height: 32px;
      border-radius: 6px;
    }

    &:hover:not(:disabled) {
      background-color: $NICOLE-PRIMARY;
      color: $white;
      transform: scale(1.05);
    }

    &:active:not(:disabled) {
      transform: scale(0.95);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  &__quantity-value {
    min-width: 2.5rem;
    text-align: center;
    font-weight: 700;
    color: $text-dark;
    font-size: 1rem;

    @media (min-width: 768px) {
      min-width: 2rem;
      font-weight: 600;
    }
  }

  &__subtotal {
    // Mobile First: Subtotal más prominente
    font-size: 1.25rem;
    font-weight: 700;
    color: $text-dark;
    text-align: right;

    @media (min-width: 768px) {
      font-size: 1.1rem;
    }

    @media (min-width: 1024px) {
      font-size: 1.2rem;
    }
  }
}

// Formulario de datos de envío - Mobile First
.shipping-form {
  background-color: $white;
  border-radius: 20px;
  // Mobile First: Padding más cómodo en mobile
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba($NICOLE-PRIMARY, 0.08);
  margin-bottom: 1.5rem;

  @media (min-width: 768px) {
    padding: 2rem;
    border-radius: 16px;
    margin-bottom: 2rem;
  }

  &__title {
    // Mobile First: Título más moderado en mobile
    font-size: 1.25rem;
    font-weight: 700;
    color: $text-dark;
    margin-bottom: 1.25rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    line-height: 1.3;

    @media (min-width: 768px) {
      font-size: 1.5rem;
      margin-bottom: 1.5rem;
    }

    i {
      color: $NICOLE-PRIMARY;
      font-size: 1.125rem;

      @media (min-width: 768px) {
        font-size: 1.25rem;
      }
    }
  }

  &__fields {
    display: grid;
    // Mobile First: Gap más generoso en mobile
    gap: 1.25rem;

    @media (min-width: 768px) {
      gap: 1.5rem;
    }
  }

  &__field {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;

    @media (min-width: 768px) {
      gap: 0.5rem;
    }
  }

  &__label {
    font-weight: 600;
    color: $text-dark;
    font-size: 1rem;
    line-height: 1.4;

    @media (min-width: 768px) {
      font-size: 0.95rem;
    }
  }

  &__input,
  &__textarea {
    // Mobile First: Inputs más grandes y táctiles
    padding: 1rem 1.125rem;
    border: 2px solid $border-light;
    border-radius: 12px;
    font-size: 1rem;
    transition: all 0.2s ease;
    background-color: $white;
    min-height: 52px;

    @media (min-width: 768px) {
      padding: 0.875rem 1rem;
      border-radius: 8px;
      min-height: auto;
    }

    &:focus {
      outline: none;
      border-color: $NICOLE-PRIMARY;
      box-shadow: 0 0 0 3px rgba($NICOLE-PRIMARY, 0.1);
    }

    &::placeholder {
      color: $text-light;
    }

    // Estados de validación visual
    &:valid {
      border-color: $success;
    }

    &:invalid:not(:placeholder-shown) {
      border-color: $error;
    }
  }

  &__textarea {
    resize: vertical;
    min-height: 100px;
    font-family: inherit;
    line-height: 1.5;

    @media (min-width: 768px) {
      min-height: 80px;
    }
  }

  &__warning {
    background-color: rgba($warning, 0.1);
    border: 1px solid rgba($warning, 0.3);
    border-radius: 12px;
    // Mobile First: Padding más generoso
    padding: 1.125rem;
    color: $warning;
    font-weight: 500;
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    margin-top: 1rem;
    line-height: 1.4;

    @media (min-width: 768px) {
      padding: 1rem;
      border-radius: 8px;
      align-items: center;
      gap: 0.5rem;
    }

    i {
      font-size: 1.125rem;
      flex-shrink: 0;
      margin-top: 0.125rem;

      @media (min-width: 768px) {
        font-size: 1.1rem;
        margin-top: 0;
      }
    }
  }
}

// Responsive para formulario de envío
@media (max-width: 768px) {
  .shipping-form {
    padding: 1.5rem;
    margin-bottom: 1.5rem;

    &__title {
      font-size: 1.3rem;
    }

    &__fields {
      gap: 1.25rem;
    }

    &__input,
    &__textarea {
      padding: 0.75rem;
    }
  }
}

// Resumen del carrito - Mobile First
.cart-summary {
  background-color: $white;
  border-radius: 20px;
  // Mobile First: Padding más cómodo en mobile
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba($NICOLE-PRIMARY, 0.08);
  position: sticky;
  top: 100px;

  @media (min-width: 768px) {
    padding: 2rem;
    border-radius: 16px;
  }

  &__title {
    // Mobile First: Título más moderado en mobile
    font-size: 1.25rem;
    font-weight: 700;
    color: $text-dark;
    margin-bottom: 1.25rem;
    text-align: center;

    @media (min-width: 768px) {
      font-size: 1.5rem;
      margin-bottom: 1.5rem;
    }
  }

  &__line {
    display: flex;
    justify-content: space-between;
    align-items: center;
    // Mobile First: Padding más generoso
    padding: 1rem 0;
    border-bottom: 1px solid $border-light;

    @media (min-width: 768px) {
      padding: 0.75rem 0;
    }

    &--total {
      border-bottom: none;
      padding-top: 1.25rem;
      margin-top: 0.75rem;
      border-top: 2px solid $NICOLE-PRIMARY;
      font-size: 1.125rem;
      font-weight: 700;

      @media (min-width: 768px) {
        padding-top: 1rem;
        margin-top: 0.5rem;
        font-size: 1.2rem;
      }
    }
  }

  &__label {
    color: $text-light;
    font-weight: 500;
    font-size: 1rem;

    @media (min-width: 768px) {
      font-size: 0.95rem;
    }
  }

  &__value {
    font-weight: 600;
    color: $text-dark;
    font-size: 1rem;

    @media (min-width: 768px) {
      font-size: 0.95rem;
    }
  }

  &__checkout {
    width: 100%;
    background: linear-gradient(135deg, $NICOLE-PRIMARY, $purple-light);
    color: $white;
    border: none;
    // Mobile First: Botón más grande y táctil
    padding: 1.25rem 2rem;
    border-radius: 16px;
    font-size: 1.125rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    min-height: 56px;

    @media (min-width: 768px) {
      padding: 1rem;
      border-radius: 12px;
      font-size: 1.1rem;
      margin-top: 2rem;
      gap: 0.5rem;
    }

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba($NICOLE-PRIMARY, 0.3);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      transform: none;
    }

    &--loading {
      background: linear-gradient(135deg, $purple-light, $NICOLE-PRIMARY);
      
      i {
        animation: spin 1s linear infinite;
      }
    }
  }

  &__continue {
    width: 100%;
    background-color: transparent;
    color: $NICOLE-PRIMARY;
    border: 2px solid $NICOLE-PRIMARY;
    // Mobile First: Botón más grande y táctil
    padding: 1rem 2rem;
    border-radius: 16px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    min-height: 52px;

    @media (min-width: 768px) {
      padding: 0.75rem;
      border-radius: 12px;
      gap: 0.5rem;
    }

    &:hover {
      background-color: $NICOLE-PRIMARY;
      color: $white;
    }

    &:active {
      transform: translateY(0);
    }
  }

  &__clear {
    width: 100%;
    background-color: transparent;
    color: $gray-600;
    border: 1px solid $gray-200;
    // Mobile First: Botón más grande y táctil
    padding: 1rem 2rem;
    border-radius: 16px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    min-height: 52px;

    @media (min-width: 768px) {
      padding: 0.75rem;
      border-radius: 12px;
      font-size: 0.9rem;
      gap: 0.5rem;
    }

    &:hover {
      background-color: rgba($error, 0.1);
      color: $error;
      border-color: $error;
    }

    &:active {
      transform: translateY(0);
    }
  }
}

// Animaciones
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>