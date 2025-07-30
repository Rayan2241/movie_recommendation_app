import axios from "axios";
import type { LoginData, RegisterData, ApiResponse, MovieData, PaginatedMovieResponse } from "../types";
import { ERROR_MESSAGES } from "../Constants/messages";

// API configurations
const TMDB_API_KEY = "a6b8f51e1a0eacdb2ac7688b2bbe65a5";
const TMDB_API_URL = "https://api.themoviedb.org/3";
const API_BASE_URL = "http://localhost:5000/api";

// Axios instances
const tmdbApi = axios.create({
  baseURL: TMDB_API_URL,
  headers: { "Content-Type": "application/json" },
});

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
  withCredentials: true
});

// Request interceptor for auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Enhanced response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle specific status codes
      switch (error.response.status) {
        case 401:
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
          break;
        case 404:
          error.message = "Endpoint not found - check API routes";
          break;
        case 500:
          error.message = "Server error - please try again later";
          break;
      }
      
      // Attach server response message if available
      if (error.response.data?.message) {
        error.message = error.response.data.message;
      }
    }
    return Promise.reject(error);
  }
);

// Enhanced Authentication API (Internal Api calls for user authentication)
export const authAPI = {
  register: async (userData: RegisterData): Promise<ApiResponse> => {
    try {
      const response = await api.post("/auth/register", userData);
      return response.data;
    } catch (error: any) {
      console.error("Register error:", error);
      throw new Error(error.message || ERROR_MESSAGES.REGISTER_FAILED);
    }
  },

  login: async (userData: LoginData): Promise<ApiResponse> => {
    try {
      const response = await api.post("/auth/login", userData);
      return response.data;
    } catch (error: any) {
      console.error("Login error:", error);
      throw new Error(error.message || ERROR_MESSAGES.LOGIN_FAILED);
    }
  },

  getMe: async (): Promise<ApiResponse> => {
    try {
      const response = await api.get("/auth/me");
      return response.data;
    } catch (error: any) {
      console.error("GetMe error:", error);
      throw new Error(error.message || ERROR_MESSAGES.UNAUTHORIZED);
    }
  },

  logout: async (): Promise<ApiResponse> => {
    try {
      const response = await api.post("/auth/logout");
      return response.data;
    } catch (error: any) {
      console.error("Logout error:", error);
      throw new Error(error.message || ERROR_MESSAGES.LOGOUT_FAILED);
    }
  }
};

// Enhanced Favorites API (Internal Api calls for user favorites)
export const favoritesAPI = {
  getFavorites: async (): Promise<ApiResponse> => {
    try {
      const response = await api.get("/favorites");
      return response.data;
    } catch (error: any) {
      console.error("Get Favorites error:", error);
      throw new Error(error.message || ERROR_MESSAGES.FETCH_FAVORITES_FAILED);
    }
  },

  addFavorite: async (movieId: number): Promise<ApiResponse> => {
    try {
      const response = await api.post("/favorites", { movieId });
      return response.data;
    } catch (error: any) {
      console.error("Add Favorite error:", error);
      throw new Error(error.message || ERROR_MESSAGES.FAVORITE_ADD_FAILED);
    }
  },
  
    removeFavorite: async (movieId: number): Promise<ApiResponse> => {
      try {
        const response = await api.delete(`/favorites/${movieId}`); //Note the URL format( (movie ID is passed in the URL))
        return response.data;
      } catch (error) {
        console.error("Remove Favorite error:", error);
        throw new Error(ERROR_MESSAGES.FAVORITE_REMOVE_FAILED);
      }
    },

  checkFavorite: async (movieId: number): Promise<ApiResponse> => {
    try {
      const response = await api.get(`/favorites/check/${movieId}`);
      return response.data;
    } catch (error: any) {
      console.error("Check Favorite error:", error);
      throw new Error(error.message || ERROR_MESSAGES.CHECK_FAVORITE_FAILED);
    }
  }
};

// Updated External API calls with pagination support
export const tmdbAPI = {
  fetchMovies: async (query: string, page: number = 1): Promise<PaginatedMovieResponse> => {
    try {
      const response = await tmdbApi.get("/search/movie", {
        params: { api_key: TMDB_API_KEY, query, page },
      });
      return {
        results: response.data.results,
        page: response.data.page,
        total_pages: response.data.total_pages,
        total_results: response.data.total_results
      };
    } catch (error) {
      console.error("Error fetching movies:", error);
      throw new Error(ERROR_MESSAGES.FETCH_MOVIES);
    }
  },

  fetchMovieDetails: async (movieId: number) => {
    try {
      const response = await tmdbApi.get(`/movie/${movieId}`, {
        params: { api_key: TMDB_API_KEY },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching movie details:", error);
      throw new Error(ERROR_MESSAGES.FETCH_MOVIE_DETAILS);
    }
  },

  // Updated fetchPopularMovies with full pagination support
  fetchPopularMovies: async (page: number = 1): Promise<PaginatedMovieResponse> => {
    try {
      const response = await tmdbApi.get("/movie/popular", {
        params: { api_key: TMDB_API_KEY, page },
      });
      return {
        results: response.data.results,
        page: response.data.page,
        total_pages: response.data.total_pages,
        total_results: response.data.total_results
      };
    } catch (error) {
      console.error("Error fetching popular movies:", error);
      throw new Error(ERROR_MESSAGES.FETCH_POPULAR_MOVIES);
    }
  }
};

export default api;