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
      const fullTitle = entry.match(/<title>(.*?)<\/title>/)?.[1] || 'Unknown Title';
      const authorName = entry.match(/<name>(.*?)<\/name>/)?.[1] || 'Unknown Artist';
      
      // Try to split artist and title if the format is "Artist - Title"
      let artist = authorName;
      let title = fullTitle;
      
      if (fullTitle.includes(' - ')) {
        [artist, title] = fullTitle.split(' - ');
      } else if (fullTitle.includes(' – ')) {
        [artist, title] = fullTitle.split(' – ');
      }
      
      // Clean up common MV suffixes
      title = title.replace(/Official MV/gi, '').replace(/M\/V/gi, '').replace(/\[MV\]/gi, '').trim();
      artist = artist.replace(/\[MV\]/gi, '').trim();

      return {
        id: videoId || `chart-${index}`,
        title: title || fullTitle,
        artist: artist || authorName,
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
