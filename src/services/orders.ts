import APIBase from './httpBase'
import type {
  Order,
  CreateOrderRequest,
  UpdateOrderRequest,
  OrdersQueryParams,
  OrderResponse,
  OrdersResponse,
  CustomerOrdersResponse,
  OrderError,
  PayphoneOrderData
} from '@/types/orders'
import type { AxiosResponse } from 'axios'

/**
 * OrdersService - Servicio profesional para manejo de órdenes
 * Utiliza httpBase para comunicación con la API y manejo de errores centralizado
 */
class OrdersService extends APIBase {
  private readonly ENDPOINTS = {
    ORDERS: 'orders',
    ORDER_BY_ID: (id: string) => `orders/${id}`,
    ORDERS_BY_CUSTOMER: (customerId: string) => `orders/customer/${customerId}`
  } as const

  /**
   * Crea una nueva orden
   * @param orderData - Datos de la orden a crear
   * @returns Promise con la respuesta de la orden creada
   */
  async createOrder(orderData: CreateOrderRequest): Promise<OrderResponse> {
    try {
      this.validateCreateOrderData(orderData)
      
      const response: AxiosResponse<OrderResponse> = await this.post<OrderResponse>(
        this.ENDPOINTS.ORDERS,
        orderData
      )
      
      return response.data
    } catch (error) {
      throw this.handleServiceError(error, 'crear orden')
    }
  }

  /**
   * Crea una orden desde datos de Payphone
   * @param payphoneData - Datos de la transacción de Payphone
   * @returns Promise con la respuesta de la orden creada
   */
  async createOrderFromPayphone(payphoneData: PayphoneOrderData): Promise<OrderResponse> {
    try {
      // Transformar datos de Payphone al formato de orden
      const orderData: CreateOrderRequest = {
        customer: payphoneData.customer.email || '', // Necesitarás obtener el ID del cliente
        items: payphoneData.items,
        subtotal: payphoneData.amount,
        total: payphoneData.amount,
        paymentMethod: 'payphone',
        paymentReference: payphoneData.transactionId,
        shippingAddress: payphoneData.shippingAddress,
        notes: `Pago procesado con Payphone. Transaction ID: ${payphoneData.transactionId}`
      }

      return await this.createOrder(orderData)
    } catch (error) {
      throw this.handleServiceError(error, 'crear orden desde Payphone')
    }
  }

  /**
   * Obtiene todas las órdenes con paginación y filtros
   * @param params - Parámetros de consulta para filtrado y paginación
   * @returns Promise con la respuesta paginada de órdenes
   */
  async getAllOrders(params: OrdersQueryParams = {}): Promise<OrdersResponse> {
    try {
      const queryString = this.buildQueryString(params)
      const endpoint = queryString ? `${this.ENDPOINTS.ORDERS}?${queryString}` : this.ENDPOINTS.ORDERS
      
      const response: AxiosResponse<OrdersResponse> = await this.get<OrdersResponse>(endpoint)
      
      return response.data
    } catch (error) {
      throw this.handleServiceError(error, 'obtener órdenes')
    }
  }

  /**
   * Obtiene una orden por su ID
   * @param id - ID de la orden
   * @returns Promise con la respuesta de la orden
   */
  async getOrderById(id: string): Promise<OrderResponse> {
    try {
      this.validateId(id, 'ID de orden')
      
      const response: AxiosResponse<OrderResponse> = await this.get<OrderResponse>(
        this.ENDPOINTS.ORDER_BY_ID(id)
      )
      
      return response.data
    } catch (error) {
      throw this.handleServiceError(error, `obtener orden con ID: ${id}`)
    }
  }

  /**
   * Actualiza una orden existente
   * @param id - ID de la orden a actualizar
   * @param updateData - Datos a actualizar
   * @returns Promise con la respuesta de la orden actualizada
   */
  async updateOrder(id: string, updateData: UpdateOrderRequest): Promise<OrderResponse> {
    try {
      this.validateId(id, 'ID de orden')
      
      const response: AxiosResponse<OrderResponse> = await this.put<OrderResponse>(
        this.ENDPOINTS.ORDER_BY_ID(id),
        updateData
      )
      
      return response.data
    } catch (error) {
      throw this.handleServiceError(error, `actualizar orden con ID: ${id}`)
    }
  }

  /**
   * Elimina una orden
   * @param id - ID de la orden a eliminar
   * @returns Promise con la respuesta de confirmación
   */
  async deleteOrder(id: string): Promise<{ message: string }> {
    try {
      this.validateId(id, 'ID de orden')
      
      const response: AxiosResponse<{ message: string }> = await this.delete<{ message: string }>(
        this.ENDPOINTS.ORDER_BY_ID(id)
      )
      
      return response.data
    } catch (error) {
      throw this.handleServiceError(error, `eliminar orden con ID: ${id}`)
    }
  }

