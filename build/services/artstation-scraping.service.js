// import { launch } from "puppeteer";
// export interface ScrapingProcessOptions {
//   updateCallback?: Function;
//   artistId: string;
// }
// export class ArtStationScrapingService {
//   // Viewport && Window size
//   private width = 1366
//   private height = 768
//   private userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.100 Safari/537.36';
//   constructor(private config: ScrapingProcessOptions) { }
//   public async process() {
//     console.log('artist: ', this.config.artistId);
//     const browser = await launch({
//       headless: true,
//       defaultViewport: null,
//       args: [
//         `--window-size=${ width },${ height }`,
//         '--no-sandbox',
//         '--disable-setuid-sandbox'
//       ],
//     });
//     const page = await browser.newPage();
//     await page.setUserAgent(userAgent);
//     await page.goto(`${Config.url}/${artist}`, {
//       waitUntil: 'networkidle0',
//     });
//     await autoScroll(page);
//     const imageThumbs = await page.$$('user-projects:not(.ng-hide) .project-image');
//     const folder = createArtistFolder(artist);
//     console.log(imageThumbs.length);
//     const imageTab = await browser.newPage();
//     for (let i = 0; i < imageThumbs.length; i++) {
//       const imageThumb = imageThumbs[i];
//       const href = await imageThumb.getProperty('href');
//       await imageTab.setUserAgent(userAgent);
//       await imageTab.goto((await href.jsonValue()) as string);
//       const anchorsSelector = '.asset-actions a:first-child';
//       await imageTab.waitForSelector(anchorsSelector);
//       const anchors = await imageTab.$$(anchorsSelector);
//       for (let j = 0; j < anchors.length; j++) {
//         const anchor = anchors[j];
//         const anchorHref = await anchor.getProperty('href');
//         const anchorHrefValue = await anchorHref.jsonValue() as string;
//         // Waiting for each download (0s - 5s)
//         const waitTime = Math.floor(Math.random() * Math.floor(5000));
//         await sleep(waitTime);
//         const response = await saveImage(anchorHrefValue, folder);
//         imageSaved(response.fileName, response.relativeFilePath);
//       }
//     }
//     await browser.close();
//     this.processFinished();
//   }
//   private imageSaved(imageName: string, imagePath: string) {
//     if (this.config.updateCallback) {
//       console.log(`Image ${imageName} saved`)
//       this.config.updateCallback({log: `Image ${imageName} saved`, finish: false, imagePath})
//     }
//   }
//   private processFinished() {
//     if (this.config.updateCallback) {
//       this.config.updateCallback({log: 'Process finished', finish: true});
//     }
//   }
// }
