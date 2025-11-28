/**
 * UI Translations
 * Centralized translation strings for all UI elements
 *
 * Structure:
 * - Organized by feature/component
 * - Type-safe with TypeScript
 * - Easy to extend for new languages
 *
 * Best Practices:
 * - Use nested objects for logical grouping
 * - Keep keys consistent across languages
 * - Add comments for context
 */

import type { SupportedLanguage } from '@/core/stores/language.store';

/**
 * Translation structure interface
 * Ensures type safety across all translations
 */
export interface Translations {
  common: {
    loading: string;
    error: string;
    success: string;
    submit: string;
    cancel: string;
    save: string;
    delete: string;
    edit: string;
    close: string;
    back: string;
    next: string;
    finish: string;
    yes: string;
    no: string;
    optional: string;
    required: string;
    search: string;
    filter: string;
    clear: string;
    apply: string;
    reset: string;
  };

  navigation: {
    home: string;
    surveys: string;
    profile: string;
    settings: string;
    logout: string;
    login: string;
    signup: string;
  };

  surveyBoard: {
    title: string;
    welcome: string;
    welcomeBack: string;
    verifyProfile: string;
    startMessage: string;
    noSurveys: string;
    noSurveysForIndustry: string;
    filterByIndustry: string;
    allIndustries: string;
    available: string;
    draft: string;
    submitted: string;
    approved: string;
    declined: string;
    completed: string;
    minutes: string;
    resume: string;
    start: string;
  };

  surveyDetail: {
    question: string;
    of: string;
    optional: string;
    required: string;
    comment: string;
    commentPlaceholder: string;
    saveDraft: string;
    continue: string;
    submit: string;
    submitting: string;
    backToSurveys: string;
    alreadyCompleted: string;
    submittedMessage: string;
    approvedMessage: string;
    declinedMessage: string;
    thankYou: string;
    surveyCompleted: string;
    responseRecorded: string;
    pleaseAnswer: string;
    complete: string;
  };

  surveySuccess: {
    title: string;
    message: string;
    subMessage: string;
    backButton: string;
  };

  toast: {
    surveySubmittedSuccess: string;
    surveySubmittedError: string;
    profileUpdatedSuccess: string;
    profileUpdatedError: string;
  };

  surveyQuestions: {
    selectOption: string;
    selectMultiple: string;
    enterValue: string;
    typeHere: string;
    selectDate: string;
    uploadFile: string;
    dragItems: string;
    rankItems: string;
    allocatePoints: string;
    totalPoints: string;
    pointsRemaining: string;
    selectMost: string;
    selectLeast: string;
    noOptionsSelected: string;
    invalidInput: string;
  };

  validation: {
    required: string;
    invalidEmail: string;
    invalidPhone: string;
    minLength: string;
    maxLength: string;
    minValue: string;
    maxValue: string;
    invalidDate: string;
    invalidFile: string;
    selectAtLeast: string;
    selectAtMost: string;
    totalMustBe: string;
  };

  profile: {
    title: string;
    editProfile: string;
    personalInfo: string;
    contactInfo: string;
    firstName: string;
    lastName: string;
    displayName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    gender: string;
    city: string;
    state: string;
    country: string;
    saveChanges: string;
    cancel: string;
    profileUpdated: string;
    doorNumberOrStreetName: string;
    district: string;
    zipCode: string;
    selectGender: string;
    selectState: string;
    selectCountry: string;
    selectMonth: string;
    selectDay: string;
    selectYear: string;
    participationPreferencesTitle: string;
    participationPreferencesDescription: string;
    requiredFields: string;
    saving: string;
    optional: string;
  };

  participationOptions: {
    thoughtMetricsFacilities: string;
    phoneInterviews: string;
    onlineInterviews: string;
    interviewsAtHome: string;
    localBusinesses: string;
  };

  language: {
    selectLanguage: string;
    english: string;
    tamil: string;
    hindi: string;
    malayalam: string;
    kannada: string;
    telugu: string;
    changeLanguage: string;
    languageChanged: string;
  };

  errors: {
    generic: string;
    network: string;
    timeout: string;
    unauthorized: string;
    forbidden: string;
    notFound: string;
    serverError: string;
    tryAgain: string;
  };

  industries: {
    all: string;
    advertisingMarketing: string;
    automotive: string;
    education: string;
    financialServices: string;
    fmcg: string;
    healthcare: string;
    humanResources: string;
    internetMedia: string;
    investorPrivateEquity: string;
    retailMerchandising: string;
    technology: string;
    others: string;
  };

  auth: {
    login: {
      pageTitle: string;
      thoughtMetricsId: string;
      password: string;
      rememberMe: string;
      continueButton: string;
      signingIn: string;
      createAccount: string;
      noAccount: string;
      resetPassword: string;
      welcomeBack: string;
      successMessage: string;
      invalidCredentials: string;
      loginFailed: string;
      thoughtMetricsIdRequired: string;
      passwordRequired: string;
      redirecting: string;
      pleaseWait: string;
    };
    signup: {
      pageTitle: string;
      whyRegister: string;
      registerDescription: string;
      continueWithFacebook: string;
      continueWithGoogle: string;
      step1: string;
      step2: string;
      step3: string;
      step4: string;
      yourInformation: string;
      preferences: string;
      paymentInfo: string;
      surveys: string;
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      confirmPassword: string;
      phone: string;
      doorNumber: string;
      district: string;
      city: string;
      state: string;
      country: string;
      zipCode: string;
      dateOfBirth: string;
      gender: string;
      participationPreferences: string;
      participationDescription: string;
      thoughtMetricsFacilities: string;
      phoneInterviews: string;
      onlineInterviews: string;
      interviewsAtHome: string;
      localBusinesses: string;
      termsAccepted: string;
      termsAndConditions: string;
      privacyAccepted: string;
      privacyPolicy: string;
      nextButton: string;
      registerButton: string;
      processing: string;
      requiredFields: string;
      welcomeMessage: string;
      accountCreatedSuccess: string;
      firstNameRequired: string;
      lastNameRequired: string;
      emailRequired: string;
      emailInvalid: string;
      passwordRequired: string;
      confirmPasswordRequired: string;
      passwordMismatch: string;
      addressRequired: string;
      cityRequired: string;
      stateRequired: string;
      countryRequired: string;
      zipCodeRequired: string;
      dateOfBirthRequired: string;
      genderRequired: string;
      termsRequired: string;
      privacyRequired: string;
      registrationFailed: string;
      optional: string;
      redirecting: string;
      pleaseWait: string;
      faq: {
        question1: string;
        answer1: string;
        question2: string;
        answer2: string;
        question3: string;
        answer3: string;
        question4: string;
        answer4: string;
        question5: string;
        answer5: string;
        question6: string;
        answer6: string;
        question7: string;
        answer7: string;
        question8: string;
        answer8: string;
      };
      payment: {
        title: string;
        description: string;
        methodLabel: string;
        methodPlaceholder: string;
        upiPayment: string;
        bankTransfer: string;
        skipForNow: string;
        skipMessage: string;
        upi: {
          upiIdLabel: string;
          upiIdPlaceholder: string;
          mobileLabel: string;
          mobilePlaceholder: string;
          fullNameLabel: string;
        };
        bank: {
          accountNumberLabel: string;
          ifscLabel: string;
          holderNameLabel: string;
        };
      };
    };
  };
}

