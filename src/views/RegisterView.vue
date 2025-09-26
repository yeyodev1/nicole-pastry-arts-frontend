<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import type { RegisterData } from '@/types/auth'

// Tipo extendido para el formulario de registro
interface RegisterFormData extends RegisterData {
  confirmPassword: string
  acceptTerms: boolean
  acceptMarketing: boolean
}

const router = useRouter()
const route = useRoute()
const { handleRegister, isRegistering, error, clearError, isAuthenticated } = useAuth()

// Estado del formulario
const formData = ref<RegisterFormData>({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false,
  acceptMarketing: false
})

// Estados adicionales
const formErrors = ref<Record<string, string>>({})
const showPassword = ref(false)
const showConfirmPassword = ref(false)

// Redirección después del registro
const redirectTo = computed(() => {
  return route.query.redirect as string || '/products'
})

// Validaciones
const validateForm = (): boolean => {
  formErrors.value = {}
  let isValid = true

  // Nombre
  if (!formData.value.firstName.trim()) {
    formErrors.value.firstName = 'El nombre es requerido'
    isValid = false
  }

  // Apellido
  if (!formData.value.lastName.trim()) {
    formErrors.value.lastName = 'El apellido es requerido'
    isValid = false
  }

  // Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!formData.value.email.trim()) {
    formErrors.value.email = 'El email es requerido'
    isValid = false
  } else if (!emailRegex.test(formData.value.email)) {
    formErrors.value.email = 'El email no es válido'
    isValid = false
  }

  // Teléfono
  const phoneRegex = /^[0-9]{10}$/
  if (!formData.value.phone?.trim()) {
    formErrors.value.phone = 'El teléfono es requerido'
    isValid = false
  } else if (!phoneRegex.test(formData.value.phone.replace(/\D/g, ''))) {
    formErrors.value.phone = 'El teléfono debe tener 10 dígitos'
    isValid = false
  }

  // Contraseña
  if (!formData.value.password) {
    formErrors.value.password = 'La contraseña es requerida'
    isValid = false
  } else if (formData.value.password.length < 8) {
    formErrors.value.password = 'La contraseña debe tener al menos 8 caracteres'
    isValid = false
  }

  // Confirmar contraseña
  if (!formData.value.confirmPassword) {
    formErrors.value.confirmPassword = 'Confirma tu contraseña'
    isValid = false
  } else if (formData.value.password !== formData.value.confirmPassword) {
    formErrors.value.confirmPassword = 'Las contraseñas no coinciden'
    isValid = false
  }

  // Términos y condiciones
  if (!formData.value.acceptTerms) {
    formErrors.value.acceptTerms = 'Debes aceptar los términos y condiciones'
    isValid = false
  }

  return isValid
}

// Validación individual de campos
const validateField = (fieldName: string) => {
  switch (fieldName) {
    case 'firstName':
      if (!formData.value.firstName.trim()) {
        formErrors.value.firstName = 'El nombre es requerido'
      } else {
        delete formErrors.value.firstName
      }
      break
    case 'lastName':
      if (!formData.value.lastName.trim()) {
        formErrors.value.lastName = 'El apellido es requerido'
      } else {
        delete formErrors.value.lastName
      }
      break
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
    case 'phone':
      const phoneRegex = /^[0-9]{10}$/
      if (!formData.value.phone?.trim()) {
        formErrors.value.phone = 'El teléfono es requerido'
      } else if (!phoneRegex.test(formData.value.phone.replace(/\D/g, ''))) {
        formErrors.value.phone = 'El teléfono debe tener 10 dígitos'
      } else {
        delete formErrors.value.phone
      }
      break
    case 'password':
      if (!formData.value.password) {
        formErrors.value.password = 'La contraseña es requerida'
      } else if (formData.value.password.length < 8) {
        formErrors.value.password = 'La contraseña debe tener al menos 8 caracteres'
      } else {
        delete formErrors.value.password
      }
      break
    case 'confirmPassword':
      if (!formData.value.confirmPassword) {
        formErrors.value.confirmPassword = 'Confirma tu contraseña'
      } else if (formData.value.password !== formData.value.confirmPassword) {
        formErrors.value.confirmPassword = 'Las contraseñas no coinciden'
      } else {
        delete formErrors.value.confirmPassword
      }
      break
  }
}

