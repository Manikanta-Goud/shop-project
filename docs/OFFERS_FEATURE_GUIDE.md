# Offers/Promotions Feature - Setup and Usage Guide

## Overview
This new feature allows you to manage promotional offers for your Sri Durga Sarees shop. You can create, edit, and delete offers from the admin portal, and they will automatically appear on your website's home page in the "Limited Edition Drops" section.

## 🗄️ Database Setup

### Step 1: Run the SQL Schema
1. Open your Supabase project dashboard
2. Go to the SQL Editor
3. Open the file: `supabase_offers_schema.sql`
4. Copy all the SQL code and run it in Supabase SQL Editor
5. This will create:
   - `offers` table with all necessary columns
   - Row Level Security (RLS) policies
   - Helper functions for fetching offers
   - Sample data (you can delete this after testing)

### What the Schema Creates:
- **offers table** with fields:
  - `id`: Auto-incrementing primary key
  - `title`: Offer title (e.g., "Heritage Temple Border Silk")
  - `description`: Brief description of the offer
  - `image`: Product image URL
  - `price`: Current price (e.g., "₹18,999")
  - `original_price`: Original price for showing discount
  - `discount_percentage`: Discount % (e.g., 24)
  - `category`: Product category (Sarees, Gajulu, Jewelry, etc.)
  - `tag`: Badge text (e.g., "TRENDING", "NEW ARRIVAL")
  - `is_active`: Whether offer is visible to customers
  - `is_featured`: Show in Limited Edition Drops section
  - `stock_count`: Number of items available
  - `countdown_end`: Optional countdown timer end date
  - `created_at`, `updated_at`: Timestamps

## 📋 Features

### Admin Portal Features
1. **Add New Offers**
   - Upload product images (drag & drop or browse)
   - Set pricing and discounts
   - Choose category
   - Add tags (NEW ARRIVAL, TRENDING, etc.)
   - Set stock count
   - Enable/disable offer visibility
   - Mark as featured to show in Limited Edition Drops
   - Optional countdown timer for urgency

2. **Manage Existing Offers**
   - View all offers in a table
   - See status (Active/Inactive, Featured)
   - Delete offers
   - Quick view of discount percentage and stock

3. **Statistics Dashboard**
   - Total number of offers
   - Active offers count
   - Featured offers count

### Frontend Display
- **Limited Edition Drops Section**: 
  - Only shows offers marked as "Featured" and "Active"
  - Displays countdown timer
  - Shows product image, price, discount, and stock
  - Responsive grid layout
  - If no featured offers exist, the section is hidden

## 🚀 How to Use

### Step 1: Access Admin Portal
1. Navigate to `/admin` or click "Admin Portal" in your navigation
2. Login with credentials:
   - Email: `admin@gmail.com`
   - Password: `123456`

### Step 2: Navigate to Offers Section
1. In the left sidebar, under "PROMOTIONS" section
2. Click on "Offers" tab

### Step 3: Create Your First Offer
1. Fill in the form on the left:
   - **Offer Title**: e.g., "Heritage Temple Border Silk"
   - **Description**: Brief description of the product
   - **Price**: Current selling price (e.g., ₹18,999)
   - **Original Price**: Regular price to show discount
   - **Discount %**: Calculate and show discount percentage
   - **Stock Count**: Number available (creates urgency)
   - **Category**: Sarees, Jewelry, Gajulu, Bridal, etc.
   - **Tag**: TRENDING, NEW ARRIVAL, LIMITED, etc.
   - **Countdown End**: Optional - set a deadline for the offer
   - **Image**: Upload or paste URL
   
2. Check the boxes:
   - ✅ **Active**: Makes offer visible to customers
   - ✅ **Featured**: Shows in Limited Edition Drops section

3. Click "Add Offer"

### Step 4: View on Your Website
1. Go back to the home page
2. Scroll to "Limited Edition Drops" section
3. Your featured offers will appear here automatically!

## 💡 Best Practices

### Creating Effective Offers
1. **Use High-Quality Images**: Clear, well-lit product photos
2. **Create Urgency**: 
   - Set low stock counts (3-7 pieces)
   - Add countdown timers
   - Use tags like "LIMITED" or "EXCLUSIVE"
3. **Show Value**: Always include original price to show discount
4. **Featured Wisely**: Only feature 2-4 best offers at a time
5. **Update Regularly**: Change featured offers weekly to keep fresh

### Suggested Categories
- Sarees
- Gajulu (Anklets)
- Jewelry
- Bridal
- Festival Collections
- Traditional
- Contemporary

### Suggested Tags
- NEW ARRIVAL
- TRENDING
- LIMITED EDITION
- EXCLUSIVE
- HANDMADE
- BEST SELLER
- SEASONAL

## 📊 Sample Offers (Included in Schema)

The SQL file includes 4 sample offers:
1. Heritage Temple Border Silk - ₹18,999 (24% off)
2. Royal Purple Pattu Silk - ₹22,499 (25% off)
3. Gold Temple Necklace Set - ₹45,999 (23% off)
4. Peacock Design Gajulu - ₹8,999 (31% off)

You can delete these after testing by clicking the trash icon in the admin panel.

## 🔧 Technical Details

### Files Created/Modified:
1. **supabase_offers_schema.sql**: Database schema
2. **src/hooks/useOffers.ts**: React hooks for offer management
3. **src/pages/Admin.tsx**: Added Offers management tab
4. **src/components/LimitedEditionDrops.tsx**: Updated to use database offers

### API Hooks Available:
- `useOffers()`: Fetch all offers
- `useFeaturedOffers()`: Fetch only featured offers
- `useOffersByCategory(category)`: Fetch offers by category
- `useAddOffer()`: Add new offer
- `useUpdateOffer()`: Update existing offer
- `useDeleteOffer()`: Delete offer
- `useToggleOfferStatus()`: Toggle active status

## 🎯 Marketing Strategy

### Weekly Offer Rotation
1. **Monday**: Update with new weekly offers
2. **Wednesday**: Check stock and update counts
3. **Friday**: Add weekend specials
4. **Sunday**: Plan next week's offers

### Seasonal Campaigns
- Festival seasons (Diwali, Pongal, Ugadi)
- Wedding seasons
- New year specials
- Summer/Winter collections

### Customer Engagement
1. Mark high-margin products as "Featured"
2. Use countdown timers for flash sales
3. Show substantial discounts (20-30%)
4. Keep stock counts low (5-10) for urgency
5. Rotate featured products to show variety

## 🛠️ Troubleshooting

**Offers not showing on website?**
- Check if offer is marked as both "Active" and "Featured"
- Refresh the page
- Check browser console for errors

**Can't upload images?**
- Ensure 'product-images' bucket exists in Supabase Storage
- Make bucket public
- Check file size (max 10MB)
- Use direct URL as alternative

**Error adding offers?**
- Check all required fields are filled
- Verify image URL is valid
- Check Supabase connection

## 📞 Support
For issues or questions, check:
1. Browser console for errors
2. Supabase logs in dashboard
3. Database policies are correctly set

---

**Happy Selling! ✨** Your offers will help attract more customers and increase sales!
