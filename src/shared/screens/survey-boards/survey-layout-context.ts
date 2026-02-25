import React from 'react';
import type { SurveyFormLayout } from '@/core/types/survey.type';

interface SurveyLayoutContextValue {
  layout: SurveyFormLayout;
  setLayout: (l: SurveyFormLayout) => void;
}

export const SurveyLayoutContext = React.createContext<SurveyLayoutContextValue>({
  layout: 'paginated',
  setLayout: () => {},
});
