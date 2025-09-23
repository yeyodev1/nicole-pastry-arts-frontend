/**
 * Composable useAuth
 * Encapsula toda la lógica de autenticación para uso en componentes Vue
 * Proporciona una API limpia y reutilizable para el manejo de autenticación
 */

import { computed, onMounted, watch, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import type {
  User,
  RegisterData,
  LoginData,
  EmailConfirmationData,
  AuthError,
  LoginOptions,
  RegisterOptions,
  ValidationErrors,
  FormValidationState
} from '@/types/auth'

// ============================================================================
// COMPOSABLE PRINCIPAL
// ============================================================================

/**
 * Composable principal de autenticación
 */
export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()

  // Estado reactivo del store
  const {
    user,
    token,
    status,
    error,
    isLoading,
    isRegistering,
    isLoggingIn,
    isConfirmingEmail,
    rememberMe,
    isAuthenticated,
    isUnauthenticated,
    isAnyLoading,
    publicUser,
    isEmailVerified,
    userRole,
    isAdmin,
    isStaff,
    sessionInfo,
    isSessionExpiringSoon
  } = authStore

  // Métodos del store
  const {
    initialize,
    register,
    login,
    confirmEmail,
    logout,
    refreshUser,
    clearError,
    setRememberMe,
    hasRole,
    hasAnyRole
  } = authStore

  /**
   * Inicializa la autenticación al montar
   */
  async function initializeAuth(): Promise<void> {
    await initialize()
  }

  /**
   * Maneja el registro con opciones adicionales
   */
  async function handleRegister(
    userData: RegisterData, 
    options: RegisterOptions = {}
  ): Promise<void> {
    await register(userData, options)
  }

  /**
   * Maneja el login con opciones adicionales
   */
  async function handleLogin(
    loginData: LoginData, 
    options: LoginOptions = {}
  ): Promise<void> {
    await login(loginData, options)
  }

  /**
   * Maneja la confirmación de email
   */
  async function handleEmailConfirmation(confirmationData: EmailConfirmationData): Promise<void> {
    await confirmEmail(confirmationData)
  }

  /**
   * Maneja el logout con redirección opcional
   */
  async function handleLogout(redirectTo?: string): Promise<void> {
    await logout()
    
    if (redirectTo) {
      await router.push(redirectTo)
    }
  }

  /**
   * Refresca el usuario actual
   */
  async function handleRefreshUser(): Promise<void> {
    await refreshUser()
  }

  return {
    // Estado
    user,
    token,
    status,
    error,
    isLoading,
    isRegistering,
    isLoggingIn,
    isConfirmingEmail,
    rememberMe,
    
    // Getters computados
    isAuthenticated,
    isUnauthenticated,
    isAnyLoading,
    publicUser,
    isEmailVerified,
    userRole,
    isAdmin,
    isStaff,
    sessionInfo,
    isSessionExpiringSoon,
    
    // Métodos
    initializeAuth,
    handleRegister,
    handleLogin,
    handleEmailConfirmation,
    handleLogout,
    handleRefreshUser,
    clearError,
    setRememberMe,
    hasRole,
    hasAnyRole
  }
}

// ============================================================================
// COMPOSABLES ESPECIALIZADOS
// ============================================================================

/**
 * Composable para inicialización automática de autenticación
 */
export function useAuthWithAutoInit() {
  const auth = useAuth()

  onMounted(async () => {
    await auth.initializeAuth()
  })

  return auth
}

/**
 * Composable para validación de formularios de autenticación
 */
export function useAuthValidation() {
  const validationErrors = ref<ValidationErrors>({})
  const touchedFields = ref<Record<string, boolean>>({})

  /**
   * Valida los datos de registro
   */
  function validateRegisterData(data: RegisterData): FormValidationState {
    const errors: ValidationErrors = {}
    let isValid = true

    // Validar nombre
    if (!data.firstName?.trim()) {
      errors.firstName = 'El nombre es requerido'
      isValid = false
    } else if (data.firstName.length < 2) {
      errors.firstName = 'El nombre debe tener al menos 2 caracteres'
      isValid = false
    }

    // Validar apellido
    if (!data.lastName?.trim()) {
      errors.lastName = 'El apellido es requerido'
      isValid = false
    } else if (data.lastName.length < 2) {
      errors.lastName = 'El apellido debe tener al menos 2 caracteres'
      isValid = false
    }

    // Validar email
    if (!data.email?.trim()) {
      errors.email = 'El email es requerido'
      isValid = false
    } else if (!isValidEmail(data.email)) {
      errors.email = 'El formato del email no es válido'
      isValid = false
    }

    // Validar contraseña
    if (!data.password) {
      errors.password = 'La contraseña es requerida'
      isValid = false
    } else {
      const passwordValidation = validatePassword(data.password)
      if (!passwordValidation.isValid) {
        errors.password = passwordValidation.message
        isValid = false
      }
    }

    // Validar teléfono (opcional)
    if (data.phone && !isValidPhone(data.phone)) {
      errors.phone = 'El formato del teléfono no es válido'
      isValid = false
    }

    validationErrors.value = errors
    return {
      isValid,
      errors,
      touched: touchedFields.value
    }
  }

  /**
   * Valida los datos de login
   */
  function validateLoginData(data: LoginData): FormValidationState {
    const errors: ValidationErrors = {}
    let isValid = true

    // Validar email
    if (!data.email?.trim()) {
      errors.email = 'El email es requerido'
      isValid = false
    } else if (!isValidEmail(data.email)) {
      errors.email = 'El formato del email no es válido'
      isValid = false
    }

    // Validar contraseña
    if (!data.password) {
      errors.password = 'La contraseña es requerida'
      isValid = false
    }

    validationErrors.value = errors
    return {
      isValid,
      errors,
      touched: touchedFields.value
    }
  }

  /**
   * Valida el token de confirmación de email
   */
  function validateEmailConfirmationData(data: EmailConfirmationData): FormValidationState {
    const errors: ValidationErrors = {}
    let isValid = true

    if (!data.token?.trim()) {
      errors.token = 'El token de verificación es requerido'
      isValid = false
    }

    validationErrors.value = errors
    return {
      isValid,
      errors,
      touched: touchedFields.value
    }
  }

  /**
   * Marca un campo como tocado
   */
  function touchField(fieldName: string): void {
    touchedFields.value[fieldName] = true
  }

  /**
   * Limpia los errores de validación
   */
  function clearValidationErrors(): void {
    validationErrors.value = {}
    touchedFields.value = {}
  }

  /**
   * Obtiene el error de un campo específico
   */
  function getFieldError(fieldName: keyof ValidationErrors): string | undefined {
    return validationErrors.value[fieldName]
  }

  /**
   * Verifica si un campo tiene error
   */
  function hasFieldError(fieldName: keyof ValidationErrors): boolean {
    return !!validationErrors.value[fieldName]
  }

  return {
    validationErrors,
    touchedFields,
    validateRegisterData,
    validateLoginData,
    validateEmailConfirmationData,
    touchField,
    clearValidationErrors,
    getFieldError,
    hasFieldError
  }
}

