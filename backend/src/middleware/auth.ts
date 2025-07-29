import type { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import type { AuthRequest } from "../types";
import winston from "winston";
import { 
  UNAUTHORIZED, 
  INTERNAL_SERVER_ERROR, 
  OK, 
  BAD_REQUEST 
} from "../constants/http";
import {
  USER_NOT_FOUND,
  FAVORITE_ADDED,
  FAVORITE_REMOVED,
  FAVORITES_FETCHED,
  NO_TOKEN_PROVIDED,
  INVALID_TOKEN,
  AUTHENTICATION_ERROR,
  MOVIE_ID_REQUIRED,
  MOVIE_ALREADY_FAVORITE
} from "../constants/messages";

// Winston logger setup remains the same
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
  ],
});

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      logger.warn("No token provided in authorization header.");
      return res.status(UNAUTHORIZED).json({
        success: false,
        message: NO_TOKEN_PROVIDED,
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as jwt.Secret) as { id: string };
      const user = await User.findById(decoded.id);

      if (!user) {
        logger.warn("No user found for the provided token.");
        return res.status(UNAUTHORIZED).json({
          success: false,
          message: USER_NOT_FOUND, // Reused existing constant
        });
      }

      req.user = user as any;
      next();
    } catch (error) {
      logger.error("Token verification or user lookup failed: " + (error as Error).message);
      return res.status(UNAUTHORIZED).json({
        success: false,
        message: INVALID_TOKEN,
      });
    }
  } catch (error) {
    logger.error("Protect middleware error: " + (error as Error).message);
    return res.status(INTERNAL_SERVER_ERROR).json({
      success: false,
      message: AUTHENTICATION_ERROR,
    });
  }
};

export const addFavorite = async (req: AuthRequest, res: Response) => {
  try {
    const { movieId } = req.body;
    if (!movieId) {
      return res.status(BAD_REQUEST).json({
        success: false,
        message: MOVIE_ID_REQUIRED,
      });
    }

    const user = req.user;
    if (!user) {
      return res.status(UNAUTHORIZED).json({
        success: false,
        message: USER_NOT_FOUND, // Reused existing constant
      });
    }

    if (user.favorites.includes(movieId)) {
      return res.status(BAD_REQUEST).json({
        success: false,
        message: MOVIE_ALREADY_FAVORITE,
      });
    }

    user.favorites.push(movieId);
    await user.save();

    res.status(OK).json({
      success: true,
      message: FAVORITE_ADDED, // Reused existing constant
      favorites: user.favorites,
    });
  } catch (error: any) {
    logger.error("Error adding favorite: " + error.message);
    res.status(INTERNAL_SERVER_ERROR).json({
      success: false,
      message: AUTHENTICATION_ERROR, // Reused for general errors
    });
  }
};

export const removeFavorite = async (req: AuthRequest, res: Response) => {
  try {
    const { movieId } = req.body;
    if (!movieId) {
      return res.status(BAD_REQUEST).json({
        success: false,
        message: MOVIE_ID_REQUIRED,
      });
    }

    const user = req.user;
    if (!user) {
      return res.status(UNAUTHORIZED).json({
        success: false,
        message: USER_NOT_FOUND, // Reused existing constant
      });
    }

    user.favorites = user.favorites.filter((id) => id !== movieId);
    await user.save();

    res.status(OK).json({
      success: true,
      message: FAVORITE_REMOVED, // Reused existing constant
      favorites: user.favorites,
    });
  } catch (error: any) {
    logger.error("Error removing favorite: " + error.message);
    res.status(INTERNAL_SERVER_ERROR).json({
      success: false,
      message: AUTHENTICATION_ERROR, // Reused for general errors
    });
  }
};

export const getFavorites = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(UNAUTHORIZED).json({
        success: false,
        message: USER_NOT_FOUND, // Reused existing constant
      });
    }

    res.status(OK).json({
      success: true,
      message: FAVORITES_FETCHED, // Reused existing constant
      favorites: user.favorites,
    });
  } catch (error: any) {
    logger.error("Error fetching favorites: " + error.message);
    res.status(INTERNAL_SERVER_ERROR).json({
      success: false,
      message: AUTHENTICATION_ERROR, // Reused for general errors
    });
  }
};