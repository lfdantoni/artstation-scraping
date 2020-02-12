import { launch} from 'puppeteer';
import {Config} from './config';
import {autoScroll, createFolder, sleep, saveImage} from './utils';


(async () => {
  // Viewport && Window size
  const width = 1366
  const height = 768
  const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.100 Safari/537.36';
  const artist = process.env.ARTIST || '';

  console.log('artist: ', artist);

  const browser = await launch({
    headless: true,
    defaultViewport: null,
    args: [
      `--window-size=${ width },${ height }`
    ],
  });

  const page = await browser.newPage();

  await page.setUserAgent(userAgent);

  await page.goto(`${Config.url}/${artist}`, {
    waitUntil: 'networkidle0',
  });

  await autoScroll(page);

  const imageThumbs = await page.$$('user-projects:not(.ng-hide) .project-image');

  const folder = createFolder(artist);
  
  console.log(imageThumbs.length);

  const imageTab = await browser.newPage();

  for (let i = 0; i < imageThumbs.length; i++) {
    const imageThumb = imageThumbs[i];
    const href = await imageThumb.getProperty('href');

    await imageTab.setUserAgent(userAgent);
    await imageTab.goto((await href.jsonValue()) as string);

    // await imageTab.waitForNavigation({ waitUntil: 'networkidle0' });
    
    // const anchors = await imageTab.$$('.asset-actions a:first-child');

    const anchorsSelector = '.asset-actions a:first-child';
    await imageTab.waitForSelector(anchorsSelector);
    const anchors = await imageTab.$$(anchorsSelector);

    for (let j = 0; j < anchors.length; j++) {
      const anchor = anchors[j];
      const anchorHref = await anchor.getProperty('href');
      const anchorHrefValue = await anchorHref.jsonValue() as string;

      // Waiting for each download (0s - 5s)
      const waitTime = Math.floor(Math.random() * Math.floor(5000));
      await sleep(waitTime);

      saveImage(anchorHrefValue, folder);
    }
  }

  await browser.close();
})();