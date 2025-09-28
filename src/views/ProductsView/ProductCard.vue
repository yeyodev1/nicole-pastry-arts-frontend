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

  // Si el precio es $0, mostrar "Producto Premium"
  if (price === 0) {
    return 'Producto Premium'
  }

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

// Verificar si el producto tiene precio $0 (requiere cotización)
const requiresQuote = computed(() => {
  const price = parseFloat(props.product.price) || 0
  return price === 0
})

// Función para abrir WhatsApp con mensaje del producto
const contactWhatsApp = (event: Event) => {
  event.stopPropagation() // Evitar navegación al detalle

  const message = generateWhatsAppMessage()
  const phoneNumber = '593987149283' // Número de WhatsApp de Nicole Pastry Arts
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`

  window.open(whatsappUrl, '_blank')
}

// Generar mensaje para WhatsApp
const generateWhatsAppMessage = () => {
  const productName = props.product.title
  const productDescription = props.product.description ?
    props.product.description.replace(/<[^>]*>/g, '') : // Remover HTML tags
    ''

  let message = `¡Hola! Me interesa el siguiente producto:\n\n`
  message += `🍰 *${productName}*\n`

  if (productDescription) {
    message += `📝 ${productDescription}\n`
  }

  message += `\n¿Podrías darme más información sobre precios y disponibilidad?\n\n`
  message += `¡Gracias! 😊`

  return message
}
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
        <span class="product-price" :class="{ 'product-price--premium': requiresQuote }">{{ formattedPrice }}</span>
        
        <!-- Indicador de cantidad en carrito -->
        <div v-if="cartQuantity > 0" class="cart-quantity-badge">
          {{ cartQuantity }}
        </div>
      </div>
      
      <!-- Botones de acción -->
      <div class="product-actions">
        <!-- Botón de WhatsApp para productos sin precio -->
        <button
          v-if="requiresQuote"
          class="btn btn--whatsapp whatsapp-btn"
          :disabled="!isAvailable"
          @click="contactWhatsApp"
        >
          <svg class="whatsapp-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
          </svg>
          Pedir por WhatsApp
        </button>
        
        <!-- Botones normales para productos con precio -->
        <template v-else>
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
        </template>
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

  // Estilos especiales para "Producto Premium"
  &--premium {
    background: linear-gradient(135deg, #8B5CF6, #A855F7);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-weight: 800;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    font-size: 0.9rem;

    @media (min-width: 768px) {
      font-size: 1rem;
    }
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
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }

  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

.btn--whatsapp {
  background-color: #25D366; // Color oficial de WhatsApp
  color: $white;
  width: 100%; // Ocupa todo el ancho disponible
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 600;

  &:hover:not(:disabled) {
    background-color: #128C7E; // Color más oscuro para hover
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3);
  }

  &:focus {
    box-shadow: 0 0 0 3px rgba(37, 211, 102, 0.2);
  }
}

.whatsapp-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;

  @media (min-width: 768px) {
    width: 20px;
    height: 20px;
  }
}
</style>