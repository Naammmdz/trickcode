import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const currentUser = authService.getCurrentUser();
          setUser(currentUser);
          setIsAuthenticated(true);

          // Refresh profile to ensure roles are up to date
          try {
            const { user: refreshedUser } = await authService.getProfile();
            setUser(refreshedUser);
          } catch (e) {
            console.warn("Failed to refresh profile on load", e);
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const signup = async (userData) => {
    try {
      const response = await authService.signup(userData);
      setUser(response.user);
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const hasRole = (role) => {
    if (!user) return false;
    // Check both 'roles' (mapped) and 'authorities' (raw JHipster)
    const userRoles = user.roles || user.authorities || [];

    // Handle Array case (standard)
    if (Array.isArray(userRoles)) {
      return userRoles.includes(role);
    }

    // Handle String case (legacy or single role)
    if (typeof userRoles === 'string') {
      return userRoles === role;
    }

    // Fallback: Check if user.role exists (legacy mock)
    if (user.role === role) return true;

    return false;
  };

  const hasAnyRole = (roles) => {
    if (!user) return false;
    const userRoles = user.roles || user.authorities || [];
    if (Array.isArray(userRoles)) {
      return roles.some(r => userRoles.includes(r));
    }
    return roles.includes(userRoles); // Fallback for string
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    signup,
    logout,
    hasRole,
    hasAnyRole,
    isAdmin: hasRole('ROLE_ADMIN'), // Convenience
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
