"use client";

import React, { useState, useEffect } from 'react';
import type { ResumeData } from '@/app/types';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ThreeBackground } from './ThreeBackground';
import { Terminal } from './Terminal';
import { ThemeToggle } from './ThemeToggle';
import { ChevronDown, Code2, User, MessageCircle, Camera, Gamepad2, Video, LucideIcon } from 'lucide-react';

interface HeaderProps {
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

const Header = ({ resumeData }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header id="home" className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden pt-20">
      <ThreeBackground />
      
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass-panel shadow-none dark:shadow-md py-3' : 'bg-transparent py-5'}`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-accent-primary/30 shadow-[0_0_10px_rgba(120,53,4,0.15)] dark:shadow-[0_0_10px_rgba(99,102,241,0.2)] bg-slate-900/50 flex-none">
              <Image 
                src="/images/lakshay.png" 
                alt="LV Logo" 
                width={32}
                height={32}
                priority
                className="object-cover"
              />
            </div>
            <div className="font-bold text-xl gradient-text tracking-tighter">LV.</div>
          </div>
          
          <ul className="hidden md:flex space-x-8 font-medium text-sm">
            {['Home', 'About', 'Resume', 'Jobs', 'Testimonials', 'Interests'].map((item) => (
              <li key={item}>
                <a 
                  href={`#${item.toLowerCase()}`} 
                  className="hover:text-accent-primary transition-colors tracking-wide uppercase text-xs font-semibold relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-primary transition-all group-hover:w-full"></span>
                </a>
              </li>
            ))}
          </ul>
          
          <ThemeToggle />
        </div>
      </motion.nav>

      {/* Hero Content */}
      <div className="container mx-auto px-6 relative z-10 text-center flex flex-col items-center">
        {/* Profile Avatar */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative mb-8 group"
        >
          {/* Pulsing neon glowing outer circle */}
          <div className="absolute -inset-1 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-full blur opacity-0 dark:opacity-70 dark:group-hover:opacity-100 transition duration-1000 group-hover:duration-200 dark:animate-pulse"></div>
          
          {/* Glassmorphic border container */}
          <div className="relative w-36 h-36 md:w-40 md:h-40 rounded-full p-1 bg-white/10 dark:bg-black/30 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-none dark:shadow-2xl flex items-center justify-center">
            {/* Inner image container */}
            <div className="relative w-full h-full rounded-full overflow-hidden">
              <Image 
                src="/images/lakshay.png" 
                alt={resumeData.name}
                fill
                priority
                sizes="(max-width: 768px) 144px, 160px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-extrabold mb-4 tracking-tight gradient-text"
        >
          {resumeData.name}
        </motion.h1>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-xl md:text-2xl font-medium mb-8 text-slate-600 dark:text-slate-300"
        >
          {resumeData.role}
        </motion.h2>

        <Terminal text={resumeData.roleDescription} />

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-12 flex space-x-6"
        >
          {resumeData.socialLinks?.map(item => {
            const Icon = ICON_MAP[item.name] || Code2;
            return (
              <a 
                key={item.id} 
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full glass-panel hover:neon-border hover:text-accent-primary transition-all hover:scale-110"
              >
                <Icon size={20} />
              </a>
            );
          })}
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce"
      >
        <a href="#about" className="text-slate-400 hover:text-accent-primary transition-colors">
          <ChevronDown size={32} />
        </a>
      </motion.div>
    </header>
  );
};

export default Header;
