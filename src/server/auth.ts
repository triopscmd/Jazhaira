import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { prisma } from './db';

interface User {
  id: string;
  name: string;
  email: string; // Added email property to satisfy test requirements and align with User model
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
 * This function is intended for server-side use or testing purposes
 * to directly interact with the Prisma client.
 *
 * @param name The name of the new user.
 * @param email The email of the new user, which must be unique.
 * @returns The newly created user object, including their ID, name, and email.
 */
export async function registerNewUser(name: string, email: string): Promise<User> {
  const user = await prisma.user.create({
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
  return user;
}

export { AuthProvider, useAuth };