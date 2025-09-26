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

    isProcessingCheckout.value = true

    // Procesar el pago directamente con Payphone
      const payphoneData = {
        productId: `CART-${Date.now()}`, // ID único para esta compra
        productName: `Compra de ${cartStore.totalItems} productos`,
        price: cartStore.totalPrice,
        description: `Carrito con ${cartStore.items.map(item => `${item.name} (x${item.quantity})`).join(', ')}`
      }

      console.log('💳 Iniciando pago con Payphone:', payphoneData)
      
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
              <p class="cart-item__description" v-if="item.description">
                {{ item.description }}
              </p>
              <div class="cart-item__price">
                {{ formatPrice(item.price) }}
              </div>
            </div>

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

            <!-- Botón eliminar -->
            <button 
              @click="cartStore.removeItem(item.id)"
              class="cart-item__remove"
              title="Eliminar producto"
            >
              <i class="fas fa-trash"></i>
            </button>
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
  padding: 2rem 0;
  background-color: $gray-50;

  &__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;

    @media (min-width: 768px) {
      padding: 0 2rem;
    }

    @media (min-width: 1024px) {
      padding: 0 3rem;
    }
  }

  &__header {
    text-align: center;
    margin-bottom: 3rem;
  }

  &__title {
    font-size: 2.5rem;
    font-weight: 700;
    color: $purple-primary;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;

    @media (min-width: 768px) {
      font-size: 3rem;
    }

    i {
      font-size: 2rem;

      @media (min-width: 768px) {
        font-size: 2.5rem;
      }
    }
  }

  &__subtitle {
    font-size: 1.1rem;
    color: $gray-600;
    margin: 0;
  }

  // Carrito vacío
  &__empty {
    text-align: center;
    padding: 4rem 2rem;
    background-color: $white;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba($purple-primary, 0.1);
  }

  &__empty-icon {
    font-size: 4rem;
    color: $purple-light;
    margin-bottom: 2rem;

    @media (min-width: 768px) {
      font-size: 5rem;
    }
  }

  &__empty-title {
    font-size: 1.8rem;
    font-weight: 600;
    color: $gray-900;
    margin-bottom: 1rem;

    @media (min-width: 768px) {
      font-size: 2.2rem;
    }
  }

  &__empty-description {
    font-size: 1.1rem;
    color: $gray-600;
    margin-bottom: 2rem;
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
  }

  &__empty-button {
    background: linear-gradient(135deg, $purple-primary, $purple-light);
    color: $white;
    border: none;
    padding: 1rem 2rem;
    border-radius: 12px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba($purple-primary, 0.3);
    }
  }

  // Contenido del carrito
  &__content {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;

    @media (min-width: 1024px) {
      grid-template-columns: 2fr 1fr;
      gap: 3rem;
    }
  }

  &__items {
    background-color: $white;
    border-radius: 16px;
    padding: 2rem;
    box-shadow: 0 4px 20px rgba($purple-primary, 0.1);
  }

  &__summary {
    align-self: start;
  }
}

// Item del carrito
.cart-item {
  display: grid;
  grid-template-columns: 80px 1fr auto auto auto;
  gap: 1rem;
  align-items: center;
  padding: 1.5rem 0;
  border-bottom: 1px solid $gray-200;

  @media (min-width: 768px) {
    grid-template-columns: 100px 1fr auto auto auto;
    gap: 1.5rem;
  }

  &:last-child {
    border-bottom: none;
  }

  &__image {
    width: 80px;
    height: 80px;
    border-radius: 12px;
    overflow: hidden;
    background-color: $gray-50;

    @media (min-width: 768px) {
      width: 100px;
      height: 100px;
    }
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__info {
    min-width: 0;
  }

  &__name {
    font-size: 1.1rem;
    font-weight: 600;
    color: $gray-900;
    margin-bottom: 0.25rem;
    line-height: 1.3;

    @media (min-width: 768px) {
      font-size: 1.2rem;
    }
  }

  &__description {
    font-size: 0.9rem;
    color: $gray-600;
    margin-bottom: 0.5rem;
    line-height: 1.4;
  }

  &__price {
    font-size: 1rem;
    font-weight: 600;
    color: $purple-primary;

    @media (min-width: 768px) {
      font-size: 1.1rem;
    }
  }

  &__quantity {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background-color: $gray-50;
    border-radius: 8px;
    padding: 0.25rem;
  }

  &__quantity-btn {
    width: 32px;
    height: 32px;
    border: none;
    background-color: $white;
    color: $purple-primary;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;

    &:hover:not(:disabled) {
      background-color: $purple-primary;
      color: $white;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  &__quantity-value {
    min-width: 2rem;
    text-align: center;
    font-weight: 600;
    color: $gray-900;
  }

  &__subtotal {
    font-size: 1.1rem;
    font-weight: 700;
    color: $gray-900;
    text-align: right;

    @media (min-width: 768px) {
      font-size: 1.2rem;
    }
  }

  &__remove {
    width: 40px;
    height: 40px;
    border: none;
    background-color: transparent;
    color: $gray-600;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;

    &:hover {
      background-color: rgba($error, 0.1);
      color: $error;
    }
  }
}

// Resumen del carrito
.cart-summary {
  background-color: $white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba($purple-primary, 0.1);
  position: sticky;
  top: 100px;

  &__title {
    font-size: 1.5rem;
    font-weight: 700;
    color: $gray-900;
    margin-bottom: 1.5rem;
    text-align: center;
  }

  &__line {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 0;
    border-bottom: 1px solid $gray-200;

    &--total {
      border-bottom: 2px solid $purple-primary;
      margin-top: 1rem;
      padding-top: 1rem;
      font-size: 1.2rem;
      font-weight: 700;
    }
  }

  &__label {
    color: $gray-600;
    font-weight: 500;
  }

  &__value {
    color: $gray-900;
    font-weight: 600;
  }

  &__checkout {
    width: 100%;
    background: linear-gradient(135deg, $purple-primary, $purple-light);
    color: $white;
    border: none;
    padding: 1rem;
    border-radius: 12px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba($purple-primary, 0.3);
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      transform: none;
    }

    &--loading {
      background: linear-gradient(135deg, $purple-light, $purple-primary);
      
      i {
        animation: spin 1s linear infinite;
      }
    }
  }

  &__continue {
    width: 100%;
    background-color: transparent;
    color: $purple-primary;
    border: 2px solid $purple-primary;
    padding: 0.75rem;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;

    &:hover {
      background-color: $purple-primary;
      color: $white;
    }
  }

  &__clear {
    width: 100%;
    background-color: transparent;
    color: $gray-600;
    border: 1px solid $gray-200;
    padding: 0.75rem;
    border-radius: 12px;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;

    &:hover {
      background-color: rgba($error, 0.1);
      color: $error;
      border-color: $error;
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