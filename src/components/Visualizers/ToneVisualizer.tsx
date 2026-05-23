"use client";
import React from 'react';
import { Mountain, Skull, Coffee, Eye, Zap, Target, Palette } from 'lucide-react';

const TONE_ICONS: Record<string, React.ElementType> = {
  'Epic': Mountain, 'Grim': Skull, 'Cozy': Coffee, 'Mysterious': Eye,
  'Action-Packed': Zap, 'Tactical': Target
};

export function ToneVisualizer({ values, onChange, availableTones }: { values: string[], onChange: (vals: string[]) => void, availableTones: string[] }) {
  const toggleTone = (t: string) => {
    if (values.includes(t)) {
      onChange(values.filter(v => v !== t));
    } else {
      onChange([...values, t]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 h-48 overflow-y-auto custom-scrollbar p-1">
      {availableTones.map((tone) => {
        const Icon = TONE_ICONS[tone] || Palette;
        const isSelected = values.includes(tone);
        return (
          <button
            key={tone}
            onClick={() => toggleTone(tone)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-all ${
              isSelected
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 shadow-sm'
                : 'border-gray-200 dark:border-[#333] hover:border-indigo-300 dark:hover:border-indigo-700 text-slate-600 dark:text-slate-400'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="text-xs font-semibold">{tone}</span>
          </button>
        );
      })}
    </div>
  );
}
