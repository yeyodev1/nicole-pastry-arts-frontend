import { ref, computed, readonly } from 'vue'
import { defineStore } from 'pinia'
import productsService from '@/services/products'
import type {
  Product,
  Category,
  ProductsState,
  ProductFilters,
  ProductsQueryParams,
  PaginationInfo,
  ApiError,
} from '@/types/products'

/**
 * Store de productos con Pinia - Gestión profesional del estado
 * Utiliza Composition API y manejo de errores robusto
 */
export const useProductsStore = defineStore('products', () => {
  // ===== ESTADO REACTIVO =====
  const products = ref<Product[]>([])
  const categories = ref<Category[]>([])
  const selectedProduct = ref<Product | null>(null)
  const selectedCategory = ref<Category | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref<PaginationInfo | null>(null)

  // Estado para filtros activos
  const activeFilters = ref<ProductFilters>({})
  const searchTerm = ref('')

  // ===== GETTERS COMPUTADOS =====

  /**
   * Productos filtrados por término de búsqueda local
   */
  const filteredProducts = computed(() => {
    if (!searchTerm.value) return products.value

    const term = searchTerm.value.toLowerCase()
    return products.value.filter(
      (product) =>
        product.title.toLowerCase().includes(term) ||
        product.description?.toLowerCase().includes(term),
    )
  })

  /**
   * Productos disponibles (en stock)
   */
  const availableProducts = computed(() =>
    products.value.filter((product) => product.is_available !== false),
  )

  /**
   * Categorías con productos disponibles
   */
  const categoriesWithProducts = computed(() =>
    categories.value.filter((category) => category.products_count > 0),
  )

  /**
   * Estado de carga general
   */
  const isLoading = computed(() => loading.value)

  /**
   * Indica si hay error activo
   */
  const hasError = computed(() => !!error.value)

  /**
   * Información de paginación actual
   */
  const currentPagination = computed(() => pagination.value)

  /**
   * Total de productos cargados
   */
  const totalProducts = computed(() => products.value.length)

  // ===== ACCIONES =====

  /**
   * Limpia el estado de error
   */
  const clearError = (): void => {
    error.value = null
  }

  /**
   * Establece el estado de carga
   */
  const setLoading = (isLoading: boolean): void => {
    loading.value = isLoading
  }

  /**
   * Maneja errores de forma centralizada
   */
  const handleError = (err: unknown, context: string): void => {
    console.error(`[ProductsStore] ${context}:`, err)

    if (typeof err === 'object' && err !== null && 'message' in err) {
      error.value = (err as ApiError).message
    } else {
      error.value = `Error en ${context}: ${String(err)}`
    }
  }

  /**
   * Obtiene todos los productos con parámetros opcionales
   */
  const fetchProducts = async (params: ProductsQueryParams = {}): Promise<void> => {
    try {
      setLoading(true)
      clearError()

      const response = await productsService.getAllProducts(params)

      // Si es la primera página, reemplaza; si no, agrega (para paginación infinita)
      if (params.page === 1 || !params.page) {
        products.value = response.data
      } else {
        products.value.push(...response.data)
      }

      pagination.value = response.pagination
    } catch (err) {
      handleError(err, 'obtener productos')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Obtiene un producto específico por ID
   */
  const fetchProductById = async (id: string): Promise<Product | null> => {
    try {
      setLoading(true)
      clearError()

      const response = await productsService.getProductById(id)
      selectedProduct.value = response.data

      return response.data
    } catch (err) {
      handleError(err, `obtener producto ${id}`)
      return null
    } finally {
      setLoading(false)
    }
  }

  /**
   * Obtiene productos por categoría
   */
  const fetchProductsByCategory = async (
    categoryId: string,
    params: Omit<ProductsQueryParams, 'category_id'> = {},
  ): Promise<void> => {
    try {
      setLoading(true)
      clearError()

      const response = await productsService.getProductsByCategory(categoryId, params)

      if (params.page === 1 || !params.page) {
        products.value = response.data
      } else {
        products.value.push(...response.data)
      }

      pagination.value = response.pagination
      activeFilters.value = { ...activeFilters.value, categoryId }
    } catch (err) {
      handleError(err, `obtener productos de categoría ${categoryId}`)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Obtiene productos por subcategoría
   */
  const fetchProductsBySubcategory = async (
    subcategoryId: string,
    params: Omit<ProductsQueryParams, 'subcategory_id'> = {},
  ): Promise<void> => {
    try {
      setLoading(true)
      clearError()

      const response = await productsService.getProductsBySubcategory(subcategoryId, params)

      if (params.page === 1 || !params.page) {
        products.value = response.data
      } else {
        products.value.push(...response.data)
      }

      pagination.value = response.pagination
      activeFilters.value = { ...activeFilters.value, subcategoryId }
    } catch (err) {
      handleError(err, `obtener productos de subcategoría ${subcategoryId}`)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Obtiene todas las categorías
   */
  const fetchCategories = async (): Promise<void> => {
    try {
      setLoading(true)
      clearError()

      const response = await productsService.getAllCategories()
      categories.value = response.data
    } catch (err) {
      handleError(err, 'obtener categorías')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Busca productos por término
   */
  const searchProducts = (term: string): void => {
    searchTerm.value = term
  }

  /**
   * Aplica filtros a los productos
   */
  const applyFilters = async (filters: ProductFilters): Promise<void> => {
    activeFilters.value = { ...filters }

    const params: ProductsQueryParams = {
      page: 1,
      category_id: filters.categoryId,
      subcategory_id: filters.subcategoryId,
      min_price: filters.minPrice,
      max_price: filters.maxPrice,
      search: filters.searchTerm,
      is_available: filters.isAvailable,
    }

    await fetchProducts(params)
  }

  /**
   * Limpia todos los filtros
   */
  const clearFilters = async (): Promise<void> => {
    activeFilters.value = {}
    searchTerm.value = ''
    await fetchProducts({ page: 1 })
  }

  /**
   * Carga la siguiente página de productos
   */
  const loadNextPage = async (): Promise<void> => {
    if (!pagination.value?.hasNextPage || loading.value) return

    const nextPage = pagination.value.currentPage + 1
    const params: ProductsQueryParams = {
      page: nextPage,
      ...activeFilters.value,
    }

    await fetchProducts(params)
  }

  /**
   * Selecciona un producto específico
   */
  const selectProduct = (product: Product | null): void => {
    selectedProduct.value = product
  }

  /**
   * Selecciona una categoría específica
   */
  const selectCategory = (category: Category | null): void => {
    selectedCategory.value = category
  }

  /**
   * Resetea todo el estado del store
   */
  const resetStore = (): void => {
    products.value = []
    categories.value = []
    selectedProduct.value = null
    selectedCategory.value = null
    loading.value = false
    error.value = null
    pagination.value = null
    activeFilters.value = {}
    searchTerm.value = ''
  }

  /**
   * Actualiza un producto en la lista (útil para actualizaciones optimistas)
   */
  const updateProduct = (updatedProduct: Product): void => {
    const index = products.value.findIndex((p) => p.id === updatedProduct.id)
    if (index !== -1) {
      products.value[index] = updatedProduct
    }
  }

  /**
   * Elimina un producto de la lista
   */
  const removeProduct = (productId: string): void => {
    products.value = products.value.filter((p) => p.id !== productId)
  }

  // ===== RETORNO DEL STORE =====
  return {
    // Estado
    products: readonly(products),
    categories: readonly(categories),
    selectedProduct: readonly(selectedProduct),
    selectedCategory: readonly(selectedCategory),
    loading: readonly(loading),
    error: readonly(error),
    pagination: readonly(pagination),
    activeFilters: readonly(activeFilters),
    searchTerm: readonly(searchTerm),

    // Getters
    filteredProducts,
    availableProducts,
    categoriesWithProducts,
    isLoading,
    hasError,
    currentPagination,
    totalProducts,

    // Acciones
    clearError,
    fetchProducts,
    fetchProductById,
    fetchProductsByCategory,
    fetchProductsBySubcategory,
    fetchCategories,
    searchProducts,
    applyFilters,
    clearFilters,
    loadNextPage,
    selectProduct,
    selectCategory,
    resetStore,
    updateProduct,
    removeProduct,
  }
})
