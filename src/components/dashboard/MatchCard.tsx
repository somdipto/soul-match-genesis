
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, X } from 'lucide-react';
import { Match, User } from '@/types';

interface MatchCardProps {
  match: Match;
  onLike: (userId: string) => void;
  onSkip: (userId: string) => void;
  onMessage: (userId: string) => void;
}

const MatchCard: React.FC<MatchCardProps> = ({ match, onLike, onSkip, onMessage }) => {
  const user = match.user as unknown as User;
  
  // Function to calculate age based on birthdate
  const calculateAge = (birthdate: string): number => {
    return user.age || 25; // Fallback to stored age or default
  };
  
  // Function to get random interests
  const getRandomInterests = (interests: string[], count: number): string[] => {
    if (!interests || interests.length <= count) return interests || [];
    
    const shuffled = [...interests].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };
  
  return (
    <Card className="w-full max-w-md glass-morphism bg-datex-card border-datex-purple/30 animate-float shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl font-bold text-white">{user.name}, {calculateAge(user.createdAt)}</CardTitle>
            <CardDescription className="text-white/70">
              {match.matchPercentage}% Match
            </CardDescription>
          </div>
          <Badge 
            variant="outline" 
            className="bg-datex-purple/30 text-white border-datex-purple/50 px-3 py-1"
          >
            {user.lookingFor?.[0] || 'Dating'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg overflow-hidden h-48 relative bg-datex-dark border border-datex-purple/20 flex items-center justify-center text-white/30 text-sm">
          {/* In a real app, you'd show a photo here if the user has verified with one */}
          <div className="flex flex-col items-center space-y-2">
            <svg className="w-12 h-12 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p>Personality-focused matching</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <p className="text-white/90 line-clamp-3">{user.bio}</p>
          
          <div className="flex flex-wrap gap-2 mt-2">
            {getRandomInterests(user.interests || [], 5).map((interest, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="bg-datex-purple/20 text-white/80 border-none"
              >
                {interest}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full h-12 w-12 border-datex-purple/40 hover:bg-datex-purple/20 hover:border-datex-purple text-white"
          onClick={() => onSkip(user.id)}
        >
          <X className="h-5 w-5" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          className="rounded-full h-12 w-12 border-datex-purple/40 hover:bg-datex-purple/20 hover:border-datex-purple text-white"
          onClick={() => onMessage(user.id)}
        >
          <MessageCircle className="h-5 w-5" />
        </Button>
        
        <Button
          size="icon"
          className="rounded-full h-12 w-12 bg-gradient-to-r from-datex-purple-dark to-datex-purple-light hover:bg-gradient-to-r hover:from-datex-purple-light hover:to-datex-purple"
          onClick={() => onLike(user.id)}
        >
          <Heart className="h-5 w-5" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MatchCard;
