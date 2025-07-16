// Importing necessary types from express
import type { Request, Response } from "express";  

// Importing validationResult function from express-validator for handling validation errors
import { validationResult } from "express-validator";  

// Importing the User model to interact with the MongoDB User collection
import User from "../models/User";  

// Importing a utility function to generate JSON Web Tokens (JWT) for user authentication
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";  

// Importing a utility function to verify the refresh token
import { verifyRefreshToken } from "../utils/jwt";

// Importing the custom AuthRequest type that extends Request with user data after authentication
import type { AuthRequest } from "../types";  

// Importing constants from the constants/messages file
import { 
  USER_EXISTS, 
  INVALID_CREDENTIALS, 
  REGISTRATION_ERROR, 
  LOGIN_ERROR, 
  USER_REGISTERED, 
  LOGIN_SUCCESS, 
  LOGOUT_SUCCESS 
} from "../constants/messages";  // Importing messages from the constants file

// Importing status codes from the constants/httpStatusCodes file
import { 
  OK, 
  CREATED, 
  BAD_REQUEST, 
  UNAUTHORIZED, 
  INTERNAL_SERVER_ERROR 
} from "../constants/http";  // Importing HTTP status codes

// Register a new user in the system
export const register = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);  // Check for validation errors
    if (!errors.isEmpty()) {
      return res.status(BAD_REQUEST).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { name, email, password } = req.body;

    // Check if user already exists with the provided email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(BAD_REQUEST).json({
        success: false,
        message: USER_EXISTS,  // Using the constant message
      });
    }

    // Create the new user in the database
    const user = await User.create({
      name,
      email,
      password,
    });

    // Generate access and refresh tokens for the new user
    const accessToken = generateAccessToken(String(user._id));
    const refreshToken = generateRefreshToken(String(user._id));

    // Respond with success message, user data, and both tokens
    res.status(CREATED).json({
      success: true,
      message: USER_REGISTERED,  // Using the constant message
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: any) {
    console.error("Register error:", error);
    res.status(INTERNAL_SERVER_ERROR).json({
      success: false,
      message: REGISTRATION_ERROR,  // Using the constant message
    });
  }
};

// Log a user into the system
export const login = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);  // Check for validation errors
    if (!errors.isEmpty()) {
      return res.status(BAD_REQUEST).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    // Find the user by email and get password hash
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(UNAUTHORIZED).json({
        success: false,
        message: INVALID_CREDENTIALS,  // Using the constant message
      });
    }

    // Compare the password with the stored hash
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(UNAUTHORIZED).json({
        success: false,
        message: INVALID_CREDENTIALS,  // Using the constant message
      });
    }

    // Generate access and refresh tokens for the user
    const accessToken = generateAccessToken(String(user._id));
    const refreshToken = generateRefreshToken(String(user._id));

    // Respond with success message, user data, and both tokens
    res.status(OK).json({
      success: true,
      message: LOGIN_SUCCESS,  // Using the constant message
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(INTERNAL_SERVER_ERROR).json({
      success: false,
      message: LOGIN_ERROR,  // Using the constant message
    });
  }
};

// Returns the authenticated user's information
export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;  // Access the authenticated user

    res.status(OK).json({
      success: true,
      user: {
        id: user?._id,
        name: user?.name,
        email: user?.email,
      },
    });
  } catch (error: any) {
    console.error("Get me error:", error);
    res.status(INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Server error",  // Default message in case of failure
    });
  }
};

// Log out the user
export const logout = async (req: Request, res: Response) => {
  try {
    res.status(OK).json({
      success: true,
      message: LOGOUT_SUCCESS,  // Using the constant message
    });
  } catch (error: any) {
    console.error("Logout error:", error);
    res.status(INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Server error during logout",  // Default message in case of failure
    });
  }
};

// Refresh access token using the refresh token
export const refreshAccessToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(BAD_REQUEST).json({
        success: false,
        message: "Refresh token is required",
      });
    }

    // Verify the refresh token
    const decoded = verifyRefreshToken(refreshToken);

    if (!decoded) {
      return res.status(UNAUTHORIZED).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    // Generate a new access token
    const accessToken = generateAccessToken(decoded.id);

    res.status(OK).json({
      success: true,
      accessToken,
    });
  } catch (error: any) {
    console.error("Refresh token error:", error);
    res.status(INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to refresh access token",
    });
  }
};
