'use client';
import { useAuthStore } from '@/store/useAuthStore';
import { AuthModal } from '../auth/AuthModal';
import { Button } from '@/components/ui/button';
import { Search, Music } from 'lucide-react';
import { useEffect } from 'react';

export function Header() {
  const { user, initialize, signOut, isLoading } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <header className="sticky top-0 z-50 w-full glass-dark border-b border-white/5 supports-[backdrop-filter]:bg-black/20">
      <div className="container mx-auto flex h-16 md:h-20 items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-2 group cursor-pointer transition-all duration-500">
          <div className="bg-primary shadow-[0_0_20px_rgba(147,51,234,0.3)] text-primary-foreground p-2 rounded-xl group-hover:rotate-12 transition-transform">
             <Music className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <span className="text-xl md:text-2xl font-black tracking-tighter uppercase italic group-hover:tracking-normal transition-all duration-500">
            Vibe<span className="text-primary glow-text">Tree</span>
          </span>
        </div>
        
        <div className="flex items-center gap-3 md:gap-6">
          <div className="relative hidden md:flex items-center group">
            <Search className="absolute left-4 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <input 
              type="text" 
              placeholder="Search masterpieces..." 
              className="pl-11 pr-4 py-2.5 bg-white/5 border border-white/10 text-white rounded-full text-sm outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white/10 transition-all w-64 lg:w-96 placeholder:text-muted-foreground/50"
            />
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            {!isLoading && (
              <>
                {user ? (
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="hidden lg:flex flex-col items-end">
                      <span className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">
                        Collector
                      </span>
                      <span className="text-sm font-black text-foreground truncate max-w-[120px]">
                        {user.email?.split('@')[0]}
                      </span>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={signOut} 
                      className="rounded-full border-white/10 hover:bg-white/5 hover:text-primary transition-all px-4 md:px-6"
                    >
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <AuthModal />
                )}
              </>
            )}
            
            {/* Mobile Search Trigger */}
            <Button variant="ghost" size="icon" className="md:hidden rounded-full hover:bg-white/5">
              <Search className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
