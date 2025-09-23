import APIBase from './httpBase'
import type {
  Product,
  Category,
  ProductsResponse,
  CategoriesResponse,
  ProductsQueryParams,
  ApiResponse,
  PaginatedResponse,
  ApiError
} from '@/types/products'
import type { AxiosResponse } from 'axios'

/**
 * ProductsService - Servicio profesional para manejo de productos
 * Utiliza httpBase para comunicación con la API y manejo de errores centralizado
 */
class ProductsService extends APIBase {
  private readonly ENDPOINTS = {
    PRODUCTS: 'business/products',
    CATEGORIES: 'business/categories',
    PRODUCT_BY_ID: (id: string) => `business/products/${id}`,
    PRODUCTS_BY_CATEGORY: (categoryId: string) => `business/products/category/${categoryId}`,
    PRODUCTS_BY_SUBCATEGORY: (subcategoryId: string) => `business/products/subcategory/${subcategoryId}`
  } as const

  /**
   * Obtiene todos los productos con paginación opcional
   * @param params - Parámetros de consulta para filtrado y paginación
   * @returns Promise con la respuesta paginada de productos
   */
  async getAllProducts(params: ProductsQueryParams = {}): Promise<PaginatedResponse<Product>> {
    try {
      const queryString = this.buildQueryString(params)
      const endpoint = queryString ? `${this.ENDPOINTS.PRODUCTS}?${queryString}` : this.ENDPOINTS.PRODUCTS
      
      const response: AxiosResponse<PaginatedResponse<Product>> = await this.get<PaginatedResponse<Product>>(endpoint)
      
      // Agregar aliases para compatibilidad con el código existente
      const productsWithAliases = response.data.data.map(product => ({
        ...product,
        id: product.web_id, // Alias para compatibilidad
        name: product.title, // Alias para compatibilidad
        stock: product.quantity, // Alias para compatibilidad
        is_available: product.active // Alias para compatibilidad
      }))
      
      return {
        ...response.data,
        data: productsWithAliases
      }
    } catch (error) {
      throw this.handleServiceError(error, 'Error al obtener productos')
    }
  }

  /**
   * Obtiene un producto específico por su ID
   * @param id - ID del producto
   * @returns Promise con el producto encontrado
   */
  async getProductById(id: string): Promise<ApiResponse<Product>> {
    try {
      this.validateId(id, 'Product ID')
      
      const response: AxiosResponse<ApiResponse<Product>> = await this.get<ApiResponse<Product>>(
        this.ENDPOINTS.PRODUCT_BY_ID(id.trim())
      )
      
      return response.data
    } catch (error) {
      throw this.handleServiceError(error, `Error al obtener producto con ID: ${id}`)
    }
  }

  /**
   * Obtiene productos filtrados por categoría
   * @param categoryId - ID de la categoría
   * @param params - Parámetros adicionales de consulta
   * @returns Promise con la respuesta paginada de productos
   */
  async getProductsByCategory(
    categoryId: string, 
    params: Omit<ProductsQueryParams, 'category_id'> = {}
  ): Promise<PaginatedResponse<Product>> {
    try {
      this.validateId(categoryId, 'Category ID')
      
      const queryString = this.buildQueryString(params)
      const endpoint = queryString 
        ? `${this.ENDPOINTS.PRODUCTS_BY_CATEGORY(categoryId.trim())}?${queryString}`
        : this.ENDPOINTS.PRODUCTS_BY_CATEGORY(categoryId.trim())
      
      const response: AxiosResponse<PaginatedResponse<Product>> = await this.get<PaginatedResponse<Product>>(endpoint)
      
      // Agregar aliases para compatibilidad con el código existente
      const productsWithAliases = response.data.data.map(product => ({
        ...product,
        id: product.web_id, // Alias para compatibilidad
        name: product.title, // Alias para compatibilidad
        stock: product.quantity, // Alias para compatibilidad
        is_available: product.active // Alias para compatibilidad
      }))
      
      return {
        ...response.data,
        data: productsWithAliases
      }
    } catch (error) {
      throw this.handleServiceError(error, `Error al obtener productos de categoría: ${categoryId}`)
    }
  }

