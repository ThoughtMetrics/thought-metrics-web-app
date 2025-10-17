import { ROUTES } from '@/routes/routeConfig';

export const ourPanelConstants = {
  head: 'Our Panel',
  title:
    'Finding Genuine and motivated respondents lies at the heart of achieving actionable insights. Whatever the requirements, we have the flexible, quality-driven recruitment solutions to support you.',
  description:
    'Data quality is the primary goal in everything we do at Thought Metrics. Poor data quality from demotivated and over-researched respondents is an increasing threat to achieving trustworthy insight.<br><br>Our team work with highly valuable partners, full-vetted field workers and cutting-edge tools and AI technologies. Innovating our approach to deliver meaningful insights, whatever your budget or time scale.<br><br>Your dedicated project manager will be with you all the way. Monitoring performance levels and maintaining consistency across the board.',
  actionButton: {
    label: 'Learn More about our Panel',
    path: ROUTES.OUR_PANEL,
  },
  illustration: {
    img: 'images/our_panel_1.png',
    size: 'full',
    aspectRatio: 'auto',
    shadowPosition: 'br',
    shadowOpacity: 'full',
    objectFit: 'cover',
    loading: 'lazy',
  },
};