/**
 * English Translations
 */
const en: Translations = {
  common: {
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    submit: 'Submit',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    close: 'Close',
    back: 'Back',
    next: 'Next',
    finish: 'Finish',
    yes: 'Yes',
    no: 'No',
    optional: 'Optional',
    required: 'Required',
    search: 'Search',
    filter: 'Filter',
    clear: 'Clear',
    apply: 'Apply',
    reset: 'Reset',
  },

  navigation: {
    home: 'Home',
    surveys: 'Surveys',
    profile: 'Profile',
    settings: 'Settings',
    logout: 'Logout',
    login: 'Login',
    signup: 'Sign Up',
  },

  surveyBoard: {
    title: 'Available Surveys',
    welcome: 'Welcome',
    welcomeBack: 'Welcome back',
    verifyProfile: 'Verify/update your profile',
    startMessage:
      'Start seeing if you pre-qualify for a study by filling out the survey at the link(s) below.',
    noSurveys: 'No Surveys Available Yet',
    noSurveysForIndustry: 'No Surveys Available for Selected Industry',
    filterByIndustry: 'Filter by Industry',
    allIndustries: 'All Industries',
    available: 'Available',
    draft: 'Draft Saved',
    submitted: 'Submitted',
    approved: 'Approved',
    declined: 'Declined',
    completed: 'Completed',
    minutes: 'min',
    resume: 'Resume',
    start: 'Start',
  },

  surveyDetail: {
    question: 'Question',
    of: 'of',
    optional: '(Optional)',
    required: '(Required)',
    comment: 'Add a comment',
    commentPlaceholder: 'Share your thoughts...',
    saveDraft: 'Save Draft',
    continue: 'Continue',
    submit: 'Submit Survey',
    submitting: 'Submitting...',
    backToSurveys: 'Back to Surveys',
    alreadyCompleted: 'Survey Already Completed',
    submittedMessage:
      'You have already submitted a response for this survey. It is currently under review.',
    approvedMessage:
      'Your response has been approved. Thank you for your participation!',
    declinedMessage:
      'Your response was reviewed. Please check your email for more details.',
    thankYou: 'Thank You!',
    surveyCompleted: 'Survey Completed Successfully',
    responseRecorded: 'Your response has been recorded successfully.',
    pleaseAnswer: 'Please answer this question to continue',
    complete: 'Complete',
  },

  surveySuccess: {
    title: 'Thank you for your responses!',
    message:
      'Our team will review your answers. If you meet the criteria for this study, a Thought Metrics representative will contact you for next steps.',
    subMessage: "Stay tuned — your opinions help shape tomorrow's decisions!",
    backButton: 'Back to Surveys',
  },

  toast: {
    surveySubmittedSuccess:
      'Survey submitted successfully! You will be contacted soon.',
    surveySubmittedError: 'Failed to submit survey. Please try again.',
    profileUpdatedSuccess: 'Profile updated successfully!',
    profileUpdatedError: 'Failed to update profile. Please try again.',
  },

  surveyQuestions: {
    selectOption: 'Select an option',
    selectMultiple: 'Select all that apply',
    enterValue: 'Enter value',
    typeHere: 'Type here...',
    selectDate: 'Select date',
    uploadFile: 'Upload file',
    dragItems: 'Drag to reorder',
    rankItems: 'Rank from most to least important',
    allocatePoints: 'Allocate points',
    totalPoints: 'Total Points',
    pointsRemaining: 'Points Remaining',
    selectMost: 'Select most important',
    selectLeast: 'Select least important',
    noOptionsSelected: 'No options selected',
    invalidInput: 'Invalid input',
  },

  validation: {
    required: 'This field is required',
    invalidEmail: 'Invalid email address',
    invalidPhone: 'Invalid phone number',
    minLength: 'Minimum {min} characters required',
    maxLength: 'Maximum {max} characters allowed',
    minValue: 'Minimum value is {min}',
    maxValue: 'Maximum value is {max}',
    invalidDate: 'Invalid date',
    invalidFile: 'Invalid file format',
    selectAtLeast: 'Select at least {min} option(s)',
    selectAtMost: 'Select at most {max} option(s)',
    totalMustBe: 'Total must be exactly {total}',
  },

  profile: {
    title: 'Profile',
    editProfile: 'Edit Profile',
    personalInfo: 'Personal Information',
    contactInfo: 'Contact Information',
    firstName: 'First Name',
    lastName: 'Last Name',
    displayName: 'Display Name',
    email: 'Email',
    phone: 'Phone',
    dateOfBirth: 'Date of Birth',
    gender: 'Gender',
    city: 'City',
    state: 'State',
    country: 'Country',
    saveChanges: 'Save Changes',
    cancel: 'Cancel',
    profileUpdated: 'Profile updated successfully',
    doorNumberOrStreetName: 'Door No/ Street Address',
    district: 'District',
    zipCode: 'ZIP/PIN Code',
    selectGender: 'Select gender',
    selectState: 'Select state',
    selectCountry: 'Select country/region',
    selectMonth: 'Month',
    selectDay: 'Day',
    selectYear: 'Year',
    participationPreferencesTitle: 'Participation Preferences',
    participationPreferencesDescription:
      'Indicate your willingness to participate in the following types of research',
    requiredFields: '* denotes required field',
    saving: 'Saving...',
    optional: 'Optional',
  },

  participationOptions: {
    thoughtMetricsFacilities: 'Interviews at Thought Metrics facilities',
    phoneInterviews: 'Phone Interviews',
    onlineInterviews: 'Online Interviews',
    interviewsAtHome: 'Interviews at my home',
    localBusinesses: 'Interviews at local businesses',
  },

  language: {
    selectLanguage: 'Select Language',
    english: 'English',
    tamil: 'தமிழ்',
    hindi: 'हिंदी',
    malayalam: 'മലയാളം',
    kannada: 'ಕನ್ನಡ',
    telugu: 'తెలుగు',
    changeLanguage: 'Change Language',
    languageChanged: 'Language changed successfully',
  },

  errors: {
    generic: 'Something went wrong. Please try again.',
    network: 'Network error. Please check your connection.',
    timeout: 'Request timeout. Please try again.',
    unauthorized: 'Please login to continue.',
    forbidden: 'You do not have permission to access this resource.',
    notFound: 'The requested resource was not found.',
    serverError: 'Server error. Please try again later.',
    tryAgain: 'Try Again',
  },

  industries: {
    all: 'All Industries',
    advertisingMarketing: 'Advertising & Marketing',
    automotive: 'Automotive',
    education: 'Education',
    financialServices: 'Financial Services & Insurance',
    fmcg: 'FMCG',
    healthcare: 'Healthcare & Life Sciences',
    humanResources: 'Human Resources',
    internetMedia: 'Internet & Media',
    investorPrivateEquity: 'Investor & Private Equity',
    retailMerchandising: 'Retail & Merchandising',
    technology: 'Technology',
    others: 'Others',
  },

  auth: {
    login: {
      pageTitle: 'Log in to Thought Metrics',
      thoughtMetricsId: 'Email ID',
      password: 'Password',
      rememberMe: 'Remember me',
      continueButton: 'Continue',
      signingIn: 'Signing in...',
      createAccount: 'Create a Thought Metrics ID',
      noAccount: "Don't have an account?",
      resetPassword: 'Click here',
      welcomeBack: 'Welcome Back!',
      successMessage: 'You have successfully logged in to Thought Metrics.',
      invalidCredentials:
        'Invalid credentials. Please check your ID and password.',
      loginFailed: 'Login failed. Please try again.',
      thoughtMetricsIdRequired: 'Thought Metrics ID is required',
      passwordRequired: 'Password is required',
      redirecting: 'Signing you in...',
      pleaseWait: 'Please wait while we redirect you',
    },
    signup: {
      pageTitle: 'Create an Account',
      whyRegister: 'Why Register?',
      registerDescription:
        '(There is a joining bonus of ₹ 50 on successful registration. This will be credited to your account after your first completed survey. T&C apply.)',
      continueWithFacebook: 'Continue with Facebook',
      continueWithGoogle: 'Continue with Google',
      step1: 'Step 1',
      step2: 'Step 2',
      step3: 'Step 3',
      step4: 'Step 4',
      yourInformation: 'Your Information',
      preferences: 'Preferences',
      paymentInfo: 'Payment Info',
      surveys: 'Surveys',
      firstName: 'First name',
      lastName: 'Last name',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      phone: 'Phone (Optional)',
      doorNumber: 'Door No/ Street Address',
      district: 'District (Optional)',
      city: 'City',
      state: 'State',
      country: 'Country Or Region',
      zipCode: 'Zip Code',
      dateOfBirth: 'Date of Birth',
      gender: 'Gender (Optional)',
      participationPreferences: 'Participation Preferences',
      participationDescription:
        'Are there any types of studies in which you would not like to participate? If so unselect them below.',
      thoughtMetricsFacilities: 'Interviews at Thought Metrics facilities',
      phoneInterviews: 'Phone Interviews',
      onlineInterviews: 'Online Interviews',
      interviewsAtHome: 'Interviews at my home',
      localBusinesses: 'Interviews at local businesses',
      termsAccepted:
        'I have read and understand my responsibilities as a participant and I agree to the',
      termsAndConditions: 'TERMS AND CONDITIONS',
      privacyAccepted:
        'By clicking "Next", you are agreeing to Thought Metrics',
      privacyPolicy: 'PRIVACY POLICY',
      nextButton: 'Next',
      registerButton: 'Register',
      processing: 'Processing...',
      requiredFields: '* denotes required field',
      welcomeMessage: 'Welcome to Thought Metrics!',
      accountCreatedSuccess:
        'Your account has been created successfully. You can now participate in research studies and surveys.',
      firstNameRequired: 'First name is required',
      lastNameRequired: 'Last name is required',
      emailRequired: 'Email is required',
      emailInvalid: 'Email is invalid',
      passwordRequired: 'Password is required',
      confirmPasswordRequired: 'Please confirm your password',
      passwordMismatch: 'Passwords do not match',
      addressRequired: 'Street address is required',
      cityRequired: 'City is required',
      stateRequired: 'State is required',
      countryRequired: 'Country or region is required',
      zipCodeRequired: 'Zip code is required',
      dateOfBirthRequired: 'Date of birth is required',
      genderRequired: 'Gender is required',
      termsRequired: 'You must accept the terms and conditions',
      privacyRequired: 'You must accept the privacy policy',
      registrationFailed: 'Registration failed. Please try again.',
      optional: '(Optional)',
      redirecting: 'Signing you in...',
      pleaseWait: 'Please wait while we redirect you',
      faq: {
        question1: "What's a focus group?",
        answer1:
          "A focus group is a round-table discussion on products and services that you use. The discussions are led by market research professionals and usually last between 1–2 hours. While focus groups are a common type of research study, we also conduct taste tests, product trials, in-home interviews, shop-along interviews, phone interviews, and online research.\nWhen you're done, you will receive an incentive for your contribution!",
        question2: 'Why and how do I register?',
        answer2:
          "Registering will add you to Thought Metrics' participant community, giving you access to various study opportunities. During the sign-up process, we will ask for:\n• Contact information\n• Demographic details\n• Household information\n\nThis helps us identify if you qualify for a particular project. Additional screening may be needed to confirm qualification.",
        question3: 'Where does Thought Metrics do a focus group?',
        answer3:
          'Thought Metrics has focus group facilities across India. When you register, you can choose the one nearest to you. If you do not live close to any facility, you can register for our national database, and you will be eligible for phone or online interviews.',
        question4: 'Do you do other types of studies?',
        answer4:
          'Yes! While focus groups are a common type of research study, we also conduct:\n• Online surveys\n• Phone surveys\n• In-home interviews\n• Shop-along interviews\n• Product trials\n• Taste tests',
        question5: 'Once I have registered, what happens?',
        answer5:
          'Once you register, your details are stored in the Thought Metrics participant community. From there:\n• You may be contacted for projects you qualify for based on your profile\n• Some additional screening may be required to confirm eligibility\n• When selected, you will be provided with study details, timing, and incentive information',
        question6: 'Is my information safe?',
        answer6:
          'Yes! Thought Metrics adheres to the Insights Association Code of Standards and Ethics for Market Research and Data Analytics. Your information is kept completely confidential. We do not sell or share your information with any third party. For more information, please see our Privacy Policy.',
        question7: 'What are my responsibilities as a focus group participant?',
        answer7:
          'To make research meaningful and accurate, we ask all participants to:\n• Be truthful when answering questions about yourself and your habits\n• Arrive for your appointment on time and ready to participate in the discussion\n• Notify Thought Metrics if you must cancel, with as much advance notice as possible\n• Enjoy it! Focus groups are fun and engaging',
        question8: 'How do I unsubscribe?',
        answer8:
          'If you would like to unsubscribe from our database and no longer receive calls or emails about upcoming focus groups, please click unsubscribe from your account settings.',
      },
      payment: {
        title: 'Payment Information',
        description:
          'Choose how you want to receive payments. You can update this later anytime.',
        methodLabel: 'Payment Method',
        methodPlaceholder: 'Select a method',
        upiPayment: 'UPI Payment',
        bankTransfer: 'Bank Transfer',
        skipForNow: 'Skip for now',
        skipMessage:
          'You can add your payment details later from your profile.',
        upi: {
          upiIdLabel: 'UPI ID (example: name@bank)',
          upiIdPlaceholder: 'Optional if using mobile number',
          mobileLabel: 'UPI Mobile Number',
          mobilePlaceholder: '10-digit mobile linked to UPI',
          fullNameLabel: 'Full Name (bank-verified)',
        },
        bank: {
          accountNumberLabel: 'Bank Account Number',
          ifscLabel: 'IFSC Code',
          holderNameLabel: 'Account Holder Name',
        },
      },
    },
  },
};

