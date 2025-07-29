// User and Authentication related interfaces

// src/types/index.ts
export interface User {
  id: string;
  name: string;
  email: string;
  favorites?: number[]; // TMDB IDs are typically numbers
}
export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}
// In your types.ts/index.ts
export interface EnhancedMovieData extends MovieData {
  isFavorite: boolean;
}

// In your types file
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  user?: User;
  token?: string;
  favorites?: number[]; // Add this line
  errors?: any[];
}
export interface MovieData {
  id: number;
  title: string;
  poster_path?: string; // Optional as not all movies might have posters
  release_date: string;
  vote_average: number;
  overview: string;
}

export interface MovieDetailsData {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  runtime: number;
  genres: { id: number; name: string }[];
  cast: { name: string; character: string }[];
}

export interface MovieApiResponse {
  results: MovieData[];
  total_pages: number;
  total_results: number;
}
