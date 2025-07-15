import type { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import type { AuthRequest } from "../types";
import winston from "winston";
import { UNAUTHORIZED, INTERNAL_SERVER_ERROR } from "../constants/http";

// Set up the logger (Winston)
const logger = winston.createLogger({
  level: "info", // Log level (info, warn, error)
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(), // Log to console
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
      res.status(UNAUTHORIZED).json({
        success: false,
        message: "Not authorized to access this route (No token provided)",
      });
      return;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as jwt.Secret) as { id: string };
      const user = await User.findById(decoded.id);

      if (!user) {
        logger.warn("No user found for the provided token.");
        res.status(UNAUTHORIZED).json({
          success: false,
          message: "No user found with this token",
        });
        return;
      }

      req.user = user as any;
      next();
    } catch (error) {
      logger.error("Token verification or user lookup failed: " + (error as Error).message);
      res.status(UNAUTHORIZED).json({
        success: false,
        message: "Not authorized to access this route (Invalid token)",
      });
      return;
    }
  } catch (error) {
    logger.error("Protect middleware error: " + (error as Error).message);
    res.status(INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Server Error during authentication process",
    });
    return;
  }
};
