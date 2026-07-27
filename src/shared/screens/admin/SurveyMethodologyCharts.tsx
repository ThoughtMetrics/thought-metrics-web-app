import React from 'react';
import {
  ScatterChart, Scatter, Cell, XAxis, YAxis, CartesianGrid, ReferenceLine, ReferenceDot,
  Tooltip, ResponsiveContainer, LineChart, Line,
} from 'recharts';
import type { QuestionChartData } from './survey-analytics.type';

/* ═══════════════════════════════════════════════════════════════════
   Renderers for the 4 methodology question types (Kano Model,
   Gabor-Granger, Van Westendorp PSM, Smart Follow-Up). Split out from
   SurveyQuestionCharts.tsx to keep that file's dispatch table focused,
   and because these 4 need Recharts imports (LineChart, Scatter,
   ReferenceDot) not used by any other renderer in this app.
═══════════════════════════════════════════════════════════════════ */

const COLORS = ['#E8505E', '#4F7CFF', '#00C48C', '#FFAB00', '#7B61FF', '#FF6B35', '#00B8D9', '#6B7280'];
const TIP = { fontSize: 11, padding: '4px 8px', borderRadius: 6, border: '1px solid #e5e7eb', background: '#fff' };

const NoData = () => (
  <div className="flex items-center justify-center h-full">
    <p className="text-[10px] text-gray-300">No data yet</p>
  </div>
);

const cut = (s: string, n = 18) => (s?.length > n ? s.slice(0, n - 1) + '…' : (s ?? ''));
const fmtN = (v: any) => (typeof v === 'number' ? v.toLocaleString() : v);

/* ═══════════════════════════════════════════════════════════════════
   1. Kano Model — quadrant scatter + per-feature classification table
═══════════════════════════════════════════════════════════════════ */

const KANO_CATEGORY_COLOR: Record<string, string> = {
  Attractive: '#00C48C',
  'One-dimensional': '#4F7CFF',
  'Must-be': '#E8505E',
  Indifferent: '#9ca3af',
  Reverse: '#FFAB00',
  Questionable: '#7B61FF',
};

interface KanoFeature {
  name: string;
  category: string;
  avgFunctional: number;
  avgDysfunctional: number;
  counts: Record<string, number>;
  better: number;
  worse: number;
}

const KanoTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload as KanoFeature;
  return (
    <div style={TIP}>
      <p className="font-semibold">{d.name}</p>
      <p>{d.category}</p>
      <p>Functional {d.avgFunctional} · Dysfunctional {d.avgDysfunctional}</p>
    </div>
  );
};

