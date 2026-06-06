"use client";

import React, { useState } from 'react';
import type { ResumeData } from '@/app/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, GraduationCap, Code2, ChevronDown, ChevronUp } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface ResumeProps {
  resumeData: ResumeData;
}

const TimelineItem = ({ item, icon: Icon, index }: { item: any, icon: any, index: number }) => {
  const title = item.companyName || item.universityName;
  const [start, end] = item.dates;
  const isLeft = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      className={`relative pl-8 md:pl-0 md:h-[340px] ${index > 0 ? 'mt-12 md:-mt-[140px]' : ''}`}
    >
      <div className="hidden md:block absolute left-1/2 -translate-x-1/2 w-0.5 h-full bg-slate-200 dark:bg-slate-800"></div>

      <div className={`md:w-1/2 ${isLeft ? 'md:pr-6 md:ml-0 text-left md:text-right' : 'md:pl-6 md:ml-auto text-left'}`}>
        <div className="absolute left-0 md:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-background border-4 border-accent-primary flex items-center justify-center z-10 shadow-none dark:shadow-lg dark:shadow-accent-primary/20 top-6">
          <Icon className="w-3 h-3 text-accent-primary" />
        </div>

        <div className="glass-panel p-6 rounded-2xl hover:neon-border transition-shadow group md:h-[340px] flex flex-col">
          <div className="flex justify-between items-start md:items-center mb-2 flex-col md:flex-row">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 group-hover:text-accent-primary transition-colors">
              {title}
            </h3>
            <span className="text-xs font-mono text-accent-secondary bg-accent-secondary/10 px-3 py-1 rounded-full mt-2 md:mt-0 whitespace-nowrap">
              {start?.month ? `${start.month} ` : ''}{start?.year} - {end?.year === 'Present' || !end?.year ? `Present` : `${end.month ? `${end.month} ` : ''}${end.year}`}
            </span>
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-4">{item.specialization}</p>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar text-left">
            <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              {item.achievements.map((ach: string, i: number) => (
                <li key={i}>{ach}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Resume = ({ resumeData }: ResumeProps) => {
  const chartData = resumeData.skills?.map(s => ({
    subject: s.skillName,
    A: parseInt(s.percent, 10),
    fullMark: 100,
  }));

  return (
    <section id="resume" className="py-24 bg-slate-50/50 dark:bg-[#0f0f13]/50">
      <div className="container mx-auto px-6 max-w-6xl">

        {/* Experience Timeline */}
        <div className="mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4"><span className="gradient-text">Work Experience</span></h2>
            <div className="w-24 h-1 bg-accent-primary mx-auto rounded-full"></div>
          </motion.div>

          <div className="relative">
            {resumeData.work?.map((item, index) => (
              <TimelineItem key={item.id} item={item} icon={Briefcase} index={index} />
            ))}
          </div>
        </div>

        {/* Education Timeline */}
        <div className="mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4"><span className="gradient-text">Education</span></h2>
            <div className="w-24 h-1 bg-accent-secondary mx-auto rounded-full"></div>
          </motion.div>

          <div className="relative">
            {resumeData.education?.map((item, index) => (
              <TimelineItem key={item.id} item={item} icon={GraduationCap} index={index} />
            ))}
          </div>
        </div>

        {/* Skills Chart */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4"><span className="gradient-text">Core Skills</span></h2>
            <div className="w-24 h-1 bg-gradient-to-r from-accent-primary to-accent-secondary mx-auto rounded-full mb-6"></div>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">{resumeData.skillsDescription}</p>
          </motion.div>

          <div className="w-full h-[500px] glass-panel rounded-3xl p-4 md:p-8">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                <PolarGrid stroke="var(--glass-border)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--foreground)', fontSize: 12, fontWeight: 600 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--glass-bg)', backdropFilter: 'blur(10px)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}
                  itemStyle={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}
                />
                <Radar name="Proficiency" dataKey="A" stroke="var(--accent-primary)" fill="var(--accent-primary)" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Resume;

