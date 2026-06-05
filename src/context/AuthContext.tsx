import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { User } from '../types';
import { authApi } from '../api/auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userId: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const storedToken = authApi.getStoredToken();
    const storedUser = authApi.getStoredUser();
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (userId: string, password: string) => {
    try {
      const response = await authApi.login({ userId, password });
      const { token: newToken, user: newUser } = response;
      
      localStorage.setItem('auth_token', newToken);
      localStorage.setItem('auth_user', JSON.stringify(newUser));
      
      setToken(newToken);
      setUser(newUser);
    } catch (error: unknown) {
      // If API is down, use mock login for development
      const err = error as { message?: string; code?: string };
      if (err.code === 'ERR_NETWORK' || err.message?.includes('Network Error')) {
        // Mock login for development when API is unavailable
        const mockUser: User = {
          id: '1',
          name: 'Alex Wando',
          role: 'Admin',
        };
        const mockToken = 'mock-jwt-token-dev';
        
        localStorage.setItem('auth_token', mockToken);
        localStorage.setItem('auth_user', JSON.stringify(mockUser));
        
        setToken(mockToken);
        setUser(mockUser);
        return;
      }
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    authApi.logout();
    setUser(null);
    setToken(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
