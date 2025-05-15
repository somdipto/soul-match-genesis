
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import SiteHeader from '@/components/layout/SiteHeader';
import ConversationList from '@/components/dashboard/ConversationList';
import ChatInterface from '@/components/chat/ChatInterface';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Conversation, Message, User } from '@/types';
import { toast } from '@/hooks/use-toast';

const MessagesPage = () => {
  const { user, profile, loading } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [profiles, setProfiles] = useState<Record<string, User>>({});
  const [unreadCount, setUnreadCount] = useState(0);
  
  // If user is not authenticated, redirect to login
  if (!user && !loading) {
    return <Navigate to="/auth" replace />;
  }
  
  // If profile is not complete, redirect to profile setup
  if (user && !profile?.isProfileComplete && !loading) {
    return <Navigate to="/setup-profile" replace />;
  }
  
  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      if (!user?.id) return;
      
      try {
        setLoadingConversations(true);
        
        // In a real app, you'd fetch real conversations from the database
        // For demo purposes, we'll create mock data
        const mockConversations: Conversation[] = [
          {
            id: 'conv-1',
            participants: [user.id, 'user-2'],
            updatedAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
            unreadCount: 2,
          },
          {
            id: 'conv-2',
            participants: [user.id, 'user-3'],
            updatedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            unreadCount: 0,
          },
        ];
        
        // Mock last messages
        const mockLastMessages: Record<string, Message> = {
          'conv-1': {
            id: 'msg-1',
            senderId: 'user-2',
            receiverId: user.id,
            content: "Hey there! I noticed we both love Web3 tech. What projects are you currently excited about?",
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            read: false,
          },
          'conv-2': {
            id: 'msg-2',
            senderId: user.id,
            receiverId: 'user-3',
            content: "I'd love to hear more about your experience with DeFi platforms.",
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            read: true,
          },
        };
        
        // Add last messages to conversations
        const conversationsWithLastMessages = mockConversations.map(conv => ({
          ...conv,
          lastMessage: mockLastMessages[conv.id],
        }));
        
        setConversations(conversationsWithLastMessages);
        
        // Calculate total unread count
        const totalUnread = conversationsWithLastMessages.reduce(
          (sum, conv) => sum + conv.unreadCount,
          0
        );
        setUnreadCount(totalUnread);
        
        // Set the first conversation as selected by default
        if (conversationsWithLastMessages.length > 0 && !selectedConversationId) {
          setSelectedConversationId(conversationsWithLastMessages[0].id);
        }
        
        // Fetch user profiles for participants
        const userIds = new Set<string>();
        conversationsWithLastMessages.forEach(conv => {
          conv.participants.forEach(id => {
            if (id !== user.id) userIds.add(id);
          });
        });
        
        // Mock profiles data
        const mockProfiles: Record<string, User> = {
          'user-2': {
            id: 'user-2',
            name: 'Alex',
            bio: 'Blockchain developer and crypto enthusiast. Love discussing the future of Web3.',
            age: 28,
            interests: ['Web3', 'DeFi', 'Blockchain', 'Coding', 'Hiking'],
            lookingFor: ['dating', 'friendship'],
            createdAt: new Date(Date.now() - 604800000).toISOString(), // 1 week ago
            lastActive: new Date(Date.now() - 3000000).toISOString(), // 50 min ago
            isProfileComplete: true,
          },
          'user-3': {
            id: 'user-3',
            name: 'Sam',
            bio: 'NFT artist and collector. Passionate about the intersection of art and technology.',
            age: 31,
            interests: ['NFTs', 'Digital Art', 'Music', 'Photography', 'Travel'],
            lookingFor: ['networking', 'dating'],
            createdAt: new Date(Date.now() - 1209600000).toISOString(), // 2 weeks ago
            lastActive: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            isProfileComplete: true,
          },
        };
        
        setProfiles(mockProfiles);
        
      } catch (error) {
        console.error('Error fetching conversations:', error);
        toast({
          title: "Error Loading Conversations",
          description: "Could not load your conversations at this time",
          variant: "destructive",
        });
      } finally {
        setLoadingConversations(false);
      }
    };
    
    fetchConversations();
  }, [user?.id]);
  
  // Fetch messages when conversation is selected
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedConversationId) return;
      
      try {
        setLoadingMessages(true);
        
        // In a real app, you'd fetch real messages from the database
        // For demo purposes, we'll create mock data
        const mockMessages: Record<string, Message[]> = {
          'conv-1': [
            {
              id: 'msg-conv1-1',
              senderId: 'user-2',
              receiverId: user?.id || '',
              content: "Hey there! I noticed we both love Web3 tech. What projects are you currently excited about?",
              createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
              read: false,
            },
            {
              id: 'msg-conv1-2',
              senderId: 'user-2',
              receiverId: user?.id || '',
              content: "I've been exploring some interesting DeFi platforms lately.",
              createdAt: new Date(Date.now() - 3500000).toISOString(), // 58 minutes ago
              read: false,
            },
          ],
          'conv-2': [
            {
              id: 'msg-conv2-1',
              senderId: 'user-3',
              receiverId: user?.id || '',
              content: "Hi! I saw that you're into NFTs too. Have you minted any of your own?",
              createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
              read: true,
            },
            {
              id: 'msg-conv2-2',
              senderId: user?.id || '',
              receiverId: 'user-3',
              content: "Yes, I've minted a few art pieces! Been fun exploring the space.",
              createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
              read: true,
            },
            {
              id: 'msg-conv2-3',
              senderId: user?.id || '',
              receiverId: 'user-3',
              content: "I'd love to hear more about your experience with DeFi platforms.",
              createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
              read: true,
            },
          ],
        };
        
        setMessages(mockMessages[selectedConversationId] || []);
        
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoadingMessages(false);
      }
    };
    
    fetchMessages();
  }, [selectedConversationId, user?.id]);
  
  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    
    // Mark conversation as read in UI
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversationId 
          ? { ...conv, unreadCount: 0 } 
          : conv
      )
    );
    
    // Update total unread count
    const updatedUnreadCount = conversations.reduce(
      (sum, conv) => sum + (conv.id === conversationId ? 0 : conv.unreadCount),
      0
    );
    setUnreadCount(updatedUnreadCount);
  };
  
  const handleSendMessage = async (content: string) => {
    if (!selectedConversationId || !user?.id) return;
    
    // Get the other participant
    const conversation = conversations.find(c => c.id === selectedConversationId);
    if (!conversation) return;
    
    const otherParticipantId = conversation.participants.find(id => id !== user.id);
    if (!otherParticipantId) return;
    
    // Create new message
    const newMessage: Message = {
      id: `msg-new-${Date.now()}`,
      senderId: user.id,
      receiverId: otherParticipantId,
      content,
      createdAt: new Date().toISOString(),
      read: true,
    };
    
    // Update messages in UI
    setMessages(prev => [...prev, newMessage]);
    
    // Update conversation with last message
    setConversations(prev => 
      prev.map(conv => 
        conv.id === selectedConversationId 
          ? { 
              ...conv, 
              lastMessage: newMessage,
              updatedAt: newMessage.createdAt,
            } 
          : conv
      )
    );
    
    // In a real app, you'd send the message to the database and handle real-time updates
  };
  
  // Get the other user in the selected conversation
  const getOtherUser = (): User | null => {
    if (!selectedConversationId || !user?.id) return null;
    
    const conversation = conversations.find(c => c.id === selectedConversationId);
    if (!conversation) return null;
    
    const otherParticipantId = conversation.participants.find(id => id !== user.id);
    if (!otherParticipantId) return null;
    
    return profiles[otherParticipantId] || null;
  };
  
  const otherUser = getOtherUser();
  
  return (
    <div className="min-h-screen w-full bg-datex-black overflow-hidden flex flex-col">
      <SiteHeader activePage="messages" unreadMessageCount={unreadCount} />
      
      <main className="flex-grow flex flex-col relative">
        {/* Gradient background */}
        <div 
          className="absolute inset-0 bg-datex-gradient opacity-80 z-0"
        />
        
        <div className="relative z-10 flex-grow flex flex-col md:flex-row p-4 gap-4 max-w-6xl mx-auto w-full">
          {/* Conversations sidebar */}
          <div className="w-full md:w-1/3 lg:w-1/4">
            <ConversationList
              conversations={conversations}
              onSelectConversation={handleSelectConversation}
              selectedConversationId={selectedConversationId}
              profiles={profiles}
              currentUserId={user?.id || ''}
            />
          </div>
          
          {/* Chat interface */}
          <div className="w-full md:w-2/3 lg:w-3/4">
            {selectedConversationId && profile && otherUser ? (
              <ChatInterface
                conversationId={selectedConversationId}
                currentUser={profile}
                otherUser={otherUser}
                messages={messages}
                onSendMessage={handleSendMessage}
              />
            ) : (
              <div className="h-full glass-morphism bg-datex-card border-datex-purple/30 flex items-center justify-center text-white/50">
                <p>Select a conversation to start chatting</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MessagesPage;
