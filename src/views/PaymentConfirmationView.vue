<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePayphonePayment } from '@/composables/usePayphonePayment';
import { useOrdersStore } from '@/stores/orders.store';
import { useAuth } from '@/composables/useAuth';
import PayphoneService from '@/services/payphone';
import type { CreateOrderRequest } from '@/types/orders';

const route = useRoute();
const router = useRouter();

// Estados del componente
const isProcessing = ref(true);
const paymentStatus = ref<'success' | 'error' | 'cancelled' | 'processing'>('processing');
const paymentDetails = ref<any>(null);
const errorMessage = ref<string>('');
const orderCreated = ref(false);
const createdOrderId = ref<string | null>(null);

// Stores y composables
const { confirmPayment, processPayphoneResponse } = usePayphonePayment();
const ordersStore = useOrdersStore();
const { user, isAuthenticated } = useAuth();

// Estados computados
const statusIcon = computed(() => {
  switch (paymentStatus.value) {
    case 'success':
      return '✅';
    case 'error':
      return '❌';
    case 'cancelled':
      return '⚠️';
    default:
      return '⏳';
  }
});

const statusTitle = computed(() => {
  switch (paymentStatus.value) {
    case 'success':
      return '¡Pago Exitoso!';
    case 'error':
      return 'Error en el Pago';
    case 'cancelled':
      return 'Pago Cancelado';
    default:
      return 'Procesando Pago...';
  }
});

const statusMessage = computed(() => {
  switch (paymentStatus.value) {
    case 'success':
      if (ordersStore.isLoading) {
        return 'Tu pago ha sido procesado exitosamente. Estamos creando tu orden...';
      } else if (orderCreated.value) {
        return 'Tu pago ha sido procesado exitosamente y tu orden ha sido creada. Recibirás un correo de confirmación en breve.';
      } else if (ordersStore.hasError) {
        return 'Tu pago fue exitoso, pero hubo un problema al crear la orden. Nuestro equipo revisará tu pago.';
      }
      return 'Tu pago ha sido procesado exitosamente. Recibirás un correo de confirmación en breve.';
    case 'error':
      return errorMessage.value || 'Hubo un problema al procesar tu pago. Por favor, intenta nuevamente.';
    case 'cancelled':
      return 'El pago fue cancelado. Puedes intentar nuevamente cuando gustes.';
    default:
      return 'Estamos verificando tu pago con Payphone. Por favor espera...';
  }
});

const statusColor = computed(() => {
  switch (paymentStatus.value) {
    case 'success':
      return 'success';
    case 'error':
      return 'error';
    case 'cancelled':
      return 'warning';
    default:
      return 'info';
  }
});

const showOrderInfo = computed(() => {
  return paymentStatus.value === 'success' && orderCreated.value && createdOrderId.value;
});

const isCreatingOrder = computed(() => {
  return paymentStatus.value === 'success' && ordersStore.isLoading && !orderCreated.value;
});

// Métodos

/**
 * Transforma los items del carrito al formato requerido por el backend
 */
const transformCartItems = (cartItems: any[]): any[] => {
  return cartItems.map(item => ({
    product: item.product || item.id || '507f1f77bcf86cd799439011', // Usar product, id o un ObjectId por defecto
    productName: item.productName || item.name || 'Producto sin nombre',
    quantity: item.quantity || 1,
    unitPrice: item.unitPrice || item.price || 0,
    totalPrice: item.totalPrice || (item.price * item.quantity) || 0,
    sku: item.sku || `SKU-${item.id || 'UNKNOWN'}`,
    notes: item.notes || ''
  }));
};

/**
 * Obtiene o crea un ID de cliente válido
 */
