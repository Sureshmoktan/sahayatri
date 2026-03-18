// instead of typing "User not found" in 10 different files
export const MESSAGES = {
  // Auth
  LOGIN_SUCCESS: "Login successful",
  LOGOUT_SUCCESS: "Logged out successfully",
  INVALID_CREDENTIALS: "Invalid credentials",
  EMAIL_NOT_VERIFIED: "Email not verified. Please complete signup.",
  TOKEN_EXPIRED: "Session expired. Please login again.",
  INVALID_TOKEN: "Invalid token. Please login.",
  NO_TOKEN: "No token provided. Please login.",

  // User
  USER_NOT_FOUND: "User not found",
  USER_UPDATED: "User updated successfully",
  USER_DELETED: "User deleted successfully",
  UNAUTHORIZED: "You are not authorized to do this",

  // Workshop
  WORKSHOP_NOT_FOUND: "Workshop not found",
  WORKSHOP_CREATED: "Workshop created successfully",
  WORKSHOP_UPDATED: "Workshop updated successfully",
  WORKSHOP_DELETED: "Workshop deleted successfully",

  // General
  SERVER_ERROR: "Server error",
  NOT_FOUND: "Resource not found",
};
