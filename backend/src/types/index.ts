import type { Request } from "express"

export interface IUser {
  save(): unknown
  _id: string
  name: string
  email: string
  password: string
  createdAt: Date
  updatedAt: Date
  favorites: Array<{ movieId: string; title: string; posterPath: string }>; // Add favorites property
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

