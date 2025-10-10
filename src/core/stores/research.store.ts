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

const storeImplementation = (set: any) => ({
  formData: initialFormData,
  updateField: (field: keyof ResearchFormData, value: string | boolean | string[]) =>
    set(
      (state: ResearchFormStore) => ({ formData: { ...state.formData, [field]: value } }),
      false,
      `updateField_${field}`
    ),
  resetForm: () => set({ formData: initialFormData }, false, 'resetForm'),
});

export const useResearchFormStore = create<ResearchFormStore>()(
  import.meta.env.DEV
    ? devtools(storeImplementation, { name: 'research-form' })
    : storeImplementation
);
