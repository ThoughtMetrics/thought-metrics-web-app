import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { ResearchFormData } from '@/core/types/start-research-item.type';

interface ResearchFormStore {
  formData: ResearchFormData;
  updateField: (
    field: keyof ResearchFormData,
    value: string | boolean | string[]
  ) => void;
  resetForm: () => void;
}

export const initialFormData: ResearchFormData = {
  firstName: '',
  lastName: '',
  businessEmail: '',
  phone: '',
  countryOrRegion: 'India',
  countryCode: '+91',
  company: '',
  jobTitle: '',
  researchTopic: '',
  projectDetails: '',
  helpOptions: [],
  researchType: [],
  consentCommunication: false,
  consentMarketing: false,
  consentSubscribe: false,
};

export const useResearchFormStore = create<ResearchFormStore>()(
  devtools(
    (set) => ({
      formData: initialFormData,
      updateField: (field, value) =>
        set(
          (state) => ({ formData: { ...state.formData, [field]: value } }),
          false,
          `updateField_${field}`
        ),
      resetForm: () => set({ formData: initialFormData }, false, 'resetForm'),
    }),
    { name: 'research-form' }
  )
);
