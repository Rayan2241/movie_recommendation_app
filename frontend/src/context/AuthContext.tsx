import React, { createContext, useContext, useReducer, useEffect } from "react";
import type { User } from "../types";
import { authAPI, favoritesAPI } from "../services/api";
import { ERROR_MESSAGES } from "../Constants/messages";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  favorites: number[];
  favoritesLoaded: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  addFavorite: (movieId: number) => Promise<void>;
  removeFavorite: (movieId: number) => Promise<void>;
  isFavorite: (movieId: number) => boolean;
  fetchFavorites: () => Promise<void>;
}

type AuthAction =
  | { type: "AUTH_START" }
  | { type: "AUTH_SUCCESS"; payload: { user: User; token: string } }
  | { type: "AUTH_FAILURE"; payload: string }
  | { type: "LOGOUT" }
  | { type: "CLEAR_ERROR" }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_FAVORITES"; payload: number[] }
  | { type: "FAVORITES_LOADED" }
  | { type: "ADD_FAVORITE"; payload: number }
  | { type: "REMOVE_FAVORITE"; payload: number };

const initialState: AuthState = {
  user: null,
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  isLoading: false,
  isAuthenticated: false,
  error: null,
  favorites: [],
  favoritesLoaded: false,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "AUTH_START":
      return { ...state, isLoading: true, error: null };
    case "AUTH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        favorites: action.payload.user.favorites || [],
        favoritesLoaded: true,
      };
    case "AUTH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload,
        favorites: [],
        favoritesLoaded: true,
      };
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        favorites: [],
        favoritesLoaded: false,
      };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_FAVORITES":
      return { ...state, favorites: action.payload, favoritesLoaded: true };
    case "FAVORITES_LOADED":
      return { ...state, favoritesLoaded: true };
    case "ADD_FAVORITE":
      return {
        ...state,
        favorites: state.favorites.includes(action.payload)
          ? state.favorites
          : [...state.favorites, action.payload],
      };
    case "REMOVE_FAVORITE":
      return {
        ...state,
        favorites: state.favorites.filter((id) => id !== action.payload),
      };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      const userJson = localStorage.getItem("user");

      if (token && userJson) {
        try {
          dispatch({ type: "SET_LOADING", payload: true });
          const user = JSON.parse(userJson);

          const response = await authAPI.getMe();
          if (response.success && response.user) {
            const updatedUser = response.user;

            dispatch({
              type: "AUTH_SUCCESS",
              payload: {
                user: updatedUser,
                token,
              },
            });

            localStorage.setItem("user", JSON.stringify(updatedUser));
          } else {
            throw new Error(ERROR_MESSAGES.UNAUTHORIZED);
          }
        } catch (error) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          dispatch({
            type: "AUTH_FAILURE",
            payload:
              error instanceof Error ? error.message : ERROR_MESSAGES.UNAUTHORIZED,
          });
        } finally {
          dispatch({ type: "SET_LOADING", payload: false });
        }
      } else {
        dispatch({ type: "FAVORITES_LOADED" });
      }
    };

    initializeAuth();
  }, []);

  const fetchFavorites = async () => {
    if (!state.isAuthenticated) {
      dispatch({ type: "FAVORITES_LOADED" });
      return;
    }

    try {
      const response = await favoritesAPI.getFavorites();
      if (response.success) {
        const favorites = response.data || [];
        dispatch({ type: "SET_FAVORITES", payload: favorites });

        if (state.user) {
          const updatedUser = { ...state.user, favorites };
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
      } else {
        throw new Error(ERROR_MESSAGES.FETCH_FAVORITES_FAILED);
      }
    } catch (error) {
      console.error(ERROR_MESSAGES.FETCH_FAVORITES_FAILED, error);
      throw error;
    }
  };

  const addFavorite = async (movieId: number) => {
    try {
      const response = await favoritesAPI.addFavorite(movieId);
      if (response.success) {
        dispatch({ type: "ADD_FAVORITE", payload: movieId });

        if (state.user) {
          const updatedFavorites = [...state.favorites, movieId];
          const updatedUser = { ...state.user, favorites: updatedFavorites };
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
      } else {
        throw new Error(ERROR_MESSAGES.FAVORITE_ADD_FAILED);
      }
    } catch (error) {
      console.error(ERROR_MESSAGES.FAVORITE_ADD_FAILED, error);
      throw error;
    }
  };

  const removeFavorite = async (movieId: number) => {
    try {
      const response = await favoritesAPI.removeFavorite(movieId);
      if (response.success) {
        dispatch({ type: "REMOVE_FAVORITE", payload: movieId });

        if (state.user) {
          const updatedFavorites = state.favorites.filter((id) => id !== movieId);
          const updatedUser = { ...state.user, favorites: updatedFavorites };
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
      } else {
        throw new Error(ERROR_MESSAGES.FAVORITE_REMOVE_FAILED);
      }
    } catch (error) {
      console.error(ERROR_MESSAGES.FAVORITE_REMOVE_FAILED, error);
      throw error;
    }
  };

  const isFavorite = (movieId: number): boolean => {
    return state.favorites.includes(movieId);
  };

  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: "AUTH_START" });
      const response = await authAPI.login({ email, password });

      if (response.success && response.token && response.user) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        dispatch({
          type: "AUTH_SUCCESS",
          payload: { user: response.user, token: response.token },
        });
        await fetchFavorites();
      } else {
        throw new Error(response.message || ERROR_MESSAGES.LOGIN_FAILED);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : ERROR_MESSAGES.LOGIN_FAILED;
      dispatch({ type: "AUTH_FAILURE", payload: message });
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      dispatch({ type: "AUTH_START" });
      const response = await authAPI.register({ name, email, password });

      if (response.success && response.token && response.user) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        dispatch({
          type: "AUTH_SUCCESS",
          payload: { user: response.user, token: response.token },
        });
        await fetchFavorites();
      } else {
        throw new Error(response.message || ERROR_MESSAGES.REGISTER_FAILED);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : ERROR_MESSAGES.REGISTER_FAILED;
      dispatch({ type: "AUTH_FAILURE", payload: message });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });
  };

  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  const contextValue: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    clearError,
    addFavorite,
    removeFavorite,
    isFavorite,
    fetchFavorites,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;