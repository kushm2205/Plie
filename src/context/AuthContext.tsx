import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginApi } from '../api/authService';
import { AuthContextValue, AuthUser, LoginResponse } from '../types';

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    restoreSession();
  }, []);

  const restoreSession = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('authToken');
      const storedUser = await AsyncStorage.getItem('authUser');
      const storedGuest = await AsyncStorage.getItem('isGuest');
      if (storedToken) setToken(storedToken);
      if (storedUser) setUser(JSON.parse(storedUser));
      if (storedGuest === 'true') setIsGuest(true);
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  };

  const continueAsGuest = async () => {
    await AsyncStorage.setItem('isGuest', 'true');
    setIsGuest(true);
  };

  const login = async (email: string, password: string): Promise<LoginResponse> => {
    const result = await loginApi(email, password);

    const receivedToken = result?.data?.token || result?.token;
    const receivedUser = result?.data?.user || result?.user || null;

    if (!receivedToken) {
      throw new Error('Login succeeded but no token was returned by the API');
    }

    await AsyncStorage.setItem('authToken', receivedToken);
    if (receivedUser) {
      await AsyncStorage.setItem('authUser', JSON.stringify(receivedUser));
    }

    setToken(receivedToken);
    setUser(receivedUser);
    return result;
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(['authToken', 'authUser', 'cachedEvents', 'isGuest']);
    setToken(null);
    setUser(null);
    setIsGuest(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isGuest, isLoading, login, logout, continueAsGuest }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
