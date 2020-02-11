const fs = require('fs');
const request = require('request');
const config = require('./config');

const createFolder = (name, basePath = null) => {
  const dir = basePath ?  `${basePath}/${name}` : `./${config.localFolderDownload}/${name}`;

  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }

  return {
    dir
  }
}

const saveImage = (url, folder) => {
  const fileName = `${new Date().getTime()}-${url.split('/').pop().split('#')[0].split('?')[0]}`;
  const filePathToSave = `${folder.dir}/${fileName}`;

  request(url)
    .pipe(fs.createWriteStream(filePathToSave))
    .on('close', () => console.log(`${fileName} saved`));
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function autoScroll(page){
  await page.evaluate(async () => {
      await new Promise((resolve, reject) => {
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

module.exports = {
  createFolder,
  saveImage,
  sleep,
  autoScroll
}