const getValidCustomerId = (customer: any): string => {
  // Si hay un usuario autenticado, usar su ID
  if (isAuthenticated && user?._id) {
    console.log('👤 Usuario autenticado encontrado:', user._id);
    return user._id;
  }
  
  // Si el cliente tiene un ID válido (ObjectId), usarlo
  if (customer?.id && customer.id.length === 24) {
    return customer.id;
  }
  
  // Para usuarios invitados, crear un identificador único basado en email y timestamp
  if (customer?.email) {
    const guestId = `guest-${customer.email.replace(/[^a-zA-Z0-9]/g, '')}-${Date.now()}`;
    console.log('👥 Usuario invitado creado:', guestId);
    return guestId;
  }
  
  // ID por defecto para invitados sin email
  const defaultGuestId = `guest-anonymous-${Date.now()}`;
  console.log('👥 Usuario anónimo creado:', defaultGuestId);
  return defaultGuestId;
};

/**
 * Crea datos de cliente profesionales para la orden
 */
const createProfessionalCustomerData = (customer: any) => {
  const baseCustomer = {
    id: getValidCustomerId(customer),
    email: customer?.email || '',
    name: customer?.name || customer?.firstName || '',
    phone: customer?.phone || '',
    isAuthenticated: isAuthenticated,
    userType: isAuthenticated ? 'registered' : 'guest',
    registrationDate: isAuthenticated ? user?.createdAt : new Date().toISOString()
  };

  // Si es un usuario autenticado, usar sus datos completos
  if (isAuthenticated && user) {
    return {
      ...baseCustomer,
      id: user._id,
      email: user.email,
      name: `${user.firstName} ${user.lastName}`.trim(),
      phone: user.phone || customer?.phone || '',
      role: user.role,
      isEmailVerified: user.isEmailVerified
    };
  }

  return baseCustomer;
};

/**
 * Guarda información del usuario invitado para futuras referencias
 */
const saveGuestUserInfo = (customerData: any, orderId: string) => {
  if (!isAuthenticated && customerData.email) {
    const guestInfo = {
      email: customerData.email,
      name: customerData.name,
      phone: customerData.phone,
      lastOrderId: orderId,
      lastOrderDate: new Date().toISOString(),
      totalOrders: 1
    };

    // Verificar si ya existe información del invitado
    const existingGuest = localStorage.getItem(`guest_${customerData.email}`);
    if (existingGuest) {
      try {
        const existing = JSON.parse(existingGuest);
        guestInfo.totalOrders = (existing.totalOrders || 0) + 1;
      } catch (error) {
        console.warn('Error parsing existing guest info:', error);
      }
    }

    localStorage.setItem(`guest_${customerData.email}`, JSON.stringify(guestInfo));
    console.log('💾 Información de usuario invitado guardada:', guestInfo);
  }
};

