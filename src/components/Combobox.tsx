"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

interface ComboboxProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: any) => void;
  options: string[];
  placeholder: string;
}

export function Combobox({ label, name, value, onChange, options, placeholder }: ComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setInputValue(value || ''); }, [value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isExactMatch = options.some(opt => opt.toLowerCase() === inputValue.toLowerCase());
  const filtered = isExactMatch ? options : options.filter(opt => opt.toLowerCase().includes(inputValue.toLowerCase()));

  const handleSelect = (opt: string) => {
    setInputValue(opt);
    onChange({ target: { name, value: opt } });
    setIsOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onChange(e);
    setIsOpen(true);
  };

  return (
    <div className="space-y-2 relative" ref={wrapperRef}>
      <label className="text-sm font-medium text-slate-700 dark:text-slate-400">{label}</label>
      <div className="relative">
        <input
          type="text" name={name} value={inputValue} onChange={handleChange} onFocus={() => setIsOpen(true)}
          className="w-full bg-white dark:bg-[#1e1e1e] border border-gray-300 dark:border-[#333] rounded-xl p-3 text-sm text-slate-900 dark:text-slate-200 focus:border-indigo-500 outline-none transition-colors pr-10"
          placeholder={placeholder} autoComplete="off"
        />
        <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
      {isOpen && filtered.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-[#252525] border border-gray-200 dark:border-[#444] rounded-lg shadow-2xl z-30 max-h-48 overflow-y-auto">
          {filtered.map(opt => (
            <div key={opt} onMouseDown={(e) => { e.preventDefault(); handleSelect(opt); }} className="px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-indigo-100 dark:hover:bg-indigo-600 dark:hover:text-white cursor-pointer transition-colors">
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
