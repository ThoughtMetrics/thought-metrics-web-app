import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import type { QuestionChartData } from './survey-analytics.type';

const COLORS = ['#E8505E', '#4F7CFF', '#00C48C', '#FFAB00', '#7B61FF', '#FF6B35', '#00B8D9', '#6B7280'];
const CARDS_PER_PAGE = 4;

interface Props {
  questions: QuestionChartData[];
  isLoading: boolean;
}

/* ─── Normalise any chart-data shape → {name, value}[] for pie ──────────── */
function toPieSlices(q: QuestionChartData): Array<{ name: string; value: number }> {
  switch (q.chartType) {
    case 'pie':
      return (q.data as Array<{ name: string; value: number }>).filter((d) => d.value > 0);

    case 'bar-horizontal':
      return (q.data as Array<{ name: string; count: number }>)
        .filter((d) => d.count > 0)
        .map((d) => ({ name: d.name, value: d.count }));

    case 'bar-vertical':
      return (q.data as Array<{ name: string; count: number }>)
        .filter((d) => d.count > 0)
        .map((d) => ({ name: String(d.name), value: d.count }));

    case 'rating-distribution':
      return (q.data.distribution as Array<{ rating: number; count: number }>)
        .filter((d) => d.count > 0)
        .map((d) => ({ name: `${d.rating} star${d.rating !== 1 ? 's' : ''}`, value: d.count }));

    case 'numeric-summary':
      return (q.data.histogram as Array<{ range: string; count: number }>)
        .filter((d) => d.count > 0)
        .map((d) => ({ name: d.range, value: d.count }));

    case 'range-summary':
      return [
        { name: 'Avg Min', value: q.data.avgMin },
        { name: 'Avg Max', value: q.data.avgMax },
      ].filter((d) => d.value > 0);

    case 'matrix-grouped': {
      const totals: Record<string, number> = {};
      for (const col of q.data.columns as Array<{ value: string; label: string }>) {
        totals[col.label] = 0;
        for (const row of q.data.rows as Array<{ id: string }>) {
          totals[col.label] += (q.data.counts[row.id]?.[col.value] || 0);
        }
      }
      return Object.entries(totals)
        .filter(([, v]) => v > 0)
        .map(([name, value]) => ({ name, value }));
    }

    case 'max-diff-bar':
      return (q.data as Array<{ name: string; best: number; worst: number }>)
        .filter((d) => d.best > 0)
        .map((d) => ({ name: d.name, value: d.best }));

    default:
      return [];
  }
}

/* ─── Extra badge above chart for certain types ──────────────────────────── */
function TopBadge({ q }: { q: QuestionChartData }) {
  if (q.chartType === 'rating-distribution' && q.data?.average != null) {
    return (
      <div className="flex items-baseline gap-1 mb-1 px-1">
        <span className="text-xl font-bold text-primary">{q.data.average}</span>
        <span className="text-[10px] text-gray-400">/ {q.data.maxRating} avg</span>
      </div>
    );
  }
  if (q.chartType === 'numeric-summary') {
    const { min, max, avg, isCurrency } = q.data;
    const fmt = (n: number) => (isCurrency ? `₹${n.toLocaleString()}` : String(n));
    return (
      <div className="grid grid-cols-3 gap-1 mb-1 px-1">
        {([['Min', min], ['Avg', avg], ['Max', max]] as const).map(([label, val]) => (
          <div key={label} className="bg-gray-50 rounded-md py-1 text-center">
            <p className="text-[8px] text-gray-400">{label}</p>
            <p className="text-[10px] font-semibold text-gray-800 truncate">{fmt(val as number)}</p>
          </div>
        ))}
      </div>
    );
  }
  if (q.chartType === 'max-diff-bar') {
    return (
      <p className="text-[9px] text-gray-400 mb-1 px-1">Showing "best" selections</p>
    );
  }
  return null;
}

