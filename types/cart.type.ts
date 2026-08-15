export interface AddToCartRequest {
  productId: string;
  quantity: number;
}

export interface CartItemType {
  cartItemId: string;
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

export interface CartResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: CartItemType[];
}

export interface AddToCartResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: CartItemType;
}
