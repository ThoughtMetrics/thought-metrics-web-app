import React, { useState, useRef, useEffect } from 'react';
import { COUNTRY_CODES, DEFAULT_COUNTRY, type CountryCode } from '@/core/constants/country-codes';

interface PhoneAnswer {
  value: string;
  countryCode: string;
}

interface PhoneInputFieldProps {
  answer: PhoneAnswer | undefined;
  onChange: (answer: PhoneAnswer) => void;
  placeholder?: string;
}

export const PhoneInputField: React.FC<PhoneInputFieldProps> = ({
  answer,
  onChange,
  placeholder = 'Enter phone number',
}) => {
  const selectedCode = answer?.countryCode ?? DEFAULT_COUNTRY.code;
  // When multiple countries share a code (e.g. +1), pick the first match — same as mobile
  const selectedCountry =
    COUNTRY_CODES.find(c => c.code === selectedCode) ?? DEFAULT_COUNTRY;

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const filtered = search.trim()
    ? COUNTRY_CODES.filter(
        c =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.code.includes(search)
      )
    : COUNTRY_CODES;

  // Close on outside click
  useEffect(() => {
    if (!dropdownOpen) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [dropdownOpen]);

  // Focus search when dropdown opens
  useEffect(() => {
    if (dropdownOpen) searchRef.current?.focus();
  }, [dropdownOpen]);

  const handleCountrySelect = (country: CountryCode) => {
    setDropdownOpen(false);
    setSearch('');
    const maxLen = country.length ?? 15;
    onChange({
      value: (answer?.value ?? '').slice(0, maxLen),
      countryCode: country.code,
    });
  };

  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '');
    const maxLen = selectedCountry.length ?? 15;
    onChange({
      value: digits.slice(0, maxLen),
      countryCode: selectedCode,
    });
  };

  return (
    <div className="relative flex w-full border-b-2 bg-custom-grey-5 focus-within:bg-surface-container focus-within:border-primary border-custom-grey-2 transition-colors">
      {/* Country picker button */}
      <div ref={dropdownRef} className="relative flex-shrink-0">
        <button
          type="button"
          onClick={() => setDropdownOpen(prev => !prev)}
          className="flex items-center gap-1.5 px-3 py-3 border-r-2 border-custom-grey-2 h-full focus:outline-none"
        >
          <span className="text-lg leading-none">{selectedCountry.flag}</span>
          <span className="text-base text-on-surface">{selectedCountry.code}</span>
          <svg
            className="w-4 h-4 text-custom-grey-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown */}
        {dropdownOpen && (
          <div className="absolute left-0 top-full z-50 w-72 bg-surface-container border border-outline-variant rounded-lg shadow-lg mt-1 flex flex-col max-h-72">
            {/* Search */}
            <div className="p-2 border-b border-gray-100 flex-shrink-0">
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search country or code..."
                className="w-full px-3 py-2 text-sm border border-outline-variant rounded-md focus:outline-none focus:border-primary"
              />
            </div>

            {/* List */}
            <div className="overflow-y-auto flex-1">
              {filtered.length === 0 ? (
                <p className="text-center text-outline text-sm py-4">No countries found</p>
              ) : (
                filtered.map((country, idx) => {
                  const isSelected = country.code === selectedCode;
                  return (
                    <button
                      key={`${country.code}-${country.name}-${idx}`}
                      type="button"
                      onClick={() => handleCountrySelect(country)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-0 ${
                        isSelected ? 'bg-primary/10' : ''
                      }`}
                    >
                      <span className="text-xl leading-none flex-shrink-0">{country.flag}</span>
                      <span
                        className={`flex-1 text-sm text-gray-800 truncate ${isSelected ? 'font-semibold' : ''}`}
                      >
                        {country.name}
                      </span>
                      <span
                        className={`text-sm flex-shrink-0 ${isSelected ? 'text-primary font-semibold' : 'text-outline'}`}
                      >
                        {country.code}
                      </span>
                      {isSelected && (
                        <svg
                          className="w-4 h-4 text-primary flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* Phone number input */}
      <input
        type="tel"
        inputMode="numeric"
        value={answer?.value ?? ''}
        onChange={handlePhoneInput}
        placeholder={placeholder}
        maxLength={selectedCountry.length ?? 15}
        className="flex-1 px-4 py-3 bg-transparent focus:outline-none text-base md:text-lg"
      />
    </div>
  );
};
