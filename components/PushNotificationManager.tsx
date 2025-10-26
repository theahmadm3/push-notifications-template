'use client';

import { useState, useEffect, useCallback } from 'react';

export default function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [message, setMessage] = useState('');

  const registerServiceWorker = useCallback(async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none',
      });
      
      const sub = await registration.pushManager.getSubscription();
      setSubscription(sub);
    } catch (error) {
      console.error('Service worker registration failed:', error);
    }
  }, []);

  useEffect(() => {
    const checkSupport = () => {
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        setIsSupported(true);
        void registerServiceWorker();
      }
    };
    checkSupport();
  }, [registerServiceWorker]);

  async function subscribeToPush() {
    try {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
        ),
      });

      // Send subscription to server
      const response = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sub),
      });

      if (response.ok) {
        setSubscription(sub);
        setMessage('Successfully subscribed to push notifications!');
      } else {
        setMessage('Failed to subscribe to push notifications.');
      }
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      setMessage('Error subscribing to push notifications.');
    }
  }

  async function unsubscribeFromPush() {
    try {
      if (!subscription) return;

      await subscription.unsubscribe();

      // Remove subscription from server
      await fetch('/api/push/subscribe', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ endpoint: subscription.endpoint }),
      });

      setSubscription(null);
      setMessage('Successfully unsubscribed from push notifications.');
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error);
      setMessage('Error unsubscribing from push notifications.');
    }
  }

  async function sendTestNotification() {
    try {
      const response = await fetch('/api/push/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Test Notification',
          body: 'This is a test push notification!',
          icon: '/icon-192x192.png',
        }),
      });

      if (response.ok) {
        setMessage('Test notification sent!');
      } else {
        setMessage('Failed to send test notification.');
      }
    } catch (error) {
      console.error('Error sending test notification:', error);
      setMessage('Error sending test notification.');
    }
  }

  if (!isSupported) {
    return (
      <div className="p-4 bg-yellow-100 border border-yellow-400 rounded">
        <p className="text-yellow-800">
          Push notifications are not supported in this browser.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="p-6 bg-white border rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold mb-4">Push Notifications</h2>
        
        <div className="space-y-4">
          {!subscription ? (
            <button
              onClick={subscribeToPush}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Enable Push Notifications
            </button>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
                <span className="text-green-700 font-medium">
                  Push notifications enabled
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={sendTestNotification}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                  Send Test Notification
                </button>
                <button
                  onClick={unsubscribeFromPush}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  Disable Notifications
                </button>
              </div>
            </div>
          )}

          {message && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded">
              <p className="text-blue-800">{message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
