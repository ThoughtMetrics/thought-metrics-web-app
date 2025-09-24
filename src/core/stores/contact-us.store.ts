import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { ContactFormData } from '@/core/types/contact-us.type';

interface ContactUsFormStore {
  formData: ContactFormData;
  updateField: (field: keyof ContactFormData, value: any) => void;
  resetForm: () => void;
}

const initialFormData: ContactFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  caseStudyRefNumber: '',
  subject: '',
  message: '',
  consentCommunication: false,
  consentMarketing: false,
  consentSubscribe: false,
};

export const useContactFormStore = create<ContactUsFormStore>()(
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
    { name: 'contact-form' }
  )
);
