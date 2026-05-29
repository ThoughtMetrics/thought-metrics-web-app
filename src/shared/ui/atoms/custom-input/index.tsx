// src/shared/ui/atoms/custom-input/index.tsx
import type {
  CheckboxGroupProps,
  CheckboxProps,
  PhoneInputProps,
  SelectProps,
  TextareaProps,
  TextInputProps,
} from '@/core/types/inputs.type';
import { COUNTRY_CODES } from '@/core/constants/country-codes';
import type React from 'react';

const fieldCls =
  'w-full rounded-xl px-4 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-primary/20';
const fieldStyle = (err?: string): React.CSSProperties => ({
  background: 'var(--surface-container)',
  border: `1px solid ${err ? 'var(--error)' : 'color-mix(in srgb, var(--outline-variant) 30%, transparent)'}`,
  color: 'var(--on-surface)',
  fontFamily: 'inherit',
});
const labelCls = 'block text-xs font-semibold text-on-surface-variant mb-1.5 tracking-[0.01em]';
const errCls = 'mt-1 text-xs';

// Text Input Atom
const TextInputAtom: React.FC<TextInputProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  error,
  required = false,
  type = 'text',
  placeholder,
  helperText,
  className = '',
}) => {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className={labelCls}>
          {label}{required && <span style={{ color: 'var(--error)' }}> *</span>}
        </label>
      )}
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={fieldCls}
        style={fieldStyle(error)}
      />
      {error && <p className={errCls} style={{ color: 'var(--error)' }}>{error}</p>}
      {!error && helperText && <p className={errCls} style={{ color: 'var(--on-surface-variant)' }}>{helperText}</p>}
    </div>
  );
};

// Textarea Atom
const TextareaAtom: React.FC<TextareaProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  error,
  required = false,
  rows = 6,
  placeholder,
  className = '',
}) => {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className={labelCls}>
          {label}{required && <span style={{ color: 'var(--error)' }}> *</span>}
        </label>
      )}
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
        className={`${fieldCls} resize-vertical`}
        style={fieldStyle(error)}
      />
      {error && <p className={errCls} style={{ color: 'var(--error)' }}>{error}</p>}
    </div>
  );
};

// Checkbox Atom
const CheckboxAtom: React.FC<CheckboxProps> = ({
  id,
  name,
  checked,
  onChange,
  label,
  customLabelComponent,
  className = '',
  error,
  required = false,
}) => {
  return (
    <div>
      <label className={`flex items-start gap-3 cursor-pointer ${className}`}>
        <input
          type="checkbox"
          id={id}
          name={name}
          checked={checked}
          onChange={onChange}
          className="mt-0.5 h-4 w-4 rounded flex-shrink-0"
          style={{ accentColor: 'var(--primary)' }}
        />
        <span className="text-sm text-on-surface-variant leading-relaxed">
          {required && <span style={{ color: 'var(--error)' }}>* </span>}
          {label ?? customLabelComponent}
        </span>
      </label>
      {error && <p className={errCls} style={{ color: 'var(--error)' }}>{error}</p>}
    </div>
  );
};

// Phone Input Atom
const PhoneInputAtom: React.FC<PhoneInputProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  countryCode = '+91',
  onCountryCodeChange,
  countryCodes = [
    { code: '+91', country: 'India' },
    { code: '+1', country: 'USA' },
    { code: '+44', country: 'UK' },
  ],
  error,
  required = false,
  className = '',
}) => {
  const selectedCountry = COUNTRY_CODES.find((c) => c.code === countryCode);
  const maxLen = selectedCountry?.length ?? 15;

  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className={labelCls}>
          {label}{required && <span style={{ color: 'var(--error)' }}> *</span>}
        </label>
      )}
      <div className="flex gap-2">
        <select
          value={countryCode}
          onChange={onCountryCodeChange}
          className="rounded-xl px-3 py-3 text-sm outline-none"
          style={{ ...fieldStyle(error), maxWidth: '7rem' }}
        >
          {countryCodes.map((c) => (
            <option key={c.code} value={c.code}>{c.code}</option>
          ))}
        </select>
        <input
          type="tel"
          inputMode="numeric"
          id={id}
          name={name}
          value={value}
          maxLength={maxLen}
          onChange={(e) => {
            e.target.value = e.target.value.replace(/\D/g, '').slice(0, maxLen);
            onChange(e);
          }}
          className={`${fieldCls} flex-1`}
          style={fieldStyle(error)}
        />
      </div>
      {error && <p className={errCls} style={{ color: 'var(--error)' }}>{error}</p>}
    </div>
  );
};

