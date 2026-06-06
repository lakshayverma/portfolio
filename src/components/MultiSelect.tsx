"use client";

import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { X, Sparkles } from 'lucide-react';

interface MultiSelectProps {
  label: string;
  values: string[];
  onChange: (newValues: string[]) => void;
  suggestions: string[];
  iconMap?: Record<string, any>;
  tagSets?: Record<string, string[]>;
  colorCode?: string;
}

export function MultiSelect({ label, values, onChange, suggestions, iconMap, tagSets, colorCode }: MultiSelectProps) {
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault();
      addValue(input.trim());
    }
  };

  const removeValue = (valToRemove: string) => onChange(values.filter(v => v !== valToRemove));
  
  const addValue = (val: string) => {
    let newTags = [...values];
    if (tagSets && tagSets[val]) {
      tagSets[val].forEach(tag => { if (!newTags.includes(tag)) newTags.push(tag); });
    } else {
      if (!newTags.includes(val)) newTags.push(val);
    }
    onChange(newTags);
    setInput(''); 
    setIsOpen(false);
  };

  const filteredSuggestions = suggestions.filter(s => s.toLowerCase().includes(input.toLowerCase()) && !values.includes(s));

  return (
    <div className="space-y-2 relative" ref={wrapperRef}>
      <label className="text-sm font-medium text-slate-700 dark:text-slate-400 flex items-center">
        {colorCode && <span className={`w-2 h-2 rounded-full ${colorCode} mr-2 shadow-sm`}></span>}
        {label}
      </label>
      <div className="min-h-[46px] bg-white dark:bg-[#1e1e1e] border border-gray-300 dark:border-[#333] rounded-xl p-2 flex flex-wrap gap-2 focus-within:border-indigo-500 transition-colors">
        {values.map(val => {
          const Icon = iconMap?.[val];
          return (
            <span key={val} className="bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-xs px-2 py-1 rounded flex items-center gap-1.5 border border-indigo-200 dark:border-indigo-500/30">
              {Icon && <Icon className="w-3 h-3" />}
              {val} 
              <button onClick={() => removeValue(val)} className="hover:text-indigo-900 dark:hover:text-white ml-1"><X className="w-3 h-3" /></button>
            </span>
          );
        })}
        <input
          type="text" value={input} onChange={(e) => { setInput(e.target.value); setIsOpen(true); }} onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          className="flex-1 min-w-[120px] bg-transparent text-sm text-slate-900 dark:text-slate-200 outline-none"
          placeholder={values.length === 0 ? "Type or select (@ macros supported)..." : ""}
        />
      </div>
      {isOpen && filteredSuggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-[#252525] border border-gray-200 dark:border-[#444] rounded-lg shadow-2xl z-20 max-h-40 overflow-y-auto">
          {filteredSuggestions.map(s => {
            const SIcon = iconMap?.[s];
            const isMacro = s.startsWith('@');
            return (
              <div key={s} onMouseDown={(e) => { e.preventDefault(); addValue(s); }} className={`px-4 py-2 text-sm cursor-pointer transition-colors flex items-center gap-2 ${isMacro ? 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/50' : 'text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-600 dark:hover:text-white'}`}>
                {SIcon && <SIcon className="w-4 h-4 opacity-70" />}
                {isMacro && <Sparkles className="w-3 h-3" />}
                {s}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
