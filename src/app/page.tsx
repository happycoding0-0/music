'use client';

import { supabase } from '@/lib/supabase';
import { CreatePostModal } from '@/components/feed/CreatePostModal';
import { HomeTabs } from '@/components/feed/HomeTabs';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function Home() {
  const [posts, setPosts] = useState<any[]>([]);
  const { scrollY } = useScroll();
  
  // 스크롤 시 문구가 점점 투명해지도록 설정 (0~200px 스크롤 시 투명도 1->0)
  const opacity = useTransform(scrollY, [0, 200], [1, 0]);
  const scale = useTransform(scrollY, [0, 200], [1, 0.95]);

  useEffect(() => {
    async function fetchPosts() {
      const { data } = await supabase
        .from('music_posts')
        .select('*')
        .order('created_at', { ascending: false });
      setPosts(data || []);
    }
    fetchPosts();
  }, []);

  return (
    <div className="relative pb-24 min-h-screen">
      {/* Dynamic Hero Section */}
      <motion.div 
        style={{ opacity, scale }}
        className="mb-12 mt-12 text-center space-y-6 pt-10"
      >
        <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9]">
          Discover <br />
          <span className="text-primary glow-text italic">Masterpieces</span>
        </h1>
        <p className="text-lg md:text-2xl text-muted-foreground/80 max-w-xl mx-auto font-medium tracking-tight">
          Explore curated collections of sounds that define your vibe.
        </p>
      </motion.div>

      {/* Main Feed Content */}
      <div className="mt-8">
        <HomeTabs initialPosts={posts} />
      </div>

      <CreatePostModal />
    </div>
  );
}
