module.exports = {
    scrape_youtube: scrape_youtube,
};

async function scrape_youtube(browser, keyword) {

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto('https://www.youtube.com');

    try {
        await page.waitForSelector('#yDmH0d > c-wiz > div > div > div > div.NIoIEf > div.G4njw > div.qqtRac > form > div.lssxud > div > button > div.VfPpkd-Jh9lGc')
        var buttonCookie = await page.$('#yDmH0d > c-wiz > div > div > div > div.NIoIEf > div.G4njw > div.qqtRac > form > div.lssxud > div > button > div.VfPpkd-Jh9lGc');
        await buttonCookie.click({ clickCount: 1 });
    } catch {
        console.log("youtube cookies ok")
        await page.screenshot({path: "error.png"})
    }

    await page.waitForSelector('input[id="search"]');

    // before we do anything, parse the results of the front page of youtube
   /* await page.waitForSelector('ytd-video-renderer,ytd-grid-video-renderer', { timeout: 10000 });
    let html = await page.content();
    results['__frontpage__'] = parse(html);*/
    await page.waitForSelector('ytd-rich-grid-renderer');

    const input = await page.$('input[id="search"]');
    // overwrites last text in input
    await input.click({ clickCount: 3 });
    await input.type(keyword);
    //await input.focus();
    //await page.keyboard.press("Enter");

    const search = await page.$("#search-icon-legacy")
    await search.click({ clickCount: 1 });
    // await page.waitForFunction(`document.title.indexOf('${keyword}') !== -1`, { timeout: 5000 });
    // await page.waitForSelector('ytd-video-renderer,ytd-grid-video-renderer', { timeout: 5000 });
    await page.waitForSelector('.ytd-item-section-renderer');

    const videos = await page.$$eval("#contents #video-title", el => el.map(i => i.href));
   // const time = await page.$$eval("span#text", el => el.map(i => i.innerHTML));

    //console.log(keyword)
   // console.log(time)
   // console.log(videos)
   browser.close()

  //  console.log("bef return")
    return videos;
}