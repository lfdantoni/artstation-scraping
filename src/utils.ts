import { Page } from "puppeteer";
import {existsSync, mkdirSync, createWriteStream} from 'fs';
import request from 'request';
import {Config} from './config';
import {join} from 'path';

export interface FolderConfig {
  dir: string;
}

export const createFolder = (name: string, basePath: string = null): FolderConfig => {
  // const dir = basePath ?  join(__dirname, `${basePath}/${name}`) : join(__dirname, `${Config.localFolderDownload}/${name}`);
  const downloadPath = basePath || Config.localFolderDownload;
  const dir =`./${downloadPath}/${name}`;

  if (!existsSync(downloadPath)){
    mkdirSync(downloadPath);
  }

  if (!existsSync(dir)){
    mkdirSync(dir);
  }

  return {
    dir
  }
}

export const saveImage = (url: string, folder: FolderConfig): Promise<{fileName: string, filePathToSave: string}> => {
  const fileName = `${new Date().getTime()}-${url.split('/').pop().split('#')[0].split('?')[0]}`;
  const filePathToSave = `${folder.dir}/${fileName}`;

  return new Promise((resolve) => {
    request(url)
    .pipe(createWriteStream(filePathToSave))
    .on('close', () => {
      resolve({fileName, filePathToSave});
    });
  })

}

export const sleep = function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export const autoScroll = async (page: Page) => {
  await page.evaluate(async () => {
      await new Promise(resolve => {
          var totalHeight = 0;
          var distance = 100;
          var timer = setInterval(() => {
              var scrollHeight = document.body.scrollHeight;
              window.scrollBy(0, distance);
              totalHeight += distance;

              if(totalHeight >= scrollHeight){
                  clearInterval(timer);
                  resolve();
              }
          }, 100);
      });
  });
}
