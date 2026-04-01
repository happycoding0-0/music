const yts = require('yt-search');

async function test() {
  try {
    const list = await yts({ listId: 'PL4fGSI1pDJn6jXS_Tv_N9B8Z0HTRVJE0m' });
    console.log(list.title);
    console.log(list.videos.slice(0, 3));
  } catch(e) {
    console.error(e);
  }
}
test();
