/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope;

// Listen for push events
self.addEventListener('push', (event: PushEvent) => {
  if (!event.data) {
    return;
  }

  const data = event.data.json();
  const title = data.title || 'Push Notification';
  const options = {
    body: data.body || 'You have a new notification!',
    icon: data.icon || '/icon-192x192.png',
    badge: '/icon-192x192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Listen for notification clicks
self.addEventListener('notificationclick', (event: NotificationEvent) => {
  event.notification.close();

  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clientList) => {
      // If a window is already open, focus it
      for (const client of clientList) {
        if (client.url === self.registration.scope && 'focus' in client) {
          return client.focus();
        }
      }
      // If no window is open, open a new one
      if (self.clients.openWindow) {
        return self.clients.openWindow('/');
      }
    })
  );
});

export {};
