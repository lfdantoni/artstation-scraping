"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const request_1 = __importDefault(require("request"));
const config_1 = require("./config");
const path_1 = require("path");
const archiver_1 = require("archiver");
exports.createArtistFolder = (name, downloadPath = null) => {
    const downloadFolderName = downloadPath || config_1.Config.localFolderDownload;
    const artistPath = path_1.join(__dirname, downloadFolderName, name);
    const downloadFolderPath = path_1.join(__dirname, downloadFolderName);
    if (!fs_1.existsSync(downloadFolderPath)) {
        fs_1.mkdirSync(downloadFolderPath);
    }
    if (!fs_1.existsSync(artistPath)) {
        fs_1.mkdirSync(artistPath);
    }
    return {
        relativeArtistPath: `${downloadFolderName}/${name}`
    };
};
exports.saveImage = (url, folder) => {
    const fileName = `${new Date().getTime()}-${url.split('/').pop().split('#')[0].split('?')[0]}`;
    const relativeFilePath = `${folder.relativeArtistPath}/${fileName}`;
    const filePathToSave = path_1.join(__dirname, relativeFilePath);
    return new Promise((resolve) => {
        request_1.default(url)
            .pipe(fs_1.createWriteStream(filePathToSave))
            .on('close', () => {
            resolve({ fileName, relativeFilePath });
        });
    });
};
exports.sleep = (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
};
exports.autoScroll = async (page) => {
    await page.evaluate(async () => {
        await new Promise(resolve => {
            let totalHeight = 0;
            const distance = 100;
            const timer = setInterval(() => {
                const scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;
                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
};
exports.createZip = (folderPath) => {
    // tslint:disable-next-line: no-console
    console.log('createZip: ', folderPath);
    return new Promise(async (resolve, reject) => {
        const relativeZipPath = `${config_1.Config.localFolderDownload}/${new Date().getTime()}-${folderPath.replace(/\//g, '-')}.zip`;
        const output = fs_1.createWriteStream(__dirname + `/${relativeZipPath}`);
        const archive = archiver_1.create('zip', {
            zlib: { level: 9 } // Sets the compression level.
        });
        output.on('close', () => {
            // tslint:disable-next-line: no-console
            console.log(archive.pointer() + ' total bytes');
            // tslint:disable-next-line: no-console
            console.log('archiver has been finalized and the output file descriptor has closed.');
            resolve(relativeZipPath);
        });
        archive.on('error', (err) => {
            reject(err);
        });
        archive.pipe(output);
        archive.directory(`${__dirname}/${folderPath}/`, false);
        await archive.finalize();
    });
};
