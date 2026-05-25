/* header.constant.ts */
import { ROUTES } from '@/routes/routeConfig';

export interface AuthContext {
  isAuthenticated: boolean;
  isAdminUser: boolean;
  isAdminPage: boolean;
  isSurveyBoardsPage: boolean;
}

export const navigationItems = [
  'Research Methods',
  'Capabilities',
  'Industries',
  'Resources',
];

export interface NavItem {
  label: string;
  path?: string;
}

export interface NavColumn {
  title?: string;
  items: NavItem[];
}

export interface NavSection {
  title: string;
  columns: NavColumn[];
}

export const headerDropdownData: {
  label: string;
  description: string;
  sections: NavSection[];
} = {
  label: 'OVERVIEW',
  description: 'Understand our approach to B2B\nand B2C research.',
  sections: [
    {
      title: 'Research Methods',
      columns: [
        {
          title: 'Quantitative',
          items: [
            { label: 'Quantitative Research', path: ROUTES.RESEARCH_METHODS_QUANTITATIVE_RESEARCH },
            { label: 'Surveys',               path: ROUTES.RESEARCH_METHODS_SURVEYS },
          ],
        },
        {
          title: 'Qualitative',
          items: [
            { label: 'Qualitative Research',      path: ROUTES.RESEARCH_METHODS_QUALITATIVE_RESEARCH },
            { label: 'Focus Group Discussions',   path: ROUTES.RESEARCH_METHODS_FOCUS_GROUP },
            { label: 'Recruitment and Fieldwork', path: ROUTES.RESEARCH_METHODS_FIELDWORK },
          ],
        },
        {
          title: 'Quality',
          items: [
            { label: 'Quality Checks and Data Security', path: ROUTES.RESEARCH_METHODS_QUALITY },
          ],
        },
      ],
    },
    {
      title: 'Capabilities',
      columns: [
        {
          title: 'Brand',
          items: [
            { label: 'Branding and Advertising Communication', path: ROUTES.CAPABILITY_BRANDING_ADVERTISING },
            { label: 'Market Opportunity Research',            path: ROUTES.CAPABILITY_MARKET_OPPORTUNITY },
          ],
        },
        {
          title: 'Product & Customer',
          items: [
            { label: 'Product Research',                    path: ROUTES.CAPABILITY_PRODUCT_RESEARCH },
            { label: 'Customer Research and Segmentation',  path: ROUTES.CAPABILITY_CUSTOMER_RESEARCH },
          ],
        },
      ],
    },
    {
      title: 'Industries',
      columns: [
        {
          title: 'Consumer',
          items: [
            { label: 'FMCG',                   path: ROUTES.INDUSTRY_FMCG },
            { label: 'Retail and Merchandising', path: ROUTES.INDUSTRY_RETAIL },
            { label: 'Automotive',             path: ROUTES.INDUSTRY_AUTOMOTIVE },
          ],
        },
        {
          title: 'Finance & Tech',
          items: [
            { label: 'Financial Services and Institutions', path: ROUTES.INDUSTRY_FINANCE },
            { label: 'Technology',                          path: ROUTES.INDUSTRY_TECHNOLOGY },
          ],
        },
        {
          title: 'People & Health',
          items: [
            { label: 'Advertising and Marketing',    path: ROUTES.INDUSTRY_ADVERTISING },
            { label: 'Human Resources',              path: ROUTES.INDUSTRY_HR },
            { label: 'Healthcare and Life Sciences', path: ROUTES.INDUSTRY_HEALTHCARE },
            { label: 'Media and Internet Publishers',path: ROUTES.INDUSTRY_INTERNET },
            { label: 'Education',                    path: ROUTES.INDUSTRY_EDUCATION },
            { label: 'Investors',                    path: ROUTES.INDUSTRY_INVESTOR },
          ],
        },
      ],
    },
    {
      title: 'Resources',
      columns: [
        {
          title: 'Panel',
          items: [
            { label: 'Our Panel',                  path: ROUTES.OUR_PANEL },
            { label: 'Why join our survey panel?', path: ROUTES.RESPONDENT_LANDING },
          ],
        },
        {
          title: 'Learn',
          items: [
            { label: 'Articles', path: ROUTES.RESOURCES },
          ],
        },
      ],
    },
  ],
};
