import express from 'express';
import {downloadGallery, ImageState} from './index'
import {join} from 'path';

const app = express()
const port = process.env.PORT || 5000
app.use('/downloads', express.static(join(__dirname, '../downloads')));

app.get('/process/:artist',
  async (req, res) =>{
    res.write(`<html><head></head><body>`);
    res.write("Processing...<br>");

    await downloadGallery(req.params.artist, (state: ImageState) => {
      if (state.finish) {
        console.log('downloadGallery: ', state.log);
        res.write(`<div>${state.log}</div>`);
        return;
      }

      console.log('downloadGallery: ', state.log);
      res.write(`<a target="_blank" href="../${state.imagePath}"><img src="../${state.imagePath}" style="height: 50%"></a>`);
    });

    res.write(`Finish!</body></html>`);
    res.end();
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`)); 
