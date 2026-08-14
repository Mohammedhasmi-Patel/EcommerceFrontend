# Stitch UI Generation Prompts: E-Commerce Backend

These prompts are designed to be fed into Stitch (or similar AI UI generators) module-by-module. Generating the UI incrementally yields better, more cohesive results than asking for the entire app at once.

## Global Setup & Theme Configuration

**Feed this global context to the AI before or alongside your first module prompt:**

```text
Act as an expert Frontend Developer and UI/UX Designer. We are building a modern, responsive E-Commerce application. 
Please apply the following Design System and Color Theme (supporting both Light and Dark modes) across all components:

Design System & Theme Colors:
- Typography: Use a modern sans-serif like 'Inter' or 'Geist'.
- Style: Clean, slightly rounded corners (e.g., rounded-lg), subtle shadows, and glassmorphism effects where appropriate.

Light Theme:
- Background: #F8FAFC (slate-50)
- Surface/Card Background: #FFFFFF (white)
- Primary Brand: #4F46E5 (indigo-600)
- Secondary/Accent: #E11D48 (rose-600)
- Text Primary: #0F172A (slate-900)
- Text Secondary: #475569 (slate-600)
- Border: #E2E8F0 (slate-200)

Dark Theme:
- Background: #0F172A (slate-900)
- Surface/Card Background: #1E293B (slate-800)
- Primary Brand: #6366F1 (indigo-500)
- Secondary/Accent: #F43F5E (rose-500)
- Text Primary: #F8FAFC (slate-50)
- Text Secondary: #94A3B8 (slate-400)
- Border: #334155 (slate-700)

Status Colors (Both Modes):
- Success: #22C55E (green-500)
- Error/Danger: #EF4444 (red-500)
- Warning: #F59E0B (amber-500)
```

---

## Module 1: Authentication & User Profile
*(Entities: AppUser, AppRole, UserAddresses, City, State, Country)*

**Prompt:**
```text
Generate the Authentication and User Profile module for an E-Commerce application. Apply the global Light/Dark theme configuration provided earlier.

Pages & Components to generate:
1. Login Page: Email, Password fields, 'Remember Me' checkbox, and a 'Forgot Password' link. Include a social login button divider.
2. Registration Page: First Name, Last Name, Email, Password, Confirm Password, and a Profile Avatar upload placeholder.
3. User Dashboard Layout: A sidebar with navigation (Profile, Addresses, Orders, Wishlist) and a main content area.
4. Profile Settings Page: Form to edit First Name, Last Name, Email, and Avatar.
5. Address Management Component: 
   - A list of saved addresses displayed as cards.
   - An "Add New Address" modal containing: Street Address, Country (Dropdown), State (Dropdown), City (Dropdown), Zip Code, and a toggle for "Set as Default".

Ensure forms have clear validation states (using the Error/Danger color) and buttons use the Primary Brand color with hover effects.
```

---

## Module 2: Product Catalog
*(Entities: Product, Category, ProductCategory, ProductImage)*

**Prompt:**
```text
Generate the Product Catalog module for the E-Commerce application. Apply the global Light/Dark theme configuration.

Pages & Components to generate:
1. Main Navigation / Header: Search bar, Categories dropdown, Cart icon (with badge), and User avatar.
2. Homepage / Storefront: Hero banner, "Featured Categories" section (grid of category cards), and "Trending Products" carousel.
3. Product Listing Page (PLP): 
   - Sidebar with filters (Categories, Price Range, Rating).
   - A grid of Product Cards. Each card should show: Product Image, Title, Price, original price (strikethrough if discounted), Star Rating, and an "Add to Cart" quick-action button.
4. Product Detail Page (PDP):
   - Left side: An image gallery with a main image and smaller thumbnails below (based on ProductImage).
   - Right side: Product Title, Price, Description, Stock Status (In Stock / Out of Stock), Quantity selector, "Add to Cart" button, and an "Add to Wishlist" ghost button.

Ensure the grid is responsive (1 column on mobile, 3-4 columns on desktop). Use smooth transitions for hover states on product cards.
```

---

## Module 3: Cart & Wishlist
*(Entities: Cart, CartItem, Wishlist, WishlistItem)*

**Prompt:**
```text
Generate the Shopping Cart and Wishlist module for the E-Commerce application. Apply the global Light/Dark theme configuration.

Pages & Components to generate:
1. Shopping Cart Page:
   - A list of Cart Items. Each item row should have: Product Image, Title, Price, Quantity increment/decrement buttons, and a "Remove" (trash icon) button.
   - Order Summary section (Sticky on desktop right sidebar): Subtotal, Tax estimate, Shipping cost, and Total. Include a "Proceed to Checkout" button.
2. Slide-out Cart Drawer (Mini-cart): A compact version of the cart accessible from the header navigation.
3. Wishlist Page: A grid of products similar to the Product Listing Page, but with a prominent "Remove from Wishlist" button and a "Move to Cart" button on each card.
```

---

## Module 4: Checkout & Order Management
*(Entities: Order, OrderItem, OrderAddress, Payment, Coupon)*

**Prompt:**
```text
Generate the Checkout Flow and Order Management module for the E-Commerce application. Apply the global Light/Dark theme configuration.

Pages & Components to generate:
1. Multi-step Checkout Page:
   - Step 1: Shipping Address (Select from existing saved OrderAddresses or add a new one).
   - Step 2: Payment Method (Credit Card form, PayPal option) representing the Payment entity.
   - Right sidebar: Order Summary showing items, a "Promo/Coupon Code" input field with an "Apply" button, and the final Total.
   - Place Order button.
2. Order Success Page: A celebratory illustration, Order ID, Estimated Delivery Date, and a "Continue Shopping" button.
3. Order History Page (User Dashboard): 
   - A list/table of past orders showing Order ID, Date, Total Amount, Status (e.g., Pending, Shipped, Delivered) using color-coded badges, and a "View Details" button.
4. Order Detail Page: A breakdown of a specific order showing the shipping address used, payment method, itemized list of products (OrderItems), and tracking timeline.
```
