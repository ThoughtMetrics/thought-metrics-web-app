import React, { useState } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ReferenceLine,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  Treemap,
} from 'recharts';
import type { QuestionChartData } from './survey-analytics.type';

const COLORS = ['#E8505E', '#4F7CFF', '#00C48C', '#FFAB00', '#7B61FF', '#FF6B35', '#00B8D9', '#6B7280'];
const CARDS_PER_PAGE = 4;

const CHART_LABEL: Record<string, string> = {
  donut: 'Donut', 'bar-horizontal': 'Bar', 'bar-vertical': 'Bar',
  'diverging-bar': 'Diverging', 'grouped-bar': 'Grouped', 'stacked-bar': 'Stacked',
  histogram: 'Histogram', 'rating-stars': 'Rating', radar: 'Radar',
  heatmap: 'Heatmap', treemap: 'Treemap', funnel: 'Funnel',
  'range-bar': 'Range', 'top-values': 'Top Values',
  pie: 'Donut', 'rating-distribution': 'Rating', 'numeric-summary': 'Histogram',
  'range-summary': 'Range', 'matrix-grouped': 'Heatmap', 'max-diff-bar': 'Grouped',
};

const tipStyle = { fontSize: 11, padding: '4px 8px', borderRadius: 6, border: '1px solid #e5e7eb' };
const NoData = () => <p className="text-[10px] text-gray-400 text-center py-6">No data yet</p>;

/* ─── Scrollable colour legend ───────────────────────────────────── */
const ScrollLegend: React.FC<{ items: Array<{ name: string; value: number }>; total: number }> = ({ items, total }) => (
  <div className="overflow-y-auto px-2 pb-1" style={{ maxHeight: 70 }}>
    {items.map((d, i) => {
      const pct = total > 0 ? Math.round((d.value / total) * 100) : 0;
      return (
        <div key={i} className="flex items-center gap-1.5 min-w-0 mb-0.5">
          <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
          <span className="text-[10px] text-gray-600 truncate flex-1" title={d.name}>{d.name}</span>
          <span className="text-[10px] font-semibold text-gray-800 flex-shrink-0 ml-auto">{pct}%</span>
          <span className="text-[9px] text-gray-400 flex-shrink-0 w-8 text-right">({d.value})</span>
        </div>
      );
    })}
  </div>
);

/* ═══════════════════════════════════════════════════════════════════
   CHART RENDERERS
═══════════════════════════════════════════════════════════════════ */

