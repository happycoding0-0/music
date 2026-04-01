import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Toaster } from '@/components/ui/sonner';
import { GlobalPlayer } from '@/components/player/GlobalPlayer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'VibeTree',
  description: 'Curate your daily rhythm.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.className} bg-background text-foreground antialiased min-h-screen flex flex-col selection:bg-primary selection:text-primary-foreground`}>
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 md:py-12 pb-32">
          {children}
        </main>
        <GlobalPlayer />
        <Toaster theme="dark" position="bottom-right" className="font-sans" />
      </body>
    </html>
  );
}
