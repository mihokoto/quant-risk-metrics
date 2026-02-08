# Authentication Setup Guide

## Step 0: Install Required Packages

Run this command in your terminal:

```bash
npm install @supabase/auth-helpers-nextjs
```

## Step 1: Run the Database Migration

You need to execute the SQL migration in your Supabase dashboard:

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Open the file: `supabase/migrations/001_create_profiles.sql`
4. Copy the entire SQL content and paste it into the SQL Editor
5. Click **Run** to create the profiles table and triggers

## Step 2: Enable Google OAuth (Optional)

If you want to enable Google sign-in:

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Enable **Google** provider
3. Follow Supabase's instructions to:
   - Create a Google Cloud project
   - Set up OAuth credentials
   - Add the authorized redirect URIs

## Step 3: Test Authentication

### Test Email/Password Sign Up:
1. Start your dev server: `npm run dev`
2. Open the app in your browser
3. Click "Sign In" in the top navigation
4. Switch to "Create Account" tab
5. Enter an email and password
6. Check your email for verification link

### Test the Profile Creation:
After signing up, you can verify the profile was created:

1. Go to Supabase dashboard
2. Navigate to **Table Editor** → **profiles**
3. You should see your new user with `subscription_tier` set to 'BASIC'

## Step 4: Environment Variables

Make sure your `.env.local` file contains:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## What's Working Now:

✅ Users can sign up with email/password
✅ Users can sign in with email/password  
✅ Users can sign in with Google (if configured)
✅ Profile is automatically created on signup
✅ User menu displays authentication status
✅ "Pro" badge shows for Pro tier users
✅ Sign out functionality

## Next Steps (Coming in Step 2):

- Implement tier gating (locking features for Basic users)
- Create the pricing/upgrade page
- Integrate Stripe for payments
- Add subscription management
