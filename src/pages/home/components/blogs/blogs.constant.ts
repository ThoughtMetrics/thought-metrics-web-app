export interface BlogCardData {
  id: string;
  src: string;
  alt: string;
  type: string;
  label: string;
  description: string;
  link: string;
}

export const blogPageData = {
  title: 'Fresh Ideas to Help You Reach New Heights.',
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
      label: 'Beyond Speed: The Strategic Value of AI in Qualitative Research',
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
  ] as BlogCardData[],
};
