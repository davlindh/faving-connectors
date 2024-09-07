import React, { useState, useEffect } from 'react';
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCreateFeedback, useUpdateFeedback, useFeedback } from '@/integrations/supabase/hooks/feedback';
import { useSupabase } from '@/integrations/supabase/SupabaseProvider';
import { toast } from 'sonner';

const ECKTSlider = ({ origin, readOnly = false }) => {
  const [value, setValue] = useState(0);
  const [content, setContent] = useState('');
  const { data: existingFeedback, isLoading } = useFeedback(origin);
  const createFeedback = useCreateFeedback();
  const updateFeedback = useUpdateFeedback();
  const { session } = useSupabase();

  useEffect(() => {
    if (existingFeedback && existingFeedback.length > 0) {
      const feedback = existingFeedback[0];
      setValue(feedback.value);
      setContent(feedback.content);
    }
  }, [existingFeedback]);

  const handleSliderChange = (newValue) => {
    if (!readOnly) {
      setValue(newValue[0]);
    }
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const calculateMetrics = (value) => {
    const score = value;
    const percentage = (score / 100) * 100;
    const total = value;
    return { total, score, percentage };
  };

  const handleSubmit = async () => {
    if (!session?.user?.id) {
      toast.error('You must be logged in to submit feedback');
      return;
    }

    if (!origin) {
      toast.error('Origin is required for feedback submission');
      return;
    }

    const { total, score, percentage } = calculateMetrics(value);

    const feedbackData = {
      user_id: session.user.id,
      origin,
      value,
      content,
      score,
      percentage,
      total,
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
      toast.error('Error submitting feedback: ' + error.message);
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
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">ECKT Score</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-sm font-bold">{value}</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>ECKT Score: {value}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Slider
            value={[value]}
            onValueChange={handleSliderChange}
            max={100}
            step={1}
            className="w-full"
            disabled={readOnly}
          />
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="feedback" className="text-sm font-medium">Feedback</label>
        <Textarea
          id="feedback"
          placeholder="Provide your feedback here..."
          value={content}
          onChange={handleContentChange}
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