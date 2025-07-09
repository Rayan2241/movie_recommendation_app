import jwt from "jsonwebtoken";
import type { StringValue } from "ms";

export const generateToken = (id: string): string => {
  const secret = process.env.JWT_SECRET as string;


  const expiresIn: StringValue | number = (process.env.JWT_EXPIRE as StringValue) || "7d";

  return jwt.sign({ id }, secret, { expiresIn });
};
