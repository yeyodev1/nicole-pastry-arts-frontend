/**
 * Tipos TypeScript para el sistema de staff
 * Basado en las rutas y controladores del backend
 */

import type { Order } from './orders'
import type { User } from './auth'

// ============================================================================
// INTERFACES PARA DASHBOARD
// ============================================================================

/**
 * Datos del dashboard de staff
 */
export interface StaffDashboard {
  readonly todayOrders: number
  readonly todayRevenue: number
  readonly pendingOrders: number
  readonly processingOrders: number
  readonly deliveredToday: number
  readonly weeklyRevenue: number
  readonly monthlyRevenue: number
  readonly topDeliveryZones: readonly DeliveryZoneStats[]
  readonly recentOrders: readonly Order[]
}

/**
 * Estadísticas por zona de entrega
 */
export interface DeliveryZoneStats {
  readonly _id: string
  readonly count: number
  readonly revenue: number
}

/**
 * Respuesta del dashboard
 */
export interface StaffDashboardResponse {
  readonly message: string
  readonly dashboard: StaffDashboard
}

// ============================================================================
// INTERFACES PARA ÓRDENES DE STAFF
// ============================================================================

/**
 * Parámetros de consulta para órdenes de staff
 */
export interface StaffOrdersQueryParams {
  readonly page?: number
  readonly limit?: number
  readonly status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  readonly paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded'
  readonly deliveryZone?: 'samanes_suburbio' | 'norte_sur_esteros' | 'sambo' | 'via_costa' | 'aurora'
  readonly startDate?: string
  readonly endDate?: string
  readonly search?: string
}

/**
 * Respuesta de órdenes de staff
 */
export interface StaffOrdersResponse {
  readonly message: string
  readonly orders: readonly Order[]
  readonly pagination: {
    readonly currentPage: number
    readonly totalPages: number
    readonly totalCount: number
    readonly hasNextPage: boolean
    readonly hasPrevPage: boolean
  }
}

/**
 * Datos para actualizar estado de orden
 */
export interface UpdateOrderStatusRequest {
  readonly status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  readonly reason?: string
  readonly estimatedDeliveryDate?: string
  readonly actualDeliveryDate?: string
  readonly internalNotes?: string
}

/**
 * Datos para actualizar estado de pago
 */
export interface UpdatePaymentStatusRequest {
  readonly paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded'
  readonly paymentReference?: string
  readonly paymentMethod?: 'cash' | 'card' | 'transfer' | 'mercately' | 'payphone' | 'other'
  readonly notes?: string
}

/**
 * Datos para agregar notas internas
 */
export interface AddInternalNotesRequest {
  readonly internalNotes: string
  readonly append?: boolean
}

// ============================================================================
// INTERFACES PARA ÓRDENES ESPECÍFICAS
// ============================================================================

/**
 * Respuesta de órdenes de hoy
 */
export interface TodayOrdersResponse {
  readonly message: string
  readonly orders: readonly Order[]
  readonly count: number
}

/**
 * Respuesta de órdenes pendientes
 */
export interface PendingOrdersResponse {
  readonly message: string
  readonly orders: readonly Order[]
  readonly count: number
}

/**
 * Parámetros para consulta de órdenes por rango de fechas
 */
export interface OrdersByDateRangeParams {
  readonly startDate: string
  readonly endDate: string
  readonly groupBy?: 'day' | 'week' | 'month'
}

/**
 * Análisis de órdenes
 */
export interface OrderAnalytics {
  readonly _id: {
    readonly status: string
    readonly paymentStatus: string
  }
  readonly count: number
  readonly totalRevenue: number
}

/**
 * Respuesta de órdenes por rango de fechas
 */
export interface OrdersByDateRangeResponse {
  readonly message: string
  readonly orders: readonly Order[]
  readonly analytics: readonly OrderAnalytics[]
  readonly dateRange: {
    readonly startDate: string
    readonly endDate: string
  }
  readonly totalOrders: number
}

// ============================================================================
// INTERFACES PARA PROGRAMACIÓN DE ENTREGAS
// ============================================================================

/**
 * Parámetros para programación de entregas
 */
export interface DeliveryScheduleParams {
  readonly date?: string
  readonly days?: number
}

/**
 * Programación de entregas por zona
 */
export interface DeliveryScheduleByZone {
  readonly [zone: string]: readonly Order[]
}

/**
 * Respuesta de programación de entregas
 */
export interface DeliveryScheduleResponse {
  readonly message: string
  readonly schedule: DeliveryScheduleByZone
  readonly totalDeliveries: number
  readonly dateRange: {
    readonly startDate: string
    readonly endDate: string
  }
}

// ============================================================================
// INTERFACES PARA RESPUESTAS GENERALES
// ============================================================================

/**
 * Respuesta de orden individual
 */
export interface StaffOrderResponse {
  readonly message: string
  readonly order: Order
}

/**
 * Respuesta de orden con detalles completos
 */
export interface OrderDetailsResponse {
  readonly message: string
  readonly order: Order & {
    readonly customer: User
    readonly updatedBy?: User
  }
}

// ============================================================================
// ESTADO DEL STORE
// ============================================================================

/**
 * Estado del store de staff
 */
export interface StaffState {
  // Dashboard
  readonly dashboard: StaffDashboard | null
  readonly dashboardLoading: boolean
  readonly dashboardError: string | null

  // Órdenes
  readonly orders: readonly Order[]
  readonly currentOrder: Order | null
  readonly ordersLoading: boolean
  readonly ordersError: string | null
  readonly ordersPagination: {
    readonly currentPage: number
    readonly totalPages: number
    readonly totalCount: number
    readonly hasNextPage: boolean
    readonly hasPrevPage: boolean
  } | null

  // Órdenes específicas
  readonly todayOrders: readonly Order[]
  readonly pendingOrders: readonly Order[]
  readonly deliverySchedule: DeliveryScheduleByZone | null

  // Estados de carga específicos
  readonly todayOrdersLoading: boolean
  readonly pendingOrdersLoading: boolean
  readonly deliveryScheduleLoading: boolean
  readonly updateOrderLoading: boolean
  readonly updatePaymentLoading: boolean

  // Errores específicos
  readonly todayOrdersError: string | null
  readonly pendingOrdersError: string | null
  readonly deliveryScheduleError: string | null
  readonly updateOrderError: string | null
  readonly updatePaymentError: string | null
}

// ============================================================================
// TIPOS DE ERROR
// ============================================================================

/**
 * Error del servicio de staff
 */
export interface StaffError {
  readonly status: number
  readonly message: string
  readonly details?: unknown
}