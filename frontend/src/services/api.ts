import axios from "axios"
import type { LoginData, RegisterData, ApiResponse } from "../types"

const API_BASE_URL = "http://localhost:5000/api"

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

export const authAPI = {
  register: async (userData: RegisterData): Promise<ApiResponse> => {
    const response = await api.post("/auth/register", userData)
    return response.data
  },

  login: async (userData: LoginData): Promise<ApiResponse> => {
    const response = await api.post("/auth/login", userData)
    return response.data
  },

  getMe: async (): Promise<ApiResponse> => {
    const response = await api.get("/auth/me")
    return response.data
  },

  logout: async (): Promise<ApiResponse> => {
    const response = await api.post("/auth/logout")
    return response.data
  },
}

export default api
