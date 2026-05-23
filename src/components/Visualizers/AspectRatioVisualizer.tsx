"use client";

import React from 'react';

export function AspectRatioVisualizer({ primary, secondary }: { primary: string, secondary: string }) {
  const parseRatio = (r: string) => {
    const [w, h] = r.split(':').map(Number);
    return (w && h) ? w / h : 16/9;
  };
  
  const pRatio = parseRatio(primary);
  const sRatio = parseRatio(secondary);

  return (
    <div className="w-full flex justify-center items-center h-32 bg-gray-50 dark:bg-[#1a1c23] border border-gray-200 dark:border-[#333] rounded-xl overflow-hidden p-4">
      <div 
        className="relative bg-white dark:bg-slate-800 border-2 border-indigo-500 rounded flex items-center justify-center shadow-lg transition-all duration-300"
        style={{ aspectRatio: pRatio, height: pRatio >= 1 ? '100%' : 'auto', width: pRatio < 1 ? '100%' : 'auto', maxHeight: '100%', maxWidth: '100%' }}
      >
        <span className="absolute top-1 left-2 text-[10px] text-indigo-500 dark:text-indigo-300 font-bold opacity-70">Primary {primary}</span>
        
        <div 
          className="absolute border-2 border-dashed border-emerald-500 bg-emerald-500/10 rounded flex items-center justify-center transition-all duration-300"
          style={{ aspectRatio: sRatio, height: sRatio >= pRatio ? '100%' : 'auto', width: sRatio < pRatio ? '100%' : 'auto', maxHeight: '100%', maxWidth: '100%' }}
        >
           <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold opacity-80 text-center">Safe<br/>{secondary}</span>
        </div>
      </div>
    </div>
  );
}
