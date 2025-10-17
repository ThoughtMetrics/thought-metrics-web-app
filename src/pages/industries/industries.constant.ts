import {
  AnalystIcon,
  CarIcon,
  CheckListIcon,
  CheckNoteIcon,
  ClipboardIcon,
  CoderIcon,
  ContainerShelfIcon,
  CustomerBagIcon,
  CustomerCartIcon,
  FastTimeIcon,
  FirstLawIcon,
  HandSelectionIcon,
  IdealCustomerIcon,
  KeyIcon,
  LocatorPinIcon,
  MechanicIcon,
  NavigateChangeIcon,
  PartnerCycleIcon,
  PeopleConnectIcon,
  PeopleWorldwideIcon,
  PersonReadIcon,
  PersonStaringIcon,
  SheetBagIcon,
  ShieldIcon,
  SlideBrickIcon,
  SupportHandIcon,
  UIPanelIcon,
  WorkerIcon,
} from '@/assets';
import { ROUTES } from '@/routes/routeConfig';

export const industries = {
  advertising: {
    heroSection: {
      title: 'Turn Audience Understanding Into Creative Impact',
      description:
        'From campaign concepts to media mix decisions, we help agencies, brands, and marketers unlock insights that inspire, resonate, and convert.',
      actionButton: {
        label: 'Request a Bid',
        path: ROUTES.START_YOUR_RESEARCH,
      },
      illustration: {
        img: '/images/industry_advertising_1.png',
        size: 'full',
        aspectRatio: 'landscape',
        shadowPosition: 'tl',
        shadowOpacity: 'full',
        objectFit: 'cover',
        loading: 'lazy',
      },
    },
    serviceSection: [
      {
        iconOptions: {
          icon: CheckListIcon,
          isActive: true,
          isBorder: false,
          bgColor: 'primary-light',
        },
        title: 'Unparalleled access to respondents',
        description:
          'Thought Metrics delivers access to divers and varied audiences you need, so you can make the right decisions, even when you need to move quickly.',
        bgColor: 'grey',
        isBorder: false,
        isActive: true,
      },
      {
        iconOptions: {
          icon: FastTimeIcon,
          isActive: true,
          isBorder: false,
          bgColor: 'primary-light',
        },
        title: 'Delivery at the speed of market',
        description:
          'Get results at the speed you need with tech-enabled solutions that make it smarter, faster, and easier to achieve meaningful audience engagement in depth and scale.',
        bgColor: 'grey',
        isBorder: false,
        isActive: true,
      },
      {
        iconOptions: {
          icon: SupportHandIcon,
          isActive: true,
          isBorder: false,
          bgColor: 'primary-light',
        },
        title: 'Choose self-serve to full service research support ',
        description:
          'We are experts in market research, so whether you choose our self serve solutions or a do-it-for-me approach, you are in good hands.',
        bgColor: 'grey',
        isBorder: false,
        isActive: true,
      },
    ],
    questionarySection: {
      title: 'Make and impact on your audience',
      description:
        'Crafting impactful brands, campaigns, and advertisements is both an art and a science. An advertising market research company can help you validate your intuitions or illuminate a new path forward. Whether you’re in a creative agency trying to demonstrate your added value to clients or part of an in-house marketing team driving your company’s brand, high quality advertising market research insights can help you answer key strategy-driving questions.',
      illustration: {
        img: '/images/industry_advertising_2.png',
        size: 'full',
        aspectRatio: 'landscape',
        objectFit: 'cover',
        loading: 'lazy',
        rounded: 'none',
      },
      questionnaires: [
        {
          title: 'Who to target?',
          list: [
            'How should we segment our market?',
            'Which segments should we target?',
            'What are the personas of our targeted segments?',
            'What does the customer journey look like?',
          ],
        },
        {
          title: 'How to reach our target?',
          list: [
            'What marketing channels can we use to reach our target audience? Print, web, mobile apps, video games, social media, linear TV, OTT/CTV, radio & streaming audio, out-of-home (OOH), search, display, email, and/or connected devices?',
            'How should we allocate media spend?',
            'What advertising mediums capture the attention of our audience? Text, image,   audio, video, and/or native ads?',
          ],
        },
        {
          title: 'What to say and show to our audience?',
          list: [
            'How can we authentically demonstrate our value and differentiate ourself?',
            'How should we position our brand, services, and products? What creative, names, taglines, and messaging should we use?',
            'What features are most important to our audience?',
            'What type of content is our audience interested in?',
            'How do we translate our brand into various advertising channels and mediums?',
          ],
        },
        {
          title: 'How to measure our effectiveness?',
          list: [
            'Which paid media channels deliver the most ROI?',
            'Which advertising and marketing campaigns are the most effective for retention, recall, and conversion?',
            'How can we optimize the marketing funnel?',
            'How does our brand track against others?',
            'Are audiences aware of our brand? How do they perceive it?',
            'How do customers feel about our brand, products, and services?',
          ],
        },
        {
          title: 'What industry trends and shifts to expect?',
          list: [
            'What changes can we anticipate in the data security and privacy landscape and how can we mitigate the impact on advertising effectiveness?',
            'How will digital transformations, such as AI/ML and Web3, impact marketing needs and expectations?',
            'Should our brand consider and invest in goods, services, or ads for new channels, including AR/VR/MR and the metaverse?',
            'How can we attract and retain the best creative talent with the right skill sets for future success?',
          ],
        },
      ],
    },
    featureSection: {
      title:
        'Discover What Your Audience Really Thinks at Every Step of the Journey',
      items: [
        {
          title: 'Global Sample',
          description:
            'Target the diverse audiences you need to reach. Our varied methods of recruitment ensure a wide respondent pool from which to collect your data.',
          isBorder: true,
        },
        {
          title: 'Digital Discussions',
          description:
            'Capture dynamic and nuanced insights with our agile approach to data collection and analysis. Stay ahead of the curve and make informed decisions that drive success.',
          isBorder: true,
        },
        {
          title: 'Automated research',
          description:
            'Automate your research and do more research in less time with quick-turn repeatable solutions. Our AI solutions helps you determine which concepts and ads resonate most with your target audience.',
          isBorder: true,
        },
        {
          title: 'Rapid Alert Omnibus',
          description:
            'Get quick and reliable insights into your most pressing research questions with Thought Metric’s omnibus solutions. Share your questions with a global audience and get rich in insights in as little as 48 hours.',
          isBorder: true,
        },
      ],
    },
    caseStudiesSection: {
      title: 'Advertising and marketing audiences we reach',
      description:
        'Impact-driving advertising market research starts with speaking to the right people. Thought Metrics finds the professionals with the exact expertise to answer your advertising market research questions.',
      list: [
        'Advertising buyers',
        'Marketers',
        'IT leaders',
        'Metaverse experts',
        'Developers',
        'Influencers & digital media thought leaders',
        'Product & UX designers',
        'Project managers',
        'Purchasing decision-makers',
        'Finance decision-makers',
        'Healthcare professionals',
        'Business owners',
        'C-suite executives',
        'Heads of HR',
        'Users of particular product or service',
      ],
      img: '/images/industry_advertising_3.png',
    },
    actionSection: {
      img: '/images/industry_girl_1.png',
      illustration: SlideBrickIcon,
      title: 'Know what clicks before you create it!',
      actionButton: {
        label: "Let's Connect",
        path: ROUTES.CONTACT_US,
      },
    },
  },
  internet: {
    heroSection: {
      title: 'Explore the Full Spectrum of Customer Insight',
      description:
        'From data to dialogue, uncover what truly drives your audience.',
      actionButton: {
        label: 'Request a Bid',
        path: ROUTES.START_YOUR_RESEARCH,
      },
      illustration: {
        img: '/images/industry_internet_1.png',
        size: 'full',
        aspectRatio: 'landscape',
        shadowPosition: 'tl',
        shadowOpacity: 'full',
        objectFit: 'cover',
        loading: 'lazy',
      },
    },
    serviceSection: [
      {
        iconOptions: {
          icon: IdealCustomerIcon,
          isActive: true,
          isBorder: false,
          bgColor: 'primary-light',
        },
        title: 'Connect with your ideal customers, faster',
        description:
          'Thought Metrics delivers unparalleled access to the audiences you need around the world. Connect with the right people to make the right decisions even when you need to move quickly.',
        bgColor: 'grey',
        isBorder: false,
        isActive: true,
      },
      {
        iconOptions: {
          icon: HandSelectionIcon,
          isActive: true,
          isBorder: false,
          bgColor: 'primary-light',
        },
        title: 'Go deeper on customer preferences',
        description:
          'Discover not just what customers want or need, but why they think or feel they do with our comprehensive quantitative and qualitative solutions.',
        bgColor: 'grey',
        isBorder: false,
        isActive: true,
      },
      {
        iconOptions: {
          icon: FastTimeIcon,
          isActive: true,
          isBorder: false,
          bgColor: 'primary-light',
        },
        title: 'Improve outcomes with agile testing',
        description:
          'Infuse insights into every stage of ad or product development for better results with our suite of agile research technologies and expert guidance.',
        bgColor: 'grey',
        isBorder: false,
        isActive: true,
      },
    ],
    questionarySection: {
      title:
        'Future proof your business with internet and media market research',
      description:
        'Understanding your audience is key to creating the right platforms, tools, and offerings for long-term business success. These insights are especially important when juggling the needs of several players in a multi-sided marketplace—a common trait of media and internet companies.',
      illustration: {
        img: '/images/industry_internet_2.png',
        size: 'full',
        aspectRatio: 'landscape',
        objectFit: 'cover',
        loading: 'lazy',
        rounded: 'none',
      },
      questionnaires: [
        {
          title: 'What our target audience thinks and does?',
          list: [
            'What type of content is our audience interested in?',
            'What do advertisers, creators, and users value when considering new platforms and tools?',
            'How are brands and agencies allocating spend between different channels and tools?',
            'What advertising mediums do our audiences leverage? Text, image, audio, video, and/or native ads?',
            "What are our audiences' unmet needs? How can these needs be translated into opportunities for us?",
          ],
        },
        {
          title: 'How is our brand is perceived',
          list: [
            'Are decision-makers aware of our brand, products, and services? How do they perceive it compared to others?',
            'How do we differentiate our products and services?',
            'How is our brand reputation trending over time?',
            'Is our UX enabling positive interactions with our brand?',
            'How do we demonstrate the value and ROI of our products and services?',
          ],
        },
        {
          title: 'How can we capture more revenue',
          list: [
            'What features and innovations would encourage increased use of our tools?',
            'How do we increase brand loyalty and reduce churn?',
            'How do we effectively communicate our unique selling proposition through a marketing campaign?',
            'How can we tap into new markets? What opportunities and blockers are there?',
          ],
        },
        {
          title: 'What industry trends and shifts to expect',
          list: [
            'What changes can we anticipate in the data security and privacy landscape and how can we mitigate the impact on our platform use and effectiveness?',
            'How will digital transformations, such as AI/ML and Web3, impact marketing needs and expectations?',
            'Should our brand consider and invest in goods, services, or ads for new channels, including AR/VR/MR and the metaverse?',
            'How can we attract and retain the best talent with the right skill sets for future success?',
          ],
        },
      ],
    },
    featureSection: {
      title:
        'Discover What Your Audience Really Thinks at Every Step of the Journey',
      items: [
        {
          title: 'Quantitative Insights Communities',
          description:
            'Tap into the power of numbers with always-on insight communities. We help you gather fast, reliable, and scalable data from your target audience to support campaign planning, creative testing, brand tracking, and more. Make decisions backed by real consumer behavior and preferences.',
          isBorder: true,
        },
        {
          title: 'Focus Group Discussions',
          description: `Get deeper into the minds of your audience. Our expertly moderated focus groups provide rich, qualitative insights that bring consumer stories to life. Whether you're refining a concept or exploring brand perceptions, these discussions reveal the "why" behind the data.`,
          isBorder: true,
        },
        {
          title: 'Product Testing',
          description:
            'Launch with confidence by testing your product with real users before it hits the market. From packaging to messaging to user experience, we help you fine-tune every detail based on genuine feedback, ensuring your product resonates with the right audience.',
          isBorder: true,
        },
        {
          title: 'Digital Discussions',
          description:
            'Explore audience perspectives in their own digital spaces. Through online forums, video diaries, and mobile feedback, our digital discussions offer flexible, in-context insights—perfect for understanding consumer behavior in real time and at scale.',
          isBorder: true,
        },
      ],
    },
    caseStudiesSection: {
      title: 'Internet and media audiences we reach',
      description:
        'Impact-driving media market research starts with speaking to the right people. Thought Metrics finds the professionals with the exact expertise to answer your advertising market research questions.',
      list: [
        'Advertising buyers',
        'Podcast creators',
        'IT leaders',
        'Metaverse experts',
        'Developers',
        'Marketers',
        'Content creators',
        'Influencers & digital media thought leaders',
        'Product & UX designers',
        'Project managers',
        'Purchasing decision-makers',
        'Business owners',
        'C-suite executives',
        'Users of particular product or service',
      ],
      img: '/images/industry_internet_3.png',
    },
    actionSection: {
      img: '/images/industry_girl_1.png',
      illustration: SlideBrickIcon,
      title: 'Stay in sync with what your audience actually wants.',
      actionButton: {
        label: "Let's Connect",
        path: ROUTES.CONTACT_US,
      },
    },
  },
  retail: {
    heroSection: {
      title: 'Turning Shopping Moments into Lasting Impressions',
      description:
        'From store shelves to mobile screens, discover what influences buying decisions and build retail experiences that truly resonate.',
      actionButton: {
        label: 'Request a Bid',
        path: ROUTES.START_YOUR_RESEARCH,
      },
      illustration: {
        img: '/images/industry_retail_1.png',
        size: 'full',
        aspectRatio: 'landscape',
        shadowPosition: 'tl',
        shadowOpacity: 'full',
        objectFit: 'cover',
        loading: 'lazy',
      },
    },
    serviceSection: [
      {
        iconOptions: {
          icon: CustomerBagIcon,
          isActive: true,
          isBorder: false,
          bgColor: 'primary-light',
        },
        title: 'Real-Time Shopper Behavior Insights',
        description:
          'Stay ahead of consumer trends with live feedback from real shoppers — whether in-store or online. Thought Metrics helps you track shifts in buying behavior, path-to-purchase, and impulse decisions, so you can adapt in the moment, not after the season ends.',
        bgColor: 'grey',
        isBorder: false,
        isActive: true,
      },
      {
        iconOptions: {
          icon: ContainerShelfIcon,
          isActive: true,
          isBorder: false,
          bgColor: 'primary-light',
        },
        title: 'Optimize Every Shelf and Screen',
        description:
          "Use data to perfect everything from shelf layout to digital product placement. Whether it's planograms or app-based merchandising, we empower you to test what works — and know why it works — before rolling out at scale.",
        bgColor: 'grey',
        isBorder: false,
        isActive: true,
      },
      {
        iconOptions: {
          icon: LocatorPinIcon,
          isActive: true,
          isBorder: false,
          bgColor: 'primary-light',
        },
        title: 'Localized Intelligence, Global Reach',
        description:
          'Consumer behavior is personal. Our geo-targeted research uncovers what resonates in each market, store format, and cultural context — so your merchandising and retail strategies land with relevance, wherever your customers are.',
        bgColor: 'grey',
        isBorder: false,
        isActive: true,
      },
    ],
    questionarySection: {
      title: 'Make an Impact on Your Shoppers.',
      description:
        "Crafting compelling retail experiences requires both creativity and insight. Our research helps validate your strategies or reveal new opportunities. Whether you're a brand aiming to enhance in-store engagement or an e-commerce platform optimizing user experience, high-quality retail insights are crucial for strategic decision-making.",
      illustration: {
        img: '/images/industry_retail_2.png',
        size: 'full',
        aspectRatio: 'landscape',
        objectFit: 'cover',
        loading: 'lazy',
        rounded: 'none',
      },
      questionnaires: [
        {
          title: 'Who to target?',
          list: [
            'How should we segment our customer base?',
            'Which demographics should we focus on?',
            'What are the shopping behaviors of our target segments?',
            'What does the customer journey entail from discovery to purchase?',
          ],
        },
        {
          title: 'How to reach our target?',
          list: [
            'Which channels—brick-and-mortar, online, mobile apps, social media—are most effective?',
            'How should we allocate marketing budgets across these channels?',
            "What mediums—visual displays, promotions, digital ads—capture our audience's attention?",
          ],
        },
        {
          title: 'What to offer and how to present it',
          list: [
            'How can we differentiate our product offerings?',
            'What pricing and promotional strategies resonate with our customers?',
            'How should we position our products in-store and online?',
            'What packaging and merchandising strategies are most effective?',
          ],
        },
        {
          title: 'How to measure effectiveness?',
          list: [
            'Which sales channels yield the highest ROI?',
            'How effective are our merchandising strategies in driving sales?',
            "What is our brand's perception among consumers?",
            'How do customers feel about our products and shopping experience?',
          ],
        },
        {
          title: 'What industry trends and shifts to expect?',
          list: [
            'How will advancements in AI and automation impact retail operations?',
            'What are the emerging trends in consumer behavior and preferences?',
            'How can we adapt to changes in the retail landscape, including the rise of omni-channel shopping?',
            'What innovations should we consider to stay ahead in the market?',
          ],
        },
      ],
    },
    featureSection: {
      title:
        'Discover What Your Audience Really Thinks at Every Step of the Journey',
      items: [
        {
          title: 'Demographic advantage',
          description:
            "Whether you're launching in new markets or scaling existing operations, reaching the right customers is key. We tap into a diverse, global panel of everyday shoppers, category loyalists, brand switchers, and niche buyer segments — ensuring your insights reflect real-world behaviors. With custom recruitment strategies and localized sampling, you can confidently develop retail strategies that resonate across demographics and geographies.",
          isBorder: true,
        },
        {
          title: 'Digital Discussions',
          description:
            'Go beyond the surface with rich qualitative insights. Our digital discussion platforms allow you to explore the "why" behind shopping decisions — from online reviews to in-store behaviors. Whether it’s testing product packaging, understanding shopper missions, or exploring emotional triggers behind purchases, we bring you closer to the moments that matter. All in real time, at scale, and with the ability to deep dive whenever needed.',
          isBorder: true,
        },
        {
          title: 'Harness the power of AI',
          description:
            'Retail moves fast — and so should your research. With our AI-powered tools, you can automate repetitive testing like product concept validation, price sensitivity analysis, or SKU comparisons. Launch quick-turn surveys that help you understand what features customers value, what designs stand out on the shelf, and which call-to-actions convert. The result: actionable data delivered fast enough.',
          isBorder: true,
        },
        {
          title: 'Rapid Alert Omnibus',
          description:
            "Sometimes, speed is everything. Whether you're responding to supply chain shifts, competitor moves, or unexpected consumer feedback, our Rapid Alert Omnibus gives you fast, targeted answers. Submit your most urgent questions and access robust, directional insights from retail audiences within 48 hours. It\'s your early-warning system — helping you make smarter decisions, faster.",
          isBorder: true,
        },
      ],
    },
    caseStudiesSection: {
      title: 'Retail & Merchandising Audiences We Reach',
      description:
        'Effective retail research begins with engaging the right participants. Thought Metrics identifies and connects you with professionals and consumers who provide valuable insights into the retail and merchandising landscape.',
      list: [
        'Retail buyers and category managers',
        'Store operations managers',
        'Visual merchandisers',
        'E-commerce strategists',
        'Supply chain and logistics professionals',
        'Product and UX designers',
        'Marketing and branding specialists',
        'Customer experience managers',
        'Finance and procurement decision-makers',
        'Business owners and C-suite executives',
        'Heads of HR and training',
        'Consumers and end-users of specific products or services',
      ],
      img: '/images/industry_retail_3.png',
    },
    actionSection: {
      img: '/images/industry_girl_1.png',
      illustration: SlideBrickIcon,

      title: 'See what drives shoppers—before they reach the shelf.',
      actionButton: {
        label: "Let's Connect",
        path: ROUTES.CONTACT_US,
      },
    },
  },
  healthcare: {
    heroSection: {
      title: 'Bridge the Gap Between Science and Human Experience',
      description:
        'From clinical development to patient engagement, uncover insights that drive meaningful healthcare innovation and decision-making.',
      actionButton: {
        label: 'Request a Bid',
        path: ROUTES.START_YOUR_RESEARCH,
      },
      illustration: {
        img: '/images/industry_healthcare_1.png',
        size: 'full',
        aspectRatio: 'landscape',
        shadowPosition: 'tl',
        shadowOpacity: 'full',
        objectFit: 'cover',
        loading: 'lazy',
      },
    },
    serviceSection: [
      {
        iconOptions: {
          icon: IdealCustomerIcon,
          isActive: true,
          isBorder: false,
          bgColor: 'primary-light',
        },
        title: 'Engage Hard-to-Reach Audiences with Precision',
        description:
          "Whether it's rare disease patients, specialists, or healthcare administrators, our global network and rigorous profiling allow you to access the exact voices you need — across therapeutic areas, with speed and compliance.",
        bgColor: 'grey',
        isBorder: false,
        isActive: true,
      },
      {
        iconOptions: {
          icon: CheckNoteIcon,
          isActive: true,
          isBorder: false,
          bgColor: 'primary-light',
        },
        title: 'Research Built for Regulated Environments',
        description:
          'From protocol design to final reporting, our team understands the sensitivities of working in clinical and commercial healthcare. Our tools and processes are HIPAA- and GDPR-compliant, ensuring your insights are robust, ethical, and ready for regulatory scrutiny.',
        bgColor: 'grey',
        isBorder: false,
        isActive: true,
      },
      {
        iconOptions: {
          icon: PartnerCycleIcon,
          isActive: true,
          isBorder: false,
          bgColor: 'primary-light',
        },
        title: 'From Molecule to Market with a Single Partner',
        description:
          'Whether you’re developing a new treatment, entering a new market, or optimizing provider engagement, Thought Metrics supports the full product lifecycle — offering everything from early concept testing to launch tracking and post-marketing insight.',
        bgColor: 'grey',
        isBorder: false,
        isActive: true,
      },
    ],
    questionarySection: {
      title: 'Make an Impact Across the Healthcare Ecosystem.',
      description:
        "The healthcare landscape is complex — spanning patients, providers, payers, regulators, and caregivers. Market research tailored to life sciences helps you cut through that complexity and make confident, human-centered decisions. Whether you're working on clinical innovation or market access, the right insights can guide your next move.",
      illustration: {
        img: '/images/industry_healthcare_2.png',
        size: 'full',
        aspectRatio: 'landscape',
        objectFit: 'cover',
        loading: 'lazy',
        rounded: 'none',
      },
      questionnaires: [
        {
          title: 'What care providers and patients want',
          list: [
            'What are the needs and pain points of care providers and their patients?',
            'What products and services do providers and patients truly value?',
            'What does the customer journey and experience look like?',
            'Who are the personas in this space?',
            'What is the decision-making process for our target market?',
          ],
        },
        {
          title: 'What products and services to develop',
          list: [
            'What markets have growth potential?',
            'Is there product-market fit with our offering?',
            'How do needs and pain points translate into new product and service opportunities?',
            'What pricing is appropriate for this type of offering?',
          ],
        },
        {
          title: 'How the organization or brand is perceived',
          list: [
            'What brands, products, and services are decision-makers aware of and considering?',
            'How does our organization benchmark against competitors?',
            'How are we differentiated from others in the market?',
            "How is our brand's reputation and health trending over time?",
            'How can we ensure our provider and patient benefits do not get lost in the noise?',
          ],
        },
        {
          title: 'How to hire and retain the right talent',
          list: [
            'What types of people and skills do we need to be successful as an organization now and in the future? What are our talent gaps and needs versus what is available in the market?',
            'How is our organization perceived by prospective employees?',
            'What is the main driver of turnover in the industry?',
            'How does our company culture and work environment compare to other workplaces?',
          ],
        },
        {
          title: 'What new technologies can transform the future industry',
          list: [
            'How can we incorporate DEI into our strategies and practices?',
            'What new technologies are emerging and how will they change the way our industry does business?',
            'How can we apply tech to our own practice and what will offer the most ROI? Should we invest in AI/ML, virtual and telehealth services, and other technologies?',
          ],
        },
      ],
    },
    featureSection: {
      title:
        'Understand Patients, Professionals, and Partners at Every Step of the Care Journey',
      items: [
        {
          title: 'Diverse and Compliant Sample Access',
          description:
            'Reach the right voices — ethically and efficiently. From physicians, specialists, and pharmacists to patients, caregivers, and healthcare decision-makers, we help you connect with precisely profiled respondents. Our recruitment methods are compliant with HIPAA, GDPR, and industry standards, ensuring your data is both high-quality and trustworthy for regulatory environments.',
          isBorder: true,
        },
        {
          title: 'Virtual Dialogues that Go Beyond the Chart',
          description:
            'Discover the lived experience behind the clinical data. Our digital discussions bring together healthcare professionals and patients in secure, moderated environments where you can explore attitudes, unmet needs, treatment journeys, and perceptions of new therapies. From chronic condition management to medical device usage, gain insights grounded in empathy.',
          isBorder: true,
        },
        {
          title: 'AI-Driven Testing for Smarter Development',
          description:
            'From concept testing to message refinement, automate your research and accelerate go-to-market planning. Our AI-powered tools help you assess the emotional and cognitive response to drug names, packaging, claims, and HCP materials — so you can refine faster and with confidence.',
          isBorder: true,
        },
        {
          title: 'Real-Time Insight for Confident Clinical & Commercial Moves',
          description:
            "Stay ahead of market shifts, clinical feedback, or stakeholder sentiment with agile research tools built for dynamic healthcare environments. Whether you're adapting trial protocols based on HCP feedback, assessing how patients perceive a new access program, or validating launch readiness across regions, our platform delivers timely, context-rich insights that help you act fast — and act smart.",
          isBorder: true,
        },
      ],
    },
    caseStudiesSection: {
      title: 'Healthcare & Life Sciences Audiences We Reach',
      description:
        'Your research is only as strong as the people behind it. Thought Metrics finds the right respondents — across the full healthcare ecosystem — to support every phase of your research.',
      list: [
        'Patients (across conditions and geographies)',
        'Caregivers',
        'General practitioners and specialists',
        'Hospital administrators',
        'Clinical researchers',
        'Pharmacists',
        'Payers and health insurers',
        'Medical device users and technicians',
        'Medical science liaisons (MSLs)',
        'Health IT professionals',
        'Regulatory and compliance experts',
        'Procurement and formulary decision-makers',
        'Public health officials and NGOs',
        'C-suite healthcare executives',
      ],
      img: '/images/industry_healthcare_3.png',
    },
    actionSection: {
      img: '/images/industry_girl_1.png',
      illustration: SlideBrickIcon,

      title:
        'Hear what patients and providers really think—when it matters most.',
      actionButton: {
        label: "Let's Connect",
        path: ROUTES.CONTACT_US,
      },
    },
  },
  hr: {
    heroSection: {
      title: 'Unlock People-Centered Growth with Research That Listens',
      description:
        'From recruitment to retention, discover what your workforce really needs. Our research solutions help HR leaders design better policies, stronger cultures, and more meaningful employee experiences—at every stage of the talent lifecycle.',
      actionButton: {
        label: 'Request a Bid',
        path: ROUTES.START_YOUR_RESEARCH,
      },
      illustration: {
        img: '/images/industry_hr_1.png',
        size: 'full',
        aspectRatio: 'landscape',
        shadowPosition: 'tl',
        shadowOpacity: 'full',
        objectFit: 'cover',
        loading: 'lazy',
      },
    },
    serviceSection: [
      {
        iconOptions: {
          icon: PeopleConnectIcon,
          isActive: true,
          isBorder: false,
          bgColor: 'primary-light',
        },
        title: 'Navigate Workforce Shifts with Confidence',
        description:
          "Whether you're managing return-to-office transitions or planning for future skill demands, our agile research surfaces employee sentiment and workforce trends, giving you the clarity to make decisions that stick.",
        bgColor: 'grey',
        isBorder: false,
        isActive: true,
      },
      {
        iconOptions: {
          icon: PeopleWorldwideIcon,
          isActive: true,
          isBorder: false,
          bgColor: 'primary-light',
        },
        title: 'Build Cultures That Attract and Retain Top Talent',
        description:
          'Tap into insights from your teams to shape DE&I initiatives, leadership development programs, and internal communications that resonate. Understand what matters most to your people—and act on it.',
        bgColor: 'grey',
        isBorder: false,
        isActive: true,
      },
      {
        iconOptions: {
          icon: LocatorPinIcon,
          isActive: true,
          isBorder: false,
          bgColor: 'primary-light',
        },
        title: 'From Global Teams to Local Nuance',
        description:
          "Whether you're rolling out policy across continents or optimizing benefits for a specific location, our research tools allow you to segment and compare data by role, region, tenure, or function—so every insight is actionable.",
        bgColor: 'grey',
        isBorder: false,
        isActive: true,
      },
    ],
    questionarySection: {
      title: 'Drive Workforce Strategy with Evidence, Not Assumptions',
      description:
        'HR is more strategic than ever. Our research helps you answer the questions that matter—from hiring to offboarding, and every moment in between.',
      illustration: {
        img: '/images/industry_hr_2.png',
        size: 'full',
        aspectRatio: 'landscape',
        objectFit: 'cover',
        loading: 'lazy',
        rounded: 'none',
      },
      questionnaires: [
        {
          title: 'Who should we hire—and how?',
          list: [
            'What skills and capabilities are in demand in our industry?',
            'How do potential candidates perceive our employer brand?',
            'What recruitment channels work best for specific roles?',
          ],
        },
        {
          title: 'How do we support and engage employees?',
          list: [
            'What benefits and policies drive satisfaction and loyalty?',
            "What's impacting morale or productivity?",
            'What does hybrid work mean to our workforce?',
          ],
        },
        {
          title: 'Where should we invest in development?',
          list: [
            'Which training programs actually impact performance?',
            'What do managers need to lead effectively?',
            'Are our leadership pipelines inclusive and future-ready?',
          ],
        },
        {
          title: 'Are we delivering a great employee experience?',
          list: [
            'What moments matter most in the employee journey?',
            'How do people feel during onboarding, appraisals, or exits?',
            "What's the emotional impact of policy changes?",
          ],
        },
        {
          title: "What's changing in the world of work?",
          list: [
            'How are Gen Z and millennial expectations shifting?',
            'What macrotrends (AI, mental health, DEI, etc.) should we prepare for?',
            'How do we future-proof workforce strategies?',
          ],
        },
      ],
    },
    featureSection: {
      title: 'Understand Your Workforce Like Never Before',
      items: [
        {
          title: 'Employee Pulse Panels',
          description:
            'Create continuous feedback loops with your workforce. From micro-surveys to longitudinal studies, our panels help you track evolving attitudes on policies, leadership, and well-being.',
          isBorder: true,
        },
        {
          title: 'Deep-Dive Digital Discussions',
          description:
            'Use guided qualitative methods to explore complex themes like burnout, inclusion, or leadership perception. Capture open-ended, high-quality insights at scale.',
          isBorder: true,
        },
        {
          title: 'AI-Powered Workforce Research',
          description:
            'Leverage predictive analytics and sentiment analysis to uncover emerging patterns in engagement, attrition, and training effectiveness—before they impact the bottom line.',
          isBorder: true,
        },
        {
          title: 'Insight Sprints for HR Strategy',
          description:
            "When you're under pressure to deliver insights quickly—be it for a board update, policy overhaul, or employee crisis—we deliver rapid, strategic research to support your next move.",
          isBorder: true,
        },
      ],
    },
    caseStudiesSection: {
      title: 'People We Reach',
      description:
        'We connect you with the real voices shaping workforce success.',
      list: [
        'Recruiters & talent acquisition specialists',
        'Learning & development leaders',
        'People analytics and HR tech experts',
        'Diversity, Equity & Inclusion (DEI) officers',
        'First-time managers and executive leadership',
        'Remote, hybrid, and on-site employees',
        'Exiting employees and alumni',
        'Candidates and job seekers',
        'HR business partners',
        'Total rewards and benefits managers',
      ],
      img: '/images/industry_advertising_3.png',
    },
    actionSection: {
      img: '/images/industry_girl_1.png',
      illustration: SlideBrickIcon,

      title: 'Build better workplaces with insights that matter.',
      actionButton: {
        label: "Let's Connect",
        path: ROUTES.CONTACT_US,
      },
    },
  },
  finance: {
    heroSection: {
      title: 'Navigate the Future of Finance with Precision',
      description:
        'From trust to transformation, uncover insights that drive smarter decisions, stronger customer relationships, and real competitive advantage.',
      actionButton: {
        label: 'Request a Bid',
        path: ROUTES.START_YOUR_RESEARCH,
      },
      illustration: {
        img: '/images/industry_finance_1.png',
        size: 'full',
        aspectRatio: 'landscape',
        shadowPosition: 'tl',
        shadowOpacity: 'full',
        objectFit: 'cover',
        loading: 'lazy',
      },
    },
    serviceSection: [
      {
        iconOptions: {
          icon: NavigateChangeIcon,
          isActive: true,
          isBorder: false,
          bgColor: 'primary-light',
        },
        title: 'Navigate Change with Confidence',
        description:
          'In an industry shaped by disruption—be it evolving regulations, fintech challengers, or shifting customer demands—real-time insights are your compass. ThoughtMetrics helps you anticipate market shifts, understand customer needs, and adapt faster than your competitors.',
        bgColor: 'grey',
        isBorder: false,
        isActive: true,
      },
      {
        iconOptions: {
          icon: AnalystIcon,
          isActive: true,
          isBorder: false,
          bgColor: 'primary-light',
        },
        title: 'Make Data-Driven Decisions',
        description:
          "From new product development to pricing and positioning, our end-to-end research solutions reduce guesswork. We combine qualitative depth with quantitative rigor to de-risk decisions and drive ROI—whether you're entering a new market or refining a current offering.",
        bgColor: 'grey',
        isBorder: false,
        isActive: true,
      },
      {
        iconOptions: {
          icon: MechanicIcon,
          isActive: true,
          isBorder: false,
          bgColor: 'primary-light',
        },
        title: 'Choose DIY Tools or Expert Support',
        description:
          "Whether you're testing fintech innovations or evaluating a multi-channel insurance strategy, we offer the flexibility to run quick self-serve surveys or partner on complex, consultative research. Either way, you benefit from our domain expertise in financial services.",
        bgColor: 'grey',
        isBorder: false,
        isActive: true,
      },
    ],
    questionarySection: {
      title: 'Make an Impact Across Financial Journeys',
      description:
        "Whether you're a digital-first startup or a legacy institution undergoing transformation, ThoughtMetrics gives you the research power to stay customer-first, compliant, and competitive.",
      illustration: {
        img: '/images/industry_finance_2.png',
        size: 'full',
        aspectRatio: 'landscape',
        objectFit: 'cover',
        loading: 'lazy',
        rounded: 'none',
      },
      questionnaires: [
        {
          title: 'Who to target?',
          list: [
            'How do financial behaviors vary by age, income, and digital fluency? ',
            'What pain points are driving switching behavior? ',
            'Which personas are most aligned with our value proposition? ',
            'How do customers research and adopt financial products?',
          ],
        },
        {
          title: 'How to reach our target?',
          list: [
            'Which channels do our ideal customers use—branch, mobile apps, web, third-party platforms, agents, or social media? ',
            "What's the best mix for acquisition vs. retention? ",
            'Which touch points build trust?',
          ],
        },
        {
          title: 'What to say and show to our audience?',
          list: [
            'What do customers value most—security, low fees, innovation, or personalization? ',
            'How should we position savings tools, credit products, insurance plans, or investment offerings? ',
            'What messaging builds clarity and trust?',
          ],
        },
        {
          title: 'How to measure our effectiveness?',
          list: [
            'What is our brand trust score vs. competitors? ',
            "What's driving satisfaction and loyalty—or churn? ",
            'How effective are our onboarding and advisory experiences? ',
            'Are our users advocates, detractors, or silent quitters?',
          ],
        },
        {
          title: 'What industry trends and shifts to expect?',
          list: [
            'How will AI, embedded finance, and Web3 impact our service models? ',
            'How should we prepare for evolving privacy norms, ESG compliance, or open banking frameworks? ',
            'Where is the next digital battleground—and are we ready?',
          ],
        },
      ],
    },
    featureSection: {
      title: 'Discover Insights Across the Financial Lifecycle',
      items: [
        {
          title: 'Understand Customer Financial Journeys',
          description:
            'From opening a savings account to purchasing insurance, applying for credit, or planning retirement—each financial milestone offers insight. We help you map the full customer lifecycle, identify friction points, and design solutions that truly serve user needs across life stages and financial goals.',
          isBorder: true,
        },
        {
          title: 'Decode Trust and Risk Perception',
          description:
            'In finance, trust is currency. Our research uncovers what builds or erodes trust—whether it’s data security, ethical investing, customer service, or pricing transparency. We also help you understand how different segments assess financial risk and make decisions in uncertain conditions.',
          isBorder: true,
        },
        {
          title: 'Test Financial Products Before Launch',
          description:
            'Thinking about a new insurance policy, credit product, or robo-advisory service? Validate your offerings through A/B testing, feature prioritization, and pricing studies. We help you understand willingness to pay, product-market fit, and whether your idea meets actual financial needs.',
          isBorder: true,
        },
        {
          title: 'Monitor Regulatory and Reputational Sensitivities',
          description:
            'Financial services operate under intense public and regulatory scrutiny. We help you pulse-test communications, ad messaging, and policies before they go live—ensuring your reputation and compliance stay intact while still engaging the audience authentically.',
          isBorder: true,
        },
      ],
    },
    caseStudiesSection: {
      title: 'Audiences We Reach in Financial Services & Insurance',
      description:
        'Every insight starts with the right voice. ThoughtMetrics taps into specialized, high-trust respondent networks across the financial world.',
      list: [
        'Retail banking customers ',
        'Wealth managers',
        'Fintech founders',
        'HNIs',
        'Insurance policyholders',
        'Underwriters',
        'Claims professionals',
        'CFOs',
        'ESG leads',
        'Risk & compliance managers',
        'SMB owners',
        'Digital banking users',
        'Actuaries',
        'Investment advisors',
        'Customer experience leaders',
        'Loan officers',
        'Credit analysts',
        'HR & payroll decision-makers',
      ],
      img: '/images/industry_internet_3.png',
    },
    actionSection: {
      img: '/images/industry_girl_1.png',
      illustration: SlideBrickIcon,

      title: 'Make smarter decisions with the people who trust you most.',
      actionButton: {
        label: "Let's Connect",
        path: ROUTES.CONTACT_US,
      },
    },
  },
  automotive: {
    heroSection: {
      title: 'Shift Gears with Precision: Insights That Accelerate Growth',
      description:
        'From combustion to connected, the automotive world is transforming at full throttle. At ThoughtMetrics, we decode the why behind the drive—helping you navigate shifting behaviors, leapfrog competition, and engineer what’s next.',
      actionButton: {
        label: 'Request a Bid',
        path: ROUTES.START_YOUR_RESEARCH,
      },
      illustration: {
        img: '/images/industry_automobile_1.png',
        size: 'full',
        aspectRatio: 'landscape',
        shadowPosition: 'tl',
        shadowOpacity: 'full',
        objectFit: 'cover',
        loading: 'lazy',
      },
    },
    serviceSection: [
      {
        iconOptions: {
          icon: PersonStaringIcon,
          isActive: true,
          isBorder: false,
          bgColor: 'primary-light',
        },
        title: 'Tune into Emotional Drivers, Not Just Engine Specs',
        description:
          'A vehicle is more than metal and tech—it’s identity, freedom, and aspiration. We help you tap into the deeper emotional layers of decision-making, from how a car feels to how it fits into life milestones.',
        bgColor: 'grey',
        isBorder: false,
        isActive: true,
      },
      {
        iconOptions: {
          icon: CarIcon,
          isActive: true,
          isBorder: false,
          bgColor: 'primary-light',
        },
        title: 'Pressure-Test Innovation Before It Hits the Assembly Line',
        description:
          'Why gamble on a multimillion-dollar product launch? Our agile research models let you simulate real-world buyer response to bold new features, experimental formats, and future-forward designs—before production begins.',
        bgColor: 'grey',
        isBorder: false,
        isActive: true,
      },
      {
        iconOptions: {
          icon: LocatorPinIcon,
          isActive: true,
          isBorder: false,
          bgColor: 'primary-light',
        },
        title: 'Local Roads, Global Vision',
        description:
          "From a tier-2 city in India to a dealership in Detroit, consumer expectations aren't universal. We surface hyper local preferences and regional variations, so your go-to-market strategy feels intuitive wherever you launch.",
        bgColor: 'grey',
        isBorder: false,
        isActive: true,
      },
    ],
    questionarySection: {
      title: 'Build Vehicles, Brands, and Experiences That Resonate',
      description:
        'Automotive innovation is as much about emotion as engineering. We help you understand both.',
      illustration: {
        img: '/images/industry_automobile_2.png',
        size: 'full',
        aspectRatio: 'landscape',
        objectFit: 'cover',
        loading: 'lazy',
        rounded: 'none',
      },
      questionnaires: [
        {
          title: "Who's your real customer?",
          list: [
            'What buyer segments are emerging in the EV and hybrid landscape?',
            'What influences vehicle choice: performance, safety, sustainability, tech?',
            'How do younger demographics define automotive brand loyalty?',
          ],
        },
        {
          title: 'How do they want to buy?',
          list: [
            'What role do digital showrooms, online configurator, and virtual test drives play?',
            "What are the friction points in today's dealership or direct-to-consumer experience?",
            'What financing and subscription models appeal to different consumer cohorts?',
          ],
        },
        {
          title: 'What should your brand stand for?',
          list: [
            'What design, sound, and visual cues resonate across global markets?',
            "Is your marketing aligned with the values and aspirations of tomorrow's drivers?",
            'How do consumers interpret your sustainability messaging?',
          ],
        },
        {
          title: 'Are you measuring the right KPIs?',
          list: [
            'Which campaigns are driving showroom visits and digital leads?',
            'What metrics best reflect customer satisfaction and post-sale engagement?',
            'How does your brand perception compare to competitors across geographies?',
          ],
        },
        {
          title: "What's next for mobility?",
          list: [
            'How should you evolve with electrification, autonomy, and shared mobility?',
            'What infrastructure gaps (charging, service, software) are pain points?',
            'Are your buyers ready for connected car ecosystems and over-the-air updates?',
          ],
        },
      ],
    },
    featureSection: {
      title: 'Every Stage, Every Segment, Every Spark',
      items: [
        {
          title: 'Concepts That Resonate Early',
          description:
            'Refine what’s on the drawing board before it hits the production line. Validate consumer appetite for new features, technologies, and formats. From vehicle styling and trim levels to electric drivetrain options and autonomous capabilities—we help you uncover what excites your audience and what leaves them cold.',
          isBorder: true,
        },
        {
          title: 'Launches That Convert Fast',
          description:
            'Position and promote your vehicle in ways that cut through the noise. Understand how pricing, messaging, and promotional strategies impact consumer choice. Test model variants, package configurations, and dealership experiences to optimize conversion—and turn first-time buyers into lifelong advocates.',
          isBorder: true,
        },
        {
          title: 'Experiences That Build Loyalty',
          description:
            'Deliver seamless journeys both on the road and in the app. Consumers now expect more than a smooth ride—they want smart connectivity, real-time services, and intuitive interfaces. We capture feedback on in-car UX, infotainment systems, subscription features, and digital tools to help elevate your post-sale ecosystem.',
          isBorder: true,
        },
        {
          title: 'Cycles That Drive Value',
          description:
            'Leverage customer sentiment to shape resale, upgrades, and loyalty cycles. Identify what keeps owners satisfied—or leads them to churn. We gather feedback on servicing, trade-in preferences, certified pre-owned options, and mobility alternatives so you can retain value, increase referrals, and extend the customer relationship.',
          isBorder: true,
        },
      ],
    },
    caseStudiesSection: {
      title: 'Automotive Audiences We Reach',
      description:
        'Speak to the drivers, dreamers, and decision-makers shaping the industry. We find the right voices—from passionate gear heads to practical commuters and future-focused industry insiders.',
      list: [
        'First-time buyers',
        'Luxury car owners',
        'EV and hybrid adopters',
        'Enthusiasts & brand loyalists',
        'Fleet managers',
        'Used car buyers and sellers',
        'Automotive engineers & product developers',
        'Supply chain experts',
        'Dealership sales leads',
        'CMOs & marketing strategists',
        'Smart mobility startups',
        'Charging infrastructure partners',
        'City planners and policymakers',
      ],
      img: '/images/industry_retail_3.png',
    },
    actionSection: {
      img: '/images/industry_girl_1.png',
      illustration: SlideBrickIcon,

      title: 'Drive decisions with insights from the people behind the wheel.',
      actionButton: {
        label: "Let's Connect",
        path: ROUTES.CONTACT_US,
      },
    },
  },
  education: {
    heroSection: {
      title: 'Future-Proof Education with Human-Centered Intelligence',
      description:
        'At ThoughtMetrics, we empower institutions, ed-tech platforms, and education leaders to build with clarity—through insights that align with student needs, workforce demands, and future-ready learning models.',
      actionButton: {
        label: 'Request a Bid',
        path: ROUTES.START_YOUR_RESEARCH,
      },
      illustration: {
        img: '/images/industry_education_1.png',
        size: 'full',
        aspectRatio: 'landscape',
        shadowPosition: 'tl',
        shadowOpacity: 'full',
        objectFit: 'cover',
        loading: 'lazy',
      },
    },
    serviceSection: [
      {
        iconOptions: {
          icon: PersonReadIcon,
          isActive: true,
          isBorder: false,
          bgColor: 'primary-light',
        },
        title: "Understand Today's Learner",
        description:
          'Get deep insights into the motivations, goals, and pain points of prospective and current students—from Gen Z to adult learners. We help you design programs, messaging, and services that resonate across life stages and demographics.',
        bgColor: 'grey',
        isBorder: false,
        isActive: true,
      },
      {
        iconOptions: {
          icon: FirstLawIcon,
          isActive: true,
          isBorder: false,
          bgColor: 'primary-light',
        },
        title: 'Innovate Beyond the Syllabus',
        description:
          'From micro-credentials to experiential learning, we surface data to help you design, test, and scale new programs. Explore demand for new modalities, formats, or partnerships—before you invest.',
        bgColor: 'grey',
        isBorder: false,
        isActive: true,
      },
      {
        iconOptions: {
          icon: WorkerIcon,
          isActive: true,
          isBorder: false,
          bgColor: 'primary-light',
        },
        title: 'Bridge Education and Employability',
        description:
          'Are your offerings aligned with what employers need? We continuously track labor market trends, emerging industries, and hiring gaps to ensure your curriculum builds relevant, marketable skills.',
        bgColor: 'grey',
        isBorder: false,
        isActive: true,
      },
    ],
    questionarySection: {
      title: 'Make Learning Smarter. Sharpen Outcomes. Drive Enrollment.',
      description:
        'Build more impactful programs, policies, and platforms with evidence-led direction. We help education providers and edtech leaders answer big, future-facing questions.',
      illustration: {
        img: '/images/industry_education_2.png',
        size: 'full',
        aspectRatio: 'landscape',
        objectFit: 'cover',
        loading: 'lazy',
        rounded: 'none',
      },
      questionnaires: [
        {
          title: 'Who are we designing for?',
          list: [
            "What are the motivations, frustrations, and goals of today's learners and educators?",
            'How do different student types—from first-gen learners to working professionals—engage with education?',
            'Where are gaps in access, equity, or engagement?',
          ],
        },
        {
          title: 'How do we reach and retain them?',
          list: [
            'What are the most effective channels for awareness and enrollment?',
            'What motivates students to choose, persist, and complete?',
            'How do faculty prefer to adopt and integrate new technologies?',
          ],
        },
        {
          title: 'What should we build next?',
          list: [
            'Which learning formats (hybrid, micro-learning, credentialing) hold the most promise?',
            'What skills are learners and employers prioritizing?',
            'What innovations are worth investing in—XR, AI tutors, or mobile-first models?',
          ],
        },
        {
          title: 'How do we measure success?',
          list: [
            'What are the leading indicators of student progress and satisfaction?',
            'How effective are new programs, platforms, or faculty development tools?',
            'How do we measure institutional brand perception and impact?',
          ],
        },
        {
          title: "What's around the corner?",
          list: [
            'How will shifting demographics, regulations, or funding models impact strategy?',
            'What global trends will influence how and where learning happens?',
            'What does the future classroom or virtual campus look like?',
          ],
        },
      ],
    },
    featureSection: {
      title: 'Discover What Your Education Stakeholders Think, Need & Expect',
      items: [
        {
          title: 'Diverse Reach',
          description:
            'Tap into learners, teachers, administrators, and ed-tech buyers worldwide. We source from both traditional institutions and next-gen learning platforms.',
          isBorder: true,
        },
        {
          title: 'Live and Asynchronous Engagement',
          description:
            'Join structured conversations with target audiences to unpack challenges, behaviors, and aspirations in real time—or on their schedule.',
          isBorder: true,
        },
        {
          title: 'Scalable, Automated Feedback',
          description:
            'Get rapid input on prototypes, messaging, or program ideas with tools built for iteration and scale.',
          isBorder: true,
        },
        {
          title: 'Quick Turnaround Research',
          description:
            'Pose your questions to a vetted education panel and gather insightful responses in just days—not weeks.',
          isBorder: true,
        },
      ],
    },
    caseStudiesSection: {
      title: 'The Education Ecosystem We Serve',
      description:
        'Great research starts by listening to the right people. We connect you to the change-makers, learners, and strategists shaping the future of education.',
      list: [
        'Students (K-12, Higher Ed, Adult Learning)',
        'Parents & Guardians',
        'Teachers & Professors',
        'School Leaders',
        'Ed-tech Founders',
        'Curriculum Designers',
        'Instructional Technologists',
        'Career Advisors',
        'Workforce Development Leaders',
        'Online Platform Users',
        'Public Education Officials',
        'Policy Influencer',
        'Funds',
        'Institutional Decision-Makers.',
      ],
      img: '/images/industry_healthcare_3.png',
    },
    actionSection: {
      img: '/images/industry_girl_1.png',
      illustration: SlideBrickIcon,

      title:
        'Shape learning experiences with insights from students, parents, and educators.',
      actionButton: {
        label: "Let's Connect",
        path: ROUTES.CONTACT_US,
      },
    },
  },
  fmcg: {
    heroSection: {
      title: 'Explore What Moves Fast: Insights That Power FMCG Growth',
      description:
        'From shelf to screen to shopping cart, uncover what truly drives today’s consumer choices.',
      actionButton: {
        label: 'Request a Bid',
        path: ROUTES.START_YOUR_RESEARCH,
      },
      illustration: {
        img: '/images/industry_fmcg_1.png',
        size: 'full',
        aspectRatio: 'landscape',
        shadowPosition: 'tl',
        shadowOpacity: 'full',
        objectFit: 'cover',
        loading: 'lazy',
      },
    },
    serviceSection: [
      {
        iconOptions: {
          icon: CustomerCartIcon,
          isActive: true,
          isBorder: false,
          bgColor: 'primary-light',
        },
        title: 'Uncover Unmet Needs in Real-Time',
        description:
          "Stay ahead of consumer shifts with agile research that captures emerging tastes, values, and expectations. Whether you're testing a new flavor, tweaking a package design, or evaluating lifestyle alignment, we surface what resonates—fast.",
        bgColor: 'grey',
        isBorder: false,
        isActive: true,
      },
      {
        iconOptions: {
          icon: ClipboardIcon,
          isActive: true,
          isBorder: false,
          bgColor: 'primary-light',
        },
        title: 'Measure, Learn, and Launch Smarter',
        description:
          'From product conceptive to campaign optimization, we offer iterative insight loops that reduce risk and sharpen execution. Our blend of qual and quant ensures you move with speed and confidence.',
        bgColor: 'grey',
        isBorder: false,
        isActive: true,
      },
      {
        iconOptions: {
          icon: KeyIcon,
          isActive: true,
          isBorder: false,
          bgColor: 'primary-light',
        },
        title: 'Scale Research Your Way',
        description:
          'Whether you need rapid dipstick surveys or full-scale focus groups, we flex to your timelines and team needs. Choose DIY or partner with our FMCG research experts—either way, your next move is insight-driven.',
        bgColor: 'grey',
        isBorder: false,
        isActive: true,
      },
    ],
    questionarySection: {
      title: 'Drive Brand, Product, and Market Excellence',
      description:
        'ThoughtMetrics helps FMCG teams answer big questions that matter to the bottom line.',
      illustration: {
        img: '/images/industry_fmcg_2.png',
        size: 'full',
        aspectRatio: 'landscape',
        objectFit: 'cover',
        loading: 'lazy',
        rounded: 'none',
      },
      questionnaires: [
        {
          title: 'What do consumers actually want now?',
          list: [
            'How are values like health, convenience, and sustainability shifting across categories?',
            'What motivates consumers to try something new—and stay loyal?',
            'What do consumers really think of our brand compared to competitors?',
          ],
        },
        {
          title: 'What will win on shelf and screen?',
          list: [
            'How do shoppers evaluate in-store vs online?',
            'What formats, claims, and benefits cut through clutter?',
            'Which pack designs are conversion magnets—and which are skippable?',
          ],
        },
        {
          title: 'Are our innovations meaningful?',
          list: [
            'Does this new idea solve a real pain point?',
            'Have we validated the concept, pricing, and positioning?',
            'Are we bringing novelty that excites without overcomplicated?',
          ],
        },
        {
          title: 'How do we drive growth across channels?',
          list: [
            'What friction points exist in the e-commerce path to purchase?',
            'Are media investments driving consideration and conversion?',
            'How can we localize messaging for regional impact?',
          ],
        },
        {
          title: 'What are the risks, gaps, and white spaces?',
          list: [
            'Are we seeing churn from certain segments—why?',
            "What's the real ROI of our recent campaigns?",
            'Where are competitors gaining ground?',
          ],
        },
      ],
    },
    featureSection: {
      title: 'Decode the Full Consumer Journey with ThoughtMetrics',
      items: [
        {
          title: 'Multi-Segment Reach',
          description:
            'Tap into diverse segments—from impulse snackers to premium beauty buyers. We specialize in reaching niche and emerging audiences that traditional trackers miss.',
          isBorder: true,
        },
        {
          title: 'Real-Time Experience Capture',
          description:
            'Use mobile ethnography and in-the-moment feedback to capture behaviors at home, in-store, and online.',
          isBorder: true,
        },
        {
          title: 'Agile Concept and Pack Testing',
          description:
            'Test ideas before you commit. From label design to sustainable materials, understand what drives appeal and action.',
          isBorder: true,
        },
        {
          title: 'Campaign and Content Diagnostics',
          description:
            'Measure recall, sentiment, and brand lift across TV, social, OTT, and in-app ads. Fine-tune creative to boost ROI.',
          isBorder: true,
        },
      ],
    },
    caseStudiesSection: {
      title: 'The FMCG Audiences We Reach',
      description:
        "Targeted research begins with the right consumers. We reach across the spectrum of today's FMCG ecosystem.",
      list: [
        'Grocery buyers',
        'Millennials & Gen Z consumers',
        'D2C shoppers',
        'E-commerce-only consumers',
        'Sustainable product adopters',
        'High-frequency buyers',
        'New product trials',
        'B2B trade buyers',
        'Retail category managers',
        'Brand switchers',
        'Health-conscious consumers',
        'Rural vs urban market segments',
        'Subscription product users',
        'Value vs premium product buyers',
        'International market testers.',
      ],
      img: '/images/industry_advertising_3.png',
    },
    actionSection: {
      img: '/images/industry_girl_1.png',
      illustration: SlideBrickIcon,
      title:
        'Ready to fuel your next big decision with clarity and confidence?',
      actionButton: {
        label: "Let's Connect",
        path: ROUTES.CONTACT_US,
      },
    },
  },
  investor: {
    heroSection: {
      title:
        'Invest with Confidence: Market Intelligence that Moves at the Speed of Capital',
      description:
        'From early diligence to post-deal growth, discover the real drivers behind business performance and consumer momentum.',
      actionButton: {
        label: 'Request a Bid',
        path: ROUTES.START_YOUR_RESEARCH,
      },
      illustration: {
        img: '/images/industry_investors_1.png',
        size: 'full',
        aspectRatio: 'landscape',
        shadowPosition: 'tl',
        shadowOpacity: 'full',
        objectFit: 'cover',
        loading: 'lazy',
      },
    },
    serviceSection: [
      {
        iconOptions: {
          icon: ShieldIcon,
          isActive: true,
          isBorder: false,
          bgColor: 'primary-light',
        },
        title: 'De-Risk Every Deal',
        description:
          'From TAM validation to consumer sentiment checks, we deliver fast-turn research that helps you separate signal from noise. Avoid assumptions—invest based on verified market truths.',
        bgColor: 'grey',
        isBorder: false,
        isActive: true,
      },
      {
        iconOptions: {
          icon: SheetBagIcon,
          isActive: true,
          isBorder: false,
          bgColor: 'primary-light',
        },
        title: 'Pressure-Test Portfolio Strategy',
        description:
          "Whether you're assessing a new brand's potential or refining growth playbooks, our insight loops help you test hypotheses before committing capital or go-to-market resources.",
        bgColor: 'grey',
        isBorder: false,
        isActive: true,
      },
      {
        iconOptions: {
          icon: KeyIcon,
          isActive: true,
          isBorder: false,
          bgColor: 'primary-light',
        },
        title: 'Research at PE Speed',
        description:
          'Need to validate a niche? Understand churn risk? Test pricing elasticity? We move at your pace—with same-week dipsticks, on-demand focus groups, and executive-level reporting that fits right into your IMs and IC decks.',
        bgColor: 'grey',
        isBorder: false,
        isActive: true,
      },
    ],
    questionarySection: {
      title: 'Illuminate the Market Realities Behind the Numbers',
      description:
        'ThoughtMetrics equips investment professionals with powerful answers to pressing strategic questions.',
      illustration: {
        img: '/images/industry_investors_2.png',
        size: 'full',
        aspectRatio: 'landscape',
        objectFit: 'cover',
        loading: 'lazy',
        rounded: 'none',
      },
      questionnaires: [
        {
          title: 'Is the market opportunity real—or hyped?',
          list: [
            'What unmet needs are consumers still voicing?',
            "What\'s the rate of product/category trial and repeat?",
            'How saturated is the space—really?',
          ],
        },
        {
          title: "What's the strength of this brand's equity?",
          list: [
            'Do customers trust, recall, and recommend this brand?',
            'Where does it sit in competitive maps by awareness, preference, and pricing power?',
            'Is brand growth organic—or driven by short-term spend?',
          ],
        },
        {
          title: 'How sticky is this user base?',
          list: [
            "What's driving retention, subscription, or repurchase?",
            'Are churn indicators showing up across segments?',
            'Are they buying into a product—or a brand experience?',
          ],
        },
        {
          title: 'Can the brand scale across regions or channels?',
          list: [
            'What are the barriers to entry or loyalty in new geographies?',
            'How does the brand translate to digital, retail, and D2C models?',
            'What message works where—and why?',
          ],
        },
        {
          title: "What's the upside—and what's the risk?",
          list: [
            'Are competitors gaining ground on core segments?',
            'What would kill this brand in 12 months?',
            "What macro shifts could make it tomorrow's leader?",
          ],
        },
      ],
    },
    featureSection: {
      title: 'Decode Markets and Models, Fast',
      items: [
        {
          title: 'Live Diligence Dashboards',
          description:
            'Need insight in 48 hours? Our real-time dashboards and quick-deploy panels bring investor-grade insights to your screen—without compromising rigor.',
          isBorder: true,
        },
        {
          title: 'Founder & Customer Sentiment Testing',
          description:
            'Get the voice of the buyer and the voice of the builder—side-by-side. We triangulate what brands say with what users feel to reveal alignment, gaps, and levers.',
          isBorder: true,
        },
        {
          title: 'Innovation Viability Scans',
          description:
            'Evaluate product pipelines, roadmap, and IP portfolios with customer-centric validation. Are innovations real, relevant, and revenue-ready?',
          isBorder: true,
        },
        {
          title: 'Post-Close Growth Validation',
          description:
            "After the deal's inked, the work begins. We help you prioritize channel expansion, audience acquisition, and brand repositioning with insight—not gut feel.",
          isBorder: true,
        },
      ],
    },
    caseStudiesSection: {
      title: 'The Investor Audiences We Support',
      description:
        'We tailor insights for decision-makers across the capital spectrum.',
      list: [
        'Private equity professionals',
        'Venture capital partners',
        'Limited partners',
        'Corporate development leaders',
        'M&A teams',
        'Growth equity firms',
        'Family offices',
        'Investment banks',
        'Strategic investors',
        'Due diligence consultants',
        'Investment analysts',
        'Portfolio acceleration teams',
        'Operational partners',
        'Secondary market specialists.',
      ],
      img: '/images/industry_internet_3.png',
    },
    actionSection: {
      img: '/images/industry_girl_1.png',
      illustration: SlideBrickIcon,

      title: 'Move from instinct to insight—and from insight to impact.',
      actionButton: {
        label: "Let's Connect",
        path: ROUTES.CONTACT_US,
      },
    },
  },
  technology: {
    heroSection: {
      title: 'Uncover the Full Picture of Technology Decision-Making',
      description:
        'From product strategy to user experience, Thought Metrics helps you understand what drives tech adoption, innovation, and transformation.',
      actionButton: {
        label: 'Request a Bid',
        path: ROUTES.START_YOUR_RESEARCH,
      },
      illustration: {
        img: '/images/industry_technology_1.png',
        size: 'full',
        aspectRatio: 'landscape',
        shadowPosition: 'tl',
        shadowOpacity: 'full',
        objectFit: 'cover',
        loading: 'lazy',
      },
    },
    serviceSection: [
      {
        iconOptions: {
          icon: CoderIcon,
          isActive: true,
          isBorder: false,
          bgColor: 'primary-light',
        },
        title: 'Access the Right Tech Influencer & Decision-Makers',
        description:
          "Whether it's enterprise architects, CIOs, or end users, Thought Metrics connects you with the exact audiences who shape technology adoption across industries and geographies.",
        bgColor: 'grey',
        isBorder: false,
        isActive: true,
      },
      {
        iconOptions: {
          icon: FastTimeIcon,
          isActive: true,
          isBorder: false,
          bgColor: 'primary-light',
        },
        title: 'Insights at the Speed of Innovation',
        description:
          'In tech, timing is everything. Get rapid, AI-powered insights that help you iterate faster, validate early, and stay one step ahead of the curve.',
        bgColor: 'grey',
        isBorder: false,
        isActive: true,
      },
      {
        iconOptions: {
          icon: UIPanelIcon,
          isActive: true,
          isBorder: false,
          bgColor: 'primary-light',
        },
        title: 'Tailored to Your Workflow',
        description:
          "Choose between full-service research support or our intuitive self-serve platform—we'll meet you where you are with flexible tools to uncover insights on product-market fit, UI/UX, infrastructure, and more.",
        bgColor: 'grey',
        isBorder: false,
        isActive: true,
      },
    ],
    questionarySection: {
      title: 'Build What the Market Actually Wants',
      description:
        "The best tech products and services come from understanding the market as deeply as you understand the code. Whether you're shipping software, improving cloud infrastructure, or crafting next-gen interfaces, our insights guide confident decision-making.",
      illustration: {
        img: '/images/industry_technology_2.png',
        size: 'full',
        aspectRatio: 'landscape',
        objectFit: 'cover',
        loading: 'lazy',
        rounded: 'none',
      },
      questionnaires: [
        {
          title: 'Who are your end users and buyers',
          list: [
            'What are the key tech decision-making roles in our target companies?',
            'What are their current pain points?',
            'What do developers, IT managers, or end users actually want from our solution?',
            'What does the ideal customer journey look like for our product?',
          ],
        },
        {
          title: 'What channels and formats should we prioritize?',
          list: [
            'How do tech buyers prefer to discover and evaluate new tools or platforms?',
            'Are they influenced more by peer reviews, analyst reports, webinars, or demos?',
            'How can we adapt our outreach for CIOs vs. hands-on users?',
          ],
        },
        {
          title: 'What makes our product stand out?',
          list: [
            'How intuitive is our UI/UX compared to competitors?',
            'What features do users actually value vs. what we assume they do?',
            'Which pain points does our product solve best?',
            'How should we position our value proposition in a crowded space?',
          ],
        },
        {
          title: 'How do we track and optimize impact?',
          list: [
            'Are users returning, retaining, and recommending?',
            'How does sentiment shift over time?',
            'What is our brand perception in IT vs. business circles?',
            'How do our pilot or beta tests perform across different regions or industries?',
          ],
        },
        {
          title: "What's next in tech?",
          list: [
            'How are trends like AI, edge computing, cybersecurity, and cloud-native evolving?',
            'What unmet needs exist across verticals like healthcare, fin-tech, or manufacturing?',
            'Are we prepared for shifts in tech procurement, like consumption-based models or open-source-first preferences?',
            'How should we navigate regulation, compliance, and trust in tech?',
          ],
        },
      ],
    },
    featureSection: {
      title: 'Decode Markets and Models, Fast',
      items: [
        {
          title: 'Diverse & Targeted Global Sample',
          description:
            'From developers in Bangalore to CTOs in Berlin, we ensure your research reaches the right roles, regions, and industries to make confident product and strategy decisions.',
          isBorder: true,
        },
        {
          title: 'Context-Rich Digital Discussions',
          description:
            'Go beyond the dashboard with qualitative and quantitative data blended into actionable insights—so you can test assumptions, co-create with users, and spot innovation gaps.',
          isBorder: true,
        },
        {
          title: 'Automated UX & Concept Testing',
          description:
            'Launch repeatable, rapid testing cycles that evaluate everything from wireframe to feature sets. AI helps you identify what resonates most with your core users.',
          isBorder: true,
        },
        {
          title: '48-Hour Pulse Checks',
          description:
            'Stay agile with our rapid omnibus studies—get answers to your urgent tech market questions in 48 hours or less, without sacrificing quality.',
          isBorder: true,
        },
      ],
    },
    caseStudiesSection: {
      title: 'Technology Audiences We Reach',
      description:
        'High-impact tech market research begins with connecting to the right experts. Thought Metrics sources hard-to-reach audiences from across the global technology landscape.',
      list: [
        'Enterprise IT buyers',
        'Developers & engineers',
        'CIOs & CTOs',
        'Cybersecurity leaders',
        'Product managers',
        'UI/UX researchers & designers',
        'Cloud architects',
        'DevOps professionals',
        'Data scientists & analysts',
        'SaaS decision-makers',
        'Procurement leaders',
        'Digital transformation heads',
        'Early adopters and beta users',
        'Tech journalists & influencer',
      ],
      img: '/images/industry_retail_3.png',
    },
    actionSection: {
      img: '/images/industry_girl_1.png',
      illustration: SlideBrickIcon,

      title: 'Move from instinct to insight—and from insight to impact.',
      actionButton: {
        label: "Let's Connect",
        path: ROUTES.CONTACT_US,
      },
    },
  },
} as const;
