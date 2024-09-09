import { useState } from 'react';
import { toast } from 'sonner';

export const useFormSubmit = (submitFunction, successMessage, errorMessage) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await submitFunction(data);
      toast.success(successMessage);
      return true;
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error(errorMessage || 'An error occurred. Please try again.');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { onSubmit, isSubmitting };
};