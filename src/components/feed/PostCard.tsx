'use client';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { PlayCircle, User as UserIcon, Trash2, Heart } from 'lucide-react';
import Image from 'next/image';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { EditPostModal } from './EditPostModal';
import { useState } from 'react';
import { usePlayerStore } from '@/store/usePlayerStore';

interface PostProps {
  post: {
    id: string;
    title: string;
    artist: string;
    description: string;
    thumbnail_url: string;
    youtube_url: string;
    user_id: string;
  };
}

export function PostCard({ post }: PostProps) {
  const { user } = useAuthStore();
  const { play } = usePlayerStore();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const isOwner = user?.id === post.user_id;

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase.from('music_posts').delete().eq('id', post.id);
      if (error) throw error;
      toast.success('Post deleted successfully');
      router.refresh();
    } catch (error) {
      toast.error('Failed to delete post');
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="h-full"
    >
      <Card 
        className="h-full overflow-hidden bg-secondary/5 border border-white/5 hover:border-primary/30 transition-all duration-500 group cursor-pointer shadow-none hover:shadow-[0_20px_50px_rgba(var(--primary-rgb),0.15)] flex flex-col backdrop-blur-sm"
        onClick={() => play(post as any)}
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/40">
          {post.thumbnail_url ? (
            <Image 
              src={post.thumbnail_url} 
              alt={post.title} 
              fill
              className="object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full">
               <PlayCircle className="w-14 h-14 text-white/20 group-hover:text-primary transition-colors duration-300" />
            </div>
          )}
          
          {/* Enhanced Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity pointer-events-none" />
          
          {/* Owner Tools - Stop propagation to avoid playing when editing/deleting */}
          {isOwner && (
            <div 
              className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-[-10px] group-hover:translate-y-0 z-20"
              onClick={(e) => e.stopPropagation()}
            >
              <EditPostModal post={post} />
              <Button 
                size="icon" 
                variant="destructive" 
                className="h-9 w-9 rounded-xl bg-red-500/80 backdrop-blur-md shadow-xl hover:bg-red-600" 
                onClick={handleDelete} 
                disabled={isDeleting}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Large Play Icon center */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-50 group-hover:scale-100 pointer-events-none">
            <div className="bg-primary/20 backdrop-blur-xl p-6 rounded-full border border-primary/40 shadow-[0_0_40px_rgba(var(--primary-rgb),0.5)]">
              <PlayCircle className="w-12 h-12 text-white fill-white/10" />
            </div>
          </div>
        </div>
        
        <CardContent className="p-6 flex-grow flex flex-col justify-start space-y-3">
          <div className="space-y-1">
            <h3 className="text-xl font-black text-foreground tracking-tight line-clamp-1 group-hover:text-primary transition-colors duration-300">{post.title}</h3>
            <p className="text-sm font-bold text-primary/80 tracking-wide">{post.artist}</p>
          </div>
          
          {post.description && (
            <p className="text-sm text-muted-foreground/90 line-clamp-2 leading-relaxed italic font-medium">
              &ldquo;{post.description}&rdquo;
            </p>
          )}
        </CardContent>
        
        <CardFooter className="px-6 pb-6 pt-0 flex items-center justify-between">
           <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/20">
               <UserIcon className="w-4 h-4 text-primary" />
             </div>
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Masterpiece</span>
           </div>
           
           <div className="flex items-center gap-4 text-muted-foreground/40">
              <Heart className="w-4 h-4 hover:text-red-500 transition-colors" />
           </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
