import apiClient from './api';
import { API_ENDPOINTS } from '../config/api';

const normalizeProfile = (profile) => {
  // JHipster profile: { id, login, firstName, lastName, email, authorities: [...] }
  const isPro = profile?.authorities?.includes('ROLE_PRO_USER'); // Example role check

  return {
    id: profile?.id,
    login: profile?.login,
    email: profile?.email,
    name: profile?.firstName ? `${profile.firstName} ${profile.lastName}` : profile?.login,
    avatarUrl: profile?.imageUrl || null,
    roles: profile?.authorities || [],
    isPro,
    // Add other fields as needed
  };
};

export const authService = {
  // Login
  async login(credentials) {
    try {
      const payload = {
        username: credentials.email, // JHipster uses 'username' often, but if 'authenticationType jwt', it expects { username, password }
        password: credentials.password,
        rememberMe: credentials.rememberMe || false
      };

      // JHipster default JWT login endpoint: /api/authenticate
      const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, payload);

      // JHipster returns { id_token: "..." }
      const token = response.data?.id_token;

      if (token) {
        localStorage.setItem('authToken', token);
      } else {
        throw new Error("No token received");
      }

      // Fetch profile
      const profileResponse = await apiClient.get(API_ENDPOINTS.AUTH.PROFILE);
      const user = normalizeProfile(profileResponse.data);
      localStorage.setItem('user', JSON.stringify(user));

      return {
        token,
        user,
        message: 'Login successful',
      };
    } catch (error) {
      throw error;
    }
  },

  // Signup
  async signup(userData) {
    try {
      // JHipster Register expects: { login, password, email, firstName, lastName, langKey }
      const payload = {
        login: userData.email, // Use email as login
        email: userData.email,
        password: userData.password,
        firstName: userData.name || 'User',
        lastName: '',
        langKey: 'en'
      };

      await apiClient.post(API_ENDPOINTS.AUTH.SIGNUP, payload);

      // Auto-login? Or usually JHipster requires activation via email?
      // Default JHipster requires activation unless configured otherwise.
      // Assuming we need to tell user to check email, or I can try logging in.

      return { message: "Registration successful. Please check your email to activate." };
    } catch (error) {
      throw error;
    }
  },

  // Logout
  async logout() {
    try {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  // Get current user profile
  async getProfile() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.AUTH.PROFILE);
      const user = normalizeProfile(response.data);
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
