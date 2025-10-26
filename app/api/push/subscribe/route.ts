import { NextRequest, NextResponse } from 'next/server';
import { backend } from '@/lib/backend';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const subscription = body.subscription;
    const userType = body.userType;

    if (!userType || !['user-type-1', 'user-type-2'].includes(userType)) {
      return NextResponse.json(
        { error: 'Invalid or missing user type' },
        { status: 400 }
      );
    }

    // Extract keys from subscription
    const endpoint = subscription.endpoint;
    const p256dh = subscription.keys.p256dh;
    const auth = subscription.keys.auth;

    // Store subscription in Django backend
    const data = await backend.subscribe({
      endpoint,
      p256dh,
      auth,
      user_type: userType,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error in subscribe endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { endpoint } = await request.json();

    // Remove subscription from Django backend
    await backend.unsubscribe(endpoint);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in unsubscribe endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
