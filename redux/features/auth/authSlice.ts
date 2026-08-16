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

export const loginUser = createAsyncThunk<{ user: UserData; message: string }, LoginUserRequest>(
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

            setAuthTokenCookie(userData.token);

            return { user: userData, message: responseData.message || 'Login successful.' };
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } }; message?: string };
            const message =
                err?.response?.data?.message ?? err?.message ?? 'Login failed. Please try again.';
            return rejectWithValue(message);
        }
    }
);

export const registerUser = createAsyncThunk<{ user: UserData; message: string }, RegisterUserRequest>(
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

            return { user: userData, message: responseData.message || 'Registration successful.' };
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } }; message?: string };
            const message =
                err?.response?.data?.message ?? err?.message ?? 'Registration failed. Please try again.';
            return rejectWithValue(message);
        }
    }
);

export const updateUserProfile = createAsyncThunk<{
    user: { firstName: string; lastName: string; email: string; avatar: string };
    message: string;
}, {
    firstName: string;
    lastName: string;
    email: string;
    oldAvatarPath?: string;
    avatar?: FileList;
}>(
    'auth/update',
    async (formData, { rejectWithValue }) => {
        try {
            const data = new FormData();
            data.append('FirstName', formData.firstName);
            data.append('LastName', formData.lastName);
            data.append('Email', formData.email);
            if (formData.oldAvatarPath) {
                data.append('OldAvatarPath', formData.oldAvatarPath);
            }
            if (formData.avatar && formData.avatar[0]) {
                data.append('Avatar', formData.avatar[0]);
            }

            const response = await axiosInstance.put<{
                success: boolean;
                message: string;
                statusCode: number;
                data: {
                    id: string;
                    firstName: string;
                    lastName: string;
                    email: string;
                    avatar: string;
                };
            }>(
                ENDPOINTS.AUTH.UPDATE,
                data,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            const responseData = response.data;
            const userData = responseData.data;

            return {
                user: {
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    email: userData.email,
                    avatar: userData.avatar,
                },
                message: responseData.message || 'Profile updated successfully.',
            };
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } }; message?: string };
            const message =
                err?.response?.data?.message ?? err?.message ?? 'Update failed. Please try again.';
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
        updateUser: (state, action) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
            }
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
                const { token, ...user } = action.payload.user;
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
                const { token, ...user } = action.payload.user;
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = user;
                state.token = token;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Update profile cases
            .addCase(updateUserProfile.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                if (state.user) {
                    state.user.firstName = action.payload.user.firstName;
                    state.user.lastName = action.payload.user.lastName;
                    state.user.email = action.payload.user.email;
                    state.user.avatar = action.payload.user.avatar;
                }
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { logout, clearAuthError, updateUser } = authSlice.actions;
export default authSlice.reducer;

