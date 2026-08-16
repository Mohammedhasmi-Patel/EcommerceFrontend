import { z } from "zod";

export const addToWishlistSchema = z.object({
  productId: z.string().uuid({ message: "Product ID must be a valid UUID." }),
});
