<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import type { EmailConfirmationData } from '@/types/auth'

const router = useRouter()
const route = useRoute()
const { handleEmailConfirmation, isConfirmingEmail, error, clearError } = useAuth()

// Estados de la verificación
const verificationStatus = ref<'loading' | 'success' | 'error' | 'invalid-token'>('loading')
const verificationMessage = ref('')
const countdown = ref(5)

// Computed para el token desde la URL
const verificationToken = computed(() => {
  return route.query.token as string || ''
})

// Computed para el mensaje según el estado
const statusMessage = computed(() => {
  switch (verificationStatus.value) {
    case 'loading':
      return {
        title: 'Verificando tu email...',
        message: 'Por favor espera mientras verificamos tu dirección de email.',
        icon: 'loading'
      }
    case 'success':
      return {
        title: '¡Email verificado exitosamente!',
        message: 'Tu cuenta ha sido activada. Ahora puedes iniciar sesión con tus credenciales.',
        icon: 'success'
      }
    case 'error':
      return {
        title: 'Error en la verificación',
        message: verificationMessage.value || 'Ha ocurrido un error al verificar tu email. Por favor, intenta nuevamente.',
        icon: 'error'
      }
    case 'invalid-token':
      return {
        title: 'Token inválido',
        message: 'El enlace de verificación no es válido o ha expirado. Por favor, solicita un nuevo email de verificación.',
        icon: 'error'
      }
    default:
      return {
        title: 'Verificando...',
        message: 'Procesando tu solicitud.',
        icon: 'loading'
      }
  }
})

// Función para verificar el email
const verifyEmail = async () => {
  if (!verificationToken.value) {
    verificationStatus.value = 'invalid-token'
    return
  }

  try {
    clearError()
    verificationStatus.value = 'loading'

    const confirmationData: EmailConfirmationData = {
      token: verificationToken.value
    }

    await handleEmailConfirmation(confirmationData)
    
    verificationStatus.value = 'success'
    verificationMessage.value = 'Email verificado correctamente'
    
    // Iniciar countdown para redirección
    startCountdown()
    
  } catch (err: any) {
    verificationStatus.value = 'error'
    
    // Manejar diferentes tipos de errores
    if (error?.message) {
      verificationMessage.value = error.message
    } else if (err?.message) {
      verificationMessage.value = err.message
    } else {
      verificationMessage.value = 'Error desconocido al verificar el email'
    }
  }
}

// Función para iniciar countdown de redirección
const startCountdown = () => {
  const interval = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(interval)
      goToLogin()
    }
  }, 1000)
}

// Navegación al login
const goToLogin = () => {
  router.push('/login')
}

// Navegación al home
const goToHome = () => {
  router.push('/')
}

// Función para solicitar nuevo email de verificación
const requestNewVerification = () => {
  router.push('/register')
}

// Verificar email al montar el componente
onMounted(() => {
  verifyEmail()
})
</script>

<template>
  <div class="verification-container">
    <div class="verification-card">
      <!-- Header -->
      <div class="verification-header">
        <div class="logo-section">
          <h1 class="brand-name">Nicole Pastry Arts</h1>
          <p class="brand-subtitle">Verificación de Email</p>
        </div>
      </div>

      <!-- Contenido principal -->
      <div class="verification-content">
        <!-- Icono de estado -->
        <div class="status-icon" :class="`icon-${statusMessage.icon}`">
          <!-- Loading spinner -->
          <div v-if="statusMessage.icon === 'loading'" class="loading-spinner">
            <div class="spinner"></div>
          </div>
          
          <!-- Success icon -->
          <svg v-else-if="statusMessage.icon === 'success'" class="success-icon" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          
          <!-- Error icon -->
          <svg v-else-if="statusMessage.icon === 'error'" class="error-icon" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </div>

        <!-- Mensaje de estado -->
        <div class="status-message">
          <h2 class="status-title">{{ statusMessage.title }}</h2>
          <p class="status-description">{{ statusMessage.message }}</p>
        </div>

        <!-- Countdown para redirección (solo en éxito) -->
        <div v-if="verificationStatus === 'success'" class="countdown-section">
          <p class="countdown-text">
            Serás redirigido al login en <strong>{{ countdown }}</strong> segundos
          </p>
        </div>

        <!-- Acciones -->
        <div class="verification-actions">
          <!-- Éxito: Botón para ir al login -->
          <template v-if="verificationStatus === 'success'">
            <button @click="goToLogin" class="primary-button">
              Ir al Login Ahora
            </button>
            <button @click="goToHome" class="secondary-button">
              Volver al Inicio
            </button>
          </template>

          <!-- Error: Opciones de recuperación -->
          <template v-else-if="verificationStatus === 'error' || verificationStatus === 'invalid-token'">
            <button @click="requestNewVerification" class="primary-button">
              Solicitar Nuevo Email
            </button>
            <button @click="goToHome" class="secondary-button">
              Volver al Inicio
            </button>
          </template>

          <!-- Loading: Sin acciones -->
          <template v-else>
            <div class="loading-text">
              Verificando tu email, por favor espera...
            </div>
          </template>
        </div>
      </div>

      <!-- Footer -->
      <div class="verification-footer">
        <p class="footer-text">
          ¿Necesitas ayuda? 
          <a href="/contact" class="footer-link">Contáctanos</a>
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.verification-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 1rem;

  @media (max-width: 768px) {
    padding: 1rem;
    align-items: flex-start;
    padding-top: 2rem;
  }
}

