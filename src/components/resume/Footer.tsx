"use client";

import React from 'react';
import type { ResumeData } from '@/app/types';
import { ChevronUp, Code2, User, MessageCircle, Camera, Gamepad2, Video, Sparkles, Monitor, LucideIcon } from 'lucide-react';

interface FooterProps {
  resumeData: ResumeData;
}

const ICON_MAP: Record<string, LucideIcon> = {
  'github': Code2,
  'linkedin': User,
  'twitter': MessageCircle,
  'instagram': Camera,
  'gaming-account': Gamepad2,
  'gaming-channel': Video
};

const Footer = ({ resumeData }: FooterProps) => {
  const year = new Date().getFullYear();

  return (
    <footer className="py-12 bg-background border-t border-glass-border relative z-10">
      <div className="container mx-auto px-6 flex flex-col items-center justify-center">
        
        {/* Tools Section */}
        <div className="mb-8 flex flex-col items-center">
          <h4 className="text-xs uppercase font-bold tracking-widest text-slate-500 dark:text-slate-400 mb-4">
            Explore My Tools
          </h4>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="/prompt-studio" 
              className="group flex items-center gap-2 px-5 py-2.5 rounded-xl border border-glass-border bg-white/5 dark:bg-black/10 hover:bg-white/10 dark:hover:bg-white/5 transition-all duration-300 hover:border-accent-primary/50 hover:shadow-lg hover:shadow-accent-primary/5"
            >
              <Sparkles size={16} className="text-slate-400 group-hover:text-accent-primary group-hover:scale-110 transition-all duration-300" />
              <span className="font-semibold text-sm text-slate-700 dark:text-slate-200 group-hover:text-accent-primary transition-colors">
                Prompt Studio
              </span>
            </a>
            <a 
              href="/obs/editor" 
              className="group flex items-center gap-2 px-5 py-2.5 rounded-xl border border-glass-border bg-white/5 dark:bg-black/10 hover:bg-white/10 dark:hover:bg-white/5 transition-all duration-300 hover:border-accent-secondary/50 hover:shadow-lg hover:shadow-accent-secondary/5"
            >
              <Monitor size={16} className="text-slate-400 group-hover:text-accent-secondary group-hover:scale-110 transition-all duration-300" />
              <span className="font-semibold text-sm text-slate-700 dark:text-slate-200 group-hover:text-accent-secondary transition-colors">
                OBS Overlays
              </span>
            </a>
          </div>
        </div>

        <div className="flex space-x-6 mb-8">
          {resumeData.socialLinks?.map(item => {
            const Icon = ICON_MAP[item.name] || Code2;
            return (
              <a 
                key={item.id} 
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-accent-primary transition-colors hover:scale-110 transform duration-200"
              >
                <Icon size={24} />
              </a>
            );
          })}
        </div>

        <div className="text-slate-500 text-sm font-medium tracking-wide">
          &copy; {year} {resumeData.name}. All rights reserved.
        </div>

        <a 
          href="#home" 
          className="absolute -top-6 w-12 h-12 bg-background border border-glass-border rounded-full flex items-center justify-center text-slate-400 hover:text-accent-primary hover:border-accent-primary transition-all shadow-none dark:shadow-md"
          title="Back to Top"
        >
          <ChevronUp size={24} />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
