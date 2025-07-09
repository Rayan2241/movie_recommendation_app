import type { Request } from "express"

export interface IUser {
  _id: string
  name: string
  email: string
  password: string
  createdAt: Date
  updatedAt: Date
}

export interface AuthRequest extends Request {
  user?: IUser
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}
