import { toast } from 'sonner';

export const handleFormSubmit = async (submitFunction, successMessage, errorMessage) => {
  try {
    await submitFunction();
    toast.success(successMessage);
    return true;
  } catch (error) {
    console.error('Form submission error:', error);
    toast.error(errorMessage || 'An error occurred. Please try again.');
    return false;
  }
};

export const validateFileSize = (file, maxSizeInMB) => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  if (file.size > maxSizeInBytes) {
    toast.error(`File size exceeds ${maxSizeInMB}MB limit.`);
    return false;
  }
  return true;
};

export const validateFileType = (file, allowedTypes) => {
  if (!allowedTypes.includes(file.type)) {
    toast.error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`);
    return false;
  }
  return true;
};