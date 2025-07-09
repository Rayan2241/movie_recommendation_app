import type { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import type { AuthRequest } from "../types";

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Not authorized to access this route (No token provided)", 
      });
      return; 
    }

    try {
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET as jwt.Secret) as { id: string };
      const user = await User.findById(decoded.id);

      if (!user) {
        res.status(401).json({
          success: false,
          message: "No user found with this token",
        });
        return; 
      }

      req.user = user as any;
      next(); 
    } catch (error) {
      console.error("Token verification or user lookup failed:", error);
      res.status(401).json({
        success: false,
        message: "Not authorized to access this route (Invalid token)",
      });
      return;
    }
  } catch (error) {
    console.error("Protect middleware error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error during authentication process",
    });
    return;
  }
};