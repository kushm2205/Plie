import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AxiosError } from 'axios';
import { loginApi } from '../../api/authService';
import { AuthUser, LoginResponse } from '../../types';

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isGuest: boolean;
  isLoading: boolean; // true while the persisted session is being restored
}

const initialState: AuthState = {
  user: null,
  token: null,
  isGuest: false,
  isLoading: true,
};

interface LoginErrorResponse {
  message?: string;
}

/** Reads any previously persisted session out of AsyncStorage on app start. */
export const restoreSession = createAsyncThunk('auth/restoreSession', async () => {
  const [storedToken, storedUser, storedGuest] = await Promise.all([
    AsyncStorage.getItem('authToken'),
    AsyncStorage.getItem('authUser'),
    AsyncStorage.getItem('isGuest'),
  ]);

  return {
    token: storedToken,
    user: storedUser ? (JSON.parse(storedUser) as AuthUser) : null,
    isGuest: storedGuest === 'true',
  };
});

export const continueAsGuest = createAsyncThunk('auth/continueAsGuest', async () => {
  await AsyncStorage.setItem('isGuest', 'true');
  return true;
});

export const login = createAsyncThunk(
  'auth/login',
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const result: LoginResponse = await loginApi(email, password);

      const receivedToken = result?.data?.token || result?.token;
      const receivedUser = result?.data?.user || result?.user || null;

      if (!receivedToken) {
        return rejectWithValue('Login succeeded but no token was returned by the API');
      }

      await AsyncStorage.setItem('authToken', receivedToken);
      if (receivedUser) {
        await AsyncStorage.setItem('authUser', JSON.stringify(receivedUser));
      }

      return { token: receivedToken, user: receivedUser };
    } catch (error) {
      const axiosError = error as AxiosError<LoginErrorResponse>;
      const message =
        axiosError?.response?.data?.message ||
        'Login failed. Please check your credentials.';
      return rejectWithValue(message);
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  await AsyncStorage.multiRemove(['authToken', 'authUser', 'cachedEvents', 'isGuest']);
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isGuest = action.payload.isGuest;
        state.isLoading = false;
      })
      .addCase(restoreSession.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(continueAsGuest.fulfilled, (state) => {
        state.isGuest = true;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<{ token: string; user: AuthUser | null }>) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(logout.fulfilled, (state) => {
        state.token = null;
        state.user = null;
        state.isGuest = false;
      });
  },
});

export default authSlice.reducer;
