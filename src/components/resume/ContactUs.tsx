"use client";

import React from 'react';
import type { ResumeData } from '@/app/types';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';

interface ContactUsProps {
  resumeData: ResumeData;
}

const ContactUs = ({ resumeData }: ContactUsProps) => (
  <section id="contact" className="py-32 relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-accent-primary/5 pointer-events-none"></div>
    <div className="container mx-auto px-6 max-w-4xl relative z-10 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="glass-panel p-12 md:p-20 rounded-[3rem] neon-border relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
        <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter gradient-text">Let's Build the Future</h2>
        <p className="text-xl md:text-2xl text-slate-700 dark:text-slate-300 font-medium mb-12 leading-relaxed">
          "{resumeData.endNote}"
        </p>
        <a 
          href={`mailto:contact@lakshay.dev`} 
          className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-accent-primary hover:bg-accent-secondary text-white font-bold text-lg transition-all shadow-lg hover:shadow-[0_0_20px_rgba(120,53,4,0.4)] dark:hover:shadow-[0_0_20px_rgba(99,102,241,0.6)] hover:-translate-y-1"
        >
          <Mail size={24} /> Get in Touch
        </a>
      </motion.div>
    </div>
  </section>
);

export default ContactUs;