/**
 * Composable para protección de rutas
 */
export function useAuthGuard() {
  const { isAuthenticated, isEmailVerified, userRole } = useAuth()
  const router = useRouter()

  /**
   * Requiere autenticación para acceder
   */
  function requireAuth(redirectTo = '/login'): boolean {
    if (!isAuthenticated) {
      router.push(redirectTo)
      return false
    }
    return true
  }

  /**
   * Requiere email verificado para acceder
   */
  function requireEmailVerified(redirectTo = '/verify-email'): boolean {
    if (!requireAuth()) return false
    
    if (!isEmailVerified) {
      router.push(redirectTo)
      return false
    }
    return true
  }

  /**
   * Requiere un rol específico para acceder
   */
  function requireRole(role: string, redirectTo = '/unauthorized'): boolean {
    if (!requireEmailVerified()) return false
    
    if (userRole !== role) {
      router.push(redirectTo)
      return false
    }
    return true
  }

  /**
   * Requiere alguno de los roles especificados
   */
  function requireAnyRole(roles: string[], redirectTo = '/unauthorized'): boolean {
    if (!requireEmailVerified()) return false
    
    if (!userRole || !roles.includes(userRole)) {
      router.push(redirectTo)
      return false
    }
    return true
  }

  /**
   * Requiere ser administrador
   */
  function requireAdmin(redirectTo = '/unauthorized'): boolean {
    return requireRole('admin', redirectTo)
  }

  /**
   * Requiere ser staff (admin o staff)
   */
  function requireStaff(redirectTo = '/unauthorized'): boolean {
    return requireAnyRole(['admin', 'staff'], redirectTo)
  }

  return {
    requireAuth,
    requireEmailVerified,
    requireRole,
    requireAnyRole,
    requireAdmin,
    requireStaff
  }
}

/**
 * Composable para manejo de eventos de autenticación
 */
export function useAuthEvents() {
  const eventListeners = ref<Record<string, EventListener>>({})

  /**
   * Escucha eventos de autenticación
   */
  function onAuthEvent(eventType: string, callback: (event: CustomEvent) => void): void {
    const listener = (event: Event) => callback(event as CustomEvent)
    eventListeners.value[eventType] = listener
    window.addEventListener(`auth:${eventType}`, listener)
  }

  /**
   * Remueve un listener de evento
   */
  function offAuthEvent(eventType: string): void {
    const listener = eventListeners.value[eventType]
    if (listener) {
      window.removeEventListener(`auth:${eventType}`, listener)
      delete eventListeners.value[eventType]
    }
  }

  /**
   * Limpia todos los listeners
   */
  function clearAuthEventListeners(): void {
    Object.keys(eventListeners.value).forEach(eventType => {
      offAuthEvent(eventType)
    })
  }

  return {
    onAuthEvent,
    offAuthEvent,
    clearAuthEventListeners
  }
}

// ============================================================================
// FUNCIONES DE UTILIDAD
// ============================================================================

/**
 * Valida formato de email
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Valida formato de teléfono
 */
function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))
}

/**
 * Valida fortaleza de contraseña
 */
function validatePassword(password: string): { isValid: boolean; message: string } {
  if (password.length < 8) {
    return { isValid: false, message: 'La contraseña debe tener al menos 8 caracteres' }
  }

  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'La contraseña debe contener al menos una letra mayúscula' }
  }

  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: 'La contraseña debe contener al menos una letra minúscula' }
  }

  if (!/\d/.test(password)) {
    return { isValid: false, message: 'La contraseña debe contener al menos un número' }
  }

  return { isValid: true, message: 'Contraseña válida' }
}