const SelectAtom: React.FC<SelectProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  options,
  error,
  required = false,
  className = '',
  placeholder = 'Select an option',
  helperText,
}) => {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className={labelCls}>
          {label}{required && <span style={{ color: 'var(--error)' }}> *</span>}
        </label>
      )}
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className={fieldCls}
        style={fieldStyle(error)}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option
            key={option.code ?? option.value ?? option.name}
            value={option.name ?? option.value ?? option.code}
          >
            {option.name ?? option.label}
          </option>
        ))}
      </select>
      {error && <p className={errCls} style={{ color: 'var(--error)' }}>{error}</p>}
      {!error && helperText && <p className={errCls} style={{ color: 'var(--on-surface-variant)' }}>{helperText}</p>}
    </div>
  );
};

// Checkbox Group Atom
const CheckboxGroupAtom: React.FC<CheckboxGroupProps> = ({
  label,
  options,
  selectedValues,
  onChange,
  className = '',
  columns = 2,
}) => {
  const addOption = (optionId: string) => onChange([...selectedValues, optionId]);
  const removeOption = (optionId: string) => onChange(selectedValues.filter((v) => v !== optionId));
  const gridClass = columns === 2 ? 'md:grid-cols-2' : `md:grid-cols-${String(columns)}`;

  return (
    <div className={className}>
      {label && <label className={`${labelCls} mb-3`}>{label}</label>}
      <div className={`grid grid-cols-1 ${gridClass} gap-2`}>
        {options.map((option) => {
          const checked = selectedValues.includes(option.id);
          return (
            <label
              key={option.id}
              className="flex items-start gap-2.5 p-2.5 px-3.5 rounded-xl cursor-pointer transition-all"
              style={{
                background: checked ? 'color-mix(in srgb, var(--primary) 8%, transparent)' : 'var(--surface-container)',
                border: `1px solid ${checked ? 'var(--primary)' : 'color-mix(in srgb, var(--outline-variant) 30%, transparent)'}`,
              }}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={(e) => e.target.checked ? addOption(option.id) : removeOption(option.id)}
                className="mt-0.5 h-4 w-4 rounded flex-shrink-0"
                style={{ accentColor: 'var(--primary)' }}
              />
              <span className="text-sm leading-snug select-none" style={{ color: checked ? 'var(--on-surface)' : 'var(--on-surface-variant)' }}>
                {option.label}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

const CheckboxOutlineGroupAtom: React.FC<CheckboxGroupProps> = ({
  label,
  options,
  selectedValues,
  onChange,
  className = '',
  columns = 2,
}) => {
  const addOption = (optionId: string) => onChange([...selectedValues, optionId]);
  const removeOption = (optionId: string) => onChange(selectedValues.filter((v) => v !== optionId));
  const gridClass = columns === 2 ? 'md:grid-cols-2' : `md:grid-cols-${String(columns)}`;

  return (
    <div className={className}>
      {label && <label className={`${labelCls} mb-3`}>{label}</label>}
      <div className={`grid grid-cols-1 w-fit ${gridClass} gap-3`}>
        {options.map((option) => {
          const checked = selectedValues.includes(option.id);
          return (
            <label
              key={option.id}
              className="flex items-center gap-4 rounded-xl px-4 py-3 cursor-pointer transition-all"
              style={{
                background: checked ? 'color-mix(in srgb, var(--primary) 8%, transparent)' : 'var(--surface-container)',
                border: `1px solid ${checked ? 'var(--primary)' : 'color-mix(in srgb, var(--outline-variant) 30%, transparent)'}`,
              }}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={(e) => e.target.checked ? addOption(option.id) : removeOption(option.id)}
                className="h-4 w-4 rounded flex-shrink-0"
                style={{ accentColor: 'var(--primary)' }}
              />
              <span className="text-sm leading-snug select-none" style={{ color: checked ? 'var(--on-surface)' : 'var(--on-surface-variant)' }}>
                {option.label}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export {
  TextInputAtom,
  TextareaAtom,
  CheckboxAtom,
  PhoneInputAtom,
  SelectAtom,
  CheckboxGroupAtom,
  CheckboxOutlineGroupAtom,
};
