import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { WishlistItemType, WishlistResponse, AddToWishlistResponse } from '@/types/wishlist.type';
import { axiosInstance } from '@/config/axios';
import { ENDPOINTS } from '@/constants/endpoints';
import { logout } from '../auth/authSlice';

interface WishlistState {
    items: WishlistItemType[];
    isLoading: boolean;
    error: string | null;
}

const initialState: WishlistState = {
    items: [],
    isLoading: false,
    error: null,
};

export const fetchWishlist = createAsyncThunk<WishlistItemType[], void>(
    'wishlist/fetch',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get<WishlistResponse>(ENDPOINTS.WISHLIST);
            return response.data?.data || [];
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } }; message?: string };
            const message = err?.response?.data?.message ?? err?.message ?? 'Failed to fetch wishlist.';
            return rejectWithValue(message);
        }
    }
);

export const addToWishlist = createAsyncThunk<WishlistItemType, string>(
    'wishlist/add',
    async (productId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post<AddToWishlistResponse>(ENDPOINTS.WISHLIST, {
                productId,
            });
            return response.data.data;
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } }; message?: string };
            const message = err?.response?.data?.message ?? err?.message ?? 'Failed to add item to wishlist.';
            return rejectWithValue(message);
        }
    }
);

export const removeFromWishlist = createAsyncThunk<string, string>(
    'wishlist/remove',
    async (wishlistItemId, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(ENDPOINTS.WISHLIST, {
                params: { wishlistItemId },
            });
            return wishlistItemId;
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } }; message?: string };
            const message = err?.response?.data?.message ?? err?.message ?? 'Failed to remove item from wishlist.';
            return rejectWithValue(message);
        }
    }
);

export const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {
        clearWishlist: (state) => {
            state.items = [];
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // fetchWishlist
            .addCase(fetchWishlist.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchWishlist.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = action.payload;
            })
            .addCase(fetchWishlist.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // addToWishlist
            .addCase(addToWishlist.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addToWishlist.fulfilled, (state, action) => {
                state.isLoading = false;
                // Avoid duplicates
                if (!state.items.some(item => item.wishlistItemId === action.payload.wishlistItemId)) {
                    state.items.push(action.payload);
                }
            })
            .addCase(addToWishlist.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // removeFromWishlist
            .addCase(removeFromWishlist.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(removeFromWishlist.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = state.items.filter(item => item.wishlistItemId !== action.payload);
            })
            .addCase(removeFromWishlist.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Clear wishlist on logout
            .addCase(logout, (state) => {
                state.items = [];
                state.error = null;
            });
    },
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
