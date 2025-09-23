<script setup lang="ts">
import { onMounted } from 'vue'
import { useProductsStore } from '@/stores/products.store'
import type { Category } from '@/types/products'

const productsStore = useProductsStore()

// Cargar categorías al montar el componente
onMounted(async () => {
  await productsStore.fetchCategories()
})

// Manejar selección de categoría
const handleCategorySelect = async (category: Category | null) => {
  productsStore.selectCategory(category)
  
  if (category) {
    // Usar web_id que es el identificador real de la API
    await productsStore.fetchProductsByCategory(category.web_id)
  } else {
    // Si no hay categoría seleccionada, mostrar todos los productos
    await productsStore.fetchProducts()
  }
}
</script>

<template>
  <div class="product-view">
    <!-- Header de Categorías -->
    <header class="categories-header">
      <div class="categories-container">
        <h1 class="categories-title">Nuestros Productos</h1>
        
        <!-- Loading state -->
        <div v-if="productsStore.isLoading" class="loading-state">
          Cargando categorías...
        </div>
        
        <!-- Error state -->
        <div v-else-if="productsStore.hasError" class="error-state">
          {{ productsStore.error }}
        </div>
        
        <!-- Categories Navigation -->
        <nav v-else class="categories-nav">
          <!-- Botón "Todos" -->
          <button 
            class="category-btn"
            :class="{ 'active': !productsStore.selectedCategory }"
            @click="handleCategorySelect(null)"
          >
            Todos
          </button>
          
          <!-- Botones de categorías -->
          <button
            v-for="category in productsStore.categoriesWithProducts"
            :key="category.web_id"
            class="category-btn"
            :class="{ 'active': productsStore.selectedCategory?.web_id === category.web_id }"
            @click="handleCategorySelect(category)"
          >
            {{ category.name }}
          </button>
        </nav>
      </div>
    </header>

    <!-- Contenido principal (placeholder por ahora) -->
    <main class="products-content">
      <div class="content-placeholder">
        <p v-if="productsStore.selectedCategory">
          Mostrando productos de: <strong>{{ productsStore.selectedCategory.name }}</strong>
        </p>
        <p v-else>
          Mostrando todos los productos
        </p>
        <p>Total de productos: {{ productsStore.totalProducts }}</p>
      </div>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.product-view {
  min-height: 100vh;
  background-color: $background-light;
}

.categories-header {
  background-color: $white;
  border-bottom: 1px solid $border-light;
  padding: 2rem 0;
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 2px 8px rgba($text-dark, 0.1);
}

.categories-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;

  @media (min-width: 768px) {
    padding: 0 2rem;
  }
}

.categories-title {
  @include heading-font(600);
  font-size: 2rem;
  color: $purple-primary;
  text-align: center;
  margin-bottom: 1.5rem;

  @media (min-width: 768px) {
    font-size: 2.5rem;
    margin-bottom: 2rem;
  }
}

.loading-state,
.error-state {
  @include interface-font(400);
  text-align: center;
  padding: 1rem;
  border-radius: 8px;
}

.loading-state {
  background-color: $gray-100;
  color: $text-light;
}

.error-state {
  background-color: rgba($error, 0.1);
  color: $error;
  border: 1px solid rgba($error, 0.2);
}

.categories-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
  align-items: center;

  @media (min-width: 768px) {
    gap: 1rem;
  }
}

.category-btn {
  @include interface-font(500);
  background-color: transparent;
  border: 2px solid $purple-primary;
  color: $purple-primary;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  white-space: nowrap;

  &:hover {
    background-color: $purple-hover;
    border-color: $purple-hover;
    color: $white;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba($purple-primary, 0.3);
  }

  &.active {
    background-color: $purple-primary;
    color: $white;
    box-shadow: 0 2px 8px rgba($purple-primary, 0.4);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba($purple-primary, 0.2);
  }

  @media (min-width: 768px) {
    padding: 1rem 2rem;
    font-size: 1rem;
  }
}

.products-content {
  padding: 2rem 0;
}

.content-placeholder {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  text-align: center;

  @media (min-width: 768px) {
    padding: 0 2rem;
  }

  p {
    @include body-font(400);
    color: $text-light;
    margin-bottom: 1rem;
    font-size: 1.1rem;

    strong {
      color: $purple-primary;
      font-weight: 600;
    }
  }
}
</style>