'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchBanners } from '@/lib/api';
import { Banner } from '@/types';

export function HeroSlider() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useEffect(() => {
    fetchBanners().then((data) => {
      if (data && data.length > 0) {
        setBanners(data);
      }
    });
  }, []);

  const total = banners.length;

  const paginate = useCallback(
    (newDirection: number) => {
      if (total <= 1) return;
      setDirection(newDirection);
      setCurrent((prev) => {
        if (newDirection === 1) {
          return (prev + 1) % total;
        }
        return (prev - 1 + total) % total;
      });
    },
    [total]
  );

  // Auto-advance every 5.5 seconds unless paused
  useEffect(() => {
    if (isPaused || total <= 1) return;
    const timer = setInterval(() => {
      paginate(1);
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused, total, paginate]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') paginate(-1);
      if (e.key === 'ArrowRight') paginate(1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [paginate]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 45) {
      paginate(1); // Swiped left -> next
    } else if (diff < -45) {
      paginate(-1); // Swiped right -> prev
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: 'spring' as const, stiffness: 280, damping: 30 },
        opacity: { duration: 0.35 },
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? '-100%' : '100%',
      opacity: 0,
      transition: {
        x: { type: 'spring' as const, stiffness: 280, damping: 30 },
        opacity: { duration: 0.3 },
      },
    }),
  };

  if (total === 0) return null;

  const activeSlide = banners[current];
  const href = activeSlide.button_url || '/shop';

  return (
    <section
      className="w-full bg-slate-50 pt-2 pb-2 sm:pt-4 sm:pb-5"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-roledescription="carousel"
      aria-label="Panelook.lk Promotional Slider"
    >
      <div className="max-w-[1440px] mx-auto px-2 sm:px-6 lg:px-8">
        {/*
          Responsive Container:
          On mobile, we use aspect-[16/9] or auto height so banners maintain true aspect ratio
          with ZERO cropping of critical text, logos, warranty info, or CTA.
          On desktop, height is fixed cleanly at 340px-480px with sm:aspect-auto.
        */}
        <div className="relative w-full aspect-[16/9] sm:aspect-auto sm:h-[340px] md:h-[400px] lg:h-[460px] xl:h-[480px] rounded-[4px] overflow-hidden border border-slate-200/90 shadow-xs bg-slate-900 group">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={activeSlide.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 w-full h-full"
            >
              <Link href={href} className="block w-full h-full relative cursor-pointer">
                {/*
                  Responsive <picture> System:
                  If mobile image exists, load mobile image for <= 768px viewports.
                  Otherwise, load desktop image with contain/responsive scaling so content is never cut.
                */}
                <picture className="w-full h-full block">
                  {activeSlide.mobile_image && (
                    <source
                      media="(max-width: 768px)"
                      srcSet={activeSlide.mobile_image}
                    />
                  )}
                  <img
                    src={activeSlide.desktop_image}
                    alt={activeSlide.title || 'Panelook.lk Promotional Banner'}
                    className="w-full h-full block object-contain object-center bg-slate-900"
                    loading={current === 0 ? 'eager' : 'lazy'}
                  />
                </picture>
              </Link>
            </motion.div>
          </AnimatePresence>

          {/* Left Arrow Button */}
          {total > 1 && (
            <button
              onClick={() => paginate(-1)}
              aria-label="Previous Slide"
              className="absolute left-2 sm:left-5 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-10 sm:h-10 rounded-[3px] bg-white/85 hover:bg-white text-slate-800 shadow-md backdrop-blur-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 sm:group-hover:opacity-100 focus:opacity-100 cursor-pointer z-20 hover:scale-105"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}

          {/* Right Arrow Button */}
          {total > 1 && (
            <button
              onClick={() => paginate(1)}
              aria-label="Next Slide"
              className="absolute right-2 sm:right-5 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-10 sm:h-10 rounded-[3px] bg-white/85 hover:bg-white text-slate-800 shadow-md backdrop-blur-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 sm:group-hover:opacity-100 focus:opacity-100 cursor-pointer z-20 hover:scale-105"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}

          {/* Bottom Dots Indicator */}
          {total > 1 && (
            <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 sm:gap-2 z-20 bg-slate-950/60 backdrop-blur-md px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-[3px]">
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setDirection(idx > current ? 1 : -1);
                    setCurrent(idx);
                  }}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`transition-all duration-300 cursor-pointer ${
                    current === idx
                      ? 'w-5 sm:w-6 h-1.5 sm:h-2 bg-white rounded-[2px] shadow-xs'
                      : 'w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/50 hover:bg-white/80 rounded-full'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
