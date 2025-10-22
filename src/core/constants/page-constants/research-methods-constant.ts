import {
  AccessibilityIcon,
  AdvancedAnalyticsIcon,
  AIFeedbackLoopsIcon,
  AutomatedCallingIcon,
  AutomationIcon,
  CaptureMomentReactionIcon,
  ComplianceEthicsIcon,
  ConvenienceIcon,
  CostEfficiencyIcon,
  CustomizationInnovationIcon,
  DataCollectionIcon,
  DataDrivenIcon,
  DataProcessingIcon,
  DataAualityAssuranceIcon as DataQualityAssuranceIcon,
  DesignedModeratedExpertsIcon,
  DesignIcon,
  EthicalOversightIcon,
  FasterInsightfulReportingIcon,
  FastTimeIcon,
  FieldworkManagementIcon,
  FlexibleFormatsIcon,
  FraudDetectionQualityControlIcon,
  IllustrationParticipantQualityIcon,
  LocatorPinIcon,
  OperationalEfficiencyIcon,
  PersonalTouchIcon,
  RealTimeInsightsIcon,
  ResearchDMRIcon,
  RobustSamplingReachIcon,
  SamplingIcon,
  ScalableProjectsIcon,
  SmarterParticipantSelectionIcon,
  SpeedIcon,
  StackIllustration,
  SurfaceFeedbackIcon,
  SurveyDesignIcon,
  SurveyReportsIcon,
  SurveyResearchIcon,
  UnderstandConsumerHabitsIcon,
} from '@/assets';
import { ROUTES } from '@/routes/routeConfig';

import research_methods_quantitative_1 from 'images/research_methods_quantitative_1.png';
import illustration_quantitative_1 from 'images/illustration-usecase-quantitative-research-m.png';
import research_methods_qualitative_1 from 'images/research_methods_qualitative_1.png';
import research_methods_fieldwork_1 from 'images/research_methods_fieldwork_1.png';
import research_methods_fieldwork_2 from 'images/research_methods_fieldwork_2.png';
import research_methods_focus_group_1 from 'images/research_methods_focus_group_1.png';
import research_methods_focus_group_2 from 'images/research_methods_focus_group_2.png';
import research_methods_surveys_1 from 'images/research_methods_surveys_1.png';
import research_method_girl_1 from 'images/research_method_girl_1.png';
import illustration_data_security from 'images/illustration_data_security.png';
import illustration_usecase_quantitative_research from 'images/illustration_usecase_quantitative_research.png';
import illustration_usecase_qualitative_research from 'images/illustration_usecase_qualitative_research.png';

import research_methods_quality_1 from 'images/research_methods_quality_1.png';
export const research_methods_quality_src = research_methods_quality_1.src;

