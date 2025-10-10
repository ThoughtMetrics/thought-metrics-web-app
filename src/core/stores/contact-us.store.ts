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

const storeImplementation = (set: any) => ({
  formData: initialFormData,
  updateField: (field: keyof ContactFormData, value: any) =>
    set(
      (state: ContactUsFormStore) => ({ formData: { ...state.formData, [field]: value } }),
      false,
      `updateField_${field}`
    ),
  resetForm: () => set({ formData: initialFormData }, false, 'resetForm'),
});

export const useContactFormStore = create<ContactUsFormStore>()(
  import.meta.env.DEV
    ? devtools(storeImplementation, { name: 'contact-form' })
    : storeImplementation
);
