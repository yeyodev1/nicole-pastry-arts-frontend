<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePayphonePayment } from '@/composables/usePayphonePayment';
import PayphoneService from '@/services/payphone';

const route = useRoute();
const router = useRouter();

// Estados del componente
const isProcessing = ref(true);
const paymentStatus = ref<'success' | 'error' | 'cancelled' | 'processing'>('processing');
const paymentDetails = ref<any>(null);
const errorMessage = ref<string>('');

// Composable de pagos
const { confirmPayment, processPayphoneResponse } = usePayphonePayment();

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

// Métodos
const processPaymentResponse = async () => {
  try {
    isProcessing.value = true;
    
    // Verificar si el pago fue cancelado
    if (route.query.cancelled === 'true') {
      paymentStatus.value = 'cancelled';
      return;
    }

    // Extraer parámetros de la URL usando el servicio
    const params = PayphoneService.extractResponseParams(window.location.href);
    
    if (!params) {
      throw new Error('No se encontraron parámetros de respuesta válidos');
    }

    // Confirmar el pago con Payphone
    const result = await confirmPayment(params.transactionId, params.clientTransactionId);
    
    if (result && result.transactionStatus === 'Approved') {
      paymentStatus.value = 'success';
      paymentDetails.value = result;
    } else if (result && result.transactionStatus === 'Rejected') {
      paymentStatus.value = 'error';
      errorMessage.value = result.message || 'El pago fue rechazado';
    } else {
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
          
          <div v-if="paymentDetails" class="payment-details">
            <h3 class="details-title">Detalles del Pago</h3>
            <div class="details-grid">
              <div class="detail-item">
                <span class="detail-label">ID de Transacción:</span>
                <span class="detail-value">{{ paymentDetails.transactionId }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Monto:</span>
                <span class="detail-value">{{ paymentDetails.amount }}</span>
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
}

.status-message {
  @include body-font(400);
  font-size: 1.1rem;
  color: $text-dark;
  line-height: 1.6;
  margin-bottom: 2rem;
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