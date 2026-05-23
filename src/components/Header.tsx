"use client";

import React, { useRef, useState, useEffect } from 'react';
import { Search, Save, Plus, ChevronDown, Image as ImageIcon, Sun, Moon, Monitor, Settings } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { PromptConfig } from '../services/db';
import { AISettingsModal } from './AISettingsModal';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filteredPrompts: PromptConfig[];
  currentConfigId: string;
  onSelectConfig: (config: PromptConfig) => void;
  onNewConfig: () => void;
  onSave: (isNew: boolean) => void;
  availableGames?: { value: string; label: string }[];
}

export function Header({
  searchQuery, setSearchQuery, filteredPrompts, currentConfigId, onSelectConfig, onNewConfig, onSave, availableGames
}: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAISettingsOpen, setIsAISettingsOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<string>('All');
  const searchRef = useRef<HTMLDivElement>(null);

  const fuzzyMatch = (text: string, query: string): boolean => {
    if (!query) return true;
    const cleanText = text.toLowerCase();
    const cleanQuery = query.toLowerCase();
    
    // Direct inclusion check
    if (cleanText.includes(cleanQuery)) return true;
    
    let queryIdx = 0;
    for (let textIdx = 0; textIdx < cleanText.length; textIdx++) {
      if (cleanText[textIdx] === cleanQuery[queryIdx]) {
        queryIdx++;
        if (queryIdx === cleanQuery.length) return true;
      }
    }
    return false;
  };

  const finalPrompts = filteredPrompts.filter(p => {
    const matchesSearch = fuzzyMatch(p.title, searchQuery) || 
                          fuzzyMatch(p.subjectId || '', searchQuery) || 
                          fuzzyMatch(p.promptSyntax || '', searchQuery);
    const matchesGame = selectedGame === 'All' || p.subjectId === selectedGame;
    return matchesSearch && matchesGame;
  });

  useEffect(() => {
    setMounted(true);
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 flex-none bg-white dark:bg-[#1e1e1e] border-b border-gray-200 dark:border-[#333] px-4 md:px-6 flex items-center justify-between z-40">
      <div className="flex items-center gap-2 md:gap-3">
        <ImageIcon className="w-5 h-5 md:w-6 md:h-6 text-indigo-500 dark:text-indigo-400 animate-pulse" />
        <h1 className="text-base md:text-lg font-medium text-slate-800 dark:text-slate-100 tracking-wide hidden sm:block">
          Prompt Studio<span className="text-xs text-indigo-500 ml-1 font-bold">Next</span>
        </h1>
        <Link 
          href="/obs/editor" 
          className="ml-3 px-3 py-1.5 bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 text-xs font-semibold rounded-lg hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500 dark:hover:text-white transition-all flex items-center gap-1.5"
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>OBS Overlays</span>
        </Link>
      </div>

      <div className="flex-1 max-w-xl mx-4 md:mx-8 relative" ref={searchRef}>
        <div className="flex items-center bg-gray-100 dark:bg-[#2d2d2d] rounded-full px-2 py-1.5 border border-transparent focus-within:border-indigo-500/50">
          <Search className="w-4 h-4 text-slate-500 dark:text-slate-400 ml-2 mr-2 flex-shrink-0" />
          
          {availableGames && availableGames.length > 0 && (
            <select
              value={selectedGame}
              onChange={(e) => setSelectedGame(e.target.value)}
              className="bg-transparent text-sm text-slate-700 dark:text-slate-300 outline-none border-r border-gray-300 dark:border-[#444] pr-2 mr-2 hidden sm:block max-w-[120px]"
            >
              <option value="All">All Games</option>
              {availableGames.map(game => (
                <option key={game.value} value={game.value}>{game.label}</option>
              ))}
            </select>
          )}

          <input 
            type="text" placeholder="Search templates..." 
            value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setIsSearchOpen(true); }}
            onFocus={() => setIsSearchOpen(true)}
            className="w-full bg-transparent text-sm text-slate-800 dark:text-slate-100 outline-none min-w-[100px] py-0.5"
          />
          <ChevronDown className="w-4 h-4 text-slate-500 mr-2 hidden md:block" />
        </div>
        {isSearchOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-[#333] rounded-xl shadow-2xl max-h-[60vh] overflow-y-auto z-50">
            <div className="p-2 border-b border-gray-200 dark:border-[#333] flex justify-between items-center bg-gray-50 dark:bg-[#252525] rounded-t-xl sticky top-0 z-10">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase ml-2 hidden md:inline">Library ({finalPrompts.length})</span>
              <button onClick={() => { onNewConfig(); setIsSearchOpen(false); }} className="text-xs bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-500/40 px-3 py-1.5 rounded flex items-center gap-1 transition-colors ml-auto md:ml-0">
                <Plus className="w-3 h-3" /> Blank
              </button>
            </div>
            {finalPrompts.length === 0 ? (
              <div className="p-4 text-sm text-slate-500 text-center">No configurations found.</div>
            ) : (
              <div className="p-1">
                {finalPrompts.map(p => (
                  <div key={p.id} onClick={() => { onSelectConfig(p); setIsSearchOpen(false); setSearchQuery(''); }} className={`px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2d2d2d] cursor-pointer flex flex-col ${currentConfigId === p.id ? 'bg-indigo-50 dark:bg-[#25252b] border-l-2 border-indigo-500' : ''}`}>
                    <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{p.title}</span>
                    <span className="text-xs text-slate-500">{p.subjectId || 'Custom'} • {p.promptSyntax}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        {mounted && (
          <>
            <button
              onClick={() => setIsAISettingsOpen(true)}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-[#363636] text-slate-600 dark:text-slate-300 transition-colors"
              title="AI Provider Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-[#363636] text-slate-600 dark:text-slate-300 transition-colors"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </>
        )}
        <button onClick={() => onSave(false)} className="text-xs md:text-sm font-medium px-3 md:px-4 py-2 bg-gray-200 dark:bg-[#2d2d2d] hover:bg-gray-300 dark:hover:bg-[#363636] text-slate-800 dark:text-slate-200 rounded-full flex items-center gap-2">
          <Save className="w-3 h-3 md:w-4 md:h-4" /><span className="hidden sm:inline">Save</span>
        </button>
        <button onClick={() => onSave(true)} className="text-xs md:text-sm font-medium px-3 md:px-4 py-2 bg-indigo-600 hover:bg-indigo-700 dark:hover:bg-indigo-500 text-white rounded-full">
          <span className="hidden sm:inline">Save as New</span><span className="sm:hidden">New</span>
        </button>
      </div>
      <AISettingsModal isOpen={isAISettingsOpen} onClose={() => setIsAISettingsOpen(false)} />
    </header>
  );
}
