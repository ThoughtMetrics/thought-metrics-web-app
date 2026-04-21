export type QuestionChartType =
  /* new smart types */
  | 'donut'
  | 'bar-horizontal'
  | 'bar-vertical'
  | 'diverging-bar'
  | 'grouped-bar'
  | 'stacked-bar'
  | 'histogram'
  | 'rating-stars'
  | 'radar'
  | 'heatmap'
  | 'treemap'
  | 'funnel'
  | 'range-bar'
  | 'top-values'
  /* legacy types (backward compat) */
  | 'pie'
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
