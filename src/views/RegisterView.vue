<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth, useAuthValidation } from '@/composables/useAuth'
import type { RegisterData, ValidationErrors } from '@/types/auth'

// Tipo extendido para el formulario, incluyendo campos de UI
interface RegisterFormData extends RegisterData {
  confirmPassword: string
  acceptTerms: boolean
}

// Tipo extendido para errores de validación del formulario de registro
interface RegisterValidationErrors extends ValidationErrors {
  confirmPassword?: string
  acceptTerms?: string
}

const router = useRouter()
const route = useRoute()

// 1. Importamos los composables de autenticación y validación
const { handleRegister, isRegistering, error, clearError } = useAuth()
const {
  validateRegisterData,
  clearValidationErrors
} = useAuthValidation()

// Estado local de errores de validación con tipo extendido
const formErrors = ref<RegisterValidationErrors>({})

// Estado del formulario
const formData = ref<RegisterFormData>({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false,
})

// Estados de la UI
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const redirectTo = computed(() => route.query.redirect as string || '/verify-email-notice')

// 2. Computed `isFormValid` simplificado, delega toda la lógica al composable
const isFormValid = computed(() => {
  // También validamos los campos extra de la UI aquí
  const customValidation = formData.value.password === formData.value.confirmPassword && formData.value.acceptTerms
  return validateRegisterData(formData.value).isValid && customValidation
})

// 3. `errorMessage` mejorado para devolver un objeto estructurado
const errorMessage = computed(() => {
  if (!error.value) return null

  const errorMsg = error.value.message || ''

  if (errorMsg.includes('already exists')) {
    return {
      type: 'conflict',
      title: 'Email ya registrado',
      message: 'Ya existe una cuenta con este email.',
      action: 'Iniciar Sesión',
    }
  }

  return {
    type: 'generic',
    title: 'Error en el Registro',
    message: errorMsg || 'Ha ocurrido un error inesperado. Por favor, intenta de nuevo.',
    action: null,
  }
})

// 4. `handleSubmit` refactorizado y limpio
const handleSubmit = async () => {
  clearError()
  clearValidationErrors()

  // Validamos todo el formulario usando la función centralizada
  const validation = validateRegisterData(formData.value)

  // Creamos un objeto de errores extendido
  const extendedErrors: RegisterValidationErrors = { ...validation.errors }

  // Validaciones adicionales que son propias de este formulario
  if (formData.value.password !== formData.value.confirmPassword) {
    validation.isValid = false
    extendedErrors.confirmPassword = 'Las contraseñas no coinciden'
  }
  if (!formData.value.acceptTerms) {
    validation.isValid = false
    extendedErrors.acceptTerms = 'Debes aceptar los términos y condiciones'
  }

  if (!validation.isValid) {
    formErrors.value = extendedErrors
    return
  }

  if (isRegistering.value) return

  try {
    const registerData: RegisterData = {
      firstName: formData.value.firstName,
      lastName: formData.value.lastName,
      email: formData.value.email,
      password: formData.value.password,
      phone: formData.value.phone?.replace(/\D/g, ''), // Enviamos el teléfono sin formato
    }

    await handleRegister(registerData)
    await router.push(redirectTo.value)

  } catch (err) {
    // El error es manejado automáticamente por el `errorMessage` computed
  }
}

// 5. Función de validación on-blur simplificada
const validateField = (field: keyof RegisterFormData) => {
  // Para campos que están en RegisterData, usamos la validación del composable
  if (field !== 'confirmPassword' && field !== 'acceptTerms') {
    const validation = validateRegisterData(formData.value)
    const fieldKey = field as keyof ValidationErrors

    if (validation.errors[fieldKey]) {
      formErrors.value[fieldKey] = validation.errors[fieldKey]
    } else {
      delete formErrors.value[fieldKey]
    }

    // Lógica especial para contraseñas para re-validar la confirmación
    if (field === 'password' && formData.value.confirmPassword) {
      if (formData.value.password !== formData.value.confirmPassword) {
        formErrors.value.confirmPassword = 'Las contraseñas no coinciden'
      } else {
        delete formErrors.value.confirmPassword
      }
    }
  } else {
    // Validación para campos específicos del formulario
    if (field === 'confirmPassword') {
      if (formData.value.password !== formData.value.confirmPassword) {
        formErrors.value.confirmPassword = 'Las contraseñas no coinciden'
      } else {
        delete formErrors.value.confirmPassword
      }
    }
    
    if (field === 'acceptTerms') {
      if (!formData.value.acceptTerms) {
        formErrors.value.acceptTerms = 'Debes aceptar los términos y condiciones'
      } else {
        delete formErrors.value.acceptTerms
      }
    }
  }
}

const goToLogin = () => {
  const currentRedirect = route.query.redirect as string
  const loginRoute = currentRedirect
    ? `/login?redirect=${encodeURIComponent(currentRedirect)}`
    : '/login'
  router.push(loginRoute)
}
</script>

