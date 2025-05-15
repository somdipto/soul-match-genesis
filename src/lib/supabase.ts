
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client 
// Note: In a real application, these values should come from environment variables
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
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
  
  // Fix: Add null check for data before accessing index
  const message = data && data.length > 0 ? data[0] : null;
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
  
  // Fix: Add null check for data before accessing index
  const reportResult = data && data.length > 0 ? data[0] : null;
  return { report: reportResult, error };
}
