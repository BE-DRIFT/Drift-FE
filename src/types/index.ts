// types/index.ts
export interface User {
  id: string;
  email: string;
  name: string;
  isEmailVerified?: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface OTPParams {
  email: string;
  type?: string;
}