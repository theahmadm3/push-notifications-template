import { NextRequest, NextResponse } from 'next/server';
import { backend } from '@/lib/backend';

export async function POST(request: NextRequest) {
  try {
    const { title, body, icon, targetUserType } = await request.json();

    if (!targetUserType || !['user-type-1', 'user-type-2'].includes(targetUserType)) {
      return NextResponse.json(
        { error: 'Invalid or missing target user type' },
        { status: 400 }
      );
    }

    // Send notification request to Django backend
    const result = await backend.notify({
      title: title || 'Push Notification',
      body: body || 'You have a new notification!',
      icon: icon || '/icon-192x192.png',
      targetUserType,
    });

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Error in send endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
