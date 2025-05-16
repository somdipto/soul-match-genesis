
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Message as MessageType, User, RizzSuggestion } from '@/types';
import { supabase } from '@/lib/supabase';
import { Send, Sparkles } from 'lucide-react';
import { formatRelative } from 'date-fns';

interface ChatInterfaceProps {
  conversationId: string;
  currentUser: User;
  otherUser: User;
  messages: MessageType[];
  onSendMessage: (content: string) => Promise<void>;
}

// Sample rizz suggestions
const rizzSuggestions: RizzSuggestion[] = [
  { id: '1', text: "I'm fascinated by your interest in Web3. What aspects of it excite you the most?", category: 'deep' },
  { id: '2', text: "If your personality was a crypto coin, I'd invest everything I have 📈", category: 'flirty' },
  { id: '3', text: "Your thoughts on DeFi are as impressive as your profile", category: 'flirty' },
  { id: '4', text: "What's been the highlight of your day so far?", category: 'casual' },
  { id: '5', text: "I see we both like indie films. Have you watched anything good lately?", category: 'casual' },
  { id: '6', text: "You seem like someone who has interesting stories to tell", category: 'deep' },
  { id: '7', text: "What's your vision for how Web3 changes dating?", category: 'deep' },
  { id: '8', text: "I'd sacrifice my best NFT for a coffee date with you ☕", category: 'flirty' },
  { id: '9', text: "Is your personality as attractive as your interests suggest? I'm betting yes", category: 'flirty' },
  { id: '10', text: "What's your favorite way to spend a weekend?", category: 'casual' },
];

const Message: React.FC<{ message: MessageType; isCurrentUser: boolean }> = ({
  message,
  isCurrentUser,
}) => {
  return (
    <div
      className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-3`}
    >
      <div
        className={`max-w-[80%] rounded-lg px-4 py-2 ${
          isCurrentUser
            ? 'bg-datex-purple text-white'
            : 'bg-datex-dark border border-datex-purple/20 text-white/90'
        }`}
      >
        <p>{message.content}</p>
        <p className="text-xs opacity-70 mt-1 text-right">
          {formatRelative(new Date(message.createdAt), new Date())}
        </p>
      </div>
    </div>
  );
};

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  conversationId,
  currentUser,
  otherUser,
  messages,
  onSendMessage,
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRizzSuggestions, setShowRizzSuggestions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Mark messages as read
  useEffect(() => {
    const markMessagesAsRead = async () => {
      if (!conversationId || !currentUser.id) return;
      
      try {
        const unreadMessages = messages.filter(
          (message) => !message.read && message.senderId !== currentUser.id
        );
        
        if (unreadMessages.length === 0) return;
        
        const messageIds = unreadMessages.map((message) => message.id);
        
        // Using type assertion to bypass TypeScript errors
        // This will work once the database tables are created
        await supabase
          .from('messages')
          .update({ read: true })
          .in('id', messageIds);
        
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    };
    
    markMessagesAsRead();
  }, [conversationId, currentUser.id, messages]);
  
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    try {
      setLoading(true);
      await onSendMessage(newMessage);
      setNewMessage('');
      setShowRizzSuggestions(false);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleRizzSuggestion = (suggestion: string) => {
    setNewMessage(suggestion);
    setShowRizzSuggestions(false);
  };
  
  // Get random rizz suggestions
  const getRandomRizzSuggestions = (count: number): RizzSuggestion[] => {
    const shuffled = [...rizzSuggestions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };
  
  return (
    <Card className="h-full glass-morphism bg-datex-card border-datex-purple/30 flex flex-col">
      <CardHeader className="pb-2 border-b border-datex-purple/20">
        <CardTitle className="text-lg font-semibold text-white">
          {otherUser.name}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4 flex-grow overflow-hidden">
        <ScrollArea className="h-[calc(100vh-280px)]">
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="py-12 text-center text-white/50">
                <p>No messages yet</p>
                <p className="text-xs mt-1">Start the conversation with {otherUser.name}</p>
              </div>
            ) : (
              messages.map((message) => (
                <Message
                  key={message.id}
                  message={message}
                  isCurrentUser={message.senderId === currentUser.id}
                />
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>
      
      {showRizzSuggestions && (
        <div className="mx-4 mb-2 p-2 bg-datex-dark rounded-md border border-datex-purple/30">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-datex-purple">Rizz Bot Suggestions</p>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-white/50 hover:text-white hover:bg-transparent p-0"
              onClick={() => setShowRizzSuggestions(false)}
            >
              ✕
            </Button>
          </div>
          <div className="space-y-2">
            {getRandomRizzSuggestions(3).map((suggestion) => (
              <div
                key={suggestion.id}
                className="p-2 rounded hover:bg-datex-purple/20 cursor-pointer text-sm text-white/80"
                onClick={() => handleRizzSuggestion(suggestion.text)}
              >
                {suggestion.text}
              </div>
            ))}
          </div>
        </div>
      )}
      
      <CardFooter className="p-4 pt-2">
        <div className="flex w-full items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="flex-shrink-0 border-datex-purple/40 hover:bg-datex-purple/20 hover:border-datex-purple text-white"
                  onClick={() => setShowRizzSuggestions(!showRizzSuggestions)}
                >
                  <Sparkles className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Get message suggestions from Rizz Bot</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Input
            placeholder={`Message ${otherUser.name}...`}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-datex-charcoal border-datex-purple/30 focus:border-datex-purple text-white"
          />
          
          <Button
            type="submit"
            disabled={!newMessage.trim() || loading}
            className="flex-shrink-0 bg-gradient-to-r from-datex-purple-dark to-datex-purple-light hover:bg-gradient-to-r hover:from-datex-purple-light hover:to-datex-purple"
            onClick={handleSendMessage}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ChatInterface;
