const puppeteer = require('puppeteer');
const youtube = require('./youtube');
const axios = require('axios')

const setHeaders = async (page) => {
  const userAgent = 'Mozilla/5.0 (X11; Linux x86_64)' +
    'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.39 Safari/537.36';
  await page.setUserAgent(userAgent);
}

const options = {
  defaultViewport: null,
  args: ['--window-size=1920,1080'],
}

module.exports = {
  getMusics: getMusics,
  getYoutubeVideos: getYoutubeVideos,
};

async function getMusics(id, cb) {

  var results = {}
  results.musics = []

  axios.get('https://api.spotify.com/v1/playlists/' + id, {
    headers: {
      "Authorization": "Bearer BQBEwdDr1LIAcZUpRlWe3WYKn0KwkHH0Sux7vwFXGGcFMQjX_rmFrhA-v-G9KfUV1f9PxY8NyrVhDjwX8exV-9xqRRPPebCebmY0dskda11J7lJWzU_HQWAOad-gaHN3-KAv9h1RBlOZrzRjbzP6llpChjn3jVT3ADNoD8ypuengOfPK2SY"
    }
  })
  .then(function (response) {
    let data = response.data;

    results.name = data.name
    results.numbers = data.tracks.total
    results.url = data.external_urls.spotify

   /* for(let music of data.tracks.items) {
      console.log(music)
    }*/

    for(let i=0; i < data.tracks.items.length; i++) {
      let song = data.tracks.items[i]
      results.musics.push({id: i, name: song.track.artists[0].name + " " + song.track.name})
    }

    
    cb(results)

  }).catch(e => {
    console.log(e)
  })

/*
  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();
  await setHeaders(page);

  let datas = {}
  datas.musics = []

  await page.goto(url);

  await page.waitForSelector('#onetrust-accept-btn-handler', {
    timeout: 5000
  });

  const ck = await page.$("#onetrust-accept-btn-handler")
  await ck.click({ clickCount: 3 });

  try {
    await page.waitForSelector('.a12b67e576d73f97c44f1f37026223c4-scss', {
      timeout: 5000
    });
    await page.waitForSelector('.bc1fe098cc33981dc67049628a2cac6b-scss ._8ea0b892e971e6b90a252247c160b4f4-scss div', {
      timeout: 5000
    });
    await page.waitForSelector('.bc1fe098cc33981dc67049628a2cac6b-scss ._8ea0b892e971e6b90a252247c160b4f4-scss span a', {
      timeout: 5000
    });
  } catch {
    return []
  }
  
  //const elem = await page.$('.os-scrollbar-track');
 /* const hScroll = await page.$('.main-view-container__scroll-node-child');
  const boundingBoxHScroll = await hScroll.boundingBox();

  const mPos = await page.$('.bc1fe098cc33981dc67049628a2cac6b-scss ._8ea0b892e971e6b90a252247c160b4f4-scss div');
  const boundingBoxMPos = await mPos.boundingBox();

  await page.mouse.move(
    boundingBoxMPos.x + boundingBoxMPos.width / 2, // x
    boundingBoxMPos.y + boundingBoxMPos.height / 2 // y
  );*/
/*
  console.log(scroll)

  let lastPosition = await scroll(page)

  console.log(lastPosition)

  //console.log(boundingBox)
  
 // await page.mouse.hover('.main-view-container__scroll-node-child')
  //await page.mouse.wheel({ deltaY: -boundingBoxHScroll.height });

  await page.screenshot({path: "scroll2.png"})

  let playListName = await page.evaluate(() => {
    return document.querySelector('.a12b67e576d73f97c44f1f37026223c4-scss').textContent
  });


  const songs = await page.$$eval(".bc1fe098cc33981dc67049628a2cac6b-scss ._8ea0b892e971e6b90a252247c160b4f4-scss div", el => el.map(i => i.innerHTML));
  const artists = await page.$$eval(".bc1fe098cc33981dc67049628a2cac6b-scss ._8ea0b892e971e6b90a252247c160b4f4-scss span a:first-child", el => el.map(i => i.innerHTML));

  for(let i=1; i<= songs.length; i++) {
    datas.musics.push({id: i, name: artists[i-1] + " " + songs[i-1]})  
  }

  datas.name = playListName
  datas.numbers = songs.length

  browser.close();

  return(datas)
*/
};

async function getYoutubeVideos(title) {
  const browser = await puppeteer.launch();
  let results = await youtube.scrape_youtube(browser, title.name);
  await browser.close();
  return results
}