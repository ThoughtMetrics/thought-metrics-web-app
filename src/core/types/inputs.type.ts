// inputs.type.ts
export interface BaseInputProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  className?: string;
}

export interface TextInputProps extends BaseInputProps {
  type?: 'text' | 'email' | 'tel' | 'password' | 'url';
  placeholder?: string;
  helperText?: string;
}

export interface TextareaProps extends Omit<BaseInputProps, 'onChange'> {
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  placeholder?: string;
}

export interface CheckboxProps {
  id: string;
  name: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  customLabelComponent?: React.ReactNode;
  className?: string;
  error?: string;
  required?: boolean;
}

export interface CountryCode {
  code: string;
  country: string;
}

export interface PhoneInputProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  countryCode?: string;
  onCountryCodeChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  countryCodes?: CountryCode[];
  error?: string;
  required?: boolean;
  className?: string;
}

// Select Dropdown Interface
export interface SelectOption {
  code?: string;
  name?: string;
  value?: string;
  label?: string;
}

export interface SelectProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
  error?: string;
  required?: boolean;
  className?: string;
  placeholder?: string;
  helperText?: string;
}

// Checkbox Group Interface
export interface CheckboxGroupOption {
  id: string;
  label: string;
}

export interface CheckboxGroupProps {
  label: string;
  options: CheckboxGroupOption[];
  selectedValues: string[];
  onChange: (selectedValues: string[]) => void;
  className?: string;
  columns?: number;
}
