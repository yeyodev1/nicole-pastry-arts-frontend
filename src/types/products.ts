// Product Types
export interface Product {
  readonly web_id: string
  readonly title: string
  readonly description?: string
  readonly price: string // La API devuelve price como string
  readonly quantity: number
  readonly active: boolean
  readonly url?: string
  readonly sku?: string
  readonly wholesale_price?: string | null
  readonly images: readonly string[] // Array readonly de URLs de imágenes
  readonly subcategory?: {
    readonly name: string
    readonly web_id: string
    readonly order: number
  } | null
  readonly category?: {
    readonly name: string
    readonly web_id: string
    readonly order: number
  } | null
  // Propiedades computadas para compatibilidad
  readonly id?: string // Alias para web_id
  readonly name?: string // Alias para title
  readonly stock?: number // Alias para quantity
  readonly is_available?: boolean // Alias para active
}

export interface ProductImage {
  id: string
  url: string
  alt_text?: string
  is_primary?: boolean
}

// Category Types
export interface Category {
  readonly web_id: string
  readonly name: string
  readonly description?: string | null
  readonly image_url?: string
  readonly products_count: number
  readonly order: number
  readonly subcategories?: readonly Subcategory[]
  readonly created_at?: string
  readonly updated_at?: string
  // Alias para compatibilidad con el código existente
  readonly id?: string
}

export interface Subcategory {
  readonly web_id: string
  readonly name: string
  readonly description?: string | null
  readonly products_count: number
  readonly order: number
  readonly image_url?: string
  readonly created_at?: string
  readonly updated_at?: string
  // Alias para compatibilidad con el código existente
  readonly id?: string
  readonly category_id?: string
}

// API Response Types
export interface ApiResponse<T> {
  message: string
  data: T
}

export interface PaginatedResponse<T> {
  message: string
  data: T[]
  pagination: PaginationInfo
}

export interface PaginationInfo {
  currentPage: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
  totalItems?: number
}

// Specific API Response Types
export interface ProductsResponse {
  products: Product[]
  total_pages: number
  current_page?: number
  total_items?: number
}

export interface CategoriesResponse {
  categories: Category[]
}

export interface ProductsByCategoryResponse extends ProductsResponse {
  category: {
    id: string
    name?: string
  }
}

export interface ProductsBySubcategoryResponse extends ProductsResponse {
  subcategory: {
    id: string
    name?: string
  }
}

// Query Parameters Types
export interface ProductsQueryParams {
  page?: number
  limit?: number
  search?: string
  category_id?: string
  subcategory_id?: string
  min_price?: number
  max_price?: number
  is_available?: boolean
}

// Error Types
export interface ApiError {
  status: number
  message: string
  details?: unknown
}

// Store State Types
export interface ProductsState {
  products: Product[]
  categories: Category[]
  selectedProduct: Product | null
  selectedCategory: Category | null
  loading: boolean
  error: string | null
  pagination: PaginationInfo | null
}

// Filter Types
export interface ProductFilters {
  categoryId?: string
  subcategoryId?: string
  minPrice?: number
  maxPrice?: number
  searchTerm?: string
  isAvailable?: boolean
}