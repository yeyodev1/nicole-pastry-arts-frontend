// Product Types
export interface Product {
  id: string
  name: string
  description?: string
  price: number
  currency?: string
  category_id?: string
  subcategory_id?: string
  images?: ProductImage[]
  stock?: number
  is_available?: boolean
  created_at?: string
  updated_at?: string
}

export interface ProductImage {
  id: string
  url: string
  alt_text?: string
  is_primary?: boolean
}

// Category Types
export interface Category {
  id: string
  name: string
  description?: string
  image_url?: string
  subcategories?: Subcategory[]
  created_at?: string
  updated_at?: string
}

export interface Subcategory {
  id: string
  name: string
  description?: string
  category_id: string
  image_url?: string
  created_at?: string
  updated_at?: string
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