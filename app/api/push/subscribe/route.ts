import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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

    // Store subscription in Supabase
    const { data, error } = await supabase
      .from('push_subscriptions')
      .upsert(
        {
          endpoint,
          p256dh,
          auth,
          user_type: userType,
        },
        {
          onConflict: 'endpoint',
        }
      )
      .select();

    if (error) {
      console.error('Error storing subscription:', error);
      return NextResponse.json(
        { error: 'Failed to store subscription' },
        { status: 500 }
      );
    }

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

    // Remove subscription from Supabase
    const { error } = await supabase
      .from('push_subscriptions')
      .delete()
      .eq('endpoint', endpoint);

    if (error) {
      console.error('Error removing subscription:', error);
      return NextResponse.json(
        { error: 'Failed to remove subscription' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in unsubscribe endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
