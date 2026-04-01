'use client';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { PlusCircle } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';

export function CreatePostModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingMetadata, setIsFetchingMetadata] = useState(false);
  const { user } = useAuthStore();
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    description: '',
    youtube_url: '',
  });

  // Automatically fetch metadata when URL is pasted
  useEffect(() => {
    const fetchMetadata = async (url: string) => {
      const videoIdMatch = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11}).*/);
      if (videoIdMatch) {
        setIsFetchingMetadata(true);
        try {
          const res = await fetch(`/api/youtube/metadata?url=${encodeURIComponent(url)}`);
          if (res.ok) {
            const data = await res.json();
            setFormData(prev => ({
              ...prev,
              title: prev.title || data.title || '',
              artist: prev.artist || data.artist || '',
            }));
          }
        } catch (error) {
          console.error('Metadata fetch error', error);
        } finally {
          setIsFetchingMetadata(false);
        }
      }
    };

    if (formData.youtube_url && !formData.title && !formData.artist) {
      fetchMetadata(formData.youtube_url);
    }
  }, [formData.youtube_url, formData.title, formData.artist]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('You must be logged in to post');
      return;
    }
    
    setIsLoading(true);

    let videoId = '';
    const match = formData.youtube_url.match(/(?:v=|\/)([0-9A-Za-z_-]{11}).*/);
    if (match) videoId = match[1];
    
    const thumbnail_url = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '';

    try {
      const { error } = await supabase.from('music_posts').insert([
        {
          user_id: user.id,
          title: formData.title,
          artist: formData.artist,
          description: formData.description,
          youtube_url: formData.youtube_url,
          thumbnail_url,
        }
      ]);

      if (error) throw error;
      
      toast.success('Music post shared successfully!');
      setIsOpen(false);
      setFormData({ title: '', artist: '', description: '', youtube_url: '' });
      router.refresh();
      
    } catch (error) {
      const e = error as Error;
      toast.error(e.message || 'Failed to share post');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger 
        render={
          <Button className="fixed bottom-8 right-8 h-16 w-16 rounded-full shadow-2xl drop-shadow-2xl hover:scale-105 active:scale-95 transition-all p-0 bg-primary hover:bg-primary/90 text-primary-foreground">
            <PlusCircle className="w-8 h-8" />
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-tight">Share Music</DialogTitle>
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
            <div className="relative">
              <Input
                placeholder="https://youtube.com/watch?v=..."
                value={formData.youtube_url}
                onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                required
                className="bg-secondary/50 border-none h-12 focus-visible:ring-1 focus-visible:ring-primary pr-10"
              />
              {isFetchingMetadata && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                </div>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">Why do you recommend this? (Optional)</label>
            <textarea
              placeholder="Tell us why this song is great..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full h-28 p-4 bg-secondary/50 text-black rounded-xl outline-none focus:ring-1 focus:ring-primary text-sm resize-none transition-all"
            />
          </div>
          <Button type="submit" className="w-full h-12 font-bold text-base rounded-full" disabled={isLoading}>
            {isLoading ? 'Posting...' : 'Share Now'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
