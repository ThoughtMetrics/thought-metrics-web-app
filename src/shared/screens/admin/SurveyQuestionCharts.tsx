import React, { useState } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ReferenceLine,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  Treemap, FunnelChart, Funnel, LabelList,
} from 'recharts';
import type { QuestionChartData } from './survey-analytics.type';

/* ═══════════════════════════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════════════════════════ */

const COLORS = ['#E8505E', '#4F7CFF', '#00C48C', '#FFAB00', '#7B61FF', '#FF6B35', '#00B8D9', '#6B7280'];
const CARDS_PER_PAGE = 4;

const CHART_LABEL: Record<string, string> = {
  donut: 'Donut', pie: 'Donut',
  'bar-horizontal': 'Bar', 'top-values': 'Top Values',
  'bar-vertical': 'Bar', 'diverging-bar': 'Diverging',
  'grouped-bar': 'Grouped', 'max-diff-bar': 'Grouped',
  'stacked-bar': 'Stacked', histogram: 'Histogram',
  'numeric-summary': 'Stats', 'rating-stars': 'Rating',
  'rating-distribution': 'Rating', radar: 'Radar',
  heatmap: 'Heatmap', 'matrix-grouped': 'Matrix',
  treemap: 'Treemap', funnel: 'Funnel',
  'range-bar': 'Range', 'range-summary': 'Range',
};

const TIP = { fontSize: 11, padding: '4px 8px', borderRadius: 6, border: '1px solid #e5e7eb', background: '#fff' };

/* ═══════════════════════════════════════════════════════════════════
   BENTO SPAN LOGIC
   Each page shows 4 cards in 2 rows. Within each row the two cards
   share 12 columns — narrow charts get 4 cols, wide charts get 8,
   medium charts get 6. Pairs adjust so spans always sum to 12.
═══════════════════════════════════════════════════════════════════ */

type ChartWeight = 'narrow' | 'medium' | 'wide';

function chartWeight(type: string): ChartWeight {
  if (['donut', 'pie', 'rating-stars', 'rating-distribution',
       'range-bar', 'range-summary', 'numeric-summary'].includes(type)) return 'narrow';
  if (['treemap', 'heatmap', 'matrix-grouped', 'stacked-bar',
       'radar', 'grouped-bar', 'max-diff-bar', 'histogram'].includes(type)) return 'wide';
  return 'medium';
}

function rowSpans(typeA: string, typeB?: string): [number, number] {
  if (!typeB) return [12, 0];
  const wa = chartWeight(typeA);
  const wb = chartWeight(typeB);
  if (wa === 'narrow' && wb === 'wide')   return [4, 8];
  if (wa === 'wide'   && wb === 'narrow') return [8, 4];
  if (wa === 'narrow' && wb === 'medium') return [4, 8];
  if (wa === 'medium' && wb === 'narrow') return [8, 4];
  if (wa === 'wide'   && wb === 'medium') return [8, 4];
  if (wa === 'medium' && wb === 'wide')   return [4, 8];
  return [6, 6]; // same-weight pairs split evenly
}

/* ═══════════════════════════════════════════════════════════════════
   SHARED HELPERS
═══════════════════════════════════════════════════════════════════ */

const NoData = () => (
  <div className="flex items-center justify-center h-full">
    <p className="text-[10px] text-gray-300">No data yet</p>
  </div>
);

const cut = (s: string, n = 18) => (s?.length > n ? s.slice(0, n - 1) + '…' : (s ?? ''));

const CategoryTick = ({ x, y, payload }: any) => (
  <text x={x} y={y} dy={4} textAnchor="end" fontSize={10} fill="#9ca3af">
    {cut(String(payload.value ?? ''), 18)}
  </text>
);

const fmtN = (v: any) => (typeof v === 'number' ? v.toLocaleString() : v);

