// frontend/src/context/AuthContext.tsx

"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"
// Make sure these types are correctly defined in your ../types file
import type { User } from "../types/index"
import { authAPI } from "../services/api"


// Define the full state interface that will be part of the context value
// This should match the structure of 'state' in your reducer, PLUS the functions
interface AuthStateContext {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null; // error is part of the state, so it should be here
}

// Define the interface for the context value that 'useAuth' will return
// This merges the state properties with the action functions
interface AuthContextType extends AuthStateContext { // Extend the new state context
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  // error is already in AuthStateContext
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// ... rest of your AuthAction and authReducer remain the same ...

type AuthAction =
  | { type: "AUTH_START" }
  | { type: "AUTH_SUCCESS"; payload: { user: User; token: string } }
  | { type: "AUTH_FAILURE"; payload: string }
  | { type: "LOGOUT" }
  | { type: "CLEAR_ERROR" }
  | { type: "SET_LOADING"; payload: boolean }

// Changed initialState to directly use AuthStateContext
const initialState: AuthStateContext = {
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem("token") : null, // Safer access for localStorage
  isLoading: false,
  isAuthenticated: false,
  error: null,
}

const authReducer = (state: AuthStateContext, action: AuthAction): AuthStateContext => {
  switch (action.type) {
    case "AUTH_START":
      return {
        ...state,
        isLoading: true,
        error: null,
      }
    case "AUTH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      }
    case "AUTH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload,
      }
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        error: null,
      }
    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      }
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      }
    default:
      return state
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      // Check if localStorage is available (for server-side rendering or build environments)
      const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null
      if (token) {
        try {
          dispatch({ type: "SET_LOADING", payload: true })
          const response = await authAPI.getMe()
          if (response.success && response.user) {
            dispatch({
              type: "AUTH_SUCCESS",
              payload: { user: response.user, token },
            })
          } else {
            // Only remove from localStorage if it's available
            if (typeof window !== 'undefined') {
              localStorage.removeItem("token")
              localStorage.removeItem("user")
            }
          }
        } catch (error) {
          // Only remove from localStorage if it's available
          if (typeof window !== 'undefined') {
            localStorage.removeItem("token")
            localStorage.removeItem("user")
          }
          // Optionally dispatch an error here if you want to show it in UI
          // dispatch({ type: "AUTH_FAILURE", payload: "Failed to re-authenticate" });
        } finally {
          dispatch({ type: "SET_LOADING", payload: false })
        }
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: "AUTH_START" })
      const response = await authAPI.login({ email, password })

      if (response.success && response.user && response.token) {
        if (typeof window !== 'undefined') {
          localStorage.setItem("token", response.token)
          localStorage.setItem("user", JSON.stringify(response.user))
        }
        dispatch({
          type: "AUTH_SUCCESS",
          payload: { user: response.user, token: response.token },
        })
      } else {
        throw new Error(response.message || "Login failed")
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Login failed"
      dispatch({ type: "AUTH_FAILURE", payload: errorMessage })
      throw error
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      dispatch({ type: "AUTH_START" })
      const response = await authAPI.register({ name, email, password })

      if (response.success && response.user && response.token) {
        if (typeof window !== 'undefined') {
          localStorage.setItem("token", response.token)
          localStorage.setItem("user", JSON.stringify(response.user))
        }
        dispatch({
          type: "AUTH_SUCCESS",
          payload: { user: response.user, token: response.token },
        })
      } else {
        throw new Error(response.message || "Registration failed")
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Registration failed"
      dispatch({ type: "AUTH_FAILURE", payload: errorMessage })
      throw error
    }
  }

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
    }
    dispatch({ type: "LOGOUT" })
  }

  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" })
  }

  // The value provided to the context should include all state properties and functions
  const value: AuthContextType = {
    ...state, // Spread all properties from AuthStateContext
    login,
    register,
    logout,
    clearError,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}