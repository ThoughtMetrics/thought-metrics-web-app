import { BoxCluster, DoorPerson, IllustrationSlope, Spiral } from '@/assets';
import { ROUTES } from '@/routes/routeConfig';

export interface ServiceCardData {
  type: number;
  title: string;
  description: string;
  backgroundColor: string;
  illustration: string;
  className1?: string;
  path?: string;
}

export const contentSecondData = {
  mainTitle:
    "We're a full-service B2B market research thought partner committed to strengthening your strategies with deep, subject matter expertise.",
  services: [
    {
      className: 'absolute right-0 bottom-0 w-[70%]',
      title: 'Branding and Advertising Communication',
      description:
        'We help brands resonate. From brand perception and awareness to message testing and ad effectiveness, our research empowers you to communicate with clarity and impact. Backed by qualitative insights and robust tracking, we ensure your brand voice connects with the right audience.',
      backgroundColor: 'green',
      illustration: IllustrationSlope,
      path: ROUTES.CAPABILITY_BRANDING_ADVERTISING,
    },
    {
      className: 'absolute top-1/2 right-0 transform -translate-y-1/2 h-[80%]',
      title: 'Market Opportunity Research',
      description:
        "Find your edge before you enter. Our market opportunity research identifies whitespace, tests feasibility, and maps competitive dynamics. Whether you're planning a launch or exploring new segments, we provide the insights to make bold, informed moves.",
      backgroundColor: 'purple',
      illustration: DoorPerson,
      path: ROUTES.CAPABILITY_MARKET_OPPORTUNITY,
    },
    {
      className: 'absolute top-1/2 right-0 transform -translate-y-1/2 h-[90%]',
      title: 'Customer Research and Segmentation',
      description:
        "Know who you're talking to — and why it matters. We uncover the motivations, behaviors, and needs of your customers, then segment them meaningfully to guide strategy. Our blend of qualitative and quantitative approaches ensures depth, accuracy, and actionable clarity.",
      backgroundColor: 'gray',
      illustration: Spiral,
      path: ROUTES.CAPABILITY_CUSTOMER_RESEARCH,
    },
    {
      className: 'absolute right-16 bottom-8',
      className1: 'absolute right-4 top-4 w-[25%] h-[25%]',
      title: 'Product Research',
      description:
        'Build products that solve real problems. From concept testing and feature prioritization to in-use feedback, we support every phase of product development. Our insights help you align innovation with user expectations — minimizing risk and maximizing relevance.',
      backgroundColor: 'pink',
      illustration: BoxCluster,
      path: ROUTES.CAPABILITY_PRODUCT_RESEARCH,
    },
  ],
};
