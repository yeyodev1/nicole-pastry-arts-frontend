<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth, useAuthValidation } from '@/composables/useAuth'
import type { LoginData } from '@/types/auth'

// Tipo extendido para el formulario de login
interface LoginFormData extends LoginData {
  rememberMe: boolean
}

const router = useRouter()
const route = useRoute()

// Lógica de autenticación desde nuestro composable corregido
const { handleLogin, isLoggingIn, error, clearError, isAuthenticated, user } = useAuth()

// Usamos el composable de validación para una lógica más limpia
const {
  validationErrors: formErrors,
  validateLoginData,
  clearValidationErrors,
} = useAuthValidation()

// Estado del formulario
const formData = ref<LoginFormData>({
  email: '',
  password: '',
  rememberMe: false,
})

const showPassword = ref(false)
const isResendingEmail = ref(false)

// Computed para validar si el formulario es válido usando la lógica centralizada
const isFormValid = computed(() => {
  return validateLoginData({
    email: formData.value.email,
    password: formData.value.password
  }).isValid
})

// Lógica de redirección (sin cambios)
const redirectTo = computed(() => {
  if (route.query.redirect) {
    return route.query.redirect as string
  }
  // Importante usar .value al acceder a propiedades de un ref
  if (user.value?.role === 'staff' || user.value?.role === 'admin') {
    return '/staff/dashboard'
  }
  return '/products'
})

// Lógica para mostrar errores de API (sin cambios, tu implementación es excelente)
const errorMessage = computed(() => {
  if (!error.value) {
    return null
  }

  const errorMsg = error.value.message || ''
  const statusCode = error.value.details?.statusCode || error.value.code

  if (errorMsg.includes('verify your email') || errorMsg.includes('email before logging')) {
    return {
      type: 'email_verification',
      title: 'Email no verificado',
      message: 'Necesitas verificar tu email antes de poder iniciar sesión.',
      action: 'Reenviar email de verificación'
    }
  }

  if (statusCode === 401 ||
    statusCode === '401' ||
    errorMsg.includes('Invalid email or password') ||
    errorMsg.includes('Invalid credentials') ||
    error.value.type === 'AUTHENTICATION_ERROR') {
    return {
      type: 'credentials',
      title: 'Credenciales incorrectas',
      message: 'El email o la contraseña que ingresaste no son correctos. Verifica tus datos e intenta nuevamente o crea una cuenta.',
      action: null
    }
  }

  if (error.value.type === 'NETWORK_ERROR') {
    return {
      type: 'network',
      title: 'Error de conexión',
      message: 'No se pudo conectar con el servidor. Verifica tu conexión a internet.',
      action: null
    }
  }

  return {
    type: 'generic',
    title: 'Error',
    message: errorMsg || 'Ha ocurrido un error inesperado. Por favor, intenta nuevamente.',
    action: null
  }
})

// Lógica de reenvío de email (sin cambios)
const handleResendVerification = async () => {
  if (!formData.value.email || isResendingEmail.value) return

  try {
    isResendingEmail.value = true
    clearError()
    console.log('📧 Reenviando email de verificación a:', formData.value.email)
    await new Promise(resolve => setTimeout(resolve, 2000))
    alert(`Email de verificación enviado a ${formData.value.email}. Revisa tu bandeja de entrada.`)
  } catch (err) {
    console.error('❌ Error al reenviar email:', err)
    alert('Error al reenviar el email. Por favor, intenta nuevamente.')
  } finally {
    isResendingEmail.value = false
  }
}

// Manejo del envío del formulario simplificado
const handleSubmit = async () => {
  // Limpiamos errores de API y validaciones previas
  clearError()
  clearValidationErrors()

  // Validamos el formulario con nuestra función centralizada
  const validation = validateLoginData(formData.value)
  if (!validation.isValid) {
    formErrors.value = validation.errors // Mostramos los errores de validación
    return
  }

  if (isLoggingIn.value) return

  try {
    const loginData: LoginData = {
      email: formData.value.email,
      password: formData.value.password,
    }

    await handleLogin(loginData, { rememberMe: formData.value.rememberMe })

    // La redirección ocurrirá cuando el watcher de `isAuthenticated` se dispare o aquí
    await router.push(redirectTo.value)
  } catch (err) {
    // El composable `useAuth` ya maneja el estado de error.
    // El computed `errorMessage` reaccionará automáticamente.
  }
}

// Navegación (sin cambios)
const goToRegister = () => {
  const currentRedirect = route.query.redirect as string
  const registerRoute = currentRedirect
    ? `/register?redirect=${encodeURIComponent(currentRedirect)}`
    : '/register'
  router.push(registerRoute)
}

// Verificación al montar (sin cambios)
onMounted(() => {
  if (isAuthenticated.value) {
    router.push(redirectTo.value)
  }
})

