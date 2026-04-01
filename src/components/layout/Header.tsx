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
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2 text-primary font-bold text-2xl tracking-tighter cursor-pointer transition-transform hover:scale-105 active:scale-95">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-xl">
             <Music className="w-5 h-5" />
          </div>
          VibeTree
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative hidden md:flex items-center group">
            <Search className="absolute left-4 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <input 
              type="text" 
              placeholder="Search music..." 
              className="pl-11 pr-4 py-2 bg-secondary/50 text-black rounded-full text-sm outline-none focus:ring-1 focus:ring-primary focus:bg-secondary/80 transition-all w-64 md:w-80"
            />
          </div>
          
          {!isLoading && (
            <>
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-muted-foreground hidden sm:block truncate max-w-[150px]">
                    {user.email}
                  </span>
                  <Button variant="ghost" onClick={signOut} className="rounded-full hover:bg-secondary">
                    Sign Out
                  </Button>
                </div>
              ) : (
                <AuthModal />
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
