import { FmcgIcon } from '@/assets';

export const ourPanel = {
  heroSection: {
    title:
      "We don't have to search far for great participants — they find their way to us!",
    description:
      "With our unmatched capabilities, seamless processes, and commitment to quality, we're the ideal fieldwork partner to bring your research to life.",
    illustration: {
      img: '/images/our_panel_2.png',
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
        icon: FmcgIcon,
        label: 'Duplication Checks',
        description:
          'Once someone registers, our in-house software runs a thorough duplication check — scanning email addresses, phone numbers, postcodes, IPs, and usernames. If a match is found, both profiles are unsubscribed, making it nearly impossible to create multiple identities.',
      },
      {
        icon: FmcgIcon,
        label: 'Tele screening',
        description:
          "If no duplication is found, we've got a new member! But before they can join a project, they go through a tele-screening. The Roots team chats with them to verify details and ask about any previous research. Friendly yet thorough, they're experts at spotting participants who are genuine, engaged, and right on brief.",
      },
      {
        icon: FmcgIcon,
        label: 'Attendance Confirmation',
        description:
          "Next comes participation. Once we've identified the right respondents, we follow a strict three-step confirmation process to maximize attendance: an initial email confirmation, a rescreen call 24–48 hours before the research, and a final SMS reminder on the day itself.",
      },
      {
        icon: FmcgIcon,
        label: 'Handling Cancellations',
        description:
          "Of course, there are times—like illness—when participants need to cancel. But we're always quick to minimize any disruption. As soon as we're notified, we move fast to secure a replacement from the backup participants we've already lined up.",
      },
      {
        icon: FmcgIcon,
        label: 'Data Driven Insights',
        description:
          'No matter which research methodologies we use, data is always at the core. Our quality assurance processes and advanced analytics keep us on track every step of the way. By following the data, we refine and improve our approach—delivering high-quality insights that drive real impact.',
      },
    ],
  },
} as const;