// Valida un campo individualmente cuando pierde el foco (on-blur)
const validateField = (field: 'email' | 'password') => {
  const validation = validateLoginData(formData.value);
  if (validation.errors[field]) {
    formErrors.value[field] = validation.errors[field];
  } else {
    delete formErrors.value[field];
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h1 class="form-title">Iniciar Sesión</h1>
        <p class="form-subtitle">Bienvenido de vuelta a Nicole Pastry Arts</p>
      </div>

      <div v-if="errorMessage" class="error-banner" :class="`error-${errorMessage.type}`">
        <div class="error-content">
          <svg class="error-icon" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
          <div class="error-text">
            <div class="error-title">{{ errorMessage.title }}</div>
            <div class="error-message">{{ errorMessage.message }}</div>
          </div>
        </div>
        
        <div v-if="errorMessage.action && errorMessage.type === 'email_verification'" class="error-actions">
          <button 
            @click="handleResendVerification"
            :disabled="isResendingEmail"
            class="error-action-btn"
            type="button"
          >
            <div v-if="isResendingEmail" class="loading-spinner-small">
              <div class="spinner-small"></div>
            </div>
            <span>{{ isResendingEmail ? 'Enviando...' : errorMessage.action }}</span>
          </button>
        </div>
      </div>

      <form 
        @submit.prevent="handleSubmit" 
        class="login-form"
        :class="{ 'form-loading': isLoggingIn }"
        novalidate
      >
        <div class="form-group">
          <label for="email" class="form-label">
            Email <span class="required">*</span>
          </label>
          <input
            id="email"
            v-model="formData.email"
            type="email"
            class="form-input"
            :class="{ 'error': formErrors.email }"
            placeholder="tu@email.com"
            autocomplete="email"
            :disabled="isLoggingIn"
            @blur="validateField('email')"
          />
          <div v-if="formErrors.email" class="error-message">
            <svg class="error-icon" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            {{ formErrors.email }}
          </div>
        </div>

        <div class="form-group">
          <label for="password" class="form-label">
            Contraseña <span class="required">*</span>
          </label>
          <div class="password-input-container">
            <input
              id="password"
              v-model="formData.password"
              :type="showPassword ? 'text' : 'password'"
              class="form-input password-input"
              :class="{ 'error': formErrors.password }"
              placeholder="Tu contraseña"
              autocomplete="current-password"
              :disabled="isLoggingIn"
              @blur="validateField('password')"
            />
            <button
              type="button"
              class="password-toggle"
              :disabled="isLoggingIn"
              @click="showPassword = !showPassword"
              :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
            >
              <svg v-if="showPassword" class="toggle-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
              <svg v-else class="toggle-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </div>
          <div v-if="formErrors.password" class="error-message">
            <svg class="error-icon" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            {{ formErrors.password }}
          </div>
        </div>

        <div class="form-group">
          <label class="checkbox-container">
            <input
              v-model="formData.rememberMe"
              type="checkbox"
              class="checkbox-input"
              :disabled="isLoggingIn"
            />
            <span class="checkbox-custom"></span>
            <span class="checkbox-label">Recordarme</span>
          </label>
        </div>

        <button
          type="submit"
          :disabled="!isFormValid || isLoggingIn"
          class="login-button"
        >
          <span v-if="!isLoggingIn" class="login-button__content">
            <i class="fas fa-sign-in-alt login-button__icon"></i>
            Iniciar Sesión
          </span>
          <span v-else class="login-button__loading">
            <div class="login-button__spinner-container">
              <i class="fas fa-spinner fa-spin login-button__spinner"></i>
            </div>
            Iniciando sesión...
          </span>
        </button>
      </form>

      <div class="form-links">
        <a href="#" class="forgot-password-link">¿Olvidaste tu contraseña?</a>
      </div>

      <div class="register-link">
        <p>¿No tienes una cuenta?</p>
        <button @click="goToRegister" class="link">
          Crear cuenta
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
/* Tus estilos están muy bien estructurados y no requieren cambios. */
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem 1rem;

  @media (max-width: 768px) {
    padding: 1rem;
    align-items: flex-start;
    padding-top: 2rem;
  }
}

.login-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  padding: 3rem;
  width: 100%;
  max-width: 420px;

  @media (max-width: 768px) {
    padding: 2rem;
    border-radius: 12px;
  }

  @media (max-width: 480px) {
    padding: 1.5rem;
  }
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;

  .form-title {
    color: #2c3e50;
    margin-bottom: 8px;
    font-size: 28px;
    font-weight: 700;
  }

  .form-subtitle {
    color: #6c757d;
    font-size: 16px;
    margin: 0;
  }
}