/**
 * Tamil Translations
 */
const ta: Translations = {
  common: {
    loading: 'ஏற்றுகிறது...',
    error: 'பிழை',
    success: 'வெற்றி',
    submit: 'சமர்ப்பிக்கவும்',
    cancel: 'ரத்து செய்',
    save: 'சேமி',
    delete: 'நீக்கு',
    edit: 'திருத்து',
    close: 'மூடு',
    back: 'பின்செல்',
    next: 'அடுத்து',
    finish: 'முடி',
    yes: 'ஆம்',
    no: 'இல்லை',
    optional: 'விருப்பமானது',
    required: 'தேவையானது',
    search: 'தேடு',
    filter: 'வடிகட்டு',
    clear: 'அழி',
    apply: 'பயன்படுத்து',
    reset: 'மீட்டமை',
  },

  navigation: {
    home: 'முகப்பு',
    surveys: 'கணக்கெடுப்புகள்',
    profile: 'சுயவிவரம்',
    settings: 'அமைப்புகள்',
    logout: 'வெளியேறு',
    login: 'உள்நுழை',
    signup: 'பதிவு செய்',
  },

  surveyBoard: {
    title: 'கிடைக்கும் கணக்கெடுப்புகள்',
    welcome: 'வருக',
    welcomeBack: 'மீண்டும் வரவேற்கிறோம்',
    verifyProfile: 'உங்கள் சுயவிவரத்தை சரிபார்க்கவும்/புதுப்பிக்கவும்',
    startMessage:
      'கீழே உள்ள இணைப்பு(களில்) உள்ள கணக்கெடுப்பை நிரப்புவதன் மூலம் நீங்கள் ஒரு ஆய்வுக்கு முன்-தகுதி பெறுகிறீர்களா என்பதைப் பார்க்கத் தொடங்குங்கள்.',
    noSurveys: 'இன்னும் கணக்கெடுப்புகள் இல்லை',
    noSurveysForIndustry: 'தேர்ந்தெடுக்கப்பட்ட துறைக்கு கணக்கெடுப்புகள் இல்லை',
    filterByIndustry: 'துறை வாரியாக வடிகட்டு',
    allIndustries: 'அனைத்து துறைகள்',
    available: 'சமர்ப்பிக்க',
    draft: 'வரைவு சேமிக்கப்பட்டது',
    submitted: 'சமர்ப்பிக்கப்பட்டது',
    approved: 'அங்கீகரிக்கப்பட்டது',
    declined: 'நிராகரிக்கப்பட்டது',
    completed: 'முடிக்கப்பட்டது',
    minutes: 'நிமிடம்',
    resume: 'தொடர்',
    start: 'தொடங்கு',
  },

  surveyDetail: {
    question: 'கேள்வி',
    of: 'இல்',
    optional: '(விருப்பமானது)',
    required: '(தேவையானது)',
    comment: 'கருத்தைச் சேர்க்கவும்',
    commentPlaceholder: 'உங்கள் எண்ணங்களைப் பகிரவும்...',
    saveDraft: 'வரைவைச் சேமி',
    continue: 'தொடர்க',
    submit: 'கணக்கெடுப்பை சமர்ப்பிக்கவும்',
    submitting: 'சமர்ப்பிக்கிறது...',
    backToSurveys: 'கணக்கெடுப்புகளுக்குத் திரும்பு',
    alreadyCompleted: 'கணக்கெடுப்பு ஏற்கனவே முடிக்கப்பட்டது',
    submittedMessage:
      'இந்த கணக்கெடுப்புக்கு நீங்கள் ஏற்கனவே பதிலை சமர்ப்பித்துள்ளீர்கள். அது தற்போது மதிப்பாய்வில் உள்ளது.',
    approvedMessage:
      'உங்கள் பதில் அங்கீகரிக்கப்பட்டுள்ளது. உங்கள் பங்கேற்புக்கு நன்றி!',
    declinedMessage:
      'உங்கள் பதில் மதிப்பாய்வு செய்யப்பட்டது. மேலும் விவரங்களுக்கு உங்கள் மின்னஞ்சலைச் சரிபார்க்கவும்.',
    thankYou: 'நன்றி!',
    surveyCompleted: 'கணக்கெடுப்பு வெற்றிகரமாக முடிக்கப்பட்டது',
    responseRecorded: 'உங்கள் பதில் வெற்றிகரமாக பதிவு செய்யப்பட்டுள்ளது.',
    pleaseAnswer: 'தொடர இந்த கேள்விக்கு பதிலளிக்கவும்',
    complete: 'முழுமை',
  },

  surveySuccess: {
    title: 'உங்கள் பதில்களுக்கு நன்றி!',
    message:
      'எங்கள் குழு உங்கள் பதில்களை மதிப்பாய்வு செய்யும். இந்த ஆய்வுக்கான அளவுகோல்களை நீங்கள் பூர்த்தி செய்தால், அடுத்த படிகளுக்கு Thought Metrics பிரதிநிதி உங்களைத் தொடர்பு கொள்வார்.',
    subMessage:
      'கவனமாக இருங்கள் — உங்கள் கருத்துகள் நாளைய முடிவுகளை வடிவமைக்க உதவுகின்றன!',
    backButton: 'கணக்கெடுப்புகளுக்குத் திரும்பு',
  },

  toast: {
    surveySubmittedSuccess:
      'கணக்கெடுப்பு வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது! விரைவில் உங்களைத் தொடர்பு கொள்வோம்.',
    surveySubmittedError:
      'கணக்கெடுப்பை சமர்ப்பிக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.',
    profileUpdatedSuccess: 'சுயவிவரம் வெற்றிகரமாக புதுப்பிக்கப்பட்டது!',
    profileUpdatedError:
      'சுயவிவரத்தை புதுப்பிக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.',
  },

  surveyQuestions: {
    selectOption: 'ஒரு விருப்பத்தைத் தேர்ந்தெடுக்கவும்',
    selectMultiple: 'பொருந்தும் அனைத்தையும் தேர்ந்தெடுக்கவும்',
    enterValue: 'மதிப்பை உள்ளிடவும்',
    typeHere: 'இங்கே தட்டச்சு செய்யவும்...',
    selectDate: 'தேதியைத் தேர்ந்தெடுக்கவும்',
    uploadFile: 'கோப்பைப் பதிவேற்றவும்',
    dragItems: 'மறுவரிசைப்படுத்த இழுக்கவும்',
    rankItems:
      'மிக முக்கியமானது முதல் குறைந்த முக்கியம் வரை தரவரிசைப்படுத்தவும்',
    allocatePoints: 'புள்ளிகளை ஒதுக்கவும்',
    totalPoints: 'மொத்த புள்ளிகள்',
    pointsRemaining: 'மீதம் உள்ள புள்ளிகள்',
    selectMost: 'மிக முக்கியமானதைத் தேர்ந்தெடுக்கவும்',
    selectLeast: 'குறைந்த முக்கியமானதைத் தேர்ந்தெடுக்கவும்',
    noOptionsSelected: 'விருப்பங்கள் எதுவும் தேர்ந்தெடுக்கப்படவில்லை',
    invalidInput: 'தவறான உள்ளீடு',
  },

  validation: {
    required: 'இந்த புலம் தேவையானது',
    invalidEmail: 'தவறான மின்னஞ்சல் முகவரி',
    invalidPhone: 'தவறான தொலைபேசி எண்',
    minLength: 'குறைந்தபட்சம் {min} எழுத்துக்கள் தேவை',
    maxLength: 'அதிகபட்சம் {max} எழுத்துக்கள் அனுமதிக்கப்படும்',
    minValue: 'குறைந்தபட்ச மதிப்பு {min}',
    maxValue: 'அதிகபட்ச மதிப்பு {max}',
    invalidDate: 'தவறான தேதி',
    invalidFile: 'தவறான கோப்பு வடிவம்',
    selectAtLeast: 'குறைந்தபட்சம் {min} விருப்பம்(களை) தேர்ந்தெடுக்கவும்',
    selectAtMost: 'அதிகபட்சம் {max} விருப்பம்(களை) தேர்ந்தெடுக்கவும்',
    totalMustBe: 'மொத்தம் சரியாக {total} ஆக இருக்க வேண்டும்',
  },

  profile: {
    title: 'சுயவிவரம்',
    editProfile: 'சுயவிவரத்தைத் திருத்து',
    personalInfo: 'தனிப்பட்ட தகவல்',
    contactInfo: 'தொடர்பு தகவல்',
    firstName: 'முதல் பெயர்',
    lastName: 'கடைசி பெயர்',
    displayName: 'காட்சிப் பெயர்',
    email: 'மின்னஞ்சல்',
    phone: 'தொலைபேசி',
    dateOfBirth: 'பிறந்த தேதி',
    gender: 'பாலினம்',
    city: 'நகரம்',
    state: 'மாநிலம்',
    country: 'நாடு',
    saveChanges: 'மாற்றங்களைச் சேமி',
    cancel: 'ரத்து செய்',
    profileUpdated: 'சுயவிவரம் வெற்றிகரமாக புதுப்பிக்கப்பட்டது',
    doorNumberOrStreetName: 'கதவு எண் / தெரு முகவரி',
    district: 'மாவட்டம்',
    zipCode: 'அஞ்சல் குறியீடு',
    selectGender: 'பாலினத்தைத் தேர்ந்தெடுக்கவும்',
    selectState: 'மாநிலத்தைத் தேர்ந்தெடுக்கவும்',
    selectCountry: 'நாடு/பகுதியைத் தேர்ந்தெடுக்கவும்',
    selectMonth: 'மாதம்',
    selectDay: 'நாள்',
    selectYear: 'வருடம்',
    participationPreferencesTitle: 'பங்கேற்பு விருப்பத்தேர்வுகள்',
    participationPreferencesDescription:
      'பின்வரும் வகையான ஆராய்ச்சியில் பங்கேற்க உங்கள் விருப்பத்தைக் குறிப்பிடவும்',
    requiredFields: '* தேவையான தகவல்களை குறிக்கிறது',
    saving: 'சேமிக்கப்படுகிறது...',
    optional: 'விருப்பமானது',
  },

  participationOptions: {
    thoughtMetricsFacilities: 'Thought Metrics வசதிகளில் நேர்காணல்கள்',
    phoneInterviews: 'தொலைபேசி நேர்காணல்கள்',
    onlineInterviews: 'ஆன்லைன் நேர்காணல்கள்',
    interviewsAtHome: 'எனது வீட்டில் நேர்காணல்கள்',
    localBusinesses: 'உள்ளூர் வணிகங்களில் நேர்காணல்கள்',
  },

  language: {
    selectLanguage: 'மொழியைத் தேர்ந்தெடு',
    english: 'English',
    tamil: 'தமிழ்',
    hindi: 'हिंदी',
    malayalam: 'മലയാളം',
    kannada: 'ಕನ್ನಡ',
    telugu: 'తెలుగు',
    changeLanguage: 'மொழியை மாற்று',
    languageChanged: 'மொழி வெற்றிகரமாக மாற்றப்பட்டது',
  },

  errors: {
    generic: 'ஏதோ தவறு நடந்தது. மீண்டும் முயற்சிக்கவும்.',
    network: 'நெட்வொர்க் பிழை. உங்கள் இணைப்பைச் சரிபார்க்கவும்.',
    timeout: 'கோரிக்கை நேரமுடிந்தது. மீண்டும் முயற்சிக்கவும்.',
    unauthorized: 'தொடர உள்நுழையவும்.',
    forbidden: 'இந்த ஆதாரத்தை அணுக உங்களுக்கு அனுமதி இல்லை.',
    notFound: 'கோரப்பட்ட ஆதாரம் கிடைக்கவில்லை.',
    serverError: 'சர்வர் பிழை. பின்னர் மீண்டும் முயற்சிக்கவும்.',
    tryAgain: 'மீண்டும் முயற்சிக்கவும்',
  },

  industries: {
    all: 'அனைத்து துறைகள்',
    advertisingMarketing: 'விளம்பரம் & சந்தைப்படுத்தல்',
    automotive: 'வாகனத் தொழில்',
    education: 'கல்வி',
    financialServices: 'நிதிச் சேவைகள் & காப்பீடு',
    fmcg: 'FMCG',
    healthcare: 'சுகாதாரம் & வாழ்க்கை அறிவியல்',
    humanResources: 'மனித வளங்கள்',
    internetMedia: 'இணையம் & ஊடகம்',
    investorPrivateEquity: 'முதலீட்டாளர் & தனியார் ஈக்விட்டி',
    retailMerchandising: 'சில்லறை & வணிகம்',
    technology: 'தொழில்நுட்பம்',
    others: 'பிறவை',
  },

  auth: {
    login: {
      pageTitle: 'Thought Metrics இல் உள்நுழைக',
      thoughtMetricsId: 'Thought Metrics அடையாளம்',
      password: 'பாஸ்வேர்டு',
      rememberMe: 'என்னை நினைவில் வைத்திருங்கள்',
      continueButton: 'தொடர்',
      signingIn: 'உள்நுழைகிறது...',
      createAccount: 'Thought Metrics அடையாளத்தை உருவாக்கு',
      noAccount: 'கணக்கு இல்லையா?',
      resetPassword: 'இங்கே கிளிக் செய்யவும்',
      welcomeBack: 'மீண்டும் வரவேற்கிறோம்!',
      successMessage: 'Thought Metrics இல் வெற்றிகரமாக உள்நுழைந்துள்ளீர்கள்.',
      invalidCredentials:
        'தவறான அறிமுகச் சான்றுகள். உங்கள் அடையாளம் மற்றும் கடவுச்சொல்லைச் சரிபார்க்கவும்.',
      loginFailed: 'உள்நுழைவு தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும்.',
      thoughtMetricsIdRequired: 'Thought Metrics அடையாளம் தேவை',
      passwordRequired: 'கடவுச்சொல் தேவை',
      redirecting: 'உங்களை உள்நுழைக்கிறோம்...',
      pleaseWait: 'நாங்கள் உங்களை திருப்பிவிடும் வரை காத்திருக்கவும்',
    },
    signup: {
      pageTitle: 'எங்களுடன் இணைய..',
      whyRegister: 'ஏன் இணைய  வேண்டும்?',
      registerDescription:
        '(எங்களுடன் இணைந்தால் ₹50 முதல் போனஸாக பெறுவீர்கள். இது உங்கள் முதல் முடிக்கப்பட்ட சர்வேக்கு பிறகு உங்கள் கணக்கில் வரவு வைக்கப்படும். நிபந்தனைகள் பொருந்தும்.)',
      continueWithFacebook: 'Facebook மூலம் தொடரவும்',
      continueWithGoogle: 'Google மூலம் தொடரவும்',
      step1: 'படி 1',
      step2: 'படி 2',
      step3: 'படி 3',
      step4: 'படி 4',
      yourInformation: 'உங்கள் தகவல்',
      preferences: 'விருப்பத்தேர்வுகள்',
      paymentInfo: 'கட்டண தகவல்',
      surveys: 'கணக்கெடுப்புகள்',
      firstName: 'முதல் பெயர்',
      lastName: 'கடைசி பெயர்',
      email: 'மின்னஞ்சல்',
      password: 'கடவுச்சொல்',
      confirmPassword: 'பாஸ்வேர்டை உறுதிப்படுத்து*',
      phone: 'தொலைபேசி (விரும்பினால்)',
      doorNumber: 'கதவு எண் / தெரு முகவரி',
      district: 'மாவட்டம் (விரும்பினால்)',
      city: 'நகரம்',
      state: 'மாநிலம்',
      country: 'நாடு அல்லது பகுதி',
      zipCode: 'அஞ்சல் குறியீடு',
      dateOfBirth: 'பிறந்த தேதி',
      gender: 'பாலினம் (விரும்பினால்)',
      participationPreferences: 'பங்கேற்பு விருப்பத்தேர்வுகள்',
      participationDescription:
        'நீங்கள் பங்கேற்க விரும்பாத எந்த வகையான ஆய்வுகள் உள்ளதா? அப்படியென்றால் கீழே அவற்றைத் தேர்வு நீக்கவும்.',
      thoughtMetricsFacilities: 'Thought Metrics வசதிகளில் நேர்காணல்கள்',
      phoneInterviews: 'தொலைபேசி நேர்காணல்கள்',
      onlineInterviews: 'ஆன்லைன் நேர்காணல்கள்',
      interviewsAtHome: 'என் வீட்டில் நேர்காணல்கள்',
      localBusinesses: 'உள்ளூர் வணிகங்களில் நேர்காணல்கள்',
      termsAccepted:
        'நான் பங்கேற்பாளராக எனது பொறுப்புகளைப் படித்து புரிந்துகொண்டேன் மற்றும் நான் ஒப்புக்கொள்கிறேன்',
      termsAndConditions: 'விதிமுறைகள் மற்றும் நிபந்தனைகள்',
      privacyAccepted:
        '"அடுத்து" என்பதைக் கிளிக் செய்வதன் மூலம், Thought Metrics க்கு நீங்கள் ஒப்புக்கொள்கிறீர்கள்',
      privacyPolicy: 'தனியுரிமைக் கொள்கை',
      nextButton: 'அடுத்து',
      registerButton: 'பதிவு செய்',
      processing: 'செயலாக்குகிறது...',
      requiredFields: '* தேவையான புலத்தைக் குறிக்கிறது',
      welcomeMessage: 'Thought Metrics க்கு வரவேற்கிறோம்!',
      accountCreatedSuccess:
        'உங்கள் கணக்கு வெற்றிகரமாக உருவாக்கப்பட்டது. நீங்கள் இப்போது ஆராய்ச்சி ஆய்வுகள் மற்றும் கணக்கெடுப்புகளில் பங்கேற்கலாம்.',
      firstNameRequired: 'முதல் பெயர் தேவை',
      lastNameRequired: 'கடைசி பெயர் தேவை',
      emailRequired: 'மின்னஞ்சல் தேவை',
      emailInvalid: 'மின்னஞ்சல் தவறானது',
      passwordRequired: 'கடவுச்சொல் தேவை',
      confirmPasswordRequired: 'உங்கள் கடவுச்சொல்லை உறுதிப்படுத்தவும்',
      passwordMismatch: 'கடவுச்சொற்கள் பொருந்தவில்லை',
      addressRequired: 'தெரு முகவரி தேவை',
      cityRequired: 'நகரம் தேவை',
      stateRequired: 'மாநிலம் தேவை',
      countryRequired: 'நாடு அல்லது பகுதி தேவை',
      zipCodeRequired: 'அஞ்சல் குறியீடு தேவை',
      dateOfBirthRequired: 'பிறந்த தேதி தேவை',
      genderRequired: 'பாலினம் தேவை',
      termsRequired: 'விதிமுறைகள் மற்றும் நிபந்தனைகளை ஏற்க வேண்டும்',
      privacyRequired: 'தனியுரிமைக் கொள்கையை ஏற்க வேண்டும்',
      registrationFailed: 'பதிவு தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும்.',
      optional: '(விரும்பினால்)',
      redirecting: 'உங்களை உள்நுழைக்கிறோம்...',
      pleaseWait: 'நாங்கள் உங்களை திருப்பிவிடும் வரை காத்திருக்கவும்',
      faq: {
        question1: 'ஃபோகஸ் குழு என்றால் என்ன?',
        answer1:
          'ஃபோகஸ் குழு என்பது நீங்கள் பயன்படுத்தும் தயாரிப்புகள் மற்றும் சேவைகள் பற்றிய வட்ட மேசை விவாதமாகும். இந்த விவாதங்கள் சந்தை ஆராய்ச்சி நிபுணர்களால் நடத்தப்படுகின்றன மற்றும் பொதுவாக 1-2 மணி நேரம் நீடிக்கும். ஃபோகஸ் குழுக்கள் பொதுவான ஆய்வு வகையாக இருந்தாலும், நாங்கள் சுவை சோதனைகள், தயாரிப்பு சோதனைகள், வீட்டு நேர்காணல்கள், கடை-உடன் நேர்காணல்கள், தொலைபேசி நேர்காணல்கள் மற்றும் ஆன்லைன் ஆராய்ச்சியையும் நடத்துகிறோம்.\nநீங்கள் முடித்த பிறகு, உங்கள் பங்களிப்புக்கான ஊக்கத்தொகையைப் பெறுவீர்கள்!',
        question2: 'நான் ஏன் மற்றும் எப்படி பதிவு செய்வது?',
        answer2:
          'பதிவு செய்வது Thought Metrics பங்கேற்பாளர் சமூகத்தில் உங்களைச் சேர்க்கும், பல்வேறு ஆய்வு வாய்ப்புகளுக்கான அணுகலை வழங்கும். பதிவு செயல்முறையின் போது, நாங்கள் கேட்போம்:\n• தொடர்பு தகவல்\n• மக்கள்தொகை விவரங்கள்\n• குடும்ப தகவல்\n\nஇது ஒரு குறிப்பிட்ட திட்டத்திற்கு நீங்கள் தகுதியுடையவரா என்பதை அடையாளம் காண உதவுகிறது. தகுதியை உறுதிப்படுத்த கூடுதல் திரையிடல் தேவைப்படலாம்.',
        question3: 'Thought Metrics எங்கு ஃபோகஸ் குழுவை நடத்துகிறது?',
        answer3:
          'Thought Metrics இந்தியா முழுவதும் ஃபோகஸ் குழு வசதிகளைக் கொண்டுள்ளது. நீங்கள் பதிவு செய்யும்போது, உங்களுக்கு மிக அருகில் உள்ளதைத் தேர்வு செய்யலாம். நீங்கள் எந்த வசதிக்கும் அருகில் வசிக்கவில்லை என்றால், எங்கள் தேசிய தரவுத்தளத்தில் பதிவு செய்யலாம், மேலும் நீங்கள் தொலைபேசி அல்லது ஆன்லைன் நேர்காணல்களுக்கு தகுதியுடையவராக இருப்பீர்கள்.',
        question4: 'நீங்கள் வேறு வகையான ஆய்வுகளை செய்கிறீர்களா?',
        answer4:
          'ஆம்! ஃபோகஸ் குழுக்கள் பொதுவான ஆய்வு வகையாக இருந்தாலும், நாங்கள் இதையும் நடத்துகிறோம்:\n• ஆன்லைன் கணக்கெடுப்புகள்\n• தொலைபேசி கணக்கெடுப்புகள்\n• வீட்டு நேர்காணல்கள்\n• கடை-உடன் நேர்காணல்கள்\n• தயாரிப்பு சோதனைகள்\n• சுவை சோதனைகள்',
        question5: 'நான் பதிவு செய்த பிறகு என்ன நடக்கும்?',
        answer5:
          'நீங்கள் பதிவு செய்த பிறகு, உங்கள் விவரங்கள் Thought Metrics பங்கேற்பாளர் சமூகத்தில் சேமிக்கப்படுகின்றன. அங்கிருந்து:\n• உங்கள் சுயவிவரத்தின் அடிப்படையில் நீங்கள் தகுதியுடைய திட்டங்களுக்காக தொடர்பு கொள்ளப்படலாம்\n• தகுதியை உறுதிப்படுத்த சில கூடுதல் திரையிடல் தேவைப்படலாம்\n• தேர்ந்தெடுக்கப்பட்டால், ஆய்வு விவரங்கள், நேரம் மற்றும் ஊக்கத்தொகை தகவல் உங்களுக்கு வழங்கப்படும்',
        question6: 'என் தகவல் பாதுகாப்பானதா?',
        answer6:
          'ஆம்! Thought Metrics சந்தை ஆராய்ச்சி மற்றும் தரவு பகுப்பாய்விற்கான Insights சங்க தர நெறிமுறைகள் மற்றும் நெறிமுறைகளை கடைபிடிக்கிறது. உங்கள் தகவல் முற்றிலும் ரகசியமாக வைக்கப்படுகிறது. நாங்கள் உங்கள் தகவலை எந்த மூன்றாம் தரப்பினருக்கும் விற்கவோ அல்லது பகிரவோ மாட்டோம். மேலும் தகவலுக்கு, தயவுசெய்து எங்கள் தனியுரிமைக் கொள்கையைப் பார்க்கவும்.',
        question7: 'ஃபோகஸ் குழு பங்கேற்பாளராக எனது பொறுப்புகள் என்ன?',
        answer7:
          'ஆராய்ச்சியை அர்த்தமுள்ளதாகவும் துல்லியமாகவும் செய்ய, அனைத்து பங்கேற்பாளர்களையும் கேட்டுக்கொள்கிறோம்:\n• உங்களைப் பற்றியும் உங்கள் பழக்கவழக்கங்களைப் பற்றியும் கேள்விகளுக்கு பதிலளிக்கும்போது உண்மையாக இருங்கள்\n• உங்கள் சந்திப்புக்கு சரியான நேரத்தில் வந்து விவாதத்தில் பங்கேற்கத் தயாராக இருங்கள்\n• நீங்கள் ரத்து செய்ய வேண்டுமானால், முடிந்தவரை முன் அறிவிப்புடன் Thought Metrics க்கு தெரிவிக்கவும்\n• அதை அனுபவியுங்கள்! ஃபோகஸ் குழுக்கள் வேடிக்கையானவை மற்றும் ஈர்க்கக்கூடியவை',
        question8: 'நான் எப்படி குழுவிலகம் செய்வது?',
        answer8:
          'எங்கள் தரவுத்தளத்திலிருந்து குழுவிலகம் செய்து, வரவிருக்கும் ஃபோகஸ் குழுக்கள் பற்றிய அழைப்புகள் அல்லது மின்னஞ்சல்களைப் பெறாமல் இருக்க விரும்பினால், உங்கள் கணக்கு அமைப்புகளில் இருந்து குழுவிலகம் என்பதைக் கிளிக் செய்யவும்.',
      },
      payment: {
        title: 'பணம் செலுத்தும் தகவல்',
        description:
          'நீங்கள் பணம் பெற விரும்பும் முறையை தேர்வு செய்யவும். நீங்கள் இதை எப்போதும் பின்னர் புதுப்பிக்கலாம்.',
        methodLabel: 'பணம் செலுத்தும் முறை',
        methodPlaceholder: 'ஒரு முறையைத் தேர்ந்தெடுக்கவும்',
        upiPayment: 'UPI பணம் செலுத்துதல்',
        bankTransfer: 'வங்கி பரிமாற்றம்',
        skipForNow: 'இப்போதைக்கு தவிர்க்கவும்',
        skipMessage:
          'உங்கள் பணம் செலுத்தும் விவரங்களை உங்கள் சுயவிவரத்தில் இருந்து பின்னர் சேர்க்கலாம்.',
        upi: {
          upiIdLabel: 'UPI ஐடி (எடுத்துக்காட்டு: பெயர்@வங்கி)',
          upiIdPlaceholder: 'மொபைல் எண்ணைப் பயன்படுத்தினால் விருப்பமானது',
          mobileLabel: 'UPI மொபைல் எண்',
          mobilePlaceholder: 'UPI உடன் இணைக்கப்பட்ட 10 இலக்க மொபைல்',
          fullNameLabel: 'முழு பெயர் (வங்கி சரிபார்க்கப்பட்டது)',
        },
        bank: {
          accountNumberLabel: 'வங்கிக் கணக்கு எண்',
          ifscLabel: 'IFSC குறியீடு',
          holderNameLabel: 'கணக்கு வைத்திருப்பவர் பெயர்',
        },
      },
    },
  },
};

