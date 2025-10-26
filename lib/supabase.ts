import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type PushSubscription = {
  id?: number;
  endpoint: string;
  p256dh: string;
  auth: string;
  user_type: 'user-type-1' | 'user-type-2';
  created_at?: string;
};
