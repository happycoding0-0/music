'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayCircle, Award, Loader2, Music, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { usePlayerStore, Post } from '@/store/usePlayerStore';
import { Card } from '@/components/ui/card';

export function PopularMusicFeed() {
  const [popularMusic, setPopularMusic] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { play } = usePlayerStore();

  useEffect(() => {
    async function fetchPopular() {
      try {
        const res = await fetch('/api/youtube/popular');
        if (res.ok) {
          const data = await res.json();
          setPopularMusic(data);
        }
      } catch (error) {
        console.error('Failed to fetch popular music', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPopular();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-6">
        <div className="relative">
          <Loader2 className="w-16 h-16 animate-spin text-primary opacity-20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Music className="w-6 h-6 text-primary animate-pulse" />
          </div>
        </div>
        <p className="text-xl font-bold tracking-tighter text-muted-foreground animate-pulse">Syncing with YouTube Charts...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      <AnimatePresence>
        {popularMusic.map((music, index) => (
          <motion.div
            key={music.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.03 }}
            whileHover={{ scale: 1.02 }}
          >
            <Card 
              className="relative overflow-hidden bg-secondary/5 border border-white/5 hover:border-primary/20 transition-all duration-300 group cursor-pointer flex h-32 backdrop-blur-md"
              onClick={() => play({
                id: music.id,
                title: music.title,
                artist: music.artist,
                description: `Trending at #${music.rank || index + 1} on YouTube Charts`,
                thumbnail_url: music.thumbnail_url,
                youtube_url: music.youtube_url,
                user_id: "youtube_charts",
              } as Post)}
            >
              {/* Rank Number Background */}
              <div className="absolute -left-2 -top-4 text-9xl font-black text-white/[0.03] italic pointer-events-none group-hover:text-primary/[0.05] transition-colors">
                {music.rank || index + 1}
              </div>

              {/* Thumbnail Container */}
              <div className="relative h-full aspect-square overflow-hidden shrink-0">
                <Image 
                  src={music.thumbnail_url} 
                  alt={music.title} 
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors flex items-center justify-center">
                  <PlayCircle className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-2xl" />
                </div>
              </div>

              {/* Content Container */}
              <div className="flex flex-col justify-center px-6 py-4 flex-grow min-w-0 bg-gradient-to-r from-transparent to-white/[0.02]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-primary text-[10px] font-black uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded">
                    Rank #{music.rank || index + 1}
                  </span>
                </div>
                <h3 className="text-lg font-black text-foreground line-clamp-1 group-hover:text-primary transition-colors">{music.title}</h3>
                <p className="text-sm font-bold text-muted-foreground/80 line-clamp-1">{music.artist}</p>
              </div>

              {/* Right Indicator */}
              <div className="flex items-center px-4 text-muted-foreground/20 group-hover:text-primary/40">
                <ExternalLink className="w-5 h-5" />
              </div>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
