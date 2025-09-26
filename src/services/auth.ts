import APIBase from './httpBase'
import type {
  RegisterData,
  LoginData,
  EmailConfirmationData,
  AuthResponse,
  RegisterResponse,
  EmailConfirmationResponse,
  User,
  AuthError,
  AuthErrorType,
  TokenPayload,
  SessionInfo,
} from '@/types/auth'

export class AuthService extends APIBase {
  private readonly TOKEN_KEY = 'auth_token'
  private readonly USER_KEY = 'auth_user'
  private readonly REMEMBER_ME_KEY = 'auth_remember_me'

  constructor() {
    super()
  }

  // ============================================================================
  // MÉTODOS PRINCIPALES DE AUTENTICACIÓN
  // ============================================================================

  /**
   * Registra un nuevo usuario
   */
  async register(userData: RegisterData): Promise<RegisterResponse> {
    try {
      this.validateRegisterData(userData)

      const response = await this.post<RegisterResponse>('auth/register', userData)

      if (!response.data) {
        throw this.createAuthError('UNKNOWN_ERROR', 'No se recibió respuesta del servidor')
      }

      return response.data
    } catch (error) {
      throw this.handleAuthError(error, 'register')
    }
  }

  /**
   * Inicia sesión de usuario
   */
  async login(loginData: LoginData, rememberMe = false): Promise<AuthResponse> {
    try {
      this.validateLoginData(loginData)

      const response = await this.post<AuthResponse>('auth/login', loginData)

      if (!response.data) {
        throw this.createAuthError('UNKNOWN_ERROR', 'No se recibió respuesta del servidor')
      }

      // Guardar sesión
      await this.saveSession(response.data, rememberMe)

      return response.data
    } catch (error) {
      throw this.handleAuthError(error, 'login')
    }
  }

  /**
   * Confirma el email del usuario
   */
  async confirmEmail(confirmationData: EmailConfirmationData): Promise<EmailConfirmationResponse> {
    try {
      this.validateEmailConfirmationData(confirmationData)

      const response = await this.post<EmailConfirmationResponse>(
        'auth/confirm-email',
        confirmationData,
      )

      if (!response.data) {
        throw this.createAuthError('UNKNOWN_ERROR', 'No se recibió respuesta del servidor')
      }

      return response.data
    } catch (error) {
      throw this.handleAuthError(error, 'confirmEmail')
    }
  }

  /**
   * Cierra la sesión del usuario
   */
  async logout(): Promise<void> {
    try {
      // Limpiar almacenamiento local
      this.clearSession()

      // Opcional: notificar al servidor (si tienes endpoint de logout)
      // await this.post('/auth/logout')
    } catch (error) {
      // Limpiar sesión incluso si falla la notificación al servidor
      this.clearSession()
      console.warn('Error al cerrar sesión en el servidor:', error)
    }
  }

  /**
   * Obtiene el perfil del usuario actual
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const token = this.getStoredToken()
      if (!token) {
        return null
      }

      // Verificar si el token es válido
      if (!this.isTokenValid(token)) {
        this.clearSession()
        return null
      }

      // Intentar obtener usuario del almacenamiento local primero
      const storedUser = this.getStoredUser()
      if (storedUser) {
        return storedUser
      }

      // Si no hay usuario almacenado, obtenerlo del servidor
      const response = await this.get<{ user: User }>('auth/profile')

      if (response.data?.user) {
        this.saveUser(response.data.user)
        return response.data.user
      }

      return null
    } catch (error) {
      console.warn('Error al obtener usuario actual:', error)
      this.clearSession()
      return null
    }
  }

  // ============================================================================
  // MÉTODOS DE GESTIÓN DE SESIÓN
  // ============================================================================

  /**
   * Guarda la sesión en el almacenamiento local
   */
  private async saveSession(authResponse: AuthResponse, rememberMe: boolean): Promise<void> {
    const storage = rememberMe ? localStorage : sessionStorage

    storage.setItem(this.TOKEN_KEY, authResponse.token)
    storage.setItem(this.USER_KEY, JSON.stringify(authResponse.user))
    localStorage.setItem(this.REMEMBER_ME_KEY, rememberMe.toString())
  }

  /**
   * Limpia la sesión del almacenamiento local
   */
  private clearSession(): void {
    // Limpiar de ambos almacenamientos
    localStorage.removeItem(this.TOKEN_KEY)
    localStorage.removeItem(this.USER_KEY)
    localStorage.removeItem(this.REMEMBER_ME_KEY)
    sessionStorage.removeItem(this.TOKEN_KEY)
    sessionStorage.removeItem(this.USER_KEY)
  }

