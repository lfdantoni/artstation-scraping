import { Page } from "puppeteer";
import {existsSync, mkdirSync, createWriteStream} from 'fs';
import request from 'request';
import {Config} from './config';
import {join} from 'path';
import {create} from 'archiver';

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

export const createZip = (folderPath: string): Promise<string> => {
  console.log('createZip: ', folderPath)
  return new Promise(async (resolve, reject) => {
    const relativeZipPath = `${Config.localFolderDownload}/${new Date().getTime()}-${folderPath.replace(/\//g, "-")}.zip`;
    const output = createWriteStream(__dirname + `/${relativeZipPath}`);
    const archive = create('zip', {
      zlib: { level: 9 } // Sets the compression level.
    });

    output.on('close', function() {
      console.log(archive.pointer() + ' total bytes');
      console.log('archiver has been finalized and the output file descriptor has closed.');
      resolve(relativeZipPath);
    });

    archive.on('error', function(err) {
      reject(err)
    });

    archive.pipe(output);

    archive.directory(`${__dirname}/${folderPath}/`, false);

    await archive.finalize();
  })
}