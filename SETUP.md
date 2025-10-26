# Quick Setup Guide

## Prerequisites
- Node.js 18 or higher
- A Supabase account (free tier works fine)

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Supabase

#### Create Supabase Project
1. Go to https://supabase.com
2. Create a new project
3. Wait for the project to be ready

#### Create Database Table
In your Supabase project's SQL Editor, run:
```sql
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id BIGSERIAL PRIMARY KEY,
  endpoint TEXT UNIQUE NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_push_subscriptions_endpoint ON push_subscriptions(endpoint);

ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on push_subscriptions" ON push_subscriptions
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

### 3. Get Supabase Credentials
1. Go to Project Settings > API
2. Copy your Project URL
3. Copy your `anon` `public` API key

### 4. Update Environment Variables

The `.env` file already contains generated VAPID keys. Update it with your Supabase credentials:

```env
# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase - UPDATE THESE
NEXT_PUBLIC_SUPABASE_URL=your_actual_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_supabase_anon_key

# Web Push VAPID Keys - Already generated, keep as is
NEXT_PUBLIC_VAPID_PUBLIC_KEY=BDl06ib5uIKGb6e1aTUqmBoO8MChg_jdBkXIVKK5Qio4xGrEH3Rz9gbtIiLHsu6c5Wr-NIhoD4UepYja_u67V3Q
VAPID_PRIVATE_KEY=GPLArNxujqICAJNS1IeBd7TCoPfH0C55pPGvtYjDPYs
VAPID_SUBJECT=mailto:your-email@example.com
```

### 5. Run the Development Server
```bash
npm run dev
```

Open http://localhost:3000 in your browser.

### 6. Test Push Notifications
1. Click "Enable Push Notifications"
2. Allow notifications when prompted
3. Click "Send Test Notification"
4. You should receive a push notification!

## Important Notes

- **HTTPS Required**: In production, push notifications only work over HTTPS
- **Browser Support**: Works in Chrome, Firefox, Edge, Safari 16+
- **Service Worker**: The service worker is disabled in development mode by default
- **Delete .env**: Remember to delete the `.env` file after adding your credentials and create `.env.local` instead for security

## Troubleshooting

### Notifications not working?
- Check browser console for errors
- Ensure you've allowed notifications in browser settings
- Verify Supabase credentials are correct
- Make sure the `push_subscriptions` table exists

### Build errors?
- Check that all environment variables are set
- Run `npm run build` to verify

### Service worker issues?
- Clear browser cache and reload
- Unregister old service workers in DevTools > Application > Service Workers
