import APIBase from './httpBase'
import type {
  StaffDashboardResponse,
  StaffOrdersQueryParams,
  StaffOrdersResponse,
  StaffOrderResponse,
  OrderDetailsResponse,
  TodayOrdersResponse,
  PendingOrdersResponse,
  OrdersByDateRangeParams,
  OrdersByDateRangeResponse,
  DeliveryScheduleParams,
  DeliveryScheduleResponse,
  UpdateOrderStatusRequest,
  UpdatePaymentStatusRequest,
  AddInternalNotesRequest,
  StaffError,
} from '@/types/staff'
import type { AxiosResponse } from 'axios'

/**
 * StaffService - Servicio profesional para manejo de funciones de staff
 * Utiliza httpBase para comunicación con la API y manejo de errores centralizado
 */
class StaffService extends APIBase {
  private readonly ENDPOINTS = {
    // Dashboard
    DASHBOARD: 'staff/dashboard',
    
    // Órdenes generales
    ORDERS: 'staff/orders',
    ORDER_BY_ID: (id: string) => `staff/orders/${id}`,
    
    // Órdenes específicas
    TODAY_ORDERS: 'staff/orders/today',
    PENDING_ORDERS: 'staff/orders/pending',
    DATE_RANGE_ORDERS: 'staff/orders/date-range',
    DELIVERY_SCHEDULE: 'staff/orders/delivery-schedule',
    
    // Actualizaciones de órdenes
    UPDATE_ORDER_STATUS: (id: string) => `staff/orders/${id}/status`,
    UPDATE_PAYMENT_STATUS: (id: string) => `staff/orders/${id}/payment-status`,
    ADD_INTERNAL_NOTES: (id: string) => `staff/orders/${id}/notes`,
  } as const

  // ============================================================================
  // MÉTODOS DE DASHBOARD
  // ============================================================================

  /**
   * Obtiene los datos del dashboard de staff con métricas y resumen de ventas
   */
  async getDashboard(): Promise<StaffDashboardResponse> {
    try {
      console.log('📊 [STAFF SERVICE] Obteniendo dashboard de staff...')
      
      const response = await this.get<StaffDashboardResponse>(this.ENDPOINTS.DASHBOARD)
      
      if (!response.data) {
        throw this.createStaffError(500, 'No se recibió respuesta del servidor')
      }

      console.log('✅ [STAFF SERVICE] Dashboard obtenido exitosamente')
      return response.data
    } catch (error) {
      console.error('❌ [STAFF SERVICE] Error obteniendo dashboard:', error)
      throw this.handleStaffError(error, 'getDashboard')
    }
  }

  // ============================================================================
  // MÉTODOS DE ÓRDENES GENERALES
  // ============================================================================

  /**
   * Obtiene órdenes con filtros específicos de staff
   */
  async getOrders(params: StaffOrdersQueryParams = {}): Promise<StaffOrdersResponse> {
    try {
      console.log('📋 [STAFF SERVICE] Obteniendo órdenes con filtros:', params)
      
      const queryString = this.buildQueryString(params)
      const endpoint = queryString ? `${this.ENDPOINTS.ORDERS}?${queryString}` : this.ENDPOINTS.ORDERS
      
      const response = await this.get<StaffOrdersResponse>(endpoint)
      
      if (!response.data) {
        throw this.createStaffError(500, 'No se recibió respuesta del servidor')
      }

      console.log('✅ [STAFF SERVICE] Órdenes obtenidas exitosamente:', response.data.orders.length)
      return response.data
    } catch (error) {
      console.error('❌ [STAFF SERVICE] Error obteniendo órdenes:', error)
      throw this.handleStaffError(error, 'getOrders')
    }
  }

  /**
   * Obtiene detalles completos de una orden específica
   */
  async getOrderDetails(id: string): Promise<OrderDetailsResponse> {
    try {
      this.validateId(id, 'Order ID')
      
      console.log('🔍 [STAFF SERVICE] Obteniendo detalles de orden:', id)
      
      const response = await this.get<OrderDetailsResponse>(this.ENDPOINTS.ORDER_BY_ID(id))
      
      if (!response.data) {
        throw this.createStaffError(500, 'No se recibió respuesta del servidor')
      }

      console.log('✅ [STAFF SERVICE] Detalles de orden obtenidos exitosamente')
      return response.data
    } catch (error) {
      console.error('❌ [STAFF SERVICE] Error obteniendo detalles de orden:', error)
      throw this.handleStaffError(error, 'getOrderDetails')
    }
  }

  // ============================================================================
  // MÉTODOS DE ÓRDENES ESPECÍFICAS
  // ============================================================================

