// User and Authentication related interfaces
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

// Movie related interfaces
export interface MovieData {
  id: number;
  title: string;
  poster_path?: string; // Optional as not all movies might have posters
  release_date: string;
  vote_average: number;
  overview: string;
}

export interface EnhancedMovieData extends MovieData {
  isFavorite: boolean;
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

// Pagination related interfaces
export interface PaginationInfo {
  page: number;
  total_pages: number;
  total_results: number;
}

export interface PaginatedMovieResponse extends PaginationInfo {
  results: MovieData[];
}

export interface MovieApiResponse {
  results: MovieData[];
  total_pages: number;
  total_results: number;
}

// API Response interface
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  user?: User;
  token?: string;
  favorites?: number[]; // Add this line
  errors?: any[];
}