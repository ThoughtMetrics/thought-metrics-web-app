import {
  BusinessProfessionalsIcon,
  ConsumersIcon,
  HealthcareProfessionalsIcon,
  PatientsIcon,
} from '@/assets';
import { ROUTES } from '@/routes/routeConfig';

export const landing = {
  respondent: {
    heroSection: {
      head: 'Participate in Market Research Studies',
      label: 'Speak Up. Make an Impact.',
      description: 'Join in. Be heard. See the difference you make.',
      signButton: {
        label: 'Sign Me Up',
        path: ROUTES.SIGN_UP,
        signedInLabel: 'Take a Survey',
        signedInPath: ROUTES.SURVEY_PAGE,
      },
      faqButton: {
        label: 'FAQs',
        path: '#',
      },
    },
    caseStudySection: {
      label: 'Why We Want to Hear From You?',
      list: [
        "We're all about real voices and real stories. When you share your perspective, you're not just answering questions — you're helping brands, organizations, and communities do better.",
        "Whether you've got a quick opinion or a full story to tell, we want to hear it.",
      ],
      subContent: {
        label: 'Who can Join?',
        items: [
          {
            icon: ConsumersIcon,
            label: 'Consumers',
            description:
              'We welcome people from all walks of life — kids, teens, parents, grandparents, and everyone in between. Our studies cover a huge variety of topics, from gaming and food to alcohol and even diapers.',
          },
          {
            icon: BusinessProfessionalsIcon,
            label: 'Business professionals',
            description:
              'Many of our focus groups involve insights from industry pros, including IT decision-makers, business owners, executives, HR specialists, contractors, and educators.',
          },
          {
            icon: PatientsIcon,
            label: 'Patients',
            description:
              'Whether you use medications, treatments, or medical devices like injectable and wearables, your experience matters. We explore topics such as rare diseases, weight management, diabetes, and cancer.',
          },
          {
            icon: HealthcareProfessionalsIcon,
            label: 'Healthcare professionals',
            description:
              'We also have research opportunities for those working in healthcare, including patient care managers, physicians, nurses, pharmacists, dentists, surgeons, veterinarians, hospital administrators, and technicians, among others.',
          },
        ],
      },
      illustration: {
        img: '/images/landing_page_3.png',
        size: 'full',
        aspectRatio: 'portrait',
        shadowPosition: 'br',
        shadowOpacity: 'full',
        objectFit: 'cover',
        loading: 'lazy',
      },
    },
    workingFlowSection: {
      head: 'Basically, it works like this',
      items: [
        {
          sNo: '1',
          label: 'Sign Up',
          description: 'Fill out a quick form so we can get to know you.',
        },
        {
          sNo: '2',
          label: 'Share',
          description:
            'Share your thoughts in a group, survey, or one-on-one session.',
        },
        {
          sNo: '3',
          label: 'Get Rewarded',
          description:
            'Yes, your time and insights matter — and we make sure to thank you with monetary benefits.',
        },
        {
          sNo: '4',
          label: 'See the impact',
          description:
            'Your feedback helps shape decisions that affect products, services, and even policies.',
        },
      ],
    },
    blogSection: { title: 'Learn More About Participant Experience' },
    aboutUsSection: {
      illustration: {
        img: '/images/landing_page_7.png',
        size: 'full',
        aspectRatio: 'auto',
        shadowPosition: 'tl',
        shadowOpacity: 'full',
        objectFit: 'cover',
        loading: 'lazy',
      },
      label: 'Sign Up for a Study',
      description:
        "We're always running studies and focus groups in different places (and online). Get involved, share your thoughts, and enjoy a little extra cash in the process.",
      actionButton: {
        label: 'Get Started',
        path: ROUTES.SIGN_UP,
        signedInLabel: 'Take a Survey',
        signedInPath: ROUTES.SURVEY_PAGE,
      },
    },
    joinUsSection: {
      label: 'Are You a Content Creator?',
      description:
        "We'd love to collaborate with you to share the power of community voices.",
      actionButton: {
        label: "Let's Team Up",
        path: ROUTES.ADVOCATE_LANDING,
      },
    },
    questionarySection: {
      id: 'respondent-faq',
      label: 'Frequently Asked Questions',
      faqData: [
        {
          question: "What's a focus group?",
          answer:
            "A focus group is a round-table discussion on products and services that you use. The discussions are led by market research professionals and usually last between 1–2 hours. While focus groups are a common type of research study, we also conduct taste tests, product trials, in-home interviews, shop-along interviews, phone interviews, and online research.\nWhen you're done, you will receive an incentive for your contribution!",
        },
        {
          question:
            "Where are Thought Metrics' focus group facilities located?",
          answer:
            'Thought Metrics has focus group facilities across India. When you register, you can choose the one nearest to you. If you do not live close to any facility, you can register for our national database, and you will be eligible for phone or online interviews.',
        },
        {
          question: 'What do you expect from participants?',
          answer:
            'To make research meaningful and accurate, we ask all participants to:\n• Be truthful when answering questions about yourself and your habits.\n• Arrive for your appointment on time and ready to participate in the discussion.\n• Notify Thought Metrics if you must cancel, with as much advance notice as possible.\n• Enjoy it! Focus groups are fun and engaging.',
        },
        {
          question: 'How do I register?',
          answer:
            "Registering will add you to Thought Metrics' participant community, giving you access to various study opportunities. During the sign-up process, we will ask for:\n• Contact information\n• Demographic details\n• Household information\n\nThis helps us identify if you qualify for a particular project. Additional screening may be needed to confirm qualification.\nClick here to register.",
        },
        {
          question: 'What incentives do you provide?',
          answer:
            "We offer incentives in multiple forms depending on the project, but most commonly through online prepaid solutions, gift vouchers, or direct transfers. Incentives are typically sent within 2 weeks of participation.\n\nIf it's been more than 2 weeks since you participated, please email contact@thoughtmetrics.com with the following details:\n• Name of participant\n• City or facility where you participated\n• Date of participation\n• Study reference number",
        },
        {
          question: 'Is my information safe?',
          answer:
            'Yes! Thought Metrics adheres to the Insights Association Code of Standards and Ethics for Market Research and Data Analytics. Your information is kept completely confidential. We do not sell or share your information with any third party. For more information, please see our Privacy Policy.',
        },
        {
          question: "I signed up but haven't heard from you. Why?",
          answer:
            'Phone and email communication depend on the information provided in your Dashboard Profile. If your profile is complete but you are not receiving communication from Thought Metrics:\n• Double-check your email preferences and contact information under the "Edit Profile" tab.\n• Add our email contact@thoughtmetrics.com to your contacts so our emails don\'t go to spam.',
        },
        {
          question: "I can't log in to my account. Can you help?",
          answer:
            "Yes! Visit the login page to reset your password. Still having trouble? Email us at contact@thoughtmetrics.com and we'll help you regain access.",
        },
        {
          question: 'How do I unsubscribe?',
          answer:
            'If you would like to unsubscribe from our database and no longer receive calls or emails about upcoming focus groups, please click unsubscribe from your account settings.',
        },
      ],
    },
    signUpSection: {
      label: 'Your Voice Matters - Why Keep it to Yourself?',
      description:
        'Join our community today and help shape the world, one opinion at a time.',
      signButton: {
        label: 'Sign Me Up',
        path: ROUTES.SIGN_UP,
        signedInLabel: 'Take a Survey',
        signedInPath: ROUTES.SURVEY_PAGE,
      },
    },
  },
  advocate: {
    heroSection: {
      head: 'Let us team up',
      label: 'Become a Thought Metrics Social Media Advocate.',
      description: 'Bring voice to our platform. Get paid.',
      signButton: {
        label: 'Sign Me Up',
        path: ROUTES.SIGN_UP,
        signedInLabel: 'Take a Survey',
        signedInPath: ROUTES.SURVEY_PAGE,
      },
    },
    caseStudySection: {
      label: 'What is Thought Metrics?',
      list: [
        'Thought Metrics is a market research support service that connects clients with their consumers to discuss the products and services they use in their daily lives, offering compensation for their time and insights.',
        'Simply put, we reward people for sharing their opinions.',
      ],
      subContent: {
        label: 'As an advocate you would bring us in,',
        items: [
          {
            icon: ConsumersIcon,
            label: 'Consumers',
            description:
              'We welcome people from all walks of life — kids, teens, parents, grandparents, and everyone in between. Our studies cover a huge variety of topics, from gaming and food to alcohol and even diapers.',
          },
          {
            icon: BusinessProfessionalsIcon,
            label: 'Business professionals',
            description:
              'Many of our focus groups involve insights from industry pros, including IT decision-makers, business owners, executives, HR specialists, contractors, and educators.',
          },
          {
            icon: PatientsIcon,
            label: 'Patients',
            description:
              'Whether you use medications, treatments, or medical devices like injectable and wearables, your experience matters. We explore topics such as rare diseases, weight management, diabetes, and cancer.',
          },
          {
            icon: HealthcareProfessionalsIcon,
            label: 'Healthcare professionals',
            description:
              'We also have research opportunities for those working in healthcare, including patient care managers, physicians, nurses, pharmacists, dentists, surgeons, veterinarians, hospital administrators, and technicians, among others.',
          },
        ],
      },
      illustration: {
        img: '/images/landing_page_4.png',
        size: 'full',
        aspectRatio: 'portrait',
        shadowPosition: 'br',
        shadowOpacity: 'full',
        objectFit: 'cover',
        loading: 'lazy',
      },
    },
    workingFlowSection: {
      head: 'How do you fit in?',
      items: [
        {
          sNo: '1',
          label: 'Sign Up',
          description: 'Fill out a quick form so we can get to know you.',
        },
        {
          sNo: '2',
          label: 'Share',
          description: 'Share a link to our respondent sign up page.',
        },
        {
          sNo: '3',
          label: 'Promote',
          description:
            'Promote respondents to sign up and tell them about the benefits of signing up.',
        },
        {
          sNo: '4',
          label: 'Get paid',
          description:
            'Get paid based on the number of respondents who sign up via your link.',
        },
      ],
    },
    formsSection: {
      label: 'Want to Partner with Thought Metrics?',
      description:
        'To manage the high volume of applications, we are responding only to those applicants whose profiles best match our requirements and expectations.',
      inputForm: {
        initialFormData: {
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
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
        },
        countryCodes: [
          { code: '+91', country: 'India' },
          { code: '+1', country: 'USA' },
          { code: '+44', country: 'UK' },
        ],
        defaultCountryCode: '+91',
        storeName: 'partnership-form-store',
        validationMessages: {
          firstName: 'First name is required',
          lastName: 'Last name is required',
          email: {
            required: 'Email is required',
            invalid: 'Email is invalid',
          },
          instagramHandle: 'Instagram handle is required',
          supportGroups: 'This field is required',
          audienceDescription: 'Audience description is required',
          partnershipReason: 'Partnership reason is required',
          submitError: 'Submission failed. Please try again.',
        },
        emailRegex: '\\S+@\\S+\\.\\S+',
        formResetDelay: 3000,
        apiSimulationDelay: 2000,
        ui: {
          pageTitle: 'Partner with Thought Metrics',
          mainHeading: 'Want to Partner with Thought Metrics?',
          description:
            'To manage the high volume of applications, we are responding only to those applicants whose profiles best match our requirements and expectations.',
          sections: {
            personalInfo: 'Personal Information',
            socialMedia: 'Social Media Presence',
            partnership: 'Partnership Details',
          },
          fieldLabels: {
            firstName: 'First name',
            lastName: 'Last name',
            email: 'Email',
            phone: 'Phone',
            instagramHandle: 'Instagram handle',
            instagramFollowers: 'Instagram followers',
            xHandle: 'X handle',
            xFollowers: 'X followers',
            linkedinUrl: 'LinkedIn URL',
            linkedinConnections: 'LinkedIn Connections',
            youtubeChannel: 'YouTube Channel',
            youtubeFollowers: 'YouTube Followers',
            supportGroups:
              'Are there any other groups or organizations you support that you believe could be a valuable partnership with Thought Metrics?',
            audienceDescription:
              'Describe your audience. Who follows your accounts and who are you trying to reach?',
            partnershipReason:
              'Why do you want to partner with Thought Metrics?',
          },
          placeholders: {
            supportGroups:
              'This could include support groups, Facebook communities, local organizations, or similar networks.',
            audienceDescription:
              'Describe your audience demographics, interests, and engagement patterns',
            partnershipReason:
              'Tell us about your motivation and what you hope to achieve through this partnership',
          },
          buttons: {
            submit: 'Submit',
            submitting: 'Submitting...',
          },
          successMessage: {
            title: 'Thank You!',
            description:
              "Your partnership application has been submitted successfully. We'll review your application and get back to you soon.",
          },
          footerLinks: {
            privacyPolicy: 'Privacy Policy',
            unsubscribe: 'Unsubscribe',
            getHelp: 'Get Help',
          },
          privacyNote:
            'Thought Metrics keeps the contact information you provide to us to contact you about our products and services. You may unsubscribe from these communications at anytime. For information on how to unsubscribe, as well as our privacy practices and commitment to protecting your privacy, check out our Privacy Policy.',
        },
      },
      note: 'Thought Metrics needs the contact information you provide to us to contact you about our products and services. You may unsubscribe from these communications at anytime. For information on how to unsubscribe, as well  as our privacy practices and commitment to protecting your privacy, check out our Privacy Policy.',
      actionButton: {
        label: 'Submit',
      },
      img: '/images/landing_page_6.png',
    },
  },
};
