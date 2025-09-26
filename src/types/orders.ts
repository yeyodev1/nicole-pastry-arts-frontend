// Order Types - Basados en el modelo del backend
export interface OrderItem {
  readonly product: string // ObjectId del producto
  readonly productName: string
  readonly quantity: number
  readonly unitPrice: number
  readonly totalPrice: number
  readonly sku?: string
  readonly notes?: string
}

export interface Address {
  readonly street?: string
  readonly city?: string
  readonly state?: string
  readonly zipCode?: string
  readonly country?: string
  readonly latitude?: number
  readonly longitude?: number
  readonly googleMapsLink?: string
  readonly notes?: string
}

export interface Order {
  readonly _id: string
  readonly customer: string // ObjectId del cliente
  readonly items: readonly OrderItem[]
  readonly subtotal: number
  readonly tax: number
  readonly taxRate: number
  readonly discount: number
  readonly discountType: 'fixed' | 'percentage'
  readonly discountCode?: string
  readonly total: number
  readonly status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled'
  readonly paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  readonly paymentMethod: 'cash' | 'card' | 'transfer' | 'mercately' | 'payphone'
  readonly paymentReference?: string
  readonly shippingAddress?: Address
  readonly billingAddress?: Address
  readonly shippingMethod: 'pickup' | 'delivery'
  readonly shippingCost: number
  readonly estimatedDeliveryDate?: string
  readonly actualDeliveryDate?: string
  readonly notes?: string
  readonly internalNotes?: string
  readonly mercatelyOrderId?: string
  readonly createdBy: string // ObjectId del usuario que creó la orden
  readonly updatedBy?: string // ObjectId del usuario que actualizó la orden
  readonly createdAt: string
  readonly updatedAt: string
}

// Tipos para crear una nueva orden
export interface CreateOrderRequest {
  readonly customer: string
  readonly items: readonly OrderItem[]
  readonly subtotal: number
  readonly tax?: number
  readonly taxRate?: number
  readonly discount?: number
  readonly discountType?: 'fixed' | 'percentage'
  readonly discountCode?: string
  readonly total: number
  readonly paymentMethod?: 'cash' | 'card' | 'transfer' | 'mercately' | 'payphone'
  readonly paymentReference?: string
  readonly shippingAddress?: Address
  readonly billingAddress?: Address
  readonly shippingMethod?: 'pickup' | 'delivery'
  readonly shippingCost?: number
  readonly estimatedDeliveryDate?: string
  readonly notes?: string
  readonly internalNotes?: string
  readonly mercatelyOrderId?: string
}

// Tipos para actualizar una orden
export interface UpdateOrderRequest {
  readonly items?: readonly OrderItem[]
  readonly subtotal?: number
  readonly tax?: number
  readonly taxRate?: number
  readonly discount?: number
  readonly discountType?: 'fixed' | 'percentage'
  readonly discountCode?: string
  readonly total?: number
  readonly status?: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled'
  readonly paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded'
  readonly paymentMethod?: 'cash' | 'card' | 'transfer' | 'mercately' | 'payphone'
  readonly paymentReference?: string
  readonly shippingAddress?: Address
  readonly billingAddress?: Address
  readonly shippingMethod?: 'pickup' | 'delivery'
  readonly shippingCost?: number
  readonly estimatedDeliveryDate?: string
  readonly actualDeliveryDate?: string
  readonly notes?: string
  readonly internalNotes?: string
  readonly mercatelyOrderId?: string
}

// Tipos para consultas y filtros
export interface OrdersQueryParams {
  readonly page?: number
  readonly limit?: number
  readonly customer?: string
  readonly status?: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled'
  readonly paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded'
  readonly paymentMethod?: 'cash' | 'card' | 'transfer' | 'mercately' | 'payphone'
  readonly startDate?: string
  readonly endDate?: string
}

// Tipos para respuestas de la API
export interface OrderResponse {
  readonly message: string
  readonly order: Order
}

export interface OrdersResponse {
  readonly message: string
  readonly orders: readonly Order[]
  readonly pagination: {
    readonly currentPage: number
    readonly totalPages: number
    readonly totalOrders: number
    readonly hasNextPage: boolean
    readonly hasPrevPage: boolean
  }
}

export interface CustomerOrdersResponse {
  readonly message: string
  readonly orders: readonly Order[]
  readonly customer: {
    readonly _id: string
    readonly firstName: string
    readonly lastName: string
    readonly email: string
  }
  readonly pagination: {
    readonly currentPage: number
    readonly totalPages: number
    readonly totalOrders: number
    readonly hasNextPage: boolean
    readonly hasPrevPage: boolean
  }
}

// Tipos para el estado del store
export interface OrdersState {
  readonly orders: readonly Order[]
  readonly currentOrder: Order | null
  readonly loading: boolean
  readonly error: string | null
  readonly pagination: {
    readonly currentPage: number
    readonly totalPages: number
    readonly totalOrders: number
    readonly hasNextPage: boolean
    readonly hasPrevPage: boolean
  } | null
}

// Tipos para errores
export interface OrderError {
  readonly status: number
  readonly message: string
  readonly details?: unknown
}

// Tipos para integración con Payphone
export interface PayphoneOrderData {
  readonly transactionId: string
  readonly clientTransactionId: string
  readonly amount: number
  readonly currency: string
  readonly transactionStatus: 'Approved' | 'Rejected' | 'Pending'
  readonly reference?: string
  readonly message?: string
  readonly items: readonly OrderItem[]
  readonly customer: {
    readonly email?: string
    readonly phone?: string
    readonly firstName?: string
    readonly lastName?: string
  }
  readonly shippingAddress?: Address
}