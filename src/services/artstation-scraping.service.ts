import { launch } from 'puppeteer';
import { saveImage, sleep, createArtistFolder, autoScroll } from '../utils';
import { Config } from '../config';

export interface ImageState {
  finish: boolean;
  log: string;
  imagePath?: string;
  imageName?: string;
}

export interface ScrapingProcessOptions {
  updateCallback?: (resp: ImageState) => Promise<void>;
  artistId: string;
}

export class ArtStationScrapingService {
  // Viewport && Window size
  private width = 1366
  private height = 768
  private userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.100 Safari/537.36';
  private url = Config.url;

  constructor(private config: ScrapingProcessOptions) { }

  public async process() {
    // tslint:disable-next-line: no-console
    console.log('artist: ', this.config.artistId);

    const browser = await launch({
      headless: true,
      defaultViewport: null,
      args: [
        `--window-size=${ this.width },${ this.height }`,
        '--no-sandbox',
        '--disable-setuid-sandbox'
      ],
    });

    const page = await browser.newPage();

    await page.setUserAgent(this.userAgent);

    await page.goto(`${this.url}/${this.config.artistId}`, {
      waitUntil: 'networkidle0',
    });

    await autoScroll(page);

    const imageThumbs = await page.$$('user-projects:not(.ng-hide) .project-image');

    const folder = createArtistFolder(this.config.artistId);

    // tslint:disable-next-line: no-console
    console.log(imageThumbs.length);

    const imageTab = await browser.newPage();

    for(const imageThumb of imageThumbs) {
    // for (let i = 0; i < imageThumbs.length; i++) {
      // const imageThumb = imageThumbs[i];
      const href = await imageThumb.getProperty('href');

      await imageTab.setUserAgent(this.userAgent);
      await imageTab.goto((await href.jsonValue()) as string);

      const anchorsSelector = '.asset-actions a:first-child';
      await imageTab.waitForSelector(anchorsSelector);
      const anchors = await imageTab.$$(anchorsSelector);

      for(const anchor of anchors) {

        const anchorHref = await anchor.getProperty('href');
        const anchorHrefValue = await anchorHref.jsonValue() as string;

        // Waiting for each download (0s - 5s)
        const waitTime = Math.floor(Math.random() * Math.floor(5000));
        await sleep(waitTime);

        const response = await saveImage(anchorHrefValue, folder);
        await this.imageSaved(response.fileName, response.relativeFilePath);
      }
    }

    await browser.close();

    await this.processFinished();
  }

  private async imageSaved(imageName: string, imagePath: string) {
    if (this.config.updateCallback) {
      // tslint:disable-next-line: no-console
      console.log(`Image ${imageName} saved`)
      await this.config.updateCallback({log: `Image ${imageName} saved`, finish: false, imagePath, imageName})
    }
  }

  private async processFinished() {
    if (this.config.updateCallback) {
      await this.config.updateCallback({log: 'Process finished', finish: true});
    }
  }
}