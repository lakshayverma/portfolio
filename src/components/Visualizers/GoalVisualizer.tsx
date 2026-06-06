"use client";
import React from 'react';
import { MousePointerClick, BookOpen, Smile, Flame, Video, Share2, Palette, Monitor, Zap, ShieldAlert, Skull, Key, Trophy } from 'lucide-react';

const GOAL_ICONS: Record<string, React.ComponentType<any>> = {
  'High CTR': MousePointerClick,
  'Lore Focus': BookOpen,
  'Vibe / Relaxing': Smile,
  'Hype / Reaction': Flame,
  'Cinematic Stills': Video,
  'Viral Socials': Share2,
  'Concept Art Pack': Palette,
  'Desktop Wallpaper': Monitor,
  'Speedrun Hype': Zap,
  'No-Hit Run': ShieldAlert,
  'Boss Meltdown': Skull,
  'Secrets Unlocked': Key,
  'Ultimate Showcase': Trophy
};

export function GoalVisualizer({ values, onChange, availableGoals }: { values: string[], onChange: (vals: string[]) => void, availableGoals: string[] }) {
  const toggleGoal = (g: string) => {
    if (values.includes(g)) {
      onChange(values.filter(v => v !== g));
    } else {
      onChange([...values, g]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 h-48 overflow-y-auto custom-scrollbar p-1">
      {availableGoals.map((goal) => {
        const Icon = GOAL_ICONS[goal] || Trophy;
        const isSelected = values.includes(goal);
        return (
          <button
            key={goal}
            onClick={() => toggleGoal(goal)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-all ${
              isSelected
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 shadow-sm'
                : 'border-gray-200 dark:border-[#333] hover:border-indigo-300 dark:hover:border-indigo-700 text-slate-600 dark:text-slate-400'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="text-xs font-semibold">{goal}</span>
          </button>
        );
      })}
    </div>
  );
}
