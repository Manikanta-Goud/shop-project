# Real-time Product Management Setup

## Overview
This setup enables real-time synchronization between your admin portal and frontend. When you add, update, or delete products in the admin portal, the changes are **immediately reflected** on the frontend without any page refresh.

## How It Works

### 1. **React Query Cache Invalidation**
When you add or delete a product in the admin portal:
- The operation is saved to Supabase database
- React Query cache is invalidated using `queryClient.invalidateQueries()`
- All components using `useProducts()` or `useSarees()` hooks automatically refetch the latest data

### 2. **Real-time Subscriptions (Optional but Recommended)**
For instant updates across multiple tabs/browsers:
- Supabase real-time subscriptions listen for database changes
- When any change occurs in the `products` table, all connected clients are notified
- The `useProductsRealtime()` hook automatically invalidates queries when changes are detected

## Setup Instructions

### Step 1: Run SQL Migration
Run the SQL script in your Supabase SQL Editor to enable real-time and admin policies:

```bash
# File: supabase_realtime_setup.sql
```

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy and paste the contents of `supabase_realtime_setup.sql`
5. Click **Run**

### Step 2: Verify Environment Variables
Make sure your `.env` file has the correct Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Step 3: Enable Real-time in Supabase Dashboard (Alternative)
If the SQL script doesn't work, you can enable real-time manually:

1. Go to **Database** → **Replication** in Supabase Dashboard
2. Find the `products` table
3. Toggle **Enable Real-time** to ON

## Features Implemented

### Admin Portal (`src/pages/Admin.tsx`)
✅ Add products to Supabase database
✅ Delete products from Supabase database
✅ Automatic cache invalidation after operations
✅ Image upload support (requires 'product-images' storage bucket)
✅ Instant local feedback with `fetchData()`

### Frontend Components (`src/components/ProductGrid.tsx`)
✅ Real-time data fetching with `useProducts()` hook
✅ Automatic refetch when window regains focus
✅ 30-second stale time for optimal performance
✅ Real-time subscriptions with `useProductsRealtime()` hook
✅ Instant UI updates when products change

### Custom Hooks
- **`useProducts(type, category)`** - Fetches products by type and category
- **`useSarees(category)`** - Fetches saree products specifically
- **`useProductsRealtime()`** - Enables real-time subscriptions for instant updates

## Testing the Integration

### Test 1: Basic Functionality
1. Open your website in one browser tab
2. Open the admin portal (`/admin`) in another tab
3. Login to admin (admin@gmail.com / 123456)
4. Add a new saree with all details
5. **Expected Result**: The new saree should appear on the frontend within 1-2 seconds

### Test 2: Real-time Updates
1. Open the website on two different browsers or devices
2. Add/delete a product from admin portal
3. **Expected Result**: Both browsers should show the update immediately

### Test 3: Category Filtering
1. Add products with different categories (e.g., "Kanchipuram", "Banarasi")
2. Switch categories in the frontend
3. **Expected Result**: Correct products should be displayed based on category filter

## Troubleshooting

### Products not appearing immediately?
1. Check browser console for errors
2. Verify Supabase credentials in `.env`
3. Check if SQL policies are set correctly
4. Ensure real-time is enabled for `products` table

### Real-time not working?
1. Run the SQL migration script in Supabase
2. Check if real-time is enabled in Database → Replication
3. Look for "Real-time update received:" logs in browser console
4. Verify your Supabase plan includes real-time features

### Permission errors when adding products?
1. Check RLS policies in Supabase Dashboard (Database → Policies)
2. Ensure the policies allow INSERT/UPDATE/DELETE operations
3. For production, implement proper admin role checks

## Architecture

```
User adds product in Admin Portal
         ↓
Product saved to Supabase
         ↓
queryClient.invalidateQueries() called
         ↓
All useProducts() hooks refetch data
         ↓
Frontend UI updates immediately
         ↓
Real-time subscription also triggered (parallel)
         ↓
Other tabs/browsers receive update instantly
```

## Performance Optimization

- **Stale Time**: Data is considered fresh for 30 seconds to avoid unnecessary refetches
- **Refetch on Focus**: Automatically refetch when user returns to the tab
- **Selective Invalidation**: Only product queries are invalidated, not all data
- **Real-time**: Only subscribe to products table, not entire database

## Security Notes

⚠️ **Important**: The current setup allows anyone to add/update/delete products. For production:

1. Implement proper authentication checks
2. Use role-based access control (RBAC)
3. Restrict admin operations to verified admin users
4. See commented section in `supabase_realtime_setup.sql` for admin-only policies

## Next Steps

1. ✅ Test the integration thoroughly
2. ✅ Create 'product-images' storage bucket in Supabase for image uploads
3. ✅ Configure storage policies for public image access
4. ⬜ Implement proper admin authentication
5. ⬜ Add pagination for large product lists
6. ⬜ Add search and sorting functionality
