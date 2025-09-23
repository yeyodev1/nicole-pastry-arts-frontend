/**
 * Tipos TypeScript para el sistema de autenticación
 * Basado en la estructura del backend y las mejores prácticas de Vue 3 + TypeScript
 */

// ============================================================================
// INTERFACES PRINCIPALES
// ============================================================================

/**
 * Interfaz del usuario completa
 */
export interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  role: UserRole
  isEmailVerified: boolean
  isActive: boolean
  lastLogin?: Date
  createdAt: Date
  updatedAt: Date
}

/**
 * Datos para registro de usuario
 */
export interface RegisterData {
  firstName: string
  lastName: string
  email: string
  password: string
  phone?: string
}

/**
 * Datos para login de usuario
 */
export interface LoginData {
  email: string
  password: string
}

/**
 * Datos para confirmación de email
 */
export interface EmailConfirmationData {
  token: string
}

/**
 * Respuesta de autenticación del servidor
 */
export interface AuthResponse {
  message: string
  user: User
  token: string
}

/**
 * Respuesta de registro del servidor
 */
export interface RegisterResponse {
  message: string
  user: User
  verificationToken: string
}

/**
 * Respuesta de confirmación de email
 */
export interface EmailConfirmationResponse {
  message: string
}

// ============================================================================
// ENUMS Y TIPOS AUXILIARES
// ============================================================================

/**
 * Roles de usuario disponibles
 */
export type UserRole = 'customer' | 'admin' | 'staff'

/**
 * Estados de autenticación
 */
export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated' | 'error'

/**
 * Tipos de errores de autenticación
 */
export type AuthErrorType = 
  | 'VALIDATION_ERROR'
  | 'AUTHENTICATION_ERROR'
  | 'AUTHORIZATION_ERROR'
  | 'EMAIL_NOT_VERIFIED'
  | 'USER_NOT_FOUND'
  | 'INVALID_TOKEN'
  | 'NETWORK_ERROR'
  | 'UNKNOWN_ERROR'

// ============================================================================
// INTERFACES DE ERROR
// ============================================================================

/**
 * Error de autenticación estructurado
 */
export interface AuthError {
  type: AuthErrorType
  message: string
  field?: string
  code?: string
  details?: Record<string, any>
}

/**
 * Respuesta de error del servidor
 */
export interface AuthErrorResponse {
  error: string
  message: string
  statusCode: number
  timestamp: string
}

// ============================================================================
// INTERFACES DEL STORE
// ============================================================================

/**
 * Estado del store de autenticación
 */
export interface AuthState {
  // Usuario actual
  user: User | null
  
  // Token de autenticación
  token: string | null
  
  // Estado de la autenticación
  status: AuthStatus
  
  // Errores
  error: AuthError | null
  
  // Estados de carga específicos
  isLoading: boolean
  isRegistering: boolean
  isLoggingIn: boolean
  isConfirmingEmail: boolean
  
  // Configuración
  rememberMe: boolean
}

// ============================================================================
// INTERFACES DE VALIDACIÓN
// ============================================================================

/**
 * Reglas de validación para formularios
 */
export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  message: string
}

/**
 * Errores de validación de formularios
 */
export interface ValidationErrors {
  firstName?: string
  lastName?: string
  email?: string
  password?: string
  phone?: string
  token?: string
}

/**
 * Estado de validación de formularios
 */
export interface FormValidationState {
  isValid: boolean
  errors: ValidationErrors
  touched: Record<string, boolean>
}

// ============================================================================
// INTERFACES DE CONFIGURACIÓN
// ============================================================================

/**
 * Configuración del servicio de autenticación
 */
export interface AuthServiceConfig {
  baseURL: string
  endpoints: {
    register: string
    login: string
    confirmEmail: string
    logout: string
    refreshToken: string
    profile: string
  }
  tokenKey: string
  userKey: string
}

/**
 * Opciones para el login
 */
export interface LoginOptions {
  rememberMe?: boolean
  redirectTo?: string
}

/**
 * Opciones para el registro
 */
export interface RegisterOptions {
  autoLogin?: boolean
  redirectTo?: string
}

// ============================================================================
// TIPOS UTILITARIOS
// ============================================================================

/**
 * Usuario público (sin información sensible)
 */
export type PublicUser = Omit<User, 'isActive' | 'lastLogin'>

/**
 * Datos del usuario para actualización de perfil
 */
export type UserUpdateData = Partial<Pick<User, 'firstName' | 'lastName' | 'phone'>>

/**
 * Payload del token JWT decodificado
 */
export interface TokenPayload {
  userId: string
  iat: number
  exp: number
}

/**
 * Información de sesión
 */
export interface SessionInfo {
  user: User
  token: string
  expiresAt: Date
  issuedAt: Date
}