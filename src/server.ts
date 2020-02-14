import express from 'express';
import {downloadGallery, ImageState} from './index'
import {join} from 'path';
import {Config} from './config';

const app = express()
const port = process.env.PORT || 5000
app.use('/downloads', express.static(join(__dirname, Config.localFolderDownload)));

app.get('/process/:artist',
  async (req, res) =>{
    const hostname = req.headers.host;
    res.write(`<html><head></head><body>`);
    res.write("Processing...<br>");

    await downloadGallery(req.params.artist, (state: ImageState) => {
      if (state.finish) {
        console.log('downloadGallery: ', state.log);
        res.write(`<div>${state.log}</div>`);
        return;
      }

      console.log('downloadGallery: ', state.log);
      const imageUrl = `${req.protocol}://${hostname}/${state.imagePath}`;
      res.write(`<a target="_blank" href="${imageUrl}"><img src="${imageUrl}" style="height: 50%"></a>`);
    });

    res.write(`Finish!</body></html>`);
    res.end();
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`)); 
