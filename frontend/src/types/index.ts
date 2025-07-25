export interface User {
  id: string
  name: string
  email: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
}

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
}

export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  user?: User
  token?: string
  errors?: any[]
}