  /**
   * Obtiene las órdenes de hoy para vista rápida de staff
   */
  async getTodayOrders(): Promise<TodayOrdersResponse> {
    try {
      console.log('📅 [STAFF SERVICE] Obteniendo órdenes de hoy...')
      
      const response = await this.get<TodayOrdersResponse>(this.ENDPOINTS.TODAY_ORDERS)
      
      if (!response.data) {
        throw this.createStaffError(500, 'No se recibió respuesta del servidor')
      }

      console.log('✅ [STAFF SERVICE] Órdenes de hoy obtenidas:', response.data.count)
      return response.data
    } catch (error) {
      console.error('❌ [STAFF SERVICE] Error obteniendo órdenes de hoy:', error)
      throw this.handleStaffError(error, 'getTodayOrders')
    }
  }

  /**
   * Obtiene todas las órdenes pendientes que necesitan atención
   */
  async getPendingOrders(): Promise<PendingOrdersResponse> {
    try {
      console.log('⏳ [STAFF SERVICE] Obteniendo órdenes pendientes...')
      
      const response = await this.get<PendingOrdersResponse>(this.ENDPOINTS.PENDING_ORDERS)
      
      if (!response.data) {
        throw this.createStaffError(500, 'No se recibió respuesta del servidor')
      }

      console.log('✅ [STAFF SERVICE] Órdenes pendientes obtenidas:', response.data.count)
      return response.data
    } catch (error) {
      console.error('❌ [STAFF SERVICE] Error obteniendo órdenes pendientes:', error)
      throw this.handleStaffError(error, 'getPendingOrders')
    }
  }

  /**
   * Obtiene órdenes dentro de un rango de fechas específico con análisis
   */
  async getOrdersByDateRange(params: OrdersByDateRangeParams): Promise<OrdersByDateRangeResponse> {
    try {
      if (!params.startDate || !params.endDate) {
        throw this.createStaffError(400, 'Fecha de inicio y fin son requeridas')
      }

      console.log('📊 [STAFF SERVICE] Obteniendo órdenes por rango de fechas:', params)
      
      const queryString = this.buildQueryString(params)
      const endpoint = `${this.ENDPOINTS.DATE_RANGE_ORDERS}?${queryString}`
      
      const response = await this.get<OrdersByDateRangeResponse>(endpoint)
      
      if (!response.data) {
        throw this.createStaffError(500, 'No se recibió respuesta del servidor')
      }

      console.log('✅ [STAFF SERVICE] Órdenes por rango de fechas obtenidas:', response.data.totalOrders)
      return response.data
    } catch (error) {
      console.error('❌ [STAFF SERVICE] Error obteniendo órdenes por rango de fechas:', error)
      throw this.handleStaffError(error, 'getOrdersByDateRange')
    }
  }

  /**
   * Obtiene la programación de entregas para hoy y próximos días
   */
  async getDeliverySchedule(params: DeliveryScheduleParams = {}): Promise<DeliveryScheduleResponse> {
    try {
      console.log('🚚 [STAFF SERVICE] Obteniendo programación de entregas:', params)
      
      const queryString = this.buildQueryString(params)
      const endpoint = queryString ? `${this.ENDPOINTS.DELIVERY_SCHEDULE}?${queryString}` : this.ENDPOINTS.DELIVERY_SCHEDULE
      
      const response = await this.get<DeliveryScheduleResponse>(endpoint)
      
      if (!response.data) {
        throw this.createStaffError(500, 'No se recibió respuesta del servidor')
      }

      console.log('✅ [STAFF SERVICE] Programación de entregas obtenida:', response.data.totalDeliveries)
      return response.data
    } catch (error) {
      console.error('❌ [STAFF SERVICE] Error obteniendo programación de entregas:', error)
      throw this.handleStaffError(error, 'getDeliverySchedule')
    }
  }

  // ============================================================================
  // MÉTODOS DE ACTUALIZACIÓN DE ÓRDENES
  // ============================================================================

  /**
   * Actualiza el estado de una orden con validaciones específicas de staff
   */
  async updateOrderStatus(id: string, updateData: UpdateOrderStatusRequest): Promise<StaffOrderResponse> {
    try {
      this.validateId(id, 'Order ID')
      this.validateUpdateOrderStatusData(updateData)
      
      console.log('🔄 [STAFF SERVICE] Actualizando estado de orden:', id, updateData.status)
      
      const response = await this.patch<StaffOrderResponse>(
        this.ENDPOINTS.UPDATE_ORDER_STATUS(id),
        updateData
      )
      
      if (!response.data) {
        throw this.createStaffError(500, 'No se recibió respuesta del servidor')
      }

      console.log('✅ [STAFF SERVICE] Estado de orden actualizado exitosamente')
      return response.data
    } catch (error) {
      console.error('❌ [STAFF SERVICE] Error actualizando estado de orden:', error)
      throw this.handleStaffError(error, 'updateOrderStatus')
    }
  }

