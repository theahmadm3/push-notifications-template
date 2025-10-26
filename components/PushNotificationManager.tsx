'use client';

import { useState, useEffect, useCallback } from 'react';

type UserType = 'user-type-1' | 'user-type-2';

export default function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [message, setMessage] = useState('');
  const [userType, setUserType] = useState<UserType>('user-type-1');
  const [subscribedUserType, setSubscribedUserType] = useState<UserType | null>(null);

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

      // Send subscription to server with user type
      const response = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription: sub,
          userType: userType,
        }),
      });

      if (response.ok) {
        setSubscription(sub);
        setSubscribedUserType(userType);
        setMessage(`Successfully subscribed as ${userType}!`);
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
      setSubscribedUserType(null);
      setMessage('Successfully unsubscribed from push notifications.');
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error);
      setMessage('Error unsubscribing from push notifications.');
    }
  }

  async function sendNotificationToOtherUser() {
    try {
      if (!subscribedUserType) {
        setMessage('Please subscribe first.');
        return;
      }

      // Determine the target user type based on current user type
      const targetUserType: UserType = subscribedUserType === 'user-type-1' ? 'user-type-2' : 'user-type-1';
      const actionType = subscribedUserType === 'user-type-1' ? 'send test notification' : 'received test notification';
      
      const response = await fetch('/api/push/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: `Notification from ${subscribedUserType}`,
          body: `${subscribedUserType} clicked "${actionType}" button`,
          icon: '/icon-192x192.png',
          targetUserType: targetUserType,
        }),
      });

      if (response.ok) {
        setMessage(`Notification sent to ${targetUserType}!`);
      } else {
        setMessage('Failed to send notification.');
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      setMessage('Error sending notification.');
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
      <div className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Push Notifications</h2>
        
        <div className="space-y-4">
          {!subscription ? (
            <>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Select User Type:
                </label>
                <select
                  value={userType}
                  onChange={(e) => setUserType(e.target.value as UserType)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="user-type-1">User Type 1</option>
                  <option value="user-type-2">User Type 2</option>
                </select>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {userType === 'user-type-1' 
                    ? 'Can send "send test notification" to notify user-type-2'
                    : 'Can send "received test notification" to notify user-type-1'}
                </p>
              </div>
              <button
                onClick={subscribeToPush}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Enable Push Notifications
              </button>
            </>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
                <span className="text-green-700 dark:text-green-400 font-medium">
                  Push notifications enabled as {subscribedUserType}
                </span>
              </div>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={sendNotificationToOtherUser}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                  {subscribedUserType === 'user-type-1' ? 'Send Test Notification' : 'Received Test Notification'}
                </button>
                <button
                  onClick={unsubscribeFromPush}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  Disable Notifications
                </button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {subscribedUserType === 'user-type-1'
                  ? 'Clicking "Send Test Notification" will notify all user-type-2 users'
                  : 'Clicking "Received Test Notification" will notify all user-type-1 users'}
              </p>
            </div>
          )}

          {message && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded">
              <p className="text-blue-800 dark:text-blue-200">{message}</p>
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
