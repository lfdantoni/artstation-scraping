"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_1 = require("puppeteer");
const utils_1 = require("../utils");
const config_1 = require("../config");
class ArtStationScrapingService {
    constructor(config) {
        this.config = config;
        // Viewport && Window size
        this.width = 1366;
        this.height = 768;
        this.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.100 Safari/537.36';
        this.url = config_1.Config.url;
    }
    async process() {
        // tslint:disable-next-line: no-console
        console.log('artist: ', this.config.artistId);
        const browser = await puppeteer_1.launch({
            headless: true,
            defaultViewport: null,
            args: [
                `--window-size=${this.width},${this.height}`,
                '--no-sandbox',
                '--disable-setuid-sandbox'
            ],
        });
        const page = await browser.newPage();
        await page.setUserAgent(this.userAgent);
        await page.goto(`${this.url}/${this.config.artistId}`, {
            waitUntil: 'networkidle0',
        });
        await utils_1.autoScroll(page);
        const imageThumbs = await page.$$('user-projects:not(.ng-hide) .project-image');
        const folder = utils_1.createArtistFolder(this.config.artistId);
        // tslint:disable-next-line: no-console
        console.log(imageThumbs.length);
        const imageTab = await browser.newPage();
        for (const imageThumb of imageThumbs) {
            // for (let i = 0; i < imageThumbs.length; i++) {
            // const imageThumb = imageThumbs[i];
            const href = await imageThumb.getProperty('href');
            await imageTab.setUserAgent(this.userAgent);
            await imageTab.goto((await href.jsonValue()));
            const anchorsSelector = '.asset-actions a:first-child';
            await imageTab.waitForSelector(anchorsSelector);
            const anchors = await imageTab.$$(anchorsSelector);
            for (const anchor of anchors) {
                const anchorHref = await anchor.getProperty('href');
                const anchorHrefValue = await anchorHref.jsonValue();
                // Waiting for each download (0s - 5s)
                const waitTime = Math.floor(Math.random() * Math.floor(5000));
                await utils_1.sleep(waitTime);
                const response = await utils_1.saveImage(anchorHrefValue, folder);
                await this.imageSaved(response.fileName, response.relativeFilePath);
            }
        }
        await browser.close();
        await this.processFinished();
    }
    async imageSaved(imageName, imagePath) {
        if (this.config.updateCallback) {
            // tslint:disable-next-line: no-console
            console.log(`Image ${imageName} saved`);
            await this.config.updateCallback({ log: `Image ${imageName} saved`, finish: false, imagePath, imageName });
        }
    }
    async processFinished() {
        if (this.config.updateCallback) {
            await this.config.updateCallback({ log: 'Process finished', finish: true });
        }
    }
}
exports.ArtStationScrapingService = ArtStationScrapingService;
