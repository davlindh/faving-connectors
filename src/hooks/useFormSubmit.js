import { useState } from 'react';
import { handleFormSubmit } from '@/utils/formUtils';

export const useFormSubmit = (submitFunction, successMessage, errorMessage) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const success = await handleFormSubmit(
      () => submitFunction(data),
      successMessage,
      errorMessage
    );
    setIsSubmitting(false);
    return success;
  };

  return { onSubmit, isSubmitting };
};