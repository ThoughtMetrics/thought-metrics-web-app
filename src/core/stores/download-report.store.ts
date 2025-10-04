import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { DownloadReportFormData } from '@/core/types/report-download-form.type';

interface DownloadReportFormStore {
  formData: DownloadReportFormData;
  updateField: (field: keyof DownloadReportFormData, value: any) => void;
  resetForm: () => void;
}

const initialFormData: DownloadReportFormData = {
  firstName: '',
  lastName: '',
  businessEmail: '',
  phone: '',
  countryOrRegion: 'India',
  company: '',
  jobTitle: '',
  countryCode: '+91',
  subscribeNewsletter: false,
  dataUsageConsent: false,
};

export const useDownloadReportFormStore = create<DownloadReportFormStore>()(
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
    { name: 'download-report-form' }
  )
);
