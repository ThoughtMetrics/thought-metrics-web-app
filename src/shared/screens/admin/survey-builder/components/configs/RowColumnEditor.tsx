// components/configs/RowColumnEditor.tsx

import React from 'react';
import type { IBuilderQuestionOption } from '@/core/types/survey-builder.type';
import { ChevronDown } from 'lucide-react';

/** Inline mini column editor for a single row (per-row mode) */
export const RowColumnEditor: React.FC<{
  rowLabel: string;
  cols: IBuilderQuestionOption[];
  onChange: (cols: IBuilderQuestionOption[]) => void;
  showIntensePurchase?: boolean;
}> = ({ rowLabel, cols, onChange, showIntensePurchase }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="ml-2 mt-1">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1 text-xs px-2 py-1 rounded border transition-colors ${
          cols.length > 0
            ? 'border-primary text-primary bg-primary/5'
            : 'border-gray-300 text-gray-400 hover:border-primary hover:text-primary'
        }`}
      >
        <span>{cols.length > 0 ? `${cols.length} option${cols.length > 1 ? 's' : ''}` : 'Add options'}</span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-150 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="mt-1.5 border border-dashed border-primary/40 rounded-lg p-2.5 space-y-1.5 bg-primary/3">
          <p className="text-xs font-medium text-gray-500 mb-1">
            Options for &quot;{rowLabel}&quot;
          </p>
          {cols.map((col, i) => (
            <div key={i} className="flex gap-1.5 items-center">
              <input
                type="text"
                value={col.value}
                onChange={(e) => {
                  const next = [...cols];
                  next[i] = { ...next[i], value: e.target.value };
                  onChange(next);
                }}
                placeholder="value"
                className="w-20 border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary bg-white"
              />
              <input
                type="text"
                value={col.label}
                onChange={(e) => {
                  const next = [...cols];
                  next[i] = { ...next[i], label: e.target.value };
                  onChange(next);
                }}
                placeholder="Label"
                className="flex-1 border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary bg-white"
              />
              {showIntensePurchase && (
                <button
                  type="button"
                  onClick={() => {
                    const next = [...cols];
                    next[i] = { ...next[i], isIntensePurchase: !col.isIntensePurchase };
                    onChange(next);
                  }}
                  className={`text-xs px-1.5 py-1 rounded border flex-shrink-0 transition-colors ${
                    col.isIntensePurchase
                      ? 'border-primary text-primary bg-primary/5'
                      : 'border-gray-300 text-gray-300'
                  }`}
                  title="Toggle intense purchase for this sub-option"
                >
                  IP
                </button>
              )}
              <button
                type="button"
                onClick={() => onChange(cols.filter((_, j) => j !== i))}
                disabled={cols.length <= 1}
                className="text-red-400 hover:text-red-600 disabled:opacity-30 flex-shrink-0"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              const n = cols.length + 1;
              onChange([...cols, { value: `c${n}`, label: `Option ${n}` }]);
            }}
            className="text-xs text-primary hover:underline font-medium"
          >
            + Add Option
          </button>
        </div>
      )}
    </div>
  );
};