.error-banner {
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
  color: #721c24;

  .error-content {
    display: flex;
    align-items: flex-start;
    gap: 12px;

    .error-icon {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .error-text {
      flex: 1;

      .error-title {
        font-weight: 600;
        font-size: 14px;
        margin-bottom: 4px;
      }

      .error-message {
        font-size: 13px;
        line-height: 1.4;
        opacity: 0.9;
      }
    }
  }

  .error-actions {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid #f5c6cb;

    .error-action-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: #dc3545;
      color: white;
      border: none;
      border-radius: 6px;
      padding: 8px 16px;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover:not(:disabled) {
        background: #c82333;
        transform: translateY(-1px);
      }

      &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
        transform: none;
      }

      .loading-spinner-small .spinner-small {
        width: 14px;
        height: 14px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top: 2px solid white;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
    }
  }

  &.error-email_verification {
    background: #fff3cd;
    border-color: #ffeeba;
    color: #856404;

    .error-actions .error-action-btn {
      background: #ffc107;
      color: #212529;

      &:hover:not(:disabled) {
        background: #e0a800;
      }
    }
  }

  &.error-network {
    background: #d1ecf1;
    border-color: #bee5eb;
    color: #0c5460;
  }
}

.login-form {
  .form-group {
    margin-bottom: 1.5rem;
  }

  .form-label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #374151;
    font-size: 14px;

    .required {
      color: #dc3545;
    }
  }

  .form-input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    font-size: 16px;
    transition: all 0.3s ease;
    background: white;

    &:focus {
      outline: none;
      border-color: #d4a574;
      box-shadow: 0 0 0 3px rgba(212, 165, 116, 0.1);
    }

    &.error {
      border-color: #dc3545;
      box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
    }

    &::placeholder {
      color: #9ca3af;
    }

    &:disabled {
      background-color: #f3f4f6;
      cursor: not-allowed;
    }
  }

  .password-input-container {
    position: relative;

    .password-input {
      padding-right: 3rem;
    }

    .password-toggle {
      position: absolute;
      right: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: #6b7280;
      cursor: pointer;
      padding: 0.25rem;
      border-radius: 4px;
      transition: color 0.3s ease;

      &:hover:not(:disabled) {
        color: #374151;
      }

      &:disabled {
        cursor: not-allowed;
        opacity: 0.5;
      }

      .toggle-icon {
        width: 20px;
        height: 20px;
      }
    }
  }

  .checkbox-container {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer;
    user-select: none;

    .checkbox-input {
      position: absolute;
      opacity: 0;
      cursor: pointer;

      &:checked+.checkbox-custom {
        background: #d4a574;
        border-color: #d4a574;

        &::after {
          opacity: 1;
          transform: scale(1);
        }
      }

      &:focus+.checkbox-custom {
        box-shadow: 0 0 0 3px rgba(212, 165, 116, 0.1);
      }
    }

    .checkbox-custom {
      width: 20px;
      height: 20px;
      border: 2px solid #d1d5db;
      border-radius: 4px;
      background: white;
      position: relative;
      transition: all 0.3s ease;
      flex-shrink: 0;

      &::after {
        content: '';
        position: absolute;
        left: 6px;
        top: 2px;
        width: 6px;
        height: 10px;
        border: solid white;
        border-width: 0 2px 2px 0;
        transform: rotate(45deg) scale(0);
        opacity: 0;
        transition: all 0.2s ease;
      }
    }

    .checkbox-label {
      color: #374151;
      font-size: 14px;
      line-height: 1.4;
    }
  }

  .login-button {
    width: 100%;
    background: linear-gradient(135deg, #d4a574 0%, #c19653 100%);
    color: white;
    border: none;
    border-radius: 8px;
    padding: 0.875rem 1.5rem;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    margin-top: 1rem;
    min-height: 52px;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover:not(:disabled) {
      background: linear-gradient(135deg, #c19653 0%, #a67c3a 100%);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(212, 165, 116, 0.4);
    }

    &:disabled {
      background: #cccccc;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
      opacity: 0.7;
    }
  }

  .login-button__content,
  .login-button__loading {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .login-button__spinner {
    animation: spin 1s linear infinite;
  }
}

.form-links {
  text-align: center;
  margin: 1.5rem 0;

  .forgot-password-link {
    color: #d4a574;
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    transition: color 0.3s ease;

    &:hover {
      color: #c19653;
      text-decoration: underline;
    }
  }
}

.register-link {
  text-align: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;

  p {
    color: #6c757d;
    font-size: 14px;
    margin: 0 0 8px 0;
  }

  .link {
    color: #d4a574;
    background: none;
    border: none;
    text-decoration: none;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: color 0.3s ease;

    &:hover {
      color: #c19653;
      text-decoration: underline;
    }
  }
}

.form-loading {
  opacity: 0.7;
  pointer-events: none;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #721c24;
  font-size: 13px;
  margin-top: 6px;

  .error-icon {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>