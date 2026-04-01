'use client';

import { motion, MotionValue, useTransform } from 'framer-motion';

interface MobileHeroProps {
  scrollY: MotionValue<number>;
}

export function MobileHero({ scrollY }: MobileHeroProps) {
  // More subtle animations for Mobile
  const opacity = useTransform(scrollY, [0, 200], [1, 0]);
  const scale = useTransform(scrollY, [0, 200], [1, 0.9]);
  const y = useTransform(scrollY, [0, 200], [0, -50]);

  return (
    <motion.div 
      style={{ opacity, scale, y }}
      className="md:hidden flex flex-col items-center justify-center pt-10 pb-16 space-y-4 px-6 overflow-hidden"
    >
      <div className="relative text-center">
        <motion.h1 
          className="text-7xl font-black tracking-tighter leading-[0.8] uppercase"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          Vibe <br />
          <span className="text-secondary glow-text italic">Choice</span>
        </motion.h1>
      </div>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="text-lg text-muted-foreground font-semibold tracking-tighter text-center max-w-xs leading-tight"
      >
        Discover the sounds that define your frequency.
      </motion.p>
    </motion.div>
  );
}
