"use client";

import React, { useState, useEffect } from 'react';
import Header from '@/components/resume/Header';
import About from '@/components/resume/About';
import Resume from '@/components/resume/Resume';
import Testimonials from '@/components/resume/Testimonials';
import ContactUs from '@/components/resume/ContactUs';
import Footer from '@/components/resume/Footer';
import Job from '@/components/resume/Job';
import type { ResumeData } from '@/app/types';

export default function HomePage() {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);

  useEffect(() => {
    fetch('/api/lakshay')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((data) => setResumeData(data))
      .catch((err) => console.error('Failed to fetch resume data:', err));
  }, []);

  if (!resumeData) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#131314] text-indigo-500">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 font-medium animate-pulse">Fetching Resume...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <Header resumeData={resumeData} />
      <About resumeData={resumeData} />
      <Resume resumeData={resumeData} />
      <Job items={resumeData.portfolio} description={resumeData.portfolioDescription} statsTitle="Technology Used" isCarousel={true} />
      <Testimonials resumeData={resumeData} />
      <ContactUs resumeData={resumeData} />
      <Job id="interests" title="Interests" items={resumeData.interests} description={resumeData.interestsDescription} isCarousel={false} />
      <Footer resumeData={resumeData} />
    </div>
  );
}
