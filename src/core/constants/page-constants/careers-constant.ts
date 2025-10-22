import careers_1 from 'images/careers_1.png';
export const careers = {
  heroSection: {
    head: 'Careers',
    description:
      'Have a zeal to contribute to the real world and create a visible impact in businesses and lives of consumers? We are transforming businesses and consumer experience everyday using technology.',
    illustration: {
      img: careers_1.src,
      size: 'default',
      aspectRatio: 'landscape',
      shadowPosition: 'br',
      shadowOpacity: 'full',
      objectFit: 'cover',
      loading: 'lazy',
    },
  },
  aboutUsSection: {
    head: 'Why join us?',
    items: [
      {
        label: 'Fast Growing Company',
        description:
          'We are at an inflection point to achieve accelerated growth.',
      },
      {
        label: 'Great Colleagues',
        description: 'Closely tied and supportive team who understands you.',
      },
      {
        label: 'Take Charge',
        description: 'As much as you are willing to take and show excellence.',
      },
      {
        label: 'Continuous learning',
        description: 'A company where learning is always on the to-do list.',
      },
      {
        label: 'Latest Technology Stack',
        description: 'Working experience of cutting edge AI technologies.',
      },
      {
        label: 'Cross Domain Exposure',
        description:
          'Highly passionate and cohesive team of technology and business people.',
      },
    ],
  },
  feedbackSection: {
    head: 'We want to hear from you!',
    description:
      'What are you good at and why do you want to work with us. Send us the details along with your resume.',
    email: 'careers@thoughtmetrics.com',
  },
} as const;
