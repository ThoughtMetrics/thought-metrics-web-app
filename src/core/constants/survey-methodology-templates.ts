// src/core/constants/survey-methodology-templates.ts
// Pre-built starter question sets for each survey methodology.
// IDs are generated at call time so multiple templates never share IDs.

import { QuestionType, SurveyMethodology } from '@/core/types/survey.type';
import type { IBuilderQuestion } from '@/core/types/survey-builder.type';

function uid(): string {
  return `q${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

function mkDisplay(order: number, text: string): IBuilderQuestion {
  return {
    id: uid(),
    order,
    questionType: QuestionType.TEXT_DISPLAY,
    text,
    translations: { en: { text }, ta: { text: '' } },
    config: { displayHtml: text, displayImageUrl: '', displayImageMaxWidth: '100%' },
    required: false,
    allowComment: false,
  };
}

function mkNumber(order: number, text: string): IBuilderQuestion {
  return {
    id: uid(),
    order,
    questionType: QuestionType.NUMBER,
    text,
    translations: { en: { text }, ta: { text: '' } },
    config: { currency: '₹' },
    required: true,
    allowComment: false,
  };
}

function mkMcqSingle(order: number, text: string, opts: string[]): IBuilderQuestion {
  const options = opts.map((label, i) => ({ value: `opt${i + 1}`, label }));
  return {
    id: uid(),
    order,
    questionType: QuestionType.MCQ_SINGLE,
    text,
    translations: { en: { text, options }, ta: { text: '', options: options.map(o => ({ ...o, label: '' })) } },
    config: { options },
    required: true,
    allowComment: false,
  };
}

function mkMcqMultiple(order: number, text: string, opts: string[]): IBuilderQuestion {
  const options = opts.map((label, i) => ({ value: `opt${i + 1}`, label }));
  return {
    id: uid(),
    order,
    questionType: QuestionType.MCQ_MULTIPLE,
    text,
    translations: { en: { text, options }, ta: { text: '', options: options.map(o => ({ ...o, label: '' })) } },
    config: { options },
    required: true,
    allowComment: false,
  };
}

function mkRating(order: number, text: string, max = 5): IBuilderQuestion {
  return {
    id: uid(),
    order,
    questionType: QuestionType.RATING,
    text,
    translations: { en: { text }, ta: { text: '' } },
    config: { ratingMax: max },
    required: true,
    allowComment: false,
  };
}

function mkText(order: number, text: string): IBuilderQuestion {
  return {
    id: uid(),
    order,
    questionType: QuestionType.TEXT,
    text,
    translations: { en: { text }, ta: { text: '' } },
    config: {},
    required: false,
    allowComment: false,
  };
}

function mkLikert(order: number, text: string): IBuilderQuestion {
  return {
    id: uid(),
    order,
    questionType: QuestionType.LIKERT_SCALE,
    text,
    translations: { en: { text }, ta: { text: '' } },
    config: { min: 1, max: 5, minLabel: 'Strongly Disagree', maxLabel: 'Strongly Agree' },
    required: true,
    allowComment: false,
  };
}

function mkRanking(order: number, text: string, opts: string[]): IBuilderQuestion {
  const options = opts.map((label, i) => ({ value: `opt${i + 1}`, label }));
  return {
    id: uid(),
    order,
    questionType: QuestionType.RANKING,
    text,
    translations: { en: { text, options }, ta: { text: '', options: options.map(o => ({ ...o, label: '' })) } },
    config: { options, rankingFormat: 'drag-vertical' },
    required: true,
    allowComment: false,
  };
}

function mkMatrix(order: number, text: string, rows: string[], cols: string[]): IBuilderQuestion {
  const rowItems = rows.map((label, i) => ({ value: `r${i + 1}`, label }));
  const colItems = cols.map((label, i) => ({ value: `c${i + 1}`, label }));
  return {
    id: uid(),
    order,
    questionType: QuestionType.MATRIX,
    text,
    translations: { en: { text }, ta: { text: '' } },
    config: { rows: rowItems, columns: colItems, matrixSubType: 'single-select' },
    required: true,
    allowComment: false,
  };
}

function mkMaxDiff(order: number, text: string, items: string[], itemsPerSet = 4): IBuilderQuestion {
  const options = items.map((label, i) => ({ value: `item${i + 1}`, label }));
  return {
    id: uid(),
    order,
    questionType: QuestionType.MAX_DIFF,
    text,
    translations: { en: { text, options }, ta: { text: '', options: options.map(o => ({ ...o, label: '' })) } },
    config: { options, rowOptionsMode: 'shared', itemCount: itemsPerSet },
    required: true,
    allowComment: false,
  };
}

function mkGaborGranger(
  order: number,
  mainQuestion: string,
  productDesc: string,
  prices: number[],
  currency = '₹',
): IBuilderQuestion {
  const options = prices.map((p) => ({ value: `price_${p}`, label: String(p) }));
  return {
    id: uid(),
    order,
    questionType: QuestionType.GABOR_GRANGER,
    text: mainQuestion,
    translations: { en: { text: mainQuestion, placeholder: productDesc, options }, ta: { text: '', placeholder: '', options: options.map((o) => ({ ...o })) } },
    config: {
      gaborProductDescription: productDesc,
      gaborQualifyingQuestion: 'Please consider the following product. Would you consider buying it?',
      gaborCurrency: currency,
      gaborMinPrice: Math.min(...prices),
      gaborMaxPrice: Math.max(...prices),
      gaborPriceStep: prices.length > 1 ? prices[1] - prices[0] : 100,
      gaborPresentationMode: 'sequential' as const,
      gaborShowQualifying: true,
      options,
    },
    required: true,
    allowComment: false,
  };
}

function mkVanWestendorp(
  order: number,
  mainQuestion: string,
  productDesc: string,
  currency = '₹',
): IBuilderQuestion {
  return {
    id: uid(),
    order,
    questionType: QuestionType.VAN_WESTENDORP,
    text: mainQuestion,
    translations: { en: { text: mainQuestion }, ta: { text: '' } },
    config: {
      vwProductDescription: productDesc,
      vwQualifyingQuestion: 'Please consider the following product. Would you consider buying it?',
      vwShowQualifying: true,
      vwCurrency: currency,
      vwMinPrice: 50,
      vwMaxPrice: 10000,
      vwPresentationMode: 'sequential' as const,
      vwShowNMS: false,
      vwQ1Text: "At what price would this product feel so cheap that you'd question the quality?",
      vwQ2Text: "At what price would this product feel like a bargain — a great buy for the money?",
      vwQ3Text: "At what price would this product start to feel expensive, but you'd still consider buying?",
      vwQ4Text: "At what price would this product be so expensive you would not consider buying it?",
      vwNMSGoodValueQuestion: "On a scale of 1–5, how likely are you to buy this product at [GoodValue]?",
      vwNMSExpensiveQuestion: "On a scale of 1–5, how likely are you to buy this product at [Expensive]?",
    },
    required: true,
    allowComment: false,
  };
}

// ── Kano MCQ options ──────────────────────────────────────────────────────────
const KANO_OPTIONS = ['I would be delighted', 'I would expect it', 'I am neutral', 'I can live with it', 'I would dislike it'];

// ── Starter templates map ─────────────────────────────────────────────────────

type StarterBuilder = () => IBuilderQuestion[];

const STARTERS: Partial<Record<SurveyMethodology, StarterBuilder>> = {

  [SurveyMethodology.MAX_DIFF]: () => [
    mkDisplay(1,
      '<p><strong>About this survey</strong></p>' +
      '<p>In each question you will see a list of items. Please select the one that is <strong>MOST important</strong> to you and the one that is <strong>LEAST important</strong> to you.</p>' +
      '<p>There are no right or wrong answers — we just want your honest opinion.</p>',
    ),
    mkMcqSingle(2, 'How familiar are you with [product / category]?',
      ['Very familiar', 'Somewhat familiar', 'Not very familiar', 'Not familiar at all'],
    ),
    mkMaxDiff(3,
      'From the items shown below, which is MOST important and which is LEAST important to you?',
      [
        'Fast delivery',
        'Low price',
        'Easy returns',
        'Wide product range',
        'Trustworthy reviews',
        'Loyalty rewards',
        'Same-day support',
        'Eco-friendly packaging',
      ],
      4,
    ),
    mkText(4, 'Is there anything else you would like to share about what matters most to you?'),
  ],

  [SurveyMethodology.A_B_TEST]: () => [
    mkDisplay(1, 'Variant A — [Replace with your first concept description]'),
    mkRating(2, 'How would you rate Variant A overall?'),
    mkDisplay(3, 'Variant B — [Replace with your second concept description]'),
    mkRating(4, 'How would you rate Variant B overall?'),
    mkMcqSingle(5, 'Which variant do you prefer?', ['Variant A', 'Variant B', 'No preference']),
    mkText(6, 'What is the main reason for your preference?'),
  ],

  [SurveyMethodology.VAN_WESTENDORP]: () => [
    mkDisplay(1,
      '<p><strong>Price Perception Study</strong></p>' +
      '<p>We want to understand how you perceive the pricing of a product. ' +
      'Please answer all questions honestly based on your own willingness to pay.</p>',
    ),
    mkMcqSingle(2, 'How often do you purchase products in this category?',
      ['Every week', 'A few times a month', 'Once a month', 'A few times a year', 'Rarely or never'],
    ),
    mkVanWestendorp(3,
      'Based on your experience, please share your price perceptions for [Product].',
      'Sleek wireless earbuds with 30-hour battery life, active noise cancellation, and IPX5 water resistance. Compatible with all Bluetooth devices.',
    ),
    mkText(4, 'Is there anything else you would like to share about the pricing of this type of product?'),
  ],

  [SurveyMethodology.GABOR_GRANGER]: () => [
    mkDisplay(1,
      '<p><strong>Price Sensitivity Study</strong></p>' +
      '<p>You will be shown a product at different price points. Please answer honestly based on your own willingness to purchase.</p>',
    ),
    mkMcqSingle(2, 'Which of the following best describes your shopping frequency for this category?',
      ['Every week', 'A few times a month', 'Once a month', 'A few times a year', 'Rarely or never'],
    ),
    mkGaborGranger(3, 'Would you buy this product at the price of [Price]?',
      'Sleek wireless earbuds with 30-hour battery life, active noise cancellation, and IPX5 water resistance. Compatible with all Bluetooth devices.',
      [200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100],
    ),
    mkText(4, 'Is there anything else you would like to share about this product or its pricing?'),
  ],

  [SurveyMethodology.BRAND_PRICE_TRADEOFF]: () => [
    mkDisplay(1, 'In the following questions you will be shown different brands at different price points. Please choose the option you would most likely purchase.'),
    mkMcqSingle(2, 'If all brands below were priced at ₹199, which would you choose?',
      ['Brand A', 'Brand B', 'Brand C', 'Brand D', 'None of these'],
    ),
    mkMcqSingle(3, 'If Brand A was priced 20% higher than Brand B, which would you choose?',
      ['Brand A (premium)', 'Brand B (lower price)', 'Neither'],
    ),
    mkLikert(4, 'I am willing to pay a premium for a brand I trust.'),
    mkText(5, 'What factors most influence your brand choice?'),
  ],

  [SurveyMethodology.KANO_MODEL]: () => [
    mkDisplay(1, 'For each feature below, we will ask two questions: how you feel if the feature IS available, and how you feel if it is NOT available.'),
    mkMcqSingle(2, 'Feature 1: [Replace with feature name]\n\nHow would you feel if this feature WAS available?', KANO_OPTIONS),
    mkMcqSingle(3, 'Feature 1: [Replace with feature name]\n\nHow would you feel if this feature was NOT available?', KANO_OPTIONS),
    mkMcqSingle(4, 'Feature 2: [Replace with feature name]\n\nHow would you feel if this feature WAS available?', KANO_OPTIONS),
    mkMcqSingle(5, 'Feature 2: [Replace with feature name]\n\nHow would you feel if this feature was NOT available?', KANO_OPTIONS),
    mkText(6, 'Which feature matters most to you, and why?'),
  ],

  [SurveyMethodology.TURF]: () => [
    mkDisplay(1, 'We are exploring which combination of offerings would reach the most customers. Please select all options that apply to you.'),
    mkMcqMultiple(2, 'Which of the following products / features would you use or buy? (Select all that apply)',
      ['Option A', 'Option B', 'Option C', 'Option D', 'Option E', 'None of the above'],
    ),
    mkMcqMultiple(3, 'Which combination of options would best meet your needs? (Select up to 3)',
      ['Option A + B', 'Option B + C', 'Option A + C', 'Option A + B + C', 'None of these'],
    ),
    mkText(4, 'What additional options would you like to see?'),
  ],

  [SurveyMethodology.CLAIMS_TEST]: () => [
    mkDisplay(1, 'Please read the following product claim carefully.'),
    mkDisplay(2, '"[Replace with your product claim here]"'),
    mkRating(3, 'How believable is this claim?'),
    mkMcqSingle(4, 'After reading this claim, how does your perception of the product change?',
      ['Much more positive', 'Somewhat more positive', 'No change', 'Somewhat more negative', 'Much more negative'],
    ),
    mkMcqSingle(5, 'How relevant is this claim to your needs?',
      ['Very relevant', 'Somewhat relevant', 'Not very relevant', 'Not at all relevant'],
    ),
    mkText(6, 'What is your initial reaction to this claim?'),
  ],

  [SurveyMethodology.MONADIC_TEST]: () => [
    mkDisplay(1, 'Please read the concept description below and answer the questions that follow.\n\n[Replace with your concept description]'),
    mkRating(2, 'Overall, how would you rate this concept?'),
    mkMcqSingle(3, 'How likely are you to purchase this product?',
      ['Definitely would buy', 'Probably would buy', 'Might or might not buy', 'Probably would not buy', 'Definitely would not buy'],
    ),
    mkMcqSingle(4, 'How unique is this concept compared to what is currently available?',
      ['Very unique', 'Somewhat unique', 'Neither unique nor typical', 'Somewhat typical', 'Very typical'],
    ),
    mkText(5, 'What do you like most about this concept?'),
    mkText(6, 'What would you change or improve?'),
  ],

  [SurveyMethodology.PRODUCT_CONCEPT]: () => [
    mkDisplay(1, 'Product Concept\n\n[Replace with your product description — name, key features, and benefits]'),
    mkRating(2, 'How would you rate this product concept overall?'),
    mkMcqSingle(3, 'How likely are you to purchase this product?',
      ['Definitely would buy', 'Probably would buy', 'Might or might not buy', 'Probably would not buy', 'Definitely would not buy'],
    ),
    mkLikert(4, 'This product solves a real problem I have.'),
    mkLikert(5, 'This product offers good value for money.'),
    mkText(6, 'What appeals most to you about this concept?'),
    mkText(7, 'What concerns do you have?'),
  ],

  [SurveyMethodology.PRICED_CONCEPT]: () => [
    mkDisplay(1, 'Product: [Replace with product name and description]\n\nPrice: [Replace with price]'),
    mkMcqSingle(2, 'At this price, would you buy this product?',
      ['Definitely would buy', 'Probably would buy', 'Might or might not buy', 'Probably would not buy', 'Definitely would not buy'],
    ),
    mkLikert(3, 'The price seems fair for the value offered.'),
    mkMcqSingle(4, 'Compared to similar products, this price is:',
      ['Much lower than expected', 'Slightly lower than expected', 'About right', 'Slightly higher than expected', 'Much higher than expected'],
    ),
    mkText(5, 'What are your thoughts on the price-value relationship?'),
  ],

  [SurveyMethodology.IDEA_SCREENER]: () => [
    mkDisplay(1, 'Idea: [Replace with a brief description of your idea — problem it solves, how it works, who it is for]'),
    mkMcqSingle(2, 'How interested are you in this idea?',
      ['Very interested', 'Somewhat interested', 'Neutral', 'Not very interested', 'Not at all interested'],
    ),
    mkMcqSingle(3, 'How unique is this idea compared to existing solutions?',
      ['Very unique', 'Somewhat unique', 'Slightly unique', 'Not unique at all'],
    ),
    mkMcqSingle(4, 'Does this idea solve a real problem you face?',
      ['Yes, a significant problem', 'Yes, a minor problem', 'Not really', 'No'],
    ),
    mkMcqSingle(5, 'How likely are you to use or buy this if it were available?',
      ['Definitely would use / buy', 'Probably would', 'Might or might not', 'Probably would not', 'Definitely would not'],
    ),
    mkText(6, 'What would make this idea better?'),
  ],

  [SurveyMethodology.BRAND_NAME_TEST]: () => [
    mkDisplay(1, 'We are testing brand name options for [product category]. Please evaluate the names below.'),
    mkMcqSingle(2, 'Which brand name do you prefer for this product?',
      ['Brand Name A', 'Brand Name B', 'Brand Name C', 'Brand Name D'],
    ),
    mkMcqSingle(3, 'Which name best communicates quality?',
      ['Brand Name A', 'Brand Name B', 'Brand Name C', 'Brand Name D'],
    ),
    mkMcqSingle(4, 'Which name is the easiest to remember?',
      ['Brand Name A', 'Brand Name B', 'Brand Name C', 'Brand Name D'],
    ),
    mkRanking(5, 'Rank these brand names from most preferred (1) to least preferred.',
      ['Brand Name A', 'Brand Name B', 'Brand Name C', 'Brand Name D'],
    ),
    mkText(6, 'Why did you rank your top choice first?'),
  ],

  [SurveyMethodology.AD_COPY_TEST]: () => [
    mkDisplay(1, 'Please read the following advertisement carefully.\n\n---\n[Replace with your ad copy here]\n---'),
    mkRating(2, 'How compelling is this advertisement?'),
    mkMcqSingle(3, 'What is the main message of this advertisement?',
      ['Quality / Premium', 'Value / Affordability', 'Innovation / Newness', 'Trust / Reliability', 'Something else'],
    ),
    mkMcqSingle(4, 'After reading this ad, how likely are you to find out more about the product?',
      ['Very likely', 'Somewhat likely', 'Neutral', 'Unlikely', 'Very unlikely'],
    ),
    mkLikert(5, 'This ad is relevant to me.'),
    mkText(6, 'What do you like about this ad?'),
    mkText(7, 'What would you change?'),
  ],

  [SurveyMethodology.BRAND_TRACKER]: () => [
    mkDisplay(1, 'This is a brand tracking survey. Your responses help us understand how perceptions of [Brand] change over time.'),
    mkMcqMultiple(2, 'Which of the following brands have you heard of? (Select all that apply)',
      ['Brand A', 'Brand B', 'Brand C', 'Brand D', 'Brand E'],
    ),
    mkMcqMultiple(3, 'Which of these brands have you purchased or used in the last 3 months?',
      ['Brand A', 'Brand B', 'Brand C', 'Brand D', 'Brand E'],
    ),
    mkRating(4, 'How would you rate your overall impression of [Brand]?'),
    mkMcqSingle(5, 'How likely are you to recommend [Brand] to a friend or colleague?',
      ['Definitely would recommend', 'Probably would', 'Neutral', 'Probably would not', 'Definitely would not'],
    ),
    mkLikert(6, '[Brand] is a brand I trust.'),
    mkLikert(7, '[Brand] offers good value for money.'),
    mkText(8, 'What one word or phrase best describes [Brand]?'),
  ],
};

export function getStarterQuestions(methodology: SurveyMethodology): IBuilderQuestion[] {
  const builder = STARTERS[methodology];
  return builder ? builder() : [];
}
