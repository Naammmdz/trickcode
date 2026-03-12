import apiClient from './api';
import { API_ENDPOINTS } from '../config/api';

const normalizeProfile = (profile) => {
  // JHipster profile: { id, login, firstName, lastName, email, authorities: [...] }
  const isPro = profile?.authorities?.includes('ROLE_PRO_USER'); // Example role check

  // Build name from firstName and lastName
  let name = profile?.login;
  if (profile?.firstName) {
    name = profile.lastName && profile.lastName.trim()
      ? `${profile.firstName} ${profile.lastName}`.trim()
      : profile.firstName.trim();
  }

  return {
    id: profile?.id,
    login: profile?.login,
    email: profile?.email,
    firstName: profile?.firstName || '',
    lastName: profile?.lastName || '',
    name,
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
        firstName: userData.fullName || userData.name || 'User',
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

  // Activate account
  async activate(key) {
    try {
      await apiClient.get(API_ENDPOINTS.AUTH.ACTIVATE, { params: { key } });
      return { message: 'Account activated' };
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

  // Update profile
  async updateProfile(userData) {
    try {
      const payload = {
        login: userData.email,
        email: userData.email,
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        langKey: userData.langKey || 'en',
      };
      await apiClient.post(API_ENDPOINTS.AUTH.PROFILE, payload);
      return this.getProfile(); // Fetch updated profile to keep local state synced
    } catch (error) {
      throw error;
    }
  },

  // Change password
  async changePassword(currentPassword, newPassword) {
    try {
      await apiClient.post(`${API_ENDPOINTS.AUTH.PROFILE}/change-password`, {
        currentPassword,
        newPassword
      });
      return { message: 'Password changed successfully' };
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
