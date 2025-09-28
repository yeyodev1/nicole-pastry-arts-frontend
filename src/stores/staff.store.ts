import { ref, computed, readonly } from 'vue'
import { defineStore } from 'pinia'
import staffService from '@/services/staff'
import type {
  StaffDashboard,
  StaffOrdersQueryParams,
  OrdersByDateRangeParams,
  DeliveryScheduleParams,
  UpdateOrderStatusRequest,
  UpdatePaymentStatusRequest,
  AddInternalNotesRequest,
  StaffState,
  StaffError,
  DeliveryScheduleByZone,
} from '@/types/staff'
import type { Order } from '@/types/orders'

// Definir PaginationInfo localmente basado en la respuesta del backend
interface PaginationInfo {
  readonly currentPage: number
  readonly totalPages: number
  readonly totalCount: number
  readonly hasNextPage: boolean
  readonly hasPrevPage: boolean
}

/**
 * Store de Staff con Pinia - Gestión profesional del estado para funciones de staff
 * Utiliza Composition API y manejo de errores robusto
 */
export const useStaffStore = defineStore('staff', () => {
  // ===== ESTADO REACTIVO =====
  
  // Dashboard
  const dashboardData = ref<StaffDashboard | null>(null)
  const dashboardLoading = ref(false)
  
  // Órdenes
  const orders = ref<Order[]>([])
  const selectedOrder = ref<Order | null>(null)
  const todayOrders = ref<Order[]>([])
  const pendingOrders = ref<Order[]>([])
  const dateRangeOrders = ref<Order[]>([])
  const deliverySchedule = ref<DeliveryScheduleByZone | null>(null)
  
  // Estados de carga
  const loading = ref(false)
  const ordersLoading = ref(false)
  const todayOrdersLoading = ref(false)
  const pendingOrdersLoading = ref(false)
  const dateRangeLoading = ref(false)
  const deliveryScheduleLoading = ref(false)
  const updateOrderLoading = ref(false)
  const updatePaymentLoading = ref(false)
  
  // Estados de operaciones específicas
  const isUpdatingStatus = ref(false)
  const isUpdatingPayment = ref(false)
  const isAddingNotes = ref(false)
  
  // Errores
  const error = ref<string | null>(null)
  const dashboardError = ref<string | null>(null)
  const ordersError = ref<string | null>(null)
  const todayOrdersError = ref<string | null>(null)
  const pendingOrdersError = ref<string | null>(null)
  const deliveryScheduleError = ref<string | null>(null)
  const updateOrderError = ref<string | null>(null)
  const updatePaymentError = ref<string | null>(null)
  
  // Paginación
  const pagination = ref<PaginationInfo | null>(null)
  const dateRangePagination = ref<PaginationInfo | null>(null)
  
  // Contadores
  const todayOrdersCount = ref(0)
  const pendingOrdersCount = ref(0)
  const totalDeliveries = ref(0)
  
  // Filtros activos
  const activeFilters = ref<StaffOrdersQueryParams>({})
  const activeDateRange = ref<OrdersByDateRangeParams | null>(null)

  // ===== GETTERS COMPUTADOS =====

  /**
   * Estado de carga general
   */
  const isLoading = computed(() => 
    loading.value || 
    dashboardLoading.value || 
    ordersLoading.value || 
    todayOrdersLoading.value || 
    pendingOrdersLoading.value || 
    dateRangeLoading.value || 
    deliveryScheduleLoading.value
  )

  /**
   * Estado de procesamiento de operaciones
   */
  const isProcessing = computed(() => 
    isUpdatingStatus.value || 
    isUpdatingPayment.value || 
    isAddingNotes.value
  )

  /**
   * Órdenes filtradas por estado
   */
  const ordersByStatus = computed(() => (status: string) =>
    orders.value.filter((order) => order.status === status)
  )

  /**
   * Órdenes filtradas por estado de pago
   */
  const ordersByPaymentStatus = computed(() => (paymentStatus: string) =>
    orders.value.filter((order) => order.paymentStatus === paymentStatus)
  )

  /**
   * Órdenes filtradas por zona de entrega
   */
  const ordersByDeliveryZone = computed(() => (zone: string) =>
    orders.value.filter((order) => order.deliveryZone === zone)
  )

  /**
   * Ingresos totales
   */
  const totalRevenue = computed(() =>
    orders.value.reduce((sum, order) => sum + (order.total || 0), 0)
  )

  /**
   * Valor promedio de orden
   */
  const averageOrderValue = computed(() =>
    orders.value.length > 0 ? totalRevenue.value / orders.value.length : 0
  )

  /**
   * Errores combinados
   */
  const hasErrors = computed(() =>
    Boolean(
      error.value ||
      dashboardError.value ||
      ordersError.value ||
      todayOrdersError.value ||
      pendingOrdersError.value ||
      deliveryScheduleError.value ||
      updateOrderError.value ||
      updatePaymentError.value
    )
  )

  /**
   * Órdenes de hoy por estado
   */
  const todayOrdersByStatus = computed(() => (status: string) =>
    todayOrders.value.filter((order) => order.status === status)
  )

  /**
   * Órdenes pendientes por prioridad
   */
  const pendingOrdersByPriority = computed(() => 
    pendingOrders.value.sort((a, b) => {
      // Ordenar por fecha de entrega más cercana primero
      const dateA = new Date(a.estimatedDeliveryDate || a.deliveryDateWithMargin || a.createdAt)
      const dateB = new Date(b.estimatedDeliveryDate || b.deliveryDateWithMargin || b.createdAt)
      return dateA.getTime() - dateB.getTime()
    })
  )

  /**
   * Entregas de hoy
   */
  const todayDeliveries = computed(() => {
    if (!deliverySchedule.value) return []
    const today = new Date().toISOString().split('T')[0]
    
    // Convertir el objeto de zonas a un array plano de órdenes
    const allOrders = Object.values(deliverySchedule.value).flat()
    
    return allOrders.filter(order => {
      const deliveryDate = (order.estimatedDeliveryDate || order.deliveryDateWithMargin)?.split('T')[0]
      return deliveryDate === today
    })
  })

  /**
   * Entregas próximas (próximos 3 días)
   */
  const upcomingDeliveries = computed(() => {
    if (!deliverySchedule.value) return []
    const today = new Date()
    const threeDaysFromNow = new Date(today.getTime() + (3 * 24 * 60 * 60 * 1000))
    
    // Convertir el objeto de zonas a un array plano de órdenes
    const allOrders = Object.values(deliverySchedule.value).flat()
    
    return allOrders.filter(order => {
      const dateStr = order.estimatedDeliveryDate || order.deliveryDateWithMargin
      if (!dateStr) return false
      const deliveryDate = new Date(dateStr)
      return deliveryDate > today && deliveryDate <= threeDaysFromNow
    })
  })

  /**
   * Resumen de métricas del dashboard
   */
  const dashboardSummary = computed(() => {
    if (!dashboardData.value) return null
    
    return {
      todayOrders: dashboardData.value.todayOrders,
      todayRevenue: dashboardData.value.todayRevenue,
      pendingOrders: dashboardData.value.pendingOrders,
      processingOrders: dashboardData.value.processingOrders,
      deliveredToday: dashboardData.value.deliveredToday,
      weeklyRevenue: dashboardData.value.weeklyRevenue,
      monthlyRevenue: dashboardData.value.monthlyRevenue,
      topDeliveryZones: dashboardData.value.topDeliveryZones || [],
      recentOrders: dashboardData.value.recentOrders || [],
    }
  })

  // ===== ACCIONES =====

  /**
   * Obtiene los datos del dashboard de staff
   */
  const fetchDashboard = async (): Promise<void> => {
    try {
      dashboardLoading.value = true
      dashboardError.value = null
      
      console.log('📊 [STAFF STORE] Obteniendo dashboard...')
      
      const response = await staffService.getDashboard()
      dashboardData.value = response.dashboard
      
      console.log('✅ [STAFF STORE] Dashboard obtenido exitosamente')
    } catch (err) {
      const errorObj = err as StaffError
      console.error('❌ [STAFF STORE] Error obteniendo dashboard:', errorObj)
      dashboardError.value = errorObj.message || 'Error obteniendo dashboard'
      throw errorObj
    } finally {
      dashboardLoading.value = false
    }
  }

  /**
   * Obtener órdenes con filtros
   */
  const fetchOrders = async (params?: StaffOrdersQueryParams): Promise<void> => {
    try {
      ordersLoading.value = true
      ordersError.value = null
      
      const response = await staffService.getOrders(params)
      orders.value = [...response.orders]
      pagination.value = response.pagination
      activeFilters.value = params || {}
    } catch (err) {
      ordersError.value = handleError(err)
    } finally {
      ordersLoading.value = false
    }
  }

  /**
   * Obtener orden específica por ID
   */
  const fetchOrderById = async (orderId: string): Promise<void> => {
    try {
      ordersLoading.value = true
      ordersError.value = null
      
      const response = await staffService.getOrderDetails(orderId)
      selectedOrder.value = response.order
    } catch (err) {
      ordersError.value = handleError(err)
    } finally {
      ordersLoading.value = false
    }
  }

  /**
   * Obtiene detalles de una orden específica
   */
  const fetchOrderDetails = async (id: string): Promise<void> => {
    try {
      loading.value = true
      error.value = null
      
      console.log('🔍 [STAFF STORE] Obteniendo detalles de orden:', id)
      
      const response = await staffService.getOrderDetails(id)
      selectedOrder.value = response.order
      
      console.log('✅ [STAFF STORE] Detalles de orden obtenidos')
    } catch (err) {
      const errorObj = err as StaffError
      console.error('❌ [STAFF STORE] Error obteniendo detalles:', errorObj)
      error.value = errorObj.message || 'Error obteniendo detalles de orden'
      throw errorObj
    } finally {
      loading.value = false
    }
  }

  /**
   * Obtener órdenes de hoy
   */
  const fetchTodayOrders = async (): Promise<void> => {
    try {
      todayOrdersLoading.value = true
      todayOrdersError.value = null
      
      const response = await staffService.getTodayOrders()
      todayOrders.value = [...response.orders]
      todayOrdersCount.value = response.count || response.orders.length
    } catch (err) {
      todayOrdersError.value = handleError(err)
    } finally {
      todayOrdersLoading.value = false
    }
  }
  
  /**
   * Obtener órdenes pendientes
   */
  const fetchPendingOrders = async (): Promise<void> => {
    try {
      pendingOrdersLoading.value = true
      pendingOrdersError.value = null
      
      const response = await staffService.getPendingOrders()
      pendingOrders.value = [...response.orders]
      pendingOrdersCount.value = response.count || response.orders.length
    } catch (err) {
      pendingOrdersError.value = handleError(err)
    } finally {
      pendingOrdersLoading.value = false
    }
  }

  /**
   * Obtener órdenes por rango de fechas
   */
  const fetchOrdersByDateRange = async (params: OrdersByDateRangeParams): Promise<void> => {
    try {
      dateRangeLoading.value = true
      ordersError.value = null
      
      const response = await staffService.getOrdersByDateRange(params)
      dateRangeOrders.value = [...response.orders]
      activeDateRange.value = params
    } catch (err) {
      ordersError.value = handleError(err)
    } finally {
      dateRangeLoading.value = false
    }
  }
  
  /**
   * Obtener cronograma de entregas
   */
  const fetchDeliverySchedule = async (params?: DeliveryScheduleParams): Promise<void> => {
    try {
      deliveryScheduleLoading.value = true
      deliveryScheduleError.value = null
      
      const response = await staffService.getDeliverySchedule(params)
      deliverySchedule.value = response.schedule
      totalDeliveries.value = response.totalDeliveries || 0
    } catch (err) {
      deliveryScheduleError.value = handleError(err)
    } finally {
      deliveryScheduleLoading.value = false
    }
  }

  /**
   * Actualiza el estado de una orden
   */
  const updateOrderStatus = async (id: string, updateData: UpdateOrderStatusRequest): Promise<void> => {
    try {
      isUpdatingStatus.value = true
      updateOrderError.value = null
      
      console.log('🔄 [STAFF STORE] Actualizando estado de orden:', id, updateData.status)
      
      const response = await staffService.updateOrderStatus(id, updateData)
      
      // Actualizar la orden en los arrays correspondientes
      updateOrderInArrays(response.order)
      
      console.log('✅ [STAFF STORE] Estado actualizado exitosamente')
    } catch (err) {
      const errorObj = err as StaffError
      console.error('❌ [STAFF STORE] Error actualizando estado:', errorObj)
      updateOrderError.value = errorObj.message || 'Error actualizando estado de orden'
      throw errorObj
    } finally {
      isUpdatingStatus.value = false
    }
  }

  /**
   * Actualiza el estado de pago de una orden
   */
  const updatePaymentStatus = async (id: string, updateData: UpdatePaymentStatusRequest): Promise<void> => {
    try {
      isUpdatingPayment.value = true
      updatePaymentError.value = null
      
      console.log('💳 [STAFF STORE] Actualizando estado de pago:', id, updateData.paymentStatus)
      
      const response = await staffService.updatePaymentStatus(id, updateData)
      
      // Actualizar la orden en los arrays correspondientes
      updateOrderInArrays(response.order)
      
      console.log('✅ [STAFF STORE] Estado de pago actualizado exitosamente')
    } catch (err) {
      const errorObj = err as StaffError
      console.error('❌ [STAFF STORE] Error actualizando pago:', errorObj)
      updatePaymentError.value = errorObj.message || 'Error actualizando estado de pago'
      throw errorObj
    } finally {
      isUpdatingPayment.value = false
    }
  }

  /**
   * Agrega notas internas a una orden
   */
  const addInternalNotes = async (id: string, notesData: AddInternalNotesRequest): Promise<void> => {
    try {
      isAddingNotes.value = true
      error.value = null
      
      console.log('📝 [STAFF STORE] Agregando notas internas:', id)
      
      const response = await staffService.addInternalNotes(id, notesData)
      
      // Actualizar la orden en los arrays correspondientes
      updateOrderInArrays(response.order)
      
      console.log('✅ [STAFF STORE] Notas agregadas exitosamente')
    } catch (err) {
      const errorObj = err as StaffError
      console.error('❌ [STAFF STORE] Error agregando notas:', errorObj)
      error.value = errorObj.message || 'Error agregando notas internas'
      throw errorObj
    } finally {
      isAddingNotes.value = false
    }
  }

  // ===== MÉTODOS DE UTILIDAD =====

  /**
   * Actualiza una orden en todos los arrays correspondientes
   */
  const updateOrderInArrays = (updatedOrder: Order): void => {
    const updateArray = (array: Order[]) => {
      const index = array.findIndex(order => order._id === updatedOrder._id)
      if (index !== -1) {
        array[index] = updatedOrder
      }
    }
    
    updateArray(orders.value)
    updateArray(todayOrders.value)
    updateArray(pendingOrders.value)
    updateArray(dateRangeOrders.value)
    
    // Actualizar orden seleccionada si coincide
    if (selectedOrder.value?._id === updatedOrder._id) {
      selectedOrder.value = updatedOrder
    }
  }

  /**
   * Maneja errores de forma consistente
   */
  const handleError = (err: any): string => {
    const errorObj = err as StaffError
    return errorObj.message || 'Error desconocido'
  }

  /**
   * Limpia todos los errores
   */
  const clearAllErrors = (): void => {
    error.value = null
    dashboardError.value = null
    ordersError.value = null
    todayOrdersError.value = null
    pendingOrdersError.value = null
    deliveryScheduleError.value = null
    updateOrderError.value = null
    updatePaymentError.value = null
  }

  /**
   * Limpia la orden seleccionada
   */
  const clearSelectedOrder = (): void => {
    selectedOrder.value = null
  }

  /**
   * Limpia todos los datos del store
   */
  const clearAllData = (): void => {
    // Dashboard
    dashboardData.value = null
    
    // Órdenes
    orders.value = []
    selectedOrder.value = null
    todayOrders.value = []
    pendingOrders.value = []
    dateRangeOrders.value = []
    deliverySchedule.value = null
    
    // Contadores
    todayOrdersCount.value = 0
    pendingOrdersCount.value = 0
    totalDeliveries.value = 0
    
    // Errores
    clearAllErrors()
    
    // Paginación
    pagination.value = null
    dateRangePagination.value = null
    
    // Filtros
    activeFilters.value = {}
    activeDateRange.value = null
  }

  /**
   * Refresca los datos principales del dashboard
   */
  const refreshDashboard = async (): Promise<void> => {
    await Promise.allSettled([
      fetchDashboard(),
      fetchTodayOrders(),
      fetchPendingOrders(),
    ])
  }

  // ===== ESTADO READONLY PARA EXPOSICIÓN =====
  return {
    // Estado reactivo (readonly)
    dashboardData: readonly(dashboardData),
    orders: readonly(orders),
    selectedOrder: readonly(selectedOrder),
    todayOrders: readonly(todayOrders),
    pendingOrders: readonly(pendingOrders),
    dateRangeOrders: readonly(dateRangeOrders),
    deliverySchedule: readonly(deliverySchedule),
    
    // Estados de carga
    loading: readonly(loading),
    dashboardLoading: readonly(dashboardLoading),
    ordersLoading: readonly(ordersLoading),
    todayOrdersLoading: readonly(todayOrdersLoading),
    pendingOrdersLoading: readonly(pendingOrdersLoading),
    dateRangeLoading: readonly(dateRangeLoading),
    deliveryScheduleLoading: readonly(deliveryScheduleLoading),
    updateOrderLoading: readonly(updateOrderLoading),
    updatePaymentLoading: readonly(updatePaymentLoading),
    
    // Estados de operaciones
    isUpdatingStatus: readonly(isUpdatingStatus),
    isUpdatingPayment: readonly(isUpdatingPayment),
    isAddingNotes: readonly(isAddingNotes),
    
    // Errores
    error: readonly(error),
    dashboardError: readonly(dashboardError),
    ordersError: readonly(ordersError),
    todayOrdersError: readonly(todayOrdersError),
    pendingOrdersError: readonly(pendingOrdersError),
    deliveryScheduleError: readonly(deliveryScheduleError),
    updateOrderError: readonly(updateOrderError),
    updatePaymentError: readonly(updatePaymentError),
    
    // Paginación
    pagination: readonly(pagination),
    dateRangePagination: readonly(dateRangePagination),
    
    // Filtros activos
    activeFilters: readonly(activeFilters),
    activeDateRange: readonly(activeDateRange),
    
    // Contadores
    todayOrdersCount: readonly(todayOrdersCount),
    pendingOrdersCount: readonly(pendingOrdersCount),
    totalDeliveries: readonly(totalDeliveries),
    
    // Getters computados
    isLoading,
    isProcessing,
    ordersByStatus,
    ordersByPaymentStatus,
    ordersByDeliveryZone,
    totalRevenue,
    averageOrderValue,
    hasErrors,
    todayOrdersByStatus,
    pendingOrdersByPriority,
    todayDeliveries,
    upcomingDeliveries,
    dashboardSummary,
    
    // Acciones
    fetchDashboard,
    fetchOrders,
    fetchOrderById,
    fetchOrderDetails,
    fetchTodayOrders,
    fetchPendingOrders,
    fetchOrdersByDateRange,
    fetchDeliverySchedule,
    updateOrderStatus,
    updatePaymentStatus,
    addInternalNotes,
    
    // Métodos de utilidad
    clearAllErrors,
    clearSelectedOrder,
    clearAllData,
    refreshDashboard,
  }
})

export default useStaffStore