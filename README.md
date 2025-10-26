# Push Notifications Template

A Next.js Progressive Web App (PWA) with push notifications powered by web-push and Supabase.

## Features

- ✅ Progressive Web App (PWA) with offline support
- ✅ Web Push notifications using web-push
- ✅ Subscription management with Supabase
- ✅ Service Worker for background notifications
- ✅ Modern Next.js App Router architecture
- ✅ TypeScript support
- ✅ Tailwind CSS styling

## Prerequisites

- Node.js 18+ 
- npm or yarn
- A Supabase account and project

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

### 4. Configure Supabase

1. Create a new project on [Supabase](https://supabase.com)
2. Go to Project Settings > API to find your project URL and anon key
3. In the SQL Editor, run the schema from `supabase-schema.sql` to create the `push_subscriptions` table

### 5. Set up environment variables

Copy the `.env.example` file and update it with your actual values:

```bash
cp .env.example .env.local
```

Then edit `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
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
3. **Storage**: The subscription is stored in Supabase's `push_subscriptions` table
4. **Sending**: The `/api/push/send` endpoint retrieves all subscriptions and sends notifications using web-push
5. **Receiving**: The service worker receives the push event and displays the notification

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
│   └── supabase.ts                 # Supabase client configuration
├── public/
│   ├── sw.js                       # Service worker
│   ├── manifest.json               # PWA manifest
│   └── icons/                      # PWA icons
├── supabase-schema.sql             # Database schema
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
  "icon": "/icon-192x192.png"
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
2. The Supabase RLS policy allows all operations. In production, you should implement proper authentication and restrict access.
3. Always use HTTPS in production for service workers and push notifications.

## License

MIT

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.
