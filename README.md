# Push Notifications Template

A Next.js Progressive Web App (PWA) with push notifications integrated with Django backend.

## Features

- ✅ Progressive Web App (PWA) with offline support
- ✅ Web Push notifications using Django backend
- ✅ Subscription management with Django backend
- ✅ Service Worker for background notifications
- ✅ Modern Next.js App Router architecture
- ✅ TypeScript support
- ✅ Tailwind CSS styling

## Prerequisites

- Node.js 18+ 
- npm or yarn
- A Django backend (default: https://fastapi-backend-nt2a.onrender.com)

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/theahmadm3/push-notifications-template.git
cd push-notifications-template
```

### 2. Install dependencies

```bash
npm install
```

### 3. Generate VAPID keys

VAPID keys are already generated in the `.env` file, but if you want to generate new ones:

```bash
npx web-push generate-vapid-keys
```

### 4. Configure Django Backend

The application is configured to use a Django backend at `https://fastapi-backend-nt2a.onrender.com` by default. 

The backend should provide these endpoints:
- `POST /subscribe` - Subscribe to push notifications
- `DELETE /subscribe` - Unsubscribe from push notifications
- `POST /notify` - Send push notifications to users

If you want to use a different backend URL, you can configure it in your environment variables.

### 5. Set up environment variables

Copy the `.env.example` file and update it with your actual values:

```bash
cp .env.example .env.local
```

Then edit `.env.local` with your Django backend URL and VAPID keys:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_BACKEND_URL=https://fastapi-backend-nt2a.onrender.com
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_vapid_public_key
VAPID_PRIVATE_KEY=your_vapid_private_key
VAPID_SUBJECT=mailto:your-email@example.com
```

### 6. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 7. Test push notifications

1. Click "Enable Push Notifications" button
2. Allow notifications when prompted by your browser
3. Click "Send Test Notification" to receive a test notification

## How It Works

### Push Notification Flow

1. **Service Worker Registration**: The app registers a service worker (`sw.js`) that handles push events
2. **Subscription**: When a user enables notifications, the browser creates a push subscription
3. **Storage**: The subscription is sent to the Django backend via the `/subscribe` endpoint
4. **Sending**: The `/api/push/send` endpoint forwards notification requests to the Django backend's `/notify` endpoint
5. **Receiving**: The Django backend sends push notifications to subscribed users, and the service worker receives the push event and displays the notification

### Project Structure

```
├── app/
│   ├── api/
│   │   └── push/
│   │       ├── subscribe/route.ts  # Subscribe/unsubscribe endpoint
│   │       └── send/route.ts       # Send notification endpoint
│   ├── layout.tsx                  # Root layout with PWA metadata
│   └── page.tsx                    # Main page
├── components/
│   └── PushNotificationManager.tsx # UI for managing subscriptions
├── lib/
│   └── backend.ts                  # Django backend client
├── public/
│   ├── sw.js                       # Service worker
│   ├── manifest.json               # PWA manifest
│   └── icons/                      # PWA icons
└── .env.example                    # Environment variables template
```

## API Endpoints

### POST /api/push/subscribe
Subscribe to push notifications

**Request body:**
```json
{
  "endpoint": "...",
  "keys": {
    "p256dh": "...",
    "auth": "..."
  }
}
```

### DELETE /api/push/subscribe
Unsubscribe from push notifications

**Request body:**
```json
{
  "endpoint": "..."
}
```

### POST /api/push/send
Send a push notification to all subscribers

**Request body:**
```json
{
  "title": "Notification Title",
  "body": "Notification message",
  "icon": "/icon-192x192.png",
  "targetUserType": "user-type-1"
}
```

## Django Backend Endpoints

The Django backend at `https://fastapi-backend-nt2a.onrender.com` provides:

### POST /subscribe
Store a push subscription

**Request body:**
```json
{
  "endpoint": "...",
  "p256dh": "...",
  "auth": "...",
  "user_type": "user-type-1"
}
```

### DELETE /subscribe
Remove a push subscription

**Request body:**
```json
{
  "endpoint": "..."
}
```

### POST /notify
Send push notifications to subscribed users

**Request body:**
```json
{
  "title": "Notification Title",
  "body": "Notification message",
  "icon": "/icon-192x192.png",
  "targetUserType": "user-type-1"
}
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository to Vercel
3. Add your environment variables in Vercel's project settings
4. Deploy!

### Other Platforms

Make sure to:
- Set all environment variables
- Use HTTPS (required for service workers and push notifications)
- Configure your domain in the `NEXT_PUBLIC_APP_URL` variable

## Browser Support

Push notifications are supported in:
- Chrome/Edge 50+
- Firefox 44+
- Safari 16+ (macOS 13+)
- Opera 37+

Note: Push notifications require HTTPS in production.

## Security Notes

1. The `.env` file contains generated VAPID keys for development. **Delete this file** and create your own `.env.local` with your own keys for production.
2. Always use HTTPS in production for service workers and push notifications.
3. Ensure your Django backend implements proper authentication and authorization for the endpoints.

## License

MIT

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.
