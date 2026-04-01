'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { usePlayerStore, Post } from '@/store/usePlayerStore';
import { Card } from '@/components/ui/card';

interface PopularMusic {
  id: string;
  title: string;
  artist: string;
  thumbnail_url: string;
  youtube_url: string;
  rank: number;
  duration: string;
}

export function PopularMusicFeed() {
  const [isMounted, setIsMounted] = useState(false);
  const [popularMusic, setPopularMusic] = useState<PopularMusic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { play } = usePlayerStore();

  const fetchPopular = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/youtube/popular');
      if (res.ok) {
        const data = await res.json();
        setPopularMusic(Array.isArray(data) ? data : []);
      } else {
        setError(`Failed to load charts: ${res.status}`);
      }
    } catch {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    fetchPopular();
  }, []);

  if (!isMounted) return null;

  if (loading) {
    return (
      <div className="py-20 text-center animate-pulse">
        <p className="text-primary font-black tracking-[.5em] uppercase text-xs">Syncing Global Wave...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 text-center text-destructive">
        <p className="font-bold">{error}</p>
        <button onClick={fetchPopular} className="mt-4 underline text-sm">Retry</button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
        {popularMusic.map((music, index) => (
          <Card 
            key={music.id || index}
            className="group relative overflow-hidden bg-white/[0.03] hover:bg-white/[0.08] border-white/5 hover:border-primary/50 transition-all duration-500 cursor-pointer flex h-24 md:h-28 shadow-2xl"
            onClick={() => play({
              id: music.id,
              title: music.title,
              artist: music.artist,
              thumbnail_url: music.thumbnail_url,
              youtube_url: music.youtube_url,
              description: `YouTube Popular #${music.rank || index + 1}`,
              user_id: "youtube_charts",
            } as Post)}
          >
            {/* Rank Tag */}
            <div className="absolute top-0 left-0 z-20 bg-primary/90 text-black text-[9px] font-black px-1.5 py-0.5 tracking-tighter">
              RANK {music.rank || index + 1}
            </div>

            {/* Thumbnail */}
            <div className="relative w-32 md:w-40 h-full bg-black shrink-0 overflow-hidden">
              {music.thumbnail_url && (
                <Image 
                  src={music.thumbnail_url} 
                  alt={music.title} 
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                  sizes="160px"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/60 md:hidden" />
            </div>

            {/* Track Metadata */}
            <div className="flex flex-col justify-center p-4 min-w-0 flex-grow relative bg-black/40 backdrop-blur-sm md:bg-transparent">
              <h3 className="font-bold text-white truncate text-sm md:text-base leading-tight group-hover:text-primary transition-colors">
                {music.title}
              </h3>
              <div className="flex items-center gap-2 mt-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                <p className="text-[10px] md:text-xs text-primary font-black uppercase tracking-wider truncate">
                  {music.artist}
                </p>
                <div className="w-1 h-1 rounded-full bg-white/20" />
                <span className="text-[9px] text-white/40 font-bold">YOUTUBE</span>
              </div>
            </div>
            
            {/* Hover Indicator */}
            <div className="absolute bottom-0 left-0 h-[2px] bg-primary w-0 group-hover:w-full transition-all duration-500" />
          </Card>
        ))}
      </div>
      <div className="h-24" /> {/* Footer Padding */}
    </div>
  );
}
