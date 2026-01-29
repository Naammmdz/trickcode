// Mock user data for testing authentication
export const mockUsers = [
  {
    id: 1,
    email: 'demo@trickcode.com',
    password: 'demo123',
    name: 'Demo User',
    avatar: null,
    role: 'student',
    isPro: false,
    createdAt: '2024-01-15',
  },
  {
    id: 2,
    email: 'admin@trickcode.com',
    password: 'admin123',
    name: 'Admin User',
    avatar: null,
    role: 'admin',
    isPro: true,
    createdAt: '2024-01-10',
  },
  {
    id: 3,
    email: 'student@trickcode.com',
    password: 'student123',
    name: 'John Student',
    avatar: null,
    role: 'student',
    isPro: false,
    createdAt: '2024-01-20',
  },
];

// Helper function to find user by email
export const findUserByEmail = (email) => {
  return mockUsers.find(user => user.email.toLowerCase() === email.toLowerCase());
};

// Helper function to validate credentials
export const validateCredentials = (email, password) => {
  const user = findUserByEmail(email);
  if (!user) {
    return { valid: false, error: 'User not found' };
  }
  if (user.password !== password) {
    return { valid: false, error: 'Invalid password' };
  }
  return { valid: true, user };
};
