'use client';
import { usePlayerStore } from '@/store/usePlayerStore';
import { X } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

export function GlobalPlayer() {
  const { currentPost, close } = usePlayerStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // 완벽하게 유튜브 비디오 ID만 추출하는 공식 (어떤 형태의 유튜브 주소라도 커버)
  const getYouTubeId = (url: string) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  };

  const videoId = currentPost ? getYouTubeId(currentPost.youtube_url) : null;

  return (
    <AnimatePresence>
      {currentPost && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 40 }}
          className="fixed bottom-0 left-0 right-0 z-[100] px-3 pb-3 md:px-8 md:pb-8 pointer-events-none"
        >
          <div className="max-w-5xl mx-auto w-full pointer-events-auto">
            <div className="glass-dark rounded-2xl md:rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-2 md:p-3 flex items-center justify-between gap-3 md:gap-6 border-white/10">
              
              {/* Track Info Container */}
              <div className="flex items-center gap-3 md:gap-5 flex-1 min-w-0">
                {/* Media Container */}
                <div className="relative w-20 h-14 md:w-32 md:h-20 rounded-xl md:rounded-2xl overflow-hidden shrink-0 shadow-2xl bg-black group/player cursor-pointer border border-white/5">
                  {videoId ? (
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`}
                      title={currentPost.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 z-10"
                    />
                  ) : (
                    <Image 
                      src={currentPost.thumbnail_url || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80'} 
                      alt={currentPost.title} 
                      fill 
                      className="object-cover opacity-60"
                    />
                  )}
                </div>

                <div className="flex flex-col min-w-0 gap-0.5 md:gap-1">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_hsl(var(--primary))]" />
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] leading-none">
                      Now Broadcasting
                    </span>
                  </div>
                  <h4 className="font-black text-sm md:text-xl text-foreground truncate tracking-tighter leading-tight drop-shadow-sm">
                    {currentPost.title}
                  </h4>
                  <p className="text-[10px] md:text-sm text-muted-foreground/50 font-bold uppercase tracking-widest truncate">
                    {currentPost.artist}
                  </p>
                </div>
              </div>

              {/* Controls / Close */}
              <div className="flex items-center gap-2 md:gap-4 shrink-0 pr-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full text-muted-foreground/40 hover:bg-white/5 hover:text-white transition-all"
                  onClick={close}
                >
                  <X className="w-5 h-5 md:w-6 md:h-6" />
                </Button>
              </div>

            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
