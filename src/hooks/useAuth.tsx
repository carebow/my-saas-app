import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { apiService } from '../services/api';

interface User {
  id: number;
  email: string;
  full_name?: string;
  is_active: boolean;
  subscription_tier: string;
  consultations_used: number;
  consultations_limit: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isOffline: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: { email: string; password: string; full_name?: string }) => Promise<void>;
  logout: () => void;
  updateUser: (userData: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      if (apiService.isAuthenticated()) {
        try {
          const userData = await apiService.getCurrentUser();
          setUser(userData);
          setIsOffline(false);
        } catch (error) {
          console.error('Failed to get user data:', error);
          
          // Check if it's a network error
          if (error instanceof Error && error.message.includes('Unable to connect to server')) {
            setIsOffline(true);
            // Keep user logged in during network issues
          } else if (error instanceof Error && error.message.includes('401')) {
            // Only logout on authentication errors
            apiService.logout();
            setIsOffline(false);
          } else {
            // Other errors - assume offline
            setIsOffline(true);
          }
        }
      } else {
        setIsOffline(false);
      }
      setLoading(false);
    };

    initAuth().catch(error => {
      console.error('Auth initialization failed:', error);
      setIsOffline(true);
      setLoading(false);
    });
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiService.login(email, password);
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData: { email: string; password: string; full_name?: string }) => {
    try {
      const response = await apiService.register(userData);
      // After registration, automatically log in
      await login(userData.email, userData.password);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    apiService.logout();
    setUser(null);
  };

  const updateUser = async (userData: any) => {
    try {
      const updatedUser = await apiService.updateProfile(userData);
      setUser(updatedUser);
    } catch (error) {
      throw error;
    }
  };

  return {
    user,
    loading,
    isOffline,
    login,
    register,
    logout,
    updateUser,
  };
};

export { AuthContext };

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const auth = useAuthState();
  
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};