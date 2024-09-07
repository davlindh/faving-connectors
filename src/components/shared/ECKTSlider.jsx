import React, { useState, useEffect } from 'react';
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateFeedback, useUpdateFeedback, useFeedback } from '@/integrations/supabase/hooks/feedback';
import { useSupabase } from '@/integrations/supabase/SupabaseProvider';
import { toast } from 'sonner';

const ECKTSlider = ({ origin, readOnly = false }) => {
  const [value, setValue] = useState(0);
  const [content, setContent] = useState('');
  const [score, setScore] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [total, setTotal] = useState(0);
  const { data: existingFeedback, isLoading } = useFeedback(origin);
  const createFeedback = useCreateFeedback();
  const updateFeedback = useUpdateFeedback();
  const { session } = useSupabase();

  useEffect(() => {
    if (existingFeedback && existingFeedback.length > 0) {
      const feedback = existingFeedback[0];
      setValue(feedback.value);
      setContent(feedback.content);
      setScore(feedback.score);
      setPercentage(feedback.percentage);
      setTotal(feedback.total);
    }
  }, [existingFeedback]);

  const handleSliderChange = (newValue) => {
    if (!readOnly) {
      setValue(newValue[0]);
      updateMetrics(newValue[0]);
    }
  };

  const handleInputChange = (e, setter) => {
    const newValue = parseFloat(e.target.value);
    if (!isNaN(newValue) && newValue >= 0 && newValue <= 100) {
      setter(newValue);
      if (setter === setValue) {
        updateMetrics(newValue);
      }
    }
  };

  const updateMetrics = (newValue) => {
    setScore(newValue);
    setPercentage(newValue);
    setTotal(newValue);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
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
    <div className="w-full max-w-lg space-y-6">
      <h3 className="font-semibold mb-4">ECKT Score & Feedback</h3>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="eckt-score">ECKT Score</Label>
          <div className="flex items-center space-x-4">
            <Slider
              id="eckt-score"
              value={[value]}
              onValueChange={handleSliderChange}
              max={100}
              step={1}
              className="flex-grow"
              disabled={readOnly}
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Input
                    type="number"
                    value={value}
                    onChange={(e) => handleInputChange(e, setValue)}
                    className="w-20"
                    disabled={readOnly}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>ECKT Score: {value}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="score">Score</Label>
          <Input
            id="score"
            type="number"
            value={score}
            onChange={(e) => handleInputChange(e, setScore)}
            disabled={readOnly}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="percentage">Percentage</Label>
          <Input
            id="percentage"
            type="number"
            value={percentage}
            onChange={(e) => handleInputChange(e, setPercentage)}
            disabled={readOnly}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="total">Total</Label>
          <Input
            id="total"
            type="number"
            value={total}
            onChange={(e) => handleInputChange(e, setTotal)}
            disabled={readOnly}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="feedback">Feedback</Label>
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
        <Button onClick={handleSubmit} className="w-full">
          {existingFeedback && existingFeedback.length > 0 ? 'Update' : 'Submit'} Feedback
        </Button>
      )}
    </div>
  );
};

export default ECKTSlider;