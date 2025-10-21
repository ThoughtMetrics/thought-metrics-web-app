import {
  AdvertisingMarketingIcon,
  AutomotiveIcon,
  EducationIcon,
  FinancialServicesIcon,
  FmcgIcon,
  HealthcareLifeSciencesIcon,
  HrIcon,
  InvestorsIcon,
  MediaInternetPublishersIcon,
  RetailMerchandisingIcon,
  TechnologyIcon,
} from '@/assets';
import { ROUTES } from '@/routes/routeConfig';

export const ourPanel = {
  heroSection: {
    title:
      "We don't have to search far for great participants — they find their way to us!",
    description:
      "With our unmatched capabilities, seamless processes, and commitment to quality, we're the ideal fieldwork partner to bring your research to life.",
    illustration: {
      img: 'src/assets/images/our_panel_2.png',
      size: 'default',
      aspectRatio: 'landscape',
      shadowPosition: 'br',
      shadowOpacity: 'full',
      objectFit: 'cover',
      loading: 'lazy',
    },
  },
  serviceSection: {
    items: [
      {
        title: 'Genuine & Engaged Participants',
        description:
          'Our panel is made up of real people who are eager to share their honest opinions and experiences. They understand the value of research and take their role seriously.',
        isBorder: false,
        isActive: false,
        line3: true,
        line4: true,
        point: true,
      },
      {
        title: 'Nationwide Reach',
        description:
          'From major cities to rural towns, our panel covers every corner. This ensures diversity in perspectives and accessibility to hard-to-reach groups.',
        isBorder: false,
        isActive: false,
        line3: true,
        line4: true,
        point: true,
      },
      {
        title: 'Continuously Growing',
        description:
          'Every insight starts with trust. We prioritize secure handling of participant data and maintain rigorous protocols to ensure ethical, accurate, and high-integrity qualitative research.',
        isBorder: false,
        isActive: false,
        line4: true,
      },
      {
        title: 'Thoroughly Verified',
        description:
          "Before anyone joins, they're checked for duplicates, inconsistencies, and suspicious patterns. Our multi-step verification process keeps quality high and fraud out.",
        isBorder: false,
        isActive: false,
        line3: true,
      },
      {
        title: 'Responsive & Reliable',
        description:
          "Our panel doesn't ghost. With structured confirmation touch-points and personal contact, we maintain one of the highest attendance and engagement rates in the industry.",
        line3: true,
      },
      {
        title: 'Demographically Balanced',
        description:
          'We maintain quotas to ensure representation across age, gender, ethnicity, and location. This gives you more well-rounded, credible insights — every time.',
      },
    ],
  },
  aboutUsSection: {
    title: 'Our Coverage',
    description:
      'We bring extensive experience in sourcing high-quality research participants across a wide range of sectors.',
    items: [
      {
        icon: FmcgIcon,
        label: 'FMCG',
        description:
          'From everyday shoppers to loyal brand users, our panelists provide rapid, real-world feedback on products, packaging, and consumer behavior.',
      },
      {
        icon: RetailMerchandisingIcon,
        label: 'Retail & Merchandising',
        description:
          'We engage with both in-store and online shoppers, as well as retail professionals, to offer insights on buying decisions, display effectiveness, and customer journeys.',
      },
      {
        icon: HealthcareLifeSciencesIcon,
        label: 'Healthcare & Life Sciences',
        description:
          'Our panel includes patients, caregivers, HCPs, and wellness-focused individuals, offering diverse perspectives on treatments, services, and innovations.',
      },
      {
        icon: AdvertisingMarketingIcon,
        label: 'Advertising & Marketing',
        description:
          'From consumers reacting to campaigns to marketing professionals evaluating strategy, we gather honest opinions on what cuts through and what falls flat.',
      },
      {
        icon: FinancialServicesIcon,
        label: 'Financial Services',
        description:
          "Whether it's everyday banking users, insurance policyholders, or financial advisors, our panel represents a full spectrum of financial decision-makers.",
      },
      {
        icon: InvestorsIcon,
        label: 'Investors',
        description:
          'No matter which research methodologies we use, data is always at the core. Our quality assurance processes and advanced analytics keep us on track every step of the way. By following the data, we refine and improve our approach—delivering high-quality insights that drive real impact.',
      },
      {
        icon: AutomotiveIcon,
        label: 'Automotive',
        description:
          'Our panelists include everyday drivers, EV adopters, and fleet managers — people who live on the road and influence the automotive market.',
      },
      {
        icon: EducationIcon,
        label: 'Education',
        description:
          'We engage with students, parents, teachers, and administrators to uncover insights around learning, policy, and the future of education.',
      },
      {
        icon: HrIcon,
        label: 'Human Resources',
        description:
          'From hiring managers to L&D specialists and employees across industries, our HR panel offers grounded perspectives on workplace culture and talent management.',
      },
      {
        icon: MediaInternetPublishersIcon,
        label: 'Media and Internet Publishers',
        description:
          "We reach both content creators and media consumers, allowing you to test ideas, formats, and platforms with those shaping and consuming today's media.",
      },
      {
        icon: TechnologyIcon,
        label: 'Technology',
        description:
          'Our tech-savvy panel spans early adopters, IT professionals, and digital natives — perfect for product testing, UX feedback, and trend tracking.',
      },
    ],
  },
  caseStudySection: {
    head: 'Join Our Panel',
    title: 'Be part of something that shapes the future.',
    list: [
      "Whether it's sharing your opinion on a new product, testing a service before it launches, or giving feedback that helps brands improve — your voice matters. By joining our panel, you'll get the opportunity to take part in paid research projects that fit your interests and schedule.",
      "It's flexible, and rewarding.",
      'All you need is honesty, reliability, and a willingness to share your views. We welcome people from all walks of life — because the best insights come from real, diverse experiences.',
    ],
    description:
      'Ready to get involved?<br>Sign up today and help influence the products, services, and experiences of tomorrow.',
    illustration: {
      img: 'src/assets/images/our_panel_3.png',
      size: 'full',
      aspectRatio: 'landscape',
      objectFit: 'cover',
      loading: 'lazy',
    },
    actionButton: {
      label: 'Sign Up',
      path: ROUTES.SIGN_UP,
      signedInLabel: 'Take a Survey',
      signedInPath: ROUTES.SURVEY_PAGE,
    },
  },
} as const;
