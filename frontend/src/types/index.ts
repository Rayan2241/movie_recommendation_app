// User and Authentication related interfaces

export interface User {
  id: string;
  name: string;
  email: string;
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

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T; // generic field to hold different types of data
  user?: User;
  token?: string;
  errors?: any[];
}

// Movie related interfaces

export interface MovieData {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
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
