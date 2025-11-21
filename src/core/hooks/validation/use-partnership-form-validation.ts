import { useState, useCallback } from 'react';
import type { PartnershipFormData } from '@/core/types/partnership-form.type';

interface ValidationErrors {
  [key: string]: string;
}

export const usePartnershipFormValidation = () => {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validate = useCallback((data: PartnershipFormData): boolean => {
    const newErrors: ValidationErrors = {};

    // Email validation - stricter pattern matching backend requirements
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // URL validation - matching backend URI validation
    const urlRegex = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

    // Required fields
    if (!data.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!data.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!data.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(data.email)) {
      newErrors.email = 'Please enter a valid email address (e.g., name@example.com)';
    }
    if (!data.phone.trim()) newErrors.phone = 'Phone number is required';

    // Social media handle validation
    // Twitter/X handles: 1-15 characters, letters, numbers, underscores only
    const xHandleRegex = /^@?[A-Za-z0-9_]{1,15}$/;
    // Instagram handles: 1-30 characters, letters, numbers, underscores, periods
    const instagramHandleRegex = /^@?[A-Za-z0-9_.]{1,30}$/;

    if (data.instagramHandle && data.instagramHandle.trim()) {
      // Allow "0" to skip, but validate if it's an actual handle
      if (data.instagramHandle.trim() !== '0' && !instagramHandleRegex.test(data.instagramHandle.trim())) {
        newErrors.instagramHandle = 'Please enter a valid Instagram handle (e.g., @username or username, 1-30 characters)';
      }
    }

    if (data.xHandle && data.xHandle.trim()) {
      // Allow "0" to skip, but validate if it's an actual handle
      if (data.xHandle.trim() !== '0' && !xHandleRegex.test(data.xHandle.trim())) {
        newErrors.xHandle = 'Please enter a valid X/Twitter handle (e.g., @username or username, 1-15 characters)';
      }
    }

    // URL validation for optional fields
    if (data.linkedinUrl && data.linkedinUrl.trim()) {
      // Allow "0" to skip, but validate if it's an actual URL
      if (data.linkedinUrl.trim() !== '0' && !urlRegex.test(data.linkedinUrl)) {
        newErrors.linkedinUrl = 'Please enter a valid LinkedIn URL (e.g., https://linkedin.com/in/username)';
      }
    }

    if (data.youtubeChannel && data.youtubeChannel.trim()) {
      // Allow "0" to skip, but validate if it's an actual URL
      if (data.youtubeChannel.trim() !== '0' && !urlRegex.test(data.youtubeChannel)) {
        newErrors.youtubeChannel = 'Please enter a valid YouTube URL (e.g., https://youtube.com/@channel)';
      }
    }

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
    if (data.linkedinUrl && data.linkedinUrl.length > 255)
      newErrors.linkedinUrl = 'Max 255 characters';
    if (data.youtubeChannel && data.youtubeChannel.length > 255)
      newErrors.youtubeChannel = 'Max 255 characters';
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
