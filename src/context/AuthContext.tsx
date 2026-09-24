"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useRouter } from "next/navigation";
import { AuthUser, LoginCredentials } from "@/types";
import { loginUser } from "@/lib/api/auth";

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Prevent duplicate concurrent requests with ref lock
  const isRequestInProgress = useRef<boolean>(false);

  // Restore authentication from localStorage on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const storedToken = localStorage.getItem(TOKEN_KEY);
        const storedUser = localStorage.getItem(USER_KEY);

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch {
        // LocalStorage access or parse error - clear corrupted data
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      } finally {
        setIsLoading(false);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const login = useCallback(
    async (credentials: LoginCredentials): Promise<boolean> => {
      // Double submission protection
      if (isRequestInProgress.current) {
        return false;
      }

      isRequestInProgress.current = true;
      setIsSubmitting(true);
      setError(null);

      try {
        const response = await loginUser(credentials);

        const authUser: AuthUser = {
          id: response.id,
          username: response.username,
          email: response.email,
          firstName: response.firstName,
          lastName: response.lastName,
          image: response.image,
        };

        const accessToken = response.accessToken;

        // Persist session
        localStorage.setItem(TOKEN_KEY, accessToken);
        localStorage.setItem(USER_KEY, JSON.stringify(authUser));

        setToken(accessToken);
        setUser(authUser);

        router.push("/products");
        return true;
      } catch (err: unknown) {
        const apiError = err as { message?: string };
        const message =
          apiError?.message || "Invalid credentials. Please try again.";
        setError(message);
        return false;
      } finally {
        setIsSubmitting(false);
        isRequestInProgress.current = false;
      }
    },
    [router]
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        isSubmitting,
        error,
        login,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