/** Compact flex-wrap legend for pie / donut */
const PieLegend: React.FC<{ items: Array<{ name: string; value: number }>; total: number }> = ({ items, total }) => (
  <div className="flex flex-wrap gap-x-3 gap-y-1 pt-1.5 px-1 flex-shrink-0">
    {items.map((d, i) => {
      const pct = total > 0 ? Math.round((d.value / total) * 100) : 0;
      return (
        <div key={i} className="flex items-center gap-1 min-w-0">
          <span className="w-2 h-2 rounded-sm flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
          <span className="text-[10px] text-gray-500 truncate max-w-[80px]" title={d.name}>{d.name}</span>
          <span className="text-[10px] font-semibold text-gray-700 ml-0.5 flex-shrink-0">{pct}%</span>
        </div>
      );
    })}
  </div>
);

/* ═══════════════════════════════════════════════════════════════════
   CHART RENDERERS — all use height="100%" so they fill flex-1 space
═══════════════════════════════════════════════════════════════════ */

/* 1. Donut / Pie */
const DonutChart: React.FC<{ q: QuestionChartData }> = ({ q }) => {
  const slices = ((q.data as Array<{ name: string; value: number }>) || []).filter(d => d.value > 0);
  const total  = slices.reduce((s, d) => s + d.value, 0);
  if (!slices.length) return <NoData />;
  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 min-h-0 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={slices} dataKey="value" nameKey="name"
              cx="50%" cy="50%" innerRadius="40%" outerRadius="72%"
              paddingAngle={slices.length > 1 ? 2 : 0} strokeWidth={0}>
              {slices.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip formatter={(v: any, n: any) => [fmtN(v), n]} contentStyle={TIP} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="text-lg font-bold text-gray-800 leading-none">{total.toLocaleString()}</p>
            <p className="text-[9px] text-gray-400 mt-0.5">total</p>
          </div>
        </div>
      </div>
      <PieLegend items={slices} total={total} />
    </div>
  );
};

