import { create } from 'zustand';

export interface Post {
  id: string;
  title: string;
  artist: string;
  description: string;
  thumbnail_url: string;
  youtube_url: string;
  user_id: string;
}

interface PlayerState {
  currentPost: Post | null;
  isPlaying: boolean;
  volume: number;
  play: (post: Post) => void;
  pause: () => void;
  resume: () => void;
  setVolume: (volume: number) => void;
  close: () => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  currentPost: null,
  isPlaying: false,
  volume: 0.8,
  play: (post) => set({ currentPost: post, isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  resume: () => set({ isPlaying: true }),
  setVolume: (volume) => set({ volume }),
  close: () => set({ currentPost: null, isPlaying: false }),
}));
