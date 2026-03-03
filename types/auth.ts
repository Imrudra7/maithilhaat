// src/types/auth.ts

export interface RegisterRequest {
  email: string;
  password?: string;
  fullName: string;
  termsAccepted: boolean;
  phone?: string;
}

export interface RegisterResponse {
  userId: string;
  email: string;
  fullName: string;
  roles: string[];
}

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface LoginResponse {
  status: string;
  roles: string[];
  message: string;
}

export interface AuthError {
  message: string;
  status: number;
}