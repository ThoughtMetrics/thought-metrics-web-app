import {
  BrandAwarnessIllustration,
  BrandLoyaltyIcon,
  ChangeAdaptabilityIcon,
  CompetitiveAnalysisIllustration,
  CompetitiveEdgeIcon,
  ConceptTestingIcon,
  ConjointAnalysisIllustration,
  CostReductionIcon,
  CubicCaptureIllustration,
  CustomerInsightsIcon,
  CustomerLoyaltyIllustration,
  CustomerSatisfactionIcon,
  CustomerStarIcon,
  DataDrivenIcon,
  EnhancedRoiIcon,
  EyeTrackingIllustration,
  FeasibilityIllustration,
  GotoIllustration,
  HolisticCampaignIcon,
  IdeaGenerationIcon,
  InnovationEncouragementIcon,
  LoveCycleIcon,
  MarketEntryIllustration,
  MarketSimulationIcon,
  MessageKiteIllustration,
  MountainIllustration,
  OptMarketingIcon,
  PackingBrandingIcon,
  PostLaunchInsightIcon,
  PrelaunchFeedbackIcon,
  PricingPositioningIcon,
  ProductMarketFitIcon,
  ProductValidationIllustration,
  PrototypeEvaluationIcon,
  RiskMitigationIcon,
  StackIllustration,
  UXResearchIllustration,
} from '@/assets';
import { ROUTES } from '@/routes/routeConfig';