// Formatear teléfono
const formatPhone = (value: string) => {
  const numbers = value.replace(/\D/g, '')
  if (numbers.length <= 10) {
    return numbers.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')
  }
  return value
}

// Formatear número de teléfono en tiempo real
const formatPhoneNumber = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target) {
    const formatted = formatPhone(target.value)
    formData.value.phone = formatted
  }
}

// Computed para validar si el formulario es válido
const isFormValid = computed(() => {
  return formData.value.firstName.trim() &&
         formData.value.lastName.trim() &&
         formData.value.email.trim() &&
         formData.value.phone?.trim() &&
         formData.value.password &&
         formData.value.confirmPassword &&
         formData.value.password === formData.value.confirmPassword &&
         formData.value.acceptTerms &&
         Object.keys(formErrors.value).length === 0
})

// Manejo del envío del formulario
const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  try {
    clearError()
    
    // Extraer solo los datos necesarios para el registro
    const registerData: RegisterData = {
      firstName: formData.value.firstName,
      lastName: formData.value.lastName,
      email: formData.value.email,
      password: formData.value.password,
      phone: formData.value.phone
    }
    
    await handleRegister(registerData)
    
    // Redireccionar después del registro exitoso
    await router.push(redirectTo.value)
  } catch (err) {
    console.error('Error en registro:', err)
  }
}

// Navegación al login
const goToLogin = () => {
  const currentRedirect = route.query.redirect as string
  const loginRoute = currentRedirect 
    ? `/login?redirect=${encodeURIComponent(currentRedirect)}`
    : '/login'
  router.push(loginRoute)
}

// Verificar si ya está autenticado al montar
onMounted(() => {
  if (isAuthenticated) {
    router.push(redirectTo.value)
  }
})
</script>