const createOrderFromPayment = async (paymentResult: any, transactionId: string) => {
  try {
    console.log('🚀 Iniciando creación de orden desde pago');
    console.log('📊 Payment Result:', paymentResult);
    console.log('🔑 Transaction ID:', transactionId);
    
    // Obtener datos del carrito desde localStorage o sessionStorage
    const cartData = localStorage.getItem('cart') || sessionStorage.getItem('cart');
    const customerData = localStorage.getItem('customerData') || sessionStorage.getItem('customerData');
    
    console.log('🛒 Cart Data encontrado:', !!cartData);
    console.log('👤 Customer Data encontrado:', !!customerData);
    console.log('📦 Cart Data raw:', cartData);
    console.log('👤 Customer Data raw:', customerData);
    
    let cart: any;
    let customer: any;
    
    if (!cartData) {
      console.warn('❌ No se encontraron datos del carrito para crear la orden');
      console.log('🔍 Verificando localStorage keys:', Object.keys(localStorage));
      console.log('🔍 Verificando sessionStorage keys:', Object.keys(sessionStorage));
      
      // TEMPORAL: Crear datos de prueba para testing
      console.log('🧪 Creando datos de carrito de prueba...');
      cart = {
        items: [
          {
            product: '507f1f77bcf86cd799439011', // ObjectId válido de prueba
            productName: 'Tarta de Chocolate',
            quantity: 1,
            unitPrice: 25.00,
            totalPrice: 25.00,
            sku: 'TARTA-CHOC-001',
            notes: 'Producto de prueba'
          }
        ],
        subtotal: 25.00,
        tax: 3.00,
        taxRate: 0.12,
        discount: 0,
        discountType: 'fixed',
        total: 28.00,
        shippingCost: 0
      };
      
      customer = {
        id: 'test-customer-123',
        name: 'Cliente de Prueba',
        email: 'test@example.com',
        phone: '0999999999',
        address: {
          street: 'Calle de Prueba 123',
          city: 'Quito',
          state: 'Pichincha',
          zipCode: '170101',
          country: 'Ecuador'
        },
        shippingMethod: 'pickup'
      };
      
      // Crear datos profesionales del cliente
      const professionalCustomerData = createProfessionalCustomerData(customer);
      console.log('👤 Datos profesionales del cliente:', professionalCustomerData);
      
      console.log('🧪 Usando datos de prueba:', { cart, customer });
    } else {
      cart = JSON.parse(cartData);
      customer = customerData ? JSON.parse(customerData) : null;
      
      console.log('🛒 Cart parseado:', cart);
      console.log('👤 Customer parseado:', customer);
    }

    // Transformar items del carrito al formato correcto
    const transformedItems = transformCartItems(cart.items || []);
    console.log('🔄 Items transformados:', transformedItems);
    
    // Crear datos profesionales del cliente si no se hizo antes
    const professionalCustomerData = createProfessionalCustomerData(customer);
    console.log('👤 Datos profesionales del cliente:', professionalCustomerData);
    
    // Preparar datos de la orden desde Payphone
    const orderData: CreateOrderRequest = {
      customer: professionalCustomerData.id,
      items: transformedItems,
      subtotal: cart.subtotal || 0,
      tax: cart.tax || 0,
      taxRate: cart.taxRate || 0.12,
      discount: cart.discount || 0,
      discountType: cart.discountType || 'fixed',
      discountCode: cart.discountCode,
      total: parseFloat(paymentResult.amount) || cart.total || 0,
      paymentMethod: 'payphone',
      paymentReference: paymentResult.transactionId,
      shippingAddress: customer?.address || {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'Ecuador'
      },
      shippingMethod: customer?.shippingMethod || 'pickup',
      shippingCost: cart.shippingCost || 0,
      notes: `Pago procesado con Payphone. Transaction ID: ${paymentResult.transactionId}, Client Transaction ID: ${transactionId}`
    };

    console.log('📋 Order Data preparado:', orderData);
    console.log('🏪 Llamando a ordersStore.createOrder...');
    
    // Crear la orden usando el store
    const createdOrder = await ordersStore.createOrder(orderData);
    
    console.log('📦 Respuesta del store:', createdOrder);
    console.log('❌ Error del store:', ordersStore.error);
    console.log('⏳ Loading del store:', ordersStore.isLoading);
    
    if (createdOrder) {
      console.log('✅ Orden creada exitosamente:', createdOrder);
      orderCreated.value = true;
      createdOrderId.value = createdOrder._id;
      
      // Guardar información del usuario invitado para futuras referencias
      saveGuestUserInfo(professionalCustomerData, createdOrder._id);
      
      // Limpiar datos del carrito después de crear la orden exitosamente
      localStorage.removeItem('cart');
      sessionStorage.removeItem('cart');
      localStorage.removeItem('customerData');
      sessionStorage.removeItem('customerData');
      
      console.log('🧹 Datos del carrito limpiados');
      return createdOrder;
    } else {
      console.warn('⚠️ No se pudo crear la orden - respuesta vacía del store');
      console.log('🔍 Estado del store:', {
        isLoading: ordersStore.isLoading,
        hasError: ordersStore.hasError,
        error: ordersStore.error
      });
    }
    
    return null;
  } catch (error) {
    console.error('💥 Error al crear la orden:', error);
    console.error('📊 Error stack:', error instanceof Error ? error.stack : 'No stack available');
    return null;
  }
};

