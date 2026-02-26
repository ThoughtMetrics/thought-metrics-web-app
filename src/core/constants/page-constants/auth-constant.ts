import {
  addressConstants,
  dateConstants,
  formsConstants,
  phoneConstants,
} from '@/core/constants/forms.constants';
import { ROUTES } from '@/routes/routeConfig';

export const loginFormConstant = {
  initialFormData: {
    thoughtMetricsId: '',
    password: '',
    rememberMe: false,
  },
  storeName: 'login-form-store',
  validationMessages: {
    thoughtMetricsId: 'Thought Metrics ID is required',
    password: 'Password is required',
    loginError: 'Invalid credentials. Please check your ID and password.',
    submitError: 'Login failed. Please try again.',
  },
  formResetDelay: 1000,
  apiSimulationDelay: 1500,
  ui: {
    pageTitle: 'Log in to Thought Metrics',
    fieldLabels: {
      thoughtMetricsId: 'Email ID',
      password: 'Password',
    },
    checkboxLabels: {
      rememberMe: 'Remember me',
    },
    buttons: {
      continue: 'Continue',
      continuing: 'Signing in...',
      createAccount: 'Create a Thought Metrics ID',
    },
    links: {
      noAccount: "Don't have an account?",
      resetPassword: 'Click here',
      createAccount: 'Create a Thought Metrics ID',
    },
    successMessage: {
      title: 'Welcome Back!',
      description: 'You have successfully logged in to Thought Metrics.',
    },
  },
};

