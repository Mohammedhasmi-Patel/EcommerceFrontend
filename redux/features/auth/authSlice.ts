import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { LoginUserRequest, LoginUserResponse, UserData } from '@/types/loginUser.type';
import { RegisterUserRequest, RegisterUserResponse } from '@/types/registerUser.type';
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

/** Async thunk — calls POST /auth/register with multipart/form-data and sets the auth cookie */
export const registerUser = createAsyncThunk<UserData, RegisterUserRequest>(
    'auth/register',
    async (formData, { rejectWithValue }) => {
        try {
            const data = new FormData();
            data.append('FirstName', formData.firstName);
            data.append('LastName', formData.lastName);
            data.append('Email', formData.email);
            data.append('Password', formData.password);
            data.append('ConfirmPassword', formData.confirmPassword);

            if (formData.avatar && formData.avatar[0]) {
                data.append('Avatar', formData.avatar[0]);
            }

            const response = await axiosInstance.post<RegisterUserResponse>(
                ENDPOINTS.AUTH.REGISTER,
                data,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
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
                error?.response?.data?.message ?? error?.message ?? 'Registration failed. Please try again.';
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
            // Login cases
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
            })
            // Register cases
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                const { token, ...user } = action.payload;
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = user;
                state.token = token;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;

