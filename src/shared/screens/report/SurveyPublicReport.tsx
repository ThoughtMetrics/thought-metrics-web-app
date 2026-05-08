import React, { useEffect, useState, lazy, Suspense } from 'react';
import { getAPIConfig } from '@/core/configs/api-config';
import type { QuestionChartData } from '@/shared/screens/admin/survey-analytics.type';

const SurveyQuestionCharts = lazy(() => import('@/shared/screens/admin/SurveyQuestionCharts'));

interface PublicReportData {
  surveyId: string;
  label: string;
  totalSubmissions: number;
  dailyStats: { date: string; count: number }[];
  questionCharts: QuestionChartData[];
}

interface Props {
  surveyId: string;
}

const SurveyPublicReport: React.FC<Props> = ({ surveyId }) => {
  const [data, setData] = useState<PublicReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cfg = getAPIConfig();
    const url = `${cfg.baseURL}${cfg.apiPath}/${cfg.baseAPIVersion}/surveys/report/${surveyId}`;

    fetch(url, { headers: { 'Content-Type': 'application/json' } })
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.message || 'Failed to load report');
        }
        setData(json.data);
      })
      .catch((err) => setError(err.message ?? 'Failed to load report'))
      .finally(() => setIsLoading(false));
  }, [surveyId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-sm">Loading report…</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 font-medium mb-2">Could not load report</p>
          <p className="text-gray-500 text-sm">{error ?? 'Survey not found'}</p>
        </div>
      </div>
    );
  }

  const maxDaily = Math.max(...data.dailyStats.map((d) => d.count), 1);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Survey Report</p>
          <h1 className="text-3xl font-bold text-gray-900">{data.label || data.surveyId}</h1>
        </div>

        {/* Total submissions stat */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 inline-block">
          <div className="text-4xl font-bold text-primary">{data.totalSubmissions.toLocaleString()}</div>
          <div className="text-sm text-gray-500 mt-1">Total Responses</div>
        </div>

        {/* Daily trend */}
        {data.dailyStats.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h2 className="text-base font-semibold text-gray-800 mb-4">Daily Responses (last 30 days)</h2>
            <div className="flex items-end gap-1 h-32">
              {data.dailyStats.map((d) => (
                <div key={d.date} className="flex flex-col items-center flex-1 min-w-0 group relative">
                  <div
                    className="w-full bg-primary/80 rounded-t hover:bg-primary transition-colors"
                    style={{ height: `${(d.count / maxDaily) * 100}%`, minHeight: d.count > 0 ? '4px' : '0' }}
                  />
                  <span className="absolute -top-6 text-xs text-gray-600 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    {d.count}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>{data.dailyStats[0]?.date}</span>
              <span>{data.dailyStats[data.dailyStats.length - 1]?.date}</span>
            </div>
          </div>
        )}

        {/* Question charts */}
        {data.questionCharts.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-base font-semibold text-gray-800 mb-4">Question Breakdown</h2>
            <Suspense fallback={<p className="text-sm text-gray-400 text-center py-8">Loading charts…</p>}>
              <SurveyQuestionCharts questions={data.questionCharts} isLoading={false} />
            </Suspense>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-8">
          Powered by <a href="/" className="hover:underline text-gray-500">Thought Metrics</a>
        </p>
      </div>
    </div>
  );
};

export default SurveyPublicReport;
