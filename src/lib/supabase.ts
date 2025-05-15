import { createClient } from '@supabase/supabase-js';
import { supabase as supabaseClient } from '@/integrations/supabase/client';

// Re-export the supabase client from the integration
export const supabase = supabaseClient;

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent'
      }
    },
  });
  
  return { data, error };
}

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  return { data, error };
}

export async function signUpWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    }
  });
  
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  return { user: data.user, error };
}

export async function createUserProfile(userId: string, profile: Partial<any>) {
  const { data, error } = await supabase
    .from('profiles')
    .insert([{ id: userId, ...profile }]);
  
  return { data, error };
}

export async function updateUserProfile(userId: string, updates: Partial<any>) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);
  
  return { data, error };
}

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  return { profile: data, error };
}

export async function getMatches(userId: string) {
  const { data, error } = await supabase
    .from('matches')
    .select(`
      *,
      matched_user:profiles!matched_user_id(*)
    `)
    .eq('user_id', userId);
  
  return { matches: data, error };
}

export async function getConversations(userId: string) {
  const { data, error } = await supabase
    .from('conversations')
    .select(`
      *,
      participants:conversation_participants(user_id),
      last_message:messages(*)
    `)
    .contains('participants', [userId])
    .order('updated_at', { ascending: false });
  
  return { conversations: data, error };
}

export async function getMessages(conversationId: string) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });
  
  return { messages: data, error };
}

export async function sendMessage(conversationId: string, senderId: string, content: string) {
  const { data, error } = await supabase
    .from('messages')
    .insert([
      { 
        conversation_id: conversationId,
        sender_id: senderId,
        content
      }
    ]);
  
  // Fix the TypeScript error by not checking length on potentially null data
  const message = data ? data[0] : null;
  return { message, error };
}

export async function createReport(report: Omit<any, 'id' | 'created_at' | 'status'>) {
  const { data, error } = await supabase
    .from('reports')
    .insert([
      { 
        ...report,
        status: 'pending'
      }
    ]);
  
  // Fix the TypeScript error by not checking length on potentially null data
  const reportResult = data ? data[0] : null;
  return { report: reportResult, error };
}
