import { computed, onMounted, watch } from 'vue'
import { useProductsStore } from '@/stores/products.store'
import type { Product, Category, ProductFilters, ProductsQueryParams } from '@/types/products'

/**
 * Composable para manejo de productos
 * Encapsula la lógica del store y proporciona una API limpia para componentes
 */
export function useProducts() {
  const store = useProductsStore()

  // ===== ESTADO REACTIVO =====
  const products = computed(() => store.products)
  const categories = computed(() => store.categories)
  const selectedProduct = computed(() => store.selectedProduct)
  const selectedCategory = computed(() => store.selectedCategory)
  const isLoading = computed(() => store.isLoading)
  const hasError = computed(() => store.hasError)
  const error = computed(() => store.error)
  const pagination = computed(() => store.currentPagination)
  const filteredProducts = computed(() => store.filteredProducts)
  const availableProducts = computed(() => store.availableProducts)
  const totalProducts = computed(() => store.totalProducts)

  // ===== MÉTODOS =====

  /**
   * Inicializa los datos básicos (productos y categorías)
   */
  const initialize = async (): Promise<void> => {
    await Promise.all([store.fetchProducts({ page: 1 }), store.fetchCategories()])
  }

  /**
   * Carga productos con parámetros específicos
   */
  const loadProducts = async (params?: ProductsQueryParams): Promise<void> => {
    await store.fetchProducts(params)
  }

  /**
   * Carga un producto específico
   */
  const loadProduct = async (id: string): Promise<Product | null> => {
    return await store.fetchProductById(id)
  }

  /**
   * Filtra productos por categoría
   */
  const filterByCategory = async (categoryId: string, page = 1): Promise<void> => {
    await store.fetchProductsByCategory(categoryId, { page })
  }

  /**
   * Filtra productos por subcategoría
   */
  const filterBySubcategory = async (subcategoryId: string, page = 1): Promise<void> => {
    await store.fetchProductsBySubcategory(subcategoryId, { page })
  }

  /**
   * Aplica filtros múltiples
   */
  const applyFilters = async (filters: ProductFilters): Promise<void> => {
    await store.applyFilters(filters)
  }

  /**
   * Busca productos por término
   */
  const searchProducts = (searchTerm: string): void => {
    store.searchProducts(searchTerm)
  }

  /**
   * Limpia todos los filtros
   */
  const clearAllFilters = async (): Promise<void> => {
    await store.clearFilters()
  }

  /**
   * Carga la siguiente página
   */
  const loadMore = async (): Promise<void> => {
    await store.loadNextPage()
  }

  /**
   * Selecciona un producto
   */
  const selectProduct = (product: Product | null): void => {
    store.selectProduct(product)
  }

  /**
   * Selecciona una categoría
   */
  const selectCategory = (category: Category | null): void => {
    store.selectCategory(category)
  }

  /**
   * Limpia errores
   */
  const clearError = (): void => {
    store.clearError()
  }

  /**
   * Resetea el estado completo
   */
  const reset = (): void => {
    store.resetStore()
  }

  // ===== UTILIDADES =====

  /**
   * Verifica si hay más páginas disponibles
   */
  const hasMorePages = computed(() => pagination.value?.hasNextPage ?? false)

  /**
   * Obtiene productos de una categoría específica
   */
  const getProductsByCategory = (categoryId: string) => {
    return products.value.filter((product: Product) => product.category?.web_id === categoryId)
  }

  /**
   * Busca un producto por ID en el estado actual
   */
  const findProductById = (id: string) => {
    return products.value.find((product: Product) => product.id === id)
  }

  /**
   * Busca una categoría por ID
   */
  const findCategoryById = (id: string) => {
    return categories.value.find((category: Category) => category.id === id)
  }

  /**
   * Obtiene el nombre de una categoría por ID
   */
  const getCategoryName = (categoryId: string): string => {
    const category = findCategoryById(categoryId)
    return category?.name ?? 'Categoría desconocida'
  }

  return {
    // Estado
    products,
    categories,
    selectedProduct,
    selectedCategory,
    isLoading,
    hasError,
    error,
    pagination,
    filteredProducts,
    availableProducts,
    totalProducts,
    hasMorePages,

    // Métodos principales
    initialize,
    loadProducts,
    loadProduct,
    filterByCategory,
    filterBySubcategory,
    applyFilters,
    searchProducts,
    clearAllFilters,
    loadMore,
    selectProduct,
    selectCategory,
    clearError,
    reset,

    // Utilidades
    getProductsByCategory,
    findProductById,
    findCategoryById,
    getCategoryName,
  }
}

/**
 * Composable específico para inicialización automática
 * Útil para páginas que necesitan cargar datos al montar
 */
export function useProductsWithAutoLoad() {
  const productsComposable = useProducts()

  // Auto-inicialización al montar
  onMounted(async () => {
    if (productsComposable.totalProducts.value === 0) {
      await productsComposable.initialize()
    }
  })

  return productsComposable
}

/**
 * Composable para manejo de filtros reactivos
 * Útil para componentes de filtrado avanzado
 */
export function useProductFilters() {
  const { applyFilters, clearAllFilters, isLoading } = useProducts()

  /**
   * Aplica filtros con debounce automático
   */
  const applyFiltersWithDebounce = (() => {
    let timeoutId: number

    return (filters: ProductFilters, delay = 300): void => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        applyFilters(filters)
      }, delay)
    }
  })()

  return {
    applyFilters,
    applyFiltersWithDebounce,
    clearAllFilters,
    isLoading,
  }
}
