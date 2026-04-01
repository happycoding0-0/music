import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const playlistId = 'PL4fGSI1pDJn6jXS_Tv_N9B8Z0HTRVJE0m';
    const url = `https://www.youtube.com/playlist?list=${playlistId}`;
    
    console.log('Fetching directly from YouTube:', url);
    
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
      },
      cache: 'no-store'
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch YouTube page: ${res.statusText}`);
    }

    const html = await res.text();
    
    // Robust extraction: Find the start of the data and extract until the end of the script tag
    let dataJson = '';
    const startPatterns = ['var ytInitialData =', 'window["ytInitialData"] =', 'window[' + "'" + 'ytInitialData' + "'" + '] ='];
    let startIndex = -1;

    for (const pattern of startPatterns) {
      startIndex = html.indexOf(pattern);
      if (startIndex !== -1) {
        break;
      }
    }
    
    if (startIndex === -1) {
      console.error('Could not find ytInitialData in YouTube HTML');
      return NextResponse.json({ error: 'Could not find data marker in YouTube' }, { status: 500 });
    }

    // Move to the start of the JSON object
    const jsonStart = html.indexOf('{', startIndex);
    const scriptEnd = html.indexOf('</script>', jsonStart);
    
    if (jsonStart === -1 || scriptEnd === -1) {
      return NextResponse.json({ error: 'Could not find JSON boundaries' }, { status: 500 });
    }

    // Extract the raw string until the last possible closing brace before the script ends
    const rawData = html.substring(jsonStart, scriptEnd).trim();
    const lastBrace = rawData.lastIndexOf('}');
    dataJson = rawData.substring(0, lastBrace + 1);

    let data;
    try {
      data = JSON.parse(dataJson);
    } catch {
      console.error('JSON Parse error for ytInitialData');
      return NextResponse.json({ error: 'Failed to parse YouTube data' }, { status: 500 });
    }
    
    // Robustly find all playlistVideoRenderer objects in the JSON tree
    // Define local interfaces for the recursive parser
    interface YouTubeRenderer {
      playlistVideoRenderer?: {
        videoId: string;
        title?: { runs?: { text: string }[] };
        shortBylineText?: { runs?: { text: string }[] };
        thumbnail?: { thumbnails?: { url: string }[] };
        lengthText?: { simpleText: string };
      };
      [key: string]: unknown;
    }

    const videoRenderers: YouTubeRenderer['playlistVideoRenderer'][] = [];
    const findVideos = (obj: unknown) => {
      if (!obj || typeof obj !== 'object') return;
      
      const nominee = obj as YouTubeRenderer;
      if (nominee.playlistVideoRenderer) {
        videoRenderers.push(nominee.playlistVideoRenderer);
        return;
      }
      
      for (const key in nominee) {
        if (Object.prototype.hasOwnProperty.call(nominee, key)) {
          findVideos(nominee[key]);
        }
      }
    };
    
    findVideos(data);
    
    if (videoRenderers.length === 0) {
      console.error('No video renderers found in ytInitialData');
      return NextResponse.json({ error: 'No videos found in playlist' }, { status: 404 });
    }

    const videos = videoRenderers.map((video, index) => {
      if (!video) return null;
      const videoId = video.videoId;
      const fullTitle = video.title?.runs?.[0]?.text || 'Unknown Title';
      const authorName = video.shortBylineText?.runs?.[0]?.text || 'Unknown Artist';
      
      // Get the highest resolution thumbnail
      const thumbnails = video.thumbnail?.thumbnails || [];
      const thumbnailUrl = thumbnails.length > 0 ? thumbnails[thumbnails.length - 1].url : `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
      
      const durationText = video.lengthText?.simpleText || '0:00';

      let videoArtist = authorName;
      let videoTitle = fullTitle;
      
      if (fullTitle.includes(' - ')) {
        const parts = fullTitle.split(' - ');
        videoArtist = parts[0].trim();
        videoTitle = parts.slice(1).join(' - ').trim();
      } else if (fullTitle.includes(' – ')) {
        const parts = fullTitle.split(' – ');
        videoArtist = parts[0].trim();
        videoTitle = parts.slice(1).join(' – ').trim();
      }
      
      const sanitizedTitle = videoTitle
        .replace(/\(Official MV\)/gi, '')
        .replace(/\[Official MV\]/gi, '')
        .replace(/\(M\/V\)/gi, '')
        .replace(/\[M\/V\]/gi, '')
        .replace(/\(OFFICIAL\)/gi, '')
        .replace(/Official Music Video/gi, '')
        .replace(/\(Lyric Video\)/gi, '')
        .trim();

      return {
        id: videoId,
        title: sanitizedTitle || fullTitle,
        artist: videoArtist || authorName,
        youtube_url: `https://www.youtube.com/watch?v=${videoId}`,
        thumbnail_url: thumbnailUrl,
        rank: index + 1,
        duration: durationText
      };
    }).filter(v => v !== null);

    console.log(`Successfully extracted ${videos.length} videos from YouTube using robust search`);
    return NextResponse.json(videos);
  } catch (error: unknown) {
    console.error('Popular music fetch error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ 
      error: 'Failed to fetch popular charts', 
      message: errorMessage 
    }, { status: 500 });
  }
}
