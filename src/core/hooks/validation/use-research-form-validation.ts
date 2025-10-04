import { useState, useCallback } from 'react';
import type { ResearchFormData } from '@/core/types/start-research-item.type';

interface ValidationErrors {
  [key: string]: string;
}

export const useResearchFormValidation = () => {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validate = useCallback((data: ResearchFormData): boolean => {
    const newErrors: ValidationErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Required fields
    if (!data.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!data.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!data.businessEmail.trim()) {
      newErrors.businessEmail = 'Business email is required';
    } else if (!emailRegex.test(data.businessEmail)) {
      newErrors.businessEmail = 'Invalid email format';
    }
    if (!data.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!data.countryOrRegion.trim())
      newErrors.countryOrRegion = 'Country or region is required';
    if (!data.company.trim()) newErrors.company = 'Company is required';
    if (!data.jobTitle.trim()) newErrors.jobTitle = 'Job title is required';
    if (!data.researchTopic.trim())
      newErrors.researchTopic = 'Research topic is required';
    if (!data.projectDetails.trim())
      newErrors.projectDetails = 'Project details are required';
    if (!data.consentCommunication)
      newErrors.consentCommunication = 'Communication consent is required';

    // Length validation
    if (data.firstName.length > 100)
      newErrors.firstName = 'Max 100 characters';
    if (data.lastName.length > 100) newErrors.lastName = 'Max 100 characters';
    if (data.businessEmail.length > 255)
      newErrors.businessEmail = 'Max 255 characters';
    if (data.phone.length > 20) newErrors.phone = 'Max 20 characters';
    if (data.company.length > 200) newErrors.company = 'Max 200 characters';
    if (data.jobTitle.length > 200) newErrors.jobTitle = 'Max 200 characters';
    if (data.researchTopic.length > 500)
      newErrors.researchTopic = 'Max 500 characters';
    if (data.projectDetails.length > 2000)
      newErrors.projectDetails = 'Max 2000 characters';

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