  /**
   * Actualiza el estado de pago de una orden
   */
  async updatePaymentStatus(id: string, updateData: UpdatePaymentStatusRequest): Promise<StaffOrderResponse> {
    try {
      this.validateId(id, 'Order ID')
      this.validateUpdatePaymentStatusData(updateData)
      
      console.log('💳 [STAFF SERVICE] Actualizando estado de pago:', id, updateData.paymentStatus)
      
      const response = await this.patch<StaffOrderResponse>(
        this.ENDPOINTS.UPDATE_PAYMENT_STATUS(id),
        updateData
      )
      
      if (!response.data) {
        throw this.createStaffError(500, 'No se recibió respuesta del servidor')
      }

      console.log('✅ [STAFF SERVICE] Estado de pago actualizado exitosamente')
      return response.data
    } catch (error) {
      console.error('❌ [STAFF SERVICE] Error actualizando estado de pago:', error)
      throw this.handleStaffError(error, 'updatePaymentStatus')
    }
  }

  /**
   * Agrega o actualiza notas internas de una orden
   */
  async addInternalNotes(id: string, notesData: AddInternalNotesRequest): Promise<StaffOrderResponse> {
    try {
      this.validateId(id, 'Order ID')
      
      if (!notesData.internalNotes?.trim()) {
        throw this.createStaffError(400, 'Las notas internas son requeridas')
      }
      
      console.log('📝 [STAFF SERVICE] Agregando notas internas a orden:', id)
      
      const response = await this.patch<StaffOrderResponse>(
        this.ENDPOINTS.ADD_INTERNAL_NOTES(id),
        notesData
      )
      
      if (!response.data) {
        throw this.createStaffError(500, 'No se recibió respuesta del servidor')
      }

      console.log('✅ [STAFF SERVICE] Notas internas agregadas exitosamente')
      return response.data
    } catch (error) {
      console.error('❌ [STAFF SERVICE] Error agregando notas internas:', error)
      throw this.handleStaffError(error, 'addInternalNotes')
    }
  }

  // ============================================================================
  // MÉTODOS PRIVADOS DE UTILIDAD
  // ============================================================================

  /**
   * Construye query string para parámetros de consulta
   */
  private buildQueryString(params: Record<string, any>): string {
    const searchParams = new URLSearchParams()
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value))
      }
    })
    
    return searchParams.toString()
  }

  /**
   * Valida ID de orden
   */
  private validateId(id: string, fieldName: string): void {
    if (!id || typeof id !== 'string' || id.trim().length === 0) {
      throw this.createStaffError(400, `${fieldName} es requerido y debe ser una cadena válida`)
    }
  }

  /**
   * Valida datos de actualización de estado de orden
   */
  private validateUpdateOrderStatusData(data: UpdateOrderStatusRequest): void {
    if (!data.status) {
      throw this.createStaffError(400, 'El estado es requerido')
    }

    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']
    if (!validStatuses.includes(data.status)) {
      throw this.createStaffError(400, 'Estado de orden inválido')
    }

    if ((data.status === 'cancelled' || data.status === 'refunded') && !data.reason) {
      throw this.createStaffError(400, 'La razón es requerida para cancelación o reembolso')
    }
  }

  /**
   * Valida datos de actualización de estado de pago
   */
  private validateUpdatePaymentStatusData(data: UpdatePaymentStatusRequest): void {
    if (!data.paymentStatus) {
      throw this.createStaffError(400, 'El estado de pago es requerido')
    }

    const validPaymentStatuses = ['pending', 'paid', 'failed', 'refunded', 'partially_refunded']
    if (!validPaymentStatuses.includes(data.paymentStatus)) {
      throw this.createStaffError(400, 'Estado de pago inválido')
    }
  }

  /**
   * Maneja errores del servicio de staff
   */
  private handleStaffError(error: unknown, context: string): StaffError {
    console.error(`❌ [STAFF SERVICE] Error en ${context}:`, error)

    if (error && typeof error === 'object' && 'status' in error) {
      return error as StaffError
    }

    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as any
      return this.createStaffError(
        axiosError.response?.status || 500,
        axiosError.response?.data?.message || axiosError.message || 'Error desconocido del servidor'
      )
    }

    return this.createStaffError(500, 'Error interno del servicio de staff')
  }

  /**
   * Crea un error de staff estructurado
   */
  private createStaffError(status: number, message: string, details?: unknown): StaffError {
    return {
      status,
      message,
      details,
    }
  }
}

// Exportar instancia singleton del servicio
export const staffService = new StaffService()
export default staffService