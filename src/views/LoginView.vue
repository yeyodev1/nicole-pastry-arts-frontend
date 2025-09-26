<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import type { LoginData } from '@/types/auth'

const router = useRouter()
const route = useRoute()
const { handleLogin, isLoggingIn, error, clearError, isAuthenticated, setRememberMe } = useAuth()

// Estado del formulario
const formData = ref<LoginData>({
  email: '',
  password: ''
})

// Estados adicionales
const formErrors = ref<Record<string, string>>({})
const showPassword = ref(false)
const rememberMe = ref(false)
const isNavigatingToRegister = ref(false)
const notification = ref<{
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  show: boolean
}>({
  type: 'error',
  title: '',
  message: '',
  show: false
})

// Redirección después del login
const redirectTo = computed(() => {
  return route.query.redirect as string || '/products'
})

// Función para mostrar notificaciones
const showNotification = (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => {
  notification.value = {
    type,
    title,
    message,
    show: true
  }
  
  // Auto-ocultar después de 8 segundos para errores, 5 para otros
  const timeout = type === 'error' ? 8000 : 5000
  setTimeout(() => {
    notification.value.show = false
  }, timeout)
}

// Función para cerrar notificación manualmente
const closeNotification = () => {
  notification.value.show = false
}

// Función para procesar errores del servidor y mostrar mensajes amigables
const processServerError = (errorResponse: any) => {
  const message = errorResponse?.message || 'Error desconocido'
  
  // Casos específicos de errores del servidor
  if (message.includes('Failed to send verification email')) {
    if (message.includes('You can only send testing emails to your own email address')) {
      showNotification(
        'warning',
        'Configuración de Email en Desarrollo',
        'El sistema está en modo de prueba. Solo se pueden enviar emails de verificación a direcciones autorizadas. Contacta al administrador para activar tu cuenta.'
      )
    } else if (message.includes('verify a domain')) {
      showNotification(
        'warning',
        'Configuración de Email Pendiente',
        'El sistema de emails está en configuración. Tu cuenta se creará pero la verificación por email estará disponible pronto.'
      )
    } else {
      showNotification(
        'error',
        'Error de Verificación',
        'No se pudo enviar el email de verificación. Intenta nuevamente o contacta al soporte.'
      )
    }
  } else if (message.includes('Invalid credentials') || message.includes('Unauthorized')) {
    showNotification(
      'error',
      'Credenciales Incorrectas',
      'El email o contraseña son incorrectos. Verifica tus datos e intenta nuevamente.'
    )
  } else if (message.includes('User not found')) {
    showNotification(
      'error',
      'Usuario No Encontrado',
      'No existe una cuenta con este email. ¿Quieres crear una cuenta nueva?'
    )
  } else if (message.includes('Account not verified') || message.includes('Please verify your email')) {
    showNotification(
      'warning',
      'Cuenta No Verificada',
      'Tu cuenta aún no ha sido verificada. Revisa tu email o contacta al soporte.'
    )
  } else if (message.includes('Too many attempts')) {
    showNotification(
      'warning',
      'Demasiados Intentos',
      'Has realizado muchos intentos de login. Espera unos minutos antes de intentar nuevamente.'
    )
  } else if (message.includes('Network') || message.includes('fetch')) {
    showNotification(
      'error',
      'Error de Conexión',
      'No se pudo conectar con el servidor. Verifica tu conexión a internet e intenta nuevamente.'
    )
  } else {
    // Error genérico pero más amigable
    showNotification(
      'error',
      'Error al Iniciar Sesión',
      'Ocurrió un problema inesperado. Por favor intenta nuevamente o contacta al soporte si el problema persiste.'
    )
  }
}

// Validaciones
const validateForm = (): boolean => {
  formErrors.value = {}
  let isValid = true

  // Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!formData.value.email.trim()) {
    formErrors.value.email = 'El email es requerido'
    isValid = false
  } else if (!emailRegex.test(formData.value.email)) {
    formErrors.value.email = 'El email no es válido'
    isValid = false
  }

  // Contraseña
  if (!formData.value.password) {
    formErrors.value.password = 'La contraseña es requerida'
    isValid = false
  }

  return isValid
}

// Validación individual de campos
const validateField = (fieldName: string) => {
  switch (fieldName) {
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!formData.value.email.trim()) {
        formErrors.value.email = 'El email es requerido'
      } else if (!emailRegex.test(formData.value.email)) {
        formErrors.value.email = 'El email no es válido'
      } else {
        delete formErrors.value.email
      }
      break
    case 'password':
      if (!formData.value.password) {
        formErrors.value.password = 'La contraseña es requerida'
      } else {
        delete formErrors.value.password
      }
      break
  }
}

// Computed para validar si el formulario es válido
const isFormValid = computed(() => {
  return formData.value.email.trim() &&
         formData.value.password &&
         Object.keys(formErrors.value).length === 0
})

