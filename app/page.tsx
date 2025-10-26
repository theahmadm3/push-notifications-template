import PushNotificationManager from '@/components/PushNotificationManager';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Push Notifications PWA
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              A Next.js Progressive Web App with push notifications powered by web-push and Supabase
            </p>
          </div>

          <PushNotificationManager />

          <div className="mt-12 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Setup Instructions
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>Configure your Supabase project and add the credentials to .env</li>
              <li>Create a table named &quot;push_subscriptions&quot; in Supabase with columns: id, endpoint, p256dh, auth, created_at</li>
              <li>Enable push notifications in your browser</li>
              <li>Click &quot;Send Test Notification&quot; to test the functionality</li>
            </ol>
          </div>

          <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Features
            </h3>
            <ul className="list-disc list-inside space-y-1 text-blue-800 dark:text-blue-200">
              <li>Progressive Web App (PWA) with offline support</li>
              <li>Web Push notifications using web-push</li>
              <li>Subscription management with Supabase</li>
              <li>Service Worker for background notifications</li>
              <li>Modern Next.js App Router architecture</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
