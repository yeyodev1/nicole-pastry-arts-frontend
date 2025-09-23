<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Product } from '@/types/products'

const router = useRouter()

const props = defineProps({
  product: {
    type: Object as () => Product,
    required: true,
  },
})

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

// Estado de disponibilidad
const isAvailable = computed(() => {
  return props.product.active !== false && (props.product.quantity || 0) > 0
})
</script>

<template>
  <article class="product-card" :class="{ 'unavailable': !isAvailable }" @click="navigateToProduct">
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
      
      <!-- Badge de no disponible -->
      <div v-if="!isAvailable" class="unavailable-badge">
        No disponible
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
        
        <button 
          class="add-to-cart-btn"
          :disabled="!isAvailable"
          @click.stop="$emit('addToCart', product)"
        >
          {{ isAvailable ? 'Agregar' : 'Agotado' }}
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
}

.product-price {
  @include heading-font(700);
  font-size: 1.2rem;
  color: $purple-primary;

  @media (min-width: 768px) {
    font-size: 1.3rem;
  }
}

.add-to-cart-btn {
  @include interface-font(600);
  background-color: $purple-primary;
  color: $white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  white-space: nowrap;

  &:hover:not(:disabled) {
    background-color: $purple-hover;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba($purple-primary, 0.3);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba($purple-primary, 0.2);
  }

  &:disabled {
    background-color: $gray-300;
    color: $text-light;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  @media (min-width: 768px) {
    padding: 0.75rem 1.25rem;
    font-size: 1rem;
  }
}
</style>