
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { Conversation, User } from '@/types';

interface ConversationListProps {
  conversations: Conversation[];
  onSelectConversation: (conversationId: string) => void;
  selectedConversationId: string | null;
  profiles: Record<string, User>;
  currentUserId: string;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  onSelectConversation,
  selectedConversationId,
  profiles,
  currentUserId,
}) => {
  // Get other participant ID from conversation
  const getOtherParticipantId = (conversation: Conversation): string => {
    return conversation.participants.find(id => id !== currentUserId) || '';
  };

  // Get profile name for a user ID
  const getProfileName = (userId: string): string => {
    return profiles[userId]?.name || 'Unknown User';
  };

  return (
    <Card className="h-full glass-morphism bg-datex-card border-datex-purple/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-white">Messages</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-280px)]">
          <div className="px-4 py-2 space-y-2">
            {conversations.length === 0 ? (
              <div className="py-8 text-center text-white/50">
                <p>No conversations yet</p>
                <p className="text-xs mt-1">Match with someone to start chatting</p>
              </div>
            ) : (
              conversations.map((conversation) => {
                const otherUserId = getOtherParticipantId(conversation);
                const otherUserName = getProfileName(otherUserId);
                const isSelected = selectedConversationId === conversation.id;
                const hasUnread = conversation.unreadCount > 0;
                
                return (
                  <div
                    key={conversation.id}
                    className={`p-3 rounded-md cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-datex-purple/30 border border-datex-purple/50'
                        : 'hover:bg-datex-purple/10 border border-transparent'
                    }`}
                    onClick={() => onSelectConversation(conversation.id)}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-medium text-white">{otherUserName}</h3>
                      <span className="text-xs text-white/50">
                        {conversation.lastMessage && 
                          formatDistanceToNow(new Date(conversation.updatedAt), { addSuffix: true })}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <p className="text-sm line-clamp-1 text-white/70">
                        {conversation.lastMessage?.content || 'Start a conversation'}
                      </p>
                      
                      {hasUnread && (
                        <Badge className="bg-datex-purple text-white ml-2">
                          {conversation.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ConversationList;
