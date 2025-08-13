import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { prisma } from '~/server/db'; // Assuming prisma is exported from src/server/db

interface User {
  id: string;
  name: string;
  email: string; // Added email to match Prisma schema and test expectation
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  const isAuthenticated = user !== null;

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  const contextValue = {
    user,
    isAuthenticated,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * Registers a new user in the database.
 * This is a server-side utility function.
 * @param name The name of the user.
 * @param email The email of the user.
 * @returns The newly created user object.
 */
export async function registerNewUser(name: string, email: string): Promise<User> {
  const newUser = await prisma.user.create({
    data: {
      name,
      email,
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
  return newUser;
}

export { AuthProvider, useAuth };