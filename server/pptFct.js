const puppeteer = require('puppeteer');
const youtube = require('./youtube');

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

async function getMusics(url) {

  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();
  await setHeaders(page);

  let datas = {}
  datas.musics = []

  await page.goto(url);

  await page.waitForSelector('.a12b67e576d73f97c44f1f37026223c4-scss');
  await page.waitForSelector('.bc1fe098cc33981dc67049628a2cac6b-scss ._8ea0b892e971e6b90a252247c160b4f4-scss div');
  await page.waitForSelector('.bc1fe098cc33981dc67049628a2cac6b-scss ._8ea0b892e971e6b90a252247c160b4f4-scss span a');

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

};

async function getYoutubeVideos(title) {
  const browser = await puppeteer.launch();
  let results = await youtube.scrape_youtube(browser, title.name);
  await browser.close();
  return results
}