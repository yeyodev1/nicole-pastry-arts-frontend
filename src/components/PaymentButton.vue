<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { usePayphonePayment } from '@/composables/usePayphonePayment';
import { useAuth } from '@/composables/useAuth';

// Props del componente
const props = defineProps({
  productId: {
    type: String,
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  variant: {
    type: String,
    required: false,
    default: 'primary',
    validator: (value: string) => ['primary', 'secondary', 'outline'].includes(value),
  },
  size: {
    type: String,
    required: false,
    default: 'medium',
    validator: (value: string) => ['small', 'medium', 'large'].includes(value),
  },
  fullWidth: {
    type: Boolean,
    required: false,
    default: false,
  },
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  },
});

// Emits
const emit = defineEmits<{
  click: [event: MouseEvent];
  paymentStarted: [productId: string];
  paymentError: [error: string];
}>();

// Router y composables
const router = useRouter();
const { isAuthenticated } = useAuth();
const { initiatePayment, isProcessing, hasError, error, canPay } = usePayphonePayment();

// Estados computados
const isDisabled = computed(() => props.disabled || isProcessing.value || !canPay.value);

const formattedPrice = computed(() => {
  return new Intl.NumberFormat('es-EC', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(props.price);
});

const buttonClasses = computed(() => {
  const classes = ['payment-button'];
  
  // Variante
  classes.push(`payment-button--${props.variant}`);
  
  // Tamaño
  classes.push(`payment-button--${props.size}`);
  
  // Estados
  if (isDisabled.value) classes.push('payment-button--disabled');
  if (isProcessing.value) classes.push('payment-button--loading');
  if (props.fullWidth) classes.push('payment-button--full-width');
  
  return classes;
});

// Métodos
const handlePayment = async (event: MouseEvent) => {
  // Emitir el evento click para permitir el manejo externo (como .stop)
  emit('click', event);
  
  if (isDisabled.value) return;

  // Verificar autenticación antes de procesar el pago
  if (!isAuthenticated) {
    // Redirigir a la página de registro con la URL actual como parámetro de redirección
    const currentPath = router.currentRoute.value.fullPath;
    router.push({
      name: 'register',
      query: { redirect: currentPath }
    });
    return;
  }

  try {
    emit('paymentStarted', props.productId);
    
    await initiatePayment({
      productId: props.productId,
      productName: props.productName,
      price: props.price,
      description: props.description,
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Error al procesar el pago';
    emit('paymentError', errorMessage);
  }
};
</script>

<template>
  <button
    :class="buttonClasses"
    :disabled="isDisabled"
    @click="handlePayment"
    type="button"
  >
    <!-- Icono de carga -->
    <div v-if="isProcessing" class="payment-button__spinner">
      <svg class="payment-button__spinner-icon" viewBox="0 0 24 24">
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="2"
          fill="none"
          stroke-linecap="round"
          stroke-dasharray="31.416"
          stroke-dashoffset="31.416"
        />
      </svg>
    </div>

    <!-- Icono de Payphone -->
    <div v-else class="payment-button__icon">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
    </div>

    <!-- Contenido del botón -->
    <div class="payment-button__content">
      <span class="payment-button__text">
        {{ isProcessing ? 'Procesando...' : 'Pagar con Payphone' }}
      </span>
      <span class="payment-button__price">{{ formattedPrice }}</span>
    </div>
  </button>

  <!-- Mensaje de error -->
  <div v-if="hasError" class="payment-button__error">
    <svg class="payment-button__error-icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
    </svg>
    <span>{{ error }}</span>
  </div>
</template>

<style lang="scss" scoped>
.payment-button {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 0.75rem;
  font-family: inherit;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  position: relative;
  overflow: hidden;
  
  // Variantes de color
  &--primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    
    &:hover:not(.payment-button--disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6);
    }
    
    &:active:not(.payment-button--disabled) {
      transform: translateY(0);
    }
  }
  
  &--secondary {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(240, 147, 251, 0.4);
    
    &:hover:not(.payment-button--disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(240, 147, 251, 0.6);
    }
  }
  
  &--outline {
    background: transparent;
    color: #667eea;
    border: 2px solid #667eea;
    box-shadow: none;
    
    &:hover:not(.payment-button--disabled) {
      background: #667eea;
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
    }
  }
  
  // Tamaños
  &--small {
    padding: 0.625rem 1rem;
    font-size: 0.875rem;
    gap: 0.5rem;
    
    .payment-button__icon {
      width: 1rem;
      height: 1rem;
    }
  }
  
  &--medium {
    padding: 0.875rem 1.5rem;
    font-size: 1rem;
    gap: 0.75rem;
    
    .payment-button__icon {
      width: 1.25rem;
      height: 1.25rem;
    }
  }
  
  &--large {
    padding: 1.125rem 2rem;
    font-size: 1.125rem;
    gap: 1rem;
    
    .payment-button__icon {
      width: 1.5rem;
      height: 1.5rem;
    }
  }
  
  // Estados
  &--full-width {
    width: 100%;
    justify-content: center;
  }
  
  &--disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }
  
  &--loading {
    cursor: wait;
    
    .payment-button__content {
      opacity: 0.8;
    }
  }
}

.payment-button__icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 100%;
    height: 100%;
  }
}

.payment-button__spinner {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
}

.payment-button__spinner-icon {
  width: 100%;
  height: 100%;
  animation: spin 1s linear infinite;
  
  circle {
    animation: dash 1.5s ease-in-out infinite;
  }
}

.payment-button__content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.125rem;
  min-width: 0;
}

.payment-button__text {
  font-weight: 600;
  line-height: 1.2;
  white-space: nowrap;
}

.payment-button__price {
  font-size: 0.875em;
  font-weight: 700;
  opacity: 0.9;
  line-height: 1;
}

.payment-button__error {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  padding: 0.75rem;
  background: #fee2e2;
  color: #dc2626;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  border: 1px solid #fecaca;
}

.payment-button__error-icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}

// Animaciones
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}

// Responsive
@media (max-width: 768px) {
  .payment-button {
    &--medium {
      padding: 0.75rem 1.25rem;
      font-size: 0.9rem;
    }
    
    &--large {
      padding: 1rem 1.75rem;
      font-size: 1rem;
    }
  }
  
  .payment-button__content {
    gap: 0.25rem;
  }
  
  .payment-button__text {
    font-size: 0.9em;
  }
  
  .payment-button__price {
    font-size: 0.8em;
  }
}
</style>