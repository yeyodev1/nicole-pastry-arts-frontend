 // Order Types - Basados en el modelo del backend actualizado
export interface OrderItem {
  readonly productId: string // Mercately product web_id
  readonly productName: string
  readonly productSku: string // Campo requerido por el backend
  readonly quantity: number
  readonly unitPrice: number
  readonly totalPrice: number
  readonly productImage?: string
}

// Billing Information Interface
export interface BillingInfo {
  readonly cedula: string // Ecuador national ID (mandatory)
  readonly fullName: string
  readonly phone: string // Mandatory phone number
  readonly email?: string
  readonly address?: {
    readonly street?: string
    readonly city?: string
    readonly state?: string
    readonly zipCode?: string
    readonly country?: string
  }
}

// Delivery Zones Type
export type DeliveryZone = 'samanes_suburbio' | 'norte_sur_esteros' | 'sambo' | 'via_costa' | 'aurora'

// Delivery Address Interface
export interface DeliveryAddress {
  readonly street: string
  readonly city: string
  readonly state: string
  readonly zipCode: string
  readonly country: string
  readonly recipientName: string
  readonly recipientPhone: string
  readonly latitude?: number
  readonly longitude?: number
  readonly googleMapsLink?: string
  readonly locationNotes?: string
}

// Legacy Address Interface (for backward compatibility)
export interface Address {
  readonly recipientName: string // Campo requerido por el backend
  readonly recipientPhone: string // Campo requerido por el backend
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
  readonly orderNumber: string // Unique order identifier
  readonly customer: string // ObjectId del cliente
  readonly items: readonly OrderItem[]
  readonly subtotal: number
  readonly tax: number
  readonly taxRate: number
  readonly discount: number
  readonly discountType: 'fixed' | 'percentage'
  readonly discountCode?: string
  readonly total: number
  readonly status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  readonly paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded'
  readonly paymentMethod: 'cash' | 'card' | 'transfer' | 'mercately' | 'payphone' | 'other'
  readonly paymentReference?: string
  // Mandatory billing information
  readonly billingInfo: BillingInfo
  // Delivery information (separate from billing)
  readonly deliveryAddress: DeliveryAddress
  // Delivery zone and method
  readonly deliveryZone: DeliveryZone // Mandatory delivery zone selection
  readonly shippingMethod: 'pickup' | 'delivery' | 'shipping'
  readonly shippingCost: number
  readonly estimatedDeliveryDate?: string
  readonly actualDeliveryDate?: string
  readonly notes?: string
  readonly internalNotes?: string // Only visible to staff/admin
  // Legacy fields for backward compatibility
  readonly shippingAddress?: Address
  readonly billingAddress?: Address
  readonly mercatelyOrderId?: string
  readonly createdBy: string // ObjectId del usuario que creó la orden
  readonly updatedBy?: string // ObjectId del usuario que actualizó la orden
  readonly createdAt: string
  readonly updatedAt: string
}

// Tipos para crear una nueva orden
export interface CreateOrderRequest {
  readonly orderNumber?: string // Auto-generated if not provided
  readonly customer: string
  readonly items: readonly OrderItem[]
  readonly subtotal: number
  readonly tax?: number
  readonly taxRate?: number
  readonly discount?: number
  readonly discountType?: 'fixed' | 'percentage'
  readonly discountCode?: string
  readonly total: number
  readonly paymentMethod: 'cash' | 'card' | 'transfer' | 'mercately' | 'payphone' | 'other'
  readonly paymentReference?: string
  // Mandatory billing information
  readonly billingInfo: BillingInfo
  // Delivery information (separate from billing)
  readonly deliveryAddress: DeliveryAddress
  // Delivery zone and method
  readonly deliveryZone: DeliveryZone // Mandatory delivery zone selection
  readonly shippingMethod: 'pickup' | 'delivery' | 'shipping'
  readonly shippingCost: number
  readonly estimatedDeliveryDate?: string
  readonly notes?: string
  readonly internalNotes?: string
  readonly mercatelyOrderId?: string
  // Legacy fields for backward compatibility
  readonly shippingAddress?: Address
  readonly billingAddress?: Address
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
  readonly status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  readonly paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded'
  readonly paymentMethod?: 'cash' | 'card' | 'transfer' | 'mercately' | 'payphone' | 'other'
  readonly paymentReference?: string
  readonly billingInfo?: BillingInfo
  readonly deliveryAddress?: DeliveryAddress
  readonly deliveryZone?: DeliveryZone
  readonly shippingMethod?: 'pickup' | 'delivery' | 'shipping'
  readonly shippingCost?: number
  readonly estimatedDeliveryDate?: string
  readonly actualDeliveryDate?: string
  readonly notes?: string
  readonly internalNotes?: string
  readonly mercatelyOrderId?: string
  // Legacy fields for backward compatibility
  readonly shippingAddress?: Address
  readonly billingAddress?: Address
}

// Tipos para consultas y filtros
export interface OrdersQueryParams {
  readonly page?: number
  readonly limit?: number
  readonly customer?: string
  readonly status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  readonly paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded'
  readonly paymentMethod?: 'cash' | 'card' | 'transfer' | 'mercately' | 'payphone' | 'other'
  readonly deliveryZone?: DeliveryZone
  readonly shippingMethod?: 'pickup' | 'delivery' | 'shipping'
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