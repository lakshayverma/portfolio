"use client";

import React from 'react';
import { SunDim, CloudFog, CloudLightning, Tv, Moon } from 'lucide-react';

export function TimeOfDayVisualizer({ value, onChange, timesOptions }: { value: string, onChange: (val: string) => void, timesOptions: string[] }) {
  const times = [
    { name: 'Golden Hour', icon: SunDim }, 
    { name: 'Overcast', icon: CloudFog }, 
    { name: 'Stormy', icon: CloudLightning }, 
    { name: 'Neon Night', icon: Tv }, 
    { name: 'Midnight', icon: Moon }
  ];

  // Try to match available options with predefined visual data
  const displayTimes = timesOptions.map(t => {
    const predefined = times.find(pt => pt.name === t);
    return predefined || { name: t, icon: SunDim };
  });

  return (
    <div className="w-full bg-gray-50 dark:bg-[#1a1c23] border border-gray-200 dark:border-[#333] rounded-xl p-6 relative overflow-hidden h-48 flex flex-col justify-end">
      <svg className="absolute top-8 left-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
        <path d="M 0,100 Q 50,0 100,100" fill="none" stroke="currentColor" className="text-gray-300 dark:text-[#333]" strokeWidth="1" strokeDasharray="4 4" />
      </svg>
      <div className="flex justify-between items-end relative z-10 w-full h-full px-2 pb-2">
        {displayTimes.map((time, i) => {
          const Icon = time.icon;
          const isSelected = value === time.name;
          const normalizedX = (i / (Math.max(displayTimes.length - 1, 1))) * 2 - 1;
          const heightPct = (1 - Math.pow(normalizedX, 2)) * 100;

          return (
            <button key={time.name} onClick={() => onChange(time.name)} className="flex flex-col items-center gap-2 group outline-none" style={{ paddingBottom: `${heightPct * 0.4}px` }}>
              <div className={`p-2 rounded-full transition-all duration-300 ${isSelected ? 'bg-indigo-500 text-white scale-125 shadow-[0_0_15px_rgba(79,70,229,0.8)]' : 'bg-gray-200 dark:bg-[#25252b] text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300 group-hover:bg-gray-300 dark:group-hover:bg-[#333]'}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className={`text-[10px] font-bold transition-colors ${isSelected ? 'text-indigo-600 dark:text-indigo-300' : 'text-slate-500 dark:text-slate-600 group-hover:text-slate-700 dark:group-hover:text-slate-400'}`}>{time.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
