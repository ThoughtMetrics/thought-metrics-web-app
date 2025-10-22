import {
  addressConstants,
  phoneConstants,
} from '@/core/constants/forms.constants';

export const startYourResearchConstants = {
  initialFormData: {
    firstName: '',
    lastName: '',
    businessEmail: '',
    phone: '',
    countryOrRegion: 'India',
    company: '',
    jobTitle: '',
    researchTopic: '',
    projectDetails: '',
    helpOptions: [],
    researchType: [],
    consentCommunication: false,
    consentMarketing: false,
    consentSubscribe: false,
  },
  countries: addressConstants.countries,
  countryCodes: phoneConstants.countryCodes,
  helpOptions: [
    { id: 'focusGroup', label: 'Focus Group Discussions' },
    { id: 'telephonic', label: 'Telephonic surveys' },
    { id: 'online', label: 'Online surveys' },
    { id: 'fieldwork', label: 'Fieldwork' },
    { id: 'others', label: 'Others' },
    { id: 'conversation', label: 'Conversation or industry event' },
    { id: 'recruitment', label: 'Recruitment of respondents' },
    { id: 'quantitative', label: 'Quantitative research' },
    { id: 'qualitative', label: 'Qualitative research' },
  ],
  researchTypes: [
    { id: 'brandPerception', label: 'Brand perception research' },
    { id: 'brandAwareness', label: 'Brand awareness research' },
    { id: 'brandTracking', label: 'Brand tracking research' },
    { id: 'messageTesting', label: 'Message testing' },
    { id: 'pricingResearch', label: 'Pricing research' },
    { id: 'uxResearch', label: 'UX/UI research' },
    { id: 'customerLoyalty', label: 'Customer loyalty research' },
    { id: 'brandPositioning', label: 'Brand positioning research' },
    { id: 'competitiveAnalysis', label: 'Competitive analysis' },
    { id: 'goToMarket', label: 'Go to market research' },
    { id: 'marketEntry', label: 'Market entry research' },
    { id: 'marketFeasibility', label: 'Market feasibility study' },
    { id: 'productValidation', label: 'Product validation research' },
    { id: 'customerJourney', label: 'Customer journey research' },
    { id: 'customerSatisfaction', label: 'Customer satisfaction research' },
    { id: 'others', label: 'Others' },
  ],
  defaultCountryCode: '+91',
  storeName: 'research-form-store',
  validationMessages: {
    firstName: 'First name is required',
    lastName: 'Last name is required',
    businessEmail: {
      required: 'Business email is required',
      invalid: 'Business email is invalid',
    },
    countryOrRegion: 'Country or region is required',
    company: 'Company is required',
    jobTitle: 'Job title is required',
    researchTopic: 'Research topic is required',
    projectDetails: 'Project details are required',
    submitError: 'Submission failed. Please try again.',
  },
  emailRegex: '\\S+@\\S+\\.\\S+',
  formResetDelay: 3000,
  apiSimulationDelay: 2000,
  ui: {
    pageTitle: 'Research Participation',
    mainHeading:
      'We are looking forward to learning more about your research goals and objectives.',
    subHeading:
      'Tell us more about your project by answering a few questions below.',
    fieldLabels: {
      firstName: 'First name',
      lastName: 'Last name',
      businessEmail: 'Business Email',
      phone: 'Phone',
      countryOrRegion: 'Country or region of residence',
      company: 'Company',
      jobTitle: 'Job title',
      researchTopic: 'Research topic',
      projectDetails: 'Project Details',
      helpOptions: 'How can we help you today?',
      researchType: 'Type of Research',
    },
    consentSection: {
      title: 'Consent to communicate',
      description:
        'Thought Metrics is committed to protecting and respecting your privacy, and we will only use your personal information to administer your account and to provide the products and services you requested from us. We need your express permission to contact you. Please mark your communication preference(s) below:',
      privacyNote:
        'You may {unsubscribe} from these communications anytime. For information on how to unsubscribe, as well as our privacy practices and commitment to protecting your privacy, check out our {privacyPolicy}.',
    },
    checkboxLabels: {
      consentCommunication:
        'I agree to receive communication about the above request.',
      consentMarketing:
        'I would like to receive marketing information/paid study details from Thought Metrics',
      consentSubscribe: 'I would like to subscribe to Thought Metrics blogs',
    },
    buttons: {
      submit: 'Submit',
      submitting: 'Submitting...',
      unsubscribe: 'unsubscribe',
      privacyPolicy: 'Privacy Policy',
    },
    successMessage: {
      title: 'Thank You!',
      description:
        "Your research request has been submitted successfully. We'll get back to you soon with more details.",
    },
    contactInfo: {
      title: 'Headquarters',
      phone: '+91 704 263 1654',
      email: 'contact@thoughtmetrics.com',
    },
  },
};
