const puppeteer = require('puppeteer');
const config = require('./config');
const utils = require('./utils');

(async () => {
  // Viewport && Window size
  const width = 1366
  const height = 768
  const artist = 'dcwj';

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: [
      `--window-size=${ width },${ height }`
    ],
  });

  const page = await browser.newPage();
  await page.goto(`${config.url}/${artist}`);

  const imageThumbs = await page.$$('user-projects:not(.ng-hide) .project-image');

  const folder = utils.createFolder(artist);
  
  console.log(imageThumbs.length);

  const imageTab = await browser.newPage();

  for (let i = 0; i < imageThumbs.length; i++) {
    const imageThumb = imageThumbs[i];

    const href = await imageThumb.getProperty('href');
    await imageTab.goto(await href.jsonValue());

    const anchors = await imageTab.$$('.asset-actions a:first-child');

    for (let j = 0; j < anchors.length; j++) {
      const anchor = anchors[j];
      const anchorHref = await anchor.getProperty('href');
      
      // Waiting for each download (0s - 5s)
      const waitTime = Math.floor(Math.random() * Math.floor(5000));
      await utils.sleep(waitTime);

      utils.saveImage(await anchorHref.jsonValue(), folder);
    }
  }

  // imageThumbs.forEach(async (imageThumb) => {
  //   const href = await imageThumb.getProperty('href');
  //   await imageTab.goto(await href.jsonValue());
  //   // utils.saveImage('https://cdna.artstation.com/p/assets/images/images/021/734/858/large/wl-op-13se.jpg?1572773219', folder);
  // })

  // utils.saveImage('https://cdna.artstation.com/p/assets/images/images/021/734/858/large/wl-op-13se.jpg?1572773219', folder);

  await browser.close();
})();