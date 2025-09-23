<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { productsService } from '@/services/products'
import type { Product } from '@/types/products'
import PaymentButton from '@/components/PaymentButton.vue'

const route = useRoute()
const router = useRouter()

// Estado del componente
const product = ref<Product | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)

// Imagen principal del producto
const primaryImage = computed(() => {
  if (!product.value?.images || product.value.images.length === 0) {
    return null
  }
  return product.value.images[0]
})

// Precio formateado
const formattedPrice = computed(() => {
  if (!product.value) return ''

  const price = parseFloat(product.value.price) || 0
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
  if (!product.value) return false
  // Los productos siempre están disponibles según la política de Nicole Pastry Arts
  return product.value.active !== false
})

// Cargar producto por ID
const fetchProduct = async () => {
  try {
    isLoading.value = true
    error.value = null

    const productId = route.params.id as string
    const response = await productsService.getProductById(productId)

    if (response.data) {
      // Agregar aliases para compatibilidad
      product.value = {
        ...response.data,
        id: response.data.web_id,
        name: response.data.title,
        stock: response.data.quantity,
        is_available: response.data.active
      }
    } else {
      error.value = 'Producto no encontrado'
    }
  } catch (err) {
    console.error('Error al cargar producto:', err)
    error.value = 'Error al cargar el producto'
  } finally {
    isLoading.value = false
  }
}

// Volver a la lista de productos
const goBack = () => {
  router.push('/products')
}

// Agregar al carrito (placeholder)
const addToCart = () => {
  if (product.value && isAvailable.value) {
    // TODO: Implementar lógica del carrito
    console.log('Agregando al carrito:', product.value)
    alert(`${product.value.title} agregado al carrito`)
  }
}

// Cargar producto al montar
onMounted(() => {
  fetchProduct()
})
</script>

<template>
  <div class="product-detail-view">
    <!-- Loading State -->
    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner"></div>
      <p class="loading-text">Cargando producto...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-container">
      <div class="error-content">
        <h2 class="error-title">¡Oops! Algo salió mal</h2>
        <p class="error-message">{{ error }}</p>
        <button class="back-btn" @click="goBack">
          Volver a productos
        </button>
      </div>
    </div>

    <!-- Product Content -->
    <div v-else-if="product" class="product-content">
      <!-- Header con botón de regreso -->
      <header class="product-header">
        <button class="back-btn" @click="goBack">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Volver
        </button>
      </header>

      <!-- Contenido principal del producto -->
      <main class="product-main">
        <div class="product-container">
          <!-- Imagen del producto -->
          <div class="product-image-section">
            <div class="product-image-container">
              <img
                v-if="primaryImage"
                :src="primaryImage"
                :alt="product.title"
                class="product-image"
              />
              <div v-else class="product-image-placeholder">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 19V5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19ZM8.5 13.5L11 16.51L14.5 12L19 18H5L8.5 13.5Z" fill="currentColor"/>
                </svg>
              </div>
              

            </div>
          </div>

          <!-- Información del producto -->
          <div class="product-info-section">
            <div class="product-info">
              <!-- Categoría -->
              <div v-if="product.category" class="product-category">
                {{ product.category.name }}
              </div>

              <!-- Título -->
              <h1 class="product-title">{{ product.title }}</h1>

              <!-- Precio -->
              <div class="product-price">{{ formattedPrice }}</div>

              <!-- Descripción -->
              <div 
                v-if="product.description" 
                class="product-description"
                v-html="product.description"
              ></div>

              <!-- Información adicional -->
              <div class="product-details">
                <div class="detail-item">
                  <span class="detail-label">Disponibilidad:</span>
                  <span class="detail-value available">
                    Siempre disponible
                  </span>
                </div>
                
                <div v-if="product.quantity" class="detail-item">
                  <span class="detail-label">Cantidad disponible:</span>
                  <span class="detail-value">{{ product.quantity }}</span>
                </div>

                <div v-if="product.subcategory" class="detail-item">
                  <span class="detail-label">Subcategoría:</span>
                  <span class="detail-value">{{ product.subcategory.name }}</span>
                </div>
              </div>

              <!-- Botón de pago -->
              <div class="product-actions">
                <PaymentButton
                  :product-id="product.web_id"
                  :product-name="product.title"
                  :price="parseFloat(product.price)"
                  :description="product.description"
                  variant="primary"
                  size="large"
                  full-width
                  @payment-started="(productId) => console.log('Pago iniciado para:', productId)"
                  @payment-error="(error) => console.error('Error en pago:', error)"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.product-detail-view {
  min-height: 100vh;
  background-color: $background-light;
}

