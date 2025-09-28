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
  PayphoneOrderData,
  BillingInfo,
  DeliveryAddress,
  DeliveryZone,
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
    ORDERS_BY_CUSTOMER: (customerId: string) => `orders/customer/${customerId}`,
  } as const

  /**
   * Crea una nueva orden
   * @param orderData - Datos de la orden a crear
   * @returns Promise con la respuesta de la orden creada
   */
  async createOrder(orderData: CreateOrderRequest): Promise<OrderResponse> {
    try {
      console.log('🏭 [SERVICE] ===== CREANDO ORDEN EN SERVICIO =====');
      console.log('🕐 [SERVICE] Timestamp:', new Date().toISOString());
      console.log('📋 [SERVICE] Datos de orden recibidos:', {
        orderNumber: orderData.orderNumber,
        customer: orderData.customer,
        itemsCount: orderData.items?.length || 0,
        subtotal: orderData.subtotal,
        tax: orderData.tax,
        total: orderData.total,
        paymentMethod: orderData.paymentMethod,
        paymentReference: orderData.paymentReference,
        deliveryZone: orderData.deliveryZone
      });

      console.log('🔍 [SERVICE] Validando datos de orden...');
      this.validateCreateOrderData(orderData)
      console.log('✅ [SERVICE] Validación exitosa');

      console.log('📡 [SERVICE] Enviando solicitud HTTP al backend...');
      console.log('🔗 [SERVICE] Endpoint:', this.ENDPOINTS.ORDERS);

      const response: AxiosResponse<OrderResponse> = await this.post<OrderResponse>(
        this.ENDPOINTS.ORDERS,
        orderData,
      )

      console.log('📨 [SERVICE] Respuesta HTTP recibida:', {
        status: response.status,
        statusText: response.statusText,
        hasData: !!response.data
      });

      console.log('✅ [SERVICE] Orden creada exitosamente en backend:', {
        orderId: response.data.order._id,
        orderNumber: response.data.order.orderNumber,
        status: response.data.order.status,
        paymentStatus: response.data.order.paymentStatus
      });

      return response.data
    } catch (error) {
      console.error('❌ [SERVICE] Error crítico al crear orden:', {
        error: error instanceof Error ? error.message : 'Error desconocido',
        orderData: orderData
      });
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
      console.log('💳 [SERVICE] ===== CREANDO ORDEN DESDE PAYPHONE EN SERVICIO =====');
      console.log('🕐 [SERVICE] Timestamp:', new Date().toISOString());
      console.log('📋 [SERVICE] Datos de Payphone recibidos:', {
        customer: payphoneData.customer,
        itemsCount: payphoneData.items?.length || 0,
        amount: payphoneData.amount,
        transactionId: payphoneData.transactionId,
        hasShippingAddress: !!payphoneData.shippingAddress
      });

      // Generar orderNumber único
      const generateOrderNumber = (): string => {
        const timestamp = Date.now()
        const randomSuffix = Math.random().toString(36).substring(2, 11).toUpperCase()
        return `NPA-${timestamp}-${randomSuffix}`
      }

      const orderNumber = generateOrderNumber();
      console.log('🆔 [SERVICE] Order Number generado:', orderNumber);

      // Transformar datos de Payphone al formato de orden
      const orderData: CreateOrderRequest = {
        orderNumber: orderNumber,
        customer: payphoneData.customer.email || '', // Necesitarás obtener el ID del cliente
        items: payphoneData.items,
        subtotal: payphoneData.amount,
        total: payphoneData.amount,
        paymentMethod: 'payphone',
        paymentReference: payphoneData.transactionId,
        // Billing info requerido - usar datos del cliente de Payphone
        billingInfo: {
          cedula: '9999999999', // Placeholder - debe ser proporcionado por el usuario
          fullName: `${payphoneData.customer.firstName || ''} ${payphoneData.customer.lastName || ''}`.trim(),
          phone: payphoneData.customer.phone || '',
          email: payphoneData.customer.email,
        },
        // Delivery address requerido - usar shippingAddress si está disponible
        deliveryAddress: {
          street: payphoneData.shippingAddress?.street || '',
          city: payphoneData.shippingAddress?.city || 'Guayaquil',
          state: payphoneData.shippingAddress?.state || 'Guayas',
          zipCode: payphoneData.shippingAddress?.zipCode || '090101',
          country: payphoneData.shippingAddress?.country || 'Ecuador',
          recipientName: payphoneData.shippingAddress?.recipientName || `${payphoneData.customer.firstName || ''} ${payphoneData.customer.lastName || ''}`.trim(),
          recipientPhone: payphoneData.shippingAddress?.recipientPhone || payphoneData.customer.phone || '',
          googleMapsLink: payphoneData.shippingAddress?.googleMapsLink,
          locationNotes: payphoneData.shippingAddress?.notes,
        },
        // Delivery zone por defecto
        deliveryZone: 'samanes_suburbio', // Zona por defecto - debe ser seleccionada por el usuario
        shippingMethod: 'delivery',
        shippingCost: 6.00, // Costo por defecto para samanes_suburbio
        notes: `Pago procesado con Payphone. Transaction ID: ${payphoneData.transactionId}`,
        // Legacy fields para compatibilidad
        shippingAddress: payphoneData.shippingAddress,
      }

      console.log('🔄 [SERVICE] Datos transformados para orden:', {
        orderNumber: orderData.orderNumber,
        customer: orderData.customer,
        itemsCount: orderData.items?.length || 0,
        subtotal: orderData.subtotal,
        total: orderData.total,
        paymentMethod: orderData.paymentMethod,
        paymentReference: orderData.paymentReference,
        deliveryZone: orderData.deliveryZone
      });

      console.log('📞 [SERVICE] Llamando a createOrder...');
      return await this.createOrder(orderData)
    } catch (error) {
      console.error('❌ [SERVICE] Error crítico al crear orden desde Payphone:', {
        error: error instanceof Error ? error.message : 'Error desconocido',
        payphoneData: payphoneData
      });
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
      const endpoint = queryString
        ? `${this.ENDPOINTS.ORDERS}?${queryString}`
        : this.ENDPOINTS.ORDERS

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
        this.ENDPOINTS.ORDER_BY_ID(id),
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
        updateData,
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
        this.ENDPOINTS.ORDER_BY_ID(id),
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
    params: Omit<OrdersQueryParams, 'customer'> = {},
  ): Promise<CustomerOrdersResponse> {
    try {
      this.validateId(customerId, 'ID de cliente')

      const queryString = this.buildQueryString(params)
      const endpoint = queryString
        ? `${this.ENDPOINTS.ORDERS_BY_CUSTOMER(customerId)}?${queryString}`
        : this.ENDPOINTS.ORDERS_BY_CUSTOMER(customerId)

      const response: AxiosResponse<CustomerOrdersResponse> =
        await this.get<CustomerOrdersResponse>(endpoint)

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
    paymentReference?: string,
  ): Promise<OrderResponse> {
    try {
      const updateData: UpdateOrderRequest = {
        paymentStatus,
        ...(paymentReference && { paymentReference }),
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
    status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded',
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

    // Validar billingInfo obligatorio
    if (!orderData.billingInfo) {
      throw new Error('La información de facturación es requerida')
    }
    if (!orderData.billingInfo.cedula) {
      throw new Error('La cédula es requerida en la información de facturación')
    }
    if (!orderData.billingInfo.fullName) {
      throw new Error('El nombre completo es requerido en la información de facturación')
    }
    if (!orderData.billingInfo.phone) {
      throw new Error('El teléfono es requerido en la información de facturación')
    }

    // Validar deliveryAddress obligatorio
    if (!orderData.deliveryAddress) {
      throw new Error('La dirección de entrega es requerida')
    }
    if (!orderData.deliveryAddress.street) {
      throw new Error('La calle es requerida en la dirección de entrega')
    }
    if (!orderData.deliveryAddress.recipientName) {
      throw new Error('El nombre del destinatario es requerido')
    }
    if (!orderData.deliveryAddress.recipientPhone) {
      throw new Error('El teléfono del destinatario es requerido')
    }

    // Validar deliveryZone obligatorio
    if (!orderData.deliveryZone) {
      throw new Error('La zona de entrega es requerida')
    }

    // Validar que cada item tenga los campos requeridos
    orderData.items.forEach((item, index) => {
      if (!item.productId) {
        throw new Error(`El ID del producto es requerido para el item ${index + 1}`)
      }
      if (!item.productName) {
        throw new Error(`El nombre del producto es requerido para el item ${index + 1}`)
      }
      if (!item.productSku) {
        throw new Error(`El SKU del producto es requerido para el item ${index + 1}`)
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
        details: axiosError.response?.data,
      }
    }

    return {
      status: 500,
      message: error instanceof Error ? error.message : `Error desconocido al ${context}`,
      details: error,
    }
  }
}

// Exportar instancia singleton del servicio
export const ordersService = new OrdersService()
export default ordersService