/**
 * All translations organized by language
 */
export const translations: Record<SupportedLanguage, Translations> = {
  en,
  ta,
  // Placeholders for future languages
  hi: en, // Hindi - TODO: Add translations
  ml: en, // Malayalam - TODO: Add translations
  kn: en, // Kannada - TODO: Add translations
  te: en, // Telugu - TODO: Add translations
};

/**
 * Get translations for specific language
 */
export const getTranslations = (language: SupportedLanguage): Translations => {
  return translations[language] || translations.en;
};

/**
 * Translate a key with optional interpolation
 * Example: t('validation.minLength', { min: 5 }) => "Minimum 5 characters required"
 */
export const translate = (
  key: string,
  language: SupportedLanguage,
  params?: Record<string, string | number>
): string => {
  const trans = getTranslations(language);
  const keys = key.split('.');

  let value: any = trans;
  for (const k of keys) {
    value = value?.[k];
    if (value === undefined) break;
  }

  if (typeof value !== 'string') {
    console.warn(`Translation key not found: ${key}`);
    return key;
  }

  // Interpolate parameters
  if (params) {
    Object.entries(params).forEach(([param, val]) => {
      value = value.replace(`{${param}}`, String(val));
    });
  }

  return value;
};

/**
 * Export default
 */
export default translations;
