const yts = require('yt-search');

async function test() {
  try {
    const listId = 'PL4fGSI1pDJn6jXS_Tv_N9B8Z0HTRVJE0m';
    const list = await yts({ listId });
    console.log('Success:', list.videos.length, 'videos found');
  } catch (err) {
    console.error('Error:', err.message);
    console.error(err.stack);
  }
}

test();
