export type QuestionChartType =
  | 'pie'
  | 'bar-horizontal'
  | 'bar-vertical'
  | 'rating-distribution'
  | 'numeric-summary'
  | 'range-summary'
  | 'matrix-grouped'
  | 'max-diff-bar';

export interface QuestionChartData {
  questionId: string;
  questionType: string;
  questionText: string;
  order: number;
  totalAnswered: number;
  totalResponses: number;
  chartType: QuestionChartType;
  data: any;
}
