import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const playlistId = 'PL4fGSI1pDJn6jXS_Tv_N9B8Z0HTRVJE0m'; // Korea Top 100
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?playlist_id=${playlistId}`;
    
    const response = await fetch(rssUrl, { next: { revalidate: 3600 } });
    const text = await response.text();
    
    // Parse RSS entry-by-entry
    const entries = text.match(/<entry>[\s\S]*?<\/entry>/g) || [];
    const videos = entries.map((entry, index) => {
      const videoId = entry.match(/<yt:videoId>(.*?)<\/yt:videoId>/)?.[1] || '';
      const title = entry.match(/<title>(.*?)<\/title>/)?.[1] || 'Unknown Title';
      const artist = entry.match(/<name>(.*?)<\/name>/)?.[1] || 'Unknown Artist';
      
      return {
        id: videoId || `chart-${index}`,
        title,
        artist,
        youtube_url: `https://www.youtube.com/watch?v=${videoId}`,
        thumbnail_url: videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : '',
        rank: index + 1
      };
    });

    if (videos.length === 0) {
      console.warn('No popular videos found in RSS feed');
    }

    return NextResponse.json(videos);
  } catch (error) {
    console.error('Popular music RSS fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch popular charts' }, { status: 500 });
  }
}
