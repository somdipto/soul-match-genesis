
// This file contains TypeScript types for the database schema
// It temporarily lets us bypass TypeScript errors until the real database is set up

export type Tables = {
  profiles: {
    Row: {
      id: string;
      name: string | null;
      bio: string | null;
      age: number | null;
      interests: string[] | null;
      looking_for: string[] | null;
      location: any | null;
      is_profile_complete: boolean;
      wallet_address: string | null;
      email: string | null;
      created_at: string;
      updated_at: string;
      last_active: string;
      is_email_verified: boolean;
    };
    Insert: {
      id: string;
      name?: string | null;
      bio?: string | null;
      age?: number | null;
      interests?: string[] | null;
      looking_for?: string[] | null;
      location?: any | null;
      is_profile_complete?: boolean;
      wallet_address?: string | null;
      email?: string | null;
      created_at?: string;
      updated_at?: string;
      last_active?: string;
      is_email_verified?: boolean;
    };
    Update: {
      id?: string;
      name?: string | null;
      bio?: string | null;
      age?: number | null;
      interests?: string[] | null;
      looking_for?: string[] | null;
      location?: any | null;
      is_profile_complete?: boolean;
      wallet_address?: string | null;
      email?: string | null;
      created_at?: string;
      updated_at?: string;
      last_active?: string;
      is_email_verified?: boolean;
    };
  };
  matches: {
    Row: {
      id: string;
      user_id: string;
      matched_user_id: string;
      match_percentage: number | null;
      created_at: string;
    };
    Insert: {
      id?: string;
      user_id: string;
      matched_user_id: string;
      match_percentage?: number | null;
      created_at?: string;
    };
    Update: {
      id?: string;
      user_id?: string;
      matched_user_id?: string;
      match_percentage?: number | null;
      created_at?: string;
    };
  };
  conversations: {
    Row: {
      id: string;
      created_at: string;
      updated_at: string;
    };
    Insert: {
      id?: string;
      created_at?: string;
      updated_at?: string;
    };
    Update: {
      id?: string;
      created_at?: string;
      updated_at?: string;
    };
  };
  conversation_participants: {
    Row: {
      conversation_id: string;
      user_id: string;
    };
    Insert: {
      conversation_id: string;
      user_id: string;
    };
    Update: {
      conversation_id?: string;
      user_id?: string;
    };
  };
  messages: {
    Row: {
      id: string;
      conversation_id: string;
      sender_id: string;
      content: string;
      read: boolean;
      created_at: string;
    };
    Insert: {
      id?: string;
      conversation_id: string;
      sender_id: string;
      content: string;
      read?: boolean;
      created_at?: string;
    };
    Update: {
      id?: string;
      conversation_id?: string;
      sender_id?: string;
      content?: string;
      read?: boolean;
      created_at?: string;
    };
  };
  reports: {
    Row: {
      id: string;
      reporter_id: string;
      reported_user_id: string;
      reason: string;
      details: string | null;
      status: string;
      created_at: string;
    };
    Insert: {
      id?: string;
      reporter_id: string;
      reported_user_id: string;
      reason: string;
      details?: string | null;
      status?: string;
      created_at?: string;
    };
    Update: {
      id?: string;
      reporter_id?: string;
      reported_user_id?: string;
      reason?: string;
      details?: string | null;
      status?: string;
      created_at?: string;
    };
  };
};

export type Database = {
  public: {
    Tables: Tables;
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
};
