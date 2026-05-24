"use client";

import React, { useRef } from 'react';
import type { ResumeData } from '@/app/types';
import { motion, useScroll, useTransform } from 'framer-motion';

interface AboutProps {
  resumeData: ResumeData;
}

const About = ({ resumeData }: AboutProps) => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-100, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.6, 1], [0, 1, 1, 0]);

  return (
    <section id="about" ref={ref} className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div style={{ opacity }} className="flex flex-col md:flex-row items-center justify-between gap-12">
          
          <motion.div style={{ y: y1 }} className="flex-1 space-y-6">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent-primary to-accent-secondary">
                About Me
              </span>
            </h2>
            <div className="w-20 h-1 bg-accent-primary rounded-full"></div>
            <p className="text-lg md:text-xl leading-relaxed text-slate-700 dark:text-slate-300">
              {resumeData.aboutMe}
            </p>
            <div className="pt-4">
              <a 
                href="#resume" 
                className="inline-flex items-center px-6 py-3 rounded-full bg-accent-primary hover:bg-accent-secondary text-white font-semibold transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1 transform duration-200"
              >
                Explore Experience
              </a>
            </div>
          </motion.div>

          <motion.div style={{ y: y2 }} className="flex-1 w-full flex justify-center">
            <div className="relative w-full max-w-sm aspect-square rounded-3xl glass-panel p-8 flex flex-col justify-center items-center neon-border transform rotate-3 hover:rotate-0 transition-transform duration-500 group">
              <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 rounded-3xl group-hover:opacity-100 opacity-50 transition-opacity"></div>
              <div className="relative z-10 text-center">
                <div className="text-6xl font-black text-slate-800 dark:text-slate-100 mb-2">14+</div>
                <div className="text-sm uppercase tracking-widest text-slate-500 font-bold">Years of Experience</div>
              </div>
              <div className="relative z-10 text-center mt-8">
                <div className="text-4xl font-black text-slate-800 dark:text-slate-100 mb-2">15+</div>
                <div className="text-sm uppercase tracking-widest text-slate-500 font-bold">Engineers Mentored</div>
              </div>
            </div>
          </motion.div>

        </motion.div>
      </div>
      
      {/* Decorative background elements */}
      <div className="absolute top-1/4 left-10 w-64 h-64 bg-accent-primary/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-accent-secondary/5 rounded-full blur-3xl pointer-events-none"></div>
    </section>
  );
};

export default About;
