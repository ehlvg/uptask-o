import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

interface User {
  id: number;
  name?: string;
  email: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing auth on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
        }
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        localStorage.removeItem("user");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In a real app, you would validate credentials with your backend
      // For now, we'll create a user object if email/password are valid
      if (email && password.length >= 6) {
        // Check if user already exists in localStorage
        const existingUsersData = localStorage.getItem("users");
        const existingUsers: Record<string, User> = existingUsersData
          ? JSON.parse(existingUsersData)
          : {};

        let userData: User;

        if (existingUsers[email]) {
          // User exists, use existing user data
          userData = existingUsers[email];
        } else {
          // New user, create new user data
          userData = {
            id: Date.now(),
            email,
            createdAt: new Date().toISOString(),
          };

          // Store in users registry
          existingUsers[email] = userData;
          localStorage.setItem("users", JSON.stringify(existingUsers));
        }

        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        return true;
      }

      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      setIsLoading(true);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In a real app, you would create the account with your backend
      // For now, we'll create a user object if all fields are valid
      if (name && email && password.length >= 6) {
        // Check if user already exists
        const existingUsersData = localStorage.getItem("users");
        const existingUsers: Record<string, User> = existingUsersData
          ? JSON.parse(existingUsersData)
          : {};

        if (existingUsers[email]) {
          // User already exists, you might want to return false or handle differently
          console.error("User already exists");
          return false;
        }

        const userData: User = {
          id: Date.now(),
          name,
          email,
          createdAt: new Date().toISOString(),
        };

        // Store in users registry
        existingUsers[email] = userData;
        localStorage.setItem("users", JSON.stringify(existingUsers));

        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        return true;
      }

      return false;
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
