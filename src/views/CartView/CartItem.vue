<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits<{
  incrementQuantity: [productId: string]
  decrementQuantity: [productId: string]
  removeItem: [productId: string]
}>()

// Formatear precio
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-EC', {
    style: 'currency',
    currency: 'USD'
  }).format(price)
}

// Subtotal del item
const itemSubtotal = computed(() => {
  return props.item.price * props.item.quantity
})

// Handlers para eventos
const handleIncrement = () => {
  emit('incrementQuantity', props.item.id)
}

const handleDecrement = () => {
  emit('decrementQuantity', props.item.id)
}

const handleRemove = () => {
  emit('removeItem', props.item.id)
}
</script>

<template>
  <div class="cart-item">
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
        @click="handleRemove"
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
          @click="handleDecrement"
          class="cart-item__quantity-btn cart-item__quantity-btn--minus"
          :disabled="item.quantity <= 1"
        >
          <i class="fas fa-minus"></i>
        </button>
        <span class="cart-item__quantity-value">{{ item.quantity }}</span>
        <button 
          @click="handleIncrement"
          class="cart-item__quantity-btn cart-item__quantity-btn--plus"
        >
          <i class="fas fa-plus"></i>
        </button>
      </div>

      <!-- Subtotal -->
      <div class="cart-item__subtotal">
        {{ formatPrice(itemSubtotal) }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// Cart Item - Mobile First
.cart-item {
  background-color: $white;
  border-radius: 20px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 8px 32px rgba($NICOLE-PRIMARY, 0.08);
  border: 1px solid $border-light;
  transition: all 0.3s ease;

  @media (min-width: 768px) {
    border-radius: 16px;
    padding: 2rem;
    margin-bottom: 2rem;
  }

  &:hover {
    box-shadow: 0 12px 40px rgba($NICOLE-PRIMARY, 0.12);
    transform: translateY(-2px);
  }

  // Header con imagen, info y botón eliminar
  &__header {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.25rem;

    @media (min-width: 768px) {
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }
  }

  &__image {
    flex-shrink: 0;
    width: 80px;
    height: 80px;
    border-radius: 12px;
    overflow: hidden;
    background-color: $background-light;

    @media (min-width: 768px) {
      width: 100px;
      height: 100px;
      border-radius: 16px;
    }
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.05);
    }
  }

  &__info {
    flex: 1;
    min-width: 0;
  }

  &__name {
    font-size: 1.125rem;
    font-weight: 600;
    color: $text-dark;
    margin-bottom: 0.5rem;
    line-height: 1.4;

    @media (min-width: 768px) {
      font-size: 1.25rem;
      margin-bottom: 0.75rem;
    }
  }

  &__description {
    font-size: 0.875rem;
    color: $text-light;
    margin-bottom: 0.75rem;
    line-height: 1.5;

    @media (min-width: 768px) {
      font-size: 0.95rem;
      margin-bottom: 1rem;
    }

    // Estilos para contenido HTML
    :deep(p) {
      margin: 0 0 0.5rem 0;
      
      &:last-child {
        margin-bottom: 0;
      }
    }

    :deep(strong),
    :deep(b) {
      color: $text-dark;
      font-weight: 600;
    }
  }

  &__price {
    font-size: 1rem;
    font-weight: 600;
    color: $NICOLE-PRIMARY;

    @media (min-width: 768px) {
      font-size: 1.125rem;
    }
  }

  &__remove {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    background-color: rgba($error, 0.1);
    color: $error;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;

    @media (min-width: 768px) {
      width: 44px;
      height: 44px;
    }

    &:hover {
      background-color: $error;
      color: $white;
      transform: scale(1.05);
    }

    &:active {
      transform: scale(0.95);
    }

    i {
      font-size: 0.875rem;

      @media (min-width: 768px) {
        font-size: 1rem;
      }
    }
  }

  // Footer con cantidad y subtotal
  &__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 1.25rem;
    border-top: 1px solid $border-light;

    @media (min-width: 768px) {
      padding-top: 1.5rem;
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
      gap: 1rem;
      border-radius: 16px;
      padding: 0.75rem;
    }
  }

  &__quantity-btn {
    width: 36px;
    height: 36px;
    background-color: $white;
    color: $NICOLE-PRIMARY;
    border: 1px solid $border-light;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;

    @media (min-width: 768px) {
      width: 40px;
      height: 40px;
      border-radius: 12px;
    }

    &:hover:not(:disabled) {
      background-color: $NICOLE-PRIMARY;
      color: $white;
      border-color: $NICOLE-PRIMARY;
      transform: scale(1.05);
    }

    &:active:not(:disabled) {
      transform: scale(0.95);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
    }

    i {
      font-size: 0.75rem;

      @media (min-width: 768px) {
        font-size: 0.875rem;
      }
    }

    &--plus {
      background: linear-gradient(135deg, $NICOLE-PRIMARY, $purple-light);
      color: $white;
      border-color: $NICOLE-PRIMARY;

      &:hover {
        background: linear-gradient(135deg, darken($NICOLE-PRIMARY, 10%), $NICOLE-PRIMARY);
      }
    }
  }

  &__quantity-value {
    font-size: 1.125rem;
    font-weight: 600;
    color: $text-dark;
    min-width: 2rem;
    text-align: center;

    @media (min-width: 768px) {
      font-size: 1.25rem;
    }
  }

  &__subtotal {
    font-size: 1.25rem;
    font-weight: 700;
    color: $text-dark;

    @media (min-width: 768px) {
      font-size: 1.375rem;
    }
  }
}
</style>