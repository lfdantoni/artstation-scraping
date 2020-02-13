"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const request_1 = __importDefault(require("request"));
const config_1 = require("./config");
exports.createFolder = (name, basePath = null) => {
    const downloadPath = basePath || config_1.Config.localFolderDownload;
    const dir = `./${downloadPath}/${name}`;
    if (!fs_1.existsSync(downloadPath)) {
        fs_1.mkdirSync(downloadPath);
    }
    if (!fs_1.existsSync(dir)) {
        fs_1.mkdirSync(dir);
    }
    return {
        dir
    };
};
exports.saveImage = (url, folder) => {
    const fileName = `${new Date().getTime()}-${url.split('/').pop().split('#')[0].split('?')[0]}`;
    const filePathToSave = `${folder.dir}/${fileName}`;
    return new Promise((resolve) => {
        request_1.default(url)
            .pipe(fs_1.createWriteStream(filePathToSave))
            .on('close', () => {
            resolve({ fileName, filePathToSave });
        });
    });
};
exports.sleep = function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
};
exports.autoScroll = async (page) => {
    await page.evaluate(async () => {
        await new Promise(resolve => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
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
