import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { User, InterestOption } from '@/types';

// Sample interests for demonstration
const interests: InterestOption[] = [
  { id: '1', category: 'music', label: 'Rock Music' },
  { id: '2', category: 'music', label: 'Hip Hop' },
  { id: '3', category: 'music', label: 'Classical' },
  { id: '4', category: 'movies', label: 'Action Films' },
  { id: '5', category: 'movies', label: 'Documentaries' },
  { id: '6', category: 'sports', label: 'Basketball' },
  { id: '7', category: 'sports', label: 'Yoga' },
  { id: '8', category: 'books', label: 'Science Fiction' },
  { id: '9', category: 'food', label: 'Vegan Cooking' },
  { id: '10', category: 'tech', label: 'Web3' },
  { id: '11', category: 'tech', label: 'AI' },
  { id: '12', category: 'crypto', label: 'NFTs' },
  { id: '13', category: 'crypto', label: 'DeFi' },
  { id: '14', category: 'travel', label: 'Backpacking' },
  { id: '15', category: 'hobbies', label: 'Photography' },
];

// Looking for options
const lookingForOptions = [
  { id: 'dating', label: 'Dating' },
  { id: 'friendship', label: 'Friendship' },
  { id: 'networking', label: 'Networking' },
  { id: 'crypto-buddies', label: 'Crypto Buddies' },
];

const ProfileSetup = () => {
  const { user, refreshProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<Partial<User>>({
    name: '',
    bio: '',
    age: 25,
    interests: [],
    lookingFor: [],
  });
  
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
  
  const handleInterestToggle = (interestId: string) => {
    setFormData((prev) => {
      const interest = interests.find(i => i.id === interestId)?.label;
      if (!interest) return prev;
      
      const newInterests = prev.interests?.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...(prev.interests || []), interest];
        
      return { ...prev, interests: newInterests };
    });
  };
  
  const handleLookingForToggle = (optionId: string) => {
    setFormData((prev) => {
      const newLookingFor = prev.lookingFor?.includes(optionId)
        ? prev.lookingFor.filter(i => i !== optionId)
        : [...(prev.lookingFor || []), optionId];
        
      return { ...prev, lookingFor: newLookingFor };
    });
  };
  
  const handleNextStep = () => {
    if (currentStep === 1) {
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
    }
    
    if (currentStep === 2) {
      if (!formData.interests || formData.interests.length < 3) {
        toast({
          title: "Select More Interests",
          description: "Please select at least 3 interests",
          variant: "destructive",
        });
        return;
      }
    }
    
    setCurrentStep((prev) => prev + 1);
  };
  
  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };
  
  const handleSubmit = async () => {
    if (!formData.lookingFor || formData.lookingFor.length === 0) {
      toast({
        title: "Selection Required",
        description: "Please select at least one option for what you're looking for",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      
      if (!user?.id) {
        throw new Error('User not authenticated');
      }
      
      // Get approximate location for matching
      let location = null;
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        
        location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          city: 'Unknown', // In a real app, you'd use reverse geocoding
        };
      } catch (error) {
        console.warn('Location access denied or unavailable');
      }
      
      // Create profile in database using type assertion to bypass type checking
      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        name: formData.name,
        bio: formData.bio,
        age: formData.age,
        interests: formData.interests,
        looking_for: formData.lookingFor,
        location,
        is_profile_complete: true,
        created_at: new Date().toISOString(),
        last_active: new Date().toISOString(),
      } as any);
      
      if (error) throw error;
      
      toast({
        title: "Profile Created!",
        description: "Your profile has been set up successfully",
      });
      
      // Refresh profile data in context
      await refreshProfile();
      
    } catch (error: any) {
      toast({
        title: "Error Creating Profile",
        description: error.message || "Failed to create profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Render step 1: Basic information
  const renderStep1 = () => (
    <div className="space-y-4 animate-fade-in">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="Your name"
          value={formData.name}
          onChange={handleInputChange}
          className="bg-datex-charcoal border-datex-purple/30 focus:border-datex-purple"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="age">Age</Label>
        <Input
          id="age"
          name="age"
          type="number"
          min={18}
          max={120}
          placeholder="Your age"
          value={formData.age}
          onChange={handleNumberChange}
          className="bg-datex-charcoal border-datex-purple/30 focus:border-datex-purple"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="bio">About You</Label>
        <Textarea
          id="bio"
          name="bio"
          placeholder="Tell us a bit about yourself..."
          value={formData.bio}
          onChange={handleInputChange}
          className="min-h-[120px] bg-datex-charcoal border-datex-purple/30 focus:border-datex-purple"
        />
      </div>
    </div>
  );
  
  // Render step 2: Interests
  const renderStep2 = () => (
    <div className="space-y-4 animate-fade-in">
      <p className="text-white/70 text-sm">
        Select at least 3 interests that define you (selected: {formData.interests?.length || 0})
      </p>
      
      <div className="grid grid-cols-2 gap-3">
        {interests.map((interest) => {
          const isSelected = formData.interests?.includes(interest.label) || false;
          
          return (
            <div
              key={interest.id}
              className={`p-3 rounded-md cursor-pointer transition-all border ${
                isSelected
                  ? 'border-datex-purple bg-datex-purple/20 text-white'
                  : 'border-datex-purple/30 text-white/70 hover:bg-datex-purple/10'
              }`}
              onClick={() => handleInterestToggle(interest.id)}
            >
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => handleInterestToggle(interest.id)}
                  className="border-datex-purple data-[state=checked]:bg-datex-purple"
                />
                <span>{interest.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
  
  // Render step 3: Looking for
  const renderStep3 = () => (
    <div className="space-y-4 animate-fade-in">
      <p className="text-white/70 text-sm">What are you looking for on Datex?</p>
      
      <div className="grid grid-cols-1 gap-3">
        {lookingForOptions.map((option) => {
          const isSelected = formData.lookingFor?.includes(option.id) || false;
          
          return (
            <div
              key={option.id}
              className={`p-4 rounded-md cursor-pointer transition-all border ${
                isSelected
                  ? 'border-datex-purple bg-datex-purple/20 text-white'
                  : 'border-datex-purple/30 text-white/70 hover:bg-datex-purple/10'
              }`}
              onClick={() => handleLookingForToggle(option.id)}
            >
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => handleLookingForToggle(option.id)}
                  className="border-datex-purple data-[state=checked]:bg-datex-purple"
                />
                <span className="text-lg">{option.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
  
  return (
    <Card className="w-[460px] glass-morphism bg-datex-card border-datex-purple/30 animate-slide-up">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gradient-purple">Complete Your Profile</CardTitle>
        <CardDescription className="text-white/70">
          Tell us about yourself to find better matches
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        {currentStep > 1 ? (
          <Button
            variant="outline"
            onClick={handlePrevStep}
            disabled={loading}
            className="border-datex-purple/40 hover:bg-datex-purple/20 hover:border-datex-purple text-white"
          >
            Back
          </Button>
        ) : (
          <div></div>
        )}
        
        {currentStep < 3 ? (
          <Button
            onClick={handleNextStep}
            disabled={loading}
            className="bg-gradient-to-r from-datex-purple-dark to-datex-purple-light hover:bg-gradient-to-r hover:from-datex-purple-light hover:to-datex-purple"
          >
            Next
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-gradient-to-r from-datex-purple-dark to-datex-purple-light hover:bg-gradient-to-r hover:from-datex-purple-light hover:to-datex-purple"
          >
            {loading ? 'Creating Profile...' : 'Complete Setup'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProfileSetup;
