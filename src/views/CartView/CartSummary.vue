<script setup lang="ts">
import { computed } from 'vue'
import { useCartStore } from '@/stores/cart.store'

const cartStore = useCartStore()

const props = defineProps({
  cartTotal: {
    type: Number,
    required: true,
  },
  shippingCost: {
    type: Number,
    default: 0,
  },
  zoneName: {
    type: String,
    default: '',
  },
  isShippingValid: {
    type: Boolean,
    required: true,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  cedulaError: {
    type: String,
    default: '',
  },
})

// Computed properties
const finalTotal = computed(() => {
  return Math.round((props.cartTotal + props.shippingCost) * 100) / 100
})

const emit = defineEmits<{
  'proceed-checkout': []
  'continue-shopping': []
  'clear-cart': []
}>()

// Formatear precio
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-EC', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(price)
}

// Precios formateados
const formattedSubtotal = computed(() => formatPrice(props.cartTotal))
const formattedShipping = computed(() => formatPrice(props.shippingCost))
const formattedTotal = computed(() => formatPrice(finalTotal.value))

// Función para generar mensaje de WhatsApp profesional
const generateWhatsAppMessage = (): string => {
  const items = cartStore.items
  const subtotal = props.cartTotal
  const shipping = props.shippingCost
  const total = finalTotal.value
  
  let message = '🍰 *PEDIDO - Nicole Pastry Arts* 🍰\n\n'
  message += '📋 *Detalles del pedido:*\n'
  
  items.forEach((item, index) => {
    message += `${index + 1}. *${item.name}*\n`
    message += `   • Cantidad: ${item.quantity}\n`
    message += `   • Precio unitario: ${formatPrice(item.price)}\n`
    message += `   • Subtotal: ${formatPrice(item.price * item.quantity)}\n\n`
  })
  
  message += '💰 *Resumen de costos:*\n'
  message += `   • Subtotal: ${formatPrice(subtotal)}\n`
  message += `   • Envío: ${formatPrice(shipping)}\n`
  message += `   • *TOTAL: ${formatPrice(total)}*\n\n`
  message += '📍 *Información de entrega:*\n'
  message += 'Por favor, confirme la dirección de entrega y fecha preferida.\n\n'
  message += '¡Gracias por elegir Nicole Pastry Arts! 🌟'
  
  return message
}