  /**
   * Obtiene todas las órdenes de un cliente específico
   * @param customerId - ID del cliente
   * @param params - Parámetros de consulta para paginación
   * @returns Promise con la respuesta de órdenes del cliente
   */
  async getOrdersByCustomer(
    customerId: string, 
    params: Omit<OrdersQueryParams, 'customer'> = {}
  ): Promise<CustomerOrdersResponse> {
    try {
      this.validateId(customerId, 'ID de cliente')
      
      const queryString = this.buildQueryString(params)
      const endpoint = queryString 
        ? `${this.ENDPOINTS.ORDERS_BY_CUSTOMER(customerId)}?${queryString}` 
        : this.ENDPOINTS.ORDERS_BY_CUSTOMER(customerId)
      
      const response: AxiosResponse<CustomerOrdersResponse> = await this.get<CustomerOrdersResponse>(endpoint)
      
      return response.data
    } catch (error) {
      throw this.handleServiceError(error, `obtener órdenes del cliente con ID: ${customerId}`)
    }
  }

  /**
   * Actualiza el estado de pago de una orden
   * @param id - ID de la orden
   * @param paymentStatus - Nuevo estado de pago
   * @param paymentReference - Referencia del pago (opcional)
   * @returns Promise con la respuesta de la orden actualizada
   */
  async updatePaymentStatus(
    id: string, 
    paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded',
    paymentReference?: string
  ): Promise<OrderResponse> {
    try {
      const updateData: UpdateOrderRequest = {
        paymentStatus,
        ...(paymentReference && { paymentReference })
      }
      
      return await this.updateOrder(id, updateData)
    } catch (error) {
      throw this.handleServiceError(error, `actualizar estado de pago de la orden con ID: ${id}`)
    }
  }

  /**
   * Actualiza el estado de una orden
   * @param id - ID de la orden
   * @param status - Nuevo estado de la orden
   * @returns Promise con la respuesta de la orden actualizada
   */
  async updateOrderStatus(
    id: string, 
    status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled'
  ): Promise<OrderResponse> {
    try {
      const updateData: UpdateOrderRequest = { status }
      
      return await this.updateOrder(id, updateData)
    } catch (error) {
      throw this.handleServiceError(error, `actualizar estado de la orden con ID: ${id}`)
    }
  }

  // Métodos privados de utilidad

  /**
   * Construye la cadena de consulta para los parámetros
   * @param params - Parámetros de consulta
   * @returns Cadena de consulta formateada
   */
  private buildQueryString(params: OrdersQueryParams): string {
    const searchParams = new URLSearchParams()
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value))
      }
    })
    
    return searchParams.toString()
  }

  /**
   * Valida los datos para crear una orden
   * @param orderData - Datos de la orden a validar
   */
  private validateCreateOrderData(orderData: CreateOrderRequest): void {
    if (!orderData.customer) {
      throw new Error('El ID del cliente es requerido')
    }
    
    if (!orderData.items || orderData.items.length === 0) {
      throw new Error('Los items de la orden son requeridos')
    }
    
    if (orderData.total <= 0) {
      throw new Error('El total de la orden debe ser mayor a 0')
    }
    
    // Validar que cada item tenga los campos requeridos
    orderData.items.forEach((item, index) => {
      if (!item.product) {
        throw new Error(`El producto es requerido para el item ${index + 1}`)
      }
      if (!item.productName) {
        throw new Error(`El nombre del producto es requerido para el item ${index + 1}`)
      }
      if (item.quantity <= 0) {
        throw new Error(`La cantidad debe ser mayor a 0 para el item ${index + 1}`)
      }
      if (item.unitPrice <= 0) {
        throw new Error(`El precio unitario debe ser mayor a 0 para el item ${index + 1}`)
      }
    })
  }

  /**
   * Valida que un ID sea válido
   * @param id - ID a validar
   * @param fieldName - Nombre del campo para el mensaje de error
   */
  private validateId(id: string, fieldName: string): void {
    if (!id || typeof id !== 'string' || id.trim().length === 0) {
      throw new Error(`${fieldName} es requerido y debe ser una cadena válida`)
    }
  }

  /**
   * Maneja errores del servicio de manera consistente
   * @param error - Error capturado
   * @param context - Contexto de la operación
   * @returns Error formateado
   */
  private handleServiceError(error: unknown, context: string): OrderError {
    console.error(`Error en OrdersService al ${context}:`, error)
    
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as any
      return {
        status: axiosError.response?.status || 500,
        message: axiosError.response?.data?.message || `Error al ${context}`,
        details: axiosError.response?.data
      }
    }
    
    return {
      status: 500,
      message: error instanceof Error ? error.message : `Error desconocido al ${context}`,
      details: error
    }
  }
}

// Exportar instancia singleton del servicio
export const ordersService = new OrdersService()
export default ordersService