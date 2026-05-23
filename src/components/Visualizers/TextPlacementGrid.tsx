"use client";

import React from 'react';

export function TextPlacementGrid({ value, onChange }: { value: string, onChange: (val: string) => void }) {
  const grids = ['Top Left', 'Top Center', 'Top Right', 'Center Left', 'Center', 'Center Right', 'Bottom Left', 'Bottom Center', 'Bottom Right'];
  
  return (
    <div className="w-48 h-48 grid grid-cols-3 grid-rows-3 gap-1 bg-gray-50 dark:bg-[#1a1c23] p-1 border border-gray-200 dark:border-[#333] rounded-xl flex-shrink-0">
      {grids.map(pos => (
        <button
          key={pos} onClick={() => onChange(pos)} title={pos}
          className={`rounded flex items-center justify-center transition-all ${value === pos ? 'bg-indigo-500 dark:bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.5)] border border-indigo-400' : 'bg-gray-200 dark:bg-[#25252b] hover:bg-gray-300 dark:hover:bg-[#333] border border-transparent'}`}
        >
          {value === pos && <div className="w-2 h-2 bg-white rounded-sm" />}
        </button>
      ))}
    </div>
  );
}
