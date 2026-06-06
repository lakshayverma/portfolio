"use client";

import React from 'react';
import type { ResumeData } from '@/app/types';
import { ChevronUp, Code2, User, MessageCircle, Camera, Gamepad2, Video, LucideIcon } from 'lucide-react';

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
          className="absolute -top-6 w-12 h-12 bg-background border border-glass-border rounded-full flex items-center justify-center text-slate-400 hover:text-accent-primary hover:border-accent-primary transition-all shadow-md"
          title="Back to Top"
        >
          <ChevronUp size={24} />
        </a>
      </div>
    </footer>
  );
};

export default Footer;

