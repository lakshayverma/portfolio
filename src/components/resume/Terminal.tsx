"use client";

import React, { useEffect, useState, useRef } from 'react';
import { Terminal as TerminalIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface TerminalProps {
  text: string;
}

type TerminalPhase =
  | 'idle'
  | 'typing_command'
  | 'command_entered'
  | 'loading'
  | 'typing_output'
  | 'completed';

export function Terminal({ text }: TerminalProps) {
  // Use key={text} to force a clean remount when the text prop changes.
  // This automatically resets all state variables and restarts the animation
  // without triggering React 19 synchronous setState in effect warnings.
  return <TerminalInner key={text} text={text} />;
}

function TerminalInner({ text }: TerminalProps) {
  const [phase, setPhase] = useState<TerminalPhase>('idle');
  const [displayedCommand, setDisplayedCommand] = useState('');
  const [displayedOutput, setDisplayedOutput] = useState('');
  const terminalRef = useRef<HTMLDivElement>(null);

  const commandText = './hello_world.sh';

  // Helper function to auto-scroll to the bottom of the terminal content
  const scrollToBottom = () => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  };

  // Keep scrolled to bottom whenever output or command changes
  useEffect(() => {
    scrollToBottom();
  }, [displayedCommand, displayedOutput, phase]);

  useEffect(() => {
    let active = true;
    let commandTimer: NodeJS.Timeout;
    let outputInterval: NodeJS.Timeout;

    // Helper timeout that checks if component is still mounted
    const runTimeout = (fn: () => void, ms: number) => {
      return setTimeout(() => {
        if (active) fn();
      }, ms);
    };

    // Phase 1: Idle state. Cursor is on the first prompt line.
    const startIdle = () => {
      runTimeout(() => {
        setPhase('typing_command');
        startTypingCommand(0);
      }, 500); // 500ms initial wait
    };

    // Phase 2: Typing command character by character with randomized realistic speed
    const startTypingCommand = (index: number) => {
      if (index <= commandText.length) {
        setDisplayedCommand(commandText.slice(0, index));
        if (index < commandText.length) {
          const randomDelay = Math.random() * (120 - 60) + 60; // 60ms to 120ms
          commandTimer = setTimeout(() => {
            if (active) startTypingCommand(index + 1);
          }, randomDelay);
        } else {
          setPhase('command_entered');
          startCommandEntered();
        }
      }
    };

    // Phase 3: Pause briefly after typing the command (pressing enter)
    const startCommandEntered = () => {
      runTimeout(() => {
        setPhase('loading');
        startLoading();
      }, 300); // 300ms pause
    };

    // Phase 4: Command loads. Cursor is moved to a new line and blinks.
    const startLoading = () => {
      runTimeout(() => {
        setPhase('typing_output');
        startTypingOutput(0);
      }, 600); // 600ms load time
    };

    // Phase 5: Output gets typed out character-by-character
    const startTypingOutput = (index: number) => {
      const charDelay = 25; // 25ms per character for output
      let currentIndex = index;

      outputInterval = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayedOutput(text.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(outputInterval);
          setPhase('completed');
        }
      }, charDelay);
    };

    startIdle();

    return () => {
      active = false;
      clearTimeout(commandTimer);
      clearInterval(outputInterval);
    };
  }, [text]);

  const showCursorAtCommand = phase === 'idle' || phase === 'typing_command' || phase === 'command_entered';
  const showCursorAtOutput = phase === 'loading' || phase === 'typing_output';
  const isCursorBlinking = phase === 'idle' || phase === 'loading' || phase === 'completed';

  const cursorClass = `inline-block w-2 h-4 bg-accent-primary ml-1 align-middle ${isCursorBlinking ? 'animate-pulse' : ''
    }`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="w-full max-w-2xl mx-auto rounded-lg overflow-hidden glass-panel shadow-none dark:shadow-2xl"
    >
      <div className="flex items-start px-4 py-2 bg-slate-100/50 dark:bg-slate-900/50 border-b border-[var(--glass-border)]">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
        </div>
        <div className="flex-1 text-left text-xs text-slate-600 dark:text-slate-400 font-mono flex items-center justify-center gap-2">
          <TerminalIcon size={14} /> guest@lakshay.dev: ~
        </div>
      </div>
      <div
        ref={terminalRef}
        className="p-4 bg-slate-50/60 dark:bg-slate-950/60 h-[200px] sm:h-[160px] text-left overflow-y-auto font-mono text-sm sm:text-base text-slate-700 dark:text-slate-300 scroll-smooth"
      >
        <div className='text-sm'>
          <span className="text-accent-primary">➜</span> <span className="text-accent-secondary">~</span>
          <span className="text-slate-800 dark:text-slate-400">
            &nbsp;{displayedCommand}
          </span>
          {showCursorAtCommand && <span className={cursorClass}></span>}
        </div>

        {(phase === 'loading' || phase === 'typing_output' || phase === 'completed') && (
          <div className="mt-2 text-slate-700 dark:text-slate-300">
            <span>{displayedOutput}</span>
            {showCursorAtOutput && <span className={cursorClass}></span>}
          </div>
        )}

        {phase === 'completed' && (
          <div className="mt-2 text-sm">
            <span className="text-accent-primary">➜</span> <span className="text-accent-secondary">~</span>
            <span className="text-slate-800 dark:text-slate-400">
              &nbsp;begin
            </span>
            <span className={cursorClass}></span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
