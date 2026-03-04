# 🔐 Clerk Authentication Setup Guide

## ✨ Why Clerk?

✅ **No email rate limits** - Unlike Supabase Auth  
✅ **Beautiful pre-built UI** - Professional sign-in/signup components  
✅ **Easy to integrate** - Works seamlessly with your existing database  
✅ **Free tier** - Generous limits for development and production  
✅ **Social logins** - Google, Facebook, etc. (optional)

---

## 📋 Setup Steps

### **Step 1: Create a Clerk Account**

1. Go to [https://clerk.com](https://clerk.com)
2. Click **"Start building for free"**
3. Sign up with your email or GitHub
4. Create a new application

### **Step 2: Get Your API Keys**

1. In your Clerk Dashboard, click on your application
2. Go to **"API Keys"** in the left sidebar
3. Copy your **Publishable Key** (starts with `pk_test_...`)

### **Step 3: Configure Environment Variables**

1. Create a `.env` file in your project root:
   ```bash
   cp .env.example .env
   ```

2. Add your Clerk key to `.env`:
   ```env
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-key
   
   # Clerk Authentication
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_key_here
   ```

### **Step 4: Update Your Supabase Database**

1. Open Supabase Dashboard → SQL Editor
2. Copy the **ENTIRE** content of `FRESH_DATABASE_SETUP.sql`
3. Paste and click **"Run"**
4. Wait for success message

**What this does:**
- Updates `profiles` table to use TEXT IDs (Clerk uses text, not UUIDs)
- Updates `wishlist`, `cart`, `orders` tables
- Removes Supabase auth triggers (not needed with Clerk)

### **Step 5: Test Your Setup**

1. Run your development server:
   ```bash
   npm run dev
   ```

2. Click **"Login"** or any feature requiring auth
3. You should see the beautiful Clerk sign-in modal!
4. Create an account - **No email limits!** ✨

---

## 🎨 Customizing Clerk Appearance

The Clerk components are already styled to match your Sri Durga Sarees theme with:
- Gold gradient buttons
- Dark theme colors
- Consistent font styles

To customize further, edit the `appearance` prop in `src/components/AuthModal.tsx`:

```tsx
<SignIn 
  appearance={{
    elements: {
      formButtonPrimary: "bg-gold-gradient hover:shadow-gold-lg",
      formFieldInput: "bg-primary/60 border-gold/30",
      // Add more customizations...
    }
  }}
/>
```

---

## 🔄 How It Works

### **Authentication Flow:**

1. **User signs up/in** → Clerk handles everything
2. **User data synced** → Automatically saved to Supabase `profiles` table
3. **User shops** → Cart, wishlist work with Clerk user ID
4. **No limits!** → Unlimited signups, no email rate limits

### **Code Structure:**

- **`src/hooks/useAuth.tsx`** - Main auth logic with Clerk
- **`src/components/AuthModal.tsx`** - Sign-in/Sign-up UI
- **`src/App.tsx`** - ClerkProvider wraps the app
- **Supabase** - Stores user profiles, products, cart, orders

---

## 🚀 Features Now Available

✅ **Instant signup** - No email confirmation needed  
✅ **Password reset** - Built-in by Clerk  
✅ **User profile** - Auto-synced to Supabase  
✅ **Session management** - Handled automatically  
✅ **Multi-device sync** - Works across devices  

---

## 🆘 Troubleshooting

### **Error: "Missing Clerk Publishable Key"**
- Make sure `.env` file exists in project root
- Check that `VITE_CLERK_PUBLISHABLE_KEY` is set correctly
- Restart your dev server after adding env variables

### **Users can't sign in**
- Verify Clerk API key is correct
- Check Clerk Dashboard → Users to see if accounts are created
- Look for errors in browser console (F12)

### **Profile not showing up**
- Check Supabase → Table Editor → `profiles`
- Ensure the table was updated with TEXT id type
- Check browser console for Supabase errors

### **Changes not reflecting**
- Clear browser cache (Ctrl+Shift+Delete)
- Hard refresh (Ctrl+F5)
- Check if you saved the `.env` file

---

## 📚 Additional Resources

- [Clerk Documentation](https://clerk.com/docs)
- [Clerk React Quickstart](https://clerk.com/docs/quickstarts/react)
- [Customizing Clerk Components](https://clerk.com/docs/components/customization/overview)

---

## 🎉 What's Next?

Your authentication is now rock-solid with Clerk! You can:

1. **Enable social logins** - Add Google, Facebook, etc. in Clerk Dashboard
2. **Add phone verification** - Enable SMS in Clerk settings
3. **Customize emails** - Brand your auth emails in Clerk
4. **Add user roles** - Implement admin/customer roles

---

**Need help?** Check the Clerk Dashboard logs or browser console for detailed error messages.

**Happy selling! 🛍️✨**
