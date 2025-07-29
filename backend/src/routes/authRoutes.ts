import express from "express";
import { body, param, validationResult } from "express-validator";
import {
  register,
  login,
  getMe,
  logout,
  getFavorites,
  addFavorite,
  removeFavorite,
  checkFavorite
} from "../controllers/authController";
import { protect } from "../middleware/auth";
import type { Request, Response, NextFunction } from "express";
import {
  VALIDATION_FAILED,
  NAME_LENGTH,
  EMAIL_VALID,
  PASSWORD_LENGTH,
  MOVIE_ID_VALID
} from "../constants/messages";
import { BAD_REQUEST } from "../constants/http";

const router = express.Router();

const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(BAD_REQUEST).json({
      success: false,
      message: VALIDATION_FAILED,
      errors: errors.array()
    });
  }
  next();
};

// Validation rules
const registerValidation = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage(NAME_LENGTH),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage(EMAIL_VALID),
  body("password")
    .isLength({ min: 6 })
    .withMessage(PASSWORD_LENGTH)
];

const loginValidation = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage(EMAIL_VALID),
  body("password")
    .notEmpty()
    .withMessage(PASSWORD_LENGTH)
];

const favoriteValidation = [
  body("movieId")
    .isInt({ min: 1 })
    .toInt()
    .withMessage(MOVIE_ID_VALID)
];

const movieIdParamValidation = [
  param("movieId")
    .isInt({ min: 1 })
    .toInt()
    .withMessage(MOVIE_ID_VALID)
];

// Auth Routes
router.post("/auth/register", registerValidation, handleValidationErrors, register);
router.post("/auth/login", loginValidation, handleValidationErrors, login);
router.get("/auth/me", protect, getMe);
router.post("/auth/logout", protect, logout);

// Favorites Routes
router.get("/favorites", protect, getFavorites);
router.post("/favorites", protect, favoriteValidation, handleValidationErrors, addFavorite);
router.delete("/favorites/:movieId", protect, movieIdParamValidation, handleValidationErrors, removeFavorite);
router.get("/favorites/check/:movieId", protect, movieIdParamValidation, handleValidationErrors, checkFavorite);

export default router;