// Manejo del envío del formulario
const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  try {
    clearError()
    closeNotification()
    
    // Mostrar feedback de inicio de proceso
    showNotification(
      'info',
      'Iniciando Sesión',
      'Verificando tus credenciales...'
    )
    
    // Configurar remember me
    setRememberMe(rememberMe.value)
    
    // Realizar login
    await handleLogin(formData.value, {
      rememberMe: rememberMe.value,
      redirectTo: redirectTo.value
    })

    // Mostrar éxito antes de redireccionar
    showNotification(
      'success',
      '¡Bienvenido!',
      'Has iniciado sesión correctamente. Redirigiendo...'
    )

    // Redireccionar después del login exitoso con un pequeño delay
    setTimeout(async () => {
      await router.push(redirectTo.value)
    }, 1500)
    
  } catch (err: any) {
    console.error('Error en login:', err)
    processServerError(err)
  }
}

// Navegación al registro
const goToRegister = async () => {
  try {
    isNavigatingToRegister.value = true
    
    // Mostrar feedback visual
    showNotification(
      'info',
      'Redirigiendo',
      'Te estamos llevando al formulario de registro...'
    )
    
    const currentRedirect = route.query.redirect as string
    const registerRoute = currentRedirect 
      ? `/register?redirect=${encodeURIComponent(currentRedirect)}`
      : '/register'
    
    // Pequeño delay para mostrar el loading
    await new Promise(resolve => setTimeout(resolve, 800))
    
    await router.push(registerRoute)
  } catch (error) {
    console.error('Error al navegar al registro:', error)
    showNotification(
      'error',
      'Error de Navegación',
      'No se pudo acceder al formulario de registro. Intenta nuevamente.'
    )
  } finally {
    isNavigatingToRegister.value = false
  }
}

