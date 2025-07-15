// Importing necessary types from express
import type { Request, Response } from "express";  

// Importing validationResult function from express-validator for handling validation errors
import { validationResult } from "express-validator";  

// Importing the User model to interact with the MongoDB User collection
import User from "../models/User";  

// Importing a utility function to generate JSON Web Tokens (JWT) for user authentication
import { generateToken } from "../utils/jwt";  

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

/**
 * Registers a new user in the system.
 * 
 * This function performs the following actions:
 * 1. Validates the incoming request data (name, email, password).
 * 2. Checks if a user already exists with the provided email.
 * 3. Creates a new user in the database if no existing user is found.
 * 4. Generates a JWT token for the new user.
 * 5. Sends the user data and token in the response if registration is successful.
 * 
 * @param {Request} req - The HTTP request object
 * @param {Response} res - The HTTP response object
 */
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

    // Generate JWT token for the new user
    const token = generateToken(String(user._id));

    // Respond with success message and user data
    res.status(CREATED).json({
      success: true,
      message: USER_REGISTERED,  // Using the constant message
      token,
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

/**
 * Logs a user into the system.
 * 
 * This function performs the following actions:
 * 1. Validates the incoming request data (email and password).
 * 2. Checks if the user exists with the provided email.
 * 3. Compares the password with the stored hash.
 * 4. Generates a JWT token if credentials are valid.
 * 5. Responds with the user data and token if login is successful.
 * 
 * @param {Request} req - The HTTP request object
 * @param {Response} res - The HTTP response object
 */
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

    // Generate token for the user
    const token = generateToken(String(user._id));

    // Respond with success message and user data
    res.status(OK).json({
      success: true,
      message: LOGIN_SUCCESS,  // Using the constant message
      token,
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

/**
 * Returns the authenticated user's information.
 * 
 * This function retrieves the user details from the request (after authentication)
 * and responds with the user's data.
 * 
 * @param {AuthRequest} req - The authenticated HTTP request object
 * @param {Response} res - The HTTP response object
 */
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

/**
 * Logs out the user.
 * 
 * This function simply sends a success message indicating the user has logged out.
 * 
 * @param {Request} req - The HTTP request object
 * @param {Response} res - The HTTP response object
 */
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
