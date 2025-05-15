
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import SiteHeader from '@/components/layout/SiteHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

const ProfilePage = () => {
  const { user, profile, loading, refreshProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    bio: profile?.bio || '',
    age: profile?.age || 25,
  });
  const [updating, setUpdating] = useState(false);
  
  // If user is not authenticated, redirect to login
  if (!user && !loading) {
    return <Navigate to="/auth" replace />;
  }
  
  // If profile is not complete, redirect to profile setup
  if (user && !profile?.isProfileComplete && !loading) {
    return <Navigate to="/setup-profile" replace />;
  }
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
  };
  
  const handleSaveProfile = async () => {
    if (!user?.id) return;
    
    // Validation
    if (!formData.name || !formData.bio || !formData.age) {
      toast({
        title: "Missing Information",
        description: "Please fill out all required fields",
        variant: "destructive",
      });
      return;
    }
    
    if (formData.name.length < 2) {
      toast({
        title: "Name Too Short",
        description: "Your name should be at least 2 characters",
        variant: "destructive",
      });
      return;
    }
    
    if (formData.bio.length < 10) {
      toast({
        title: "Bio Too Short",
        description: "Your bio should be at least 10 characters",
        variant: "destructive",
      });
      return;
    }
    
    if (formData.age < 18) {
      toast({
        title: "Age Requirement",
        description: "You must be at least 18 years old to use Datex",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setUpdating(true);
      
      // Update profile in database
      const { error } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          bio: formData.bio,
          age: formData.age,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      // Refresh profile data
      await refreshProfile();
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully",
      });
      
      setIsEditing(false);
    } catch (error: any) {
      toast({
        title: "Error Updating Profile",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };
  
  const handleCancelEdit = () => {
    // Reset form data
    setFormData({
      name: profile?.name || '',
      bio: profile?.bio || '',
      age: profile?.age || 25,
    });
    
    setIsEditing(false);
  };
  
  return (
    <div className="min-h-screen w-full bg-datex-black overflow-hidden flex flex-col">
      <SiteHeader activePage="profile" />
      
      <main className="flex-grow flex flex-col items-center justify-center relative px-4 py-8">
        {/* Gradient background */}
        <div 
          className="absolute inset-0 bg-datex-gradient opacity-80 z-0"
        />
        
        {/* Glow elements */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-datex-purple/20 rounded-full filter blur-3xl" />
        <div className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-datex-purple/10 rounded-full filter blur-3xl" />
        
        {/* Content */}
        <div className="z-10 w-full max-w-2xl">
          <Card className="glass-morphism bg-datex-card border-datex-purple/30 animate-slide-up">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold text-white">Your Profile</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Profile Actions */}
              <div className="flex justify-end">
                {isEditing ? (
                  <div className="space-x-2">
                    <Button
                      variant="outline"
                      onClick={handleCancelEdit}
                      disabled={updating}
                      className="border-datex-purple/40 hover:bg-datex-purple/20 hover:border-datex-purple text-white"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveProfile}
                      disabled={updating}
                      className="bg-gradient-to-r from-datex-purple-dark to-datex-purple-light hover:bg-gradient-to-r hover:from-datex-purple-light hover:to-datex-purple"
                    >
                      {updating ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="bg-gradient-to-r from-datex-purple-dark to-datex-purple-light hover:bg-gradient-to-r hover:from-datex-purple-light hover:to-datex-purple"
                  >
                    Edit Profile
                  </Button>
                )}
              </div>
              
              {/* Profile Info */}
              <div className="space-y-4">
                {/* Name and Age */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="bg-datex-charcoal border-datex-purple/30 focus:border-datex-purple text-white"
                      />
                    ) : (
                      <p className="text-white text-lg">{profile?.name}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    {isEditing ? (
                      <Input
                        id="age"
                        name="age"
                        type="number"
                        min={18}
                        max={120}
                        value={formData.age}
                        onChange={handleNumberChange}
                        className="bg-datex-charcoal border-datex-purple/30 focus:border-datex-purple text-white"
                      />
                    ) : (
                      <p className="text-white text-lg">{profile?.age}</p>
                    )}
                  </div>
                </div>
                
                {/* Bio */}
                <div className="space-y-2">
                  <Label htmlFor="bio">About You</Label>
                  {isEditing ? (
                    <Textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      className="min-h-[120px] bg-datex-charcoal border-datex-purple/30 focus:border-datex-purple text-white"
                    />
                  ) : (
                    <p className="text-white">{profile?.bio}</p>
                  )}
                </div>
                
                {/* Interests */}
                <div className="space-y-2">
                  <Label>Interests</Label>
                  <div className="flex flex-wrap gap-2">
                    {profile?.interests?.map((interest, index) => (
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
                
                {/* Looking For */}
                <div className="space-y-2">
                  <Label>Looking For</Label>
                  <div className="flex flex-wrap gap-2">
                    {profile?.lookingFor?.map((item, index) => (
                      <Badge 
                        key={index}
                        className="bg-datex-purple/30 text-white border-datex-purple/50"
                      >
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {/* Account Info */}
                <div className="mt-8 pt-4 border-t border-datex-purple/20">
                  <h3 className="text-white font-medium mb-2">Account Information</h3>
                  
                  <div className="space-y-2 text-sm text-white/70">
                    <div className="flex justify-between">
                      <span>Email</span>
                      <span>{user?.email || 'No email'}</span>
                    </div>
                    
                    {profile?.walletAddress && (
                      <div className="flex justify-between">
                        <span>Wallet</span>
                        <span className="truncate max-w-xs">{profile.walletAddress}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <span>Member Since</span>
                      <span>{profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'Unknown'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
