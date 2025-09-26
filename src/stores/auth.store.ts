/**
 * Store de Autenticación con Pinia
 * Maneja todo el estado relacionado con la autenticación de usuarios
 * Sigue las mejores prácticas de Vue 3 + Composition API + TypeScript
 */

import { ref, computed, readonly } from 'vue'
import { defineStore } from 'pinia'
import { AuthService } from '@/services/auth'
import type {
  User,
  AuthState,
  AuthStatus,
  AuthError,
  RegisterData,
  LoginData,
  EmailConfirmationData,
  LoginOptions,
  RegisterOptions,
  SessionInfo
} from '@/types/auth'

export const useAuthStore = defineStore('auth', () => {
  // ============================================================================
  // ESTADO REACTIVO
  // ============================================================================

  // Usuario actual
  const user = ref<User | null>(null)
  
  // Token de autenticación
  const token = ref<string | null>(null)
  
  // Estado de la autenticación
  const status = ref<AuthStatus>('idle')
  
  // Errores
  const error = ref<AuthError | null>(null)
  
  // Estados de carga específicos
  const isLoading = ref(false)
  const isRegistering = ref(false)
  const isLoggingIn = ref(false)
  const isConfirmingEmail = ref(false)
  
  // Configuración
  const rememberMe = ref(false)

  // Instancia del servicio
  const authService = new AuthService()

  // ============================================================================
  // GETTERS COMPUTADOS
  // ============================================================================

  /**
   * Indica si el usuario está autenticado
   */
  const isAuthenticated = computed(() => {
    return status.value === 'authenticated' && !!user.value && !!token.value
  })

  /**
   * Indica si el usuario NO está autenticado
   */
  const isUnauthenticated = computed(() => {
    return status.value === 'unauthenticated' || (!user.value && !token.value)
  })

  /**
   * Indica si hay alguna operación en curso
   */
  const isAnyLoading = computed(() => {
    return isLoading.value || isRegistering.value || isLoggingIn.value || isConfirmingEmail.value
  })

  /**
   * Información del usuario público (sin datos sensibles)
   */
  const publicUser = computed(() => {
    if (!user.value) return null
    
    const { isActive, lastLogin, ...publicData } = user.value
    return publicData
  })

  /**
   * Indica si el email del usuario está verificado
   */
  const isEmailVerified = computed(() => {
    return user.value?.isEmailVerified ?? false
  })

  /**
   * Rol del usuario actual
   */
  const userRole = computed(() => {
    return user.value?.role ?? null
  })

  /**
   * Indica si el usuario es administrador
   */
  const isAdmin = computed(() => {
    return userRole.value === 'admin'
  })

  /**
   * Indica si el usuario es staff
   */
  const isStaff = computed(() => {
    return userRole.value === 'staff' || userRole.value === 'admin'
  })

  /**
   * Información de la sesión actual
   */
  const sessionInfo = computed((): SessionInfo | null => {
    return authService.getSessionInfo()
  })

  /**
   * Indica si la sesión está próxima a expirar (menos de 5 minutos)
   */
  const isSessionExpiringSoon = computed(() => {
    const session = sessionInfo.value
    if (!session) return false
    
    const now = new Date()
    const timeUntilExpiry = session.expiresAt.getTime() - now.getTime()
    const fiveMinutes = 5 * 60 * 1000 // 5 minutos en milisegundos
    
    return timeUntilExpiry <= fiveMinutes && timeUntilExpiry > 0
  })

  // ============================================================================
  // ACCIONES
  // ============================================================================

  /**
   * Inicializa el store verificando si hay una sesión activa
   */
  async function initialize(): Promise<void> {
    try {
      setLoading(true)
      clearError()

      const storedToken = authService.getStoredToken()
      
      if (!storedToken) {
        status.value = 'unauthenticated'
        return
      }

      // Intentar obtener el usuario actual
      const currentUser = await authService.getCurrentUser()

      if (currentUser && storedToken) {
        user.value = currentUser
        token.value = storedToken
        status.value = 'authenticated'
      } else {
        // Token inválido o usuario no encontrado
        status.value = 'unauthenticated'
        await logout() // Limpiar datos inválidos
      }
    } catch (error: any) {
      console.warn('Error al inicializar autenticación:', error)
      
      // Si es un error de red, mantener el estado actual si hay token
       if (error.type === 'NETWORK_ERROR' && authService.getStoredToken()) {
         status.value = 'authenticated' // Asumir autenticado si hay token y es error de red
         const storedUser = authService.getStoredUser()
         if (storedUser) {
           user.value = storedUser
           token.value = authService.getStoredToken()
         }
       } else {
         status.value = 'unauthenticated'
         await logout()
       }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Registra un nuevo usuario
   */
  async function register(userData: RegisterData, options: RegisterOptions = {}): Promise<void> {
    try {
      setRegistering(true)
      clearError()

      const response = await authService.register(userData)
      
      if (!response) {
        throw new Error('Respuesta de registro inválida')
      }
      
      // Si autoLogin está habilitado, intentar hacer login automáticamente
      if (options.autoLogin && userData.email && userData.password) {
        await login(
          { email: userData.email, password: userData.password },
          { rememberMe: rememberMe.value }
        )
      }

      // Emitir evento personalizado para notificaciones
      window.dispatchEvent(new CustomEvent('auth:registered', { 
        detail: { user: response.user, message: response.message }
      }))

    } catch (error: any) {
      console.error('Error en registro:', error)
      
      // Asegurar que el estado se limpia en caso de error
      user.value = null
      token.value = null
      status.value = 'unauthenticated'
      
      handleError(error)
      throw error
    } finally {
      setRegistering(false)
    }
  }

  /**
   * Inicia sesión de usuario
   */
  async function login(loginData: LoginData, options: LoginOptions = {}): Promise<void> {
    try {
      setLoggingIn(true)
      clearError()

      const shouldRemember = options.rememberMe ?? rememberMe.value
      const response = await authService.login(loginData, shouldRemember)

      if (!response || !response.user || !response.token) {
        throw new Error('Respuesta de login inválida')
      }

      // Actualizar estado
      user.value = response.user
      token.value = response.token
      status.value = 'authenticated'
      rememberMe.value = shouldRemember

      // Emitir evento personalizado
      window.dispatchEvent(new CustomEvent('auth:login', { 
        detail: { user: response.user }
      }))

    } catch (error: any) {
      console.error('Error en login:', error)
      
      // Asegurar que el estado se limpia en caso de error
      user.value = null
      token.value = null
      status.value = 'unauthenticated'
      
      handleError(error)
      throw error
    } finally {
      setLoggingIn(false)
    }
  }

  /**
   * Confirma el email del usuario
   */
  async function confirmEmail(confirmationData: EmailConfirmationData): Promise<void> {
    try {
      setConfirmingEmail(true)
      clearError()

      const response = await authService.confirmEmail(confirmationData)

      // Si hay un usuario logueado, actualizar su estado de verificación
      if (user.value) {
        user.value.isEmailVerified = true
      }

      // Emitir evento personalizado
      window.dispatchEvent(new CustomEvent('auth:emailConfirmed', { 
        detail: { message: response.message }
      }))

    } catch (error: any) {
      handleError(error)
      throw error
    } finally {
      setConfirmingEmail(false)
    }
  }

  /**
   * Cierra la sesión del usuario
   */
  async function logout(): Promise<void> {
    try {
      setLoading(true)
      clearError()

      // Intentar logout en el servidor, pero no fallar si hay error de red
      try {
        await authService.logout()
      } catch (error: any) {
        console.warn('Error al cerrar sesión en el servidor:', error)
        // Si es un error de red, continuar con el logout local
        if (error.type !== 'NETWORK_ERROR') {
          console.error('Error inesperado en logout:', error)
        }
      }

    } catch (error: any) {
      console.warn('Error general en logout:', error)
      // Continuar con el logout local incluso si falla
    } finally {
      // Siempre limpiar estado local, independientemente de errores
      user.value = null
      token.value = null
      status.value = 'unauthenticated'
      rememberMe.value = false
      
      // Limpiar también el almacenamiento local
      try {
        authService.clearStoredData()
      } catch (error) {
        console.warn('Error al limpiar datos almacenados:', error)
      }
      
      // Emitir evento personalizado
      window.dispatchEvent(new CustomEvent('auth:logout'))
      
      setLoading(false)
    }
  }

  /**
   * Refresca la información del usuario actual
   */
  async function refreshUser(): Promise<void> {
    if (!isAuthenticated.value) return

    try {
      setLoading(true)
      const currentUser = await authService.getCurrentUser()
      
      if (currentUser) {
        user.value = currentUser
      } else {
        await logout()
      }
    } catch (error) {
      console.warn('Error al refrescar usuario:', error)
      await logout()
    } finally {
      setLoading(false)
    }
  }

  // ============================================================================
  // MÉTODOS DE UTILIDAD
  // ============================================================================

  /**
   * Establece el estado de carga general
   */
  function setLoading(loading: boolean): void {
    isLoading.value = loading
  }

  /**
   * Establece el estado de registro
   */
  function setRegistering(registering: boolean): void {
    isRegistering.value = registering
  }

  /**
   * Establece el estado de login
   */
  function setLoggingIn(loggingIn: boolean): void {
    isLoggingIn.value = loggingIn
  }

  /**
   * Establece el estado de confirmación de email
   */
  function setConfirmingEmail(confirming: boolean): void {
    isConfirmingEmail.value = confirming
  }

  /**
   * Limpia el error actual
   */
  function clearError(): void {
    error.value = null
  }

  /**
   * Maneja errores de autenticación
   */
  function handleError(authError: AuthError): void {
    error.value = authError
    status.value = 'error'

    // Emitir evento personalizado para manejo global de errores
    window.dispatchEvent(new CustomEvent('auth:error', { 
      detail: authError
    }))
  }

  /**
   * Establece la preferencia de "recordarme"
   */
  function setRememberMe(remember: boolean): void {
    rememberMe.value = remember
  }

  /**
   * Verifica si el usuario tiene un rol específico
   */
  function hasRole(role: string): boolean {
    return user.value?.role === role
  }

  /**
   * Verifica si el usuario tiene alguno de los roles especificados
   */
  function hasAnyRole(roles: string[]): boolean {
    return user.value ? roles.includes(user.value.role) : false
  }

  // ============================================================================
  // RETORNO DEL STORE
  // ============================================================================

  return {
    // Estado (readonly para evitar mutaciones directas)
    user: readonly(user),
    token: readonly(token),
    status: readonly(status),
    error: readonly(error),
    isLoading: readonly(isLoading),
    isRegistering: readonly(isRegistering),
    isLoggingIn: readonly(isLoggingIn),
    isConfirmingEmail: readonly(isConfirmingEmail),
    rememberMe: readonly(rememberMe),

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

    // Acciones
    initialize,
    register,
    login,
    confirmEmail,
    logout,
    refreshUser,
    setLoading,
    setRegistering,
    setLoggingIn,
    setConfirmingEmail,
    clearError,
    handleError,
    setRememberMe,
    hasRole,
    hasAnyRole
  }
})