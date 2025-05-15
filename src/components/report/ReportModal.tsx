
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import { User } from '@/types';
import { toast } from '@/hooks/use-toast';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportedUser: User | null;
  currentUserId: string;
}

const reportReasons = [
  { id: 'inappropriate', label: 'Inappropriate Content' },
  { id: 'harassment', label: 'Harassment' },
  { id: 'fake', label: 'Fake Profile' },
  { id: 'scam', label: 'Scam or Fraud' },
  { id: 'other', label: 'Other' },
];

const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  reportedUser,
  currentUserId,
}) => {
  const [reason, setReason] = useState<string>('');
  const [details, setDetails] = useState<string>('');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async () => {
    if (!reason) {
      toast({
        title: "Please Select a Reason",
        description: "You must select a reason for your report",
        variant: "destructive",
      });
      return;
    }
    
    if (!reportedUser) return;
    
    try {
      setLoading(true);
      
      const { error } = await supabase.from('reports').insert([
        {
          reporter_id: currentUserId,
          reported_user_id: reportedUser.id,
          reason,
          details,
          status: 'pending',
          created_at: new Date().toISOString(),
        },
      ]);
      
      if (error) throw error;
      
      toast({
        title: "Report Submitted",
        description: "Thank you for helping keep Datex safe",
      });
      
      onClose();
      setReason('');
      setDetails('');
    } catch (error: any) {
      toast({
        title: "Error Submitting Report",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-morphism bg-datex-card border-datex-purple/30 text-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Report User</DialogTitle>
          <DialogDescription className="text-white/70">
            {reportedUser ? `Report ${reportedUser.name}'s profile` : 'Report this user'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Reason for reporting</Label>
            <RadioGroup value={reason} onValueChange={setReason}>
              {reportReasons.map((reportReason) => (
                <div className="flex items-center space-x-2" key={reportReason.id}>
                  <RadioGroupItem 
                    value={reportReason.id} 
                    id={reportReason.id}
                    className="border-datex-purple data-[state=checked]:bg-datex-purple"
                  />
                  <Label htmlFor={reportReason.id}>{reportReason.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="details">Additional details</Label>
            <Textarea
              id="details"
              placeholder="Please provide any additional information"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="h-24 bg-datex-charcoal border-datex-purple/30 focus:border-datex-purple text-white"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="border-datex-purple/40 hover:bg-datex-purple/20 hover:border-datex-purple text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-gradient-to-r from-datex-purple-dark to-datex-purple-light hover:bg-gradient-to-r hover:from-datex-purple-light hover:to-datex-purple"
          >
            {loading ? 'Submitting...' : 'Submit Report'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportModal;
