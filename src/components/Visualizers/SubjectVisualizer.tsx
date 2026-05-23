"use client";
import React from 'react';
import { Gamepad2 } from 'lucide-react';

export function SubjectVisualizer({ value, onChange, subjects }: { value: string, onChange: (val: string) => void, subjects: { id: string, name: string }[] }) {
  const getGradient = (id: string) => {
    const sum = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const hues = ['from-rose-500 to-orange-500', 'from-emerald-500 to-teal-500', 'from-blue-500 to-indigo-500', 'from-fuchsia-500 to-pink-500', 'from-violet-500 to-purple-500'];
    return hues[sum % hues.length];
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 h-48 overflow-y-auto custom-scrollbar p-1">
      {subjects.map((subj) => {
        const isSelected = value === subj.id;
        return (
          <button
            key={subj.id}
            onClick={() => onChange(subj.id)}
            className={`relative overflow-hidden h-full min-h-[60px] rounded-xl flex flex-col items-center justify-center gap-1 transition-all border-2 ${
              isSelected
                ? 'border-indigo-500 scale-105 shadow-lg shadow-indigo-500/20 z-10'
                : 'border-transparent opacity-80 hover:opacity-100 hover:scale-105'
            }`}
          >
            <div className={`absolute inset-0 opacity-80 bg-gradient-to-br ${getGradient(subj.id)}`} />
            <Gamepad2 className="w-5 h-5 text-white relative z-10" />
            <span className="text-[10px] font-bold text-white relative z-10 text-center px-1 leading-tight">{subj.name}</span>
          </button>
        );
      })}
    </div>
  );
}
