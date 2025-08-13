import {
  AdvancedAnalyticsIcon,
  ComplianceEthicsIcon,
  DataProcessingIcon,
  DataAualityAssuranceIcon as DataQualityAssuranceIcon,
  FastTimeIcon,
  FieldworkManagementIcon,
  IllustrationUsecaseQualitativeResearchIcon,
  IllustrationUsecaseQuantitativeResearchIcon,
  LocatorPinIcon,
  ResearchDMRIcon,
  RobustSamplingReachIcon,
  SmarterParticipantSelectionIcon,
  StackIllustration,
  SurveyDesignIcon,
} from '@/assets';

export const researchMethods = {
  quantitative_research: {
    heroSection: {
      title: 'Cutting Edge Quantitative Solutions',
      description:
        'Powering understanding, confidence, bolder decisions through technology led quantitative services.',
      actionLabel: 'Request a Bid',
      illustration: {
        img: '/images/research_methods_quantitative_1.png',
        size: 'full',
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
          iconOptions: {
            icon: SurveyDesignIcon,
            isActive: false,
            isBorder: true,
            bgColor: 'transparent',
          },
          title: 'Smart Survey Design',
          description:
            'We craft surveys that ask the right questions the right way — clear, engaging, and optimized for accurate responses across devices and demographics.',
          bgColor: 'grey',
          isBorder: true,
          isActive: false,
        },
        {
          iconOptions: {
            icon: RobustSamplingReachIcon,
            isActive: false,
            isBorder: true,
            bgColor: 'transparent',
          },
          title: 'Robust Sampling and Reach',
          description:
            "Whether you're targeting the general population or niche segments, we ensure statistically sound samples that deliver meaningful, representative insights.",
          bgColor: 'grey',
          isBorder: true,
          isActive: false,
        },
        {
          iconOptions: {
            icon: DataQualityAssuranceIcon,
            isActive: false,
            isBorder: true,
            bgColor: 'transparent',
          },
          title: 'Data Quality Assurance',
          description:
            'Our multi-layered quality checks eliminate fraud, inattentive responses, and bias — so you can trust every number in your dataset.',
          bgColor: 'grey',
          isBorder: true,
          isActive: false,
        },

        {
          iconOptions: {
            icon: AdvancedAnalyticsIcon,
            isActive: false,
            isBorder: true,
            bgColor: 'transparent',
          },
          title: 'Advanced Analytics',
          description:
            'From segmentation to driver analysis, MaxDiff to conjoint, we apply the right statistical techniques to turn raw data into sharp, actionable insights.',
          bgColor: 'grey',
          isBorder: true,
          isActive: false,
        },
        {
          iconOptions: {
            icon: LocatorPinIcon,
            isActive: false,
            isBorder: true,
            bgColor: 'transparent',
          },
          title: 'Global and Local Execution',
          description:
            'We operate across regions and languages, enabling you to run large-scale international studies or highly localized projects with ease and accuracy.',
          bgColor: 'grey',
          isBorder: true,
          isActive: false,
        },
        {
          iconOptions: {
            icon: FastTimeIcon,
            isActive: true,
            isBorder: true,
            bgColor: 'primary-light',
          },
          title: 'Speed and Scalability',
          description:
            'We combine automation and expert oversight to move fast — scaling studies without compromising on data integrity or strategic value.',
          bgColor: 'primary',
          isBorder: true,
          isActive: true,
        },
      ],
    },
    caseStudiesSection: {
      title: 'Use Cases for Quantitative Research',
      description:
        "Every project is different. We'll take the time to fully understand your brief. Designing all the elements of the quantitative research to meet your needs. From online surveys to telephone interviews; questions scripts to project documentation; we are ready to deliver the research methodologies and support to make your project a success.<br><br>We are able to assist with any quantitative research, but our frequently requested services includes",
      list: [
        [
          'Online surveys',
          'Community and custom panels',
          'In-store',
          'Recruitment to audience measurement',
          'Exit interviews',
          'Hall tests/ taste tests',
          'Product placement',
          'Mystery shopping',
          'User testing',
        ],
        [
          'Ad testing',
          'Brand health and performance',
          'Content test',
          'Concept and feature testing',
          'Culture and trend research',
          'Message testing',
          'Title testing',
          'Advanced analytics',
          'Online panels and communities',
        ],
      ],
      illustrationComponent: IllustrationUsecaseQuantitativeResearchIcon,
      illustrationMobile:
        '/illustrations/illustration-usecase-quantitative-research-m.png',
    },
    questionarySection: {
      title: 'End to End Quantitative Research Service',
      questionnaires: [
        {
          title: 'Strategy and Planning',
          list: [
            'Research Strategy design',
            'Recruitment survey',
            'Survey questionnaire design',
            'Survey draft creation',
            'Custom survey: Styling and video/audio elements',
            'Typing tool',
          ],
        },
        {
          title: 'Execution',
          list: [
            'Survey program: Coding, hosting',
            'Survey test (AQ)',
            'Survey fielding',
            'Data consolidation and cleaning',
            'Raw data extraction',
            'Translation',
          ],
        },
        {
          title: 'Data Analysis',
          list: [
            'RIM Weighting (Random Iterative Method)',
            'CrossTab analysis',
            'MaxDiff analysis (a.k.a Best-Worst)',
            'Conjoint analysis',
          ],
        },
        {
          title: 'Charting and Reporting',
          list: [
            'Automated charting',
            'Manual charting',
            'Top-line interim readout',
            'High-level report or presentation',
            'Extended full report or presentation',
            'Key insights',
            'Hypothesis testing',
            'White labeling',
          ],
        },
      ],
    },
    blogData: {
      title: 'Latest Insights for Quantitative Research',
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
    actionSection: {
      title:
        'Make decisions backed by data. Explore our robust quantitative research solutions.',
      illustration: StackIllustration,
      img: '/images/research_method_girl_1.png',
      actionLabel: "Let's Connect",
    },
  },
  qualitative_research: {
    heroSection: {
      title: 'Qualitative recruitment experts',
      description:
        'Uncover deep insights on your target audiences with qualitative services you can trust.',
      actionLabel: 'Request a Bid',
      illustration: {
        img: '/images/research_methods_qualitative_1.png',
        size: 'full',
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
          title: 'Intelligent Recruitment',
          description:
            'We go beyond basic screening to ensure participants are the right fit — thoughtful, articulate, and genuinely aligned with your study needs. Whether niche B2B or broad consumer segments, we recruit with precision.',
          isBorder: false,
          isActive: false,
          line3: true,
          line4: true,
          point: true,
        },
        {
          title: 'Service Excellence',
          description:
            'From project kickoff to final deliverables, our team ensures seamless coordination, proactive communication, and consistently high standards — so your research runs smoothly, every time.',
          isBorder: false,
          isActive: false,
          line3: true,
          line4: true,
          point: true,
        },
        {
          title: 'Data Quality and Security',
          description:
            'Every insight starts with trust. We prioritize secure handling of participant data and maintain rigorous protocols to ensure ethical, accurate, and high-integrity qualitative research.',
          isBorder: false,
          isActive: false,
          line4: true,
        },
        {
          title: 'Digital Qualitative',
          description:
            'Reach your audience wherever they are. Our digital methods — from online focus groups to mobile ethnography — provide flexible, rich insights with the convenience and scale of modern platforms.',
          isBorder: false,
          isActive: false,
          line3: true,
        },
        {
          title: 'In-person Methods',
          description:
            'When face-to-face matters, we deliver. From focus groups to shop-along and ethnographies, our in-person methodologies bring deep human context to your business questions.',
          line3: true,
        },
        {
          title: 'Telephonic Interviews.',
          description:
            'Sometimes, a simple conversation delivers the most powerful insight. We conduct skilled, in-depth interviews by phone — ideal for hard-to-reach audiences or sensitive topics.',
        },
      ],
    },
    caseStudiesSection: {
      title: 'Use Cases for Qualitative Research',
      description:
        "One size doesn't fit all. That's why we'll always adapt our approach so we can best meet your brief. Thinking of a focus group or video diaries? Need a screener, discussion guide or research report? We\'re ready to recruit for a wide range of research methodologies, but our frequently requested services include:",
      list: [
        [
          'Focus group discussions',
          'Tele-depths',
          'Hall tests and CLTs',
          'Online communities',
          'User tests',
          'Friendship pairs/triads',
          'Video diaries',
          'Social media shadowing',
          'Ethnographies',
        ],
        [
          'Online surveys',
          'Assisted shops',
          'Tracking studies',
          'Mystery shopping',
          'UX research',
          'Discussion boards',
          'Employee well being',
          'Consumer behavior',
          'Industry trends',
        ],
      ],
      illustrationComponent: IllustrationUsecaseQualitativeResearchIcon,
      illustrationMobile:
        '/illustrations/illustration-usecase-qualitative-research-m.png',
    },
    questionarySection: {
      title: 'End to End Qualitative Research Service',
      questionnaires: [
        {
          title: 'Strategy and Planning',
          list: [
            'Research strategy design',
            'Recruitment survey',
            'Screener design',
            'Discussion guide design',
          ],
        },
        {
          title: 'Execution',
          list: [
            'Interview moderation',
            'Call recording',
            'Interview transcription',
            'Translation',
          ],
        },
        {
          title: 'Data Analysis',
          list: ['Coding', 'Insight synthesis and analysis'],
        },
        {
          title: 'Charting and Reporting',
          list: [
            'Interim post interview summaries',
            'Top-line reports',
            'High-level report or presentation',
            'Extended full report',
            'Hypothesis testing',
            'White labeling',
          ],
        },
      ],
    },
    blogData: {
      title: 'Latest Insights for Quantitative Research',
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
    actionSection: {
      title:
        "Uncover the 'why' behind behavior. Dive deeper with our qualitative expertise.",
      illustration: StackIllustration,
      img: '/images/research_method_girl_1.png',
      actionLabel: "Let's Connect",
    },
  },
  fieldwork: {
    heroSection: {
      title: 'Pick A Location',
      description: 'And our fieldwork experts will get you there.',
      actionLabel: 'Request a Bid',
      illustration: {
        img: '/images/research_methods_qualitative_1.png',
        size: 'full',
        aspectRatio: 'landscape',
        shadowPosition: 'br',
        shadowOpacity: 'full',
        objectFit: 'cover',
        loading: 'lazy',
      },
    },
    serviceSection: {
      title: 'Comprehensive Fieldwork Solutions',
      items: [
        {
          iconOptions: {
            icon: SmarterParticipantSelectionIcon,
            isActive: false,
            isBorder: false,
            bgColor: 'transparent',
          },
          title: 'Sample Management',
          description:
            'We source the right respondents — no matter how specific the target. From national samples to niche segments, we manage quotas, screeners, and panels to ensure your data is built on solid ground.',
          bgColor: 'default',
          isBorder: true,
          isActive: false,
        },
        {
          iconOptions: {
            icon: FieldworkManagementIcon,
            isActive: false,
            isBorder: false,
            bgColor: 'transparent',
          },
          title: 'Fieldwork Management',
          description:
            'We handle the logistics so you can focus on insights. From scheduling interviews to monitoring live surveys, our team ensures smooth execution, real-time updates, and complete transparency.',
          bgColor: 'default',
          isBorder: true,
          isActive: false,
        },
        {
          iconOptions: {
            icon: DataProcessingIcon,
            isActive: false,
            isBorder: false,
            bgColor: 'transparent',
          },
          title: 'Data Processing',
          description:
            'From raw to ready — we clean, code, and structure your data for immediate use. Tabulations, open-end coding, data validation, and file formatting are handled with precision and care.',
          bgColor: 'default',
          isBorder: true,
          isActive: false,
        },
        {
          iconOptions: {
            icon: ResearchDMRIcon,
            isActive: false,
            isBorder: false,
            bgColor: 'transparent',
          },
          title: 'Research Design, Moderation and Reporting',
          description:
            'We help translate business objectives into strong research frameworks. Whether it’s qual, quant, or mixed methods, we ensure the right tools, questions, and structure are in place to meet your goals.',
          bgColor: 'default',
          isBorder: true,
          isActive: false,
        },
        {
          iconOptions: {
            icon: ComplianceEthicsIcon,
            isActive: false,
            isBorder: false,
            bgColor: 'transparent',
          },
          title: 'Compliance and Ethics',
          description:
            'We follow strict protocols to ensure every study meets data privacy laws, ethical guidelines, and respondent protections — across geographies and industries. Trust and transparency are at the core of our fieldwork.',
          bgColor: 'default',
          isBorder: true,
          isActive: false,
        },
      ],
    },
    questionarySection: {
      title: 'Fieldwork That Delivers - On Time, On Target',
      questionnaires: [
        {
          title: 'Can you find the exact audience I need ?',
          list: [
            'Yes, we specialize in both general and hard-to-reach audiences',
            'Our intelligent recruitment process ensures high-quality participants',
            'We can source globally or hyper-locally, depending on your need',
          ],
        },
        {
          title: 'How do you ensure the data is trustworthy?',
          list: [
            'Multiple layers of quality control',
            'Fraud detection, attention checks, and response validation',
            'Experienced moderators and survey designers',
          ],
        },
        {
          title: 'Can you handle fast turnarounds?',
          list: [
            "Yes, we're built for speed without sacrificing accuracy",
            'Agile teams and flexible processes',
            'Transparent communication every step of the way',
          ],
        },
        {
          title: 'What if I need mixed-method — online and offline?',
          list: [
            'We offer fully integrated qual + quant solutions',
            'Phone, in-person, digital, and hybrid approaches',
            'You get one point of contact for streamlined coordination',
          ],
        },
      ],
    },
    aboutUsSection: {
      header: 'Fieldwork Anywhere',
      title: 'We are Wherever You Need Us to Be',
      description:
        "Small Town? We can be there too.<div>Our capabilities don't end with our market research venues, we can bring the Fieldwork experience to the market you need to reach. Inside. Outside. Any group. Any time. We're your partners, everywhere.<div>Through field work anywhere, you have access to:",
      list: [
        'Cutting-edge technology',
        'Location experts',
        'Specialized recruitment solutions',
        'Fieldwork facility-level of support outside our facilities',
      ],
      illustration: {
        img: '/images/research_methods_fieldwork_2.png',
        size: 'full',
        aspectRatio: 'video',
        shadowPosition: 'br',
        shadowOpacity: 'full',
        objectFit: 'cover',
        loading: 'lazy',
      },
    },
    blogData: {
      title: 'Latest Insights for Quantitative Research',
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
    actionSection: {
      title:
        'Leave the logistics to us. We deliver seamless, end-to-end fieldwork execution.',
      illustration: StackIllustration,
      img: '/images/research_method_girl_1.png',
      actionLabel: "Let's Connect",
    },
  },
} as const;
