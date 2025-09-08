// src/shared/ui/atoms/custom-input/index.tsx
import type {
  CheckboxGroupProps,
  CheckboxProps,
  PhoneInputProps,
  SelectProps,
  TextareaProps,
  TextInputProps,
} from '@/core/types/inputs.type';
import type React from 'react';

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
  className = '',
}) => {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-black mb-2">
        {label}
        {required && '*'}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border-b-2 bg-custom-grey-5 focus:bg-white focus:outline-none transition-colors ${
          error ? 'border-primary' : 'border-custom-grey-2 focus:border-primary'
        }`}
      />
      {error && <p className="mt-1 text-sm text-primary">{error}</p>}
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
      <label htmlFor={id} className="block text-sm font-medium text-black mb-2">
        {label}
        {required && '*'}
      </label>
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border-b-2 bg-custom-grey-5 focus:bg-white focus:outline-none transition-colors resize-vertical ${
          error ? 'border-primary' : 'border-custom-grey-2 focus:border-primary'
        }`}
      />
      {error && <p className="mt-1 text-sm text-primary">{error}</p>}
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
  className = '',
}) => {
  return (
    <label className={`flex items-start space-x-3 ${className}`}>
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={checked}
        onChange={onChange}
        className="mt-1 h-4 w-4 text-primary focus:text-primary border-custom-grey-2 rounded"
      />
      <span className="text-sm text-black">{label}</span>
    </label>
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
  className = '',
}) => {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-black mb-2">
        {label}
      </label>
      <div className="flex">
        <select
          className="px-2 py-2 border-b-2 border-custom-grey-2 bg-custom-grey-5 focus:border-primary focus:bg-white focus:outline-none border-r-2"
          value={countryCode}
          onChange={onCountryCodeChange}
        >
          {countryCodes.map((country) => (
            <option key={country.code} value={country.code}>
              {country.code}
            </option>
          ))}
        </select>
        <input
          type="tel"
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          className="flex-1 px-3 py-2 border-b-2 border-custom-grey-2 bg-custom-grey-5 focus:border-primary focus:bg-white focus:outline-none transition-colors"
        />
      </div>
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
}) => {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-black mb-2">
        {label}
        {required && '*'}
      </label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-3 py-2 border-b-2 bg-custom-grey-5 focus:bg-white focus:outline-none transition-colors ${
          error ? 'border-primary' : 'border-custom-grey-2 focus:border-primary'
        }`}
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
      {error && <p className="mt-1 text-sm text-primary">{error}</p>}
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
  const addOption = (optionId: string) => {
    onChange([...selectedValues, optionId]);
  };

  const removeOption = (optionId: string) => {
    onChange(selectedValues.filter((value) => value !== optionId));
  };

  const gridClass =
    columns === 2 ? 'md:grid-cols-2' : `md:grid-cols-${String(columns)}`;

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-black mb-3">
        {label}
      </label>
      <div className={`grid grid-cols-1 ${gridClass} gap-2`}>
        {options.map((option) => (
          <label key={option.id} className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={selectedValues.includes(option.id)}
              onChange={(e) =>
                e.target.checked
                  ? addOption(option.id)
                  : removeOption(option.id)
              }
              className="mt-1 h-4 w-4 text-primary focus:text-primary border-custom-grey-2 rounded"
            />
            <span className="text-sm text-black">{option.label}</span>
          </label>
        ))}
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
  const addOption = (optionId: string) => {
    onChange([...selectedValues, optionId]);
  };

  const removeOption = (optionId: string) => {
    onChange(selectedValues.filter((value) => value !== optionId));
  };

  const gridClass =
    columns === 2 ? 'md:grid-cols-2' : `md:grid-cols-${String(columns)}`;

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-black mb-3">
        {label}
      </label>
      <div className={`grid grid-cols-1 w-fit ${gridClass} gap-4`}>
        {options.map((option) => (
          <label
            key={option.id}
            className="flex items-center space-x-8 border-1 border-custom-grey-2 px-4 py-3 rounded relative"
          >
            <div className="absolute justify-center left-0 top-0 bg-custom-grey-1 h-full w-12 rounded-l border-r-1 border-custom-grey-2"></div>
            <input
              type="checkbox"
              checked={selectedValues.includes(option.id)}
              onChange={(e) =>
                e.target.checked
                  ? addOption(option.id)
                  : removeOption(option.id)
              }
              className="bg-white mt-0.5 h-4 w-4 text-primary focus:text-primary border-custom-grey-2 rounded"
            />
            <span className="text-sm text-black">{option.label}</span>
          </label>
        ))}
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
