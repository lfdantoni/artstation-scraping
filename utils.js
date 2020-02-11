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

module.exports = {
  createFolder,
  saveImage,
  sleep
}