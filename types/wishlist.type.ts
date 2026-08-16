export interface WishlistItemType {
  wishlistItemId: string;
  productId: string;
  productName: string;
  productImage: string;
  price: number;
}

export interface AddToWishlistRequest {
  productId: string;
}

export interface WishlistResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: WishlistItemType[];
}

export interface AddToWishlistResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: WishlistItemType;
}