  /**
   * Obtiene el token almacenado
   */
  getStoredToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY) || sessionStorage.getItem(this.TOKEN_KEY)
  }

  /**
   * Obtiene el usuario almacenado
   */
  private getStoredUser(): User | null {
    try {
      const userStr = localStorage.getItem(this.USER_KEY) || sessionStorage.getItem(this.USER_KEY)
      return userStr ? JSON.parse(userStr) : null
    } catch {
      return null
    }
  }

  /**
   * Guarda el usuario en el almacenamiento
   */
  private saveUser(user: User): void {
    const rememberMe = localStorage.getItem(this.REMEMBER_ME_KEY) === 'true'
    const storage = rememberMe ? localStorage : sessionStorage
    storage.setItem(this.USER_KEY, JSON.stringify(user))
  }

  /**
   * Obtiene información de la sesión actual
   */
  getSessionInfo(): SessionInfo | null {
    const token = this.getStoredToken()
    const user = this.getStoredUser()

    if (!token || !user) {
      return null
    }

    try {
      const payload = this.decodeToken(token)
      return {
        user,
        token,
        expiresAt: new Date(payload.exp * 1000),
        issuedAt: new Date(payload.iat * 1000),
      }
    } catch {
      return null
    }
  }

  // ============================================================================
  // MÉTODOS DE VALIDACIÓN
  // ============================================================================

  /**
   * Valida los datos de registro
   */
  private validateRegisterData(data: RegisterData): void {
    const errors: string[] = []

    if (!data.firstName?.trim()) {
      errors.push('El nombre es requerido')
    }

    if (!data.lastName?.trim()) {
      errors.push('El apellido es requerido')
    }

    if (!data.email?.trim()) {
      errors.push('El email es requerido')
    } else if (!this.isValidEmail(data.email)) {
      errors.push('El formato del email no es válido')
    }

    if (!data.password) {
      errors.push('La contraseña es requerida')
    } else if (data.password.length < 8) {
      errors.push('La contraseña debe tener al menos 8 caracteres')
    }

    if (errors.length > 0) {
      throw this.createAuthError('VALIDATION_ERROR', errors.join(', '))
    }
  }

  /**
   * Valida los datos de login
   */
  private validateLoginData(data: LoginData): void {
    const errors: string[] = []

    if (!data.email?.trim()) {
      errors.push('El email es requerido')
    } else if (!this.isValidEmail(data.email)) {
      errors.push('El formato del email no es válido')
    }

    if (!data.password) {
      errors.push('La contraseña es requerida')
    }

    if (errors.length > 0) {
      throw this.createAuthError('VALIDATION_ERROR', errors.join(', '))
    }
  }

  /**
   * Valida los datos de confirmación de email
   */
  private validateEmailConfirmationData(data: EmailConfirmationData): void {
    if (!data.token?.trim()) {
      throw this.createAuthError('VALIDATION_ERROR', 'El token de verificación es requerido')
    }
  }

  /**
   * Valida formato de email
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // ============================================================================
  // MÉTODOS DE UTILIDAD PARA TOKENS
  // ============================================================================

  /**
   * Verifica si un token es válido (no expirado)
   */
  private isTokenValid(token: string): boolean {
    try {
      const payload = this.decodeToken(token)
      const now = Math.floor(Date.now() / 1000)
      return payload.exp > now
    } catch {
      return false
    }
  }

  /**
   * Decodifica un token JWT
   */
  private decodeToken(token: string): TokenPayload {
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join(''),
      )
      return JSON.parse(jsonPayload)
    } catch (error) {
      throw new Error('Token inválido')
    }
  }

  // ============================================================================
  // MÉTODOS DE MANEJO DE ERRORES
  // ============================================================================

  /**
   * Maneja errores de autenticación
   */
  private handleAuthError(error: any, operation: string): AuthError {
    console.error(`Error en ${operation}:`, error)

    // Si ya es un AuthError, devolverlo
    if (error.type) {
      return error
    }

    // Manejar errores HTTP
    if (error.response) {
      const status = error.response.status
      const message = error.response.data?.message || error.message

      switch (status) {
        case 400:
          return this.createAuthError('VALIDATION_ERROR', message)
        case 401:
          return this.createAuthError('AUTHENTICATION_ERROR', message)
        case 403:
          return this.createAuthError('AUTHORIZATION_ERROR', message)
        case 404:
          return this.createAuthError('USER_NOT_FOUND', message)
        default:
          return this.createAuthError('UNKNOWN_ERROR', message)
      }
    }

    // Manejar errores de red
    if (error.code === 'NETWORK_ERROR' || !error.response) {
      return this.createAuthError(
        'NETWORK_ERROR',
        'Error de conexión. Verifica tu conexión a internet.',
      )
    }

    // Error desconocido
    return this.createAuthError('UNKNOWN_ERROR', error.message || 'Ha ocurrido un error inesperado')
  }

  /**
   * Crea un error de autenticación estructurado
   */
  private createAuthError(type: AuthErrorType, message: string, field?: string): AuthError {
    return {
      type,
      message,
      field,
      code: type,
      details: {},
    }
  }
}
