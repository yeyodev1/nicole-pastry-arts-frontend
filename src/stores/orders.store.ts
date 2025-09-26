import { ref, computed, readonly } from 'vue'
import { defineStore } from 'pinia'
import ordersService from '@/services/orders'
import type {
  Order,
  CreateOrderRequest,
  UpdateOrderRequest,
  OrdersQueryParams,
  OrdersState,
  OrderError,
  PayphoneOrderData,
} from '@/types/orders'

// Definir PaginationInfo localmente basado en la respuesta del backend
interface PaginationInfo {
  readonly currentPage: number
  readonly totalPages: number
  readonly totalOrders: number
  readonly hasNextPage: boolean
  readonly hasPrevPage: boolean
}

/**
 * Store de órdenes con Pinia - Gestión profesional del estado
 * Utiliza Composition API y manejo de errores robusto
 */
export const useOrdersStore = defineStore('orders', () => {
  // ===== ESTADO REACTIVO =====
  const orders = ref<Order[]>([])
  const selectedOrder = ref<Order | null>(null)
  const customerOrders = ref<Order[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref<PaginationInfo | null>(null)
  const customerPagination = ref<PaginationInfo | null>(null)

  // Estado para filtros activos
  const activeFilters = ref<OrdersQueryParams>({})

  // Estado específico para operaciones
  const isCreating = ref(false)
  const isUpdating = ref(false)
  const isDeleting = ref(false)

  // ===== GETTERS COMPUTADOS =====

  /**
   * Órdenes filtradas por estado
   */
  const ordersByStatus = computed(() => (status: string) =>
    orders.value.filter((order) => order.status === status)
  )

  /**
   * Órdenes pendientes
   */
  const pendingOrders = computed(() =>
    orders.value.filter((order) => order.status === 'pending')
  )

  /**
   * Órdenes confirmadas
   */
  const confirmedOrders = computed(() =>
    orders.value.filter((order) => order.status === 'confirmed')
  )

  /**
   * Órdenes entregadas
   */
  const deliveredOrders = computed(() =>
    orders.value.filter((order) => order.status === 'delivered')
  )

  /**
   * Órdenes por estado de pago
   */
  const ordersByPaymentStatus = computed(() => (paymentStatus: string) =>
    orders.value.filter((order) => order.paymentStatus === paymentStatus)
  )

  /**
   * Órdenes pagadas
   */
  const paidOrders = computed(() =>
    orders.value.filter((order) => order.paymentStatus === 'paid')
  )

  /**
   * Estado de carga general
   */
  const isLoading = computed(() => loading.value)

  /**
   * Estado de carga para operaciones específicas
   */
  const isProcessing = computed(() => 
    isCreating.value || isUpdating.value || isDeleting.value
  )

  /**
   * Indica si hay error activo
   */
  const hasError = computed(() => !!error.value)

  /**
   * Información de paginación actual
   */
  const currentPagination = computed(() => pagination.value)

  /**
   * Información de paginación de órdenes del cliente
   */
  const currentCustomerPagination = computed(() => customerPagination.value)

  /**
   * Total de órdenes cargadas
   */
  const totalOrders = computed(() => orders.value.length)

  /**
   * Total de órdenes del cliente
   */
  const totalCustomerOrders = computed(() => customerOrders.value.length)

  /**
   * Estadísticas básicas de órdenes
   */
  const orderStats = computed(() => ({
    total: orders.value.length,
    pending: pendingOrders.value.length,
    confirmed: confirmedOrders.value.length,
    delivered: deliveredOrders.value.length,
    paid: paidOrders.value.length,
  }))

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
    console.error(`[OrdersStore] ${context}:`, err)

    if (typeof err === 'object' && err !== null && 'message' in err) {
      error.value = (err as OrderError).message
    } else {
      error.value = `Error en ${context}: ${String(err)}`
    }
  }

  /**
   * Obtiene todas las órdenes con parámetros opcionales
   */
  const fetchOrders = async (params: OrdersQueryParams = {}): Promise<void> => {
    try {
      setLoading(true)
      clearError()

      const response = await ordersService.getAllOrders(params)

      // Si es la primera página, reemplaza; si no, agrega (para paginación infinita)
      if (params.page === 1 || !params.page) {
        orders.value = [...response.orders]
      } else {
        orders.value.push(...response.orders)
      }

      pagination.value = response.pagination
      activeFilters.value = params
    } catch (err) {
      handleError(err, 'obtener órdenes')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Obtiene una orden específica por ID
   */
  const fetchOrderById = async (id: string): Promise<Order | null> => {
    try {
      setLoading(true)
      clearError()

      const response = await ordersService.getOrderById(id)
      selectedOrder.value = response.order

      return response.order
    } catch (err) {
      handleError(err, `obtener orden ${id}`)
      return null
    } finally {
      setLoading(false)
    }
  }

  /**
   * Obtiene órdenes de un cliente específico
   */
  const fetchOrdersByCustomer = async (
    customerId: string,
    params: Omit<OrdersQueryParams, 'customer'> = {}
  ): Promise<void> => {
    try {
      setLoading(true)
      clearError()

      const response = await ordersService.getOrdersByCustomer(customerId, params)

      if (params.page === 1 || !params.page) {
        customerOrders.value = [...response.orders]
      } else {
        customerOrders.value.push(...response.orders)
      }

      customerPagination.value = response.pagination
    } catch (err) {
      handleError(err, `obtener órdenes del cliente ${customerId}`)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Crea una nueva orden
   */
  const createOrder = async (orderData: CreateOrderRequest): Promise<Order | null> => {
    try {
      isCreating.value = true
      clearError()

      const response = await ordersService.createOrder(orderData)
      
      // Agregar la nueva orden al inicio de la lista
      orders.value.unshift(response.order)
      
      return response.order
    } catch (err) {
      handleError(err, 'crear orden')
      return null
    } finally {
      isCreating.value = false
    }
  }

  /**
   * Crea una orden desde datos de Payphone
   */
  const createOrderFromPayphone = async (payphoneData: PayphoneOrderData): Promise<Order | null> => {
    try {
      isCreating.value = true
      clearError()

      const response = await ordersService.createOrderFromPayphone(payphoneData)
      
      // Agregar la nueva orden al inicio de la lista
      orders.value.unshift(response.order)
      
      return response.order
    } catch (err) {
      handleError(err, 'crear orden desde Payphone')
      return null
    } finally {
      isCreating.value = false
    }
  }

  /**
   * Actualiza una orden existente
   */
  const updateOrder = async (
    id: string,
    updateData: UpdateOrderRequest
  ): Promise<Order | null> => {
    try {
      isUpdating.value = true
      clearError()

      const response = await ordersService.updateOrder(id, updateData)
      
      // Actualizar la orden en la lista
      const index = orders.value.findIndex(order => order._id === id)
      if (index !== -1) {
        orders.value[index] = response.order
      }
      
      // Actualizar orden seleccionada si coincide
      if (selectedOrder.value?._id === id) {
        selectedOrder.value = response.order
      }
      
      return response.order
    } catch (err) {
      handleError(err, `actualizar orden ${id}`)
      return null
    } finally {
      isUpdating.value = false
    }
  }

  /**
   * Actualiza el estado de pago de una orden
   */
  const updatePaymentStatus = async (
    id: string,
    paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded',
    paymentReference?: string
  ): Promise<Order | null> => {
    try {
      isUpdating.value = true
      clearError()

      const response = await ordersService.updatePaymentStatus(id, paymentStatus, paymentReference)
      
      // Actualizar la orden en la lista
      const index = orders.value.findIndex(order => order._id === id)
      if (index !== -1) {
        orders.value[index] = response.order
      }
      
      // Actualizar orden seleccionada si coincide
      if (selectedOrder.value?._id === id) {
        selectedOrder.value = response.order
      }
      
      return response.order
    } catch (err) {
      handleError(err, `actualizar estado de pago de orden ${id}`)
      return null
    } finally {
      isUpdating.value = false
    }
  }

  /**
   * Actualiza el estado de una orden
   */
  const updateOrderStatus = async (
    id: string,
    status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled'
  ): Promise<Order | null> => {
    try {
      isUpdating.value = true
      clearError()

      const response = await ordersService.updateOrderStatus(id, status)
      
      // Actualizar la orden en la lista
      const index = orders.value.findIndex(order => order._id === id)
      if (index !== -1) {
        orders.value[index] = response.order
      }
      
      // Actualizar orden seleccionada si coincide
      if (selectedOrder.value?._id === id) {
        selectedOrder.value = response.order
      }
      
      return response.order
    } catch (err) {
      handleError(err, `actualizar estado de orden ${id}`)
      return null
    } finally {
      isUpdating.value = false
    }
  }

  /**
   * Elimina una orden
   */
  const deleteOrder = async (id: string): Promise<boolean> => {
    try {
      isDeleting.value = true
      clearError()

      await ordersService.deleteOrder(id)
      
      // Remover la orden de la lista
      orders.value = orders.value.filter(order => order._id !== id)
      
      // Limpiar orden seleccionada si coincide
      if (selectedOrder.value?._id === id) {
        selectedOrder.value = null
      }
      
      return true
    } catch (err) {
      handleError(err, `eliminar orden ${id}`)
      return false
    } finally {
      isDeleting.value = false
    }
  }

  /**
   * Limpia el estado del store
   */
  const clearState = (): void => {
    orders.value = []
    selectedOrder.value = null
    customerOrders.value = []
    pagination.value = null
    customerPagination.value = null
    activeFilters.value = {}
    clearError()
  }

  /**
   * Establece la orden seleccionada
   */
  const setSelectedOrder = (order: Order | null): void => {
    selectedOrder.value = order
  }

  /**
   * Refresca las órdenes con los filtros actuales
   */
  const refreshOrders = async (): Promise<void> => {
    await fetchOrders(activeFilters.value)
  }

  // ===== ESTADO READONLY PARA EXPOSICIÓN =====
  return {
    // Estado reactivo (readonly)
    orders: readonly(orders),
    selectedOrder: readonly(selectedOrder),
    customerOrders: readonly(customerOrders),
    loading: readonly(loading),
    error: readonly(error),
    pagination: readonly(pagination),
    customerPagination: readonly(customerPagination),
    activeFilters: readonly(activeFilters),
    isCreating: readonly(isCreating),
    isUpdating: readonly(isUpdating),
    isDeleting: readonly(isDeleting),

    // Getters computados
    ordersByStatus,
    pendingOrders,
    confirmedOrders,
    deliveredOrders,
    ordersByPaymentStatus,
    paidOrders,
    isLoading,
    isProcessing,
    hasError,
    currentPagination,
    currentCustomerPagination,
    totalOrders,
    totalCustomerOrders,
    orderStats,

    // Acciones
    clearError,
    setLoading,
    fetchOrders,
    fetchOrderById,
    fetchOrdersByCustomer,
    createOrder,
    createOrderFromPayphone,
    updateOrder,
    updatePaymentStatus,
    updateOrderStatus,
    deleteOrder,
    clearState,
    setSelectedOrder,
    refreshOrders,
  }
})