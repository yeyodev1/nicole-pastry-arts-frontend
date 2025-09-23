<script setup lang="ts">
import { computed } from 'vue'
import { useProductsStore } from '@/stores/products.store'
import ProductCard from '@/views/ProductsView/ProductCard.vue'

const productsStore = useProductsStore()

// Productos a mostrar según el filtro actual
const displayProducts = computed(() => {
  return productsStore.filteredProducts
})

// Estado de carga
const isLoading = computed(() => productsStore.isLoading)
const hasError = computed(() => productsStore.hasError)
const error = computed(() => productsStore.error)
</script>

<template>
  <div class="product-list">
    <!-- Loading state -->
    <div v-if="isLoading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Cargando productos...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="hasError" class="error-state">
      <p>{{ error }}</p>
      <button @click="productsStore.fetchProducts()" class="retry-btn">
        Intentar de nuevo
      </button>
    </div>

    <!-- Empty state -->
    <div v-else-if="displayProducts.length === 0" class="empty-state">
      <p>No se encontraron productos</p>
      <p class="empty-subtitle">
        {{ productsStore.selectedCategory 
          ? `No hay productos disponibles en la categoría "${productsStore.selectedCategory.name}"` 
          : 'No hay productos disponibles en este momento' 
        }}
      </p>
    </div>

    <!-- Products grid -->
    <div v-else class="products-grid">
      <ProductCard
        v-for="product in displayProducts"
        :key="product.id"
        :product="product"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.product-list {
  width: 100%;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid $gray-200;
    border-top: 3px solid $purple-primary;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }

  p {
    @include body-font(400);
    color: $text-light;
    font-size: 1.1rem;
  }
}

.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;

  p {
    @include body-font(400);
    color: $error;
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
  }

  .retry-btn {
    @include interface-font(500);
    background-color: $purple-primary;
    color: $white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background-color: $purple-hover;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba($purple-primary, 0.3);
    }

    &:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba($purple-primary, 0.2);
    }
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;

  p {
    @include body-font(600);
    color: $text-dark;
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
  }

  .empty-subtitle {
    @include body-font(400);
    color: $text-light;
    font-size: 1rem;
    margin-bottom: 0;
  }
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  padding: 1rem 0;

  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 2rem;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>