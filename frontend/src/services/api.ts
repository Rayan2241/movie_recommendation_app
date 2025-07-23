import axios from "axios";
import type { LoginData, RegisterData, ApiResponse } from "../types";
import { ERROR_MESSAGES } from "../Constants/messages"; // ✅ Corrected path and casing

// TMDb API configuration
const TMDB_API_KEY = "a6b8f51e1a0eacdb2ac7688b2bbe65a5";
const TMDB_API_URL = "https://api.themoviedb.org/3";

// Backend API configuration
const API_BASE_URL = "http://localhost:5000/api";

// Axios instances
const tmdbApi = axios.create({
  baseURL: TMDB_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to headers if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle unauthorized responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  register: async (userData: RegisterData): Promise<ApiResponse> => {
    try {
      const response = await api.post("/auth/register", userData);
      return response.data;
    } catch (error) {
      console.error("Register error:", error);
      throw new Error(ERROR_MESSAGES.REGISTER_FAILED);
    }
  },

  login: async (userData: LoginData): Promise<ApiResponse> => {
    try {
      const response = await api.post("/auth/login", userData);
      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw new Error(ERROR_MESSAGES.LOGIN_FAILED);
    }
  },

  getMe: async (): Promise<ApiResponse> => {
    try {
      const response = await api.get("/auth/me");
      return response.data;
    } catch (error) {
      console.error("GetMe error:", error);
      throw new Error(ERROR_MESSAGES.UNAUTHORIZED);
    }
  },

  logout: async (): Promise<ApiResponse> => {
    try {
      const response = await api.post("/auth/logout");
      return response.data;
    } catch (error) {
      console.error("Logout error:", error);
      throw new Error(ERROR_MESSAGES.LOGOUT_FAILED);
    }
  },
};

// TMDb API calls

export const fetchMovies = async (query: string, page: number = 1) => {
  try {
    const response = await tmdbApi.get("/search/movie", {
      params: { api_key: TMDB_API_KEY, query, page },
    });
    return response.data.results;
  } catch (error) {
    console.error("Error fetching movies:", error);
    throw new Error(ERROR_MESSAGES.FETCH_MOVIES);
  }
};

export const fetchMovieDetails = async (movieId: number) => {
  try {
    const response = await tmdbApi.get(`/movie/${movieId}`, {
      params: { api_key: TMDB_API_KEY },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    throw new Error(ERROR_MESSAGES.FETCH_MOVIE_DETAILS);
  }
};

export const fetchPopularMovies = async (page: number = 1) => {
  try {
    const response = await tmdbApi.get("/movie/popular", {
      params: { api_key: TMDB_API_KEY, page },
    });
    return response.data.results;
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    throw new Error(ERROR_MESSAGES.FETCH_POPULAR_MOVIES);
  }
};

export const fetchUpcomingMovies = async (page: number = 1) => {
  try {
    const response = await tmdbApi.get("/movie/upcoming", {
      params: { api_key: TMDB_API_KEY, page },
    });
    return response.data.results;
  } catch (error) {
    console.error("Error fetching upcoming movies:", error);
    throw new Error(ERROR_MESSAGES.FETCH_UPCOMING_MOVIES);
  }
};

export default api;
