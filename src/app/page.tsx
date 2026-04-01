'use client';

import { supabase } from '@/lib/supabase';
import { CreatePostModal } from '@/components/feed/CreatePostModal';
import { HomeTabs } from '@/components/feed/HomeTabs';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

import { Post } from '@/store/usePlayerStore';
import { DesktopHero } from '@/components/layout/DesktopHero';
import { MobileHero } from '@/components/layout/MobileHero';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const { scrollY } = useScroll();
  
  useEffect(() => {
    async function fetchPosts() {
      const { data } = await supabase
        .from('music_posts')
        .select('*')
        .order('created_at', { ascending: false });
      setPosts((data as Post[]) || []);
    }
    fetchPosts();
  }, []);

  return (
    <div className="relative pb-32 min-h-screen selection:bg-primary selection:text-white">
      {/* Background Glow */}
      <div className="fixed inset-0 premium-gradient pointer-events-none opacity-50" />
      
      {/* Responsive Hero Sections */}
      <DesktopHero scrollY={scrollY} />
      <MobileHero scrollY={scrollY} />

      {/* Main Feed Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        <HomeTabs initialPosts={posts} />
      </main>

      <CreatePostModal />
    </div>
  );
}