export const signUpFormConstant = {
  initialFormData: {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    dateOfBirth: {
      month: '',
      day: '',
      year: '',
    },
    gender: '',
    location: {
      doorNumberOrStreetName: '',
      city: '',
      zipCode: '',
      district: '',
      state: '',
      countryOrRegion: 'India',
    },
    participationPreferences: [],
    termsAccepted: true,
    privacyAccepted: true,
    paymentMethod: '',
    payment: {
      upiId: '',
      upiFullName: '',
      upiMobileNumber: '', 
      
      bankAccountNumber: '',
      bankIfscCode: '',
      bankAccountHolderName: '',
    },
  },
  participationOptions: [
    {
      id: 'thoughtMetricsFacilities',
      label: 'Interviews at Thought Metrics facilities',
    },
    { id: 'phoneInterviews', label: 'Phone Interviews' },
    { id: 'onlineInterviews', label: 'Online Interviews' },
    { id: 'interviewsAtHome', label: 'Interviews at my home' },
    { id: 'localBusinesses', label: 'Interviews at local businesses' },
  ],
  genders: formsConstants.genders,
  countries: addressConstants.countries,
  months: dateConstants.months,
  states: [
    { code: 'AL', name: 'Alabama' },
    { code: 'AK', name: 'Alaska' },
    { code: 'AZ', name: 'Arizona' },
    { code: 'AR', name: 'Arkansas' },
    { code: 'CA', name: 'California' },
    { code: 'CO', name: 'Colorado' },
    { code: 'CT', name: 'Connecticut' },
    { code: 'DE', name: 'Delaware' },
    { code: 'FL', name: 'Florida' },
    { code: 'GA', name: 'Georgia' },
    { code: 'HI', name: 'Hawaii' },
    { code: 'ID', name: 'Idaho' },
    { code: 'IL', name: 'Illinois' },
    { code: 'IN', name: 'Indiana' },
    { code: 'IA', name: 'Iowa' },
    { code: 'KS', name: 'Kansas' },
    { code: 'KY', name: 'Kentucky' },
    { code: 'LA', name: 'Louisiana' },
    { code: 'ME', name: 'Maine' },
    { code: 'MD', name: 'Maryland' },
    { code: 'MA', name: 'Massachusetts' },
    { code: 'MI', name: 'Michigan' },
    { code: 'MN', name: 'Minnesota' },
    { code: 'MS', name: 'Mississippi' },
    { code: 'MO', name: 'Missouri' },
    { code: 'MT', name: 'Montana' },
    { code: 'NE', name: 'Nebraska' },
    { code: 'NV', name: 'Nevada' },
    { code: 'NH', name: 'New Hampshire' },
    { code: 'NJ', name: 'New Jersey' },
    { code: 'NM', name: 'New Mexico' },
    { code: 'NY', name: 'New York' },
    { code: 'NC', name: 'North Carolina' },
    { code: 'ND', name: 'North Dakota' },
    { code: 'OH', name: 'Ohio' },
    { code: 'OK', name: 'Oklahoma' },
    { code: 'OR', name: 'Oregon' },
    { code: 'PA', name: 'Pennsylvania' },
    { code: 'RI', name: 'Rhode Island' },
    { code: 'SC', name: 'South Carolina' },
    { code: 'SD', name: 'South Dakota' },
    { code: 'TN', name: 'Tamil Nadu' },
    { code: 'TX', name: 'Texas' },
    { code: 'UT', name: 'Utah' },
    { code: 'VT', name: 'Vermont' },
    { code: 'VA', name: 'Virginia' },
    { code: 'WA', name: 'Washington' },
    { code: 'WV', name: 'West Virginia' },
    { code: 'WI', name: 'Wisconsin' },
    { code: 'WY', name: 'Wyoming' },
  ],
  //Bug: States drop down should be based on country drop down chosen by the user.
  countryCodes: [
    { code: '+91', country: 'India' },
    { code: '+1', country: 'USA' },
    { code: '+44', country: 'UK' },
  ],
  //Bug: All countries should be listed here.
  defaultCountryCode: '+91',
  storeName: 'registration-form-store',
  validationMessages: {
    firstName: 'First name is required',
    lastName: 'Last name is required',
    email: {
      required: 'Email is required',
      invalid: 'Email is invalid',
    },
    password: 'Password is required',
    confirmPassword: {
      required: 'Please confirm your password',
      mismatch: 'Passwords do not match',
    },
    doorNumberOrStreetName: 'Street address is required',
    city: 'City is required',
    state: 'State is required',
    countryOrRegion: 'Country or region is required',
    zipCode: 'Zip code is required',
    dateOfBirth: 'Date of birth is required',
    termsAccepted: 'You must accept the terms and conditions',
    privacyAccepted: 'You must accept the privacy policy',
    gender: 'Gender is required',
    phone: {
      invalid: 'Phone number must be exactly 10 digits',
    },
    submitError: 'Registration failed. Please try again.',
  },
  emailRegex: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
  formResetDelay: 3000,
  apiSimulationDelay: 2000,
  ui: {
    pageTitle: 'Create an Account',
    whyRegister: 'Why Register?',
    registerDescription:
      '(There is a joining bonus of ₹ 50 on successful registration. This will be credited to your account after your first completed survey. T&C apply.)',
    socialButtons: {
      facebook: 'Continue with Facebook',
      google: 'Continue with Google',
    },
    steps: {
      step1: {
        number: 'Step 1',
        title: 'Your Information',
        active: true,
      },
      step2: {
        number: 'Step 2',
        title: 'Preferences',
        active: false,
      },
      step3: {
        number: 'Step 3',
        title: 'Payment Info',
        active: false,
      },
      step4: {
        number: 'Step 4',
        title: 'Surveys',
        active: false,
      },
    },
    fieldLabels: {
      firstName: 'First name',
      lastName: 'Last name',
      doorNumberOrStreetName: 'Door No/ Street Address',
      district: 'District (Optional)',
      email: 'Email',
      phone: 'Phone (Optional)',
      city: 'City',
      state: 'State',
      countryOrRegion: 'Country Or Region',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      zipCode: 'Zip Code',
      dateOfBirth: 'Date of Birth',
      gender: 'Gender (Optional)',
    },
    preferences: {
      title: 'Participation Preferences',
      description:
        'Are there any types of studies in which you would not like to participate? If so unselect them below.',
    },
    checkboxLabels: {
      termsAccepted:
        'I have read and understand my responsibilities as a participant and I agree to the',
      termsItem: {
        terms: 'TERMS AND CONDITIONS',
        path: ROUTES.TERMS_AND_CONDITIONS,
      },
      privacyAccepted: {
        prefix: 'By clicking "Next", you are agreeing to Thought Metrics',
        suffix:
          'for receiving survey invitations for purposes of collection, compilation of demographic and attitudinal information and length of data retention. If you have provided your phone number to Thought Metrics, you agree to that Thought Metrics and its clients may call and send text messages for project-related purposes. You may revise your consent at any time.',
      },
      privacyItem: {
        privacy: 'PRIVACY POLICY',
        path: ROUTES.PRIVACY_POLICY,
      },
    },
    buttons: {
      next: 'Next',
      register: 'Register',
      processing: 'Processing...',
    },
    notes: {
      requiredFields: '* denotes required field',
    },
    successMessage: {
      title: 'Welcome to Thought Metrics!',
      description:
        'Your account has been created successfully. You can now participate in research studies and surveys.',
    },
    faqData: [
      {
        question: "What's a focus group?",
        answer:
          "A focus group is a round-table discussion on products and services that you use. The discussions are led by market research professionals and usually last between 1–2 hours. While focus groups are a common type of research study, we also conduct taste tests, product trials, in-home interviews, shop-along interviews, phone interviews, and online research.\nWhen you're done, you will receive an incentive for your contribution!",
      },
      {
        question: 'Why and how do I register?',
        answer:
          "Registering will add you to Thought Metrics' participant community, giving you access to various study opportunities. During the sign-up process, we will ask for:\n• Contact information\n• Demographic details\n• Household information\n\nThis helps us identify if you qualify for a particular project. Additional screening may be needed to confirm qualification.",
      },
      {
        question: 'Where does Thought Metrics do a focus group?',
        answer:
          'Thought Metrics has focus group facilities across India. When you register, you can choose the one nearest to you. If you do not live close to any facility, you can register for our national database, and you will be eligible for phone or online interviews.',
      },
      {
        question: 'Do you do other types of studies?',
        answer:
          'Yes! While focus groups are a common type of research study, we also conduct:\n• Online surveys\n• Phone surveys\n• In-home interviews\n• Shop-along interviews\n• Product trials\n• Taste tests',
      },
      {
        question: 'Once I have registered, what happens?',
        answer:
          'Once you register, your details are stored in the Thought Metrics participant community. From there:\n• You may be contacted for projects you qualify for based on your profile\n• Some additional screening may be required to confirm eligibility\n• When selected, you will be provided with study details, timing, and incentive information',
      },
      {
        question: 'Is my information safe?',
        answer:
          'Yes! Thought Metrics adheres to the Insights Association Code of Standards and Ethics for Market Research and Data Analytics. Your information is kept completely confidential. We do not sell or share your information with any third party. For more information, please see our Privacy Policy.',
      },
      {
        question: 'What are my responsibilities as a focus group participant?',
        answer:
          'To make research meaningful and accurate, we ask all participants to:\n• Be truthful when answering questions about yourself and your habits\n• Arrive for your appointment on time and ready to participate in the discussion\n• Notify Thought Metrics if you must cancel, with as much advance notice as possible\n• Enjoy it! Focus groups are fun and engaging',
      },
      {
        question: 'How do I unsubscribe?',
        answer:
          'If you would like to unsubscribe from our database and no longer receive calls or emails about upcoming focus groups, please click unsubscribe from your account settings.',
      },
    ],
  },
};

