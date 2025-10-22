// services/authService.ts
import { LoginCredentials, SignupCredentials, User } from '../types';

const API_BASE_URL = 'https://drift-nt2a.onrender.com/api/auth';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

interface LoginResponse {
  token: string;
  user: User;
}

interface SignupResponse {
  userId: string;
  email: string;
  name: string;
  isEmailVerified: boolean;
}

interface OTPResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    user: User;
  };
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<{ user: User; token: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data: ApiResponse<LoginResponse> = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Login failed');
      }

      if (!data.data) {
        throw new Error('No data received from server');
      }

      return {
        user: data.data.user,
        token: data.data.token,
      };
    } catch (error) {
      console.error('Login API error:', error);
      throw error;
    }
  },

  signup: async (credentials: SignupCredentials): Promise<SignupResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data: ApiResponse<SignupResponse> = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Signup failed');
      }

      if (!data.data) {
        throw new Error('No data received from server');
      }

      return data.data;
    } catch (error) {
      console.error('Signup API error:', error);
      throw error;
    }
  },

  verifyOTP: async (email: string, otp: string, type: string = 'signup'): Promise<{ user: User; token: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp, type }),
      });

      const data: ApiResponse<{ token: string; user: User }> = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'OTP verification failed');
      }

      if (!data.data) {
        throw new Error('No data received from server');
      }

      return {
        user: data.data.user,
        token: data.data.token,
      };
    } catch (error) {
      console.error('OTP verification API error:', error);
      throw error;
    }
  },

  resendOTP: async (email: string, type: string = 'signup'): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/resend-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, type }),
      });

      const data: ApiResponse<any> = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to resend OTP');
      }
    } catch (error) {
      console.error('Resend OTP API error:', error);
      throw error;
    }
  },

  getCurrentUser: async (token: string): Promise<User> => {
    try {
      const response = await fetch(`${API_BASE_URL}/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data: ApiResponse<{ user: User }> = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to get user data');
      }

      if (!data.data) {
        throw new Error('No user data received');
      }

      return data.data.user;
    } catch (error) {
      console.error('Get current user API error:', error);
      throw error;
    }
  },
};