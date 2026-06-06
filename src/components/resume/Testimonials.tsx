"use client";

import React, { useState, useEffect } from 'react';
import type { ResumeData } from '@/app/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';

interface TestimonialsProps {
  resumeData: ResumeData;
}

const Testimonials = ({ resumeData }: TestimonialsProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const testimonials = resumeData.testimonials || [];

  useEffect(() => {
    if (isHovered || testimonials.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isHovered, testimonials.length]);

  if (testimonials.length === 0) return null;

  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section id="testimonials" className="py-32 relative bg-accent-primary/5">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-accent-primary/10 to-accent-secondary/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        <div className="text-center mb-16">
          <Quote className="w-16 h-16 mx-auto text-accent-primary/50 mb-6" />
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4 gradient-text">What People Say</h2>
        </div>

        <div 
          className="relative glass-panel rounded-3xl p-8 md:p-16 min-h-[300px] flex items-center justify-center shadow-[0_0_40px_rgba(120,53,4,0.12)] dark:shadow-[0_0_50px_rgba(99,102,241,0.3)] border border-accent-primary/30 hover:shadow-[0_0_60px_rgba(120,53,4,0.25)] dark:hover:shadow-[0_0_80px_rgba(99,102,241,0.5)] transition-all duration-500 overflow-hidden group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-accent-primary/5 via-accent-secondary/10 to-accent-primary/5 opacity-50 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.95, filter: "blur(8px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.05, filter: "blur(8px)" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-center w-full relative z-10"
            >
              <p className="text-xl md:text-3xl font-medium text-slate-800 dark:text-slate-100 italic mb-8 leading-relaxed drop-shadow-lg">
                "{testimonials[currentIndex].description}"
              </p>
              <div className="inline-block border-b-2 border-accent-secondary pb-1">
                <span className="text-lg font-bold uppercase tracking-widest text-slate-900 dark:text-slate-100 gradient-text">
                  {testimonials[currentIndex].name}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <button onClick={handlePrev} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/50 flex items-center justify-center hover:bg-accent-primary hover:text-white transition-colors border border-glass-border">
            <ChevronLeft size={20} />
          </button>
          <button onClick={handleNext} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/50 flex items-center justify-center hover:bg-accent-primary hover:text-white transition-colors border border-glass-border">
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Indicators */}
        <div className="flex justify-center mt-8 space-x-2">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-accent-primary' : 'bg-slate-400/50 hover:bg-slate-400'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

