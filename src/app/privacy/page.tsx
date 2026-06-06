"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ShieldCheck, Database, EyeOff, ServerCrash, CheckCircle2 } from 'lucide-react';
import { ThreeBackground } from '@/components/resume/ThreeBackground';
import { ThemeToggle } from '@/components/resume/ThemeToggle';

export default function PrivacyPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#050505] text-indigo-500">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" as const }
    }
  };

  return (
    <div className="relative min-h-screen text-[var(--foreground)] overflow-x-hidden font-sans pb-16">
      {/* 3D Interactive Particles Background */}
      <ThreeBackground />

      {/* Top Navigation Bar */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-8 flex items-center justify-between">
        <Link href="/" passHref legacyBehavior>
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group flex items-center gap-2 px-4 py-2 rounded-xl glass-panel text-slate-400 hover:text-[var(--accent-primary)] transition-all cursor-pointer"
            id="back-to-portfolio-btn"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-semibold">Back to Portfolio</span>
          </motion.a>
        </Link>
        <ThemeToggle />
      </header>

      {/* Main Content Container */}
      <main className="relative z-10 w-full max-w-4xl mx-auto px-6 mt-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-8"
        >
          {/* Header Section */}
          <motion.div variants={itemVariants} className="text-center md:text-left mb-4">
            <span className="text-xs uppercase font-bold tracking-widest text-[var(--accent-secondary)] dark:text-[var(--accent-secondary)]">
              Security & Privacy First
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mt-2 mb-4">
              <span className="gradient-text neon-text">Privacy Policy</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl text-base leading-relaxed">
              We care deeply about your privacy and data sovereignty. This page outlines exactly how data is handled across our tools, confirming that nothing is stored or uploaded to our servers.
            </p>
          </motion.div>

          {/* Key Pillars Grid */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel p-6 rounded-2xl flex flex-col gap-3 hover:border-[var(--accent-primary)]/50 transition-all duration-300">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                <ServerCrash className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg">No Server Storage</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                All customization parameters, overlay scenes, and layouts are kept entirely local. The server has no saving database activated.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl flex flex-col gap-3 hover:border-[var(--accent-primary)]/50 transition-all duration-300">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg">Pure LocalStorage</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                We utilize your browser's IndexedDB and LocalStorage. Your customization data never leaves your local environment.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl flex flex-col gap-3 hover:border-[var(--accent-primary)]/50 transition-all duration-300">
              <div className="w-10 h-10 rounded-lg bg-fuchsia-500/10 flex items-center justify-center text-fuchsia-500">
                <EyeOff className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg">Zero Tracking</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                No telemetry, no cookie tracking, and no external analytics. We do not inspect, collect, or share your usage habits.
              </p>
            </div>
          </motion.div>

          {/* Detailed Policy Text */}
          <motion.div variants={itemVariants} className="glass-panel p-8 rounded-2xl flex flex-col gap-6">
            <div>
              <h2 className="text-xl font-bold mb-3 flex items-center gap-2 text-slate-800 dark:text-slate-100">
                <CheckCircle2 className="w-5 h-5 text-[var(--accent-primary)]" />
                1. Purpose & Scope
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-7">
                This project represents a portfolio showcase and **Proof of Concept (PoC)** demonstrating advanced solution architecture, custom overlay editing layouts, and AI-driven prompt design. It is built as a front-end engineering demonstrator to show capabilities in real-time widgets, canvas manipulations, and reactive architectures.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-3 flex items-center gap-2 text-slate-800 dark:text-slate-100">
                <CheckCircle2 className="w-5 h-5 text-[var(--accent-primary)]" />
                2. Data Handling & Security
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-7">
                All changes, overlays, layer selections, alignment adjustments, and configuration templates in the OBS Editor are stored on your machine inside `localStorage`. Similarly, all prompt syntax templates and custom overrides are held in browser `IndexedDB`.
                Because no remote backend database or cloud backup is integrated, it is impossible for third parties (or ourselves) to view, scrape, or save your configurations. Your data is strictly yours.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-3 flex items-center gap-2 text-slate-800 dark:text-slate-100">
                <CheckCircle2 className="w-5 h-5 text-[var(--accent-primary)]" />
                3. API Calls & AI Logic
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-7">
                If you choose to use the AI prompt compilation features, queries are made directly to the respective AI provider (using your own local API credentials if overrides are supplied). The prompt configurations themselves are constructed client-side and sent directly via securely isolated transit without intermediately storing inputs or outputs on this web server.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-3 flex items-center gap-2 text-slate-800 dark:text-slate-100">
                <CheckCircle2 className="w-5 h-5 text-[var(--accent-primary)]" />
                4. Safe & Legal Usage
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-7">
                By maintaining a decentralized local-only architecture, our system prevents bad actors from uploading malicious files or using server memory for wrongful purposes. If you wish to export or back up your configurations, you can use the built-in "Export JSON" functionality to save files locally on your own filesystem.
              </p>
            </div>
          </motion.div>

          {/* Footer Note */}
          <motion.div variants={itemVariants} className="text-center text-xs text-slate-500 dark:text-slate-400 mt-4">
            <ShieldCheck className="w-4 h-4 inline-block mr-1 text-emerald-500 align-text-bottom" />
            Fully decentralized client-side storage architecture verified.
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
