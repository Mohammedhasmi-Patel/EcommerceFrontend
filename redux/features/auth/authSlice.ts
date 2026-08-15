import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { LoginUserRequest, LoginUserResponse, UserData } from '@/types/loginUser.type';
import { axiosInstance } from '@/config/axios';
import { ENDPOINTS } from '@/constants/endpoints';
import { setAuthTokenCookie, removeAuthTokenCookie } from '@/lib/authCookie';

interface AuthState {
    isLoading: boolean;
    isAuthenticated: boolean;
    user: Omit<UserData, 'token'> | null;
    token: string | null;
    error: string | null;
}

const initialState: AuthState = {
    isLoading: false,
    isAuthenticated: false,
    user: null,
    token: null,
    error: null,
};

/** Async thunk — calls POST /auth/login and sets the auth cookie */
export const loginUser = createAsyncThunk<UserData, LoginUserRequest>(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post<LoginUserResponse>(
                ENDPOINTS.AUTH.LOGIN,
                credentials
            );

            const responseData = response.data;
            const userData = responseData.data;

            if (!userData || !userData.token) {
                return rejectWithValue('No token returned from server.');
            }

            // Set cookie so the proxy can gate routes server-side
            setAuthTokenCookie(userData.token);

            return userData;
        } catch (error: any) {
            const message =
                error?.response?.data?.message ?? error?.message ?? 'Login failed. Please try again.';
            return rejectWithValue(message);
        }
    }
);

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
            state.error = null;
            removeAuthTokenCookie();
        },
        clearAuthError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                const { token, ...user } = action.payload;
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = user;
                state.token = token;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;

