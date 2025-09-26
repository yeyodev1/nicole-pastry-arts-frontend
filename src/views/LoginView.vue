<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import type { LoginData } from '@/types/auth'

// Tipo extendido para el formulario de login
interface LoginFormData extends LoginData {
  rememberMe: boolean
}

const router = useRouter()
const route = useRoute()
const { handleLogin, isLoggingIn, error, clearError, isAuthenticated } = useAuth()

// Estado del formulario
const formData = ref<LoginFormData>({
  email: '',
  password: '',
  rememberMe: false
})

// Estados adicionales
const formErrors = ref<Record<string, string>>({})
const showPassword = ref(false)

// Redirección después del login
const redirectTo = computed(() => {
  return route.query.redirect as string || '/products'
})

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
    // Limpiar errores previos solo al inicio del intento de login
    clearError()

    // Extraer solo los datos necesarios para el login
    const loginData: LoginData = {
      email: formData.value.email,
      password: formData.value.password
    }

    // Intentar login
    const loginSuccess = await handleLogin(loginData, { rememberMe: formData.value.rememberMe })

    console.log('loginSuccess: ', loginSuccess)

    // Redireccionar después del login exitoso
    await router.push(redirectTo.value)
  } catch (err) {
    // No limpiar el error aquí, ya que el store maneja el error automáticamente
    console.error('Error en login:', err)
    // El error ya está disponible en la variable `error` del composable
  }
}

// Navegación al registro
const goToRegister = () => {
  const currentRedirect = route.query.redirect as string
  const registerRoute = currentRedirect
    ? `/register?redirect=${encodeURIComponent(currentRedirect)}`
    : '/register'
  router.push(registerRoute)
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
        <p class="form-subtitle">Bienvenido de vuelta a Nicole Pastry Arts</p>
      </div>

      <!-- Error general -->
      <div v-if="error" class="error-banner">
        <div class="error-content">
          <svg class="error-icon" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
          <span>{{ error.message || 'Error al iniciar sesión' }}</span>
        </div>
      </div>

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
          />
          <div v-if="formErrors.email" class="error-message">
            <svg class="error-icon" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            {{ formErrors.email }}
          </div>
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

        <!-- Recordarme -->
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

        <!-- Botón de envío -->
        <button
          type="submit"
          class="login-button"
          :class="{ 'loading': isLoggingIn }"
          :disabled="!isFormValid || isLoggingIn"
        >
          <div class="button-content">
            <div v-if="isLoggingIn" class="loading-spinner">
              <div class="spinner"></div>
            </div>
            <span class="button-text">
              {{ isLoggingIn ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
            </span>
          </div>
        </button>
      </form>

      <!-- Enlaces adicionales -->
      <div class="form-links">
        <a href="#" class="forgot-password-link">¿Olvidaste tu contraseña?</a>
      </div>

      <!-- Enlace al registro -->
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
    align-items: flex-start;
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
      margin-top: 0.1rem;

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

// Estilos para el loading mejorado
.form-loading {
  opacity: 0.7;
  pointer-events: none;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
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