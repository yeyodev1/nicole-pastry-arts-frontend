<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { Product } from '@/types/products'
import PaymentButton from '@/components/PaymentButton.vue'
import { useCartStore } from '@/stores/cart.store'

const router = useRouter()
const cartStore = useCartStore()

const props = defineProps({
  product: {
    type: Object as () => Product,
    required: true,
  },
})

// Estado local
const isAddingToCart = ref(false)

// Emits
const emit = defineEmits<{
  paymentStarted: [productId: string];
  paymentError: [error: string];
  productAddedToCart: [productId: string];
}>()

// Función para navegar al detalle del producto
const navigateToProduct = () => {
  router.push({ name: 'product-detail', params: { id: props.product.web_id } })
}

// Imagen principal del producto
const primaryImage = computed(() => {
  if (!props.product.images || props.product.images.length === 0) {
    return null
  }

  // Las imágenes ahora son un array de strings
  return props.product.images[0]
})

// Precio formateado
const formattedPrice = computed(() => {
  const price = parseFloat(props.product.price) || 0
  const currency = 'USD'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
})

// Estado de disponibilidad - Siempre disponible según política de la empresa
const isAvailable = computed(() => {
  // Los productos siempre están disponibles según la política de Nicole Pastry Arts
  return props.product.active !== false
})

// Función para agregar al carrito
const addToCart = async (event: Event) => {
  event.stopPropagation() // Evitar navegación al detalle
  
  if (!isAvailable.value || isAddingToCart.value) return
  
  isAddingToCart.value = true
  
  try {
    const cartItem = {
      id: props.product.web_id,
      name: props.product.title,
      price: parseFloat(props.product.price) || 0,
      image: primaryImage.value || undefined,
      description: props.product.description || undefined
    }
    
    cartStore.addItem(cartItem)
    emit('productAddedToCart', props.product.web_id)
    
    // Pequeña pausa para mostrar feedback visual
    await new Promise(resolve => setTimeout(resolve, 300))
  } catch (error) {
    console.error('Error adding to cart:', error)
  } finally {
    isAddingToCart.value = false
  }
}

// Función para comprar ahora (agregar al carrito y navegar)
const buyNow = async (event: Event) => {
  event.stopPropagation() // Evitar navegación al detalle
  
  if (!isAvailable.value) return
  
  await addToCart(event)
  
  // Navegar al carrito después de agregar el producto
  router.push({ name: 'cart' })
}

// Cantidad actual en el carrito
const cartQuantity = computed(() => {
  return cartStore.getItemQuantity(props.product.web_id)
})
</script>

<template>
  <article class="product-card" @click="navigateToProduct">
    <!-- Imagen del producto -->
    <div class="product-image-container">
      <img
        v-if="primaryImage"
        :src="primaryImage"
        :alt="product.title"
        class="product-image"
        loading="lazy"
      />
      <div v-else class="product-image-placeholder">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 19V5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19ZM8.5 13.5L11 16.51L14.5 12L19 18H5L8.5 13.5Z" fill="currentColor"/>
        </svg>
      </div>
      

    </div>

    <!-- Información del producto -->
    <div class="product-info">
      <h3 class="product-name">{{ product.title }}</h3>
      
      <div 
        v-if="product.description" 
        class="product-description"
        v-html="product.description"
      ></div>
      
      <div class="product-footer">
        <span class="product-price">{{ formattedPrice }}</span>
        
        <!-- Indicador de cantidad en carrito -->
        <div v-if="cartQuantity > 0" class="cart-quantity-badge">
          {{ cartQuantity }}
        </div>
      </div>
      
      <!-- Botones de acción -->
      <div class="product-actions">
        <button
          class="btn btn--secondary add-to-cart-btn"
          :class="{ 'btn--loading': isAddingToCart }"
          :disabled="!isAvailable || isAddingToCart"
          @click="addToCart"
        >
          <span v-if="!isAddingToCart">
            {{ cartQuantity > 0 ? 'Añadir más' : 'Añadir' }}
          </span>
          <span v-else class="loading-spinner"></span>
        </button>
        
        <button
          class="btn btn--primary buy-now-btn"
          :disabled="!isAvailable"
          @click="buyNow"
        >
          Comprar Ahora
        </button>
      </div>
    </div>
  </article>
</template>

<style lang="scss" scoped>
.product-card {
  background-color: $white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba($text-dark, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba($text-dark, 0.15);
  }

  &.unavailable {
    opacity: 0.7;

    &:hover {
      transform: none;
      box-shadow: 0 2px 8px rgba($text-dark, 0.1);
    }
  }
}

.product-image-container {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background-color: $gray-100;

  @media (min-width: 768px) {
    height: 240px;
  }
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  .product-card:hover & {
    transform: scale(1.05);
  }

  .product-card.unavailable & {
    filter: grayscale(50%);
  }
}

.product-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $text-light;
  background-color: $gray-100;

  svg {
    width: 48px;
    height: 48px;
  }
}

.unavailable-badge {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background-color: rgba($error, 0.9);
  color: $white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.product-info {
  padding: 1.25rem;
}

.product-name {
  @include heading-font(600);
  font-size: 1.1rem;
  color: $text-dark;
  margin-bottom: 0.5rem;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media (min-width: 768px) {
    font-size: 1.2rem;
  }
}

.product-description {
  @include body-font(400);
  font-size: 0.9rem;
  color: $text-light;
  margin-bottom: 1rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  // Estilos para contenido HTML renderizado
  :deep(p) {
    margin: 0;
    padding: 0;
  }

  :deep(span) {
    color: inherit !important; // Sobrescribir colores inline
  }

  // Resetear estilos de elementos HTML comunes
  :deep(strong),
  :deep(b) {
    font-weight: 600;
  }

  :deep(em),
  :deep(i) {
    font-style: italic;
  }
}

.product-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
  position: relative;
}

.product-price {
  @include heading-font(700);
  font-size: 1.2rem;
  color: $purple-primary;

  @media (min-width: 768px) {
    font-size: 1.3rem;
  }
}

.cart-quantity-badge {
  @include interface-font(700);
  background-color: $purple-primary;
  color: $white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  position: absolute;
  top: -8px;
  right: -8px;
  box-shadow: 0 2px 4px rgba($purple-primary, 0.3);
}

.product-actions {
  display: flex;
  gap: 0.75rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.5rem;
  }
}

.btn {
  @include interface-font(600);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  padding: 0.75rem 1rem;
  text-align: center;
  position: relative;
  overflow: hidden;
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba($purple-primary, 0.2);
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
    transform: none !important;
    box-shadow: none !important;
  }
  
  @media (min-width: 768px) {
    font-size: 1rem;
    padding: 0.75rem 1.25rem;
  }
}

.btn--primary {
  background-color: $purple-primary;
  color: $white;
  flex: 1;
  
  &:hover:not(:disabled) {
    background-color: $purple-hover;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba($purple-primary, 0.3);
  }
}

.btn--secondary {
  background-color: transparent;
  color: $purple-primary;
  border: 2px solid $purple-primary;
  flex: 1;
  
  &:hover:not(:disabled) {
    background-color: $purple-primary;
    color: $white;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba($purple-primary, 0.2);
  }
  
  &.btn--loading {
    color: transparent;
  }
}

.loading-spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid $purple-primary;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}
</style>