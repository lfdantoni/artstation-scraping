import { launch} from 'puppeteer';
import {Config} from './config';
import {autoScroll, createFolder, sleep, saveImage} from './utils';

export interface ImageState {
  finish: boolean;
  log: string;
  imagePath?: string;
}

const downloadGallery = async (artist: string, updateCallback?: (state: ImageState) => void) => {

  const imageSaved = (imageName: string, imagePath: string) => {
    if (updateCallback) {
      console.log(`Image ${imageName} saved`)
      updateCallback({log: `Image ${imageName} saved`, finish: false, imagePath})
    }
  }
  // Viewport && Window size
  const width = 1366
  const height = 768
  const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.100 Safari/537.36';

  console.log('artist: ', artist);

  const browser = await launch({
    headless: true,
    defaultViewport: null,
    args: [
      `--window-size=${ width },${ height }`,
      '--no-sandbox',
      '--disable-setuid-sandbox'
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

  // for (let i = 0; i < imageThumbs.length; i++) {
  for (let i = 0; i < 3; i++) {
    const imageThumb = imageThumbs[i];
    const href = await imageThumb.getProperty('href');

    await imageTab.setUserAgent(userAgent);
    await imageTab.goto((await href.jsonValue()) as string);

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

      const response = await saveImage(anchorHrefValue, folder);
      imageSaved(response.fileName, response.filePathToSave);
    }
  }

  await browser.close();

  updateCallback({log: 'Process finished', finish: true});
}

if(process.env.ARTIST) {
  downloadGallery(process.env.ARTIST);
}

export {
  downloadGallery
}