export const capabilities = {
  brand_advertising: {
    heroSection: {
      title: 'Know What Works. And Why.',
      description:
        'Brand and advertising research that reveals the story behind the stats.',
      actionButton: {
        label: 'Request a Bid',
        path: ROUTES.START_YOUR_RESEARCH,
      },
      illustration: {
        img: '/images/capabilities_branding_advertising_1.png',
        size: 'full',
        aspectRatio: 'landscape',
        shadowPosition: 'br',
        shadowOpacity: '50',
        objectFit: 'cover',
        loading: 'lazy',
      },
    },
    serviceSection: {
      title: 'Benefits of Advertising Effectiveness Research',
      items: [
        {
          iconOptions: {
            icon: DataDrivenIcon,
            isActive: false,
            isBorder: true,
            bgColor: 'transparent',
          },
          title: 'Data driven decision making',
          description:
            'Equip brands wth data driven insights to make informed decisions. By measuring outcomes of campaigns and their impact on target audience, brands can refine their strategies and allocate resources.',
          bgColor: 'grey',
          isBorder: true,
          isActive: false,
        },
        {
          iconOptions: {
            icon: EnhancedRoiIcon,
            isActive: false,
            isBorder: true,
            bgColor: 'transparent',
          },
          title: 'Enhanced ROI',
          description:
            'Understanding which campaigns resonate more with the audience enables brands to allocate budgets more effectively, ultimately leading to improved return on investment.',
          bgColor: 'grey',
          isBorder: true,
          isActive: false,
        },
        {
          iconOptions: {
            icon: CustomerStarIcon,
            isActive: false,
            isBorder: true,
            bgColor: 'transparent',
          },
          title: 'Customer centric approach',
          description:
            'By analyzing advertising effectiveness, brands gain valuable insights into customer preferences, behaviors, enabling them to tailor campaigns that resonate on a personal level.',
          bgColor: 'grey',
          isBorder: true,
          isActive: false,
        },

        {
          iconOptions: {
            icon: CompetitiveEdgeIcon,
            isActive: false,
            isBorder: true,
            bgColor: 'transparent',
          },
          title: 'Competitive edge',
          description:
            'Knowing what sets your brand apart and crafting messages that resonate and evoke the desired emotions can differentiate your brand and create a lasting experience.',
          bgColor: 'grey',
          isBorder: true,
          isActive: false,
        },
        {
          iconOptions: {
            icon: HolisticCampaignIcon,
            isActive: false,
            isBorder: true,
            bgColor: 'transparent',
          },
          title: 'Holistic campaign management',
          description:
            'Advertising effectiveness examines various metrics like reach, engagement, conversion rates, and customer sentiment ensuring a well-rounded understanding of the campaign’s impact.',
          bgColor: 'grey',
          isBorder: true,
          isActive: false,
        },
        {
          iconOptions: {
            icon: BrandLoyaltyIcon,
            isActive: true,
            isBorder: true,
            bgColor: 'primary-light',
          },
          title: 'Enhanced brand loyalty',
          description:
            'Effective advertising resonates with customers on a deeper level, fostering brand loyalty and long-term customer relationships. A strong connection leads to creation of brand advocates.',
          bgColor: 'primary',
          isBorder: true,
          isActive: true,
        },
      ],
    },
    questionarySection: {
      title: 'Using research to measure advertising effectiveness',
      description:
        "Key performance indicators (KPIs) such as impressions, click-through rates, and conversion rates serve as quantitative benchmarks for assessing the reach and engagement of a campaign.<br><br>Complementing these quantitative insights are qualitative methods, including customer surveys and sentiment analysis. These methods offer a deeper understanding of the emotional impact of the campaign's messaging and how it resonates with the audience's perceptions and preferences.",
      illustration: {
        img: '/images/capabilities_branding_advertising_2.png',
        size: 'default',
        aspectRatio: 'square',
        objectFit: 'cover',
        loading: 'lazy',
      },
      questionnaires: [
        {
          title: 'Set Clear Objectives',
          description:
            'Define specific goals for your advertising campaign, such as increasing brand awareness, driving website traffic, or boosting sales.',
        },
        {
          title: 'Identify KPIs',
          description:
            'Determine the metrics that align with your objectives, such as click-through rates, conversion rates, engagement metrics, and return on investment.',
        },
        {
          title: 'Track Quantitative Metrics',
          description:
            'Use analytics tools to monitor KPIs and quantitative data points. Evaluate metrics like impressions, clicks, conversions, and revenue generated from the campaign.',
        },
        {
          title: 'Conduct A/B Testing',
          description:
            'Use analytics tools to monitor KPIs and quantitative data points. Evaluate metrics like impressions, clicks, conversions, and revenue generated from the campaign.',
        },
        {
          title: 'Analyze Audience Engagement',
          description:
            'Monitor user interactions, such as time spent on landing pages, click-through paths, and social media engagement, to gauge audience interest.',
        },
        {
          title: 'Leverage Surveys and Feedback',
          description:
            'Gather qualitative insights through customer surveys and feedback to understand how your audience perceives your messaging and brand.',
        },
        {
          title: 'Measure Brand Awareness',
          description:
            'Assess changes in brand awareness before and after the campaign by using surveys or social media monitoring tools.',
        },
        {
          title: 'Track Conversion Rates',
          description:
            'Measure the percentage of visitors who complete a desired action, such as making a purchase, signing up, or downloading content.',
        },
        {
          title: 'Analyze ROI',
          description:
            'Calculate the return on investment by comparing the revenue generated from the campaign with the costs involved.',
        },
        {
          title: 'Utilize Advanced Analytics',
          description:
            'Leverage advanced analytics tools to gain deeper insights into user behavior, demographics, and trends.',
        },
        {
          title: 'Segmentation Analysis',
          description:
            'Analyze data based on different segments, such as demographics, geographic location, and behavior, to understand varying responses.',
        },
        {
          title: 'Continuous Optimization',
          description:
            'Continuously monitor the performance of your campaign and make adjustments based on data-driven insights to enhance effectiveness.',
        },
      ],
    },
    featureSection: {
      title: 'Influential Variables Shaping Marketing Campaigns',
      items: [
        {
          sNo: '01',
          title: 'Compelling content creation',
          description:
            'Compelling narratives, attention-grabbing visuals, and emotionally resonant storytelling can all enhance the impact of advertisements.',
          isBorder: false,
          bgColor: 'white',
        },
        {
          sNo: '02',
          title: 'Audience identification and segmentation',
          description:
            "Crafting content that speaks to the audience's interests and needs contributes to increased engagement and relevance.",
          isBorder: false,
          bgColor: 'white',
        },
        {
          sNo: '03',
          title: 'Right channel creation',
          description:
            'Choosing the right channels to deliver your message is pivotal. Selecting platforms where your audience actively engages increases the likelihood of exposure.',
          isBorder: false,
          bgColor: 'white',
        },
        {
          sNo: '04',
          title: 'Ad placement and formats',
          description:
            "Ads should be positioned where they align with the audience's interests, maximizing exposure and resonance. Selecting appropriate ad formats (e.g., video, display, native) also affects engagement.",
          isBorder: false,
          bgColor: 'white',
        },
        {
          sNo: '05',
          title: 'Effective Call to Action',
          description:
            'CTAs guide the audience on the desired next steps. Well-crafted CTAs prompt engagement, whether it’s making a purchase, subscribing to a newsletter, or exploring more content.',
          isBorder: false,
          bgColor: 'white',
        },
        {
          sNo: '06',
          title: 'Competitor landscape analysis',
          description:
            'Analyzing competitors’ strategies allows you to differentiate your offering, leveraging unique selling points to capture consumer attention.',
          isBorder: false,
          bgColor: 'white',
        },
        {
          sNo: '07',
          title: 'Cultural relevance',
          description:
            'Advertisements that resonate with cultural values and preferences establish a deeper connection with the audience.',
          isBorder: false,
          bgColor: 'white',
        },
        {
          sNo: '08',
          title: 'Personalization and data driven insights',
          description:
            'Personalized messages, tailored to individual preferences and behaviors, resonate more strongly with recipients.',
          isBorder: false,
          bgColor: 'white',
        },
      ],
    },
    b2bServiceSection: {
      services: [
        {
          className: 'absolute right-0 top-0 m-5 w-[23%] h-[23%]',
          title: 'Brand Perception Research',
          description:
            'Understand how customer experience, service levels, advertising, reputation, price branding and competitors affect your brand perception.',
          backgroundColor: 'green',
          illustration: CubicCaptureIllustration,
          link: '/resources/boosting-client-loyalty-with-brand-perception',
        },
        {
          className: 'absolute -bottom-5 right-20 w-[20rem] h-full',
          title: 'Brand Tracking Research',
          description:
            'Quantify brand efforts, improve brand messaging, prove ROI, customize KPI tracking, monitor competitors.',
          backgroundColor: 'purple',
          illustration: EyeTrackingIllustration,
          link: '/resources/brand-insights-that-matter',
        },
        {
          className: 'absolute top-8 right-0 h-[70%]',
          title: 'Brand Awareness Research',
          description:
            'Enhance brand visibility, improve competitive edge, engage in targeted marketing, have consistent branding, improve decision making, refine the message, achieve long term brand equity, mitigate risk and allocate resources efficiently.',
          backgroundColor: 'gray',
          illustration: BrandAwarnessIllustration,
          link: '/resources/brand-awareness-uncovered-know-your-impact',
        },
        {
          className: 'absolute right-12 top-8 w-[12%] h-[12%]',
          className1: 'absolute right-20 bottom-8 w-[18%] h-[18%]',
          title: 'Message Testing',
          description:
            'Message testing gauges responses to all your marking collaterals and tracks variables like abandonment rate, pate views, problems and frustrations, task success, task time, usability, attitude, conversions and NPS.',
          backgroundColor: 'pink',
          illustration: MessageKiteIllustration,
          link: '/resources/sharpen-your-story-with-message-testing',
        },
      ],
    },
    actionSection: {
      img: '/images/capabilities_girl_1.png',
      illustration: StackIllustration,
      title: 'Make every messaging count.',
      actionButton: {
        label: "Let's Connect",
        path: ROUTES.CONTACT_US,
      },
    },
  },
  market_opportunity: {
    heroSection: {
      title: 'Spot the Gaps. Seize the Growth.',
      description:
        'Turn uncertainty into opportunity with research that moves markets.',
      actionButton: {
        label: 'Request a Bid',
        path: ROUTES.START_YOUR_RESEARCH,
      },
      illustration: {
        img: '/images/capabilities_market_opportunity_1.png',
        size: 'full',
        aspectRatio: 'landscape',
        shadowPosition: 'br',
        shadowOpacity: '50',
        objectFit: 'cover',
        loading: 'lazy',
      },
    },
    serviceSection: {
      items: [
        {
          title: 'Resource Allocation',
          description:
            'With a clearer understanding of the competitive landscape, businesses can allocate resources more efficiently to areas that offer the greatest potential for growth and profitability.',
          bgColor: 'grey',
          isBorder: false,
          isActive: false,
          line3: true,
          line4: true,
          point: true,
        },
        {
          title: 'Informed decision making',
          description:
            'Competitive intelligence equips businesses with the knowledge needed to make well-informed decisions. By understanding their competitor’s strengths, weakness, and strategies, organizations can develop effective plans that capitalize on opportunities and mitigate risks.',
          bgColor: 'grey',
          isBorder: false,
          isActive: false,
          line3: true,
          line4: true,
          point: true,
        },
        {
          title: 'Customer insights',
          description:
            'Understanding how competitors interact with customers provide valuable insights into consumer behavior and preferences. This knowledge helps companies refine their marketing and customer engagement strategies.',
          bgColor: 'grey',
          isBorder: false,
          isActive: false,
          line4: true,
        },
        {
          title: 'Long-term strategy',
          description:
            'Competitive intelligence research contributes to the development of robust, forward-looking strategies that consider market dynamics and potential challenges.',
          bgColor: 'grey',
          isBorder: false,
          isActive: false,
          line3: true,
        },
        {
          title: 'Innovation',
          description:
            'By identifying gaps or areas where competitors are lacking, businesses can innovate and create new products or services that meet customer needs in unique ways.',
          bgColor: 'grey',
          line3: true,
        },
        {
          title: 'The Competitive Edge.',
          bgColor: 'primary',
          isActive: true,
        },
      ],
    },
    questionarySection: {
      title: 'Competitive Intelligence and Market Entry Strategy',
      description:
        'Competitive intelligence research makes you more competitive relative to all the factors in your environment, including: clients, distributors, technologies, macro economics, competitors, and anything else that impact your business.',
      illustration: {
        img: '/images/capabilities_market_opportunity_2.png',
        size: 'default',
        aspectRatio: 'square',
        objectFit: 'cover',
        loading: 'lazy',
      },
      questionnaires: [
        {
          title: 'SWOT Analysis',
          description:
            "Conduct a strength, weakness, opportunities and threats analysis to assess your company's internal strengths and weakness alongside external opportunities and threats.",
        },
        {
          title: 'Competitor Benchmarking',
          description:
            'Compare your performance metrics, product features, pricing and customer satisfaction against those of your competitors. Identify gaps and opportunities.',
        },
        {
          title: "Porter's Five Force Analysis",
          description:
            "Apply Porter's framework to evaluate the competitive forces in your industry, including threat of new entrants, bargaining power of suppliers and buyers.",
        },
        {
          title: 'Competitor Positioning Matrix',
          description:
            'Create a visual map that plots competitors based on attributes like price, quality, innovation, and customer service to identify opportunities for differentiation.',
        },
        {
          title: 'Scenario Analysis',
          description:
            'Develop scenarios that explore potential future market conditions and how competitors might react. Anticipate competitive responses and adapting your strategies.',
        },
        {
          title: 'Trend Analysis',
          description:
            'Identify long-term trends and shifts in customer preferences, technology advancements, and regulatory changes that impact your industry.',
        },
        {
          title: 'Gap Analysis',
          description:
            "Compare your company's offerings with those of competitors to identify gaps in your product or service portfolio.",
        },
        {
          title: 'New Product Launch',
          description:
            'Conducting research before the launch helps you understand the target market, competitive landscape and customer preferences.',
        },
        {
          title: 'Market Expansion',
          description:
            'If your company is planning to enter a new market or expand into different region, GTM can provide valuable insights to cater to the needs of the new audience.',
        },
        {
          title: 'Rebranding or repositioning',
          description:
            'GTM helps in understanding how a rebranding or repositioning exercise will be received by your audience and whether they align with market trends.',
        },
        {
          title: 'Sales Performance Concerns',
          description:
            'If your sales team is struggling to meet targets or encountering challenges in market, GTM can help identify obstacles and provide actionable solutions.',
        },
        {
          title: 'Continuous Improvement',
          description:
            "GTM research doesn't need to be a one-time effort. Many successful companies incorporate ongoing research into their business processes to stay agile.",
        },
      ],
    },
    featureSection: {
      title: 'The Competitive Analysis Process',
      items: [
        [
          {
            title: 'Define Your Industry and Market',
            isBorder: true,
            bgColor: 'white',
            bgOpacity: '10',
            isArrow: false,
          },
          {
            title: 'Identify key competitors',
            isBorder: true,
            bgColor: 'white',
            bgOpacity: '10',
            isArrow: true,
          },
          {
            title: 'Gather data',
            isBorder: true,
            bgColor: 'white',
            bgOpacity: '10',
            isArrow: true,
            isLowerCurve: true,
          },
        ],
        [
          {
            title: "Analyze competitor's strategies",
            isBorder: true,
            bgColor: 'white',
            bgOpacity: '10',
            isArrow: true,
            isUpperCurve: true,
          },
          {
            title: 'Framework Analysis',
            isBorder: true,
            bgColor: 'white',
            bgOpacity: '10',
            isArrow: true,
          },
          {
            title: 'Benchmarking',
            isBorder: true,
            bgColor: 'white',
            bgOpacity: '10',
            isArrow: true,
            isLowerCurve: true,
          },
        ],
        [
          {
            title: 'Identify opportunities and threats',
            isBorder: true,
            bgColor: 'white',
            isArrow: true,
            isUpperCurve: true,
          },
          {
            title: 'Develop actionable insights',
            isBorder: true,
            bgColor: 'white',
            isArrow: true,
          },
          {
            title: 'Continuously monitor',
            isBorder: true,
            bgColor: 'white',
            isArrow: true,
          },
        ],
      ],
    },
    b2bServiceSection: {
      services: [
        {
          className: 'absolute right-0 top-0 m-5 w-[23%] h-[23%]',
          title: 'Competitive Analysis',
          description:
            "Competitive landscape analysis framework assessments include SWOT analysis, Porter's Five Forces Analysis, PESTEL Analysis, competitive benchmarking, value chain analysis, customer analysis, product and service analysis, market share analysis, price and cost analysis, trend analysis, scenario planning and competitive mapping.",
          backgroundColor: 'green',
          illustration: CompetitiveAnalysisIllustration,
          link: '/resources/crafting-an-effective-competitive-landscape-strategy',
        },
        {
          className:
            'absolute right-20 w-[18rem] h-[20rem] top-1/2 transform -translate-y-1/2',
          title: 'Go-to-market Research',
          description:
            'New product launch, market expansion, business changes, rebranding or repositioning, competitive analysis, customer feedback, sales performance concerns, product or service enhancements, marketing strategy review, continuous improvement.',
          backgroundColor: 'purple',
          illustration: GotoIllustration,
          link: '/resources/decoding-your-market-the-gtm-research-edge',
        },
        {
          className:
            'absolute right-1/6 h-[70%] top-1/2 transform -translate-y-1/2',
          title: 'Market Entry Research',
          description:
            'Cultural and language barriers, regulatory complexity, competitive dynamics, dynamic market conditions, resource constraints, time sensitivity, consumer behavior, distribution channels, risk assessment, customer feedback and market perception, partnership and alliances, entry strategy.',
          backgroundColor: 'gray',
          illustration: MarketEntryIllustration,
          link: '/resources/step-in-smart-a-deep-dive-into-market-entry-research',
        },
        {
          className: 'absolute right-12 top-12 w-[12%] h-[12%]',
          className1: 'absolute right-18 ml-12 bottom-10 w-[21%] h-[21%]',
          title: 'Market Feasibility study',
          description:
            'Market analysis, target audience, technical feasibility, operational feasibility, financial analysis, risk assessment, economic factors.',
          backgroundColor: 'pink',
          illustration: FeasibilityIllustration,
          link: '/resources/blueprint-for-success-navigating-market-feasibility',
        },
      ],
    },
    actionSection: {
      img: '/images/capabilities_girl_1.png',
      illustration: StackIllustration,
      title: 'Stay ahead of the market.',
      actionButton: {
        label: "Let's Connect",
        path: ROUTES.CONTACT_US,
      },
    },
  },
  product_research: {
    heroSection: {
      title: 'Turn Ideas Into Market-Ready Products',
      description:
        'Deep product research powers smarter development, sharper messaging, and better customer experiences — from concept to launch and beyond.',
      actionButton: {
        label: 'Request a Bid',
        path: ROUTES.START_YOUR_RESEARCH,
      },
      illustration: {
        img: '/images/capabilities_product_research_1.png',
        size: 'full',
        aspectRatio: 'landscape',
        shadowPosition: 'br',
        shadowOpacity: '50',
        objectFit: 'cover',
        loading: 'lazy',
      },
    },
    serviceSection: {
      title: 'Benefits of Product Testing',
      items: [
        {
          iconOptions: {
            icon: CustomerInsightsIcon,
            isActive: false,
            isBorder: false,
            bgColor: 'transparent',
          },
          title: 'Customer Insights',
          description:
            'Product testing provides valuable insights into customer preferences and expectations, allowing businesses to align their products with the desires of their target audience.',
          bgColor: 'default',
          isBorder: true,
          isActive: false,
        },
        {
          iconOptions: {
            icon: OptMarketingIcon,
            isActive: false,
            isBorder: false,
            bgColor: 'transparent',
          },
          title: 'Optimized Marketing Strategy',
          description:
            'Understanding which aspects of a concept resonate most with consumers aids in the optimization of marketing strategies, ensuring effective communication.',
          bgColor: 'default',
          isBorder: true,
          isActive: false,
        },
        {
          iconOptions: {
            icon: RiskMitigationIcon,
            isActive: false,
            isBorder: false,
            bgColor: 'transparent',
          },
          title: 'Risk Mitigation',
          description:
            'Identify potential challenges and issues early in the development process helps mitigate risks and prevents costly mistakes.',
          bgColor: 'default',
          isBorder: true,
          isActive: false,
        },
        {
          iconOptions: {
            icon: ProductMarketFitIcon,
            isActive: false,
            isBorder: false,
            bgColor: 'transparent',
          },
          title: 'Enhanced Product-Market Fit',
          description:
            'By incorporating feedback and refining concepts, businesses can tailor their products to better match market needs, ultimately improving the product-market fit.',
          bgColor: 'default',
          isBorder: true,
          isActive: false,
        },
        {
          iconOptions: {
            icon: InnovationEncouragementIcon,
            isActive: false,
            isBorder: false,
            bgColor: 'transparent',
          },
          title: 'Innovation Encouragement',
          description:
            'Real-world feedback from concept testing encourages iterative improvements, fostering innovation and driving product development in the right direction.',
          bgColor: 'default',
          isBorder: true,
          isActive: false,
        },
      ],
    },
    questionarySection: {
      title: 'Product research and innovation strategy',
      description:
        'Product research drives smarter decisions across product development, brand messaging, packaging, services, digital experiences, marketing campaigns, and everything that shapes customer engagement.',
      illustration: {
        img: '/images/capabilities_product_research_2.png',
        aspectRatio: 'square',
        objectFit: 'cover',
        loading: 'lazy',
      },
      questionnaires: [
        {
          title: 'Product Development',
          description:
            'Concept testing plays a pivotal role in product development by evaluating new product ideas. This ensures product design align with customer needs.',
        },
        {
          title: 'Brand Messaging',
          description:
            'Assessing the effectiveness of different brand messages and communication strategies including testing slogans, taglines and overall brand positioning.',
        },
        {
          title: 'Packaging Design',
          description:
            'Concept testing is instrumental in evaluating different packaging designs to determine what resonates best with the target audience.',
        },
        {
          title: 'Service Offerings',
          description:
            'For service oriented businesses, concept testing can be applied to refine and optimize service offerings including testing delivery methods and pricing models.',
        },
        {
          title: 'Marketing Campaigns',
          description:
            'Before launching a marketing campaign, businesses can utilize concept testing to gauge the effectiveness of various campaign elements like visuals and messages.',
        },
        {
          title: 'Digital Products and Apps',
          description:
            'In the tech industry, concept testing is commonly used for digital products and applications. Testing the user interface, features, and functionalities.',
        },
        {
          title: 'Content Creation',
          description:
            'Media and entertainment industries leverage concept testing for content creation. This includes ideas for movies, TV shows, books and other creative works.',
        },
        {
          title: 'Retail Merchandising',
          description:
            'Retailers can use concept testing to evaluate different merchandising strategies, store layouts, and product placements to enhance shopping experience.',
        },
        {
          title: 'Conjoint Analysis',
          description:
            'A conjoint study helps you avoid investing in product developments that aren’t valued by your clients.',
        },
        {
          title: 'MaxDiff Analysis',
          description:
            'MaxDiff analysis prevents you from spending time or money on features that are at at an additional cost by asking them to rank options by level of importance.',
        },
        {
          title: 'UX/UI Research',
          description:
            'Gather feedback on beta products, gauge attitudes to the name and messaging of the product. Test the usability of anything form mockup to a final prototype.',
        },
      ],
    },
    featureSection: {
      title: 'From Concept to Market:<br> The Product Testing Journey',
      items: [
        {
          title: 'Idea Generation',
          description:
            'Capture unmet needs and whitespace opportunities using trend analysis and user feedback.',
          icon: IdeaGenerationIcon,
          isBorder: false,
          bgColor: 'default',
        },
        {
          title: 'Concept Testing',
          description:
            'Validate product ideas early to avoid costly development missteps.',
          icon: ConceptTestingIcon,
          isBorder: false,
          bgColor: 'default',
        },
        {
          title: 'Prototype Evaluation',
          description:
            'Test usability, design, and feature relevance with target users.',
          icon: PrototypeEvaluationIcon,
          isBorder: false,
          bgColor: 'default',
        },
        {
          title: 'Pricing & Positioning',
          description:
            'Understand perceived value and optimal pricing through conjoint or pricing research.',
          icon: PricingPositioningIcon,
          isBorder: false,
          bgColor: 'default',
        },
        {
          title: 'Packaging & Branding',
          description:
            'Explore design, messaging, and shelf appeal with simulated environments or surveys.',
          icon: PackingBrandingIcon,
          isBorder: false,
          bgColor: 'default',
        },
        {
          title: 'Market Simulation',
          description:
            'Use predictive modeling to estimate adoption, churn, and product-market fit.',
          icon: MarketSimulationIcon,
          isBorder: false,
          bgColor: 'default',
        },
        {
          title: 'Pre-launch Feedback',
          description:
            'Conduct beta testing or limited releases to fine-tune the final offering.',
          icon: PrelaunchFeedbackIcon,
          isBorder: false,
          bgColor: 'default',
        },
        {
          title: 'Post-launch Insights',
          description:
            'Track performance, satisfaction, and evolving user expectations for continuous improvement.',
          icon: PostLaunchInsightIcon,
          isBorder: false,
          bgColor: 'default',
        },
      ],
    },
    b2bServiceSection: {
      services: [
        {
          className: 'absolute right-0 top-0 m-5 w-[20%] h-[20%] ml-12',
          title: 'Conjoint Analysis',
          description:
            'Conjoint Analysis is based on the idea that consumers make trade-offs when selecting options, and it helps businesses determine which combination of attributes is most appealing to their target audience. Methods include, discrete choice, rating based, best-worst scaling, adaptive conjoint analysis.',
          backgroundColor: 'green',
          illustration: ConjointAnalysisIllustration,
          link: '/resources/uncovering-consumer-preferences',
        },
        {
          className: 'absolute -bottom-5 right-14 w-[20rem] h-full',
          title: 'MaxDiff Analysis',
          description:
            'MaxDiff allows researchers to determine the relative importance of various attributes or features by presenting respondents with sets of choices and asking them to indicate their most and least preferred options. MaxDiff analysis is particularly useful for attribute prioritization, market segmentation, and understanding the key factors that influence consumer preferences.',
          backgroundColor: 'purple',
          illustration: MountainIllustration,
          link: '/resources/from-basics-to-business-solutions',
        },
        {
          className: 'absolute top-8 right-12 h-[80%]',
          title: 'Product Validation testing',
          description:
            'Product validation testing is a way to check that your new product, service or feature meets a real-life need of your clients and prospects – before you go into development. It includes feasibility testing and user validation testing.',
          backgroundColor: 'gray',
          illustration: ProductValidationIllustration,
          link: '/resources/a-comprehensive-guide-to-product-validation',
        },
        {
          className: 'absolute right-8 top-8 w-[16%] h-[16%]',
          className1: 'absolute right-8 ml-8 bottom-4 w-[22%] h-[22%]',
          title: 'UX Research',
          description:
            'Avoid unleashing a poor user experience that not only diminishes the product, but damages the brand trust you’ve worked so hard to build using UX mockup testing, tree testing, card sorting, usability studies.',
          backgroundColor: 'pink',
          illustration: UXResearchIllustration,
          link: '/resources/partnering-with-a-ux-research-agency',
        },
      ],
    },
    actionSection: {
      img: '/images/capabilities_girl_1.png',
      illustration: StackIllustration,
      title: "Let's build smarter products.",
      actionButton: {
        label: "Let's Connect",
        path: ROUTES.CONTACT_US,
      },
    },
  },
  customer_research: {
    heroSection: {
      title: 'Customer-Centric Decisions Start Here',
      description:
        'Build lasting connections with your audience through meaningful insights.',
      actionButton: {
        label: 'Request a Bid',
        path: ROUTES.START_YOUR_RESEARCH,
      },
      illustration: {
        img: '/images/capabilities_customer_research_1.png',
        size: 'full',
        aspectRatio: 'landscape',
        shadowPosition: 'br',
        shadowOpacity: '50',
        objectFit: 'cover',
        loading: 'lazy',
      },
    },
    serviceSection: {
      innerTitle: 'Customer Research and Segmentation.',
      items: [
        {
          iconOptions: {
            icon: CustomerStarIcon,
            isActive: true,
            isBorder: false,
            bgColor: 'primary-light',
          },
          title: 'Enhanced Customer Understanding',
          description:
            "Customer journey research allows businesses to gain deeper insights into their customer's behaviors, preferences, and pain points. By understanding the customer's perspective, companies can tailor their offerings.",
          bgColor: 'grey',
          isBorder: false,
          isActive: true,
        },
        {
          iconOptions: {
            icon: LoveCycleIcon,
            isActive: true,
            isBorder: false,
            bgColor: 'primary-light',
          },
          title: 'Increased Loyalty and Retention',
          description:
            'A well-designed customer journey that meets customer needs and expectations can boost customer loyalty. Loyal customers are more likely to make repeat purchases, reducing the need for costly acquisition efforts.',
          bgColor: 'grey',
          isBorder: false,
          isActive: true,
        },
        {
          iconOptions: {
            icon: CustomerSatisfactionIcon,
            isActive: true,
            isBorder: false,
            bgColor: 'primary-light',
          },
          title: 'Improved Customer Satisfaction',
          description:
            'Identifying and addressing pain points in the customer journey can lead to increased customer satisfaction. When customers have positive experiences, they are more likely to become loyal and recommend the brand to others.',
          bgColor: 'grey',
          isBorder: false,
          isActive: true,
        },
        {
          iconOptions: {
            icon: CostReductionIcon,
            isActive: true,
            isBorder: false,
            bgColor: 'primary-light',
          },
          title: 'Cost Reduction',
          description:
            'Eliminating or streamlining unnecessary touch-points and processes can reduce operational costs. Customer journey research helps identify areas where efficiency improvements can be made.',
          bgColor: 'grey',
          isBorder: false,
          isActive: true,
        },
        {
          iconOptions: {
            icon: ChangeAdaptabilityIcon,
            isActive: true,
            isBorder: false,
            bgColor: 'primary-light',
          },
          title: 'Adaptability to Change',
          description:
            'Markets and customer behaviors evolve. Customer journey research allows businesses to stay agile and adapt their strategies as needed to remain relevant and responsive to customer needs.',
          bgColor: 'grey',
          isBorder: false,
          isActive: true,
        },
      ],
    },
    questionarySection: {
      title: 'Customer Journey and Experience Research',
      description:
        'Customer research uncovers how people discover, choose, and stay loyal — spanning journey mapping, path to purchase, persona development, usage & attitude, win/loss insights, pricing strategies, and more.',
      illustration: {
        img: '/images/capabilities_customer_research_2.png',
        size: 'default',
        aspectRatio: 'square',
        objectFit: 'cover',
        loading: 'lazy',
      },
      questionnaires: [
        {
          title: 'Customer Journey Research',
          description: 'Message testing<br>Usability studies',
        },
        {
          title: 'Customer Loyalty Research',
          description:
            'Customer Satisfaction Score (CSAT) Studies<br>Net Promoter Score (NPS) Studies',
        },
        {
          title: 'Win Loss Research',
          description:
            'Bundling and conjoint studies<br>Selection criteria studies',
        },
        {
          title: 'Persona Research',
          description:
            'Market segmentation<br>Persona development and segmentation<br>Customer pain point assessments',
        },
        {
          title: 'Customer path to purchase',
          description: 'Migration path tests',
        },
        {
          title: 'Usage and attitude research',
          description: 'Marketing funnel studies<br>Brand tracker',
        },
        {
          title: 'Pricing research',
          description:
            'Test customer sensitivity to various prices<br>Van Westendrop analysis<br>Gabor-Granger analysis',
        },
      ],
    },
    featureSection: {
      title: 'Pillar of Deep Customer<br>Understanding',
      items: [
        {
          title: 'Behavioral Drivers',
          description:
            'Decode what motivates customer actions across touch-points.',
          isBorder: true,
        },
        {
          title: 'Emotional Triggers',
          description:
            'Uncover emotional cues that influence loyalty and preference.',
          isBorder: true,
        },
        {
          title: 'Needs-Based Segmentation',
          description:
            'Group customers by actual needs rather than just demographics.',
          isBorder: true,
        },
        {
          title: 'Value Perception',
          description:
            "Understand how customers perceive value—and what they'll pay for it.",
          isBorder: true,
        },
        {
          title: 'Pain Points Mapping',
          description:
            'Identify friction in the customer journey that impacts satisfaction.',
          isBorder: true,
        },
        {
          title: 'Decision-Making Journey',
          description:
            'Chart paths from awareness to purchase to post-sale behavior.',
          isBorder: true,
        },
        {
          title: 'Loyalty Levers',
          description:
            'Explore factors that turn one-time buyers into repeat advocates.',
          isBorder: true,
        },
        {
          title: 'Persona Precision',
          description:
            'Build data-driven personas that evolve with customer expectations.',
          isBorder: true,
        },
      ],
    },
    b2bServiceSection: {
      mainTitle:
        "We're a full-service B2B market research thought partner committed to strengthening your strategies with deep, subject matter expertise.",
      services: [
        {
          title: 'Customer Journey Research',
          description:
            'Customer journey research insights help you understand each member of your buyer teams at a granular level. Create delightful customer experiences and customer centric products and services. With the right data, your product development and marketing strategies practically write themselves.',
          backgroundColor: 'green',
          link: '/resources/the-customer-journey-research-process',
        },
        {
          className: 'absolute -bottom-5 right-20 w-[20rem] h-full',
          title: 'Customer Loyalty Research',
          description:
            'Find out how your customers really feel about your brand and products or services with Thought Metrix customer loyalty research. These insights help you make strategic decisions that promote customer satisfaction, retention, loyalty and advocacy – and boost your bottom line.',
          backgroundColor: 'purple',
          illustration: CustomerLoyaltyIllustration,
          link: '/resources/turning-customers-loyal-for-life',
        },
        {
          title: 'Customer Satisfaction Research',
          description:
            'Strengthen your brand and boost client loyalty by using customer satisfaction research insights to continuously improve your customer experience. Quickly identify any downward trend in customer satisfaction and resolve the cause before there’s any churn.',
          backgroundColor: 'gray',
          link: '/resources/the-nuances-of-customer-satisfaction',
        },
        {
          title: 'Persona Research',
          description:
            'You can leverage actionable buyer persona research to understand all the members of each purchase team. With precise characterizations, you can focus your energy, time and budget across your organization with absolute clarity.',
          backgroundColor: 'pink',
          link: '/resources/understanding-your-audience',
        },
        {
          title: 'Pricing Research',
          description:
            'Pricing market research helps you define exactly the right pricing model for your company, with an evidence-based strategy for each product or service. Pricing research helps you set the optimal price point to reflect value, maximize sales potential and sustain business growth—without leaving any money on the table.',
          backgroundColor: 'blue',
          link: '/resources/key-elements-of-pricing-research',
        },
      ],
    },
    actionSection: {
      img: '/images/capabilities_girl_1.png',
      illustration: StackIllustration,
      title: 'Ready for a simpler, more successful research?',
      actionButton: {
        label: "Let's Connect",
        path: ROUTES.CONTACT_US,
      },
    },
  },
} as const;
