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
        path: '#',
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
    blogSection: {
      title: 'Learn More About Participant Experience',
      items: [
        {
          src: '/illustrations/illustration-child-shine.svg',
          alt: 'AI & Empathy: Can Machines Decode Human Emotions in UX?',
          type: 'Insight',
          label: 'AI & Empathy: Can Machines Decode Human Emotions in UX?',
          description:
            'A thought-provoking exploration of how far AI has come in understanding human emotion during user experience research — and where it still falls short.',
          link: '#',
        },
        {
          src: '/illustrations/illustration-growth-chart.svg',
          alt: '2025 Trends in AI-Driven User Research: Benchmarks',
          type: 'Report',
          label: '2025 Trends in AI-Driven User Research: Benchmarks',
          description:
            'Based on data from 200+ global teams, this report covers key adoption trends, performance benchmarks, and future forecasts for AI integration in UX research workflows.',
          link: '#',
        },
        {
          src: '/illustrations/illustration-communicate.svg',
          alt: 'Beyond Speed: The Strategic Value of AI in Qualitative Research',
          type: 'Whitepaper',
          label:
            'Beyond Speed: The Strategic Value of AI in Qualitative Research',
          description:
            'This whitepaper examines the long-term business impact of using AI for qualitative insight — from verbatim analysis to participant segmentation.',
          link: '#',
        },
        {
          src: '/illustrations/illustration-work-desk.svg',
          alt: 'How AI is Changing the Way We Ask Questions',
          type: 'Blog',
          label: 'How AI is Changing the Way We Ask Questions',
          description:
            'What if your survey could rewrite itself mid-way? This blog post looks at the rise of adaptive surveys and how AI is making questionnaires more relevant, responsive, and human.',
          link: '#',
        },
      ],
    },
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
        path: '#',
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
      label: 'Frequently Asked Questions',
      list: [
        "What's a focus group?",
        'What will I need to do as a participant?',
        'How do I join?',
        'When will I get my reward?',
        "Why haven't I heard back yet?",
        'Is my information safe?',
        'Can you help me log in?',
        'How do I unsubscribe?',
      ],
    },
    signUpSection: {
      label: 'Your Voice Matters - Why Keep it to Yourself?',
      description:
        'Join our community today and help shape the world, one opinion at a time.',
      signButton: {
        label: 'Sign Me Up',
        path: '#',
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
        path: '#',
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
            phone: 'Phone (Optional)',
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
