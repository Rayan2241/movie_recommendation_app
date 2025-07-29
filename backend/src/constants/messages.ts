// constants/messages.ts

// ======================
// User Authentication Messages
// ======================
export const USER_EXISTS = "User already exists with this email";
export const INVALID_CREDENTIALS = "Invalid credentials";
export const USER_NOT_FOUND = "User not found";
export const USER_NOT_AUTHENTICATED = "User not authenticated";
export const NO_TOKEN_PROVIDED = "Not authorized to access this route (No token provided)";
export const INVALID_TOKEN = "Not authorized to access this route (Invalid token)";
export const NAME_REQUIRED = "Please provide a name";
export const NAME_MAX_LENGTH = "Name cannot be more than 50 characters";
export const NAME_LENGTH = "Name must be 2-50 characters";
export const EMAIL_REQUIRED = "Please provide an email";
export const EMAIL_INVALID = "Please provide a valid email";
export const EMAIL_VALID = "Valid email required";
export const PASSWORD_REQUIRED = "Please provide a password";
export const PASSWORD_MIN_LENGTH = "Password must be at least 6 characters";
export const PASSWORD_LENGTH = "Password must be at least 6 characters";

// ======================
// Success Messages
// ======================
export const USER_REGISTERED = "User registered successfully";
export const LOGIN_SUCCESS = "Login successful";
export const LOGOUT_SUCCESS = "Logout successful";
export const FAVORITE_ADDED = "Favorite movie added successfully";
export const FAVORITE_REMOVED = "Favorite movie removed successfully";
export const FAVORITES_FETCHED = "Favorites fetched successfully";
export const HEALTH_CHECK = "healthy";
export const API_WELCOME = "Movie API Server";

// ======================
// Error Messages
// ======================
export const REGISTRATION_ERROR = "Server error during registration";
export const LOGIN_ERROR = "Server error during login";
export const VALIDATION_FAILED = "Validation failed";
export const VALIDATION_ERROR = "Validation Error";
export const SERVER_ERROR = "Server error";
export const AUTHENTICATION_ERROR = "Server Error during authentication process";
export const SERVER_ERROR_LOGOUT = "Server error during logout";
export const SHUTDOWN_MESSAGE = "SIGTERM received - shutting down";
export const UNHANDLED_REJECTION = "Unhandled Rejection";

// ======================
// Favorites Messages
// ======================
export const FAVORITE_CHECK_ERROR = "Failed to check favorite status";
export const FAVORITE_ADD_ERROR = "Error adding favorite";
export const FAVORITE_REMOVE_ERROR = "Error removing favorite";
export const FAVORITES_FETCH_ERROR = "Error fetching favorites";
export const MOVIE_ID_REQUIRED = "Movie ID is required";
export const MOVIE_ALREADY_FAVORITE = "Movie is already in your favorites";
export const MOVIE_ID_VALID = "Movie ID must be a positive integer";

// ======================
// Server Messages
// ======================
export const SERVER_STARTED = "Server running on port";
export const ENDPOINT_NOT_FOUND = "Endpoint not found";