import axios from "axios";
import type { LoginData, RegisterData, ApiResponse } from "../types";

// TMDb API configuration
const TMDB_API_KEY = "a6b8f51e1a0eacdb2ac7688b2bbe65a5"; // Your TMDb API key
const TMDB_API_URL = "https://api.themoviedb.org/3"; // TMDb API base URL

// Backend API configuration (Authentication)
const API_BASE_URL = "http://localhost:5000/api";

// Create Axios instances for both APIs (TMDb and Backend API)
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

// Add token to requests if available (for authentication)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors (for authentication)
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

// Authentication functions
export const authAPI = {
  register: async (userData: RegisterData): Promise<ApiResponse> => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  login: async (userData: LoginData): Promise<ApiResponse> => {
    const response = await api.post("/auth/login", userData);
    return response.data;
  },

  getMe: async (): Promise<ApiResponse> => {
    const response = await api.get("/auth/me");
    return response.data;
  },

  logout: async (): Promise<ApiResponse> => {
    const response = await api.post("/auth/logout");
    return response.data;
  },
};

// Movie-related functions using TMDb API

// Fetch movies based on search query
export const fetchMovies = async (query: string, page: number = 1) => {
  try {
    const response = await tmdbApi.get("/search/movie", {
      params: {
        api_key: TMDB_API_KEY,
        query,
        page,
      },
    });
    return response.data.results; // Return the list of movies
  } catch (error) {
    console.error("Error fetching movies:", error);
    throw new Error("Failed to fetch movies.");
  }
};

// Fetch movie details based on movie ID
export const fetchMovieDetails = async (movieId: number) => {
  try {
    const response = await tmdbApi.get(`/movie/${movieId}`, {
      params: {
        api_key: TMDB_API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    throw new Error("Failed to fetch movie details.");
  }
};

// Fetch popular movies
export const fetchPopularMovies = async (page: number = 1) => {
  try {
    const response = await tmdbApi.get("/movie/popular", {
      params: {
        api_key: TMDB_API_KEY,
        page,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    throw new Error("Failed to fetch popular movies.");
  }
};

// Fetch upcoming movies
export const fetchUpcomingMovies = async (page: number = 1) => {
  try {
    const response = await tmdbApi.get("/movie/upcoming", {
      params: {
        api_key: TMDB_API_KEY,
        page,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error("Error fetching upcoming movies:", error);
    throw new Error("Failed to fetch upcoming movies.");
  }
};

export default api;
