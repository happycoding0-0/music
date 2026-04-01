async function testRss() {
  const playlistId = 'PL4fGSI1pDJn6jXS_Tv_N9B8Z0HTRVJE0m';
  const url = `https://www.youtube.com/feeds/videos.xml?playlist_id=${playlistId}`;
  
  try {
    const response = await fetch(url);
    const text = await response.text();
    
    // Simple regex to extract videoId and Title
    const entries = text.match(/<entry>[\s\S]*?<\/entry>/g) || [];
    const videos = entries.map(entry => {
      const videoId = entry.match(/<yt:videoId>(.*?)<\/yt:videoId>/)?.[1];
      const title = entry.match(/<title>(.*?)<\/title>/)?.[1];
      const author = entry.match(/<name>(.*?)<\/name>/)?.[1];
      return { videoId, title, author };
    });
    
    console.log(videos.slice(0, 5));
  } catch (error) {
    console.error(error);
  }
}

testRss();