<template>
  <div class="register-container">
    <div class="register-card">
      <div class="register-header">
        <h1 class="form-title">Crear Cuenta</h1>
        <p class="form-subtitle">Únete a Nicole Pastry Arts</p>
      </div>

      <!-- Error general -->
      <div v-if="error" class="error-banner">
        <div class="error-content">
          <svg class="error-icon" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
          <span>{{ error.message || 'Error al crear la cuenta' }}</span>
        </div>
      </div>

      <form 
        @submit.prevent="handleSubmit" 
        class="register-form"
        :class="{ 'form-loading': isRegistering }"
      >
        <!-- Nombre y Apellido -->
        <div class="form-row">
          <div class="form-group">
            <label for="firstName" class="form-label">
              Nombre <span class="required">*</span>
            </label>
            <input
              id="firstName"
              v-model="formData.firstName"
              type="text"
              class="form-input"
              :class="{ 'error': formErrors.firstName }"
              placeholder="Tu nombre"
              autocomplete="given-name"
              :disabled="isRegistering"
              @blur="validateField('firstName')"
              @input="clearError"
            />
            <div v-if="formErrors.firstName" class="error-message">
              <svg class="error-icon" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              {{ formErrors.firstName }}
            </div>
          </div>

          <div class="form-group">
            <label for="lastName" class="form-label">
              Apellido <span class="required">*</span>
            </label>
            <input
              id="lastName"
              v-model="formData.lastName"
              type="text"
              class="form-input"
              :class="{ 'error': formErrors.lastName }"
              placeholder="Tu apellido"
              autocomplete="family-name"
              :disabled="isRegistering"
              @blur="validateField('lastName')"
              @input="clearError"
            />
            <div v-if="formErrors.lastName" class="error-message">
              <svg class="error-icon" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              {{ formErrors.lastName }}
            </div>
          </div>
        </div>

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
            :disabled="isRegistering"
            @blur="validateField('email')"
            @input="clearError"
          />
          <div v-if="formErrors.email" class="error-message">
            <svg class="error-icon" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            {{ formErrors.email }}
          </div>
        </div>

        <!-- Teléfono -->
        <div class="form-group">
          <label for="phone" class="form-label">
            Teléfono <span class="required">*</span>
          </label>
          <input
            id="phone"
            v-model="formData.phone"
            type="tel"
            class="form-input"
            :class="{ 'error': formErrors.phone }"
            placeholder="(123) 456-7890"
            autocomplete="tel"
            :disabled="isRegistering"
            @input="formatPhoneNumber"
            @blur="validateField('phone')"
          />
          <div v-if="formErrors.phone" class="error-message">
            <svg class="error-icon" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            {{ formErrors.phone }}
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
              autocomplete="new-password"
              :disabled="isRegistering"
              @blur="validateField('password')"
              @input="clearError"
            />
            <button
              type="button"
              class="password-toggle"
              :disabled="isRegistering"
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

        <!-- Confirmar Contraseña -->
        <div class="form-group">
          <label for="confirmPassword" class="form-label">
            Confirmar Contraseña <span class="required">*</span>
          </label>
          <div class="password-input-container">
            <input
              id="confirmPassword"
              v-model="formData.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              class="form-input password-input"
              :class="{ 'error': formErrors.confirmPassword }"
              placeholder="Confirma tu contraseña"
              autocomplete="new-password"
              :disabled="isRegistering"
              @blur="validateField('confirmPassword')"
              @input="clearError"
            />
            <button
              type="button"
              class="password-toggle"
              :disabled="isRegistering"
              @click="showConfirmPassword = !showConfirmPassword"
              :aria-label="showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
            >
              <svg v-if="showConfirmPassword" class="toggle-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
              <svg v-else class="toggle-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </div>
          <div v-if="formErrors.confirmPassword" class="error-message">
            <svg class="error-icon" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            {{ formErrors.confirmPassword }}
          </div>
        </div>

        <!-- Términos y condiciones -->
        <div class="form-group">
          <label class="checkbox-container">
            <input
              v-model="formData.acceptTerms"
              type="checkbox"
              class="checkbox-input"
              :disabled="isRegistering"
            />
            <span class="checkbox-custom"></span>
            <span class="checkbox-label">
              Acepto los <a href="#" class="terms-link">términos y condiciones</a> <span class="required">*</span>
            </span>
          </label>
          <div v-if="formErrors.acceptTerms" class="error-message">
            <svg class="error-icon" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            {{ formErrors.acceptTerms }}
          </div>
        </div>

        <!-- Marketing -->
        <div class="form-group">
          <label class="checkbox-container">
            <input
              v-model="formData.acceptMarketing"
              type="checkbox"
              class="checkbox-input"
              :disabled="isRegistering"
            />
            <span class="checkbox-custom"></span>
            <span class="checkbox-label">Acepto recibir comunicaciones de marketing</span>
          </label>
        </div>

        <!-- Botón de envío -->
        <button
          type="submit"
          class="register-button"
          :class="{ 'loading': isRegistering }"
          :disabled="!isFormValid || isRegistering"
        >
          <div class="button-content">
            <div v-if="isRegistering" class="loading-spinner">
              <div class="spinner"></div>
            </div>
            <span class="button-text">
              {{ isRegistering ? 'Creando cuenta...' : 'Crear Cuenta' }}
            </span>
          </div>
        </button>
      </form>

      <!-- Enlace al login -->
      <div class="login-link">
        <p>¿Ya tienes una cuenta?</p>
        <button @click="goToLogin" class="link">
          Iniciar sesión
        </button>
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

.register-form {
  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1.5rem;

    @media (max-width: 480px) {
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

      .required {
        color: #dc3545;
      }
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

// Estilos para el loading mejorado
.form-loading {
  opacity: 0.7;
  pointer-events: none;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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