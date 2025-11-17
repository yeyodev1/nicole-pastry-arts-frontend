<script setup lang="ts">
import { onMounted } from 'vue'
import { useProductsStore } from '@/stores/products.store'
import type { Category } from '@/types/products'
import ProductList from './ProductList.vue'

const productsStore = useProductsStore()

// Cargar categorías y productos al montar el componente
onMounted(async () => {
  await Promise.all([
    productsStore.fetchCategories(),
    productsStore.fetchProducts()
  ])
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

const isChristmas = (category: Category) => {
  return (category.name || '').toLowerCase().includes('navidad')
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
            :class="{
              'active': productsStore.selectedCategory?.web_id === category.web_id,
              'category-btn--christmas': isChristmas(category)
            }"
            @click="handleCategorySelect(category)"
          >
            <i v-if="isChristmas(category)" class="fas fa-tree"></i>
            {{ category.name }}
          </button>
        </nav>
      </div>
    </header>

    <!-- Contenido principal -->
    <main class="products-content" :class="{ 'products-content--christmas': productsStore.selectedCategory && isChristmas(productsStore.selectedCategory) }">
      <div class="products-container">
        <!-- Información de la categoría actual -->
        <div v-if="productsStore.selectedCategory" class="category-info" :class="{ 'category-info--christmas': productsStore.selectedCategory && isChristmas(productsStore.selectedCategory) }">
          <h2 class="category-title">{{ productsStore.selectedCategory.name }}</h2>
          <p v-if="productsStore.selectedCategory.description" class="category-description">
            {{ productsStore.selectedCategory.description }}
          </p>
        </div>

        <!-- Lista de productos -->
        <ProductList />
      </div>
    </main>
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:color';
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

.category-btn--christmas {
  border-color: color.scale($error, $saturation: -10%);
  color: color.scale($error, $saturation: -10%);
}

.category-btn--christmas i {
  margin-right: 0.5rem;
  color: color.scale($error, $saturation: -10%);
}

.category-btn--christmas:hover {
  background: linear-gradient(135deg, color.scale($error, $lightness: -6%), color.scale($error-dark, $lightness: -4%));
  border-color: color.scale($warning, $lightness: -10%);
  box-shadow: 0 6px 18px rgba($error, 0.4);
}

.category-btn--christmas.active {
  background: linear-gradient(135deg, color.scale($error, $lightness: -6%), color.scale($error-dark, $lightness: -4%));
  border-color: rgba($white, 0.5);
  color: $white;
}

.products-content {
  padding: 2rem 0;
  min-height: 60vh;
}

.products-content--christmas {
  background: radial-gradient(ellipse at top, rgba($error, 0.05), transparent 60%),
              radial-gradient(ellipse at bottom, rgba($warning, 0.04), transparent 60%);
}

.products-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;

  @media (min-width: 768px) {
    padding: 0 2rem;
  }
}

.category-info {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid $border-light;

  .category-title {
    @include heading-font(700);
    font-size: 1.8rem;
    color: $purple-primary;
    margin-bottom: 0.75rem;

    @media (min-width: 768px) {
      font-size: 2.2rem;
    }
  }

  .category-description {
    @include body-font(400);
    font-size: 1.1rem;
    color: $text-light;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
  }
}

.category-info--christmas .category-title {
  color: color.scale($error, $saturation: -10%);
}

.category-info--christmas .category-description {
  color: color.scale($error, $saturation: -20%);
}
</style>