const processPaymentResponse = async () => {
  try {
    console.log('🎯 Iniciando processPaymentResponse');
    console.log('🌐 URL actual:', window.location.href);
    console.log('📋 Query params:', route.query);
    
    isProcessing.value = true;
    
    // Verificar si el pago fue cancelado
    if (route.query.cancelled === 'true') {
      console.log('❌ Pago cancelado por el usuario');
      paymentStatus.value = 'cancelled';
      return;
    }

    // Extraer parámetros de la URL usando el servicio
    const params = PayphoneService.extractResponseParams(window.location.href);
    console.log('🔍 Parámetros extraídos:', params);
    
    if (!params) {
      throw new Error('No se encontraron parámetros de respuesta válidos');
    }

    // Confirmar el pago con Payphone
    console.log('💳 Confirmando pago con Payphone...');
    const result = await confirmPayment(params.transactionId, params.clientTransactionId);
    console.log('💰 Resultado de confirmación:', result);
    
    if (result && result.transactionStatus === 'Approved') {
      console.log('✅ Pago aprobado - iniciando creación de orden');
      paymentStatus.value = 'success';
      paymentDetails.value = result;
      
      // Crear la orden automáticamente cuando el pago sea exitoso
      const orderResult = await createOrderFromPayment(result, params.clientTransactionId);
      console.log('📦 Resultado de creación de orden:', orderResult);
      
    } else if (result && result.transactionStatus === 'Rejected') {
      console.log('❌ Pago rechazado:', result.message);
      paymentStatus.value = 'error';
      errorMessage.value = result.message || 'El pago fue rechazado';
    } else {
      console.log('⚠️ Estado de pago desconocido:', result);
      paymentStatus.value = 'error';
      errorMessage.value = 'Error al confirmar el pago';
    }
  } catch (error) {
    console.error('Error al procesar respuesta de pago:', error);
    paymentStatus.value = 'error';
    errorMessage.value = error instanceof Error ? error.message : 'Error desconocido';
  } finally {
    isProcessing.value = false;
  }
};

const goToProducts = () => {
  router.push('/products');
};

const goHome = () => {
  router.push('/');
};

const tryAgain = () => {
  router.back();
};

// Procesar respuesta al montar
onMounted(() => {
  processPaymentResponse();
});
</script>

