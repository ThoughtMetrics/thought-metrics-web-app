// Form Data Interface
export interface ResearchFormData {
  firstName: string;
  lastName: string;
  businessEmail: string;
  phone: string;
  countryOrRegion: string;
  countryCode: string;
  company: string;
  jobTitle: string;
  researchTopic: string;
  projectDetails: string;
  helpOptions: string[];
  researchType: string[];
  consentCommunication: boolean;
  consentMarketing: boolean;
  consentSubscribe: boolean;
}
