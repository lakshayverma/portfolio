"use client";

import React from 'react';
import { Monitor, Palette, Skull, Sparkles, Camera, Map } from 'lucide-react';

export function ImageStyleGrid({ value, onChange, styles }: { value: string, onChange: (val: string) => void, styles: string[] }) {
  // Predefined visual data for common styles
  const stylesInfo = [
    { name: 'Cinematic 3D', bg: 'bg-gradient-to-br from-blue-900 to-slate-900', icon: Monitor },
    { name: 'Stylized 2D', bg: 'bg-gradient-to-br from-emerald-500 to-teal-900', icon: Palette },
    { name: 'Dark Fantasy Art', bg: 'bg-gradient-to-br from-red-900 to-black', icon: Skull },
    { name: 'Anime Style', bg: 'bg-gradient-to-br from-pink-500 to-purple-900', icon: Sparkles },
    { name: 'Broadcast Realism', bg: 'bg-gradient-to-br from-indigo-600 to-blue-900', icon: Camera },
  ];

  // Try to use styles from the dictionary, fallback to provided style name
  const displayStyles = styles.slice(0, 5).map(styleName => {
    const predefined = stylesInfo.find(s => s.name === styleName);
    if (predefined) return predefined;
    return { name: styleName, bg: 'bg-gradient-to-br from-slate-700 to-slate-900', icon: Map };
  });

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
      {displayStyles.map((style) => {
        const Icon = style.icon;
        const isSelected = value === style.name;
        return (
          <button key={style.name} onClick={() => onChange(style.name)} className={`relative overflow-hidden h-24 rounded-xl flex flex-col items-center justify-center gap-2 transition-all border-2 ${isSelected ? 'border-indigo-500 scale-105 shadow-lg shadow-indigo-500/20' : 'border-transparent opacity-60 hover:opacity-100 hover:scale-105'}`}>
            <div className={`absolute inset-0 opacity-80 ${style.bg}`} />
            <Icon className="w-6 h-6 text-white relative z-10" />
            <span className="text-[10px] font-bold text-white relative z-10 text-center px-1 leading-tight">{style.name}</span>
          </button>
        );
      })}
    </div>
  );
}