/* 1. Donut — proportion ≤7 categories (mcq-single, constant-sum) */
const DonutChart: React.FC<{ q: QuestionChartData }> = ({ q }) => {
  const raw = q.data as Array<{ name: string; value: number }>;
  const slices = (raw || []).filter(d => d.value > 0);
  const total = slices.reduce((s, d) => s + d.value, 0);
  if (!slices.length) return <NoData />;
  return (
    <div className="flex flex-col gap-1.5">
      <div className="relative">
        <ResponsiveContainer width="100%" height={148}>
          <PieChart margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
            <Pie data={slices} cx="50%" cy="50%" innerRadius={42} outerRadius={66}
              dataKey="value" paddingAngle={slices.length > 1 ? 2 : 0} strokeWidth={0}>
              {slices.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip formatter={(v: any, n: any) => [`${v} (${total > 0 ? Math.round((v / total) * 100) : 0}%)`, n]} contentStyle={tipStyle} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="text-sm font-bold text-gray-800 leading-none">{total}</p>
            <p className="text-[8px] text-gray-400 mt-0.5">total</p>
          </div>
        </div>
      </div>
      <ScrollLegend items={slices} total={total} />
    </div>
  );
};

/* 2. Horizontal bar — mcq-multiple, long-label comparisons */
const HorizontalBarChart: React.FC<{ q: QuestionChartData }> = ({ q }) => {
  const items = (q.data as Array<{ name: string; count: number }>).filter(d => d.count > 0);
  if (!items.length) return <NoData />;
  const h = Math.min(200, Math.max(80, items.length * 22));
  return (
    <ResponsiveContainer width="100%" height={h}>
      <BarChart layout="vertical" data={items} margin={{ top: 2, right: 28, bottom: 2, left: 4 }}>
        <XAxis type="number" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} />
        <YAxis type="category" dataKey="name" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} width={82}
          tickFormatter={(v: string) => v?.length > 14 ? v.slice(0, 13) + '…' : v} />
        <Tooltip contentStyle={tipStyle} formatter={(v: any) => [v, 'count']} />
        <Bar dataKey="count" radius={[0, 3, 3, 0]} maxBarSize={14}>
          {items.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

/* 3. Vertical bar — ordinal scales, likert, frequency */
const VerticalBarChart: React.FC<{ q: QuestionChartData }> = ({ q }) => {
  const items = (q.data as Array<{ name: string | number; count: number }>);
  if (!items?.length) return <NoData />;
  return (
    <ResponsiveContainer width="100%" height={148}>
      <BarChart data={items} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
        <XAxis dataKey="name" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 9 }} tickLine={false} axisLine={false} width={24} />
        <Tooltip contentStyle={tipStyle} formatter={(v: any) => [v, 'responses']} />
        <Bar dataKey="count" radius={[3, 3, 0, 0]} maxBarSize={28}>
          {items.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

/* 4. Diverging bar — agreement/opinion questions (likert-scale) */
const DivergingBarChart: React.FC<{ q: QuestionChartData }> = ({ q }) => {
  const items = q.data as Array<{ name: string; value: number }>;
  if (!items?.length) return <NoData />;
  const h = Math.max(80, items.length * 22);
  const domain = Math.max(...items.map(i => Math.abs(i.value)), 1);
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-center gap-3 px-1">
        <span className="flex items-center gap-1 text-[9px] text-gray-500">
          <span className="w-2 h-2 rounded-sm inline-block" style={{ backgroundColor: '#E8505E' }} />Disagree
        </span>
        <span className="flex items-center gap-1 text-[9px] text-gray-500">
          <span className="w-2 h-2 rounded-sm inline-block" style={{ backgroundColor: '#00C48C' }} />Agree
        </span>
      </div>
      <ResponsiveContainer width="100%" height={h}>
        <BarChart layout="vertical" data={items} margin={{ top: 2, right: 8, bottom: 2, left: 24 }}>
          <XAxis type="number" tick={{ fontSize: 9 }} tickLine={false} axisLine={false}
            domain={[-domain, domain]} tickFormatter={(v: number) => String(Math.abs(v))} />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} width={20} />
          <ReferenceLine x={0} stroke="#d1d5db" strokeWidth={1} />
          <Tooltip contentStyle={tipStyle} formatter={(v: any) => [Math.abs(v), 'responses']} />
          <Bar dataKey="value" radius={[0, 3, 3, 0]} maxBarSize={14}>
            {items.map((entry, i) => (
              <Cell key={i} fill={entry.value >= 0 ? '#00C48C' : '#E8505E'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

/* 5. Grouped bar — max-diff best vs worst */
const GroupedBarChart: React.FC<{ q: QuestionChartData }> = ({ q }) => {
  const raw = q.data as Array<{ name: string; best?: number; worst?: number; value?: number; count?: number }>;
  const items = (raw || []).filter(d => (d.best ?? d.value ?? 0) > 0 || (d.worst ?? 0) > 0);
  if (!items.length) return <NoData />;
  const hasBestWorst = items[0] && 'best' in items[0];
  if (!hasBestWorst) return <HorizontalBarChart q={q} />;
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-center gap-3 px-1">
        <span className="flex items-center gap-1 text-[9px] text-gray-500">
          <span className="w-2 h-2 rounded-sm inline-block bg-primary" />Best
        </span>
        <span className="flex items-center gap-1 text-[9px] text-gray-500">
          <span className="w-2 h-2 rounded-sm inline-block" style={{ backgroundColor: '#6B7280' }} />Worst
        </span>
      </div>
      <ResponsiveContainer width="100%" height={148}>
        <BarChart data={items} margin={{ top: 2, right: 4, bottom: 22, left: 4 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
          <XAxis dataKey="name" tick={{ fontSize: 8 }} tickLine={false} axisLine={false}
            angle={-35} textAnchor="end" interval={0} />
          <YAxis tick={{ fontSize: 9 }} tickLine={false} axisLine={false} width={24} />
          <Tooltip contentStyle={tipStyle} />
          <Bar dataKey="best" fill="#E8505E" radius={[3, 3, 0, 0]} maxBarSize={12} name="Best" />
          <Bar dataKey="worst" fill="#6B7280" radius={[3, 3, 0, 0]} maxBarSize={12} name="Worst" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

/* 6. Stacked bar — large matrix (rows × columns > 25) */
const StackedBarChart: React.FC<{ q: QuestionChartData }> = ({ q }) => {
  const { xKey, yKeys, records } = (q.data || {}) as { xKey: string; yKeys: string[]; records: any[] };
  if (!records?.length || !yKeys?.length) return <NoData />;
  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart data={records} margin={{ top: 2, right: 4, bottom: 22, left: 4 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
        <XAxis dataKey={xKey} tick={{ fontSize: 8 }} tickLine={false} axisLine={false} angle={-25} textAnchor="end" interval={0} />
        <YAxis tick={{ fontSize: 9 }} tickLine={false} axisLine={false} width={24} />
        <Tooltip contentStyle={tipStyle} />
        {yKeys.map((k, i) => (
          <Bar key={k} dataKey={k} stackId="s" fill={COLORS[i % COLORS.length]} maxBarSize={28} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

/* 7. Histogram — number/currency distribution */
const HistogramChart: React.FC<{ q: QuestionChartData }> = ({ q }) => {
  const { min, max, avg, median, histogram, isCurrency } = q.data || {};
  const bins = ((histogram || []) as Array<{ range: string; count: number }>).filter(d => d.count > 0);
  const fmt = (n: number) => isCurrency ? `₹${Math.round(n).toLocaleString()}` : String(Math.round(n * 10) / 10);
  return (
    <div className="flex flex-col gap-1.5">
      <div className="grid grid-cols-4 gap-1 px-1">
        {([['Min', min], ['Avg', avg], ['Med', median], ['Max', max]] as const).map(([lbl, val]) => (
          <div key={lbl} className="bg-gray-50 rounded py-1 text-center">
            <p className="text-[8px] text-gray-400">{lbl}</p>
            <p className="text-[9px] font-semibold text-gray-800 truncate px-0.5">{val != null ? fmt(val as number) : '—'}</p>
          </div>
        ))}
      </div>
      {bins.length > 0 ? (
        <ResponsiveContainer width="100%" height={115}>
          <BarChart data={bins} margin={{ top: 2, right: 4, bottom: 4, left: 4 }} barCategoryGap="4%">
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis dataKey="range" tick={{ fontSize: 8 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 9 }} tickLine={false} axisLine={false} width={24} />
            <Tooltip contentStyle={tipStyle} formatter={(v: any) => [v, 'count']} />
            <Bar dataKey="count" fill={COLORS[0]} radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : <p className="text-[9px] text-gray-400 text-center">No distribution data</p>}
    </div>
  );
};

/* 8. Rating stars — star distribution + average badge */
const RatingStarsChart: React.FC<{ q: QuestionChartData }> = ({ q }) => {
  const { distribution = [], average, maxRating = 5 } = q.data || {};
  const dist = (distribution as Array<{ rating: number; count: number }>);
  const filled = Math.round(average || 0);
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5 px-1">
        <div className="flex gap-0.5">
          {Array.from({ length: maxRating }).map((_, i) => (
            <svg key={i} className="w-3.5 h-3.5" fill={i < filled ? '#FFAB00' : '#e5e7eb'} viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <span className="text-sm font-bold text-gray-800">{average}</span>
        <span className="text-[9px] text-gray-400">/ {maxRating} avg</span>
      </div>
      <ResponsiveContainer width="100%" height={128}>
        <BarChart data={dist} margin={{ top: 2, right: 4, bottom: 4, left: 4 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
          <XAxis dataKey="rating" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 9 }} tickLine={false} axisLine={false} width={24} />
          <Tooltip contentStyle={tipStyle} formatter={(v: any) => [v, 'responses']} />
          <Bar dataKey="count" fill="#FFAB00" radius={[3, 3, 0, 0]} maxBarSize={32} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

/* 9. Radar — multi-slider multi-dimensional profile */
const RadarChartRenderer: React.FC<{ q: QuestionChartData }> = ({ q }) => {
  const { axes = [], values = [] } = (q.data || {}) as { axes: string[]; values: number[] };
  if (!axes.length) return <NoData />;
  const data = axes.map((a, i) => ({ subject: a.length > 12 ? a.slice(0, 11) + '…' : a, value: values[i] ?? 0 }));
  const max = Math.max(...values, 1);
  return (
    <ResponsiveContainer width="100%" height={180}>
      <RadarChart data={data} margin={{ top: 8, right: 22, bottom: 8, left: 22 }}>
        <PolarGrid stroke="#e5e7eb" />
        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 8 }} />
        <PolarRadiusAxis tick={{ fontSize: 7 }} domain={[0, max]} tickCount={3} />
        <Radar dataKey="value" stroke="#4F7CFF" fill="#4F7CFF" fillOpacity={0.25} dot={{ fill: '#4F7CFF', r: 2 }} />
        <Tooltip contentStyle={tipStyle} formatter={(v: any) => [v, 'avg score']} />
      </RadarChart>
    </ResponsiveContainer>
  );
};

/* 10. Heatmap — matrix ≤5×5 with colour intensity */
const HeatmapChart: React.FC<{ q: QuestionChartData }> = ({ q }) => {
  /* support both new heatmap shape and legacy matrix-grouped shape */
  let rows: string[] = [], cols: string[] = [], cells: Array<{ row: string; col: string; value: number }> = [], maxVal = 1;
  if (q.data?.cells) {
    ({ rows, cols, cells, maxVal } = q.data);
  } else if (q.data?.rows && q.data?.columns && q.data?.counts) {
    rows = (q.data.rows as any[]).map(r => r.label);
    cols = (q.data.columns as any[]).map(c => c.label);
    for (const r of q.data.rows as any[]) {
      for (const c of q.data.columns as any[]) {
        cells.push({ row: r.label, col: c.label, value: q.data.counts[r.id]?.[c.value] || 0 });
      }
    }
    maxVal = Math.max(...cells.map(c => c.value), 1);
  }
  if (!rows.length || !cols.length) return <NoData />;
  const cellMap = new Map(cells.map(c => [`${c.row}|${c.col}`, c.value]));
  return (
    <div className="overflow-auto px-1 py-1">
      <table className="w-full text-[8px] border-collapse">
        <thead>
          <tr>
            <th className="text-gray-400 font-normal p-0.5 text-left" />
            {cols.map(c => (
              <th key={c} className="text-gray-500 font-medium p-0.5 text-center max-w-14" title={c}>
                {c.length > 7 ? c.slice(0, 6) + '…' : c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r}>
              <td className="text-gray-500 p-0.5 pr-1.5 max-w-16 truncate" title={r}>
                {r.length > 9 ? r.slice(0, 8) + '…' : r}
              </td>
              {cols.map(c => {
                const v = cellMap.get(`${r}|${c}`) || 0;
                const intensity = maxVal > 0 ? v / maxVal : 0;
                const bg = `rgba(79,124,255,${0.08 + intensity * 0.82})`;
                return (
                  <td key={c} className="p-0.5 text-center rounded font-medium" title={`${r} × ${c}: ${v}`}
                    style={{ backgroundColor: bg, color: intensity > 0.55 ? '#fff' : '#374151', minWidth: 22 }}>
                    {v}
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

/* 11. Treemap — proportions with >12 categories */
const TreemapChart: React.FC<{ q: QuestionChartData }> = ({ q }) => {
  const raw = q.data as Array<{ name: string; value: number }>;
  const items = (raw || []).filter(d => d.value > 0);
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
            {(name as string).length > 10 ? (name as string).slice(0, 9) + '…' : name}
          </text>
        )}
      </g>
    );
  };
  return (
    <ResponsiveContainer width="100%" height={170}>
      <Treemap data={items} dataKey="value" aspectRatio={4 / 3} content={<CustomContent />}>
        <Tooltip contentStyle={tipStyle} formatter={(v: any, n: any) => [v, n]} />
      </Treemap>
    </ResponsiveContainer>
  );
};

/* 12. Funnel — monotone ranking / sequential drop-off */
const FunnelRenderer: React.FC<{ q: QuestionChartData }> = ({ q }) => {
  const raw = q.data as Array<{ name: string; value: number }>;
  const items = (raw || []).filter(d => d.value > 0).slice(0, 8);
  if (!items.length) return <NoData />;
  const max = items[0]?.value || 1;
  return (
    <div className="flex flex-col gap-1 px-2 py-2">
      {items.map((item, i) => {
        const pct = Math.max(Math.round((item.value / max) * 100), 6);
        return (
          <div key={i} className="flex items-center gap-2 min-w-0">
            <span className="text-[8px] text-gray-400 w-3.5 flex-shrink-0 text-right">{i + 1}</span>
            <div className="flex-1 min-w-0 flex items-center">
              <div className="h-4 rounded-sm" style={{ width: `${pct}%`, backgroundColor: COLORS[i % COLORS.length], opacity: Math.max(0.55, 1 - i * 0.08) }} />
            </div>
            <span className="text-[9px] text-gray-600 max-w-[72px] truncate flex-shrink-0" title={item.name}>
              {item.name.length > 10 ? item.name.slice(0, 9) + '…' : item.name}
            </span>
            <span className="text-[9px] font-semibold text-gray-800 flex-shrink-0 w-9 text-right">{item.value}</span>
          </div>
        );
      })}
    </div>
  );
};

/* 13. Range bar — double-slider avg min / avg max */
const RangeBarChart: React.FC<{ q: QuestionChartData }> = ({ q }) => {
  const { avgMin, avgMax, sampleCount } = q.data || {};
  if (avgMin == null || avgMax == null) return <NoData />;
  const total = avgMax || 1;
  return (
    <div className="flex flex-col gap-3 px-3 py-3">
      {([['Avg Min', avgMin, '#4F7CFF'], ['Avg Max', avgMax, '#E8505E']] as const).map(([label, val, color]) => (
        <div key={label}>
          <div className="flex justify-between mb-1">
            <span className="text-[10px] text-gray-500">{label}</span>
            <span className="text-[10px] font-bold text-gray-800">{val}</span>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${Math.min(100, Math.max(6, (Number(val) / total) * 100))}%`, backgroundColor: color }} />
          </div>
        </div>
      ))}
      {sampleCount && <p className="text-[9px] text-gray-400 text-center mt-1">{sampleCount} responses</p>}
    </div>
  );
};

/* 14. Top Values — text/open-ended most-frequent answers */
const TopValuesChart: React.FC<{ q: QuestionChartData }> = ({ q }) => <HorizontalBarChart q={q} />;

/* ═══════════════════════════════════════════════════════════════════
   DISPATCH + CARD SHELL
═══════════════════════════════════════════════════════════════════ */

function renderChart(q: QuestionChartData): React.ReactNode {
  if (q.totalAnswered === 0) return <NoData />;
  switch (q.chartType) {
    case 'donut':
    case 'pie':             return <DonutChart q={q} />;
    case 'bar-horizontal':  return <HorizontalBarChart q={q} />;
    case 'bar-vertical':    return <VerticalBarChart q={q} />;
    case 'diverging-bar':   return <DivergingBarChart q={q} />;
    case 'grouped-bar':
    case 'max-diff-bar':    return <GroupedBarChart q={q} />;
    case 'stacked-bar':     return <StackedBarChart q={q} />;
    case 'histogram':
    case 'numeric-summary': return <HistogramChart q={q} />;
    case 'rating-stars':
    case 'rating-distribution': return <RatingStarsChart q={q} />;
    case 'radar':           return <RadarChartRenderer q={q} />;
    case 'heatmap':
    case 'matrix-grouped':  return <HeatmapChart q={q} />;
    case 'treemap':         return <TreemapChart q={q} />;
    case 'funnel':          return <FunnelRenderer q={q} />;
    case 'range-bar':
    case 'range-summary':   return <RangeBarChart q={q} />;
    case 'top-values':      return <TopValuesChart q={q} />;
    default:                return <DonutChart q={q} />;
  }
}

const ChartCard: React.FC<{ q: QuestionChartData }> = ({ q }) => (
  <div className="flex flex-col border border-gray-200 rounded-xl bg-white overflow-hidden">
    <div className="px-3 pt-3 pb-2 border-b border-gray-100">
      <p className="text-[11px] font-semibold text-gray-800 leading-snug line-clamp-2 mb-1.5" title={q.questionText}>
        {q.questionText}
      </p>
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="inline-block text-[9px] font-medium text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">
          {q.totalAnswered}/{q.totalResponses} answered
        </span>
        <span className="inline-block text-[9px] font-medium text-indigo-500 bg-indigo-50 rounded-full px-2 py-0.5">
          {CHART_LABEL[q.chartType] || q.chartType}
        </span>
      </div>
    </div>
    <div className="p-2 flex-1 overflow-hidden">
      {renderChart(q)}
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════
   MAIN — paginated 2×2 grid
═══════════════════════════════════════════════════════════════════ */

interface Props {
  questions: QuestionChartData[];
  isLoading: boolean;
}

const SurveyQuestionCharts: React.FC<Props> = ({ questions, isLoading }) => {
  const [page, setPage] = useState(0);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {[1, 2, 3, 4].map(i => (
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
        <p className="text-[10px] text-gray-400 mt-0.5">Text, file, and open-ended questions show top frequent answers</p>
      </div>
    );
  }

  const totalPages = Math.ceil(questions.length / CARDS_PER_PAGE);
  const visible = questions.slice(page * CARDS_PER_PAGE, (page + 1) * CARDS_PER_PAGE);
  const padded = [...visible, ...Array(CARDS_PER_PAGE - visible.length).fill(null)];

  return (
    <div className="space-y-3">
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
              <button key={i} onClick={() => setPage(i)}
                className={`rounded-full transition-all ${i === page ? 'w-4 h-2 bg-primary' : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'}`} />
            ))}
          </div>
          <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
            className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
            className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {padded.map((q, i) =>
          q ? (
            <ChartCard key={(q as QuestionChartData).questionId} q={q as QuestionChartData} />
          ) : (
            <div key={`pad-${i}`} className="rounded-xl border border-dashed border-gray-200 bg-gray-50/50" />
          )
        )}
      </div>
    </div>
  );
};

export default SurveyQuestionCharts;