<template>
  <div class="register-container">
    <div class="register-card">
      <div class="register-header">
        <h1 class="form-title">Crear Cuenta</h1>
        <p class="form-subtitle">Únete a Nicole Pastry Arts</p>
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
        <div v-if="errorMessage.action" class="error-actions">
          <button @click="goToLogin" class="error-action-btn" type="button">
            {{ errorMessage.action }}
          </button>
        </div>
      </div>

      <form 
        @submit.prevent="handleSubmit" 
        class="register-form"
        :class="{ 'form-loading': isRegistering }"
        novalidate
      >
        <div class="form-row">
          <div class="form-group">
            <label for="firstName" class="form-label">Nombre <span class="required">*</span></label>
            <input
              id="firstName"
              v-model="formData.firstName"
              type="text"
              class="form-input"
              :class="{ 'error': formErrors.firstName }"
              :disabled="isRegistering"
              @blur="validateField('firstName')"
            />
            <div v-if="formErrors.firstName" class="error-message">{{ formErrors.firstName }}</div>
          </div>
          <div class="form-group">
            <label for="lastName" class="form-label">Apellido <span class="required">*</span></label>
            <input
              id="lastName"
              v-model="formData.lastName"
              type="text"
              class="form-input"
              :class="{ 'error': formErrors.lastName }"
              :disabled="isRegistering"
              @blur="validateField('lastName')"
            />
            <div v-if="formErrors.lastName" class="error-message">{{ formErrors.lastName }}</div>
          </div>
        </div>

        <div class="form-group">
          <label for="email" class="form-label">Email <span class="required">*</span></label>
          <input
            id="email"
            v-model="formData.email"
            type="email"
            class="form-input"
            :class="{ 'error': formErrors.email }"
            :disabled="isRegistering"
            @blur="validateField('email')"
          />
          <div v-if="formErrors.email" class="error-message">{{ formErrors.email }}</div>
        </div>

        <div class="form-group">
          <label for="phone" class="form-label">Teléfono</label>
          <input
            id="phone"
            v-model="formData.phone"
            type="tel"
            class="form-input"
            :class="{ 'error': formErrors.phone }"
            :disabled="isRegistering"
            @blur="validateField('phone')"
          />
          <div v-if="formErrors.phone" class="error-message">{{ formErrors.phone }}</div>
        </div>

        <div class="form-group">
          <label for="password" class="form-label">Contraseña <span class="required">*</span></label>
          <div class="password-input-container">
            <input
              id="password"
              v-model="formData.password"
              :type="showPassword ? 'text' : 'password'"
              class="form-input"
              :class="{ 'error': formErrors.password }"
              :disabled="isRegistering"
              @blur="validateField('password')"
            />
            <button type="button" class="password-toggle" @click="showPassword = !showPassword">
              </button>
          </div>
          <div v-if="formErrors.password" class="error-message">{{ formErrors.password }}</div>
        </div>

        <div class="form-group">
          <label for="confirmPassword" class="form-label">Confirmar Contraseña <span class="required">*</span></label>
          <div class="password-input-container">
            <input
              id="confirmPassword"
              v-model="formData.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              class="form-input"
              :class="{ 'error': formErrors.confirmPassword }"
              :disabled="isRegistering"
              @blur="validateField('confirmPassword')"
            />
            <button type="button" class="password-toggle" @click="showConfirmPassword = !showConfirmPassword">
                </button>
          </div>
          <div v-if="formErrors.confirmPassword" class="error-message">{{ formErrors.confirmPassword }}</div>
        </div>

        <div class="form-group">
          <label class="checkbox-container">
            <input v-model="formData.acceptTerms" type="checkbox" class="checkbox-input" :disabled="isRegistering"/>
            <span class="checkbox-custom"></span>
            <span class="checkbox-label">Acepto los <a href="/terms" target="_blank" class="terms-link">términos y condiciones</a> <span class="required">*</span></span>
          </label>
          <div v-if="formErrors.acceptTerms" class="error-message">{{ formErrors.acceptTerms }}</div>
        </div>

        <button type="submit" class="register-button" :disabled="!isFormValid || isRegistering">
          <span v-if="isRegistering" class="spinner"></span>
          {{ isRegistering ? 'Creando cuenta...' : 'Crear Cuenta' }}
        </button>
      </form>

      <div class="login-link">
        <p>¿Ya tienes una cuenta?</p>
        <button @click="goToLogin" class="link">Iniciar sesión</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.register-container {
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

.register-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  padding: 3rem;
  width: 100%;
  max-width: 520px;

  @media (max-width: 768px) {
    padding: 2rem;
    border-radius: 12px;
  }

  @media (max-width: 480px) {
    padding: 1.5rem;
  }
}

.register-header {
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
      background: #721c24;
      color: white;
      border: none;
      border-radius: 6px;
      padding: 8px 16px;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s ease;

      &:hover {
        background: #5a161e;
      }
    }
  }
}


.register-form {
  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;

    @media (max-width: 576px) {
      grid-template-columns: 1fr;
      gap: 0;
    }
  }

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
      margin-left: 2px;
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

  .terms-link {
    color: #d4a574;
    text-decoration: none;
    font-weight: 500;

    &:hover {
      color: #c19653;
      text-decoration: underline;
    }
  }

  .register-button {
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
    gap: 8px;

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

    .spinner {
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top: 2px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
  }
}

.login-link {
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