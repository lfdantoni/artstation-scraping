import express from 'express';
import {join} from 'path';
import {Config} from './config';
import processRoute from './routes/process.route';
import authorizeRoute from './routes/authorize.route';

require('dotenv').config();

const app = express()
const port = process.env.PORT || 5000
app.use('/downloads', express.static(join(__dirname, Config.localFolderDownload)));
app.use('/assets', express.static(join(__dirname, Config.assetsFolder)));

app.use(express.json());

app.use(processRoute.path, processRoute.router);
app.use(authorizeRoute.path, authorizeRoute.router);
// app.get('/process/:artist',
//   async (req, res) =>{
//     const hostname = req.headers.host;
//     res.write(`<html><head></head><body>`);
//     res.write("Processing...<br>");

//     await downloadGallery(req.params.artist, (state: ImageState) => {
//       if (state.finish) {
//         console.log('downloadGallery: ', state.log);
//         res.write(`<div>${state.log}</div>`);
//         return;
//       }

//       console.log('downloadGallery: ', state.log);
//       const imageUrl = `${req.protocol}://${hostname}/${state.imagePath}`;
//       res.write(`<a target="_blank" href="${imageUrl}"><img src="${imageUrl}" style="height: 50%"></a>`);
//     });

//     const zipPath = await createZip(`${Config.localFolderDownload}/${req.params.artist}`);
//     const sipUrl = `${req.protocol}://${hostname}/${zipPath}`;
//     res.write(`<a target="_blank" href="${sipUrl}">ZIP</a><br>`);

//     res.write(`Finish!</body></html>`);
//     res.end();
// })

// tslint:disable-next-line: no-console
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
