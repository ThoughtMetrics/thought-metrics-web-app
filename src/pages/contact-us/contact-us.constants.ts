export const contactUsConstants = {
  initialFormData: {
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
  },
  countryCodes: [
    { code: '+91', country: 'India' },
    { code: '+1', country: 'USA' },
    { code: '+44', country: 'UK' },
  ],
  defaultCountryCode: '+91',
  storeName: 'contact-form-store',
  validationMessages: {
    firstName: 'First name is required',
    lastName: 'Last name is required',
    email: {
      required: 'Email is required',
      invalid: 'Email is invalid',
    },
    subject: 'Subject is required',
    message: 'Message is required',
    submitError: 'Submission failed. Please try again.',
  },
  emailRegex: '\\S+@\\S+\\.\\S+', 
  formResetDelay: 3000,
  apiSimulationDelay: 2000,
  ui: {
    pageTitle: 'Contact Us',
    mainHeading: 'Get the Conversation Started Today',
    description:
      'We want to hear from you. Contact us to learn more about our studies, ask a general question, or submit general enquiries.',
    referenceNumberNote:
      'If you recently participated in a study or have been invited to participate, please provide the reference number found in your invitation or confirmation email in order to expedite your request.',
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
    fieldLabels: {
      firstName: 'First name',
      lastName: 'Last name',
      email: 'Email',
      phone: 'Phone (Optional)',
      caseStudyRefNumber: 'Case Study Reference Number (Optional)',
      subject: 'Subject',
      message: 'Message',
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
        "Your message has been sent successfully. We'll get back to you soon.",
    },
    contactInfo: {
      title: 'Headquarters',
      phone: '+91 704 263 1654',
      email: 'contact@thoughtmetrics.com',
    },
  },
};
