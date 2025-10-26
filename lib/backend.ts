const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://fastapi-backend-nt2a.onrender.com';

export type PushSubscription = {
  id?: number;
  endpoint: string;
  p256dh: string;
  auth: string;
  user_type: 'user-type-1' | 'user-type-2';
  created_at?: string;
};

export const backend = {
  async subscribe(subscription: PushSubscription) {
    const response = await fetch(`${BACKEND_URL}/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscription),
    });

    if (!response.ok) {
      throw new Error(`Failed to subscribe: ${response.statusText}`);
    }

    return response.json();
  },

  async unsubscribe(endpoint: string) {
    const response = await fetch(`${BACKEND_URL}/subscribe`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ endpoint }),
    });

    if (!response.ok) {
      throw new Error(`Failed to unsubscribe: ${response.statusText}`);
    }

    return response.json();
  },

  async notify(payload: {
    title: string;
    body: string;
    icon: string;
    targetUserType: 'user-type-1' | 'user-type-2';
  }) {
    const response = await fetch(`${BACKEND_URL}/notify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Failed to send notification: ${response.statusText}`);
    }

    return response.json();
  },
};
