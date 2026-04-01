'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PostCard } from './PostCard';
import { PopularMusicFeed } from './PopularMusicFeed';
import { TrendingUp, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Post } from '@/store/usePlayerStore';

interface HomeTabsProps {
  initialPosts: Post[];
}

export function HomeTabs({ initialPosts }: HomeTabsProps) {
  const [activeTab, setActiveTab] = useState('curated');

  return (
    <Tabs defaultValue="curated" onValueChange={setActiveTab} className="w-full">
      <div className="flex flex-col items-center mb-12">
        <TabsList className="relative flex w-full max-w-[450px] h-14 bg-secondary/30 p-1.5 rounded-2xl border border-white/5 backdrop-blur-xl">
          <TabsTrigger 
            value="curated" 
            className="relative z-10 flex-1 rounded-xl font-bold transition-all flex items-center justify-center gap-2.5 h-full data-[state=active]:text-white"
          >
             <Sparkles className={`w-4 h-4 ${activeTab === 'curated' ? 'text-white' : 'text-primary'}`} />
             <span>Curated Feed</span>
             {activeTab === 'curated' && (
               <motion.div 
                 layoutId="activeTabSlot"
                 className="absolute inset-0 bg-primary rounded-xl -z-10"
                 transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
               />
             )}
          </TabsTrigger>
          <TabsTrigger 
            value="popular" 
            className="relative z-10 flex-1 rounded-xl font-bold transition-all flex items-center justify-center gap-2.5 h-full data-[state=active]:text-white"
          >
            <TrendingUp className={`w-4 h-4 ${activeTab === 'popular' ? 'text-white' : 'text-primary'}`} />
            <span>YouTube Charts</span>
            {activeTab === 'popular' && (
              <motion.div 
                layoutId="activeTabSlot"
                className="absolute inset-0 bg-primary rounded-xl -z-10"
                transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
              />
            )}
          </TabsTrigger>
        </TabsList>
        
        <p className="text-sm text-muted-foreground mt-4 font-medium h-5">
          {activeTab === 'curated' 
            ? "Hand-picked masterpieces from our community" 
            : "Currently trending on global music charts"}
        </p>
      </div>

      <div className="px-4 md:px-0">
        <TabsContent value="curated" className="mt-0 outline-none border-none animate-in fade-in duration-500">
          {!initialPosts || initialPosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 opacity-60">
              <p className="text-3xl font-black mb-3 text-center">No masterpieces yet.</p>
              <p className="text-lg">Be the first to share one!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-10">
              {initialPosts.map((post, index) => (
                <PostCard key={post.id} post={post} priority={index < 2} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="popular" className="mt-0 outline-none border-none animate-in fade-in duration-500">
          <PopularMusicFeed />
        </TabsContent>
      </div>
    </Tabs>
  );
}
