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

// Estados de validación
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

// Manejo del envío del formulario
const handleSubmit = async () => {
  clearError()
  
  if (!validateForm()) {
    return
  }

  try {
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
    router.push(redirectTo.value)
  } catch (err) {
    console.error('Error en registro:', err)
  }
}

// Formatear teléfono
const formatPhone = (value: string) => {
  const numbers = value.replace(/\D/g, '')
  if (numbers.length <= 10) {
    return numbers.replace(/(\d{4})(\d{3})(\d{3})/, '$1-$2-$3')
  }
  return value
}

// Navegar al login
const goToLogin = () => {
  router.push({ name: 'login', query: { redirect: redirectTo.value } })
}

// Verificar si ya está autenticado
onMounted(() => {
  if (isAuthenticated) {
    router.push(redirectTo.value)
  }
})
</script>

<template>
  <div class="register-view">
    <div class="register-container">
      <!-- Header -->
      <div class="register-header">
        <div class="brand-logo">
          <h1>Nicole Pastry Arts</h1>
          <p>Crea tu cuenta para continuar</p>
        </div>
      </div>

      <!-- Formulario de registro -->
      <div class="register-form-container">
        <form @submit.prevent="handleSubmit" class="register-form">
          <h2 class="form-title">Registro</h2>
          
          <!-- Error general -->
          <div v-if="error" class="error-message">
            <svg class="error-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            <span>{{ error }}</span>
          </div>

          <!-- Nombre y Apellido -->
          <div class="form-row">
            <div class="form-group">
              <label for="firstName" class="form-label">Nombre *</label>
              <input
                id="firstName"
                v-model="formData.firstName"
                type="text"
                class="form-input"
                :class="{ 'form-input--error': formErrors.firstName }"
                placeholder="Tu nombre"
                autocomplete="given-name"
              />
              <span v-if="formErrors.firstName" class="form-error">{{ formErrors.firstName }}</span>
            </div>

            <div class="form-group">
              <label for="lastName" class="form-label">Apellido *</label>
              <input
                id="lastName"
                v-model="formData.lastName"
                type="text"
                class="form-input"
                :class="{ 'form-input--error': formErrors.lastName }"
                placeholder="Tu apellido"
                autocomplete="family-name"
              />
              <span v-if="formErrors.lastName" class="form-error">{{ formErrors.lastName }}</span>
            </div>
          </div>

          <!-- Email -->
          <div class="form-group">
            <label for="email" class="form-label">Email *</label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              class="form-input"
              :class="{ 'form-input--error': formErrors.email }"
              placeholder="tu@email.com"
              autocomplete="email"
            />
            <span v-if="formErrors.email" class="form-error">{{ formErrors.email }}</span>
          </div>

          <!-- Teléfono -->
          <div class="form-group">
            <label for="phone" class="form-label">Teléfono *</label>
            <input
              id="phone"
              v-model="formData.phone"
              type="tel"
              class="form-input"
              :class="{ 'form-input--error': formErrors.phone }"
              placeholder="0999-999-999"
              autocomplete="tel"
              @input="formData.phone = formatPhone(($event.target as HTMLInputElement)?.value || '')"
            />
            <span v-if="formErrors.phone" class="form-error">{{ formErrors.phone }}</span>
          </div>

          <!-- Contraseña -->
          <div class="form-group">
            <label for="password" class="form-label">Contraseña *</label>
            <div class="password-input-container">
              <input
                id="password"
                v-model="formData.password"
                :type="showPassword ? 'text' : 'password'"
                class="form-input"
                :class="{ 'form-input--error': formErrors.password }"
                placeholder="Mínimo 8 caracteres"
                autocomplete="new-password"
              />
              <button
                type="button"
                class="password-toggle"
                @click="showPassword = !showPassword"
              >
                <svg v-if="showPassword" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                </svg>
              </button>
            </div>
            <span v-if="formErrors.password" class="form-error">{{ formErrors.password }}</span>
          </div>

          <!-- Confirmar contraseña -->
          <div class="form-group">
            <label for="confirmPassword" class="form-label">Confirmar contraseña *</label>
            <div class="password-input-container">
              <input
                id="confirmPassword"
                v-model="formData.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                class="form-input"
                :class="{ 'form-input--error': formErrors.confirmPassword }"
                placeholder="Repite tu contraseña"
                autocomplete="new-password"
              />
              <button
                type="button"
                class="password-toggle"
                @click="showConfirmPassword = !showConfirmPassword"
              >
                <svg v-if="showConfirmPassword" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                </svg>
              </button>
            </div>
            <span v-if="formErrors.confirmPassword" class="form-error">{{ formErrors.confirmPassword }}</span>
          </div>

          <!-- Términos y condiciones -->
          <div class="form-group">
            <label class="checkbox-label">
              <input
                v-model="formData.acceptTerms"
                type="checkbox"
                class="checkbox-input"
                :class="{ 'checkbox-input--error': formErrors.acceptTerms }"
              />
              <span class="checkbox-custom"></span>
              <span class="checkbox-text">
                Acepto los <a href="/terms" target="_blank" class="link">términos y condiciones</a> *
              </span>
            </label>
            <span v-if="formErrors.acceptTerms" class="form-error">{{ formErrors.acceptTerms }}</span>
          </div>

          <!-- Marketing -->
          <div class="form-group">
            <label class="checkbox-label">
              <input
                v-model="formData.acceptMarketing"
                type="checkbox"
                class="checkbox-input"
              />
              <span class="checkbox-custom"></span>
              <span class="checkbox-text">
                Quiero recibir ofertas y novedades por email
              </span>
            </label>
          </div>

          <!-- Botón de envío -->
          <button
            type="submit"
            class="submit-button"
            :disabled="isRegistering"
          >
            <div v-if="isRegistering" class="button-spinner">
              <svg class="spinner-icon" viewBox="0 0 24 24">
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
            <span>{{ isRegistering ? 'Creando cuenta...' : 'Crear cuenta' }}</span>
          </button>

          <!-- Link al login -->
          <div class="form-footer">
            <p>
              ¿Ya tienes cuenta? 
              <button type="button" @click="goToLogin" class="link-button">
                Inicia sesión
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.register-view {
  min-height: 100vh;
  background: linear-gradient(135deg, $purple-primary 0%, $purple-hover 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.register-container {
  width: 100%;
  max-width: 480px;
  background: $white;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba($text-dark, 0.1);
  overflow: hidden;
}

.register-header {
  background: linear-gradient(135deg, $purple-primary 0%, $purple-hover 100%);
  padding: 2rem;
  text-align: center;
  color: $white;

  h1 {
    @include heading-font(700);
    font-size: 1.8rem;
    margin-bottom: 0.5rem;
  }

  p {
    @include interface-font(400);
    opacity: 0.9;
    font-size: 1rem;
  }
}

.register-form-container {
  padding: 2rem;
}

.form-title {
  @include heading-font(600);
  font-size: 1.5rem;
  color: $text-dark;
  margin-bottom: 1.5rem;
  text-align: center;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: rgba($error, 0.1);
  color: $error;
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;

  .error-icon {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 0;
  }
}

.form-group {
  margin-bottom: 1rem;
}

.form-label {
  @include interface-font(500);
  display: block;
  margin-bottom: 0.5rem;
  color: $text-dark;
  font-size: 0.9rem;
}

.form-input {
  @include interface-font(400);
  width: 100%;
  padding: 0.75rem;
  border: 2px solid $border-light;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: $white;

  &:focus {
    outline: none;
    border-color: $purple-primary;
    box-shadow: 0 0 0 3px rgba($purple-primary, 0.1);
  }

  &--error {
    border-color: $error;
    
    &:focus {
      border-color: $error;
      box-shadow: 0 0 0 3px rgba($error, 0.1);
    }
  }

  &::placeholder {
    color: $text-light;
  }
}

.password-input-container {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: $text-light;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: color 0.3s ease;

  &:hover {
    color: $text-dark;
  }

  svg {
    width: 20px;
    height: 20px;
  }
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  cursor: pointer;
  line-height: 1.4;
}

.checkbox-input {
  position: absolute;
  opacity: 0;
  pointer-events: none;

  &:checked + .checkbox-custom {
    background-color: $purple-primary;
    border-color: $purple-primary;

    &::after {
      opacity: 1;
      transform: scale(1);
    }
  }

  &--error + .checkbox-custom {
    border-color: $error;
  }
}

.checkbox-custom {
  width: 20px;
  height: 20px;
  border: 2px solid $border-light;
  border-radius: 4px;
  background-color: $white;
  position: relative;
  transition: all 0.3s ease;
  flex-shrink: 0;
  margin-top: 0.1rem;

  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 6px;
    width: 6px;
    height: 10px;
    border: solid $white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg) scale(0);
    opacity: 0;
    transition: all 0.2s ease;
  }
}

.checkbox-text {
  @include interface-font(400);
  color: $text-dark;
  font-size: 0.9rem;
}

.form-error {
  @include interface-font(400);
  display: block;
  color: $error;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

.submit-button {
  @include interface-font(600);
  width: 100%;
  background: linear-gradient(135deg, $purple-primary 0%, $purple-hover 100%);
  color: $white;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba($purple-primary, 0.3);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
}

.button-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner-icon {
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;

  circle {
    animation: dash 1.5s ease-in-out infinite;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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

.form-footer {
  text-align: center;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid $border-light;

  p {
    @include interface-font(400);
    color: $text-light;
    font-size: 0.9rem;
  }
}

.link {
  color: $purple-primary;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
}

.link-button {
  background: none;
  border: none;
  color: $purple-primary;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  font-size: inherit;

  &:hover {
    text-decoration: underline;
  }
}

// Responsive
@media (max-width: 640px) {
  .register-view {
    padding: 0.5rem;
  }

  .register-container {
    border-radius: 12px;
  }

  .register-header {
    padding: 1.5rem;

    h1 {
      font-size: 1.5rem;
    }
  }

  .register-form-container {
    padding: 1.5rem;
  }
}
</style>