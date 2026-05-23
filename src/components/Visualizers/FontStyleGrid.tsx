"use client";
import React from 'react';

const FONT_STYLES: Record<string, { fontFamily: string, weight: string, letterSpacing: string, uppercase: boolean }> = {
  'Bold Serif': { fontFamily: 'serif', weight: 'font-black', letterSpacing: 'tracking-tight', uppercase: false },
  'Cyber Glitch': { fontFamily: 'monospace', weight: 'font-bold', letterSpacing: 'tracking-widest', uppercase: true },
  'Soft Rounded': { fontFamily: 'sans-serif', weight: 'font-medium', letterSpacing: 'tracking-normal', uppercase: false },
  'Blocky Impact': { fontFamily: 'sans-serif', weight: 'font-black', letterSpacing: 'tracking-tighter', uppercase: true },
  'Elegant Script': { fontFamily: 'cursive', weight: 'font-normal', letterSpacing: 'tracking-wide', uppercase: false }
};

export function FontStyleGrid({ value, onChange, availableStyles }: { value: string, onChange: (val: string) => void, availableStyles: string[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 h-48 overflow-y-auto custom-scrollbar p-1">
      {availableStyles.map((styleName) => {
        const styleDef = FONT_STYLES[styleName] || { fontFamily: 'sans-serif', weight: 'font-normal', letterSpacing: 'tracking-normal', uppercase: false };
        const isSelected = value === styleName;
        return (
          <button
            key={styleName}
            onClick={() => onChange(styleName)}
            className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all min-h-[60px] ${
              isSelected
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 shadow-sm'
                : 'border-gray-200 dark:border-[#333] hover:border-indigo-300 dark:hover:border-indigo-700'
            }`}
          >
            <span className={`text-2xl ${styleDef.weight} ${styleDef.letterSpacing} ${styleDef.uppercase ? 'uppercase' : ''} text-slate-800 dark:text-slate-200`} style={{ fontFamily: styleDef.fontFamily }}>
              Ag
            </span>
            <span className="text-[10px] text-slate-500 mt-1 font-sans text-center">{styleName}</span>
          </button>
        );
      })}
    </div>
  );
}