// Función para abrir WhatsApp
const openWhatsApp = () => {
  const phoneNumber = '+593987149283' // Número sin espacios ni guiones
  const message = generateWhatsAppMessage()
  const encodedMessage = encodeURIComponent(message)
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`
  
  // Abrir en nueva ventana
  window.open(whatsappUrl, '_blank')
}

// Handlers para eventos
const handleProceedCheckout = () => {
  emit('proceed-checkout')
}

const handleContinueShopping = () => {
  emit('continue-shopping')
}

const handleClearCart = () => {
  emit('clear-cart')
}
</script>

<template>
  <div class="cart-summary">
    <h3 class="cart-summary__title">
      <i class="fas fa-receipt"></i>
      Resumen del Pedido
    </h3>
    
    <div class="cart-summary__content">
      <div class="cart-summary__line">
        <span class="cart-summary__label">Subtotal:</span>
        <span class="cart-summary__value">{{ formattedSubtotal }}</span>
      </div>
      
      <div class="cart-summary__line">
        <span class="cart-summary__label">
          Envío{{ zoneName ? ` (${zoneName})` : '' }}:
        </span>
        <span class="cart-summary__value">{{ formattedShipping }}</span>
      </div>
      
      <div class="cart-summary__line cart-summary__line--total">
        <span class="cart-summary__label">Total:</span>
        <span class="cart-summary__value">{{ formattedTotal }}</span>
      </div>
    </div>

    <div class="cart-summary__actions">
      <!-- Botón de pago tradicional -->
      <button
        @click="handleProceedCheckout"
        :disabled="!isShippingValid || isLoading"
        class="cart-summary__checkout"
      >
        <i v-if="isLoading" class="fas fa-spinner fa-spin"></i>
        <i v-else class="fas fa-credit-card"></i>
        <span v-if="isLoading">Procesando...</span>
        <span v-else>Proceder al Pago</span>
      </button>

      <!-- Botón de WhatsApp -->
      <button
        @click="openWhatsApp"
        :disabled="cartStore.isEmpty || isLoading"
        class="cart-summary__whatsapp"
      >
        <i class="fab fa-whatsapp"></i>
        <span>Comprar por WhatsApp</span>
      </button>

      <div class="cart-summary__secondary-actions">
        <button
          @click="handleContinueShopping"
          class="cart-summary__continue"
        >
          <i class="fas fa-arrow-left"></i>
          Seguir Comprando
        </button>

        <button
          @click="handleClearCart"
          class="cart-summary__clear"
        >
          <i class="fas fa-trash"></i>
          Vaciar Carrito
        </button>
      </div>
    </div>

    <!-- Mensaje de validación -->
    <div 
      v-if="!isShippingValid" 
      class="cart-summary__validation-message"
      :class="{ 'cart-summary__validation-message--error': cedulaError }"
    >
      <i :class="cedulaError ? 'fas fa-exclamation-triangle' : 'fas fa-info-circle'"></i>
      <span v-if="cedulaError">{{ cedulaError }}</span>
      <span v-else>Completa los datos de envío para continuar</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// Resumen del carrito - Mobile First
.cart-summary {
  background-color: $white;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba($NICOLE-PRIMARY, 0.08);
  border: 1px solid $border-light;
  position: sticky;
  top: 2rem;

  @media (min-width: 768px) {
    border-radius: 16px;
    padding: 2rem;
  }

  &__title {
    font-size: 1.25rem;
    font-weight: 600;
    color: $text-dark;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;

    @media (min-width: 768px) {
      font-size: 1.375rem;
      margin-bottom: 2rem;
      gap: 1rem;
    }

    i {
      color: $NICOLE-PRIMARY;
      font-size: 1.125rem;

      @media (min-width: 768px) {
        font-size: 1.25rem;
      }
    }
  }

  &__content {
    margin-bottom: 2rem;

    @media (min-width: 768px) {
      margin-bottom: 2.5rem;
    }
  }

  &__line {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 0;
    border-bottom: 1px solid $border-light;

    @media (min-width: 768px) {
      padding: 1rem 0;
    }

    &--total {
      border-bottom: none;
      padding-top: 1rem;
      margin-top: 0.5rem;
      border-top: 2px solid $NICOLE-PRIMARY;
      font-weight: 600;

      @media (min-width: 768px) {
        padding-top: 1.25rem;
        margin-top: 0.75rem;
      }

      .cart-summary__label,
      .cart-summary__value {
        font-size: 1.125rem;
        color: $text-dark;

        @media (min-width: 768px) {
          font-size: 1.25rem;
        }
      }
    }
  }

  &__label {
    font-size: 1rem;
    color: $text-light;

    @media (min-width: 768px) {
      font-size: 1.05rem;
    }
  }

  &__value {
    font-size: 1rem;
    font-weight: 500;
    color: $text-dark;

    @media (min-width: 768px) {
      font-size: 1.05rem;
    }
  }

  &__actions {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    @media (min-width: 768px) {
      gap: 1.25rem;
    }
  }

  &__checkout {
    width: 100%;
    padding: 1rem 1.5rem;
    background: linear-gradient(135deg, $NICOLE-PRIMARY 0%, darken($NICOLE-PRIMARY, 10%) 100%);
    color: $white;
    border: none;
    border-radius: 16px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    min-height: 56px;

    @media (min-width: 768px) {
      padding: 1.125rem 2rem;
      font-size: 1.05rem;
      border-radius: 20px;
      min-height: 60px;
      gap: 1rem;
    }

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba($NICOLE-PRIMARY, 0.3);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    i {
      font-size: 1rem;

      @media (min-width: 768px) {
        font-size: 1.125rem;
      }
    }
  }

  &__whatsapp {
    width: 100%;
    padding: 1rem 1.5rem;
    background: linear-gradient(135deg, #25D366 0%, darken(#25D366, 10%) 100%);
    color: $white;
    border: none;
    border-radius: 16px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    min-height: 56px;

    @media (min-width: 768px) {
      padding: 1.125rem 2rem;
      font-size: 1.05rem;
      border-radius: 20px;
      min-height: 60px;
      gap: 1rem;
    }

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(#25D366, 0.3);
      background: linear-gradient(135deg, lighten(#25D366, 5%) 0%, #25D366 100%);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    i {
      font-size: 1.125rem;

      @media (min-width: 768px) {
        font-size: 1.25rem;
      }
    }
  }

  &__secondary-actions {
    display: flex;
    gap: 0.75rem;

    @media (min-width: 768px) {
      gap: 1rem;
    }
  }

  &__continue,
  &__clear {
    flex: 1;
    padding: 0.875rem 1rem;
    border: 1px solid $border-light;
    border-radius: 12px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    min-height: 48px;

    @media (min-width: 768px) {
      padding: 1rem 1.25rem;
      border-radius: 16px;
      font-size: 0.95rem;
      min-height: 52px;
      gap: 0.75rem;
    }

    i {
      font-size: 0.875rem;

      @media (min-width: 768px) {
        font-size: 1rem;
      }
    }
  }

  &__continue {
    background-color: $white;
    color: $text-dark;

    &:hover {
      background-color: rgba($NICOLE-PRIMARY, 0.05);
      border-color: $NICOLE-PRIMARY;
      color: $NICOLE-PRIMARY;
    }
  }

  &__clear {
    background-color: $white;
    color: $error;
    border-color: rgba($error, 0.3);

    &:hover {
        background-color: rgba($error, 0.05);
        border-color: $error;
    }
  }

  &__validation-message {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    border-radius: 12px;
    font-size: 0.875rem;
    margin-top: 1rem;

    @media (min-width: 768px) {
      padding: 1.125rem;
      border-radius: 16px;
      font-size: 0.95rem;
      gap: 1rem;
      margin-top: 1.25rem;
    }

    // Estilo por defecto (info)
    background-color: rgba($info, 0.1);
    border: 1px solid rgba($info, 0.3);
    color: darken($info, 20%);

    i {
      color: $info;
      font-size: 1rem;
      flex-shrink: 0;

      @media (min-width: 768px) {
        font-size: 1.125rem;
      }
    }

    span {
      line-height: 1.4;
    }
  }

  // Estilo específico para errores de cédula
  &__validation-message--error {
    background-color: rgba($error, 0.1) !important;
    border: 1px solid rgba($error, 0.3) !important;
    color: darken($error, 20%) !important;

    i {
      color: $error !important;
    }
  }
}
</style>