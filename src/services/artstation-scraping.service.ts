import { launch, Browser, Page } from 'puppeteer';
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
  private imagePathsSelector = 'user-projects:not(.ng-hide) .project-image';

  constructor(private config: ScrapingProcessOptions) { }

  public async process() {
    const browser = await this.initBrowser();

    const page = await this.newPage(browser);

    await page.goto(`${this.url}/${this.config.artistId}`, {
      waitUntil: 'networkidle0',
    });

    await autoScroll(page);

    const imageThumbs = await page.$$(this.imagePathsSelector);

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

  async getImageUrls(): Promise<string[]> {
    // tslint:disable-next-line: no-console
    console.log('getImageUrls')

    const results: string[] = [];
    const browser = await this.initBrowser();

    const page = await this.newPage(browser);

    await page.goto(`${this.url}/${this.config.artistId}`, {
      waitUntil: 'networkidle0',
    });

    await autoScroll(page);

    const imageThumbs = await page.$$(this.imagePathsSelector);

    for(const imageThumb of imageThumbs) {
      const href = await imageThumb.getProperty('href');
      const anchorHrefValue = (await href.jsonValue()) as string;

      results.push(anchorHrefValue);
    }

    // tslint:disable-next-line: no-console
    console.log('getImageUrls urls: '+ results.length)

    await browser.close();

    return Promise.resolve(results);
  }

  async getImagesFromPages(urls: string[]) {
    // tslint:disable-next-line: no-console
    console.log('getImagesFromPages')
    const browser = await this.initBrowser();

    const page = await this.newPage(browser);

    const folder = createArtistFolder(this.config.artistId);

    for(const url of urls) {
      await page.goto(url);

      const anchorsSelector = '.asset-actions a:first-child';
      await page.waitForSelector(anchorsSelector);
      const anchors = await page.$$(anchorsSelector);

      for(const anchor of anchors) {

        const anchorHref = await anchor.getProperty('href');
        const anchorHrefValue = await anchorHref.jsonValue() as string;

        // Waiting for each download (0s - 5s)
        const waitTime = Math.floor(Math.random() * Math.floor(5000));
        await sleep(waitTime);

        const response = await saveImage(anchorHrefValue, folder);
        await this.imageSaved(response.fileName, response.relativeFilePath);
      }
    };

    // tslint:disable-next-line: no-console
    console.log('getImagesFromPages: ' + urls.length)

    await browser.close();

    await this.processFinished();
  }

  private async initBrowser(): Promise<Browser> {
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

    return Promise.resolve(browser);
  }

  private async newPage(browser: Browser): Promise<Page> {
    const page = await browser.newPage();

    await page.setUserAgent(this.userAgent);

    return Promise.resolve(page);
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