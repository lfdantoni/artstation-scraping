import { Page } from "puppeteer";
import {existsSync, mkdirSync, createWriteStream} from 'fs';
import request from 'request';
import {Config} from './config';
import {join} from 'path';

export interface FolderConfig {
  relativeArtistPath: string;
}

export const createArtistFolder = (name: string, downloadPath: string = null): FolderConfig => {
  const downloadFolderName = downloadPath || Config.localFolderDownload;
  const artistPath =   join(__dirname, downloadFolderName, name);
  const downloadFolderPath = join(__dirname, downloadFolderName);
  

  if (!existsSync(downloadFolderPath)){
    mkdirSync(downloadFolderPath);
  }

  if (!existsSync(artistPath)){
    mkdirSync(artistPath);
  }

  return {
    relativeArtistPath: `${downloadFolderName}/${name}`
  }
}

export const saveImage = (url: string, folder: FolderConfig): Promise<{fileName: string, relativeFilePath: string}> => {
  const fileName = `${new Date().getTime()}-${url.split('/').pop().split('#')[0].split('?')[0]}`;
  const relativeFilePath = `${folder.relativeArtistPath}/${fileName}`;
  const filePathToSave =join(__dirname, relativeFilePath);

  return new Promise((resolve) => {
    request(url)
    .pipe(createWriteStream(filePathToSave))
    .on('close', () => {
      resolve({fileName, relativeFilePath});
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