<template>
  <div class="payment-confirmation-view">
    <div class="confirmation-container">
      <!-- Header -->
      <header class="confirmation-header">
        <div class="status-icon" :class="`status-icon--${statusColor}`">
          {{ statusIcon }}
        </div>
        <h1 class="status-title" :class="`status-title--${statusColor}`">
          {{ statusTitle }}
        </h1>
      </header>

      <!-- Content -->
      <main class="confirmation-content">
        <!-- Loading State -->
        <div v-if="isProcessing" class="loading-section">
          <div class="loading-spinner"></div>
          <p class="status-message">{{ statusMessage }}</p>
        </div>

        <!-- Success State -->
        <div v-else-if="paymentStatus === 'success'" class="success-section">
          <p class="status-message">{{ statusMessage }}</p>
          
          <!-- Order Creation Loading -->
          <div v-if="isCreatingOrder" class="order-creation-loading">
            <div class="loading-spinner loading-spinner--small"></div>
            <p class="loading-text">Creando tu orden...</p>
          </div>
          
          <!-- Order Creation Error -->
          <div v-else-if="ordersStore.hasError && !orderCreated" class="order-error">
            <div class="error-icon">⚠️</div>
            <p class="error-text">
              Hubo un problema al crear tu orden, pero tu pago fue procesado correctamente.
              Nuestro equipo revisará tu transacción.
            </p>
            <p class="error-details">{{ ordersStore.error }}</p>
          </div>
          
          <!-- Order Created Successfully -->
          <div v-if="showOrderInfo" class="order-details">
            <h3 class="details-title">Información de tu Orden</h3>
            <div class="details-grid">
              <div class="detail-item">
                <span class="detail-label">Número de Orden:</span>
                <span class="detail-value">#{{ createdOrderId }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Estado:</span>
                <span class="detail-value status-badge status-badge--confirmed">Confirmada</span>
              </div>
            </div>
          </div>
          
          <div v-if="paymentDetails" class="payment-details">
            <h3 class="details-title">Detalles del Pago</h3>
            <div class="details-grid">
              <div class="detail-item">
                <span class="detail-label">ID de Transacción:</span>
                <span class="detail-value">{{ paymentDetails.transactionId }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Monto:</span>
                <span class="detail-value">${{ paymentDetails.amount }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Fecha:</span>
                <span class="detail-value">{{ new Date().toLocaleDateString('es-EC') }}</span>
              </div>
              <div v-if="paymentDetails.reference" class="detail-item">
                <span class="detail-label">Referencia:</span>
                <span class="detail-value">{{ paymentDetails.reference }}</span>
              </div>
            </div>
          </div>

          <div class="success-actions">
            <button class="btn btn--primary" @click="goHome">
              Ir al Inicio
            </button>
            <button class="btn btn--secondary" @click="goToProducts">
              Ver Más Productos
            </button>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="paymentStatus === 'error'" class="error-section">
          <p class="status-message">{{ statusMessage }}</p>
          
          <div class="error-actions">
            <button class="btn btn--primary" @click="tryAgain">
              Intentar Nuevamente
            </button>
            <button class="btn btn--secondary" @click="goToProducts">
              Volver a Productos
            </button>
          </div>
        </div>

        <!-- Cancelled State -->
        <div v-else-if="paymentStatus === 'cancelled'" class="cancelled-section">
          <p class="status-message">{{ statusMessage }}</p>
          
          <div class="cancelled-actions">
            <button class="btn btn--primary" @click="tryAgain">
              Intentar Nuevamente
            </button>
            <button class="btn btn--secondary" @click="goToProducts">
              Volver a Productos
            </button>
          </div>
        </div>
      </main>

      <!-- Footer -->
      <footer class="confirmation-footer">
        <p class="footer-text">
          ¿Necesitas ayuda? 
          <a href="mailto:support@nicole.com.ec" class="footer-link">
            Contáctanos
          </a>
        </p>
      </footer>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.payment-confirmation-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.confirmation-container {
  background: $white;
  border-radius: 1rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 100%;
  overflow: hidden;
}

.confirmation-header {
  text-align: center;
  padding: 2rem 2rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: $white;
}

.status-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  display: block;
  
  &--success {
    filter: drop-shadow(0 0 10px rgba(34, 197, 94, 0.5));
  }
  
  &--error {
    filter: drop-shadow(0 0 10px rgba(239, 68, 68, 0.5));
  }
  
  &--warning {
    filter: drop-shadow(0 0 10px rgba(245, 158, 11, 0.5));
  }
  
  &--info {
    filter: drop-shadow(0 0 10px rgba(59, 130, 246, 0.5));
  }
}

.status-title {
  @include heading-font(700);
  font-size: 1.75rem;
  margin: 0;
  
  @media (min-width: 768px) {
    font-size: 2rem;
  }
}

.confirmation-content {
  padding: 2rem;
}

.loading-section,
.success-section,
.error-section,
.cancelled-section {
  text-align: center;
}

.loading-spinner {
  width: 3rem;
  height: 3rem;
  border: 3px solid #f3f4f6;
  border-top: 3px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1.5rem;
  
  &--small {
    width: 1.5rem;
    height: 1.5rem;
    border-width: 2px;
    margin: 0 auto 0.75rem;
  }
}

.status-message {
  @include body-font(400);
  font-size: 1.1rem;
  color: $text-dark;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.order-creation-loading {
  text-align: center;
  padding: 1.5rem;
  margin-bottom: 2rem;
  background: linear-gradient(135deg, #e0f2fe 0%, #f3e5f5 100%);
  border-radius: 0.75rem;
  border: 1px solid #b3e5fc;
}

.loading-text {
  @include body-font(500);
  color: #667eea;
  font-size: 0.9rem;
  margin: 0;
}

.order-error {
  text-align: center;
  padding: 1.5rem;
  margin-bottom: 2rem;
  background: linear-gradient(135deg, #fff3e0 0%, #ffebee 100%);
  border-radius: 0.75rem;
  border: 1px solid #ffcc02;
}

.error-icon {
  font-size: 2rem;
  margin-bottom: 0.75rem;
}

.error-text {
  @include body-font(500);
  color: #f57c00;
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
}

.error-details {
  @include body-font(400);
  color: #bf360c;
  font-size: 0.85rem;
  margin: 0;
  font-style: italic;
}

.order-details {
  background: linear-gradient(135deg, #e8f5e8 0%, #f1f8e9 100%);
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  text-align: left;
  border: 1px solid #c8e6c9;
}

.payment-details {
  background: $gray-50;
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  text-align: left;
}

.details-title {
  @include heading-font(600);
  font-size: 1.2rem;
  color: $text-dark;
  margin-bottom: 1rem;
}

.details-grid {
  display: grid;
  gap: 0.75rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid $gray-200;
  
  &:last-child {
    border-bottom: none;
  }
}

.detail-label {
  @include body-font(500);
  color: $text-light;
  font-size: 0.9rem;
}

.detail-value {
  @include body-font(600);
  color: $text-dark;
  font-size: 0.9rem;
  text-align: right;
  word-break: break-all;
}

.status-badge {
  @include interface-font(600);
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  &--confirmed {
    background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%);
    color: white;
    box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
  }
  
  &--pending {
    background: linear-gradient(135deg, #ff9800 0%, #ffb74d 100%);
    color: white;
    box-shadow: 0 2px 8px rgba(255, 152, 0, 0.3);
  }
  
  &--cancelled {
    background: linear-gradient(135deg, #f44336 0%, #ef5350 100%);
    color: white;
    box-shadow: 0 2px 8px rgba(244, 67, 54, 0.3);
  }
}

.success-actions,
.error-actions,
.cancelled-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  @media (min-width: 480px) {
    flex-direction: row;
    justify-content: center;
  }
}

.btn {
  @include interface-font(600);
  padding: 0.875rem 2rem;
  border-radius: 0.75rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  font-size: 1rem;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  
  &--primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: $white;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6);
    }
  }
  
  &--secondary {
    background: transparent;
    color: #667eea;
    border: 2px solid #667eea;
    
    &:hover {
      background: #667eea;
      color: $white;
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
    }
  }
}

.confirmation-footer {
  background: $gray-50;
  padding: 1.5rem 2rem;
  text-align: center;
  border-top: 1px solid $gray-200;
}

.footer-text {
  @include body-font(400);
  color: $text-light;
  font-size: 0.9rem;
  margin: 0;
}

.footer-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  
  &:hover {
    text-decoration: underline;
  }
}

// Animaciones
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

// Responsive
@media (max-width: 480px) {
  .confirmation-container {
    margin: 0.5rem;
  }
  
  .confirmation-header {
    padding: 1.5rem 1rem 0.75rem;
  }
  
  .confirmation-content {
    padding: 1.5rem 1rem;
  }
  
  .status-icon {
    font-size: 3rem;
  }
  
  .status-title {
    font-size: 1.5rem;
  }
  
  .status-message {
    font-size: 1rem;
  }
  
  .btn {
    padding: 0.75rem 1.5rem;
    font-size: 0.9rem;
  }
}
</style>