export const KanoQuadrantChart: React.FC<{ q: QuestionChartData }> = ({ q }) => {
  const features = (q.data?.features as KanoFeature[]) || [];
  if (!features.length) return <NoData />;

  return (
    <div className="flex flex-col flex-1 min-h-0 gap-1.5">
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 8, right: 12, bottom: 4, left: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis type="number" dataKey="avgDysfunctional" domain={[1, 5]} tick={{ fontSize: 9 }}
              tickLine={false} axisLine={false} />
            <YAxis type="number" dataKey="avgFunctional" domain={[1, 5]} tick={{ fontSize: 9 }}
              tickLine={false} axisLine={false} width={20} />
            <ReferenceLine x={3} stroke="#d1d5db" strokeDasharray="3 3" />
            <ReferenceLine y={3} stroke="#d1d5db" strokeDasharray="3 3" />
            <Tooltip content={<KanoTooltip />} />
            <Scatter data={features}>
              {features.map((f, i) => (
                <Cell key={i} fill={KANO_CATEGORY_COLOR[f.category] ?? COLORS[i % COLORS.length]} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <div className="flex-shrink-0 max-h-[68px] overflow-auto">
        <table className="w-full text-[9px] border-collapse">
          <tbody>
            {features.map((f, i) => (
              <tr key={i} className="border-t border-gray-50 first:border-0">
                <td className="py-0.5 pr-2 text-gray-600 truncate max-w-[90px]" title={f.name}>{cut(f.name, 16)}</td>
                <td className="py-0.5 px-1">
                  <span className="inline-flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: KANO_CATEGORY_COLOR[f.category] ?? '#9ca3af' }} />
                    <span className="text-gray-500">{f.category}</span>
                  </span>
                </td>
                <td className="py-0.5 pl-1 text-right text-gray-400">
                  {Object.values(f.counts).reduce((s, c) => s + c, 0)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   2. Gabor-Granger — price-acceptance curve
═══════════════════════════════════════════════════════════════════ */

interface GaborPricePoint {
  price: number;
  label: string;
  pctYes: number;
  yesCount: number;
  noCount: number;
  revenueIndex: number;
}

export const PriceAcceptanceCurve: React.FC<{ q: QuestionChartData }> = ({ q }) => {
  const pricePoints = (q.data?.pricePoints as GaborPricePoint[]) || [];
  const optimalPrice = q.data?.optimalPrice as number | null;
  if (!pricePoints.length) return <NoData />;
  const optimal = pricePoints.find(p => p.price === optimalPrice);

  return (
    <div className="flex flex-col flex-1 min-h-0 gap-1.5">
      {optimal && (
        <div className="flex items-center justify-center gap-1.5 flex-shrink-0">
          <span className="text-[9px] text-gray-400">Optimal price</span>
          <span className="text-xs font-bold text-gray-800">{optimal.label}</span>
          <span className="text-[9px] text-gray-400">({optimal.pctYes}% acceptance)</span>
        </div>
      )}
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={pricePoints} margin={{ top: 6, right: 12, bottom: 2, left: 4 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis dataKey="label" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 9 }} tickLine={false} axisLine={false} width={30}
              tickFormatter={(v: number) => `${v}%`} domain={[0, 100]} />
            <Tooltip formatter={(v: any) => [`${v}%`, 'Acceptance']} contentStyle={TIP} />
            <Line type="monotone" dataKey="pctYes" stroke="#4F7CFF" strokeWidth={2} dot={{ r: 3, fill: '#4F7CFF' }} />
            {optimal && (
              <ReferenceDot x={optimal.label} y={optimal.pctYes} r={5} fill="#00C48C" stroke="#fff" strokeWidth={1.5} />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   3. Van Westendorp PSM — 4-line price sensitivity curve
═══════════════════════════════════════════════════════════════════ */

const VW_CURVE_COLOR: Record<string, string> = {
  tooCheap: '#4F7CFF',
  goodValue: '#00C48C',
  expensive: '#FFAB00',
  tooExpensive: '#E8505E',
};
const VW_CURVE_LABEL: Record<string, string> = {
  tooCheap: 'Too Cheap',
  goodValue: 'Good Value',
  expensive: 'Expensive',
  tooExpensive: 'Too Expensive',
};

export const PSMCurveChart: React.FC<{ q: QuestionChartData }> = ({ q }) => {
  const pricePoints = (q.data?.pricePoints as number[]) || [];
  const curves = (q.data?.curves as Record<string, number[]>) || {};
  const intersections = (q.data?.intersections as Record<string, number | null>) || {};
  if (!pricePoints.length) return <NoData />;

  const rows = pricePoints.map((price, i) => ({
    price,
    tooCheap: curves.tooCheap?.[i] ?? null,
    goodValue: curves.goodValue?.[i] ?? null,
    expensive: curves.expensive?.[i] ?? null,
    tooExpensive: curves.tooExpensive?.[i] ?? null,
  }));

  const chips = (['OPP', 'IPP', 'PMC', 'PME'] as const).filter(k => intersections[k] != null);

  return (
    <div className="flex flex-col flex-1 min-h-0 gap-1.5">
      <div className="flex items-center gap-2 px-1 flex-shrink-0 flex-wrap">
        {Object.keys(VW_CURVE_LABEL).map(k => (
          <span key={k} className="flex items-center gap-1 text-[9px] text-gray-500">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: VW_CURVE_COLOR[k] }} />
            {VW_CURVE_LABEL[k]}
          </span>
        ))}
      </div>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rows} margin={{ top: 4, right: 12, bottom: 2, left: 4 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis dataKey="price" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} tickFormatter={fmtN} />
            <YAxis tick={{ fontSize: 9 }} tickLine={false} axisLine={false} width={30}
              tickFormatter={(v: number) => `${v}%`} domain={[0, 100]} />
            <Tooltip
              formatter={(v: any, n: any) => [`${v}%`, VW_CURVE_LABEL[n as string] ?? n]}
              labelFormatter={(l: any) => `Price ${fmtN(l)}`}
              contentStyle={TIP}
            />
            {Object.keys(VW_CURVE_COLOR).map(k => (
              <Line key={k} type="monotone" dataKey={k} stroke={VW_CURVE_COLOR[k]} strokeWidth={1.75} dot={false} connectNulls />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      {chips.length > 0 && (
        <div className="grid gap-1 flex-shrink-0" style={{ gridTemplateColumns: `repeat(${chips.length}, 1fr)` }}>
          {chips.map(k => (
            <div key={k} className="bg-gray-50 rounded-lg py-1 text-center">
              <p className="text-[8px] text-gray-400">{k}</p>
              <p className="text-[10px] font-semibold text-gray-800">{fmtN(intersections[k])}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   4. Smart Follow-Up — source/question/answer table (no chart; open
      text doesn't chart well)
═══════════════════════════════════════════════════════════════════ */

interface QAEntry {
  sourceAnswer: string;
  followupQuestion: string;
  followupAnswer: string;
}

export const QAListTable: React.FC<{ q: QuestionChartData }> = ({ q }) => {
  const entries = (q.data?.entries as QAEntry[]) || [];
  const totalCount = q.data?.totalCount ?? entries.length;
  if (!entries.length) return <NoData />;

  return (
    <div className="flex flex-col flex-1 min-h-0 gap-1">
      <div className="flex-1 min-h-0 overflow-auto">
        <table className="w-full text-[9px] border-collapse">
          <thead>
            <tr>
              <th className="p-1 text-left font-medium text-gray-400 border-b border-gray-100">Source answer</th>
              <th className="p-1 text-left font-medium text-gray-400 border-b border-gray-100">Follow-up</th>
              <th className="p-1 text-left font-medium text-gray-400 border-b border-gray-100">Response</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e, i) => (
              <tr key={i} className="border-b border-gray-50">
                <td className="p-1 text-gray-500 align-top" title={e.sourceAnswer}>{cut(e.sourceAnswer, 40)}</td>
                <td className="p-1 text-gray-500 align-top" title={e.followupQuestion}>{cut(e.followupQuestion, 40)}</td>
                <td className="p-1 text-gray-700 font-medium align-top" title={e.followupAnswer}>{cut(e.followupAnswer, 40)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalCount > entries.length && (
        <p className="text-[9px] text-gray-400 text-center flex-shrink-0">showing {entries.length} of {totalCount}</p>
      )}
    </div>
  );
};
