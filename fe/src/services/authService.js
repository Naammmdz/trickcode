import apiClient from './api';
import { API_ENDPOINTS } from '../config/api';
import { validateCredentials, findUserByEmail, mockUsers } from '../data/mockUsers';

// Check if we should use mock data (when API is not available or in development)
const USE_MOCK_DATA =
  import.meta.env.VITE_USE_MOCK_AUTH === 'true' || !import.meta.env.VITE_API_BASE_URL;

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const normalizeProfile = (profile) => {
  const proExpiresAt = profile?.proExpiresAt || null;
  const isPro =
    !!proExpiresAt && !Number.isNaN(Date.parse(proExpiresAt)) && new Date(proExpiresAt) > new Date();

  return {
    id: profile?.id,
    email: profile?.email,
    name: profile?.fullName || profile?.email?.split('@')?.[0] || 'User',
    avatarUrl: profile?.avatarUrl || null,
    bio: profile?.bio || '',
    status: profile?.status,
    roles: profile?.roles || [],
    proExpiresAt,
    isPro,
  };
};

export const authService = {
  // Login
  async login(credentials) {
    try {
      // Try real API first if not using mock data
      if (!USE_MOCK_DATA) {
        try {
          const tokenResponse = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
          const token = tokenResponse?.access_token;

          if (token) {
            localStorage.setItem('authToken', token);
          }

          // IAM token endpoint does not return user; fetch profile
          const profile = await apiClient.get(API_ENDPOINTS.AUTH.PROFILE);
          const user = normalizeProfile(profile);
          localStorage.setItem('user', JSON.stringify(user));

          return {
            token,
            user,
            message: 'Login successful',
          };
        } catch (error) {
          // If API fails and we're in development, fallback to mock
          if (import.meta.env.MODE === 'development') {
            console.warn('API call failed, using mock data:', error.message);
          } else {
            throw error;
          }
        }
      }

      // Use mock data
      await delay(500); // Simulate network delay
      
      const validation = validateCredentials(credentials.email, credentials.password);
      
      if (!validation.valid) {
        throw new Error(validation.error || 'Invalid credentials');
      }

      const { user } = validation;
      const { password, ...userWithoutPassword } = user;
      
      // Generate mock token
      const token = `mock_token_${user.id}_${Date.now()}`;
      
      const response = {
        token,
        user: userWithoutPassword,
        message: 'Login successful',
      };
      
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Signup
  async signup(userData) {
    try {
      // Try real API first if not using mock data
      if (!USE_MOCK_DATA) {
        try {
          // IAM expects: { fullName, email, password }
          const registerPayload = {
            fullName: userData.fullName || userData.name || userData.email?.split('@')?.[0] || 'User',
            email: userData.email,
            password: userData.password,
          };

          await apiClient.post(API_ENDPOINTS.AUTH.SIGNUP, registerPayload);

          // Auto-login after successful register
          return await this.login({ email: userData.email, password: userData.password });
        } catch (error) {
          // If API fails and we're in development, fallback to mock
          if (import.meta.env.MODE === 'development') {
            console.warn('API call failed, using mock data:', error.message);
          } else {
            throw error;
          }
        }
      }

      // Use mock data
      await delay(500); // Simulate network delay
      
      // Check if user already exists
      if (findUserByEmail(userData.email)) {
        throw new Error('User with this email already exists');
      }

      // Create new user
      const newUser = {
        id: mockUsers.length + 1,
        email: userData.email,
        name: userData.name || userData.email.split('@')[0],
        avatar: null,
        role: 'student',
        isPro: false,
        createdAt: new Date().toISOString().split('T')[0],
      };

      // Generate mock token
      const token = `mock_token_${newUser.id}_${Date.now()}`;
      
      const response = {
        token,
        user: newUser,
        message: 'Signup successful',
      };
      
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Logout
  async logout() {
    try {
      // IAM currently does not expose a logout endpoint; tokens are stateless.
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  },

  // Get current user profile
  async getProfile() {
    try {
      const profile = await apiClient.get(API_ENDPOINTS.AUTH.PROFILE);
      const user = normalizeProfile(profile);
      localStorage.setItem('user', JSON.stringify(user));
      return { user };
    } catch (error) {
      throw error;
    }
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  },

  // Get current user from localStorage
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Get auth token
  getToken() {
    return localStorage.getItem('authToken');
  },
};
