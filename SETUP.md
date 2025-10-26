# Quick Setup Guide

## Prerequisites
- Node.js 18 or higher
- A Django backend (default: https://fastapi-backend-nt2a.onrender.com)

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Django Backend

The application is configured to use a Django backend at `https://fastapi-backend-nt2a.onrender.com` by default.

The backend should provide these endpoints:
- `POST /subscribe` - Store push subscriptions
- `DELETE /subscribe` - Remove push subscriptions
- `POST /notify` - Send push notifications to users

If you want to use a different backend, you can configure it in your environment variables.

### 3. Update Environment Variables

The `.env` file already contains generated VAPID keys. Update it with your backend URL if needed:

```env
# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Django Backend
NEXT_PUBLIC_BACKEND_URL=https://fastapi-backend-nt2a.onrender.com

# Web Push VAPID Keys - Already generated, keep as is
NEXT_PUBLIC_VAPID_PUBLIC_KEY=BDl06ib5uIKGb6e1aTUqmBoO8MChg_jdBkXIVKK5Qio4xGrEH3Rz9gbtIiLHsu6c5Wr-NIhoD4UepYja_u67V3Q
VAPID_PRIVATE_KEY=GPLArNxujqICAJNS1IeBd7TCoPfH0C55pPGvtYjDPYs
VAPID_SUBJECT=mailto:your-email@example.com
```

### 4. Run the Development Server
```bash
npm run dev
```

Open http://localhost:3000 in your browser.

### 5. Test Push Notifications
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
- Verify the Django backend is running and accessible
- Make sure the backend endpoints are working correctly

### Build errors?
- Check that all environment variables are set
- Run `npm run build` to verify

### Service worker issues?
- Clear browser cache and reload
- Unregister old service workers in DevTools > Application > Service Workers
