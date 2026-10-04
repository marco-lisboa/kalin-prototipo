import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { authService, initializeMockData } from '../services';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (cpf: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: { name: string; cpf: string; email: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  resetMockData: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Inicializar mockData e restaurar sessão na montagem
  useEffect(() => {
    try {
      initializeMockData();
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
    } catch (err) {
      console.error('Error initializing Kalin Educ auth context:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (cpf: string, pass: string) => {
    setIsLoading(true);
    try {
      const res = await authService.login(cpf, pass);
      if (res.success && res.user) {
        setUser(res.user);
        return { success: true };
      }
      return { success: false, error: res.error || 'Falha ao autenticar.' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: { name: string; cpf: string; email: string; password: string }) => {
    setIsLoading(true);
    try {
      const res = await authService.registerStudent(data);
      if (res.success && res.user) {
        setUser(res.user);
        return { success: true };
      }
      return { success: false, error: res.error || 'Falha ao cadastrar.' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return false;
    const res = await authService.updateProfile(user.id, data);
    if (res.success && res.user) {
      setUser(res.user);
      return true;
    }
    return false;
  };

  const resetMockData = () => {
    authService.resetMockData();
    // Se o usuário atual existir, desloga para recarregar
    logout();
    window.location.reload();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user ? user.role : null,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        resetMockData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
