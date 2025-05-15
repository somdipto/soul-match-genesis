
export interface User {
  id: string;
  email?: string;
  walletAddress?: string;
  name: string;
  bio: string;
  age: number;
  interests: string[];
  lookingFor: string[];
  location?: {
    latitude: number;
    longitude: number;
    city: string;
  };
  isProfileComplete: boolean;
  createdAt: string;
  lastActive: string;
}

export interface Match {
  id: string;
  userId: string;
  matchedUserId: string;
  matchPercentage: number;
  createdAt: string;
  user?: User;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  updatedAt: string;
  unreadCount: number;
}

export interface Report {
  id: string;
  reporterId: string;
  reportedUserId: string;
  reason: string;
  details: string;
  status: 'pending' | 'reviewed' | 'resolved';
  createdAt: string;
}

export type InterestCategory = 
  | 'music' 
  | 'movies' 
  | 'sports' 
  | 'books' 
  | 'food' 
  | 'travel' 
  | 'hobbies' 
  | 'tech' 
  | 'wellness' 
  | 'crypto';

export interface InterestOption {
  id: string;
  category: InterestCategory;
  label: string;
  iconName?: string;
}

export interface RizzSuggestion {
  id: string;
  text: string;
  category: 'flirty' | 'funny' | 'deep' | 'casual';
}
