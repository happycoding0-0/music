'use client';

import { motion, MotionValue, useTransform } from 'framer-motion';

interface DesktopHeroProps {
  scrollY: MotionValue<number>;
}

export function DesktopHero({ scrollY }: DesktopHeroProps) {
  // Smoother animations for Desktop
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const scale = useTransform(scrollY, [0, 400], [1, 0.95]);
  const y = useTransform(scrollY, [0, 400], [0, -100]);

  return (
    <motion.div 
      style={{ opacity, scale, y }}
      className="hidden md:flex flex-col items-center justify-center py-20 mb-20 space-y-8"
    >
      <div className="relative group">
        <motion.h1 
          className="text-[12rem] font-black tracking-tighter leading-[0.8] uppercase select-none"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Vibe <br />
          <span className="text-primary glow-text italic ml-12">Choice</span>
        </motion.h1>
        
        {/* Decorative accents */}
        <div className="absolute -top-10 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-10 -left-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="text-2xl text-muted-foreground font-medium tracking-tight max-w-2xl text-center"
      >
        Discover the sounds that define your frequency.
      </motion.p>
    </motion.div>
  );
}
