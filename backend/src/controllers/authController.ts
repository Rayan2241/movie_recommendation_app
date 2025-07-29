// Importing necessary types from express
import type { Request, Response } from "express";  
import { validationResult } from "express-validator";  
import User from "../models/User";  
import { generateToken } from "../utils/jwt";  
import type { AuthRequest } from "../types";  

// Importing constants
import { 
  USER_EXISTS, 
  INVALID_CREDENTIALS, 
  REGISTRATION_ERROR, 
  LOGIN_ERROR, 
  USER_REGISTERED, 
  LOGIN_SUCCESS, 
  LOGOUT_SUCCESS,
  FAVORITES_FETCHED,
  FAVORITE_ADDED,
  FAVORITE_REMOVED,
  USER_NOT_FOUND,
  VALIDATION_FAILED,
  SERVER_ERROR,
  SERVER_ERROR_LOGOUT,
  FAVORITES_FETCH_ERROR,
  FAVORITE_ADD_ERROR,
  FAVORITE_REMOVE_ERROR,
  FAVORITE_CHECK_ERROR
} from "../constants/messages";

import { 
  OK, 
  CREATED, 
  BAD_REQUEST, 
  UNAUTHORIZED, 
  INTERNAL_SERVER_ERROR,
  NOT_FOUND
} from "../constants/http";

 // Logs a user into the system.

export const login = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(BAD_REQUEST).json({
        success: false,
        message: VALIDATION_FAILED,
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(UNAUTHORIZED).json({
        success: false,
        message: INVALID_CREDENTIALS,
      });
    }

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(UNAUTHORIZED).json({
        success: false,
        message: INVALID_CREDENTIALS,
      });
    }

    const token = generateToken(String(user._id));

    res.status(OK).json({
      success: true,
      message: LOGIN_SUCCESS,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        favorites: user.favorites
      },
    });
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(INTERNAL_SERVER_ERROR).json({
      success: false,
      message: LOGIN_ERROR,
    });
  }
};

 //Registers a new user in the system.
 
export const register = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(BAD_REQUEST).json({
        success: false,
        message: VALIDATION_FAILED,
        errors: errors.array(),
      });
    }

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(BAD_REQUEST).json({
        success: false,
        message: USER_EXISTS,
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      favorites: [] // Initialize with empty favorites array
    });

    const token = generateToken(String(user._id));

    res.status(CREATED).json({
      success: true,
      message: USER_REGISTERED,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        favorites: user.favorites
      },
    });
  } catch (error: any) {
    console.error("Register error:", error);
    res.status(INTERNAL_SERVER_ERROR).json({
      success: false,
      message: REGISTRATION_ERROR,
    });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?._id);
    if (!user) {
      return res.status(UNAUTHORIZED).json({
        success: false,
        message: USER_NOT_FOUND,
      });
    }

    res.status(OK).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        favorites: user.favorites
      },
    });
  } catch (error: any) {
    console.error("Get me error:", error);
    res.status(INTERNAL_SERVER_ERROR).json({
      success: false,
      message: SERVER_ERROR,
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.status(OK).json({
      success: true,
      message: LOGOUT_SUCCESS,
    });
  } catch (error: any) {
    console.error("Logout error:", error);
    res.status(INTERNAL_SERVER_ERROR).json({
      success: false,
      message: SERVER_ERROR_LOGOUT,
    });
  }
};

export const getFavorites = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?._id);
    if (!user) {
      return res.status(UNAUTHORIZED).json({
        success: false,
        message: USER_NOT_FOUND,
      });
    }

    res.status(OK).json({
      success: true,
      message: FAVORITES_FETCHED,
      favorites: user.favorites
    });
  } catch (error: any) {
    console.error("Get favorites error:", error);
    res.status(INTERNAL_SERVER_ERROR).json({
      success: false,
      message: FAVORITES_FETCH_ERROR,
    });
  }
};

export const addFavorite = async (req: AuthRequest, res: Response) => {
  try {
    const { movieId } = req.body;
    const user = await User.findById(req.user?._id);
    
    if (!user) {
      return res.status(UNAUTHORIZED).json({
        success: false,
        message: USER_NOT_FOUND,
      });
    }

    if (!user.favorites.includes(movieId)) {
      user.favorites.push(movieId);
      await user.save();
    }

    res.status(OK).json({
      success: true,
      message: FAVORITE_ADDED,
      favorites: user.favorites
    });
  } catch (error: any) {
    console.error("Add favorite error:", error);
    res.status(INTERNAL_SERVER_ERROR).json({
      success: false,
      message: FAVORITE_ADD_ERROR,
    });
  }
};

export const removeFavorite = async (req: AuthRequest, res: Response) => {
  try {
    const { movieId } = req.params;
    const movieIdNum = parseInt(movieId, 10);

    const user = await User.findByIdAndUpdate(
      req.user?._id,
      { $pull: { favorites: movieIdNum } },
      { new: true }
    );

    if (!user) {
      return res.status(NOT_FOUND).json({
        success: false,
        message: USER_NOT_FOUND
      });
    }

    return res.status(OK).json({
      success: true,
      message: FAVORITE_REMOVED,
      favorites: user.favorites
    });
  } catch (error: any) {
    console.error("Remove favorite error:", error);
    return res.status(INTERNAL_SERVER_ERROR).json({
      success: false,
      message: FAVORITE_REMOVE_ERROR
    });
  }
};

export const checkFavorite = async (req: AuthRequest, res: Response) => {
  try {
    const { movieId } = req.params;
    const user = await User.findById(req.user?._id).select('favorites');
    
    if (!user) {
      return res.status(NOT_FOUND).json({
        success: false,
        message: USER_NOT_FOUND
      });
    }

    return res.status(OK).json({
      success: true,
      isFavorite: user.favorites.includes(Number(movieId))
    });

  } catch (error: any) {
    console.error("Check favorite error:", error);
    return res.status(INTERNAL_SERVER_ERROR).json({
      success: false,
      message: FAVORITE_CHECK_ERROR
    });
  }
};