.verification-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  padding: 0;
  width: 100%;
  max-width: 500px;
  overflow: hidden;
  animation: slideUp 0.6s ease-out;

  @media (max-width: 480px) {
    max-width: 100%;
    border-radius: 16px;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.verification-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
  text-align: center;
  color: white;

  .logo-section {
    .brand-name {
      font-size: 1.75rem;
      font-weight: 700;
      margin: 0 0 0.5rem 0;
      letter-spacing: -0.025em;
    }

    .brand-subtitle {
      font-size: 1rem;
      opacity: 0.9;
      margin: 0;
      font-weight: 400;
    }
  }
}

.verification-content {
  padding: 3rem 2rem;
  text-align: center;

  @media (max-width: 480px) {
    padding: 2rem 1.5rem;
  }
}

.status-icon {
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;

  &.icon-loading {
    .loading-spinner {
      .spinner {
        width: 48px;
        height: 48px;
        border: 4px solid #e5e7eb;
        border-top: 4px solid #667eea;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
    }
  }

  &.icon-success {
    .success-icon {
      width: 64px;
      height: 64px;
      color: #10b981;
      animation: successPulse 0.6s ease-out;
    }
  }

  &.icon-error {
    .error-icon {
      width: 64px;
      height: 64px;
      color: #ef4444;
      animation: errorShake 0.6s ease-out;
    }
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes successPulse {
  0% { transform: scale(0.8); opacity: 0; }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes errorShake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.status-message {
  margin-bottom: 2rem;

  .status-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0 0 1rem 0;
    line-height: 1.3;
  }

  .status-description {
    font-size: 1rem;
    color: #6b7280;
    line-height: 1.6;
    margin: 0;
  }
}

.countdown-section {
  margin-bottom: 2rem;
  padding: 1rem;
  background: #f0f9ff;
  border-radius: 8px;
  border: 1px solid #e0f2fe;

  .countdown-text {
    margin: 0;
    color: #0369a1;
    font-size: 0.9rem;
    font-weight: 500;

    strong {
      font-weight: 700;
      color: #1e40af;
    }
  }
}

.verification-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;

  .primary-button {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 12px;
    padding: 1rem 2rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 14px 0 rgba(102, 126, 234, 0.3);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px 0 rgba(102, 126, 234, 0.4);
    }

    &:active {
      transform: translateY(0);
    }
  }

  .secondary-button {
    background: transparent;
    color: #6b7280;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    padding: 1rem 2rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      border-color: #d1d5db;
      color: #374151;
      background: #f9fafb;
    }
  }

  .loading-text {
    color: #6b7280;
    font-style: italic;
    padding: 1rem;
  }
}

.verification-footer {
  padding: 1.5rem 2rem;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
  text-align: center;

  .footer-text {
    margin: 0;
    color: #6b7280;
    font-size: 0.875rem;

    .footer-link {
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s ease;

      &:hover {
        color: #5a67d8;
        text-decoration: underline;
      }
    }
  }
}

@media (max-width: 480px) {
  .verification-actions {
    .primary-button,
    .secondary-button {
      padding: 0.875rem 1.5rem;
      font-size: 0.9rem;
    }
  }

  .status-message {
    .status-title {
      font-size: 1.25rem;
    }

    .status-description {
      font-size: 0.9rem;
    }
  }
}
</style>