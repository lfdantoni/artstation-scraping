"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = require("./index");
const path_1 = require("path");
const config_1 = require("./config");
const app = express_1.default();
const port = process.env.PORT || 5000;
app.use('/downloads', express_1.default.static(path_1.join(__dirname, config_1.Config.localFolderDownload)));
app.get('/process/:artist', async (req, res) => {
    const hostname = req.headers.host;
    res.write(`<html><head></head><body>`);
    res.write("Processing...<br>");
    await index_1.downloadGallery(req.params.artist, (state) => {
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
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
