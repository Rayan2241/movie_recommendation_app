import jwt from "jsonwebtoken";
import type { StringValue } from "ms";

// Function to generate the access token
export const generateAccessToken = (id: string): string => {
  const secret = process.env.JWT_SECRET as string; // Secret for signing the access token
  const expiresIn: StringValue | number = process.env.JWT_EXPIRE as StringValue; // Access token expiry time

  return jwt.sign({ id }, secret, { expiresIn }); // Generate and return the access token
};

// Function to generate the refresh token
export const generateRefreshToken = (id: string): string => {
  const secret = process.env.JWT_REFRESH_SECRET as string; // Secret for signing the refresh token
  const expiresIn: StringValue | number = process.env.JWT_REFRESH_EXPIRE as StringValue; // Refresh token expiry time

  return jwt.sign({ id }, secret, { expiresIn }); // Generate and return the refresh token
};
