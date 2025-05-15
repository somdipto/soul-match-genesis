
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import SiteHeader from '@/components/layout/SiteHeader';
import MatchCard from '@/components/dashboard/MatchCard';
import ReportModal from '@/components/report/ReportModal';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { User, Match } from '@/types';
import { toast } from '@/hooks/use-toast';

const DashboardPage = () => {
  const { user, profile, loading } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportedUser, setReportedUser] = useState<User | null>(null);
  
  // If user is not authenticated, redirect to login
  if (!user && !loading) {
    return <Navigate to="/auth" replace />;
  }
  
  // If profile is not complete, redirect to profile setup
  if (user && !profile?.isProfileComplete && !loading) {
    return <Navigate to="/setup-profile" replace />;
  }
  
  // Fetch potential matches
  useEffect(() => {
    const fetchMatches = async () => {
      if (!user?.id) return;
      
      try {
        setLoadingMatches(true);
        
        // In a real app, you'd have a more sophisticated algorithm to find matches
        // For demo purposes, we'll just fetch random users
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .neq('id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);
        
        if (error) throw error;
        
        // Transform the data into matches with a random match percentage
        const potentialMatches: Match[] = (data || []).map((userData: any) => {
          const matchPercentage = Math.floor(Math.random() * 40) + 60; // 60-99%
          
          return {
            id: `match-${userData.id}`,
            userId: user.id,
            matchedUserId: userData.id,
            matchPercentage,
            createdAt: new Date().toISOString(),
            user: userData as unknown as User,
          };
        });
        
        setMatches(potentialMatches);
      } catch (error) {
        console.error('Error fetching matches:', error);
        toast({
          title: "Error Loading Matches",
          description: "Could not load potential matches at this time",
          variant: "destructive",
        });
      } finally {
        setLoadingMatches(false);
      }
    };
    
    fetchMatches();
  }, [user?.id]);
  
  const handleLike = async (userId: string) => {
    try {
      // In a real app, you'd create a match in the database
      toast({
        title: "It's a Match!",
        description: "You can now message each other",
      });
      
      // Move to the next match
      goToNextMatch();
    } catch (error) {
      console.error('Error liking profile:', error);
    }
  };
  
  const handleSkip = () => {
    goToNextMatch();
  };
  
  const handleMessage = async (userId: string) => {
    try {
      // In a real app, you'd create a conversation and redirect to the messages page
      toast({
        title: "Chat Started",
        description: "You can now message each other",
      });
      
      // For demo purposes, just go to the next match
      goToNextMatch();
    } catch (error) {
      console.error('Error starting conversation:', error);
    }
  };
  
  const goToNextMatch = () => {
    setCurrentMatchIndex((prevIndex) => {
      const newIndex = prevIndex + 1;
      // If we've gone through all matches, reset to start
      if (newIndex >= matches.length) {
        toast({
          title: "No More Matches",
          description: "You've seen all potential matches for now",
        });
        return 0;
      }
      return newIndex;
    });
  };
  
  const handleReport = (user: User) => {
    setReportedUser(user);
    setShowReportModal(true);
  };
  
  const currentMatch = matches[currentMatchIndex];
  
  return (
    <div className="min-h-screen w-full bg-datex-black overflow-hidden flex flex-col">
      <SiteHeader activePage="matches" />
      
      <main className="flex-grow flex flex-col items-center justify-center relative px-4 py-8">
        {/* Gradient background */}
        <div 
          className="absolute inset-0 bg-datex-gradient opacity-80 z-0"
        />
        
        {/* Glow elements */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-datex-purple/20 rounded-full filter blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-datex-purple/10 rounded-full filter blur-3xl" />
        
        {/* Content */}
        <div className="z-10 w-full max-w-lg">
          {loadingMatches ? (
            <div className="text-center text-white/70">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-datex-purple mx-auto mb-4"></div>
              <p>Finding your matches...</p>
            </div>
          ) : matches.length === 0 ? (
            <div className="text-center text-white/70">
              <p className="text-xl">No matches found</p>
              <p className="mt-2">Check back later for new connections</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <MatchCard
                match={currentMatch}
                onLike={handleLike}
                onSkip={handleSkip}
                onMessage={handleMessage}
              />
              
              <Button
                variant="link"
                className="mt-4 text-white/50 hover:text-datex-purple"
                onClick={() => handleReport(currentMatch.user as User)}
              >
                Report this profile
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        reportedUser={reportedUser}
        currentUserId={user?.id || ''}
      />
    </div>
  );
};

export default DashboardPage;
