import { useState, useCallback } from 'react';
import type { ContactFormData } from '@/core/types/contact-us.type';

interface ValidationErrors {
  [key: string]: string;
}

export const useContactFormValidation = () => {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validate = useCallback((data: ContactFormData): boolean => {
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
    if (!data.subject.trim()) newErrors.subject = 'Subject is required';
    if (!data.message.trim()) newErrors.message = 'Message is required';

    // Length validation
    if (data.firstName.length > 100) newErrors.firstName = 'Max 100 characters';
    if (data.lastName.length > 100) newErrors.lastName = 'Max 100 characters';
    if (data.email.length > 255) newErrors.email = 'Max 255 characters';
    if (data.subject.length > 200) newErrors.subject = 'Max 200 characters';
    if (data.message.length > 2000) newErrors.message = 'Max 2000 characters';
    if (!data.consentCommunication) newErrors.consentCommunication = 'Agree to submit the form';

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
