import { useState, useCallback } from 'react';
import type { PartnershipFormData } from '@/core/types/partnership-form.type';

interface ValidationErrors {
  [key: string]: string;
}

export const usePartnershipFormValidation = () => {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validate = useCallback((data: PartnershipFormData): boolean => {
    const newErrors: ValidationErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Required fields
    if (!data.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!data.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!data.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(data.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!data.phone.trim()) newErrors.phone = 'Phone number is required';

    // Length validation
    if (data.firstName.length > 100)
      newErrors.firstName = 'Max 100 characters';
    if (data.lastName.length > 100) newErrors.lastName = 'Max 100 characters';
    if (data.email.length > 255) newErrors.email = 'Max 255 characters';
    if (data.phone.length > 20) newErrors.phone = 'Max 20 characters';
    if (data.instagramHandle && data.instagramHandle.length > 100)
      newErrors.instagramHandle = 'Max 100 characters';
    if (data.xHandle && data.xHandle.length > 100)
      newErrors.xHandle = 'Max 100 characters';
    if (data.linkedinUrl && data.linkedinUrl.length > 500)
      newErrors.linkedinUrl = 'Max 500 characters';
    if (data.youtubeChannel && data.youtubeChannel.length > 200)
      newErrors.youtubeChannel = 'Max 200 characters';
    if (data.audienceDescription && data.audienceDescription.length > 1000)
      newErrors.audienceDescription = 'Max 1000 characters';
    if (data.partnershipReason && data.partnershipReason.length > 1000)
      newErrors.partnershipReason = 'Max 1000 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, []);

  const clearError = useCallback((field: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  return { errors, validate, clearError, clearAllErrors };
};
