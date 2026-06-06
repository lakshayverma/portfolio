"use client";

import React, { useEffect, useState } from 'react';
import { Terminal as TerminalIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface TerminalProps {
  text: string;
}

export function Terminal({ text }: TerminalProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let currentIndex = 0;
    setDisplayedText('');
    setIsTyping(true);

    const interval = setInterval(() => {
      if (currentIndex <= text.length) {
        setDisplayedText(text.slice(0, currentIndex));
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [text]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="w-full max-w-2xl mx-auto rounded-lg overflow-hidden glass-panel shadow-none dark:shadow-2xl"
    >
      <div className="flex items-center px-4 py-2 bg-slate-900/50 border-b border-slate-700/50">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
        </div>
        <div className="flex-1 text-center text-xs text-slate-400 font-mono flex items-center justify-center gap-2">
          <TerminalIcon size={14} /> guest@lakshay.dev: ~
        </div>
      </div>
      <div className="p-4 bg-slate-900/80 h-[160px] sm:h-[120px] overflow-y-auto font-mono text-sm sm:text-base text-slate-300">
        <span className="text-emerald-400">➜</span> <span className="text-cyan-400">~</span> ./execute_profile.sh
        <div className="mt-2 text-slate-300">
          {displayedText}
          <span className={`inline-block w-2 h-4 bg-emerald-400 ml-1 align-middle ${!isTyping ? 'animate-pulse' : ''}`}></span>
        </div>
      </div>
    </motion.div>
  );
}
