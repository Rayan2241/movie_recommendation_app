import express from "express";
import { body } from "express-validator";
import { register, login, getMe, logout } from "../controllers/authController";
import { protect } from "../middleware/auth";
import type { Request, Response, NextFunction } from "express";
const router = express.Router();

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any> | any) =>
  (req: Request, res: Response, next: NextFunction): void => { 
    Promise.resolve(fn(req, res, next)).catch(next);
  };

// Validation rules
const registerValidation = [
  body("name").trim().isLength({ min: 2, max: 50 }).withMessage("Name must be between 2 and 50 characters"),
  body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
];

const loginValidation = [
  body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
]
router.post("/register", registerValidation, asyncHandler(register));
router.post("/login", loginValidation, asyncHandler(login));
router.get("/me", protect, asyncHandler(getMe));
router.post("/logout", protect, asyncHandler(logout));

export default router;