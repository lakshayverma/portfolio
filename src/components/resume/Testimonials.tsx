"use client";

import React, { useState, useEffect, useRef } from 'react';
import type { ResumeData } from '@/app/types';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';

interface TestimonialsProps {
  resumeData: ResumeData;
}

const TestimonialCard = ({ testimonial, isCarouselCard = false }: { testimonial: any, isCarouselCard?: boolean }) => {
  return (
    <div className={`relative glass-panel rounded-3xl p-8 md:p-16 min-h-[300px] flex flex-col items-center justify-center shadow-[0_0_40px_rgba(120,53,4,0.12)] dark:shadow-[0_0_50px_rgba(99,102,241,0.3)] border border-accent-primary/30 transition-all duration-500 overflow-hidden group w-full ${isCarouselCard
        ? 'bg-white/95 dark:bg-[#050505]/95'
        : ''
      }`}>
      <div className="absolute inset-0 bg-gradient-to-r from-accent-primary/5 via-accent-secondary/10 to-accent-primary/5 opacity-50 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

      <div className="text-center w-full relative z-10">
        <p className="text-xl md:text-3xl font-medium text-slate-800 dark:text-slate-100 italic mb-8 leading-relaxed drop-shadow-lg">
          "{testimonial.description}"
        </p>
        <div className="inline-block border-b-2 border-accent-secondary pb-1">
          <span className="text-lg font-bold uppercase tracking-widest text-slate-900 dark:text-slate-100 gradient-text">
            {testimonial.name}
          </span>
        </div>
      </div>
    </div>
  );
};

const SwipeableTestimonialWrapper = ({
  testimonial,
  swipeDirection,
  onSwipeLeft,
  onSwipeRight
}: {
  testimonial: any,
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
      className="h-full cursor-grab active:cursor-grabbing touch-pan-y relative z-10 w-full"
    >
      <TestimonialCard testimonial={testimonial} isCarouselCard={true} />
    </motion.div>
  );
};

const Testimonials = ({ resumeData }: TestimonialsProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

  const carouselRef = useRef<HTMLDivElement>(null);

  const testimonials = resumeData.testimonials || [];

  const scrollToActiveCard = () => {
    if (carouselRef.current) {
      const rect = carouselRef.current.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const targetY = rect.top + scrollTop - 120;

      window.scrollTo({
        top: targetY,
        behavior: 'smooth'
      });
    }
  };

  const swipeNext = () => {
    setSwipeDirection('left');
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const swipePrev = () => {
    setSwipeDirection('right');
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const nextSlide = () => {
    swipeNext();
    scrollToActiveCard();
  };

  const prevSlide = () => {
    swipePrev();
    scrollToActiveCard();
  };

  const handleDotClick = (idx: number) => {
    if (idx === currentIndex) return;
    setSwipeDirection(idx > currentIndex ? 'left' : 'right');
    setCurrentIndex(idx);
    scrollToActiveCard();
  };

  useEffect(() => {
    if (isHovered || testimonials.length === 0) return;
    const timer = setInterval(() => {
      swipeNext();
    }, 10000);
    return () => clearInterval(timer);
  }, [isHovered, testimonials.length]);

  if (testimonials.length === 0) return null;

  const currentTestimonial = testimonials[currentIndex];
  const nextIndex = (currentIndex + 1) % testimonials.length;
  const nextTestimonial = testimonials[nextIndex];

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
          ref={carouselRef}
          className="relative w-full"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="min-h-[300px] relative w-full">
            {/* Background Card for Mobile Deck effect */}
            {testimonials.length > 1 && (
              <div className="absolute inset-0 pointer-events-none scale-[0.96] translate-y-3 opacity-60 block md:hidden z-0 blur-[3px]">
                <TestimonialCard testimonial={nextTestimonial} isCarouselCard={true} />
              </div>
            )}

            <AnimatePresence mode="popLayout" custom={swipeDirection}>
              <SwipeableTestimonialWrapper
                key={currentIndex}
                testimonial={currentTestimonial}
                swipeDirection={swipeDirection}
                onSwipeLeft={swipeNext}
                onSwipeRight={swipePrev}
              />
            </AnimatePresence>
          </div>

          {/* Controls - outside card, reduced size */}
          {testimonials.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute -left-4 md:-left-12 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/80 flex items-center justify-center hover:bg-accent-primary hover:text-white transition-colors border border-glass-border shadow-none dark:shadow-lg z-20"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={nextSlide}
                className="absolute -right-4 md:-right-12 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/80 flex items-center justify-center hover:bg-accent-primary hover:text-white transition-colors border border-glass-border shadow-none dark:shadow-lg z-20"
              >
                <ChevronRight size={16} />
              </button>
            </>
          )}

          {/* Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleDotClick(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-accent-primary' : 'bg-slate-400/50 hover:bg-slate-400'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