export const researchMethods = {
  quantitative_research: {
    heroSection: {
      title: 'Cutting Edge Quantitative Solutions',
      description:
        'Powering understanding, confidence, bolder decisions through technology led quantitative services.',
      actionButton: {
        label: 'Request a Bid',
        path: ROUTES.START_YOUR_RESEARCH,
      },
      illustration: {
        img: research_methods_quantitative_1.src,
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
      illustrationDesktop: illustration_usecase_quantitative_research.src,
      illustrationMobile: illustration_quantitative_1.src,
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
    blogData: { title: 'Latest Insights for Quantitative Research' },
    actionSection: {
      title:
        'Make decisions backed by data. Explore our robust quantitative research solutions.',
      illustration: StackIllustration,
      img: research_method_girl_1.src,
      actionButton: {
        label: "Let's Connect",
        path: ROUTES.CONTACT_US,
      },
    },
  },
  qualitative_research: {
    heroSection: {
      title: 'Qualitative recruitment experts',
      description:
        'Uncover deep insights on your target audiences with qualitative services you can trust.',
      actionButton: {
        label: 'Request a Bid',
        path: ROUTES.START_YOUR_RESEARCH,
      },
      illustration: {
        img: research_methods_qualitative_1.src,
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
      illustrationDesktop: illustration_usecase_qualitative_research.src,
      illustrationMobile: illustration_quantitative_1.src,
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
    blogData: { title: 'Latest Insights for Qualitative Research' },
    actionSection: {
      title:
        "Uncover the 'why' behind behavior. Dive deeper with our qualitative expertise.",
      illustration: StackIllustration,
      img: research_method_girl_1.src,
      actionButton: {
        label: "Let's Connect",
        path: ROUTES.CONTACT_US,
      },
    },
  },
  fieldwork: {
    heroSection: {
      title: 'Pick A Location',
      description: 'And our fieldwork experts will get you there.',
      actionButton: {
        label: 'Request a Bid',
        path: ROUTES.START_YOUR_RESEARCH,
      },
      illustration: {
        img: research_methods_fieldwork_1.src,
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
      //BUG: Font size of the bullet changes, it should be in line with the paragraphs
      illustration: {
        img: research_methods_fieldwork_2.src,
        size: 'full',
        aspectRatio: 'video',
        shadowPosition: 'br',
        shadowOpacity: 'full',
        objectFit: 'cover',
        loading: 'lazy',
      },
    },
    blogData: { title: 'Latest Insights for Fieldwork' },
    actionSection: {
      title:
        'Leave the logistics to us. We deliver seamless, end-to-end fieldwork execution.',
      illustration: StackIllustration,
      img: research_method_girl_1.src,
      actionButton: {
        label: "Let's Connect",
        path: ROUTES.CONTACT_US,
      },
    },
  },
  focus_group: {
    heroSection: {
      title: "Get Inside Your Customer's Mind",
      description:
        'From candid conversations to breakthrough insights — uncover what truly drives decisions with expertly designed focus groups.',
      actionButton: {
        label: 'Request a Bid',
        path: ROUTES.START_YOUR_RESEARCH,
      },
      illustration: {
        img: research_methods_focus_group_1.src,
        size: 'full',
        aspectRatio: 'landscape',
        shadowPosition: 'br',
        shadowOpacity: 'full',
        objectFit: 'cover',
        loading: 'lazy',
      },
    },
    serviceSection: {
      title: 'Know What Customers Are Really Thinking',
      items: [
        {
          iconOptions: {
            icon: SurfaceFeedbackIcon,
            isActive: true,
            isBorder: false,
            bgColor: 'primary-light',
          },
          title: 'Go Beyond Surface-Level Feedback',
          description:
            'Focus groups allow you to hear the why behind customer opinions. Move past basic surveys and get to the root of what drives consumer choices, behaviors, and brand perceptions.',
          bgColor: 'grey',
          isBorder: false,
          isActive: true,
        },
        {
          iconOptions: {
            icon: FlexibleFormatsIcon,
            isActive: true,
            isBorder: false,
            bgColor: 'primary-light',
          },
          title: 'Flexible Formats That Fit Your Goals',
          description:
            "Whether you're running a round-table discussion, classroom-style setup, or immersive product experience — we design the environment that suits your objectives. Music tests, taste tests, app walkthroughs.",
          bgColor: 'grey',
          isBorder: false,
          isActive: true,
        },
        {
          iconOptions: {
            icon: UnderstandConsumerHabitsIcon,
            isActive: true,
            isBorder: false,
            bgColor: 'primary-light',
          },
          title: 'Understand Consumer and Competitor Habits',
          description:
            'Gain powerful context by uncovering not just what your audience thinks, but how their perceptions compare with competitors in real-time discussions.',
          bgColor: 'grey',
          isBorder: false,
          isActive: true,
        },
        {
          iconOptions: {
            icon: CaptureMomentReactionIcon,
            isActive: true,
            isBorder: false,
            bgColor: 'primary-light',
          },
          title: 'Capture Unfiltered, In-the-Moment Reactions',
          description:
            'Real-time conversations allow participants to express thoughts naturally, leading to unexpected insights, emotional cues, and spontaneous feedback no survey can replicate.',
          bgColor: 'grey',
          isBorder: false,
          isActive: true,
        },
        {
          iconOptions: {
            icon: DesignedModeratedExpertsIcon,
            isActive: true,
            isBorder: false,
            bgColor: 'primary-light',
          },
          title: 'Designed and Moderated by Experts',
          description:
            'Our team handles every detail — from participant recruitment to discussion guides and professional moderation — ensuring your sessions are strategic, smooth, and insight-rich.',
          bgColor: 'grey',
          isBorder: false,
          isActive: true,
        },
        {
          iconOptions: {
            icon: ScalableProjectsIcon,
            isActive: true,
            isBorder: false,
            bgColor: 'primary-light',
          },
          title: 'Scalable for Projects Big and Small',
          description:
            'From quick feedback loops to in-depth multi-day studies across geographies, our approach scales to meet your timeline, scope, and budget.',
          bgColor: 'grey',
          isBorder: false,
          isActive: true,
        },
      ],
    },
    questionarySection: {
      title: 'Finding the Right Respondents',
    },
    aboutUsSection: {
      header: 'Making Focus Group Discussions Easier',
      title: 'What Sets Our Facilities Apart',
      items: [
        {
          label: 'Global Reach:',
          description:
            'National and international presence, either directly or through trusted partners.',
        },
        {
          label: 'Versatile Setups:',
          description:
            'Choose from living-room style spaces, dyads, triads, one-on-ones, or full conference setups.',
        },
        {
          label: 'Participant-Friendly Amenities:',
          description:
            'High-speed WiFi, cold drinks, and a welcoming atmosphere to ensure comfort.',
        },
        {
          label: 'Advanced Tech Support:',
          description:
            'AI-based voice recording, transcription, translation, and coding for faster analysis.',
        },
        {
          label: 'Custom Recording Options:',
          description:
            'Fixed stationary cameras with optional camera operators for enhanced control and coverage.',
        },
        {
          label: 'Fully Equipped Kitchens:',
          description:
            'Ideal for product prep, taste testing, and storage during consumer evaluations.',
        },
        {
          label: 'On-Site Support Staff:',
          description:
            'Our team is there to guide respondents smoothly through every stage of the study.',
        },
      ],
      illustration: {
        img: research_methods_focus_group_2.src,
        size: 'full',
        aspectRatio: 'portrait',
        shadowPosition: 'br',
        shadowOpacity: 'full',
        objectFit: 'cover',
        loading: 'lazy',
      },
    },
    blogData: { title: 'Latest Insights for Quantitative Research' },
    actionSection: {
      title:
        'Get real insights, face-to-face. Run powerful focus groups with the right participants.',
      illustration: StackIllustration,
      img: research_method_girl_1.src,
      actionButton: {
        label: "Let's Connect",
        path: ROUTES.CONTACT_US,
      },
    },
  },
  surveys: {
    heroSection: {
      title: 'Survey Smarter. Decide Better.',
      description:
        'From survey design to insights delivery, we manage the entire process—online, by phone, or in-person—so you can reach the right respondents, collect high-quality data, and make confident, data-backed decisions.',
      actionButton: {
        label: 'Request a Bid',
        path: ROUTES.START_YOUR_RESEARCH,
      },
      illustration: {
        img: research_methods_surveys_1.src,
        size: 'full',
        aspectRatio: 'landscape',
        shadowPosition: 'br',
        shadowOpacity: 'full',
        objectFit: 'cover',
        loading: 'lazy',
      },
    },
    serviceSection: {
      head: 'From online and telephone surveys to mixed-mode interviewing and central location testing, our capabilities span a wide range of methodologies—ensuring we reach respondents in the ways they prefer, and deliver the high-quality data our clients rely on.',
      services: [
        {
          bgColor: 'red',
          title: 'Online Surveys',
          description:
            'Online surveys provides the participants the means to engage with the research wherever they are. But executing online market research surveys requires more than collecting data; we add value with specialized programming, screening, and engaging respondents.',
          items: [
            {
              label: 'Cost Efficiency',
              description:
                'Save significant resources compared to phone and email studies.',
              icon: CostEfficiencyIcon,
            },
            {
              label: 'Speed',
              description:
                'Benefit from quick responses and fast turnaround times.',
              icon: SpeedIcon,
            },
            {
              label: 'Convenience',
              description:
                'Let respondents participate at their convenience, ensuring higher response rates.',
              icon: ConvenienceIcon,
            },
            {
              label: 'Automation',
              description:
                'Streamline input, handling, analysis, and reporting for efficient data management.',
              icon: AutomationIcon,
            },
            {
              label: 'Design',
              description:
                'Integrate multimedia and custom features like recreating and existing online store.',
              icon: DesignIcon,
            },
          ],
        },
        {
          bgColor: 'green',
          title: 'Phone Data Collection',
          description:
            'In a world rapidly shifting towards digital, the power of a human voice and the value of real conversation remain critical. We blend strength of technology and human connection through our phone data collection service.',
          items: [
            {
              label: 'Accessibility',
              description:
                "Broadband access isn't guaranteed and phone interviewing ensures representative sampling.",
              icon: AccessibilityIcon,
            },
            {
              label: 'Personal Touch',
              description:
                'Consumer get the personal touch of providing feedback to a real person rather than a computer',
              icon: PersonalTouchIcon,
            },
            {
              label: 'Automated Calling',
              description:
                'Automated dialing, scheduling and call recording dispositions to enhance productivity.',
              icon: AutomatedCallingIcon,
            },
            {
              label: 'Customization and Innovation',
              description:
                'Our ih-house programming and technical staff ensure surveys are conducted to our requirements.',
              icon: CustomizationInnovationIcon,
            },
            {
              label: 'Real-Time Insights',
              description:
                'Gain instant access to customer responses as they come in using real-time dashboards.',
              icon: RealTimeInsightsIcon,
            },
          ],
        },
        {
          bgColor: 'blue',
          title: 'Mixed Mode Interviewing',
          description:
            'Sometimes the best way to collect the data you need is not online or phone, but both with a mixed mode methodology. We often find that the best results, especially with niche or rural audiences comes from studies with an online survey as well as direct phone out reach.',
          items: [
            {
              label: '1. Broader Reach',
              description:
                'Combining online and phone outreach ensures no audience is left behind — especially in rural or low-internet-penetration areas where digital-only methods fall short.',
            },
            {
              label: '2. Increased Response Rates',
              description:
                "By meeting respondents where they're most comfortable, mixed mode boosts engagement and completion rates, making your data more representative and robust.",
            },
            {
              label: '3. Deeper Insights',
              description:
                "Online surveys capture structured data fast, while phone calls allow for clarification, probing, and capturing the nuances that numbers alone can't provide.",
            },
            {
              label: '4. Tailored Approach',
              description:
                'Every audience is different. Mixed mode gives you the freedom to design outreach that fits the demographic — from urban professionals to remote farmers.',
            },
          ],
        },
      ],
    },
    featureSection: {
      title: 'End-to-End Survey Solutions That Deliver Actionable Insights',
      items: [
        {
          label: 'Survey Research',
          description:
            'Our survey methodologies work closely with clients to develop and implement survey design which best meets the project requirements. This includes instrument design, pretesting and refinement.',
          icon: SurveyResearchIcon,
        },
        {
          label: 'Survey Design',
          description:
            'Methodologist in the consultative process translate business objectives into information needs and a well-defined survey plan. Cognitive testing involves structured testing necessary to ensure questions are clear.',
          icon: SurveyDesignIcon,
        },
        {
          label: 'Sampling',
          description:
            'Survey statisticians provide expert recommendations on the appropriate sampling strategies and sample frame to meet specific need, target the right audience with messaging that engages response.',
          icon: SamplingIcon,
        },
        {
          label: 'Data Collection',
          description:
            'Survey is fielded by data collection team using survey modes appropriate for the study. We have web/mobile survey platforms,  CATI survey call center and maintain capabilities to delivery surveys via email and text.',
          icon: DataCollectionIcon,
        },
        {
          label: 'Data Analysis',
          description:
            'Apply broad range of statistical techniques to analyze and model data for clients using statistical software tools (SPSS, R, SAS, Stata, Python etc) and data visualization tools (Tableau and Power BI), machine learning and open text mining.',
          icon: DataDrivenIcon,
        },
        {
          label: 'Survey Reports',
          description:
            'Aggregate findings and provide survey reporting to meet your needs, presenting overall findings, breakouts and multivariate analysis, as well as professional documentation of methodology and analysis. ',
          icon: SurveyReportsIcon,
        },
      ],
    },
    actionSection: {
      title: 'Discover insights that drive smarter decisions.',
      illustration: StackIllustration,
      img: research_method_girl_1.src,
      actionButton: {
        label: "Let's Connect",
        path: ROUTES.CONTACT_US,
      },
    },
  },
  quality: {
    heroSection: {
      title:
        'We rigorously ensure every participant meets the highest quality standards.',
      description:
        "We don't just identify potential participants — we thoroughly validate they're the right fit for your project.",
      illustrationComponent: IllustrationParticipantQualityIcon,
      items: [
        {
          sNo: '01',
          label: 'Registration',
          description:
            "Whether they discover us through a social post or a personal recommendation, every research participant begins their journey on our in house application. With up to 100 unique registrations daily, it's a strong pipeline — but how do we know they're all genuine?",
        },
        {
          sNo: '02',
          label: 'Duplication Checks',
          description:
            'Once someone registers, our in-house software runs a thorough duplication check — scanning email addresses, phone numbers, postcodes, IPs, and usernames. If a match is found, both profiles are unsubscribed, making it nearly impossible to create multiple identities.',
        },
        {
          sNo: '03',
          label: 'Tele screening',
          description:
            "If no duplication is found, we've got a new member! But before they can join a project, they go through a tele-screening. The Roots team chats with them to verify details and ask about any previous research. Friendly yet thorough, they're experts at spotting participants who are genuine, engaged, and right on brief.",
        },
        {
          sNo: '04',
          label: 'Attendance Confirmation',
          description:
            "Next comes participation. Once we've identified the right respondents, we follow a strict three-step confirmation process to maximize attendance: an initial email confirmation, a rescreen call 24–48 hours before the research, and a final SMS reminder on the day itself.",
        },
        {
          sNo: '05',
          label: 'Handling Cancellations',
          description:
            "Of course, there are times—like illness—when participants need to cancel. But we're always quick to minimize any disruption. As soon as we're notified, we move fast to secure a replacement from the backup participants we've already lined up.",
        },
        {
          sNo: '06',
          label: 'Data Driven Insights',
          description:
            'No matter which research methodologies we use, data is always at the core. Our quality assurance processes and advanced analytics keep us on track every step of the way. By following the data, we refine and improve our approach—delivering high-quality insights that drive real impact.',
        },
      ],
    },
    caseStudySection: {
      head: 'Data Security',
      title: 'Your Data is Safe with Thought Metrics',
      description:
        'Data is at the heart of what we do. Every day we use, collect, store and send personal participant and research information. Its security is our highest priority.',
      list: [
        'Our Information Security Management System (ISMS) safeguards the availability, confidentiality, and integrity of data in full compliance with standards like GDPR.',
        'All data is encrypted and stored on secure servers equipped with advanced monitoring technology. Access is strictly limited to authenticated, authorised personnel who require it to perform their roles. We enforce a strong password policy, including mandatory complexity and automatic account lockouts after multiple failed login attempts. Access logs are maintained to track all network activity involving data.',
        'With these rigorous protocols—and a team fully dedicated to data protection and security—you can trust that your data is in safe hands.',
      ],
      illustrationDesktop: illustration_data_security.src,
    },
    serviceSection: {
      head: 'AI and Automation in Research',
      description:
        "We're embracing the power of AI and automation to raise the bar on research quality, efficiency, and security.",
      items: [
        {
          label: 'Smarter Participant Selection',
          description:
            'We use AI to identify patterns and match the most relevant, engaged participants to your project.',
          iconOptions: {
            icon: SmarterParticipantSelectionIcon,
            isActive: false,
            isBorder: false,
            bgColor: 'transparent',
          },
          bgColor: 'default',
          isBorder: true,
          isActive: false,
        },
        {
          label: 'Fraud Detection & Quality Control',
          description:
            'Machine learning helps us flag duplicates, inconsistencies, or suspicious activity early—boosting data integrity.',
          iconOptions: {
            icon: FraudDetectionQualityControlIcon,
            isActive: false,
            isBorder: false,
            bgColor: 'transparent',
          },
          bgColor: 'default',
          isBorder: true,
          isActive: false,
        },
        {
          label: 'Faster, Insightful Reporting',
          description:
            'Automation speeds up reporting workflows and helps surface meaningful insights quickly and accurately.',
          iconOptions: {
            icon: FasterInsightfulReportingIcon,
            isActive: false,
            isBorder: false,
            bgColor: 'transparent',
          },
          bgColor: 'default',
          isBorder: true,
          isActive: false,
        },
        {
          label: 'Operational Efficiency',
          description:
            'From screening to scheduling, automation supports smoother processes, reducing manual effort and turnaround time.',
          iconOptions: {
            icon: OperationalEfficiencyIcon,
            isActive: false,
            isBorder: false,
            bgColor: 'transparent',
          },
          bgColor: 'default',
          isBorder: true,
          isActive: false,
        },
        {
          label: 'Ethical Oversight',
          description:
            'AI is always guided by human review. Our team ensures AI-driven outcomes are accurate, fair, and aligned with ethical standards.',
          iconOptions: {
            icon: EthicalOversightIcon,
            isActive: false,
            isBorder: false,
            bgColor: 'transparent',
          },
          bgColor: 'default',
          isBorder: true,
          isActive: false,
        },
        {
          label: 'AI Feedback Loops',
          description:
            'We use anonymise, aggregated performance data to fine-tune our systems—helping us improve recruitment accuracy and research efficiency without ever compromising individual client data.',
          iconOptions: {
            icon: AIFeedbackLoopsIcon,
            isActive: false,
            isBorder: false,
            bgColor: 'transparent',
          },
          bgColor: 'default',
          isBorder: true,
          isActive: false,
        },
      ],
    },
    actionSection: {
      title:
        'Trust in every step. Our commitment to quality and security keeps your data safe.',
      illustration: StackIllustration,
      img: research_method_girl_1.src,
      actionButton: {
        label: "Let's Connect",
        path: ROUTES.CONTACT_US,
      },
    },
  },
} as const;