  /**
   * Obtiene productos filtrados por subcategoría
   * @param subcategoryId - ID de la subcategoría
   * @param params - Parámetros adicionales de consulta
   * @returns Promise con la respuesta paginada de productos
   */
  async getProductsBySubcategory(
    subcategoryId: string, 
    params: Omit<ProductsQueryParams, 'subcategory_id'> = {}
  ): Promise<PaginatedResponse<Product>> {
    try {
      this.validateId(subcategoryId, 'Subcategory ID')
      
      const queryString = this.buildQueryString(params)
      const endpoint = queryString 
        ? `${this.ENDPOINTS.PRODUCTS_BY_SUBCATEGORY(subcategoryId.trim())}?${queryString}`
        : this.ENDPOINTS.PRODUCTS_BY_SUBCATEGORY(subcategoryId.trim())
      
      const response: AxiosResponse<PaginatedResponse<Product>> = await this.get<PaginatedResponse<Product>>(endpoint)
      
      // Agregar aliases para compatibilidad con el código existente
      const productsWithAliases = response.data.data.map(product => ({
        ...product,
        id: product.web_id, // Alias para compatibilidad
        name: product.title, // Alias para compatibilidad
        stock: product.quantity, // Alias para compatibilidad
        is_available: product.active // Alias para compatibilidad
      }))
      
      return {
        ...response.data,
        data: productsWithAliases
      }
    } catch (error) {
      throw this.handleServiceError(error, `Error al obtener productos de subcategoría: ${subcategoryId}`)
    }
  }

  /**
   * Obtiene todas las categorías disponibles
   * @returns Promise con la lista de categorías
   */
  async getAllCategories(): Promise<ApiResponse<Category[]>> {
    try {
      const response: AxiosResponse<ApiResponse<Category[]>> = await this.get<ApiResponse<Category[]>>(
        this.ENDPOINTS.CATEGORIES
      )
      
      // La API ya devuelve la estructura correcta { message, data }
      // Solo necesitamos agregar el alias id para compatibilidad
      const categoriesWithId = response.data.data.map(category => ({
        ...category,
        id: category.web_id, // Alias para compatibilidad
        subcategories: category.subcategories?.map(sub => ({
          ...sub,
          id: sub.web_id, // Alias para compatibilidad
          category_id: category.web_id
        }))
      }))
      
      return {
        message: response.data.message,
        data: categoriesWithId
      }
    } catch (error) {
      throw this.handleServiceError(error, 'Error al obtener categorías')
    }
  }

  /**
   * Construye query string a partir de parámetros
   * @param params - Parámetros de consulta
   * @returns String de consulta formateado
   */
  private buildQueryString(params: ProductsQueryParams): string {
    const searchParams = new URLSearchParams()
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value))
      }
    })
    
    return searchParams.toString()
  }

  /**
   * Transforma la respuesta de productos al formato esperado
   * @param data - Datos de respuesta de la API
   * @param currentPage - Página actual
   * @returns Respuesta transformada con paginación
   */
  private transformProductsResponse(
    data: ProductsResponse, 
    currentPage: number
  ): PaginatedResponse<Product> {
    return {
      message: 'Productos obtenidos exitosamente',
      data: data.products,
      pagination: {
        currentPage,
        totalPages: data.total_pages,
        hasNextPage: currentPage < data.total_pages,
        hasPrevPage: currentPage > 1,
        totalItems: data.total_items
      }
    }
  }

  /**
   * Valida que un ID no esté vacío
   * @param id - ID a validar
   * @param fieldName - Nombre del campo para el mensaje de error
   */
  private validateId(id: string, fieldName: string): void {
    if (!id || id.trim() === '') {
      throw {
        status: 400,
        message: `${fieldName} es requerido y no puede estar vacío`
      } as ApiError
    }
  }

  /**
   * Maneja errores del servicio de forma centralizada
   * @param error - Error capturado
   * @param context - Contexto del error
   * @returns Error formateado
   */
  private handleServiceError(error: unknown, context: string): ApiError {
    if (typeof error === 'object' && error !== null && 'status' in error) {
      return error as ApiError
    }
    
    return {
      status: 500,
      message: `${context}: Error interno del servidor`,
      details: error
    }
  }
}

// Exportamos una instancia singleton del servicio
export const productsService = new ProductsService()
export default productsService