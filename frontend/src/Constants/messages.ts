export const ERROR_MESSAGES = {
  // General Errors
  GENERAL_ERROR: "Something went wrong. Please try again.",
  UNAUTHORIZED: "Unauthorized access. Please login again.",

  // Auth Errors
  REGISTER_FAILED: "Registration failed. Please try again.",
  LOGIN_FAILED: "Login failed. Please check your credentials.",
  LOGOUT_FAILED: "Logout failed. Please try again.",

  // Validation Errors - Name
  NAME_REQUIRED: "Name is required.",
  NAME_TOO_SHORT: "Name must be at least 2 characters.",

  // Validation Errors - Email
  EMAIL_REQUIRED: "Email is required.",
  EMAIL_INVALID: "Email is invalid.",
  EMAIL_EXISTS: "Email address already exists.",

  // Validation Errors - Password
  PASSWORD_REQUIRED: "Password is required.",
  PASSWORD_TOO_SHORT: "Password must be at least 6 characters.",
  CONFIRM_PASSWORD_REQUIRED: "Please confirm your password.",
  PASSWORD_MISMATCH: "Passwords do not match.",

  // Movie Fetching Errors
  FETCH_MOVIES: "Failed to fetch movies.",
  FETCH_POPULAR_MOVIES: "Failed to fetch popular movies.",
  FETCH_UPCOMING_MOVIES: "Failed to fetch upcoming movies.",
  FETCH_MOVIE_DETAILS: "Failed to fetch movie details.",
  INVALID_MOVIE_DATA: "Invalid movie data provided.",
  NO_RESULTS_FOUND: "No results found for your search.",

  // Favorites Errors
  FAVORITE_ADD_FAILED: "Failed to add movie to favorites. Please try again.",
  FAVORITE_REMOVE_FAILED: "Failed to remove movie from favorites. Please try again.",
  FETCH_FAVORITES_FAILED: "Failed to fetch favorites. Please try again.",
  CHECK_FAVORITE_FAILED: "Failed to check if movie is a favorite. Please try again.",
};

export const UI_TEXT = {
  APP_TITLE: "Movie Recommendation App",
  WELCOME: "Welcome",
  LOGOUT: "Logout",
  POPULAR_MOVIES: "Popular Movies",
  HAVE_A_NICE_DAY: "Have a nice day!",
};
