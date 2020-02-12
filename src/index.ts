import { launch } from 'puppeteer';
import {Config} from './config';
import {autoScroll, createFolder, sleep, saveImage} from './utils';


(async () => {
  // Viewport && Window size
  const width = 1366
  const height = 768
  const artist = 'yuanyuan88416';

  const browser = await launch({
    headless: false,
    defaultViewport: null,
    args: [
      `--window-size=${ width },${ height }`
    ],
  });

  const page = await browser.newPage();
  await page.goto(`${Config.url}/${artist}`);

  await autoScroll(page);

  const imageThumbs = await page.$$('user-projects:not(.ng-hide) .project-image');

  const folder = createFolder(artist);
  
  console.log(imageThumbs.length);

  const imageTab = await browser.newPage();

  for (let i = 0; i < imageThumbs.length; i++) {
    const imageThumb = imageThumbs[i];

    const href = await imageThumb.getProperty('href');
    await imageTab.goto((await href.jsonValue()) as string);

    const anchors = await imageTab.$$('.asset-actions a:first-child');

    for (let j = 0; j < anchors.length; j++) {
      const anchor = anchors[j];
      const anchorHref = await anchor.getProperty('href');
      
      // Waiting for each download (0s - 5s)
      const waitTime = Math.floor(Math.random() * Math.floor(5000));
      await sleep(waitTime);

      saveImage(await anchorHref.jsonValue() as string, folder);
    }
  }

  await browser.close();
})();