// Verificar si ya está autenticado al montar
onMounted(() => {
  if (isAuthenticated) {
    router.push(redirectTo.value)
  }
})
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h1 class="form-title">Iniciar Sesión</h1>
        <p class="form-subtitle">Accede a tu cuenta para continuar</p>
      </div>

      <!-- Notificación mejorada -->
      <Transition name="notification" appear>
        <div v-if="notification.show" class="notification" :class="`notification--${notification.type}`">
          <div class="notification__content">
            <div class="notification__icon">
              <!-- Icono de éxito -->
              <i v-if="notification.type === 'success'" class="fas fa-check-circle"></i>
              <!-- Icono de error -->
              <i v-else-if="notification.type === 'error'" class="fas fa-exclamation-circle"></i>
              <!-- Icono de advertencia -->
              <i v-else-if="notification.type === 'warning'" class="fas fa-exclamation-triangle"></i>
              <!-- Icono de info -->
              <i v-else class="fas fa-info-circle"></i>
            </div>
            <div class="notification__text">
              <h4 class="notification__title">{{ notification.title }}</h4>
              <p class="notification__message">{{ notification.message }}</p>
            </div>
            <button @click="closeNotification" class="notification__close">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="notification__progress" :class="`notification__progress--${notification.type}`"></div>
        </div>
      </Transition>

      <form 
        @submit.prevent="handleSubmit" 
        class="login-form"
        :class="{ 'form-loading': isLoggingIn }"
      >
        <!-- Email -->
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
            @input="clearError"
          />
          <Transition name="error-message">
            <div v-if="formErrors.email" class="error-message">
              <i class="fas fa-exclamation-circle error-icon"></i>
              {{ formErrors.email }}
            </div>
          </Transition>
        </div>

        <!-- Contraseña -->
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
              @input="clearError"
            />
            <button
              type="button"
              class="password-toggle"
              :disabled="isLoggingIn"
              @click="showPassword = !showPassword"
              :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
            >
              <i v-if="showPassword" class="fas fa-eye-slash toggle-icon"></i>
              <i v-else class="fas fa-eye toggle-icon"></i>
            </button>
          </div>
          <Transition name="error-message">
            <div v-if="formErrors.password" class="error-message">
              <i class="fas fa-exclamation-circle error-icon"></i>
              {{ formErrors.password }}
            </div>
          </Transition>
        </div>

        <!-- Remember Me -->
        <div class="form-group">
          <label class="checkbox-container">
            <input
              v-model="rememberMe"
              type="checkbox"
              class="checkbox-input"
              :disabled="isLoggingIn"
            />
            <span class="checkbox-custom"></span>
            <span class="checkbox-label">Recordarme</span>
          </label>
        </div>

        <!-- Botón de envío mejorado -->
        <button
          type="submit"
          class="login-button"
          :class="{ 'loading': isLoggingIn }"
          :disabled="!isFormValid || isLoggingIn"
        >
          <div class="button-content">
            <Transition name="loading-spinner" mode="out-in">
              <div v-if="isLoggingIn" class="loading-spinner">
                <div class="spinner"></div>
              </div>
            </Transition>
            <span class="button-text">
              {{ isLoggingIn ? 'Verificando credenciales...' : 'Iniciar Sesión' }}
            </span>
          </div>
        </button>

        <!-- Enlaces adicionales -->
        <div class="form-links">
          <a href="#" class="forgot-password-link">
            ¿Olvidaste tu contraseña?
          </a>
        </div>
      </form>

      <!-- Enlace al registro -->
      <div class="register-link">
        <p>¿No tienes una cuenta?</p>
        <button 
          @click="goToRegister" 
          class="link register-button"
          :class="{ 'loading': isNavigatingToRegister }"
          :disabled="isNavigatingToRegister || isLoggingIn"
        >
          <div class="button-content">
            <Transition name="loading-spinner" mode="out-in">
              <div v-if="isNavigatingToRegister" class="loading-spinner">
                <div class="spinner"></div>
              </div>
            </Transition>
            <span class="button-text">
              {{ isNavigatingToRegister ? 'Redirigiendo...' : 'Crear cuenta' }}
            </span>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
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
  max-width: 480px;

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
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 24px;

  .error-content {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #dc3545;
    font-size: 14px;

    .error-icon {
      width: 16px;
      height: 16px;
      flex-shrink: 0;
    }
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
      background: #f9fafb;
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

      &:checked + .checkbox-custom {
        background: #d4a574;
        border-color: #d4a574;

        &::after {
          opacity: 1;
          transform: scale(1);
        }
      }

      &:focus + .checkbox-custom {
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

    &:hover:not(:disabled) {
      background: linear-gradient(135deg, #c19653 0%, #a67c3a 100%);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(212, 165, 116, 0.4);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    &.loading {
      background: linear-gradient(135deg, #d4a574 0%, #c19653 100%);
      cursor: not-allowed;
      
      .button-content {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
      }
    }

    .button-content {
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }

    .loading-spinner {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .spinner {
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top: 2px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    .button-text {
      font-weight: 600;
      transition: all 0.3s ease;
    }
  }

  .form-links {
    text-align: center;
    margin-top: 1.5rem;

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
    transition: all 0.3s ease;

    &:hover:not(:disabled) {
      color: #c19653;
      text-decoration: underline;
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  .register-button {
    position: relative;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    min-height: 36px;
    display: inline-flex;
    align-items: center;
    justify-content: center;

    &.loading {
      color: #c19653;
      cursor: not-allowed;
      
      .button-content {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }
    }

    .button-content {
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }

    .loading-spinner {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(212, 165, 116, 0.3);
      border-top: 2px solid #d4a574;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    .button-text {
      font-weight: 600;
      transition: all 0.3s ease;
    }

    &:hover:not(:disabled) {
      background: rgba(212, 165, 116, 0.1);
      text-decoration: none;
    }
  }
}

// Estilos para las notificaciones
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  max-width: 400px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  z-index: 1000;
  border-left: 4px solid;

  &--success {
    border-left-color: $success;
  }

  &--error {
    border-left-color: $error;
  }

  &--warning {
    border-left-color: $warning;
  }

  &--info {
    border-left-color: $info;
  }

  &__content {
    display: flex;
    align-items: flex-start;
    padding: 16px;
    gap: 12px;
  }

  &__icon {
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;

    i {
      font-size: 20px;
    }

    .notification--success & i {
      color: $success;
    }

    .notification--error & i {
      color: $error;
    }

    .notification--warning & i {
      color: $warning;
    }

    .notification--info & i {
      color: $info;
    }
  }

  &__text {
    flex: 1;
    min-width: 0;
  }

  &__title {
    font-weight: 600;
    font-size: 16px;
    color: $text-dark;
    margin: 0 0 4px 0;
    line-height: 1.2;
  }

  &__message {
    font-size: 14px;
    color: $text-light;
    margin: 0;
    line-height: 1.4;
  }

  &__close {
    background: none;
    border: none;
    color: #9ca3af;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: all 0.2s ease;
    flex-shrink: 0;

    &:hover {
      background: #f3f4f6;
      color: #6b7280;
    }

    i {
      font-size: 14px;
    }
  }

  &__progress {
    height: 3px;
    background: #f3f4f6;
    position: relative;
    overflow: hidden;

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      background: currentColor;
      animation: progress 5s linear forwards;
    }

    &--success::after {
      background: $success;
    }

    &--error::after {
      background: $error;
    }

    &--warning::after {
      background: $warning;
    }

    &--info::after {
      background: $info;
    }
  }
}

// Animaciones para las notificaciones
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

@keyframes progress {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}

// Estilos para el loading mejorado
.form-loading {
  opacity: 0.7;
  pointer-events: none;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

// Animaciones para mensajes de error
.error-message-enter-active,
.error-message-leave-active {
  transition: all 0.3s ease;
}

.error-message-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.error-message-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

// Animaciones para el loading spinner
.loading-spinner-enter-active,
.loading-spinner-leave-active {
  transition: all 0.2s ease;
}

.loading-spinner-enter-from,
.loading-spinner-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

// Estilos para inputs deshabilitados durante loading
input:disabled,
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.password-toggle:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

// Mejoras visuales para el estado de loading
.form-loading input,
.form-loading button {
  transition: opacity 0.3s ease;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #dc3545;
  font-size: 14px;
  margin-top: 4px;

  .error-icon {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }
}
</style>