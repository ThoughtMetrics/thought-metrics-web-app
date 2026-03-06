// components/configs/MatrixConfig.tsx

import React from 'react';
import { QuestionType } from '@/core/types/survey.type';
import type { IBuilderQuestion, IBuilderQuestionOption } from '@/core/types/survey-builder.type';
import { useSurveyBuilderStore } from '@/core/stores/survey-builder.store';

interface Props {
  question: IBuilderQuestion;
  qIdx: number;
}

const ItemList: React.FC<{
  label: string;
  items: IBuilderQuestionOption[];
  onAdd: () => void;
  onRemove: (i: number) => void;
  onChange: (i: number, field: 'value' | 'label', v: string) => void;
}> = ({ label, items, onAdd, onRemove, onChange }) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <span className="text-xs font-medium text-gray-700">{label}</span>
      <button onClick={onAdd} className="text-xs text-primary hover:underline font-medium">+ Add</button>
    </div>
    {items.map((item, i) => (
      <div key={i} className="flex gap-2 items-center">
        <input
          type="text"
          value={item.value}
          onChange={(e) => onChange(i, 'value', e.target.value)}
          placeholder="value"
          className="w-20 border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <input
          type="text"
          value={item.label}
          onChange={(e) => onChange(i, 'label', e.target.value)}
          placeholder="Label"
          className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <button
          onClick={() => onRemove(i)}
          disabled={items.length <= 1}
          className="text-red-400 hover:text-red-600 disabled:opacity-30"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    ))}
  </div>
);

const MatrixConfig: React.FC<Props> = ({ question, qIdx }) => {
  const { setQuestionConfig } = useSurveyBuilderStore();
  const { config, questionType } = question;

  if (questionType === QuestionType.MATRIX) {
    const rows = config.rows ?? [];
    const cols = config.columns ?? [];
    return (
      <div className="space-y-5">
        <ItemList
          label="Rows"
          items={rows}
          onAdd={() => {
            const n = rows.length + 1;
            setQuestionConfig(qIdx, { rows: [...rows, { value: `r${n}`, label: `Row ${n}` }] });
          }}
          onRemove={(i) => setQuestionConfig(qIdx, { rows: rows.filter((_, idx) => idx !== i) })}
          onChange={(i, field, v) => {
            const next = [...rows];
            next[i] = { ...next[i], [field]: v };
            setQuestionConfig(qIdx, { rows: next });
          }}
        />
        <ItemList
          label="Columns"
          items={cols}
          onAdd={() => {
            const n = cols.length + 1;
            setQuestionConfig(qIdx, { columns: [...cols, { value: `c${n}`, label: `Col ${n}` }] });
          }}
          onRemove={(i) => setQuestionConfig(qIdx, { columns: cols.filter((_, idx) => idx !== i) })}
          onChange={(i, field, v) => {
            const next = [...cols];
            next[i] = { ...next[i], [field]: v };
            setQuestionConfig(qIdx, { columns: next });
          }}
        />
      </div>
    );
  }

  if (questionType === QuestionType.MAX_DIFF) {
    const opts = config.options ?? [];
    return (
      <div className="space-y-4">
        <ItemList
          label="Options"
          items={opts}
          onAdd={() => {
            const n = opts.length + 1;
            setQuestionConfig(qIdx, { options: [...opts, { value: `opt${n}`, label: `Option ${n}` }] });
          }}
          onRemove={(i) => setQuestionConfig(qIdx, { options: opts.filter((_, idx) => idx !== i) })}
          onChange={(i, field, v) => {
            const next = [...opts];
            next[i] = { ...next[i], [field]: v };
            setQuestionConfig(qIdx, { options: next });
          }}
        />
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Items per set</label>
          <input
            type="number"
            min={2}
            value={config.itemCount ?? 3}
            onChange={(e) => setQuestionConfig(qIdx, { itemCount: Number(e.target.value) })}
            className="w-24 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>
    );
  }

  if (questionType === QuestionType.CONSTANT_SUM) {
    const opts = config.options ?? [];
    return (
      <div className="space-y-4">
        <ItemList
          label="Options"
          items={opts}
          onAdd={() => {
            const n = opts.length + 1;
            setQuestionConfig(qIdx, { options: [...opts, { value: `opt${n}`, label: `Option ${n}` }] });
          }}
          onRemove={(i) => setQuestionConfig(qIdx, { options: opts.filter((_, idx) => idx !== i) })}
          onChange={(i, field, v) => {
            const next = [...opts];
            next[i] = { ...next[i], [field]: v };
            setQuestionConfig(qIdx, { options: next });
          }}
        />
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Total</label>
          <input
            type="number"
            min={1}
            value={config.total ?? 100}
            onChange={(e) => setQuestionConfig(qIdx, { total: Number(e.target.value) })}
            className="w-24 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>
    );
  }

  return null;
};

export default MatrixConfig;
