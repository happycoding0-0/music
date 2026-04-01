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
    let patternUsed = '';

    for (const pattern of startPatterns) {
      startIndex = html.indexOf(pattern);
      if (startIndex !== -1) {
        patternUsed = pattern;
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
    } catch (e) {
      console.error('JSON Parse error for ytInitialData');
      return NextResponse.json({ error: 'Failed to parse YouTube data' }, { status: 500 });
    }
    
    // Robustly find all playlistVideoRenderer objects in the JSON tree
    const videoRenderers: any[] = [];
    const findVideos = (obj: any) => {
      if (!obj || typeof obj !== 'object') return;
      if (obj.playlistVideoRenderer) {
        videoRenderers.push(obj.playlistVideoRenderer);
        return;
      }
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          findVideos(obj[key]);
        }
      }
    };
    
    findVideos(data);
    
    if (videoRenderers.length === 0) {
      console.error('No video renderers found in ytInitialData');
      return NextResponse.json({ error: 'No videos found in playlist' }, { status: 404 });
    }

    const videos = videoRenderers.map((video: any, index: number) => {
      const videoId = video.videoId;
      const fullTitle = video.title?.runs?.[0]?.text || 'Unknown Title';
      const authorName = video.shortBylineText?.runs?.[0]?.text || 'Unknown Artist';
      
      // Get the highest resolution thumbnail
      const thumbnails = video.thumbnail?.thumbnails || [];
      const thumbnail = thumbnails.length > 0 ? thumbnails[thumbnails.length - 1].url : `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
      
      const duration = video.lengthText?.simpleText || '0:00';

      let artist = authorName;
      let title = fullTitle;
      
      if (fullTitle.includes(' - ')) {
        const parts = fullTitle.split(' - ');
        artist = parts[0].trim();
        title = parts.slice(1).join(' - ').trim();
      } else if (fullTitle.includes(' – ')) {
        const parts = fullTitle.split(' – ');
        artist = parts[0].trim();
        title = parts.slice(1).join(' – ').trim();
      }
      
      title = title
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
        title: title || fullTitle,
        artist: artist || authorName,
        youtube_url: `https://www.youtube.com/watch?v=${videoId}`,
        thumbnail_url: thumbnail,
        rank: index + 1,
        duration: duration
      };
    });

    console.log(`Successfully extracted ${videos.length} videos from YouTube using robust search`);
    return NextResponse.json(videos);
  } catch (error: any) {
    console.error('Popular music fetch error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch popular charts', 
      message: error.message 
    }, { status: 500 });
  }
}
