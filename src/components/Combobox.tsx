"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Check } from 'lucide-react';

type OptionType = string | { value: string; label: string };

interface ComboboxProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: { target: { name: string; value: string } }) => void;
  options: OptionType[];
  placeholder: string;
  colorCode?: string;
}

export function Combobox({ label, name, value, onChange, options, placeholder, colorCode }: ComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Normalize options to object format
  const normalizedOptions = options.map(opt => 
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  );

  useEffect(() => {
    const matched = normalizedOptions.find(o => o.value === value);
    setInputValue(matched ? matched.label : (value || ''));
  }, [value, options]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter options based on input value. If the input exactly matches the selected label, show everything (don't filter).
  const currentLabel = normalizedOptions.find(o => o.value === value)?.label || value;
  const isExactSelectedMatch = inputValue.toLowerCase() === currentLabel.toLowerCase();
  
  const filtered = isExactSelectedMatch 
    ? normalizedOptions 
    : normalizedOptions.filter(opt => opt.label.toLowerCase().includes(inputValue.toLowerCase()));

  const handleSelect = (opt: { value: string; label: string }) => {
    setInputValue(opt.label);
    onChange({ target: { name, value: opt.value } });
    setIsOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setIsOpen(true);
  };

  return (
    <div className="space-y-2 relative" ref={wrapperRef}>
      <label className="text-sm font-medium text-slate-700 dark:text-slate-400 flex items-center">
        {colorCode && <span className={`w-2 h-2 rounded-full ${colorCode} mr-2 shadow-sm`}></span>}
        {label}
      </label>
      <div className="relative">
        <input
          type="text" name={name} value={inputValue} onChange={handleChange} onFocus={() => setIsOpen(true)}
          className="w-full bg-white dark:bg-[#1e1e1e] border border-gray-300 dark:border-[#333] rounded-xl p-3 text-sm text-slate-900 dark:text-slate-200 focus:border-indigo-500 outline-none transition-colors pr-10"
          placeholder={placeholder} autoComplete="off"
        />
        <ChevronDown 
          className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer" 
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>
      {isOpen && filtered.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-[#252525] border border-gray-200 dark:border-[#444] rounded-lg shadow-2xl z-30 max-h-48 overflow-y-auto custom-scrollbar">
          {filtered.map(opt => {
            const isSelected = value === opt.value;
            return (
              <div 
                key={opt.value} 
                onMouseDown={(e) => { e.preventDefault(); handleSelect(opt); }} 
                className={`px-4 py-2 text-sm flex items-center justify-between cursor-pointer transition-colors ${
                  isSelected 
                    ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-medium' 
                    : 'text-slate-700 dark:text-slate-300 hover:bg-indigo-100 dark:hover:bg-indigo-600 dark:hover:text-white'
                }`}
              >
                {opt.label}
                {isSelected && <Check className="w-4 h-4" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
