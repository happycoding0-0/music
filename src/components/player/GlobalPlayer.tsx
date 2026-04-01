'use client';
import { usePlayerStore } from '@/store/usePlayerStore';
import { Play, Pause, X } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

export function GlobalPlayer() {
  const { currentPost, isPlaying, play, pause, resume, close } = usePlayerStore();
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
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-[100] px-4 pb-4 md:px-8 md:pb-6 pointer-events-none"
        >
          <div className="max-w-4xl mx-auto w-full pointer-events-auto">
            <div className="bg-background/80 backdrop-blur-2xl border border-border/50 rounded-2xl shadow-2xl p-3 flex items-center justify-between gap-4">
              
              {/* Track Info */}
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="relative w-24 h-16 rounded-lg overflow-hidden shrink-0 shadow-sm bg-black flex items-center justify-center">
                  
                  {/* REAL YOUTUBE IFRAME - No tricks, completely visible */}
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
                      className="object-cover relative z-10 pointer-events-none opacity-50"
                    />
                  )}
                  
                </div>

                <div className="flex flex-col min-w-0">
                  <h4 className="font-extrabold text-sm md:text-base text-foreground truncate">{currentPost.title}</h4>
                  <p className="text-xs md:text-sm text-muted-foreground font-medium truncate">{currentPost.artist}</p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2 md:gap-4 shrink-0">
                <div className="w-[1px] h-8 bg-border/60 mx-1 hidden sm:block"></div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="w-10 h-10 rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors hidden sm:flex"
                  onClick={close}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