export const unsubscribeConstant = {
  initialFormData: {
    reasons: [],
  },
  unsubscribeReasonOptions: [
    {
      id: 'stopContactNotParticipate',
      label: 'Please stop contacting me, I no longer wish to participate',
    },
    {
      id: 'notReceiveMail',
      label: 'I do not wish to receive any emails or texts, at all',
    },
    {
      id: 'confirmationEmail',
      label: 'I only wish to receive confirmation emails and texts',
    },
  ],
  storeName: 'unsubscribe-store',
  formResetDelay: 3000,
  ui: {
    pageTitle: 'Unsubscribe',
    description:
      'We are sorry to see you go. Please fill out the form below so we can have your record modified or removed. You may also',
    buttons: {
      submit: 'Submit',
      submitting: 'Submitting...',
    },
    successMessage: {
      title: 'Thank you for using our service!',
      description: 'Your account has been unsubscribed successfully.',
    },
  },
};

export const editProfileFormConstant = {
  participationOptions: [
    {
      id: 'thoughtMetricsFacilities',
      label: 'Interviews at Thought Metrics facilities',
    },
    { id: 'phoneInterviews', label: 'Phone Interviews' },
    { id: 'onlineInterviews', label: 'Online Interviews' },
    { id: 'interviewsAtHome', label: 'Interviews at my home' },
    { id: 'localBusinesses', label: 'Interviews at local businesses' },
  ],
  genders: formsConstants.genders,
  countries: addressConstants.countries,
  months: dateConstants.months,
  states: [
    { code: 'AL', name: 'Alabama' },
    { code: 'AK', name: 'Alaska' },
    { code: 'AZ', name: 'Arizona' },
    { code: 'AR', name: 'Arkansas' },
    { code: 'CA', name: 'California' },
    { code: 'CO', name: 'Colorado' },
    { code: 'CT', name: 'Connecticut' },
    { code: 'DE', name: 'Delaware' },
    { code: 'FL', name: 'Florida' },
    { code: 'GA', name: 'Georgia' },
    { code: 'HI', name: 'Hawaii' },
    { code: 'ID', name: 'Idaho' },
    { code: 'IL', name: 'Illinois' },
    { code: 'IN', name: 'Indiana' },
    { code: 'IA', name: 'Iowa' },
    { code: 'KS', name: 'Kansas' },
    { code: 'KY', name: 'Kentucky' },
    { code: 'LA', name: 'Louisiana' },
    { code: 'ME', name: 'Maine' },
    { code: 'MD', name: 'Maryland' },
    { code: 'MA', name: 'Massachusetts' },
    { code: 'MI', name: 'Michigan' },
    { code: 'MN', name: 'Minnesota' },
    { code: 'MS', name: 'Mississippi' },
    { code: 'MO', name: 'Missouri' },
    { code: 'MT', name: 'Montana' },
    { code: 'NE', name: 'Nebraska' },
    { code: 'NV', name: 'Nevada' },
    { code: 'NH', name: 'New Hampshire' },
    { code: 'NJ', name: 'New Jersey' },
    { code: 'NM', name: 'New Mexico' },
    { code: 'NY', name: 'New York' },
    { code: 'NC', name: 'North Carolina' },
    { code: 'ND', name: 'North Dakota' },
    { code: 'OH', name: 'Ohio' },
    { code: 'OK', name: 'Oklahoma' },
    { code: 'OR', name: 'Oregon' },
    { code: 'PA', name: 'Pennsylvania' },
    { code: 'RI', name: 'Rhode Island' },
    { code: 'SC', name: 'South Carolina' },
    { code: 'SD', name: 'South Dakota' },
    { code: 'TN', name: 'Tamil Nadu' },
    { code: 'TX', name: 'Texas' },
    { code: 'UT', name: 'Utah' },
    { code: 'VT', name: 'Vermont' },
    { code: 'VA', name: 'Virginia' },
    { code: 'WA', name: 'Washington' },
    { code: 'WV', name: 'West Virginia' },
    { code: 'WI', name: 'Wisconsin' },
    { code: 'WY', name: 'Wyoming' },
  ],
  countryCodes: phoneConstants.countryCodes,
  defaultCountryCode: '+91',
  validationMessages: {
    firstName: 'First name is required',
    lastName: 'Last name is required',
    email: {
      required: 'Email is required',
      invalid: 'Email is invalid',
    },
    doorNumberOrStreetName: 'Street address is required',
    city: 'City is required',
    state: 'State is required',
    countryOrRegion: 'Country or region is required',
    zipCode: 'Zip code is required',
    dateOfBirth: 'Date of birth is required',
    gender: 'Gender is required',
    submitError: 'Update failed. Please try again.',
  },
  emailRegex: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
  ui: {
    pageTitle: 'Edit Profile',
    fieldLabels: {
      firstName: 'First name',
      lastName: 'Last name',
      doorNumberOrStreetName: 'Door No/ Street Address',
      district: 'District (Optional)',
      email: 'Email',
      phone: 'Phone (Optional)',
      city: 'City',
      state: 'State',
      countryOrRegion: 'Country Or Region',
      zipCode: 'Zip Code',
      dateOfBirth: 'Date of Birth (Optional)',
      gender: 'Gender (Optional)',
    },
    preferences: {
      title: 'Participation Preferences',
      description:
        'Are there any types of studies in which you would not like to participate? If so unselect them below.',
    },
    buttons: {
      save: 'Save Changes',
      saving: 'Saving...',
      cancel: 'Cancel',
    },
    notes: {
      requiredFields: '* denotes required field',
    },
    successMessage: {
      title: 'Profile Updated!',
      description: 'Your profile has been successfully updated.',
    },
  },
};
