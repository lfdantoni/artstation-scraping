"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = require("path");
const config_1 = require("./config");
const process_route_1 = __importDefault(require("./routes/process.route"));
const app = express_1.default();
const port = process.env.PORT || 5000;
app.use('/downloads', express_1.default.static(path_1.join(__dirname, config_1.Config.localFolderDownload)));
app.use(express_1.default.json());
app.use(process_route_1.default.path, process_route_1.default.router);
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
