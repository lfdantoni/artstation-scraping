"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_1 = require("puppeteer");
const config_1 = require("./config");
const utils_1 = require("./utils");
const downloadGallery = async (artist, updateCallback) => {
    const imageSaved = (imageName, imagePath) => {
        if (updateCallback) {
            console.log(`Image ${imageName} saved`);
            updateCallback({ log: `Image ${imageName} saved`, finish: false, imagePath });
        }
    };
    // Viewport && Window size
    const width = 1366;
    const height = 768;
    const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.100 Safari/537.36';
    console.log('artist: ', artist);
    const browser = await puppeteer_1.launch({
        headless: true,
        defaultViewport: null,
        args: [
            `--window-size=${width},${height}`,
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ],
    });
    const page = await browser.newPage();
    await page.setUserAgent(userAgent);
    await page.goto(`${config_1.Config.url}/${artist}`, {
        waitUntil: 'networkidle0',
    });
    await utils_1.autoScroll(page);
    const imageThumbs = await page.$$('user-projects:not(.ng-hide) .project-image');
    const folder = utils_1.createArtistFolder(artist);
    console.log(imageThumbs.length);
    const imageTab = await browser.newPage();
    for (let i = 0; i < imageThumbs.length; i++) {
        const imageThumb = imageThumbs[i];
        const href = await imageThumb.getProperty('href');
        await imageTab.setUserAgent(userAgent);
        await imageTab.goto((await href.jsonValue()));
        const anchorsSelector = '.asset-actions a:first-child';
        await imageTab.waitForSelector(anchorsSelector);
        const anchors = await imageTab.$$(anchorsSelector);
        for (let j = 0; j < anchors.length; j++) {
            const anchor = anchors[j];
            const anchorHref = await anchor.getProperty('href');
            const anchorHrefValue = await anchorHref.jsonValue();
            // Waiting for each download (0s - 5s)
            const waitTime = Math.floor(Math.random() * Math.floor(5000));
            await utils_1.sleep(waitTime);
            const response = await utils_1.saveImage(anchorHrefValue, folder);
            imageSaved(response.fileName, response.relativeFilePath);
        }
    }
    await browser.close();
    updateCallback({ log: 'Process finished', finish: true });
};
exports.downloadGallery = downloadGallery;
if (process.env.ARTIST) {
    downloadGallery(process.env.ARTIST);
}
