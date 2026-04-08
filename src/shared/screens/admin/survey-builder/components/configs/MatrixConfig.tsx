// components/configs/MatrixConfig.tsx

import React from 'react';
import { QuestionType } from '@/core/types/survey.type';
import type { IBuilderQuestion, IBuilderQuestionOption } from '@/core/types/survey-builder.type';
import { useSurveyBuilderStore } from '@/core/stores/survey-builder.store';
import { ChevronDown } from 'lucide-react';
import { RowColumnEditor } from './RowColumnEditor';

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
  onAttributeChange?: (i: number, attrs: Array<{ key: string; value: string }>) => void;
  renderAfter?: (item: IBuilderQuestionOption, index: number) => React.ReactNode;
  showIntensePurchasePer?: boolean;
  onIntensePurchaseToggle?: (i: number, val: boolean) => void;
}> = ({ label, items, onAdd, onRemove, onChange, onAttributeChange, renderAfter, showIntensePurchasePer, onIntensePurchaseToggle }) => {
  const [expandedAttrsIdx, setExpandedAttrsIdx] = React.useState<number | null>(null);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-700">{label}</span>
        <button onClick={onAdd} className="text-xs text-primary hover:underline font-medium">+ Add</button>
      </div>
      {items.map((item, i) => {
        const attrs = item.attributes ?? [];
        const isAttrsExpanded = expandedAttrsIdx === i;
        return (
          <div key={i} className="space-y-1">
            <div className="flex gap-2 items-center">
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
              {onAttributeChange && (
                <button
                  type="button"
                  onClick={() => setExpandedAttrsIdx(isAttrsExpanded ? null : i)}
                  title="Item attributes"
                  className={`flex items-center gap-1 text-xs px-1.5 py-1 rounded border transition-colors flex-shrink-0 ${
                    attrs.length > 0
                      ? 'border-primary text-primary bg-primary/5'
                      : 'border-gray-300 text-gray-400 hover:border-primary hover:text-primary'
                  }`}
                >
                  {attrs.length > 0 && <span className="font-medium">{attrs.length}</span>}
                  <ChevronDown
                    className={`w-3 h-3 transition-transform duration-150 ${isAttrsExpanded ? 'rotate-180' : ''}`}
                  />
                </button>
              )}
              {showIntensePurchasePer && onIntensePurchaseToggle && (
                <button
                  type="button"
                  title="Toggle intense purchase for this item"
                  onClick={() => onIntensePurchaseToggle(i, !item.isIntensePurchase)}
                  className={`text-xs px-1.5 py-1 rounded border flex-shrink-0 transition-colors ${
                    item.isIntensePurchase
                      ? 'border-primary text-primary bg-primary/5'
                      : 'border-gray-300 text-gray-300'
                  }`}
                >
                  IP
                </button>
              )}
              <button
                onClick={() => onRemove(i)}
                disabled={items.length <= 1}
                className="text-red-400 hover:text-red-600 disabled:opacity-30 flex-shrink-0"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {isAttrsExpanded && onAttributeChange && (
              <div className="border border-dashed border-primary/40 rounded-lg p-2.5 space-y-1.5 bg-primary/3">
                <p className="text-xs font-medium text-gray-600 mb-1">
                  Additional fields for &quot;{item.label || `Item ${i + 1}`}&quot;
                </p>
                {attrs.map((attr, aIdx) => (
                  <div key={aIdx} className="flex gap-1.5 items-center">
                    <input
                      type="text"
                      value={attr.key}
                      onChange={(e) => {
                        const next = [...attrs];
                        next[aIdx] = { ...next[aIdx], key: e.target.value };
                        onAttributeChange(i, next);
                      }}
                      placeholder="Field name"
                      className="w-28 border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary bg-white"
                    />
                    <input
                      type="text"
                      value={attr.value}
                      onChange={(e) => {
                        const next = [...attrs];
                        next[aIdx] = { ...next[aIdx], value: e.target.value };
                        onAttributeChange(i, next);
                      }}
                      placeholder="Value"
                      className="flex-1 border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => onAttributeChange(i, attrs.filter((_, j) => j !== aIdx))}
                      className="text-red-400 hover:text-red-600 flex-shrink-0"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => onAttributeChange(i, [...attrs, { key: '', value: '' }])}
                  className="text-xs text-primary hover:underline font-medium"
                >
                  + Add Field
                </button>
              </div>
            )}

            {renderAfter && renderAfter(item, i)}
          </div>
        );
      })}
    </div>
  );
};

const MatrixConfig: React.FC<Props> = ({ question, qIdx }) => {
  const { setQuestionConfig } = useSurveyBuilderStore();
  const { config, questionType } = question;
  const [sharedAttrsExpanded, setSharedAttrsExpanded] = React.useState(false);

  if (questionType === QuestionType.MATRIX) {
    const rows = config.rows ?? [];
    const cols = config.columns ?? [];
    const mode = config.rowOptionsMode ?? 'shared';
    const rowColumns = config.rowColumns ?? {};

    const setMode = (next: 'shared' | 'per-row') => {
      if (next === 'per-row') {
        // Seed each row with the current shared columns so nothing is lost
        const seeded: Record<string, IBuilderQuestionOption[]> = {};
        rows.forEach((r) => {
          seeded[r.value] = rowColumns[r.value] ?? [...cols];
        });
        setQuestionConfig(qIdx, { rowOptionsMode: 'per-row', rowColumns: seeded });
      } else {
        setQuestionConfig(qIdx, { rowOptionsMode: 'shared' });
      }
    };

    const updateRowCols = (rowValue: string, nextCols: IBuilderQuestionOption[]) => {
      setQuestionConfig(qIdx, {
        rowColumns: { ...rowColumns, [rowValue]: nextCols },
      });
    };

    return (
      <div className="space-y-5">
        {/* ── Mode switch ── */}
        <div className="flex items-center justify-between py-2 px-3 bg-gray-50 border border-gray-200 rounded-lg">
          <span className="text-xs font-medium text-gray-600">Different options per row</span>
          <button
            type="button"
            role="switch"
            aria-checked={mode === 'per-row'}
            onClick={() => setMode(mode === 'shared' ? 'per-row' : 'shared')}
            className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
              mode === 'per-row' ? 'bg-primary' : 'bg-gray-300'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ${
                mode === 'per-row' ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* ── Rows ── */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-700">Rows</span>
            <button
              onClick={() => {
                const n = rows.length + 1;
                const newRow = { value: `r${n}`, label: `Row ${n}` };
                const update: Partial<typeof config> = {
                  rows: [...rows, newRow],
                };
                if (mode === 'per-row') {
                  update.rowColumns = { ...rowColumns, [newRow.value]: [{ value: 'c1', label: 'Option 1' }] };
                }
                setQuestionConfig(qIdx, update);
              }}
              className="text-xs text-primary hover:underline font-medium"
            >
              + Add
            </button>
          </div>

          {rows.map((row, i) => (
            <div key={i} className="space-y-1">
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={row.value}
                  onChange={(e) => {
                    const next = [...rows];
                    const oldVal = next[i].value;
                    next[i] = { ...next[i], value: e.target.value };
                    // rename key in rowColumns if per-row
                    if (mode === 'per-row' && rowColumns[oldVal]) {
                      const { [oldVal]: moved, ...rest } = rowColumns;
                      setQuestionConfig(qIdx, {
                        rows: next,
                        rowColumns: { ...rest, [e.target.value]: moved },
                      });
                      return;
                    }
                    setQuestionConfig(qIdx, { rows: next });
                  }}
                  placeholder="value"
                  className="w-20 border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <input
                  type="text"
                  value={row.label}
                  onChange={(e) => {
                    const next = [...rows];
                    next[i] = { ...next[i], label: e.target.value };
                    setQuestionConfig(qIdx, { rows: next });
                  }}
                  placeholder="Label"
                  className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  onClick={() => {
                    const next = rows.filter((_, idx) => idx !== i);
                    const update: Partial<typeof config> = { rows: next };
                    if (mode === 'per-row') {
                      const { [row.value]: _, ...rest } = rowColumns;
                      update.rowColumns = rest;
                    }
                    setQuestionConfig(qIdx, update);
                  }}
                  disabled={rows.length <= 1}
                  className="text-red-400 hover:text-red-600 disabled:opacity-30 flex-shrink-0"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Per-row column editor */}
              {mode === 'per-row' && (
                <RowColumnEditor
                  rowLabel={row.label}
                  cols={rowColumns[row.value] ?? [{ value: 'c1', label: 'Option 1' }]}
                  onChange={(nextCols) => updateRowCols(row.value, nextCols)}
                  showIntensePurchase={config.isIntensePurchase}
                />
              )}
            </div>
          ))}
        </div>

        {/* ── Shared columns editor (only in shared mode) ── */}
        {mode === 'shared' && (
          <ItemList
            label="Columns (shared across all rows)"
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
            showIntensePurchasePer={config.isIntensePurchase}
            onIntensePurchaseToggle={(i, val) => {
              const next = [...cols];
              next[i] = { ...next[i], isIntensePurchase: val };
              setQuestionConfig(qIdx, { columns: next });
            }}
          />
        )}

        {/* ── Is intense purchase (MATRIX) ── */}
        <div className="space-y-3 pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between py-2 px-3 bg-gray-50 border border-gray-200 rounded-lg">
            <span className="text-xs font-medium text-gray-600">Is intense purchase</span>
            <button
              type="button"
              role="switch"
              aria-checked={config.isIntensePurchase ?? false}
              onClick={() => setQuestionConfig(qIdx, { isIntensePurchase: !config.isIntensePurchase })}
              className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                config.isIntensePurchase ? 'bg-primary' : 'bg-gray-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ${
                  config.isIntensePurchase ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {config.isIntensePurchase && (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Question label</label>
              <input
                type="text"
                value={config.intensePurchaseLabel ?? ''}
                onChange={(e) => setQuestionConfig(qIdx, { intensePurchaseLabel: e.target.value })}
                placeholder="Is this an intense purchase?"
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary bg-white"
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  if (questionType === QuestionType.MAX_DIFF) {
    const opts = config.options ?? [];
    const mode = config.rowOptionsMode ?? 'per-row';
    const rowColumns = config.rowColumns ?? {};
    const sharedAttrs = config.sharedOptionAttributes ?? [];

    const setMode = (next: 'shared' | 'per-row') => {
      if (next === 'per-row') {
        const sharedCols = config.columns ?? [];
        const seeded: Record<string, IBuilderQuestionOption[]> = {};
        opts.forEach((o) => {
          seeded[o.value] = rowColumns[o.value]?.length ? rowColumns[o.value] : [...sharedCols];
        });
        setQuestionConfig(qIdx, { rowOptionsMode: 'per-row', rowColumns: seeded });
      } else {
        setQuestionConfig(qIdx, { rowOptionsMode: 'shared' });
        setSharedAttrsExpanded(false);
      }
    };

    return (
      <div className="space-y-4">
        {/* ── Per-option sub-options toggle ── */}
        <div className="flex items-center justify-between py-2 px-3 bg-gray-50 border border-gray-200 rounded-lg">
          <span className="text-xs font-medium text-gray-600">Different fields per choice</span>
          <button
            type="button"
            role="switch"
            aria-checked={mode === 'per-row'}
            onClick={() => setMode(mode === 'shared' ? 'per-row' : 'shared')}
            className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
              mode === 'per-row' ? 'bg-primary' : 'bg-gray-300'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ${
                mode === 'per-row' ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <ItemList
          label="Options"
          items={opts}
          onAdd={() => {
            const n = opts.length + 1;
            const newOpt = { value: `opt${n}`, label: `Option ${n}` };
            const update: Partial<typeof config> = {
              options: [...opts, newOpt],
            };
            if (mode === 'per-row') {
              update.rowColumns = { ...rowColumns, [newOpt.value]: [] };
            }
            setQuestionConfig(qIdx, update);
          }}
          onRemove={(i) => {
            const removed = opts[i];
            const next = opts.filter((_, idx) => idx !== i);
            const update: Partial<typeof config> = { options: next };
            if (mode === 'per-row' && removed) {
              const { [removed.value]: _, ...rest } = rowColumns;
              update.rowColumns = rest;
            }
            setQuestionConfig(qIdx, update);
          }}
          onChange={(i, field, v) => {
            const next = [...opts];
            const oldVal = next[i].value;
            next[i] = { ...next[i], [field]: v };
            if (field === 'value' && mode === 'per-row' && rowColumns[oldVal]) {
              const { [oldVal]: moved, ...rest } = rowColumns;
              setQuestionConfig(qIdx, {
                options: next,
                rowColumns: { ...rest, [v]: moved },
              });
              return;
            }
            setQuestionConfig(qIdx, { options: next });
          }}
          onAttributeChange={mode === 'per-row' ? (i, attrs) => {
            const next = [...opts];
            next[i] = { ...next[i], attributes: attrs };
            setQuestionConfig(qIdx, { options: next });
          } : undefined}
        />

        {/* ── Shared additional fields (when mode === 'shared') ── */}
        {mode === 'shared' && (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 flex-1">Additional fields (shared for all options)</span>
              <button
                type="button"
                onClick={() => setSharedAttrsExpanded(!sharedAttrsExpanded)}
                title="Shared option attributes"
                className={`flex items-center gap-1 text-xs px-1.5 py-1 rounded border transition-colors flex-shrink-0 ${
                  sharedAttrs.length > 0
                    ? 'border-primary text-primary bg-primary/5'
                    : 'border-gray-300 text-gray-400 hover:border-primary hover:text-primary'
                }`}
              >
                {sharedAttrs.length > 0 && (
                  <span className="font-medium">{sharedAttrs.length}</span>
                )}
                <ChevronDown
                  className={`w-3 h-3 transition-transform duration-150 ${sharedAttrsExpanded ? 'rotate-180' : ''}`}
                />
              </button>
            </div>
            {sharedAttrsExpanded && (
              <div className="border border-dashed border-primary/40 rounded-lg p-2.5 space-y-1.5 bg-primary/3">
                <p className="text-xs font-medium text-gray-600 mb-1">Additional fields (applied to all options)</p>
                {sharedAttrs.map((attr, aIdx) => (
                  <div key={aIdx} className="flex gap-1.5 items-center">
                    <input
                      type="text"
                      value={attr.key}
                      onChange={(e) => {
                        const next = [...sharedAttrs];
                        next[aIdx] = { ...next[aIdx], key: e.target.value };
                        setQuestionConfig(qIdx, { sharedOptionAttributes: next });
                      }}
                      placeholder="Field name"
                      className="w-28 border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary bg-white"
                    />
                    <input
                      type="text"
                      value={attr.value}
                      onChange={(e) => {
                        const next = [...sharedAttrs];
                        next[aIdx] = { ...next[aIdx], value: e.target.value };
                        setQuestionConfig(qIdx, { sharedOptionAttributes: next });
                      }}
                      placeholder="Value"
                      className="flex-1 border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setQuestionConfig(qIdx, { sharedOptionAttributes: sharedAttrs.filter((_, i) => i !== aIdx) })}
                      className="text-red-400 hover:text-red-600 flex-shrink-0"
                      title="Remove field"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setQuestionConfig(qIdx, { sharedOptionAttributes: [...sharedAttrs, { key: '', value: '' }] })}
                  className="text-xs text-primary hover:underline font-medium"
                >
                  + Add Field
                </button>
              </div>
            )}
          </div>
        )}

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
    const sumMode = config.constantSumMode ?? 'constant-sum';
    const optionsMode = config.rowOptionsMode ?? 'per-row';
    const rowColumns = config.rowColumns ?? {};
    const sharedAttrsCS = config.sharedOptionAttributes ?? [];

    const setOptionsMode = (next: 'shared' | 'per-row') => {
      if (next === 'per-row') {
        const seeded: Record<string, IBuilderQuestionOption[]> = {};
        opts.forEach((o) => {
          seeded[o.value] = rowColumns[o.value] ?? [];
        });
        setQuestionConfig(qIdx, { rowOptionsMode: 'per-row', rowColumns: seeded });
      } else {
        setQuestionConfig(qIdx, { rowOptionsMode: 'shared' });
        setSharedAttrsExpanded(false);
      }
    };

    return (
      <div className="space-y-4">
        {/* ── Mode dropdown ── */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Mode</label>
          <select
            value={sumMode}
            onChange={(e) =>
              setQuestionConfig(qIdx, {
                constantSumMode: e.target.value as 'constant-sum' | 'rating-conjoint' | 'volume-conjoint',
              })
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-white"
          >
            <option value="constant-sum">Constant Sum</option>
            <option value="rating-conjoint">Rating Conjoint</option>
            <option value="volume-conjoint">Volume Conjoint</option>
          </select>
        </div>

        {/* ── Per-option sub-options toggle ── */}
        <div className="flex items-center justify-between py-2 px-3 bg-gray-50 border border-gray-200 rounded-lg">
          <span className="text-xs font-medium text-gray-600">Different fields per choice</span>
          <button
            type="button"
            role="switch"
            aria-checked={optionsMode === 'per-row'}
            onClick={() => setOptionsMode(optionsMode === 'shared' ? 'per-row' : 'shared')}
            className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
              optionsMode === 'per-row' ? 'bg-primary' : 'bg-gray-300'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ${
                optionsMode === 'per-row' ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* ── Options list ── */}
        <ItemList
          label="Options"
          items={opts}
          onAdd={() => {
            const n = opts.length + 1;
            const newOpt = { value: `opt${n}`, label: `Option ${n}` };
            const update: Partial<typeof config> = {
              options: [...opts, newOpt],
            };
            if (optionsMode === 'per-row') {
              update.rowColumns = { ...rowColumns, [newOpt.value]: [] };
            }
            setQuestionConfig(qIdx, update);
          }}
          onRemove={(i) => {
            const removed = opts[i];
            const next = opts.filter((_, idx) => idx !== i);
            const update: Partial<typeof config> = { options: next };
            if (optionsMode === 'per-row' && removed) {
              const { [removed.value]: _, ...rest } = rowColumns;
              update.rowColumns = rest;
            }
            setQuestionConfig(qIdx, update);
          }}
          onChange={(i, field, v) => {
            const next = [...opts];
            const oldVal = next[i].value;
            next[i] = { ...next[i], [field]: v };
            if (field === 'value' && optionsMode === 'per-row' && rowColumns[oldVal]) {
              const { [oldVal]: moved, ...rest } = rowColumns;
              setQuestionConfig(qIdx, {
                options: next,
                rowColumns: { ...rest, [v]: moved },
              });
              return;
            }
            setQuestionConfig(qIdx, { options: next });
          }}
          onAttributeChange={optionsMode === 'per-row' ? (i, attrs) => {
            const next = [...opts];
            next[i] = { ...next[i], attributes: attrs };
            setQuestionConfig(qIdx, { options: next });
          } : undefined}
        />

        {/* ── Shared additional fields (when optionsMode === 'shared') ── */}
        {optionsMode === 'shared' && (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 flex-1">Additional fields (shared for all options)</span>
              <button
                type="button"
                onClick={() => setSharedAttrsExpanded(!sharedAttrsExpanded)}
                title="Shared option attributes"
                className={`flex items-center gap-1 text-xs px-1.5 py-1 rounded border transition-colors flex-shrink-0 ${
                  sharedAttrsCS.length > 0
                    ? 'border-primary text-primary bg-primary/5'
                    : 'border-gray-300 text-gray-400 hover:border-primary hover:text-primary'
                }`}
              >
                {sharedAttrsCS.length > 0 && (
                  <span className="font-medium">{sharedAttrsCS.length}</span>
                )}
                <ChevronDown
                  className={`w-3 h-3 transition-transform duration-150 ${sharedAttrsExpanded ? 'rotate-180' : ''}`}
                />
              </button>
            </div>
            {sharedAttrsExpanded && (
              <div className="border border-dashed border-primary/40 rounded-lg p-2.5 space-y-1.5 bg-primary/3">
                <p className="text-xs font-medium text-gray-600 mb-1">Additional fields (applied to all options)</p>
                {sharedAttrsCS.map((attr, aIdx) => (
                  <div key={aIdx} className="flex gap-1.5 items-center">
                    <input
                      type="text"
                      value={attr.key}
                      onChange={(e) => {
                        const next = [...sharedAttrsCS];
                        next[aIdx] = { ...next[aIdx], key: e.target.value };
                        setQuestionConfig(qIdx, { sharedOptionAttributes: next });
                      }}
                      placeholder="Field name"
                      className="w-28 border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary bg-white"
                    />
                    <input
                      type="text"
                      value={attr.value}
                      onChange={(e) => {
                        const next = [...sharedAttrsCS];
                        next[aIdx] = { ...next[aIdx], value: e.target.value };
                        setQuestionConfig(qIdx, { sharedOptionAttributes: next });
                      }}
                      placeholder="Value"
                      className="flex-1 border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setQuestionConfig(qIdx, { sharedOptionAttributes: sharedAttrsCS.filter((_, i) => i !== aIdx) })}
                      className="text-red-400 hover:text-red-600 flex-shrink-0"
                      title="Remove field"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setQuestionConfig(qIdx, { sharedOptionAttributes: [...sharedAttrsCS, { key: '', value: '' }] })}
                  className="text-xs text-primary hover:underline font-medium"
                >
                  + Add Field
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Mode-specific inputs ── */}
        {sumMode === 'constant-sum' && (
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
        )}

        {sumMode === 'rating-conjoint' && (
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Max rating per option</label>
            <input
              type="number"
              min={1}
              value={config.ratingConjointMax ?? 10}
              onChange={(e) => setQuestionConfig(qIdx, { ratingConjointMax: Number(e.target.value) })}
              className="w-24 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        )}

        {sumMode === 'volume-conjoint' && (
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Price attribute key</label>
            <input
              type="text"
              value={config.volumeMultiplierKey ?? ''}
              onChange={(e) => setQuestionConfig(qIdx, { volumeMultiplierKey: e.target.value })}
              placeholder="e.g. price"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default MatrixConfig;
