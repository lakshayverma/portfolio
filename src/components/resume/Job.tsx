"use client";

import React, { useState, useRef, useEffect } from 'react';
import type { PortfolioEntry, InterestEntry } from '@/app/types';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface JobProps {
  id?: string;
  title?: string;
  items?: Array<PortfolioEntry | InterestEntry>;
  description?: string;
  statsTitle?: string | null;
  isCarousel?: boolean;
}

const Card = ({ item, statsTitle, isCarouselCard = false }: { item: any, statsTitle: string | null, isCarouselCard?: boolean }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={isCarouselCard ? undefined : { y: -10, rotateX: 5, rotateY: 5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`glass-panel p-6 rounded-3xl h-full flex flex-col group relative overflow-hidden ${isCarouselCard
        ? 'bg-white/95 dark:bg-[#050505]/95 shadow-xl border-glass-border/40'
        : ''
        }`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/10 to-accent-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="relative z-10 flex-1">
        <h3 className="text-2xl font-bold mb-3 text-slate-800 dark:text-slate-100 group-hover:gradient-text transition-all">
          {item.name}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
          {item.description}
        </p>

        {'achievements' in item && item.achievements && (
          <div className="mb-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-accent-primary mb-2">Key Highlights</h4>
            <ul className="list-disc pl-4 text-xs space-y-1 text-slate-500 dark:text-slate-400">
              {item.achievements.map((ach: string, i: number) => (
                <li key={i}>{ach}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {'stats' in item && item.stats && (
        <div className="relative z-10 mt-auto pt-4 border-t border-slate-200 dark:border-slate-800/50">
          {statsTitle && <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">{statsTitle}</span>}
          <div className="flex flex-wrap gap-2">
            {item.stats.map((stat: string, i: number) => (
              <span key={i} className="text-xs font-mono px-2 py-1 bg-background rounded border border-glass-border text-accent-secondary">
                {stat}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

const SwipeableCardWrapper = ({
  item,
  statsTitle,
  swipeDirection,
  onSwipeLeft,
  onSwipeRight
}: {
  item: any,
  statsTitle: string | null,
  swipeDirection: 'left' | 'right' | null,
  onSwipeLeft: () => void,
  onSwipeRight: () => void
}) => {
  const dragX = useMotionValue(0);
  const rotate = useTransform(dragX, [-200, 200], [-12, 12]);

  const variants = {
    initial: {
      opacity: 0,
      scale: 0.95,
      y: 12,
      x: 0
    },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      x: 0,
      rotate: 0,
      transition: { duration: 0.3 }
    },
    exit: (direction: 'left' | 'right' | null) => ({
      opacity: 0,
      x: direction === 'left' ? -400 : direction === 'right' ? 400 : -400,
      rotate: direction === 'left' ? -15 : direction === 'right' ? 15 : -15,
      scale: 0.9,
      transition: { duration: 0.3 }
    })
  };

  return (
    <motion.div
      variants={variants}
      custom={swipeDirection}
      initial="initial"
      animate="animate"
      exit="exit"
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      style={{ x: dragX, rotate }}
      onDragEnd={(e, info) => {
        const swipeThreshold = 80;
        if (info.offset.x < -swipeThreshold) {
          onSwipeLeft();
        } else if (info.offset.x > swipeThreshold) {
          onSwipeRight();
        }
      }}
      className="h-full cursor-grab active:cursor-grabbing touch-pan-y relative z-10"
    >
      <Card item={item} statsTitle={statsTitle} isCarouselCard={true} />
    </motion.div>
  );
};

const Job = ({
  id = 'jobs',
  title = 'Jobs',
  items = [],
  description = '',
  statsTitle = null,
  isCarousel = false
}: JobProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

  const carouselRef = useRef<HTMLDivElement>(null);

  const swipeNext = () => {
    setSwipeDirection('left');
    setCurrentIndex((prevIndex) => (prevIndex + 1 >= items.length ? 0 : prevIndex + 1));
  };

  const swipePrev = () => {
    setSwipeDirection('right');
    setCurrentIndex((prevIndex) => (prevIndex - 1 < 0 ? items.length - 1 : prevIndex - 1));
  };

  const nextSlide = () => {
    swipeNext();
  };

  const prevSlide = () => {
    swipePrev();
  };

  const handleDotClick = (idx: number) => {
    if (idx === currentIndex) return;
    setSwipeDirection(idx > currentIndex ? 'left' : 'right');
    setCurrentIndex(idx);
  };

  const visibleItems = items.slice(currentIndex, currentIndex + 1);
  const nextIndex = (currentIndex + 1) % items.length;
  const nextItem = items[nextIndex];

  useEffect(() => {
    if (items.length === 0) return;
    const timer = setInterval(() => {
      swipeNext();
    }, 10000);
    return () => clearInterval(timer);
  }, [items.length]);

  return (
    <section id={id} className="py-24 relative">
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-extrabold mb-4"
          >
            <span className="gradient-text">{title}</span>
          </motion.h2>
          <div className="w-24 h-1 bg-gradient-to-r from-accent-primary to-accent-secondary mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">{description}</p>
        </div>

        {isCarousel ? (
          <div ref={carouselRef} className="relative max-w-2xl mx-auto">
            <div className="min-h-[400px] relative">
              {/* Background Card for Mobile Deck effect */}
              {items.length > 1 && (
                <div className="absolute inset-0 pointer-events-none scale-[0.96] translate-y-3 opacity-60 block md:hidden z-0 blur-[3px]">
                  <Card item={nextItem} statsTitle={statsTitle} isCarouselCard={true} />
                </div>
              )}

              <AnimatePresence mode="popLayout" custom={swipeDirection}>
                {visibleItems.map((item) => (
                  <SwipeableCardWrapper
                    key={item.id}
                    item={item}
                    statsTitle={statsTitle}
                    swipeDirection={swipeDirection}
                    onSwipeLeft={swipeNext}
                    onSwipeRight={swipePrev}
                  />
                ))}
              </AnimatePresence>
            </div>

            {items.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute -left-4 md:-left-16 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 flex items-center justify-center hover:bg-accent-primary hover:text-white transition-colors border border-glass-border shadow-none dark:shadow-lg z-10"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute -right-4 md:-right-16 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 flex items-center justify-center hover:bg-accent-primary hover:text-white transition-colors border border-glass-border shadow-none dark:shadow-lg z-10"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}

            {/* Indicators */}
            <div className="flex justify-center mt-8 space-x-2">
              {items.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handleDotClick(idx)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-accent-primary' : 'bg-slate-400/50 hover:bg-slate-400'}`}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => (
              <Card key={item.id} item={item} statsTitle={statsTitle} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Job;