/* 2. Horizontal bar */
const HBarChart: React.FC<{ q: QuestionChartData }> = ({ q }) => {
  // Accept both {name, count} (bar-horizontal/top-values) and {name, value} (legacy pie conversion)
  const raw = (q.data as Array<{ name: string; count?: number; value?: number }>) || [];
  const items = raw.map(d => ({ name: d.name, count: d.count ?? d.value ?? 0 })).filter(d => d.count > 0);
  if (!items.length) return <NoData />;
  return (
    <div className="flex-1 min-h-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart layout="vertical" data={items} margin={{ top: 4, right: 28, bottom: 4, left: 4 }}>
          <XAxis type="number" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} tickFormatter={fmtN} />
          <YAxis type="category" dataKey="name" width={120} tickLine={false} axisLine={false} tick={<CategoryTick />} />
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
          <Tooltip formatter={(v: any) => [fmtN(v), 'count']} contentStyle={TIP} />
          <Bar dataKey="count" fill="#4F7CFF" radius={[0, 3, 3, 0]} maxBarSize={16} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

/* 3. Vertical bar */
const VBarChart: React.FC<{ q: QuestionChartData }> = ({ q }) => {
  const items = (q.data as Array<{ name: string | number; count: number }>) || [];
  if (!items.length) return <NoData />;
  return (
    <div className="flex-1 min-h-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={items} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
          <XAxis dataKey="name" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 9 }} tickLine={false} axisLine={false} width={26} tickFormatter={fmtN} />
          <Tooltip formatter={(v: any) => [fmtN(v), 'responses']} contentStyle={TIP} />
          <Bar dataKey="count" fill="#00C48C" radius={[3, 3, 0, 0]} maxBarSize={28} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

/* 4. Diverging bar */
const DivergingBar: React.FC<{ q: QuestionChartData }> = ({ q }) => {
  const items = (q.data as Array<{ name: string; value: number }>) || [];
  if (!items.length) return <NoData />;
  const domain = Math.max(...items.map(i => Math.abs(i.value)), 1);
  return (
    <div className="flex flex-col flex-1 min-h-0 gap-1.5">
      <div className="flex items-center gap-3 px-1 flex-shrink-0">
        <span className="flex items-center gap-1 text-[9px] text-gray-500">
          <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: '#E8505E' }} />Disagree
        </span>
        <span className="flex items-center gap-1 text-[9px] text-gray-500">
          <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: '#00C48C' }} />Agree
        </span>
      </div>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart layout="vertical" data={items} margin={{ top: 2, right: 8, bottom: 2, left: 4 }}>
            <XAxis type="number" tick={{ fontSize: 9 }} tickLine={false} axisLine={false}
              domain={[-domain, domain]} tickFormatter={(v: number) => String(Math.abs(v))} />
            <YAxis type="category" dataKey="name" width={24} tickLine={false} axisLine={false} tick={{ fontSize: 9, fill: '#9ca3af' }} />
            <ReferenceLine x={0} stroke="#d1d5db" strokeWidth={1.5} />
            <Tooltip formatter={(v: any) => [fmtN(Math.abs(v)), 'responses']} contentStyle={TIP} />
            <Bar dataKey="value" radius={[0, 3, 3, 0]} maxBarSize={14}>
              {items.map((e, i) => <Cell key={i} fill={e.value >= 0 ? '#00C48C' : '#E8505E'} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

/* 5. Grouped bar (max-diff best vs worst) */
const GroupedBar: React.FC<{ q: QuestionChartData }> = ({ q }) => {
  const raw  = (q.data as Array<{ name: string; best?: number; worst?: number }>) || [];
  const has  = 'best' in (raw[0] ?? {});
  if (!raw.length) return <NoData />;
  if (!has) return <HBarChart q={q} />;
  return (
    <div className="flex flex-col flex-1 min-h-0 gap-1.5">
      <div className="flex items-center gap-3 px-1 flex-shrink-0">
        <span className="flex items-center gap-1 text-[9px] text-gray-500">
          <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: '#00C48C' }} />Best
        </span>
        <span className="flex items-center gap-1 text-[9px] text-gray-500">
          <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: '#E8505E' }} />Worst
        </span>
      </div>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={raw} margin={{ top: 2, right: 4, bottom: 18, left: 4 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis dataKey="name" tick={{ fontSize: 8 }} tickLine={false} axisLine={false}
              angle={-30} textAnchor="end" interval={0} tickFormatter={(v: string) => cut(v, 10)} />
            <YAxis tick={{ fontSize: 9 }} tickLine={false} axisLine={false} width={26} tickFormatter={fmtN} />
            <Tooltip formatter={(v: any) => [fmtN(v)]} contentStyle={TIP} />
            <Bar dataKey="best"  fill="#00C48C" radius={[3, 3, 0, 0]} maxBarSize={12} name="Best" />
            <Bar dataKey="worst" fill="#E8505E" radius={[3, 3, 0, 0]} maxBarSize={12} name="Worst" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

/* 6. Stacked bar */
const StackedBar: React.FC<{ q: QuestionChartData }> = ({ q }) => {
  const { xKey, yKeys, records } = (q.data || {}) as { xKey: string; yKeys: string[]; records: any[] };
  if (!records?.length || !yKeys?.length) return <NoData />;
  return (
    <div className="flex-1 min-h-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={records} margin={{ top: 4, right: 4, bottom: 18, left: 4 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
          <XAxis dataKey={xKey} tick={{ fontSize: 8 }} tickLine={false} axisLine={false}
            angle={-25} textAnchor="end" interval={0} tickFormatter={(v: string) => cut(v, 10)} />
          <YAxis tick={{ fontSize: 9 }} tickLine={false} axisLine={false} width={26} tickFormatter={fmtN} />
          <Tooltip formatter={(v: any) => [fmtN(v)]} contentStyle={TIP} />
          {yKeys.map((k, i) => <Bar key={k} dataKey={k} stackId="a" fill={COLORS[i % COLORS.length]} maxBarSize={28} />)}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

/* 7. Histogram */
const HistogramChart: React.FC<{ q: QuestionChartData }> = ({ q }) => {
  const { min, max, avg, median, histogram, isCurrency } = q.data || {};
  const bins = ((histogram || []) as Array<{ range: string; count: number }>).filter(d => d.count > 0);
  const fmt  = (n: number) => isCurrency ? `₹${Math.round(n).toLocaleString()}` : (Math.round(n * 10) / 10).toLocaleString();
  return (
    <div className="flex flex-col flex-1 min-h-0 gap-1.5">
      <div className="grid grid-cols-4 gap-1 flex-shrink-0">
        {(['Min', 'Avg', 'Median', 'Max'] as const).map((lbl, i) => {
          const val = [min, avg, median, max][i];
          return (
            <div key={lbl} className="bg-gray-50 rounded-lg py-1.5 text-center">
              <p className="text-[8px] text-gray-400 mb-0.5">{lbl}</p>
              <p className="text-[10px] font-semibold text-gray-800 truncate px-1">{val != null ? fmt(val as number) : '—'}</p>
            </div>
          );
        })}
      </div>
      <div className="flex-1 min-h-0">
        {bins.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={bins} margin={{ top: 2, right: 4, bottom: 2, left: 4 }} barCategoryGap="6%">
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="range" tick={{ fontSize: 8 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 9 }} tickLine={false} axisLine={false} width={26} tickFormatter={fmtN} />
              <Tooltip formatter={(v: any) => [fmtN(v), 'count']} contentStyle={TIP} />
              <Bar dataKey="count" fill="#FFAB00" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : <NoData />}
      </div>
    </div>
  );
};

/* 8. Rating stars */
const RatingStars: React.FC<{ q: QuestionChartData }> = ({ q }) => {
  const { distribution = [], average, maxRating = 5 } = q.data || {};
  const dist   = distribution as Array<{ rating: number; count: number }>;
  const filled = Math.round(average || 0);
  return (
    <div className="flex flex-col flex-1 min-h-0 gap-1.5">
      <div className="flex items-center gap-2 flex-shrink-0 px-1">
        <span className="text-xl font-bold text-gray-800 leading-none">{average}</span>
        <div className="flex flex-col gap-0.5">
          <div className="flex gap-0.5">
            {Array.from({ length: maxRating }).map((_, i) => (
              <span key={i} className="text-sm leading-none" style={{ color: i < filled ? '#FFAB00' : '#e5e7eb' }}>★</span>
            ))}
          </div>
          <span className="text-[9px] text-gray-400">out of {maxRating}</span>
        </div>
      </div>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dist} margin={{ top: 2, right: 4, bottom: 2, left: 4 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis dataKey="rating" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 9 }} tickLine={false} axisLine={false} width={26} tickFormatter={fmtN} />
            <Tooltip formatter={(v: any) => [fmtN(v), 'responses']} contentStyle={TIP} />
            <Bar dataKey="count" fill="#FFAB00" radius={[3, 3, 0, 0]} maxBarSize={32} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

/* 9. Radar */
const RadarRenderer: React.FC<{ q: QuestionChartData }> = ({ q }) => {
  const { axes = [], values = [] } = (q.data || {}) as { axes: string[]; values: number[] };
  if (!axes.length) return <NoData />;
  const data = axes.map((a, i) => ({ name: cut(a, 14), value: values[i] ?? 0 }));
  const max  = Math.max(...values, 1);
  return (
    <div className="flex-1 min-h-0">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} margin={{ top: 10, right: 22, bottom: 10, left: 22 }}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis dataKey="name" tick={{ fontSize: 9, fill: '#6b7280' }} />
          <PolarRadiusAxis tick={{ fontSize: 8 }} domain={[0, max]} tickCount={4} />
          <Radar dataKey="value" stroke="#7B61FF" fill="#7B61FF" fillOpacity={0.3} dot={{ fill: '#7B61FF', r: 2 }} />
          <Tooltip formatter={(v: any) => [fmtN(v), 'avg']} contentStyle={TIP} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

/* 10. Heatmap */
const HeatmapChart: React.FC<{ q: QuestionChartData }> = ({ q }) => {
  let rows: string[] = [], cols: string[] = [];
  let cells: Array<{ row: string; col: string; value: number }> = [], maxVal = 1;
  if (q.data?.cells) {
    ({ rows, cols, cells, maxVal } = q.data);
  } else if (q.data?.rows && q.data?.columns && q.data?.counts) {
    rows = (q.data.rows as any[]).map((r: any) => r.label);
    cols = (q.data.columns as any[]).map((c: any) => c.label);
    for (const r of q.data.rows as any[])
      for (const c of q.data.columns as any[])
        cells.push({ row: r.label, col: c.label, value: q.data.counts[r.id]?.[c.value] || 0 });
    maxVal = Math.max(...cells.map(c => c.value), 1);
  }
  if (!rows.length || !cols.length) return <NoData />;
  const map = new Map(cells.map(c => [`${c.row}|${c.col}`, c.value]));
  return (
    <div className="flex-1 min-h-0 overflow-auto">
      <table className="w-full text-[9px] border-collapse">
        <thead>
          <tr>
            <th className="p-1 text-left text-gray-400 font-normal" />
            {cols.map(c => (
              <th key={c} className="p-1 text-center font-medium text-gray-500" title={c}>{cut(c, 8)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r}>
              <td className="p-1 pr-2 text-gray-500 whitespace-nowrap" title={r}>{cut(r, 12)}</td>
              {cols.map(c => {
                const v = map.get(`${r}|${c}`) || 0;
                const p = maxVal > 0 ? v / maxVal : 0;
                return (
                  <td key={c} className="p-1 text-center rounded font-semibold"
                    title={`${r} × ${c}: ${v}`}
                    style={{ backgroundColor: `rgba(232,80,94,${0.07 + p * 0.85})`, color: p > 0.5 ? '#fff' : '#374151', minWidth: 26 }}>
                    {v.toLocaleString()}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/* 11. Treemap */
const TreemapChart: React.FC<{ q: QuestionChartData }> = ({ q }) => {
  // Normalise both {name, value} and {name, count} to {name, value}
  const raw = (q.data as Array<{ name: string; value?: number; count?: number }>) || [];
  const items = raw.map(d => ({ name: d.name, value: d.value ?? d.count ?? 0 })).filter(d => d.value > 0);
  if (!items.length) return <NoData />;
  const CustomContent = (props: any) => {
    const { x, y, width, height, index, name } = props;
    if (width < 18 || height < 12) return null;
    return (
      <g>
        <rect x={x} y={y} width={width} height={height} fill={COLORS[index % COLORS.length]} rx={3} />
        {width > 32 && height > 18 && (
          <text x={x + width / 2} y={y + height / 2} textAnchor="middle" dominantBaseline="middle"
            fontSize={9} fill="#fff" fontWeight={500}>
            {cut(String(name), 11)}
          </text>
        )}
      </g>
    );
  };
  return (
    <div className="flex-1 min-h-0">
      <ResponsiveContainer width="100%" height="100%">
        <Treemap data={items} dataKey="value" nameKey="name" aspectRatio={4 / 3} content={<CustomContent />}>
          <Tooltip formatter={(v: any, n: any) => [fmtN(v), n]} contentStyle={TIP} />
        </Treemap>
      </ResponsiveContainer>
    </div>
  );
};

/* 12. Funnel */
const FunnelRenderer: React.FC<{ q: QuestionChartData }> = ({ q }) => {
  const items = ((q.data as Array<{ name: string; value: number }>) || []).filter(d => d.value > 0);
  if (!items.length) return <NoData />;
  const colored = items.map((d, i) => ({ ...d, fill: COLORS[i % COLORS.length] }));
  return (
    <div className="flex-1 min-h-0">
      <ResponsiveContainer width="100%" height="100%">
        <FunnelChart>
          <Tooltip formatter={(v: any) => [fmtN(v)]} contentStyle={TIP} />
          <Funnel dataKey="value" nameKey="name" data={colored} isAnimationActive>
            <LabelList position="right" dataKey="name" fontSize={9} fill="#6b7280" />
          </Funnel>
        </FunnelChart>
      </ResponsiveContainer>
    </div>
  );
};

/* 13. Range bar */
const RangeBar: React.FC<{ q: QuestionChartData }> = ({ q }) => {
  const { avgMin, avgMax, sampleCount } = q.data || {};
  if (avgMin == null || avgMax == null) return <NoData />;
  const cap = avgMax || 1;
  return (
    <div className="flex flex-col justify-center flex-1 gap-4 px-2 py-2">
      {(['Avg Min', 'Avg Max'] as const).map((lbl, i) => {
        const val  = i === 0 ? avgMin : avgMax;
        const clr  = i === 0 ? '#4F7CFF' : '#E8505E';
        const pct  = Math.min(100, Math.max(4, (Number(val) / cap) * 100));
        return (
          <div key={lbl}>
            <div className="flex justify-between mb-1.5">
              <span className="text-xs text-gray-500">{lbl}</span>
              <span className="text-xs font-bold text-gray-800">{Number(val).toLocaleString()}</span>
            </div>
            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: clr }} />
            </div>
          </div>
        );
      })}
      {sampleCount && <p className="text-[9px] text-gray-400 text-center">{Number(sampleCount).toLocaleString()} responses</p>}
    </div>
  );
};

/* 14. Stat chips (legacy numeric-summary / range-summary) */
const StatChips: React.FC<{ q: QuestionChartData }> = ({ q }) => {
  const d = q.data || {};
  const pairs: Array<[string, any]> = d.avgMin != null
    ? [['Avg Min', d.avgMin], ['Avg Max', d.avgMax], ['Responses', d.sampleCount]]
    : [['Min', d.min], ['Max', d.max], ['Avg', d.avg]];
  return (
    <div className="flex flex-col justify-center flex-1 gap-2 px-1">
      <div className="grid grid-cols-3 gap-2">
        {pairs.map(([lbl, val]) => (
          <div key={lbl} className="bg-gray-50 rounded-xl py-3 text-center">
            <p className="text-[9px] text-gray-400 mb-1">{lbl}</p>
            <p className="text-sm font-bold text-gray-800">{val != null ? Number(val).toLocaleString() : '—'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   DISPATCH
═══════════════════════════════════════════════════════════════════ */

function renderChart(q: QuestionChartData): React.ReactNode {
  if (q.totalAnswered === 0) return <NoData />;
  switch (q.chartType) {
    case 'donut': case 'pie':                         return <DonutChart q={q} />;
    case 'bar-horizontal': case 'top-values':         return <HBarChart q={q} />;
    case 'bar-vertical':                              return <VBarChart q={q} />;
    case 'diverging-bar':                             return <DivergingBar q={q} />;
    case 'grouped-bar': case 'max-diff-bar':          return <GroupedBar q={q} />;
    case 'stacked-bar':                               return <StackedBar q={q} />;
    case 'histogram':                                 return <HistogramChart q={q} />;
    case 'rating-stars': case 'rating-distribution':  return <RatingStars q={q} />;
    case 'radar':                                     return <RadarRenderer q={q} />;
    case 'heatmap': case 'matrix-grouped':            return <HeatmapChart q={q} />;
    case 'treemap':                                   return <TreemapChart q={q} />;
    case 'funnel':                                    return <FunnelRenderer q={q} />;
    case 'range-bar':                                 return <RangeBar q={q} />;
    case 'numeric-summary': case 'range-summary':     return <StatChips q={q} />;
    default:                                          return <DonutChart q={q} />;
  }
}

/* ═══════════════════════════════════════════════════════════════════
   CARD SHELL
═══════════════════════════════════════════════════════════════════ */

const Card: React.FC<{ q: QuestionChartData }> = ({ q }) => {
  const sampled = (q as any).sampled as boolean | undefined;
  return (
    <div className="flex flex-col border border-gray-100 rounded-xl bg-white overflow-hidden h-full shadow-sm">
      {/* Header */}
      <div className="px-3 pt-2.5 pb-2 border-b border-gray-50 flex-shrink-0">
        <p className="text-[11px] font-semibold text-gray-800 leading-snug line-clamp-2 mb-1.5" title={q.questionText}>
          {q.questionText}
        </p>
        <div className="flex items-center gap-1 flex-wrap">
          <span className="text-[9px] font-medium text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">
            {q.totalAnswered.toLocaleString()}/{q.totalResponses.toLocaleString()} answered
          </span>
          <span className="text-[9px] font-medium text-indigo-500 bg-indigo-50 rounded-full px-2 py-0.5">
            {CHART_LABEL[q.chartType] ?? q.chartType}
          </span>
          {sampled && (
            <span className="text-[9px] font-medium text-amber-600 bg-amber-50 rounded-full px-2 py-0.5">sampled</span>
          )}
        </div>
      </div>
      {/* Chart body */}
      <div className="p-2 flex-1 min-h-0 flex flex-col">
        {renderChart(q)}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   MAIN — paginated bento slider
   Each page: 12-col grid, 2 rows of 2 cards.
   Within each row, card widths are determined by chart type weight.
═══════════════════════════════════════════════════════════════════ */

interface Props {
  questions: QuestionChartData[];
  isLoading: boolean;
}

const GRID: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(12, 1fr)',
  gridAutoRows: '240px',
  gap: '8px',
};

const SurveyQuestionCharts: React.FC<Props> = ({ questions, isLoading }) => {
  const [page, setPage] = useState(0);

  /* ── Loading ── */
  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="h-5 w-40 animate-pulse bg-gray-100 rounded-full" />
        <div style={GRID}>
          {[4, 8, 8, 4].map((col, i) => (
            <div key={i} className="animate-pulse bg-gray-100 rounded-xl"
              style={{ gridColumn: `span ${col}` }} />
          ))}
        </div>
      </div>
    );
  }

  /* ── Empty ── */
  if (!questions || questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center border border-gray-100 rounded-xl bg-gray-50">
        <svg className="w-8 h-8 text-gray-200 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <p className="text-xs font-semibold text-gray-400">No chartable questions</p>
        <p className="text-[10px] text-gray-300 mt-0.5">Responses will appear here once data is collected</p>
      </div>
    );
  }

  const totalPages = Math.ceil(questions.length / CARDS_PER_PAGE);
  const pageQ      = questions.slice(page * CARDS_PER_PAGE, (page + 1) * CARDS_PER_PAGE);

  // Split page into 2 rows of 2 cards each
  const row1 = pageQ.slice(0, 2);
  const row2 = pageQ.slice(2, 4);
  const [s1, s2] = rowSpans(row1[0]?.chartType, row1[1]?.chartType);
  const [s3, s4] = rowSpans(row2[0]?.chartType, row2[1]?.chartType);

  return (
    <div className="space-y-2">

      {/* ── Header: title + dots + arrows ── */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-gray-700">
          Response Analysis
          <span className="ml-2 text-gray-400 font-normal">
            {page * CARDS_PER_PAGE + 1}–{Math.min((page + 1) * CARDS_PER_PAGE, questions.length)} of {questions.length}
          </span>
        </p>

        <div className="flex items-center gap-1.5">
          {/* Page dots */}
          <div className="flex gap-1 mr-0.5">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button key={i} onClick={() => setPage(i)}
                className={`rounded-full transition-all ${i === page ? 'w-4 h-2 bg-primary' : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'}`} />
            ))}
          </div>
          {/* Prev */}
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          {/* Next */}
          <button
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Bento grid — 2 rows, varied column widths ── */}
      <div style={GRID}>

        {/* Row 1 */}
        {row1[0] && (
          <div style={{ gridColumn: `span ${s1}` }}>
            <Card q={row1[0]} />
          </div>
        )}
        {row1[1] && (
          <div style={{ gridColumn: `span ${s2}` }}>
            <Card q={row1[1]} />
          </div>
        )}

        {/* Row 2 */}
        {row2[0] && (
          <div style={{ gridColumn: `span ${s3}` }}>
            <Card q={row2[0]} />
          </div>
        )}
        {row2[1] && (
          <div style={{ gridColumn: `span ${s4}` }}>
            <Card q={row2[1]} />
          </div>
        )}

      </div>
    </div>
  );
};

export default SurveyQuestionCharts;
