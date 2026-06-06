"use client";

import React from 'react';
import { PlayCircle, Camera, Hash, Smartphone, MessageCircle } from 'lucide-react';

export function PlatformVisualizer({ values, onChange, platforms }: { values: string[], onChange: (vals: string[]) => void, platforms: string[] }) {
  const platformIcons: Record<string, React.ComponentType<any>> = {
    'YouTube': PlayCircle,
    'YouTube Shorts': Smartphone,
    'Instagram': Camera,
    'Twitter / X': Hash,
    'TikTok': Smartphone
  };

  const toggleValue = (val: string) => {
    if (values.includes(val)) {
      onChange(values.filter(v => v !== val));
    } else {
      onChange([...values, val]);
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 h-48 overflow-y-auto custom-scrollbar p-1">
      {platforms.map(platform => {
        const isSelected = values.includes(platform);
        const Icon = platformIcons[platform] || MessageCircle;

        return (
          <button
            key={platform}
            onClick={() => toggleValue(platform)}
            className={`relative overflow-hidden h-full min-h-[60px] rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all border-2 ${
              isSelected
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/20 shadow-lg shadow-indigo-500/20 z-10 scale-105'
                : 'border-transparent bg-white dark:bg-[#1e1e1e] hover:border-indigo-300 dark:hover:border-indigo-700 hover:scale-105 shadow-sm'
            }`}
          >
            <Icon className={`w-6 h-6 ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`} />
            <span className={`text-[10px] font-bold leading-tight text-center px-1 ${isSelected ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-600 dark:text-slate-400'}`}>
              {platform}
            </span>
          </button>
        );
      })}
    </div>
  );
}
