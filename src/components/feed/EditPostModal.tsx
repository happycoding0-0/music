'use client';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Pencil } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

interface EditPostModalProps {
  post: {
    id: string;
    title: string;
    artist: string;
    description: string;
    youtube_url: string;
  };
}

export function EditPostModal({ post }: EditPostModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthStore();
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: post.title,
    artist: post.artist,
    description: post.description,
    youtube_url: post.youtube_url,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('You must be logged in to edit posts');
      return;
    }
    
    setIsLoading(true);

    let videoId = '';
    const match = formData.youtube_url.match(/(?:v=|\/)([0-9A-Za-z_-]{11}).*/);
    if (match) videoId = match[1];
    
    const thumbnail_url = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '';

    try {
      const { error } = await supabase
        .from('music_posts')
        .update({
          title: formData.title,
          artist: formData.artist,
          description: formData.description,
          youtube_url: formData.youtube_url,
          thumbnail_url,
        })
        .eq('id', post.id);

      if (error) throw error;
      
      toast.success('Music post updated successfully!');
      setIsOpen(false);
      router.refresh();
      
    } catch (error) {
      const e = error as Error;
      toast.error(e.message || 'Failed to update post');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <>
      <Button 
        size="icon" 
        variant="secondary" 
        className="h-8 w-8 bg-background/50 backdrop-blur-sm border-white/10 hover:bg-background/80"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(true);
        }}
      >
        <Pencil className="w-4 h-4 text-foreground" />
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px]" onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-tight">Edit Post</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Title</label>
              <Input
                placeholder="Song title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="bg-secondary/50 border-none h-12 focus-visible:ring-1 focus-visible:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Artist</label>
              <Input
                placeholder="Artist name"
                value={formData.artist}
                onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                required
                className="bg-secondary/50 border-none h-12 focus-visible:ring-1 focus-visible:ring-primary"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">YouTube URL</label>
            <Input
              placeholder="https://youtube.com/watch?v=..."
              value={formData.youtube_url}
              onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
              required
              className="bg-secondary/50 border-none h-12 focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">Why do you recommend this?</label>
            <textarea
              placeholder="Tell us why this song is great..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              className="w-full h-28 p-4 bg-secondary/50 text-black rounded-xl outline-none focus:ring-1 focus:ring-primary text-sm resize-none transition-all"
            />
          </div>
          <Button type="submit" className="w-full h-12 font-bold text-base rounded-full" disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Save Changes'}
          </Button>
        </form>
      </DialogContent>
      </Dialog>
    </>
  );
}
