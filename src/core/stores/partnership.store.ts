import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { PartnershipFormData } from '@/core/types/partnership-form.type';

interface PartnershipFormStore {
  formData: PartnershipFormData;
  updateField: (field: keyof PartnershipFormData, value: any) => void;
  resetForm: () => void;
}

export const initialFormData: PartnershipFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  countryCode: '+91',
  instagramHandle: '',
  instagramFollowers: '',
  xHandle: '',
  xFollowers: '',
  linkedinUrl: '',
  linkedinConnections: '',
  youtubeChannel: '',
  youtubeFollowers: '',
  supportGroups: '',
  audienceDescription: '',
  partnershipReason: '',
};

export const usePartnershipFormStore = create<PartnershipFormStore>()(
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
    { name: 'partnership-form' }
  )
);