/* ─── Unified pie card ───────────────────────────────────────────────────── */
const UniversalPie: React.FC<{ q: QuestionChartData }> = ({ q }) => {
  const slices = toPieSlices(q);
  const total = slices.reduce((s, d) => s + d.value, 0);

  if (slices.length === 0) {
    return <p className="text-[10px] text-gray-400 text-center py-6">No data yet</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      <TopBadge q={q} />

      {/* Donut — no inline labels, clean padding */}
      <ResponsiveContainer width="100%" height={160}>
        <PieChart margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
          <Pie
            data={slices}
            cx="50%"
            cy="50%"
            innerRadius={48}
            outerRadius={72}
            dataKey="value"
            paddingAngle={slices.length > 1 ? 2 : 0}
            strokeWidth={0}
          >
            {slices.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: any, name: any) => [
              `${value} (${total > 0 ? Math.round((value / total) * 100) : 0}%)`,
              name,
            ]}
            contentStyle={{ fontSize: 11, padding: '4px 8px', borderRadius: 6, border: '1px solid #e5e7eb' }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Scrollable legend */}
      <div className="overflow-y-auto px-2 pb-1" style={{ maxHeight: 90 }}>
        <div className="flex flex-col gap-1">
          {slices.map((d, i) => {
            const pct = total > 0 ? Math.round((d.value / total) * 100) : 0;
            return (
              <div key={i} className="flex items-center gap-1.5 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                />
                <span className="text-[10px] text-gray-600 truncate flex-1" title={d.name}>
                  {d.name}
                </span>
                <span className="text-[10px] font-semibold text-gray-800 flex-shrink-0 ml-auto">
                  {pct}%
                </span>
                <span className="text-[9px] text-gray-400 flex-shrink-0 w-8 text-right">
                  ({d.value})
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* ─── Card shell ─────────────────────────────────────────────────────────── */
const ChartCard: React.FC<{ q: QuestionChartData }> = ({ q }) => (
  <div className="flex flex-col border border-gray-200 rounded-xl bg-white overflow-hidden">
    <div className="px-3 pt-3 pb-2 border-b border-gray-100">
      <p
        className="text-[11px] font-semibold text-gray-800 leading-snug line-clamp-2 mb-1.5"
        title={q.questionText}
      >
        {q.questionText}
      </p>
      <span className="inline-block text-[9px] font-medium text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">
        {q.totalAnswered}/{q.totalResponses} answered
      </span>
    </div>
    <div className="p-2 flex-1">
      {q.totalAnswered === 0 ? (
        <p className="text-[10px] text-gray-400 text-center py-6">No data yet</p>
      ) : (
        <UniversalPie q={q} />
      )}
    </div>
  </div>
);

/* ─── Main — 2×2 paginated slider ────────────────────────────────────────── */
const SurveyQuestionCharts: React.FC<Props> = ({ questions, isLoading }) => {
  const [page, setPage] = useState(0);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-64 animate-pulse bg-gray-50 rounded-xl border border-gray-200" />
        ))}
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center border border-gray-200 rounded-xl bg-gray-50">
        <svg className="w-8 h-8 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <p className="text-xs font-medium text-gray-500">No chartable questions</p>
        <p className="text-[10px] text-gray-400 mt-0.5">Text, file, and open-ended questions are not visualised</p>
      </div>
    );
  }

  const totalPages = Math.ceil(questions.length / CARDS_PER_PAGE);
  const visible = questions.slice(page * CARDS_PER_PAGE, (page + 1) * CARDS_PER_PAGE);
  const padded = [...visible, ...Array(CARDS_PER_PAGE - visible.length).fill(null)];

  return (
    <div className="space-y-3">
      {/* Header + navigation */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-gray-700">
          Response Analysis
          <span className="ml-2 text-gray-400 font-normal">
            {page * CARDS_PER_PAGE + 1}–{Math.min((page + 1) * CARDS_PER_PAGE, questions.length)} of {questions.length}
          </span>
        </p>
        <div className="flex items-center gap-1.5">
          <div className="flex gap-1 mr-1">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`rounded-full transition-all ${
                  i === page ? 'w-4 h-2 bg-primary' : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* 2×2 grid */}
      <div className="grid grid-cols-2 gap-3">
        {padded.map((q, i) =>
          q ? (
            <ChartCard key={q.questionId} q={q} />
          ) : (
            <div key={`pad-${i}`} className="rounded-xl border border-dashed border-gray-200 bg-gray-50/50" />
          )
        )}
      </div>
    </div>
  );
};

export default SurveyQuestionCharts;
