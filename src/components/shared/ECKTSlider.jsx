import React, { useState, useEffect } from 'react';
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCreateFeedback, useUpdateFeedback, useFeedback } from '@/integrations/supabase/hooks/feedback';
import { useSupabase } from '@/integrations/supabase/SupabaseProvider';
import { toast } from 'sonner';

const ECKTSlider = ({ origin, readOnly = false }) => {
  const categories = ['Effort', 'Creativity', 'Knowledge', 'Time'];
  const [localValue, setLocalValue] = useState([0, 0, 0, 0]);
  const [localFeedback, setLocalFeedback] = useState('');
  const { data: existingFeedback, isLoading } = useFeedback(origin);
  const createFeedback = useCreateFeedback();
  const updateFeedback = useUpdateFeedback();
  const { session } = useSupabase();

  useEffect(() => {
    if (existingFeedback && existingFeedback.length > 0) {
      const feedback = existingFeedback[0];
      setLocalValue([feedback.effort, feedback.creativity, feedback.knowledge, feedback.time]);
      setLocalFeedback(feedback.content);
    }
  }, [existingFeedback]);

  const handleSliderChange = (newValue, index) => {
    if (!readOnly) {
      const updatedValues = [...localValue];
      updatedValues[index] = newValue[0];
      setLocalValue(updatedValues);
    }
  };

  const handleFeedbackChange = (e) => {
    setLocalFeedback(e.target.value);
  };

  const handleSubmit = async () => {
    if (!session?.user?.id) {
      toast.error('You must be logged in to submit feedback');
      return;
    }

    const feedbackData = {
      user_id: session.user.id,
      origin,
      value: localValue.reduce((a, b) => a + b, 0),
      content: localFeedback,
      score: localValue.reduce((a, b) => a + b, 0) / localValue.length,
      percentage: (localValue.reduce((a, b) => a + b, 0) / (100 * localValue.length)) * 100,
      total: localValue.reduce((a, b) => a + b, 0),
      effort: localValue[0],
      creativity: localValue[1],
      knowledge: localValue[2],
      time: localValue[3],
    };

    try {
      if (existingFeedback && existingFeedback.length > 0) {
        await updateFeedback.mutateAsync({ feedbackId: existingFeedback[0].feedback_id, updates: feedbackData });
        toast.success('Feedback updated successfully');
      } else {
        await createFeedback.mutateAsync(feedbackData);
        toast.success('Feedback submitted successfully');
      }
    } catch (error) {
      toast.error('Error submitting feedback');
      console.error('Feedback submission error:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full max-w-lg">
      <h3 className="font-semibold mb-4">ECKT Score & Feedback</h3>
      <div className="space-y-6 mb-6">
        {categories.map((category, index) => (
          <div key={category} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{category}</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-sm font-bold">{localValue[index]}</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{category} Score: {localValue[index]}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Slider
              value={[localValue[index]]}
              onValueChange={(newValue) => handleSliderChange(newValue, index)}
              max={100}
              step={1}
              className="w-full"
              disabled={readOnly}
            />
          </div>
        ))}
      </div>
      <div className="space-y-2">
        <label htmlFor="feedback" className="text-sm font-medium">Feedback</label>
        <Textarea
          id="feedback"
          placeholder="Provide your feedback here..."
          value={localFeedback}
          onChange={handleFeedbackChange}
          rows={4}
          disabled={readOnly}
        />
      </div>
      {!readOnly && (
        <Button onClick={handleSubmit} className="mt-4">
          {existingFeedback && existingFeedback.length > 0 ? 'Update' : 'Submit'} Feedback
        </Button>
      )}
    </div>
  );
};

export default ECKTSlider;