// Loading State
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 1rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid $gray-200;
  border-top: 3px solid $purple-primary;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.loading-text {
  @include interface-font(400);
  color: $text-light;
  font-size: 1.1rem;
}

// Error State
.error-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 2rem;
}

.error-content {
  text-align: center;
  max-width: 400px;
}

.error-title {
  @include heading-font(600);
  font-size: 1.5rem;
  color: $error;
  margin-bottom: 1rem;
}

.error-message {
  @include body-font(400);
  color: $text-light;
  margin-bottom: 2rem;
  line-height: 1.6;
}

// Header
.product-header {
  background-color: $white;
  border-bottom: 1px solid $border-light;
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 2px 8px rgba($text-dark, 0.1);
}

.back-btn {
  @include interface-font(500);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: transparent;
  border: 1px solid $purple-primary;
  color: $purple-primary;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 0 1rem;

  svg {
    width: 20px;
    height: 20px;
  }

  &:hover {
    background-color: $purple-primary;
    color: $white;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba($purple-primary, 0.3);
  }

  @media (min-width: 768px) {
    margin: 0 2rem;
  }
}

// Main Content
.product-main {
  padding: 2rem 0;
}

.product-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media (min-width: 768px) {
    padding: 0 2rem;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
  }

  @media (min-width: 1024px) {
    gap: 4rem;
  }
}

// Product Image
.product-image-section {
  order: 1;

  @media (min-width: 768px) {
    order: 0;
  }
}

.product-image-container {
  position: relative;
  width: 100%;
  height: 300px;
  border-radius: 12px;
  overflow: hidden;
  background-color: $gray-100;

  @media (min-width: 768px) {
    height: 400px;
  }

  @media (min-width: 1024px) {
    height: 500px;
  }
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
    width: 64px;
    height: 64px;
  }
}

.unavailable-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background-color: rgba($error, 0.9);
  color: $white;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

// Product Info
.product-info-section {
  order: 0;

  @media (min-width: 768px) {
    order: 1;
  }
}

.product-info {
  background-color: $white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba($text-dark, 0.1);
}

.product-category {
  @include interface-font(500);
  color: $purple-primary;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.5rem;
}

.product-title {
  @include heading-font(700);
  font-size: 1.8rem;
  color: $text-dark;
  margin-bottom: 1rem;
  line-height: 1.3;

  @media (min-width: 768px) {
    font-size: 2.2rem;
  }
}

.product-price {
  @include heading-font(700);
  font-size: 1.8rem;
  color: $purple-primary;
  margin-bottom: 1.5rem;

  @media (min-width: 768px) {
    font-size: 2rem;
  }
}

.product-description {
  @include body-font(400);
  font-size: 1rem;
  color: $text-light;
  line-height: 1.6;
  margin-bottom: 2rem;

  // Estilos para contenido HTML renderizado
  :deep(p) {
    margin: 0 0 1rem 0;

    &:last-child {
      margin-bottom: 0;
    }
  }

  :deep(span) {
    color: inherit !important;
  }

  :deep(strong),
  :deep(b) {
    font-weight: 600;
    color: $text-dark;
  }

  :deep(em),
  :deep(i) {
    font-style: italic;
  }
}

.product-details {
  margin-bottom: 2rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid $border-light;

  &:last-child {
    border-bottom: none;
  }
}

.detail-label {
  @include interface-font(500);
  color: $text-dark;
  font-size: 0.9rem;
}

.detail-value {
  @include interface-font(400);
  color: $text-light;
  font-size: 0.9rem;

  &.available {
    color: $success;
    font-weight: 500;
  }

  &.unavailable {
    color: $error;
    font-weight: 500;
  }
}

.product-actions {
  margin-top: 2rem;
}

.add-to-cart-btn {
  @include interface-font(600);
  width: 100%;
  background-color: $purple-primary;
  color: $white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.1rem;

  &:hover:not(:disabled) {
    background-color: $purple-hover;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba($purple-primary, 0.3);
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
}
</style>